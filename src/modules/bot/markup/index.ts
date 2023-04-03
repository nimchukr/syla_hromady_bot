import { Markup } from 'telegraf';

export const FORM_BUTTON = 'Переглянути наявні форми';

export const INITIAL_KEYBOARD = {
  reply_markup: {
    inline_keyboard: [[{ text: 'Переглянути наявні форми', callback_data: 'forms' }]],
  },
};

export const MAIN_BACK_BUTTON = 'Назад до головного меню';
export const BACK_BUTTON = 'Назад';

export const getFormMarkupMenu = (formData: { id: string; title: string }[]) => {
  if (formData.length === 0) return { title: 'Немає доступних форм', markup: INITIAL_KEYBOARD };

  const title = 'Оберіть необхідну форму з наведених нижче:';
  const formItems = formData.map(data => data.title.trim());
  formItems.push(MAIN_BACK_BUTTON);

  return { title, markup: Markup.keyboard(formItems) };
};

export const buildFormMarkup = (formData: { id: string; title: string }[]) => {
  if (formData.length === 0) return { title: 'Немає доступних форм', markup: INITIAL_KEYBOARD };

  const title = 'Оберіть необхідну форму з наведених нижче:';
  const formItems = formData.map(data => data.title.trim());
  formItems.push(MAIN_BACK_BUTTON);

  return { title, markup: Markup.keyboard(formItems) };
};
