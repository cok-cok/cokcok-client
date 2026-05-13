import type { PressableProps, StyleProp, TextStyle, ViewStyle } from 'react-native';

import type { ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'text' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  label?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
};
