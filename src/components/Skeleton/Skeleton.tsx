import { memo, useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import {
  SKELETON_BASE_COLOR,
  SKELETON_DEFAULT_RADIUS,
  SKELETON_DURATION_MS,
  SKELETON_OPACITY_FROM,
  SKELETON_OPACITY_TO,
} from './Skeleton.styles';
import type { SkeletonProps } from './Skeleton.types';

function SkeletonInner({
  width,
  height,
  borderRadius = SKELETON_DEFAULT_RADIUS,
  style,
}: SkeletonProps) {
  const opacity = useSharedValue(SKELETON_OPACITY_FROM);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(SKELETON_OPACITY_TO, { duration: SKELETON_DURATION_MS }),
      -1,
      true,
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: SKELETON_BASE_COLOR,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

export const Skeleton = memo(SkeletonInner);
