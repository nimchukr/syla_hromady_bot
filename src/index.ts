import * as dotenv from 'dotenv';
import { initBot } from './modules/bot/init';
import { logError } from './infrastructure/logger';

dotenv.config();

const initApp = async () => {
  await initBot();
};

initApp();

process.on('unhandledRejection', error => {
  console.error('Unhandled rejection', error);
  logError(error);
  process.exitCode = 1;
});

process.on('uncaughtException', error => {
  console.error('Unhandled rejection', error);
  logError(error);
  process.exitCode = 1;
});
