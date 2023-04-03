import { isUserKicked } from '../helpers/isUserKicked';
import { clearSessionContext } from '../sessions/clearSession';
import type { MyContext } from '../types';

export const messageController = async (ctx: MyContext, next: () => Promise<void>) => {
  if (isUserKicked(ctx)) {
    ctx.session = null;
    return;
  }

  next();
};
