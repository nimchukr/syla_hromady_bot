import * as dotenv from 'dotenv';
import { initBot } from './bot/init';

dotenv.config();

const initApp = async () => {
  await initBot();
};

initApp();

process.on('unhandledRejection', error => {
  console.error('Unhandled rejection', error);
  process.exit(1);
});

process.on('uncaughtException', error => {
  console.error('Unhandled rejection', error);
  process.exit(1);
});
