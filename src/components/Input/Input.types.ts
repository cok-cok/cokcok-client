import type { StyleProp, TextInputProps, TextStyle, ViewStyle } from 'react-native';

import type { ReactNode } from 'react';

export type InputVariant = 'outline' | 'underline' | 'filled';
export type InputSize = 'sm' | 'md' | 'lg';
export type InputType = 'text' | 'email' | 'password' | 'number' | 'multiline';

export type InputProps = Omit<TextInputProps, 'style'> & {
  variant?: InputVariant;
  size?: InputSize;
  type?: InputType;
  label?: string;
  required?: boolean;
  helperText?: string;
  error?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  loading?: boolean;
  clearable?: boolean;
  trailingAction?: ReactNode;
  showCounter?: boolean;
  shakeOnError?: boolean;
  completed?: boolean;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
};
