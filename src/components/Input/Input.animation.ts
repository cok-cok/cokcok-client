import { useEffect } from 'react';
import { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { INPUT_COLORS } from './Input.styles';
import type { InputVariant } from './Input.types';

const TIMING = { duration: 180 };

type StateArgs = {
  variant: InputVariant;
  focused: boolean;
  error: boolean;
  disabled: boolean;
};

export function useInputStateAnimation({ variant, focused, error, disabled }: StateArgs) {
  const focusProgress = useSharedValue(focused ? 1 : 0);
  const errorProgress = useSharedValue(error ? 1 : 0);
  const disabledProgress = useSharedValue(disabled ? 1 : 0);

  useEffect(() => {
    focusProgress.value = withTiming(focused ? 1 : 0, TIMING);
  }, [focused, focusProgress]);

  useEffect(() => {
    errorProgress.value = withTiming(error ? 1 : 0, TIMING);
  }, [error, errorProgress]);

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

    return { backgroundColor: bg, borderColor: border };
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
