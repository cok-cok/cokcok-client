import { StyleSheet, type ViewStyle } from 'react-native';

import type { SpinnerColor, SpinnerSize } from './Spinner.types';

type CircleColors = readonly [string, string, string];

export const SPINNER_COLORS = {
  brand: ['rgba(253, 76, 6, 0.7)', 'rgba(253, 76, 6, 0.85)', 'rgba(253, 76, 6, 1)'],
  white: ['rgba(255, 255, 255, 0.7)', 'rgba(255, 255, 255, 0.85)', 'rgba(255, 255, 255, 1)'],
  black: ['rgba(17, 24, 39, 0.7)', 'rgba(17, 24, 39, 0.85)', 'rgba(17, 24, 39, 1)'],
} as const satisfies Record<SpinnerColor, CircleColors>;

export const SPINNER_JUMP_HEIGHT = {
  sm: -3,
  md: -4,
  lg: -5,
} as const satisfies Record<SpinnerSize, number>;

export const SPINNER_TOTAL_WIDTH = {
  sm: 6 * 3 + 4 * 2,
  md: 8 * 3 + 5 * 2,
  lg: 10 * 3 + 6 * 2,
} as const satisfies Record<SpinnerSize, number>;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  c_sm: { width: 6, height: 6, borderRadius: 3 },
  c_md: { width: 8, height: 8, borderRadius: 4 },
  c_lg: { width: 10, height: 10, borderRadius: 5 },

  g_sm: { gap: 4 },
  g_md: { gap: 5 },
  g_lg: { gap: 6 },
});

const sizeCircleStyles = {
  sm: styles.c_sm,
  md: styles.c_md,
  lg: styles.c_lg,
} as const satisfies Record<SpinnerSize, ViewStyle>;

const sizeGapStyles = {
  sm: styles.g_sm,
  md: styles.g_md,
  lg: styles.g_lg,
} as const satisfies Record<SpinnerSize, ViewStyle>;

export function getRowStyle(size: SpinnerSize): ViewStyle[] {
  return [styles.row, sizeGapStyles[size]];
}

export function getCircleStyle(size: SpinnerSize, color: string): readonly [ViewStyle, { backgroundColor: string }] {
  return [sizeCircleStyles[size], { backgroundColor: color }];
}
