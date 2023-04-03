import { isUserKicked } from '../helpers/isUserKicked';
import type { MyContext } from '../types/main';

export const messageController = async (ctx: MyContext, next: () => Promise<void>) => {
  if (isUserKicked(ctx)) {
    delete ctx.session.userState[ctx.message.from.id];
    return;
  }

  next();
};
