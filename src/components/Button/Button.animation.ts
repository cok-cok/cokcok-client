import { useEffect } from 'react';
import {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { BUTTON_COLORS } from './Button.styles';
import type { ButtonVariant } from './Button.types';

const PRESS_SPRING = { mass: 0.4, damping: 14, stiffness: 220 };
const STATE_TIMING = { duration: 200 };

export function useButtonPressAnimation() {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const pressIn = () => {
    scale.value = withSpring(0.96, PRESS_SPRING);
    opacity.value = withTiming(0.92, { duration: 80 });
  };

  const pressOut = () => {
    scale.value = withSpring(1, PRESS_SPRING);
    opacity.value = withTiming(1, { duration: 140 });
  };

  return { animatedStyle, pressIn, pressOut };
}

type StateArgs = {
  variant: ButtonVariant;
  disabled?: boolean | null;
};

export function useButtonStateAnimation({ variant, disabled }: StateArgs) {
  const progress = useSharedValue(disabled ? 1 : 0);
  const colors = BUTTON_COLORS[variant];

  useEffect(() => {
    progress.value = withTiming(disabled ? 1 : 0, STATE_TIMING);
  }, [disabled, progress]);

  const containerStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [colors.background.active, colors.background.disabled],
    ),
    borderColor: interpolateColor(progress.value, [0, 1], [colors.border.active, colors.border.disabled]),
    shadowOpacity: interpolate(
      progress.value,
      [0, 1],
      [colors.shadowOpacity.active, colors.shadowOpacity.disabled],
    ),
    elevation: interpolate(progress.value, [0, 1], [colors.elevation.active, colors.elevation.disabled]),
  }));

  const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(progress.value, [0, 1], [colors.label.active, colors.label.disabled]),
  }));

  return { containerStyle, labelStyle };
}
