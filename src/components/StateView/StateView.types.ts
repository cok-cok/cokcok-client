import type { ReactNode } from 'react';
import type { ViewStyle } from 'react-native';

export type StateViewProps = {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  style?: ViewStyle;
  testID?: string;
};
