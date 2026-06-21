import type { StyleProp, ViewStyle } from 'react-native';

import type { ReactNode } from 'react';

import type { IconName } from '../Icon';

export type PageHeaderProps = {
  left?: ReactNode;
  title?: string;
  right?: ReactNode | ReactNode[];
  borderBottom?: boolean;
  shadow?: boolean;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export type PageHeaderBackButtonProps = {
  onPress: () => void;
  disabled?: boolean;
  label?: string;
};

export type PageHeaderIconButtonProps = {
  icon: IconName;
  onPress: () => void;
  label: string;
  disabled?: boolean;
};
