import { MyContext } from '../../types/main';
import { QuestionnaireField, ChoiceField, SceneNames, QuestionnaireValue } from '../../types/questionnaire';
import { updateTextState, updateСhoiceState } from '../../scenes/state';
import { buildOptionsMenu, buildBaseMenu, CHOICE_MENU_KEYS } from '../../markup/scenes/form';
import { doInitialReplyAction } from '../common';
import { submitForm } from '../../../google/form/submitForm';
import { getUserState } from '../../scenes/state';
import { mapQuestionnaireValues } from '../../mapper/mapQuestionnaireValue';
import { logError } from '../../../../infrastructure/logger';

const handleSubmit = async (ctx: MyContext) => {
  const state = getUserState(ctx);
  if (state.currentForm) {
    try {
      const formParams = mapQuestionnaireValues(state.questionnaireState);

      await submitForm(state.currentForm, formParams);
    } catch (error) {
      logError(error, state);
      await ctx.reply('Упс, щось пішло не так. Спробуйте ще раз.');
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
    await ctx.reply('Ваша анкета успішно відправлена.');
    return handleSubmit(ctx);
  }
  await ctx.scene.enter(sceneNames.next);
};

export const textOpenAction = async (ctx: MyContext, field: QuestionnaireField) => {
  await ctx.reply(`${field.title || 'Поле без назви'}`, buildBaseMenu());
};
export const radioOpenAction = async (ctx: MyContext, field: ChoiceField) => {
  await ctx.reply('Будь ласка оберіть один з варіантів з меню нижче', buildBaseMenu());
  await ctx.reply(field.title, buildOptionsMenu(field));
};
export const checkboxOpenAction = async (ctx: MyContext, field: ChoiceField) => {
  let reply = `Будь ласка оберіть один або більше пунктів з меню нижче та натисніть "Продовжити" коли будете готові.`;

  if (field.hasOther) {
    reply += ` Якщо ви бажаєте надати альтернативний варіант, введіть відповідь текстом.`;
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
  const subtitle = `Натисніть "${CHOICE_MENU_KEYS.next}" або оберіть додаткові пункти.`;

  const text = message.replace('✅ ', '');

  if (!field.options.includes(text) && field.hasOther) {
    ctx.scene.session.alternativeValue = text;
    updateСhoiceState(ctx, field, text, { isOther: true });
    const replyText = `${text} було додано.\n${subtitle}`;
    await ctx.reply(replyText);
    return;
  }

  const remove = message.startsWith('✅ ');
  const values = updateСhoiceState(ctx, field, text, { remove });

  const replyAction = remove ? 'видалено' : 'додано';
  const replyText = `${text} було ${replyAction}.\n${subtitle}`;

  await ctx.reply(replyText, buildOptionsMenu(field, values.selectedValues));
};

const confirmCheckboxAction = async (ctx: MyContext, sceneNames: SceneNames) => {
  await finishSceneAction(ctx, sceneNames);
};

const checkboxInputAction = async (ctx: MyContext, message: string, field: ChoiceField, sceneNames: SceneNames) => {
  if (message === CHOICE_MENU_KEYS.next) {
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
