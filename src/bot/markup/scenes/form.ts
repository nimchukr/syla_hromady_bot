import { Markup } from 'telegraf';
import { ChoiceField } from '../../types/questionnaire';

export const CHOICE_MENU_KEYS = {
  next: 'Продовжити',
  back: 'Назад',
};

export const buildBaseMenu = () => {
  return Markup.keyboard([CHOICE_MENU_KEYS.back]).oneTime();
};
export const buildOptionsMenu = (field: ChoiceField, value?: string[]) => {
  const baseOptions = field.options;
  if (field.isMultiple) {
    const keyboardOptions = field.options.map(option => (value?.includes(option) ? `✅ ${option}` : option));

    return Markup.keyboard([keyboardOptions, [CHOICE_MENU_KEYS.back, CHOICE_MENU_KEYS.next]]).oneTime();
  }

  return Markup.keyboard([baseOptions, [CHOICE_MENU_KEYS.back]]);
};
