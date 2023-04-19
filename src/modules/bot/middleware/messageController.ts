import { isUserKicked } from '../helpers/isUserKicked';
import type { MyContext } from '../types/main';

export const messageController = async (ctx: MyContext, next: () => Promise<void>) => {
  if (isUserKicked(ctx)) {
    const id = ctx.message?.from?.id
    if(id) {
      delete ctx.session.userState[id];
    }
    return;
  }

  next();
};
