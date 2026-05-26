import { StyleSheet, type ViewStyle } from 'react-native';

import type { IconName } from '../Icon';
import type { ToastType } from './Toast.types';

const SUCCESS = '#16A34A';
const ERROR = '#DC2626';
const WARNING = '#F59E0B';
const INFO = '#F97316'; // 확실한 주황 (Tailwind orange-500) — brand는 빨갛게 보여서 정보 톤에 부적합
const DEFAULT_ACCENT = '#6B7280';

const BG_LIGHT = '#FFFFFF';
const TEXT_PRIMARY = '#111827';
const TEXT_SECONDARY = '#4B5563';

export const TOAST_ACCENT_COLOR = {
  default: DEFAULT_ACCENT,
  success: SUCCESS,
  error: ERROR,
  warning: WARNING,
  info: INFO,
} as const satisfies Record<ToastType, string>;

export const TOAST_DEFAULT_ICON = {
  default: null,
  success: 'check',
  error: 'xCircle',
  warning: 'alertTriangle',
  info: 'info',
} as const satisfies Record<ToastType, IconName | null>;

export const TOAST_DEFAULT_POSITION = {
  default: 'bottom',
  success: 'bottom',
  info: 'bottom',
  warning: 'top',
  error: 'top',
} as const;

export const TOAST_STACK_OFFSET = 10;
export const TOAST_STACK_SCALE_STEP = 0.06;
export const TOAST_MAX_VISIBLE = 3;
export const TOAST_MAX_QUEUE = 10;
export const TOAST_DEFAULT_DURATION = 3500;
export const TOAST_GAP = 8;
export const TOAST_HORIZONTAL_MARGIN = 16;
export const TOAST_STACK_TRANSITION_MS = 260;

const styles = StyleSheet.create({
  hostTop: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  hostBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  toastWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: TOAST_HORIZONTAL_MARGIN,
  },
  // shadow는 wrapper에 (overflow:hidden이 iOS shadow를 자름).
  // elevation은 Toast.animation의 shadowStyle에서 opacity와 함께 보간(android 잔여 그림자 방지)
  toastShadow: {
    borderRadius: 16,
    backgroundColor: BG_LIGHT,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 22,
  },
  toastSurface: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: BG_LIGHT,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(17, 24, 39, 0.08)',
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  iconWrap: {
    width: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentColumn: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: TEXT_PRIMARY,
    letterSpacing: -0.2,
  },
  description: {
    fontSize: 13,
    fontWeight: '500',
    color: TEXT_SECONDARY,
    letterSpacing: -0.1,
  },
  message: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_PRIMARY,
    letterSpacing: -0.2,
  },
  actionWrap: {
    marginLeft: 4,
  },
  clearAllWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  clearAllButton: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: 'rgba(17, 24, 39, 0.06)',
  },
  clearAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    letterSpacing: -0.1,
  },
});

export const hostTopStyle = styles.hostTop;
export const hostBottomStyle = styles.hostBottom;
export const toastWrapperStyle = styles.toastWrapper;
export const toastShadowStyle = styles.toastShadow;
export const toastSurfaceStyle = styles.toastSurface;
export const iconWrapStyle = styles.iconWrap;
export const contentColumnStyle = styles.contentColumn;
export const titleStyle = styles.title;
export const descriptionStyle = styles.description;
export const messageStyle = styles.message;
export const actionWrapStyle = styles.actionWrap;
export const clearAllWrapStyle = styles.clearAllWrap;
export const clearAllButtonStyle = styles.clearAllButton;
export const clearAllTextStyle = styles.clearAllText;

export function getAccentBarStyle(type: ToastType): ViewStyle {
  return { ...styles.accentBar, backgroundColor: TOAST_ACCENT_COLOR[type] };
}
