import { forms_v1 } from 'googleapis';
import { FormsService } from '../google/services/forms';

export type InputDataParams = {
  id: string;
  title: string;
};

const IS_OTHER_CHOICE = 'Other';

const buildChoiceField = (form: { id: number; title: string }, choiceQuestion: forms_v1.Schema$ChoiceQuestion) => {
  return {
    ...form,
    options: choiceQuestion?.options?.map(choice => (choice?.isOther ? IS_OTHER_CHOICE : choice?.value)),
    isMultiple: choiceQuestion?.type === 'CHECKBOX',
  };
};

export const buildFormData = async (formId: string) => {
  const formsService = new FormsService();
  const form = await formsService.getForm(formId);
  return form?.data.items.map(item => {
    const formItem = {
      id: parseInt(item.questionItem.question.questionId, 16),
      title: item.title,
    };

    if (item.questionItem.question.choiceQuestion) {
      return buildChoiceField(formItem, item.questionItem.question.choiceQuestion);
    }
    return formItem;
  });
};
