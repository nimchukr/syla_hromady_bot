import { Markup } from 'telegraf';

export const FORM_BUTTON = { text: 'Переглянути наявні форми', callback_data: 'forms' };

export const INITIAL_KEYBOARD = {
  reply_markup: {
    inline_keyboard: [[{ text: 'Переглянути наявні форми', callback_data: 'forms' }]],
  },
};

export const BACK_BUTTON = 'Назад';

export const getBackButtonMarkup = (buttonText = 'Назад', title = '') => {
  return {
    markup: {
      reply_markup: {
        inline_keyboard: [[{ text: buttonText, callback_data: 'back' }]],
      },
    },
    title,
  };
};

export const getFormMarkupMenu = (formData: { id: string; title: string }[]) => {
  if (formData.length === 0) return { title: 'Немає доступних форм', markup: INITIAL_KEYBOARD };

  const title = 'Оберіть необхідну форму з наведених нижче:';
  const formItems = formData.map(data => data.title.trim());
  formItems.push(BACK_BUTTON);

  return { title, markup: Markup.keyboard(formItems) };
};

export const buildFormMarkup = (formData: { id: string; title: string }[]) => {
  return getFormMarkupMenu(formData);
  if (formData.length === 0) return { title: 'Немає доступних форм', markup: INITIAL_KEYBOARD };

  const title = 'Оберіть необхідну форму:';
  const formItems = formData.map(data => [{ text: data.title, callback_data: data.id }]);
  // formItems.push(BACK_BUTTON);

  return { title, markup: { reply_markup: { inline_keyboard: formItems } } };
};
