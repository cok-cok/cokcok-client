import { createContext, useContext } from 'react';

import type { ToastAPI } from './Toast.types';

export const ToastContext = createContext<ToastAPI | null>(null);

export function useToast(): ToastAPI {
  const api = useContext(ToastContext);
  if (!api) {
    throw new Error('useToast must be used inside <ToastProvider>');
  }
  return api;
}

let registered: ToastAPI | null = null;

export function _registerToastAPI(api: ToastAPI | null) {
  registered = api;
}

const noopId = () => '';

// 비-React 컨텍스트에서 import해서 호출하는 싱글톤. Provider 마운트 전이면 no-op.
export const toast: ToastAPI = {
  show: (input) => registered?.show(input) ?? noopId(),
  success: (m, o) => registered?.success(m, o) ?? noopId(),
  error: (m, o) => registered?.error(m, o) ?? noopId(),
  warning: (m, o) => registered?.warning(m, o) ?? noopId(),
  info: (m, o) => registered?.info(m, o) ?? noopId(),
  promise: (p, o) => (registered ? registered.promise(p, o) : p),
  dismiss: (id) => registered?.dismiss(id),
  dismissAll: () => registered?.dismissAll(),
};
