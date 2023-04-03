import { Telegraf, session, Scenes } from 'telegraf';
import { telegrafThrottler } from 'telegraf-throttler';
import { setBotAction } from './actions/setBotAction';
import { messageController } from './middleware/messageController';
import { MyContext } from './types';

export async function initBot() {
  const token = process.env.BOT_TOKEN;

  console.log('========================');
  console.log('Bot has started working');
  console.log('========================\n');

  try {
    const stage = new Scenes.Stage<MyContext>();
    const throttler = telegrafThrottler();
    const bot = new Telegraf<MyContext>(token);

    bot.use(session());
    bot.use(throttler);
    bot.use(messageController);
    bot.use(stage.middleware());

    setBotAction(bot, stage);
    await bot.launch();
  } catch (error) {
    throw error;
  }
}
