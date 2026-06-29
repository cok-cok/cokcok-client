import { Platform } from 'react-native';

export const BOTTOM_TAB_BAR_HEIGHT = 64;
export const BOTTOM_TAB_BAR_PADDING_H = 4;
export const BOTTOM_TAB_BAR_INDICATOR_INSET_V = 4;

export const BOTTOM_TAB_BAR_COLOR = '#111827';
export const BOTTOM_TAB_BAR_INACTIVE_COLOR = '#111827';
export const BOTTOM_TAB_BAR_DISABLED_COLOR = '#9CA3AF';

export const BOTTOM_TAB_BAR_ANDROID_BG = 'rgba(235,238,242,0.9)';
export const BOTTOM_TAB_BAR_IOS_TINT_OVERLAY = 'rgba(235,238,242,0.65)';

export const BOTTOM_TAB_BAR_INDICATOR_BG =
  Platform.OS === 'android' ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.9)';
export const BOTTOM_TAB_BAR_INDICATOR_BORDER = 'rgba(255,255,255,0.85)';
