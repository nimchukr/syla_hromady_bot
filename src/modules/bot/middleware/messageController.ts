import { logInfo } from '../../../infrastructure/logger';
import { isUserKicked } from '../helpers/isUserKicked';
import type { MyContext } from '../types/main';


export const messageController = async (ctx: MyContext, next: () => Promise<void>) => {
  logInfo(`Message: ${ctx.message}`);
  logInfo(`Session: ${ctx.session}`);
  if (isUserKicked(ctx)) {
    const id = ctx.message?.from?.id
    if(id) {
      delete ctx.session.userState[id];
    }
    return;
  }

  next();
};
