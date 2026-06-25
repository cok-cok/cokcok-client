import type { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

export type BottomTabBarIconName = ComponentProps<typeof Ionicons>['name'];

export type BottomTabBarItem = {
  key: string;
  label: string;
  iconActive: BottomTabBarIconName;
  iconInactive: BottomTabBarIconName;
  disabled?: boolean;
};

export type BottomTabBarProps = {
  items: BottomTabBarItem[];
  activeKey: string;
  onTabPress: (key: string) => void;
  testID?: string;
};
