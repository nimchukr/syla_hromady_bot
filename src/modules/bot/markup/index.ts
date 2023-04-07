import { Markup } from 'telegraf';
import { RULES, ABOUT } from './about';

export const FORM_BUTTON = 'Переглянути наявні форми 📄';
export const MAIN_BACK_BUTTON = '⬅️ Назад до головного меню';
export const BACK_BUTTON = '⬅️ Назад';

export const INITIAL_KEYBOARD = [[FORM_BUTTON], [ABOUT], [RULES]];

export const buildFormMarkup = (formData: { id: string; title: string }[]) => {
  if (formData.length === 0) return { title: 'Немає доступних форм', markup: Markup.keyboard(INITIAL_KEYBOARD) };

  const title = 'Оберіть необхідну форму з наведених нижче:';
  const formItems = formData.map(data => data.title.trim());
  formItems.push(MAIN_BACK_BUTTON);

  return { title, markup: Markup.keyboard(formItems) };
};
