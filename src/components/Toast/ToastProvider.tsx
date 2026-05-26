import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { TOAST_DEFAULT_DURATION, TOAST_DEFAULT_POSITION, TOAST_MAX_QUEUE } from './Toast.styles';
import type { PromiseToastOptions, ToastAPI, ToastInput, ToastItem, ToastPosition } from './Toast.types';
import { ToastHost } from './ToastHost';
import { _registerToastAPI, ToastContext } from './useToast';

// 여러 개 dismiss(모두제거/dismissAll)할 때 한 번에 동시 fade하면 overlap 영역이 see-through로
// 보이는 시각 이슈가 있어서, 개별 exit 애니메이션을 staggered로 빠르게 순차 재생
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
      // 최신(front)부터 차례로 — 사용자가 가장 먼저 보는 것부터 사라짐
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
      // 명시적 id로 들어오면 upsert (promise 패턴)
      const idx = prev.findIndex((i) => i.id === item.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = item;
        return next;
      }
      // dedup — 사라지지 않은 동일 내용 토스트가 있으면 새로 만들지 않고 timer만 reset.
      // 스팸 클릭 시 새 mount + stack reflow 회피해서 성능 ↑.
      // action 있는 토스트는 매번 다른 의도일 수 있어 dedup 제외.
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
      // 큐 한도 초과 시 같은 position의 가장 오래된 것부터 제거
      while (next.length > TOAST_MAX_QUEUE) {
        const oldestSamePosIdx = next.findIndex((i) => i.position === item.position);
        next.splice(oldestSamePosIdx >= 0 ? oldestSamePosIdx : 0, 1);
      }
      return next;
    });
    return resolvedId;
  }, []);

  // exit 애니메이션 끝난 후 실제로 state에서 제거 (Toast 컴포넌트 내부에서 호출)
  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  // 단일 dismiss — 즉시 마킹 (해당 토스트만 자체 exit 애니메이션)
  const dismiss = useCallback(
    (id: string) => {
      markDismissing(id);
    },
    [markDismissing],
  );

  // 다수 dismiss — 동시 fade 대신 빠른 순차 재생으로 overlap 시각 이슈 회피
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
