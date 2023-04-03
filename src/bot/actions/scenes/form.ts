import { MyContext } from '../../types';
import { QuestionnaireField, ChoiceField, SceneNames } from '../../types/questionnaire';
import { updateContextState } from '../../scenes/state';
import { buildOptionsMenu, buildBaseMenu, CHOICE_MENU_KEYS } from '../../markup/scenes/form';
import { doInitialReplyAction } from '../common';
import { submitForm } from '../../../api/google/helpers/submit';

const handleSubmit = async (ctx: MyContext) => {
  if (ctx.session.currentForm && ctx.session.currentFields) {
    try {
      await submitForm(ctx.session.currentForm, ctx.session.questionnaireState, ctx.session.currentFields);
    } catch (error) {
      console.log(error);
    }
  }
  await ctx.scene.leave();
  return doInitialReplyAction(ctx);
};

export const backSceneAction = async (ctx: MyContext, sceneNames: SceneNames) => {
  if (!sceneNames.back) {
    await ctx.scene.leave();
    return doInitialReplyAction(ctx);
  }
  await ctx.scene.enter(sceneNames.back);
};

export const finishSceneAction = async (ctx: MyContext, sceneNames: SceneNames, isLast: boolean) => {
  if (isLast) {
    await ctx.reply('Ваша анкета успішно відправлена.');
    return handleSubmit(ctx);
  }
  await ctx.scene.enter(sceneNames.next);
};

export const textOpenAction = async (ctx: MyContext, field: QuestionnaireField) => {
  await ctx.reply(`Будь ласка введіть ${field.title}`, buildBaseMenu());
};
export const radioOpenAction = async (ctx: MyContext, field: ChoiceField) => {
  await ctx.reply('Будь ласка оберіть один з варіантів з меню нижче', buildOptionsMenu(field));
  await ctx.reply(field.title);
};
export const checkboxOpenAction = async (ctx: MyContext, field: ChoiceField) => {
  if (!ctx.session.questionnaireState[field.id]) {
    ctx.session.questionnaireState[field.id] = [];
  }
  let reply = `Будь ласка оберіть один або більше пунктів з меню нижче та натисніть "Продовжити" коли будете готові.`;

  if (field.hasOther) {
    reply += ` Якщо ви бажаєте надати альтернативний варіант, введіть відповідь текстом.`;
  }

  await ctx.reply(reply);
  await ctx.reply(field.title, buildOptionsMenu(field));
};

export const textInputAction = async (
  ctx: MyContext,
  message: string,
  field: QuestionnaireField,
  sceneNames: SceneNames,
  isLast: boolean,
) => {
  if (message === CHOICE_MENU_KEYS.back) {
    return backSceneAction(ctx, sceneNames);
  }
  updateContextState(ctx, field, message);
  await finishSceneAction(ctx, sceneNames, isLast);
};

export const radioInputAction = async (ctx: MyContext, message: string, field: ChoiceField, sceneNames: SceneNames, isLast: boolean) => {
  if (field.options.includes(message)) {
    updateContextState(ctx, field, message);
    await finishSceneAction(ctx, sceneNames, isLast);
  }
};

const addCheckboxOptionAction = async (ctx: MyContext, message: string, field: ChoiceField) => {
  const subtitle = `Натисніть "${CHOICE_MENU_KEYS.next}" або оберіть додаткові пункти.`;

  const text = message.replace('✅ ', '');

  if (!field.options.includes(text)) {
    ctx.scene.session.alternativeValue = text;
    const replyText = `${text} було додано.\n${subtitle}`;
    await ctx.reply(replyText);
    return;
  }

  const toRemove = message.startsWith('✅ ');
  const values = updateContextState(ctx, field, text, toRemove);
  const replyAction = toRemove ? 'видалено' : 'додано';
  const replyText = `${text} було ${replyAction}.\n${subtitle}`;

  await ctx.reply(replyText, buildOptionsMenu(field, values));
};

const confirmCheckboxAction = async (ctx: MyContext, field: QuestionnaireField, sceneNames: SceneNames, isLast: boolean) => {
  const alternativeValue = ctx.scene.session.alternativeValue;
  if (alternativeValue) {
    ctx.session.questionnaireState[field.id].push(alternativeValue);
  }

  await finishSceneAction(ctx, sceneNames, isLast);
};

const checkboxInputAction = async (ctx: MyContext, message: string, field: ChoiceField, sceneNames: SceneNames, isLast: boolean) => {
  if (message === CHOICE_MENU_KEYS.next) {
    return confirmCheckboxAction(ctx, field, sceneNames, isLast);
  }
  return addCheckboxOptionAction(ctx, message, field);
};

export const choiceInputAction = async (ctx: MyContext, message: string, field: ChoiceField, sceneNames: SceneNames, isLast: boolean) => {
  if (message === CHOICE_MENU_KEYS.back) {
    return backSceneAction(ctx, sceneNames);
  }

  if (field.isMultiple) {
    return checkboxInputAction(ctx, message, field, sceneNames, isLast);
  }
  return radioInputAction(ctx, message, field, sceneNames, isLast);
};
