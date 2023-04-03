import { Telegraf, Scenes } from 'telegraf';
import { getFormList } from '../../google/drive/getFormList';
import { buildFormData } from '../../google/form/formBuilder';
import { buildFormMarkup } from '../markup';

import { buildScenes } from '../scenes/form';
import type { MyContext } from '../types/main';
import { setInitialQuestionnaireState } from '../scenes/state';

export const doFormsAction = (bot: Telegraf<MyContext>, stage: Scenes.Stage<MyContext>) => async (ctx: MyContext) => {
  const forms = await getFormList(process.env.GOOGLE_FORMS_FOLDER_ID);

  forms.forEach(form => {
    bot.hears(form.title, async (actionCtx: MyContext) => {
      const formData = await buildFormData(form.id);

      setInitialQuestionnaireState(actionCtx, form.id, formData);
      const [entryStep, scenes] = buildScenes(formData, form.id);

      stage.register(...scenes);
      actionCtx.scene.enter(entryStep);
    });
  });
  const { title, markup } = buildFormMarkup(forms);
  await ctx.reply(title, markup);
};
