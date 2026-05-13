import { type StyleProp, StyleSheet, type TextStyle, type ViewStyle } from 'react-native';

import type { InputSize, InputVariant } from './Input.types';

const BRAND = '#FD4C06';
const DANGER = '#DC2626';
const TRANSPARENT = 'transparent';

const BORDER_DEFAULT = '#D1D5DB';
const BORDER_DISABLED = '#E5E7EB';
const BG_FILLED = '#F3F4F6';
const BG_FILLED_DISABLED = '#F9FAFB';
const LABEL_DEFAULT = '#374151';
const LABEL_DISABLED = '#9CA3AF';
const HELPER_DEFAULT = '#6B7280';
const HELPER_DISABLED = '#9CA3AF';
const TEXT_DEFAULT = '#111827';
const TEXT_DISABLED = '#9CA3AF';
const PLACEHOLDER = '#9CA3AF';
const ICON_NEUTRAL = '#6B7280';
const ICON_DISABLED = '#9CA3AF';

export const INPUT_COLORS = {
  container: {
    outline: {
      background: { default: TRANSPARENT, focus: TRANSPARENT, error: TRANSPARENT, disabled: BG_FILLED_DISABLED },
      border: { default: BORDER_DEFAULT, focus: BRAND, error: DANGER, disabled: BORDER_DISABLED },
    },
    underline: {
      background: { default: TRANSPARENT, focus: TRANSPARENT, error: TRANSPARENT, disabled: TRANSPARENT },
      border: { default: BORDER_DEFAULT, focus: BRAND, error: DANGER, disabled: BORDER_DISABLED },
    },
    filled: {
      background: { default: BG_FILLED, focus: BG_FILLED, error: BG_FILLED, disabled: BG_FILLED_DISABLED },
      border: { default: TRANSPARENT, focus: BRAND, error: DANGER, disabled: TRANSPARENT },
    },
  },
  label: { default: LABEL_DEFAULT, focus: BRAND, error: DANGER, disabled: LABEL_DISABLED },
  helper: { default: HELPER_DEFAULT, error: DANGER, disabled: HELPER_DISABLED },
} as const satisfies {
  container: Record<
    InputVariant,
    {
      background: { default: string; focus: string; error: string; disabled: string };
      border: { default: string; focus: string; error: string; disabled: string };
    }
  >;
  label: { default: string; focus: string; error: string; disabled: string };
  helper: { default: string; error: string; disabled: string };
};

export const REQUIRED_MARK_COLOR = DANGER;
export const TEXT_INPUT_COLOR = TEXT_DEFAULT;
export const TEXT_INPUT_DISABLED_COLOR = TEXT_DISABLED;
export const PLACEHOLDER_COLOR = PLACEHOLDER;
export const ICON_NEUTRAL_COLOR = ICON_NEUTRAL;
export const ICON_DISABLED_COLOR = ICON_DISABLED;
export const CURSOR_COLOR = TEXT_DEFAULT;
export const SELECTION_COLOR = TEXT_DEFAULT;

const styles = StyleSheet.create({
  container: { gap: 6 },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  multilineBox: { alignItems: 'flex-start' },
  textInput: {
    flex: 1,
    color: TEXT_DEFAULT,
    padding: 0,
    margin: 0,
    includeFontPadding: false,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
    paddingTop: 0,
  },
  label: { fontWeight: '600' },
  helper: {},

  v_outline: { borderWidth: 1.5, borderRadius: 10 },
  v_underline: { borderBottomWidth: 1.5, borderRadius: 0 },
  v_filled: { borderWidth: 1.5, borderRadius: 10 },

  s_sm: { paddingVertical: 8, paddingHorizontal: 12, minHeight: 36 },
  s_md: { paddingVertical: 10, paddingHorizontal: 14, minHeight: 44 },
  s_lg: { paddingVertical: 12, paddingHorizontal: 16, minHeight: 52 },

  textInput_sm: { fontSize: 13 },
  textInput_md: { fontSize: 15 },
  textInput_lg: { fontSize: 17 },

  label_sm: { fontSize: 12 },
  label_md: { fontSize: 13 },
  label_lg: { fontSize: 14 },

  helper_sm: { fontSize: 11 },
  helper_md: { fontSize: 12 },
  helper_lg: { fontSize: 13 },
});

const variantBoxStyles = {
  outline: styles.v_outline,
  underline: styles.v_underline,
  filled: styles.v_filled,
} as const satisfies Record<InputVariant, ViewStyle>;

const sizeBoxStyles = {
  sm: styles.s_sm,
  md: styles.s_md,
  lg: styles.s_lg,
} as const satisfies Record<InputSize, ViewStyle>;

const sizeInputStyles = {
  sm: styles.textInput_sm,
  md: styles.textInput_md,
  lg: styles.textInput_lg,
} as const satisfies Record<InputSize, TextStyle>;

const sizeLabelStyles = {
  sm: styles.label_sm,
  md: styles.label_md,
  lg: styles.label_lg,
} as const satisfies Record<InputSize, TextStyle>;

const sizeHelperStyles = {
  sm: styles.helper_sm,
  md: styles.helper_md,
  lg: styles.helper_lg,
} as const satisfies Record<InputSize, TextStyle>;

export const containerStyle = styles.container;
export const labelBaseStyle = styles.label;
export const helperBaseStyle = styles.helper;

type BoxArgs = {
  variant: InputVariant;
  size: InputSize;
  multiline?: boolean;
};

export function getBoxStyle({ variant, size, multiline }: BoxArgs): StyleProp<ViewStyle> {
  return [styles.box, sizeBoxStyles[size], variantBoxStyles[variant], multiline && styles.multilineBox];
}

type InputStyleArgs = {
  size: InputSize;
  multiline?: boolean;
  override?: StyleProp<TextStyle>;
};

export function getInputStyle({ size, multiline, override }: InputStyleArgs): StyleProp<TextStyle> {
  return [styles.textInput, sizeInputStyles[size], multiline && styles.multilineInput, override];
}

export function getLabelStyle({ size }: { size: InputSize }): StyleProp<TextStyle> {
  return [styles.label, sizeLabelStyles[size]];
}

export function getHelperStyle({ size }: { size: InputSize }): StyleProp<TextStyle> {
  return [styles.helper, sizeHelperStyles[size]];
}
