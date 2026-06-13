import type { LegalKey } from '../api';

export type LegalDocumentParams = {
  key: LegalKey;
  version: string;
  title: string;
  onAgree: (key: LegalKey, version: string) => void;
  isOptional?: boolean;
};

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  LegalDocument: LegalDocumentParams;
  MyRecipeList: undefined;
  RecipeForm: undefined;
  RecipeDetail: undefined;
  MyPage: undefined;
  Settings: undefined;
};
