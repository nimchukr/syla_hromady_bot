// import { isUserKicked } from '../helpers/isUserKicked';
// import { clearSessionContext } from '../sessions/clearSession';
// import { clearWizardContext } from '../wizards/clearWizard';

// import type { MyContext } from '../types';

// export const wizardController = async (ctx: MyContext, next: () => Promise<void>) => {
//   if (isUserKicked(ctx)) {
//     clearSessionContext(ctx);
//     clearWizardContext(ctx);

//     return;
//   }
//   next();
// };
