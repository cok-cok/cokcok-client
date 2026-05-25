import { useEffect, useRef } from 'react';
import {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { INPUT_COLORS } from './Input.styles';
import type { InputVariant } from './Input.types';

const TIMING = { duration: 180 };
const SHAKE_TIMING = { duration: 60 };
const SHAKE_OFFSETS = [-6, 6, -4, 4, -2, 0] as const;

type StateArgs = {
  variant: InputVariant;
  focused: boolean;
  error: boolean;
  disabled: boolean;
  shakeOnError?: boolean;
};

export function useInputStateAnimation({ variant, focused, error, disabled, shakeOnError }: StateArgs) {
  const focusProgress = useSharedValue(focused ? 1 : 0);
  const errorProgress = useSharedValue(error ? 1 : 0);
  const disabledProgress = useSharedValue(disabled ? 1 : 0);
  const shakeOffset = useSharedValue(0);
  const prevErrorRef = useRef(error);

  useEffect(() => {
    focusProgress.value = withTiming(focused ? 1 : 0, TIMING);
  }, [focused, focusProgress]);

  useEffect(() => {
    errorProgress.value = withTiming(error ? 1 : 0, TIMING);
    if (shakeOnError && error && !prevErrorRef.current) {
      shakeOffset.value = withSequence(
        ...SHAKE_OFFSETS.map((offset) => withTiming(offset, SHAKE_TIMING)),
      );
    }
    prevErrorRef.current = error;
  }, [error, errorProgress, shakeOnError, shakeOffset]);

  useEffect(() => {
    disabledProgress.value = withTiming(disabled ? 1 : 0, TIMING);
  }, [disabled, disabledProgress]);

  const containerColors = INPUT_COLORS.container[variant];

  const boxStyle = useAnimatedStyle(() => {
    let bg: string = containerColors.background.default;
    bg = interpolateColor(focusProgress.value, [0, 1], [bg, containerColors.background.focus]);
    bg = interpolateColor(errorProgress.value, [0, 1], [bg, containerColors.background.error]);
    bg = interpolateColor(disabledProgress.value, [0, 1], [bg, containerColors.background.disabled]);

    let border: string = containerColors.border.default;
    border = interpolateColor(focusProgress.value, [0, 1], [border, containerColors.border.focus]);
    border = interpolateColor(errorProgress.value, [0, 1], [border, containerColors.border.error]);
    border = interpolateColor(disabledProgress.value, [0, 1], [border, containerColors.border.disabled]);

    return {
      backgroundColor: bg,
      borderColor: border,
      transform: [{ translateX: shakeOffset.value }],
    };
  });

  const labelColors = INPUT_COLORS.label;
  const labelStyle = useAnimatedStyle(() => {
    let color: string = labelColors.default;
    color = interpolateColor(focusProgress.value, [0, 1], [color, labelColors.focus]);
    color = interpolateColor(errorProgress.value, [0, 1], [color, labelColors.error]);
    color = interpolateColor(disabledProgress.value, [0, 1], [color, labelColors.disabled]);
    return { color };
  });

  const helperColors = INPUT_COLORS.helper;
  const helperStyle = useAnimatedStyle(() => {
    let color: string = helperColors.default;
    color = interpolateColor(errorProgress.value, [0, 1], [color, helperColors.error]);
    color = interpolateColor(disabledProgress.value, [0, 1], [color, helperColors.disabled]);
    return { color };
  });

  return { boxStyle, labelStyle, helperStyle };
}
