import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { TOAST_DEFAULT_DURATION, TOAST_DEFAULT_POSITION, TOAST_MAX_QUEUE } from './Toast.styles';
import type { PromiseToastOptions, ToastAPI, ToastInput, ToastItem, ToastPosition } from './Toast.types';
import { ToastHost } from './ToastHost';
import { _registerToastAPI, ToastContext } from './useToast';

const BULK_DISMISS_STAGGER_MS = 80;

let __seq = 0;
function generateId() {
  __seq += 1;
  return `toast_${__seq}`;
}

function toItem(input: ToastInput): ToastItem {
  const id = input.id ?? generateId();
  const type = input.type ?? 'default';
  return {
    id,
    type,
    position: input.position ?? TOAST_DEFAULT_POSITION[type],
    duration: input.duration ?? TOAST_DEFAULT_DURATION,
    message: input.message,
    title: input.title,
    description: input.description,
    action: input.action,
    icon: input.icon,
    onShow: input.onShow,
    onDismiss: input.onDismiss,
  };
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const itemsRef = useRef<ToastItem[]>(items);
  itemsRef.current = items;

  const markDismissing = useCallback((id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, _dismissing: true } : i)));
  }, []);

  const staggeredDismiss = useCallback(
    (filter: (i: ToastItem) => boolean) => {
      const target = itemsRef.current.filter((i) => filter(i) && !i._dismissing);
      target
        .slice()
        .reverse()
        .forEach((item, idx) => {
          if (idx === 0) markDismissing(item.id);
          else setTimeout(() => markDismissing(item.id), idx * BULK_DISMISS_STAGGER_MS);
        });
    },
    [markDismissing],
  );

  const upsert = useCallback((input: ToastInput): string => {
    const item = toItem(input);
    let resolvedId = item.id;
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === item.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = item;
        return next;
      }
      // dedup — 같은 내용 토스트가 살아있으면 새로 만들지 않고 timer만 reset (action 있으면 dedup 제외)
      if (!item.action) {
        const dupIdx = prev.findIndex(
          (i) =>
            !i._dismissing &&
            !i.action &&
            i.type === item.type &&
            i.position === item.position &&
            i.message === item.message &&
            i.title === item.title &&
            i.description === item.description,
        );
        if (dupIdx >= 0) {
          const next = [...prev];
          const existing = next[dupIdx];
          next[dupIdx] = {
            ...existing,
            duration: item.duration,
            _resetKey: (existing._resetKey ?? 0) + 1,
          };
          resolvedId = existing.id;
          return next;
        }
      }
      const next = [...prev, item];
      while (next.length > TOAST_MAX_QUEUE) {
        const oldestSamePosIdx = next.findIndex((i) => i.position === item.position);
        next.splice(oldestSamePosIdx >= 0 ? oldestSamePosIdx : 0, 1);
      }
      return next;
    });
    return resolvedId;
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const dismiss = useCallback(
    (id: string) => {
      markDismissing(id);
    },
    [markDismissing],
  );

  const dismissAll = useCallback(() => {
    staggeredDismiss(() => true);
  }, [staggeredDismiss]);

  const dismissPosition = useCallback(
    (position: ToastPosition) => {
      staggeredDismiss((i) => i.position === position);
    },
    [staggeredDismiss],
  );

  const api = useMemo<ToastAPI>(
    () => ({
      show: upsert,
      success: (message, options) => upsert({ ...options, type: 'success', message }),
      error: (message, options) => upsert({ ...options, type: 'error', message }),
      warning: (message, options) => upsert({ ...options, type: 'warning', message }),
      info: (message, options) => upsert({ ...options, type: 'info', message }),
      async promise<T>(p: Promise<T>, opts: PromiseToastOptions<T>) {
        const id = upsert({ message: opts.loading, type: 'default', duration: Infinity });
        try {
          const value = await p;
          const successMsg = typeof opts.success === 'function' ? opts.success(value) : opts.success;
          upsert({ id, type: 'success', message: successMsg });
          return value;
        } catch (err) {
          const errorMsg = typeof opts.error === 'function' ? opts.error(err) : opts.error;
          upsert({ id, type: 'error', message: errorMsg });
          throw err;
        }
      },
      dismiss,
      dismissAll,
    }),
    [dismiss, dismissAll, upsert],
  );

  useEffect(() => {
    _registerToastAPI(api);
    return () => _registerToastAPI(null);
  }, [api]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastHost items={items} onRemove={remove} onClearPosition={dismissPosition} />
    </ToastContext.Provider>
  );
}
