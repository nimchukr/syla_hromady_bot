import { Scenes } from 'telegraf';
import { message } from 'telegraf/filters';
import { MyContext } from '../types';
import { QuestionnaireField, ChoiceField, SceneNames } from '../types/questionnaire';
import { textInputAction, textOpenAction, radioOpenAction, choiceInputAction, checkboxOpenAction } from '../actions/scenes/form';

const buildTextScene = (field: QuestionnaireField, sceneNames: SceneNames, isLast: boolean) => {
  const scene = new Scenes.BaseScene<MyContext>(sceneNames.current);
  scene.enter(async ctx => await textOpenAction(ctx, field));
  scene.on(message('text'), async ctx => {
    await textInputAction(ctx, ctx.message.text, field, sceneNames, isLast);
  });
  return scene;
};

const buildRadioScene = (field: ChoiceField, sceneNames: SceneNames, isLast: boolean) => {
  const scene = new Scenes.BaseScene<MyContext>(sceneNames.current);
  scene.enter(async ctx => await radioOpenAction(ctx, field));
  scene.on(message('text'), async ctx => {
    await choiceInputAction(ctx, ctx.message.text, field, sceneNames, isLast);
  });
  return scene;
};

const buildCheckboxScene = (field: ChoiceField, sceneNames: SceneNames, isLast: boolean) => {
  const scene = new Scenes.BaseScene<MyContext>(sceneNames.current);

  scene.enter(async ctx => {
    await checkboxOpenAction(ctx, field);
  });

  scene.on(message('text'), async ctx => {
    await choiceInputAction(ctx, ctx.message.text, field, sceneNames, isLast);
  });

  return scene;
};

const buildChoiceScenes = (field: ChoiceField, sceneNames: SceneNames, isLast: boolean) => {
  if (field?.isMultiple) {
    return buildCheckboxScene(field, sceneNames, isLast);
  }
  return buildRadioScene(field, sceneNames, isLast);
};

export const buildScene = (field: QuestionnaireField, sceneNames: SceneNames, isLast: boolean) => {
  if ('options' in field) {
    return buildChoiceScenes(field, sceneNames, isLast);
  }
  return buildTextScene(field, sceneNames, isLast);
};

export const buildScenes = (fields: QuestionnaireField[], formId: string) => {
  const buildSceneNamesForAGivenStep = (stepIds: string[], index: number): SceneNames => {
    return {
      current: stepIds[index],
      next: stepIds[index + 1],
      back: stepIds[index - 1],
    };
  };

  const stepIds = fields.map(f => `${formId}-${f.id.toString()}`);

  const scenes = fields.map((field, index) => {
    const sceneNames = buildSceneNamesForAGivenStep(stepIds, index);

    const scene = buildScene(field, sceneNames, index === fields.length - 1);
    return scene;
  });

  const entryStep = stepIds[0];
  return [entryStep, scenes] as const;
};
