import { StyleSheet } from 'react-native';

export const BRAND = '#FD4C06';
export const BORDER_DEFAULT = '#D1D5DB';
export const TEXT_DEFAULT = '#111827';
export const TEXT_DISABLED = '#9CA3AF';

export const SIZES = {
  sm: { box: 18, icon: 12, radius: 5, font: 13 },
  md: { box: 22, icon: 14, radius: 6, font: 14 },
  lg: { box: 26, icon: 18, radius: 7, font: 15 },
} as const;

export type CheckboxSize = keyof typeof SIZES;

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pressed: {
    opacity: 0.7,
  },
  boxDisabled: {
    opacity: 0.5,
  },
  label: {
    flex: 1,
    fontWeight: '500',
    letterSpacing: -0.1,
  },
});
