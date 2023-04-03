import { Telegraf, Scenes } from 'telegraf';
import { MyContext } from '../types';
import { doInitialReplyAction } from './common';
import { doFormsAction } from './forms';

export const setBotAction = (bot: Telegraf<MyContext>, stage: Scenes.Stage<MyContext>) => {
  bot.start(doInitialReplyAction);

  bot.hears('Переглянути наявні форми', doFormsAction(bot, stage));
};
