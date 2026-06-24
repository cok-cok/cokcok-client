import type { NavigatorScreenParams } from '@react-navigation/native';

import type { LegalKey } from '../api';

export type LegalDocumentParams = {
  key: LegalKey;
  version: string;
  title: string;
  onAgree: (key: LegalKey, version: string) => void;
  isOptional?: boolean;
};

export type TabParamList = {
  MyRecipeList: undefined;
  MyPage: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  LegalDocument: LegalDocumentParams;
  Tabs: NavigatorScreenParams<TabParamList> | undefined;
  RecipeForm: undefined;
  RecipeDetail: undefined;
  Settings: undefined;
};
