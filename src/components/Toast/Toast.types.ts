import type { ReactNode } from 'react';

import type { IconName } from '../Icon';

export type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info';
export type ToastPosition = 'top' | 'bottom';

export type ToastAction = {
  label: string;
  onPress: () => void;
};

export type ToastInput = {
  id?: string;
  type?: ToastType;
  message?: string;
  title?: string;
  description?: string;
  position?: ToastPosition;
  duration?: number;
  action?: ToastAction;
  icon?: IconName | ReactNode | null;
  onShow?: () => void;
  onDismiss?: () => void;
};

export type ToastItem = {
  id: string;
  type: ToastType;
  position: ToastPosition;
  duration: number;
  message?: string;
  title?: string;
  description?: string;
  action?: ToastAction;
  icon?: IconName | ReactNode | null;
  onShow?: () => void;
  onDismiss?: () => void;
  // 외부에서 dismiss 호출 시 exit 애니메이션 트리거용 (내부)
  _dismissing?: boolean;
  // dedup 시 동일 토스트의 timer 재시작 트리거용 (내부) — 값이 바뀌면 Toast가 감지해 timer 리셋
  _resetKey?: number;
};

export type PromiseToastOptions<T> = {
  loading: string;
  success: string | ((value: T) => string);
  error: string | ((err: unknown) => string);
};

export type ToastShortcutOptions = Omit<ToastInput, 'type' | 'message'>;

export type ToastAPI = {
  show: (input: ToastInput) => string;
  success: (message: string, options?: ToastShortcutOptions) => string;
  error: (message: string, options?: ToastShortcutOptions) => string;
  warning: (message: string, options?: ToastShortcutOptions) => string;
  info: (message: string, options?: ToastShortcutOptions) => string;
  promise: <T>(promise: Promise<T>, options: PromiseToastOptions<T>) => Promise<T>;
  dismiss: (id: string) => void;
  dismissAll: () => void;
};
