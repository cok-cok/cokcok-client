import { useEffect } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { Icon } from '../Icon';

const DEFAULT_DURATION_MS = 200;

type Props = {
  checked: boolean;
  size?: number;
  color?: string;
  strokeWidth?: number;
  durationMs?: number;
};

export function AnimatedCheck({
  checked,
  size = 16,
  color = '#FFFFFF',
  strokeWidth = 3,
  durationMs = DEFAULT_DURATION_MS,
}: Props) {
  const opacity = useSharedValue(checked ? 1 : 0);

  useEffect(() => {
    opacity.value = withTiming(checked ? 1 : 0, { duration: durationMs });
  }, [checked, durationMs, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={animatedStyle}>
      <Icon name="check" size={size} color={color} strokeWidth={strokeWidth} />
    </Animated.View>
  );
}
