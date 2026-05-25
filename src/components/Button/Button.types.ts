import type { GestureResponderEvent, PressableProps, StyleProp, TextStyle, ViewStyle } from 'react-native';

import type { ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'text' | 'danger' | 'normal';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonHaptic = 'light' | 'medium' | 'heavy';

export type ButtonProps = Omit<PressableProps, 'children' | 'style' | 'onPress'> & {
  label?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  loading?: boolean;
  haptic?: ButtonHaptic;
  onPress?: (event: GestureResponderEvent) => void | Promise<unknown>;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  pressedStyle?: StyleProp<ViewStyle>;
};
