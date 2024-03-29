import { MyContext } from '../../types/main';
import { QuestionnaireField, ChoiceField, SceneNames, QuestionnaireValue } from '../../types/questionnaire';
import { isEmptyChoiceState, updateTextState, updateСhoiceState } from '../../scenes/state';
import { buildOptionsMenu, buildBaseMenu, CHOICE_MENU_KEYS } from '../../markup/scenes/form';
import { doInitialReplyAction } from '../common';
import { submitForm } from '../../../google/form/submitForm';
import { getUserState } from '../../scenes/state';
import { mapQuestionnaireValuesToGoogleForm } from '../../mapper/mapQuestionnaireValue';
import { logError } from '../../../../infrastructure/logger';

const SOMETHING_WENT_WRONG_REPLY = 'Упс, щось пішло не так. Спробуйте ще раз.';
const NO_NAME_FIELD = 'Поле без назви';
const RADIO_INITIAL_REPLY = 'Будь ласка оберіть один з варіантів з меню нижче';
const CHOICE_INITIAL_REPLY = 'Будь ласка оберіть один або більше пунктів з меню нижче та натисніть "Продовжити" коли будете готові.';
const CHOICE_NEXT_REPLY = `Натисніть "${CHOICE_MENU_KEYS.next}" або оберіть додаткові пункти.`;
const NO_CHOICE_SPECIFIED = 'Відповідь не була вказана.';

const CHOICE_ALTERNATIVE_REPLY = ' Якщо ви бажаєте надати альтернативний варіант, введіть відповідь текстом.';
const SUBMIT_REPLY = 'Ваш запит зареєстровано, очікуйте на зворотній зв’язок від нашого менеджера. Хорошого вам дня!';

const handleSubmit = async (ctx: MyContext) => {
  const state = getUserState(ctx);
  if (state.currentForm) {
    try {
      const formParams = mapQuestionnaireValuesToGoogleForm(state.questionnaireState);

      await submitForm(state.currentForm, formParams);
    } catch (error) {
      logError(error, state);
      await ctx.reply(SOMETHING_WENT_WRONG_REPLY);
    } finally {
      await ctx.scene.leave();
      return doInitialReplyAction(ctx);
    }
  }
};

export const backSceneAction = async (ctx: MyContext, sceneNames: SceneNames) => {
  if (!sceneNames.back) {
    await ctx.scene.leave();
    return doInitialReplyAction(ctx);
  }
  await ctx.scene.enter(sceneNames.back);
};

export const finishSceneAction = async (ctx: MyContext, sceneNames: SceneNames) => {
  if (!sceneNames.next) {
    await ctx.reply(SUBMIT_REPLY);
    return handleSubmit(ctx);
  }
  await ctx.scene.enter(sceneNames.next);
};

export const textOpenAction = async (ctx: MyContext, field: QuestionnaireField) => {
  await ctx.reply(`${field.title || NO_NAME_FIELD}`, buildBaseMenu());
};
export const radioOpenAction = async (ctx: MyContext, field: ChoiceField) => {
  await ctx.reply(RADIO_INITIAL_REPLY, buildBaseMenu());
  await ctx.reply(field.title, buildOptionsMenu(field));
};
export const checkboxOpenAction = async (ctx: MyContext, field: ChoiceField) => {
  let reply = CHOICE_INITIAL_REPLY;

  if (field.hasOther) {
    reply += CHOICE_ALTERNATIVE_REPLY;
  }

  await ctx.reply(reply);
  await ctx.reply(field.title, buildOptionsMenu(field));
};

export const textInputAction = async (ctx: MyContext, message: string, field: QuestionnaireField, sceneNames: SceneNames) => {
  if (message === CHOICE_MENU_KEYS.back) {
    return backSceneAction(ctx, sceneNames);
  }
  updateTextState(ctx, field, message);
  await finishSceneAction(ctx, sceneNames);
};

export const radioInputAction = async (ctx: MyContext, message: string, field: ChoiceField, sceneNames: SceneNames) => {
  if (field.options.includes(message)) {
    updateTextState(ctx, field, message);
    await finishSceneAction(ctx, sceneNames);
  }
};

const addCheckboxOptionAction = async (ctx: MyContext, message: string, field: ChoiceField) => {
  const text = message.replace('✅ ', '');

  if (!field.options.includes(text) && field.hasOther) {
    updateСhoiceState(ctx, field, text, { isOther: true });
    const replyText = `${text} було додано.\n${CHOICE_NEXT_REPLY}`;
    await ctx.reply(replyText);
    return;
  }

  const remove = message.startsWith('✅ ');
  const values = updateСhoiceState(ctx, field, text, { remove });

  const replyAction = remove ? 'видалено' : 'додано';
  const replyText = `${text} було ${replyAction}.\n${CHOICE_NEXT_REPLY}`;

  await ctx.reply(replyText, buildOptionsMenu(field, values.selectedValues));
};

const confirmCheckboxAction = async (ctx: MyContext, sceneNames: SceneNames) => {
  await finishSceneAction(ctx, sceneNames);
};

const checkboxInputAction = async (ctx: MyContext, message: string, field: ChoiceField, sceneNames: SceneNames) => {
  if (message === CHOICE_MENU_KEYS.next) {
    if(isEmptyChoiceState(ctx, field)) {
      updateСhoiceState(ctx, field, NO_CHOICE_SPECIFIED, { isOther: true });
    }
    return confirmCheckboxAction(ctx, sceneNames);
  }
  return addCheckboxOptionAction(ctx, message, field);
};

export const choiceInputAction = async (ctx: MyContext, message: string, field: ChoiceField, sceneNames: SceneNames) => {
  if (message === CHOICE_MENU_KEYS.back) {
    return backSceneAction(ctx, sceneNames);
  }

  if (field.isMultiple) {
    return checkboxInputAction(ctx, message, field, sceneNames);
  }
  return radioInputAction(ctx, message, field, sceneNames);
};
