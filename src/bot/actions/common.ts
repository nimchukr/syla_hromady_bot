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

export const doInitialReplyAction = async (ctx: MyContext) => {
  await ctx.reply(
    'Оберіть потрібну дію, що знаходиться нижче:',
    Markup.keyboard([[FORM_BUTTON]])
      .oneTime()
      .resize(),
  );
};
