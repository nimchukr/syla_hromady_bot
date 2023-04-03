import { MyContext } from '../types/main';

export const isUserKicked = (ctx: MyContext) => ctx.myChatMember?.new_chat_member?.status === 'kicked';
