import type { StyleProp, ViewStyle } from 'react-native';

import type { ReactNode } from 'react';

export type SegmentedOption<T extends string> = {
  value: T;
  iconInactive: ReactNode;
  iconActive: ReactNode;
  accessibilityLabel: string;
};

export type SegmentedProps<T extends string> = {
  options: readonly SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};
