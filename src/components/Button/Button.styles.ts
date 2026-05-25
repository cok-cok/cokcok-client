import { type StyleProp, StyleSheet, type TextStyle, type ViewStyle } from 'react-native';

import type { SpinnerColor } from '../Spinner';
import type { ButtonSize, ButtonVariant } from './Button.types';

const BRAND = '#FD4C06';
const DANGER = '#DC2626';
const WHITE = '#FFFFFF';
const DISABLED_BG = '#E5E7EB';
const DISABLED_BORDER = '#D1D5DB';
const DISABLED_LABEL = '#9CA3AF';
const NORMAL_BG = '#F3F4F6';
const NORMAL_LABEL = '#111827';

export const BUTTON_SPINNER_COLOR = {
  primary: 'white',
  secondary: 'brand',
  text: 'brand',
  danger: 'white',
  normal: 'black',
} as const satisfies Record<ButtonVariant, SpinnerColor>;

export const BUTTON_ICON_SIZE = {
  sm: 16,
  md: 18,
  lg: 20,
} as const satisfies Record<ButtonSize, number>;

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  hidden: { opacity: 0 },
  spinnerOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: { alignSelf: 'stretch' },
  iconLeft: { marginLeft: -6 },
  iconRight: { marginRight: -6 },
  label: {
    fontWeight: '700',
    letterSpacing: -0.2,
    includeFontPadding: false,
  },

  v_primary: {
    backgroundColor: BRAND,
    shadowColor: BRAND,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  v_secondary: {
    borderWidth: 1.5,
    borderColor: BRAND,
  },
  v_danger: {
    backgroundColor: DANGER,
    shadowColor: DANGER,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  v_normal: {
    backgroundColor: NORMAL_BG,
  },

  label_v_primary: { color: WHITE },
  label_v_secondary: { color: BRAND },
  label_v_text: { fontWeight: '600', color: BRAND },
  label_v_danger: { color: WHITE },
  label_v_normal: { color: NORMAL_LABEL },

  d_primary: { backgroundColor: DISABLED_BG, shadowOpacity: 0, elevation: 0 },
  d_secondary: { borderColor: DISABLED_BORDER },
  d_danger: { backgroundColor: DISABLED_BG, shadowOpacity: 0, elevation: 0 },
  d_normal: { backgroundColor: DISABLED_BG },
  d_label: { color: DISABLED_LABEL },

  s_sm: { paddingVertical: 7, paddingHorizontal: 14 },
  s_md: { paddingVertical: 11, paddingHorizontal: 18 },
  s_lg: { paddingVertical: 15, paddingHorizontal: 24 },

  label_s_sm: { fontSize: 13 },
  label_s_md: { fontSize: 15 },
  label_s_lg: { fontSize: 17 },
});

const variantContainerStyles = {
  primary: styles.v_primary,
  secondary: styles.v_secondary,
  text: undefined,
  danger: styles.v_danger,
  normal: styles.v_normal,
} as const satisfies Record<ButtonVariant, ViewStyle | undefined>;

const variantLabelStyles = {
  primary: styles.label_v_primary,
  secondary: styles.label_v_secondary,
  text: styles.label_v_text,
  danger: styles.label_v_danger,
  normal: styles.label_v_normal,
} as const satisfies Record<ButtonVariant, TextStyle>;

const variantDisabledStyles = {
  primary: styles.d_primary,
  secondary: styles.d_secondary,
  text: undefined,
  danger: styles.d_danger,
  normal: styles.d_normal,
} as const satisfies Record<ButtonVariant, ViewStyle | undefined>;

const sizeContainerStyles = {
  sm: styles.s_sm,
  md: styles.s_md,
  lg: styles.s_lg,
} as const satisfies Record<ButtonSize, ViewStyle>;

const sizeLabelStyles = {
  sm: styles.label_s_sm,
  md: styles.label_s_md,
  lg: styles.label_s_lg,
} as const satisfies Record<ButtonSize, TextStyle>;

export const contentRowStyle = styles.contentRow;
export const hiddenStyle = styles.hidden;
export const spinnerOverlayStyle = styles.spinnerOverlay;
export const iconLeftStyle = styles.iconLeft;
export const iconRightStyle = styles.iconRight;

type ContainerArgs = {
  variant: ButtonVariant;
  size: ButtonSize;
  fullWidth?: boolean;
  disabled?: boolean | null;
  override?: StyleProp<ViewStyle>;
};

export function getContainerStyle({
  variant,
  size,
  fullWidth,
  disabled,
  override,
}: ContainerArgs): StyleProp<ViewStyle> {
  return [
    styles.base,
    variantContainerStyles[variant],
    sizeContainerStyles[size],
    fullWidth && styles.fullWidth,
    disabled && variantDisabledStyles[variant],
    override,
  ];
}

type LabelArgs = {
  variant: ButtonVariant;
  size: ButtonSize;
  disabled?: boolean | null;
  override?: StyleProp<TextStyle>;
};

export function getLabelStyle({ variant, size, disabled, override }: LabelArgs): StyleProp<TextStyle> {
  return [
    styles.label,
    variantLabelStyles[variant],
    sizeLabelStyles[size],
    disabled && styles.d_label,
    override,
  ];
}
