import { MyContext } from '../types/main';
import { ChoiceField, QuestionnaireField, QuestionnaireMultipleValue, QuestionnaireValue } from '../types/questionnaire';

type UpdateStateOptions = {
  remove?: boolean;
  isOther?: boolean;
};

const handleMultipleStateChange = (
  data: QuestionnaireMultipleValue,
  value: string,
  options?: UpdateStateOptions,
): QuestionnaireMultipleValue => {
  if (options?.isOther) {
    data.otherValue = value;
    return data;
  }
  if (options?.remove) {
    data.selectedValues = data.selectedValues.filter(item => item !== value);
  } else {
    data.selectedValues.push(value);
  }
  return data;
};

export const getUserState = (ctx: MyContext) => {
  if(!ctx.message?.from?.id || !ctx.session) {
    return {}
  }
  
  if (!ctx.session.userState) {
    ctx.session.userState = {};
  }
  if (!ctx.session.userState[ctx.message.from.id]) {
    ctx.session.userState[ctx.message.from.id] = {};
  }
  return ctx.session.userState[ctx.message.from.id];
};

export const getUserQuestionnaireState = (ctx: MyContext) => {
  const state = getUserState(ctx);
  if (!state?.questionnaireState) {
    state.questionnaireState = {};
  }
  return state.questionnaireState;
};

export const setInitialQuestionnaireState = (ctx: MyContext, formId: string, formData: QuestionnaireField[]) => {
  const state = getUserState(ctx);
  state.questionnaireState = {};
  state.currentForm = formId;
};

const getMultipleFieldState = (questionnaire: Record<string, QuestionnaireValue>, field: ChoiceField) => {
  if (!questionnaire[field.id]) {
    questionnaire[field.id] = { selectedValues: [] };
  }
  return questionnaire[field.id] as QuestionnaireMultipleValue;
};

export const updateTextState = (ctx: MyContext, field: QuestionnaireField, value: string) => {
  const questionnaire = getUserQuestionnaireState(ctx);

  questionnaire[field.id] = value;
  return questionnaire[field.id] as string;
};

export const updateСhoiceState = (ctx: MyContext, field: ChoiceField, value: string, options?: UpdateStateOptions) => {
  const questionnaire = getUserQuestionnaireState(ctx);

  return handleMultipleStateChange(getMultipleFieldState(questionnaire, field), value, options);
};
