import { MyContext } from '../types';
import { QuestionnaireField } from '../types/questionnaire';

const handleMultipleStateChange = (data: string[], value: string, remove?: boolean) => {
  if (remove) {
    data = data.filter(item => item !== value);
  } else {
    data.push(value);
  }
  return data;
};

export const updateContextState = (ctx: MyContext, field: QuestionnaireField, value: any, remove?: boolean) => {
  if (!ctx.session.questionnaireState) {
    ctx.session.questionnaireState = {};
  }

  if ('isMultiple' in field && field.isMultiple) {
    ctx.session.questionnaireState[field.id] = handleMultipleStateChange(ctx.session.questionnaireState[field.id], value, remove);
  } else {
    ctx.session.questionnaireState[field.id] = value;
  }
  return ctx.session.questionnaireState[field.id];
};
