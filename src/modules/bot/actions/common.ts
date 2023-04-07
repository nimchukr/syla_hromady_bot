import { Markup } from 'telegraf';
import { INITIAL_KEYBOARD } from '../markup';
import { MyContext } from '../types/main';
import { ABOUT_REPLY, RULES_REPLY } from '../content/about';

const CHOOSE_ACTION_REPLY = 'Оберіть потрібну дію, що знаходиться нижче:';

export const doRulesReply = async (ctx: MyContext) => {
  return ctx.reply(RULES_REPLY, Markup.keyboard(INITIAL_KEYBOARD));
};

export const doAboutReply = async (ctx: MyContext) => {
  return ctx.reply(ABOUT_REPLY, Markup.keyboard(INITIAL_KEYBOARD));
};

export const doInitialReplyAction = async (ctx: MyContext) => {
  await ctx.reply(CHOOSE_ACTION_REPLY, Markup.keyboard(INITIAL_KEYBOARD));
};
