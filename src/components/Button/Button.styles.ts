import { type StyleProp, StyleSheet, type TextStyle, type ViewStyle } from 'react-native';

import type { ButtonSize, ButtonVariant } from './Button.types';

const BRAND = '#FD4C06';
const DANGER = '#DC2626';
const WHITE = '#FFFFFF';
const TRANSPARENT = 'transparent';
const DISABLED_BG = '#E5E7EB';
const DISABLED_BORDER = '#D1D5DB';
const DISABLED_LABEL = '#9CA3AF';

export const BUTTON_COLORS = {
  primary: {
    background: { active: BRAND, disabled: DISABLED_BG },
    border: { active: TRANSPARENT, disabled: TRANSPARENT },
    label: { active: WHITE, disabled: DISABLED_LABEL },
    shadowOpacity: { active: 0.12, disabled: 0 },
    elevation: { active: 2, disabled: 0 },
  },
  secondary: {
    background: { active: TRANSPARENT, disabled: TRANSPARENT },
    border: { active: BRAND, disabled: DISABLED_BORDER },
    label: { active: BRAND, disabled: DISABLED_LABEL },
    shadowOpacity: { active: 0, disabled: 0 },
    elevation: { active: 0, disabled: 0 },
  },
  text: {
    background: { active: TRANSPARENT, disabled: TRANSPARENT },
    border: { active: TRANSPARENT, disabled: TRANSPARENT },
    label: { active: BRAND, disabled: DISABLED_LABEL },
    shadowOpacity: { active: 0, disabled: 0 },
    elevation: { active: 0, disabled: 0 },
  },
  danger: {
    background: { active: DANGER, disabled: DISABLED_BG },
    border: { active: TRANSPARENT, disabled: TRANSPARENT },
    label: { active: WHITE, disabled: DISABLED_LABEL },
    shadowOpacity: { active: 0.12, disabled: 0 },
    elevation: { active: 2, disabled: 0 },
  },
} as const satisfies Record<
  ButtonVariant,
  {
    background: { active: string; disabled: string };
    border: { active: string; disabled: string };
    label: { active: string; disabled: string };
    shadowOpacity: { active: number; disabled: number };
    elevation: { active: number; disabled: number };
  }
>;

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
    shadowColor: BRAND,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  v_secondary: {
    borderWidth: 1.5,
  },
  v_text: {},
  v_danger: {
    shadowColor: DANGER,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },

  label_v_text: { fontWeight: '600' },

  s_sm: { paddingVertical: 7, paddingHorizontal: 14 },
  s_md: { paddingVertical: 11, paddingHorizontal: 18 },
  s_lg: { paddingVertical: 15, paddingHorizontal: 24 },

  label_s_sm: { fontSize: 13 },
  label_s_md: { fontSize: 15 },
  label_s_lg: { fontSize: 17 },
});

const variantStaticStyles = {
  primary: { container: styles.v_primary },
  secondary: { container: styles.v_secondary },
  text: { container: styles.v_text, label: styles.label_v_text },
  danger: { container: styles.v_danger },
} as const satisfies Record<ButtonVariant, { container: ViewStyle; label?: TextStyle }>;

const sizeStyles = {
  sm: { container: styles.s_sm, label: styles.label_s_sm },
  md: { container: styles.s_md, label: styles.label_s_md },
  lg: { container: styles.s_lg, label: styles.label_s_lg },
} as const satisfies Record<ButtonSize, { container: ViewStyle; label: TextStyle }>;

export const contentStyle = styles.content;
export const iconLeftStyle = styles.iconLeft;
export const iconRightStyle = styles.iconRight;

type ContainerArgs = {
  variant: ButtonVariant;
  size: ButtonSize;
  fullWidth?: boolean;
  override?: StyleProp<ViewStyle>;
};

export function getContainerStyle({ variant, size, fullWidth, override }: ContainerArgs): StyleProp<ViewStyle> {
  return [
    styles.base,
    variantStaticStyles[variant].container,
    sizeStyles[size].container,
    fullWidth && styles.fullWidth,
    override,
  ];
}

type LabelArgs = {
  variant: ButtonVariant;
  size: ButtonSize;
  override?: StyleProp<TextStyle>;
};

export function getLabelStyle({ variant, size, override }: LabelArgs): StyleProp<TextStyle> {
  const variantLabel = 'label' in variantStaticStyles[variant] ? variantStaticStyles[variant].label : undefined;
  return [styles.label, variantLabel, sizeStyles[size].label, override];
}
