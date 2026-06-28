import type { DimensionValue, StyleProp, ViewStyle } from 'react-native';

export type SkeletonProps = {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
};
