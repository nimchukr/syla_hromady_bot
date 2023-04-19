import { Console, log } from 'console';
import fs from 'fs';

export const logger = new Console({
  stdout: fs.createWriteStream('./logs.txt', { flags: 'a' }),
  stderr: fs.createWriteStream('./errors.txt', { flags: 'a' }),
});


export const logInfo = (msg: string) => {
  let date = new Date().toLocaleString('uk-UA');
  logger.info(`Date:${date}\n${msg}n`);
}

export const logError = (error: any, data?: any) => {
  try {
    let date = new Date().toLocaleString('uk-UA');

    let msg = `Date:${date}\nError: ${error?.message}\nStack: ${error?.stack}\n`;
    if (error) {
      if (error?.response) {
        msg += `Response: ${error.response.data}\n`;
      }
      if (error?.request) {
        msg += `Request: ${error.request}\n`;
      }
      if (error?.on) {
        msg += `Request: ${error.request}\n`;
      }
      if (data) {
        try {
          msg += `Data: ${JSON.stringify(data)}\n`;
        } catch (error) {
          // do nothing
        }
      }
    }
    msg += '\n';

    logger.error(msg);
  } catch (error) {
    console.log(error);
  }
};
