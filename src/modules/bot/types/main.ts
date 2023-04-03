import { Scenes, Context } from 'telegraf';

import { QuestionnaireValue, QuestionnaireField } from './questionnaire';

interface MySceneSession<T = any> extends Scenes.SceneSessionData {
  alternativeValue?: string;
}

type UserSessionState = {
  questionnaireState?: Record<string, QuestionnaireValue>;
  currentForm?: string;
};

interface MySession<T = any> extends Scenes.SceneSession<MySceneSession<T>> {
  controllerId?: number;
  userState: Record<string, UserSessionState>;
}

export interface MyContext<SceneSession = any> extends Context {
  // declare session type
  session: MySession<SceneSession>;
  // declare scene type
  scene: Scenes.SceneContextScene<MyContext<SceneSession>, MySceneSession<SceneSession>>;
}
