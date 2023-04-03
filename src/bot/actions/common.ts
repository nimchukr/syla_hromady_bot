import { Markup } from 'telegraf';
import { INITIAL_KEYBOARD, FORM_BUTTON } from '../markup';
import { MyContext } from '../types';

export const doReply = async (ctx: MyContext) => {
  try {
    await ctx.reply('Оберіть дію:', INITIAL_KEYBOARD);
  } catch (error) {
    if (error.code !== 403) {
      throw error;
    }
  }
};

export const setInitialMenu = async (ctx: MyContext, title?: string) => {
  await ctx.reply(
    'Оберіть потрібну дію, що знаходиться нижче:',
    Markup.keyboard([[FORM_BUTTON, { text: 'Реєстраційна Форма', callback_data: 'test123' }]])
      .oneTime()
      .resize(),
  );
  await ctx.deleteMessage().catch(e => {});
};

export const doInitialReplyAction = async (ctx: MyContext) => {
  return setInitialMenu(ctx);
  try {
    await ctx.editMessageText('Оберіть дію:', INITIAL_KEYBOARD);
  } catch (error) {
    await doReply(ctx);
  }
};
