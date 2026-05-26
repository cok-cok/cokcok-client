import { useEffect } from 'react';
import {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import type { ButtonVariant } from './Button.types';

const PRESS_SPRING = { mass: 0.4, damping: 14, stiffness: 220 };
const STATE_TIMING = { duration: 200 };

// variant별 active / disabled 색 매핑 — Button.styles.ts와 동기 유지 필요
const BRAND = '#FD4C06';
const DANGER = '#DC2626';
const WHITE = '#FFFFFF';
const TRANSPARENT = 'transparent';
const DISABLED_BG = '#E5E7EB';
const DISABLED_BORDER = '#D1D5DB';
const DISABLED_LABEL = '#9CA3AF';
const NORMAL_BG = '#F3F4F6';
const NORMAL_LABEL = '#111827';

type ColorTriple = { bg: string; border: string; label: string };

const VARIANT_COLORS: Record<ButtonVariant, { active: ColorTriple; disabled: ColorTriple }> = {
  primary: {
    active: { bg: BRAND, border: TRANSPARENT, label: WHITE },
    disabled: { bg: DISABLED_BG, border: TRANSPARENT, label: DISABLED_LABEL },
  },
  secondary: {
    active: { bg: TRANSPARENT, border: BRAND, label: BRAND },
    disabled: { bg: TRANSPARENT, border: DISABLED_BORDER, label: DISABLED_LABEL },
  },
  text: {
    active: { bg: TRANSPARENT, border: TRANSPARENT, label: BRAND },
    disabled: { bg: TRANSPARENT, border: TRANSPARENT, label: DISABLED_LABEL },
  },
  danger: {
    active: { bg: DANGER, border: TRANSPARENT, label: WHITE },
    disabled: { bg: DISABLED_BG, border: TRANSPARENT, label: DISABLED_LABEL },
  },
  normal: {
    active: { bg: NORMAL_BG, border: TRANSPARENT, label: NORMAL_LABEL },
    disabled: { bg: DISABLED_BG, border: TRANSPARENT, label: DISABLED_LABEL },
  },
};

export function useButtonStateAnimation({
  variant,
  disabled,
}: {
  variant: ButtonVariant;
  disabled?: boolean | null;
}) {
  const progress = useSharedValue(disabled ? 1 : 0);
  const colors = VARIANT_COLORS[variant];

  useEffect(() => {
    progress.value = withTiming(disabled ? 1 : 0, STATE_TIMING);
  }, [disabled, progress]);

  const containerStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [colors.active.bg, colors.disabled.bg]),
    borderColor: interpolateColor(progress.value, [0, 1], [colors.active.border, colors.disabled.border]),
  }));

  const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(progress.value, [0, 1], [colors.active.label, colors.disabled.label]),
  }));

  return { containerStyle, labelStyle };
}

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
