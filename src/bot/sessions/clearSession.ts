import { MyContext } from '../types';

export const clearSessionContext = (ctx: MyContext) => {
  if (ctx.session.controllerId) {
    ctx.deleteMessage(ctx.session.controllerId);
    ctx.session.controllerId = undefined;
  }
};
