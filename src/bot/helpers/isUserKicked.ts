import { MyContext } from '../types';

export const isUserKicked = (ctx: MyContext) => ctx.myChatMember?.new_chat_member?.status === 'kicked';
