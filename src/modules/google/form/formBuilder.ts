import { forms_v1 } from 'googleapis';
import { FormsService } from './forms';

export type InputDataParams = {
  id: string;
  title: string;
};

const buildChoiceField = (form: { id: number; title: string }, choiceQuestion: forms_v1.Schema$ChoiceQuestion) => {
  return {
    ...form,
    options: choiceQuestion?.options?.filter(value => !value?.isOther).map(choice => choice.value),
    isMultiple: choiceQuestion?.type === 'CHECKBOX',
    hasOther: choiceQuestion?.options.some(value => value?.isOther),
  };
};

export const buildFormData = async (formId: string) => {
  const formsService = new FormsService();
  const form = await formsService.getForm(formId);
  return form?.data.items
    .map(item => {
      const formItem = {
        id: parseInt(item.questionItem.question.questionId, 16),
        title: item.title,
      };

      if (item.questionItem.question.choiceQuestion) {
        return buildChoiceField(formItem, item.questionItem.question.choiceQuestion);
      }
      return formItem;
    })
    .filter(item => Boolean(item.title));
};
