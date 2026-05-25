import type { StyleProp, ViewStyle } from 'react-native';

export type SpinnerColor = 'brand' | 'white' | 'black';
export type SpinnerSize = 'sm' | 'md' | 'lg';

export type SpinnerProps = {
  color?: SpinnerColor;
  size?: SpinnerSize;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};
