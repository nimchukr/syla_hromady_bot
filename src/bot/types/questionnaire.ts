type TextField = {
  id: number;
  title: string;
};

export type ChoiceField = TextField & {
  options?: string[];
  isMultiple?: boolean;
  hasOther?: boolean;
};

export type SceneNames = {
  current: string;
  next?: string;
  back?: string;
};

export type QuestionnaireField = TextField | ChoiceField;
