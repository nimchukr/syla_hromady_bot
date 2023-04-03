import { Telegraf, session, Scenes } from 'telegraf';
import { telegrafThrottler } from 'telegraf-throttler';
import { setBotAction } from './actions/setBotAction';
import { messageController } from './middleware/messageController';
import { MyContext } from './types';

export async function initBot() {
  const throttler = telegrafThrottler();
  const stage = new Scenes.Stage<MyContext>();
  const token = process.env.BOT_TOKEN;
  const bot = new Telegraf<MyContext>(token);

  console.log('========================');
  console.log('Bot has started working');
  console.log('========================\n');

  try {
    bot.use(session());
    bot.use(throttler);
    bot.use(messageController);
    bot.use(stage.middleware());

    setBotAction(bot, stage);
    await bot.launch();
  } catch (error) {
    console.log(error);
    throw error;
  }
}
