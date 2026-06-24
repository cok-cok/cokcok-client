import type { SharedValue } from 'react-native-reanimated';

export type BottomBarProps = {
  activeKey: string;
  onTabPress: (key: string) => void;
  onFabPress: () => void;
  onScrollToTop: () => void;
  hideValue: SharedValue<number>;
  testID?: string;
};
