import type { StyleProp, ViewStyle } from 'react-native';

import type { IconName } from '../Icon';

export type SegmentedOption<T extends string> = {
  value: T;
  icon?: IconName;
  label?: string;
  accessibilityLabel: string;
};

export type SegmentedProps<T extends string> = {
  options: readonly SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};
