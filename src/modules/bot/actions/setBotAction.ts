import { Telegraf, Scenes } from 'telegraf';
import { doInitialReplyAction } from './common';
import { doFormsAction } from './forms';
import { MAIN_BACK_BUTTON, FORM_BUTTON } from '../markup';

import type { MyContext } from '../types/main';

export const setBotAction = (bot: Telegraf<MyContext>, stage: Scenes.Stage<MyContext>) => {
  bot.start(doInitialReplyAction);

  bot.hears(FORM_BUTTON, doFormsAction(bot, stage));
  bot.hears(MAIN_BACK_BUTTON, doInitialReplyAction);
};
