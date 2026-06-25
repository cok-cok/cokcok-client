import type { ViewStyle } from 'react-native';

import type { ReactNode } from 'react';

export type StateViewProps = {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  style?: ViewStyle;
  testID?: string;
};
