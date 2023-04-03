import { Scenes, Context } from 'telegraf';

interface MySceneSession<T = any> extends Scenes.SceneSessionData {
  alternativeValue?: string;
}

interface MySession<T = any> extends Scenes.SceneSession<MySceneSession<T>> {
  prevMessageId?: number;
  controllerId?: number;
  questionnaireState?: Record<string, any>;
  currentForm?: string;
  currentFields?: { id: string | number; title: string }[];
}

export interface MyContext<SceneSession = any> extends Context {
  // will be available under `ctx.myContextProp`
  myContextProp: string;

  wizardData?: Record<string, string | boolean> & { isStarted?: boolean };
  prevMessageId?: number;
  // declare session type
  session: MySession<SceneSession>;
  // declare scene type
  scene: Scenes.SceneContextScene<MyContext<SceneSession>, MySceneSession<SceneSession>>;
  // declare wizard type
}
