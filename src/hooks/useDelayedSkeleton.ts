import { useEffect, useRef, useState } from 'react';

export type UseDelayedSkeletonOptions = {
  showDelay?: number;
  minVisibleMs?: number;
};

const DEFAULT_SHOW_DELAY_MS = 200;
const DEFAULT_MIN_VISIBLE_MS = 500;

export function useDelayedSkeleton(
  isLoading: boolean,
  {
    showDelay = DEFAULT_SHOW_DELAY_MS,
    minVisibleMs = DEFAULT_MIN_VISIBLE_MS,
  }: UseDelayedSkeletonOptions = {},
): boolean {
  const [show, setShow] = useState(false);
  const shownAtRef = useRef<number | null>(null);

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        shownAtRef.current = Date.now();
        setShow(true);
      }, showDelay);
      return () => clearTimeout(timer);
    }
    if (!show) {
      shownAtRef.current = null;
      return;
    }
    const elapsed = Date.now() - (shownAtRef.current ?? 0);
    const remaining = Math.max(0, minVisibleMs - elapsed);
    if (remaining === 0) {
      setShow(false);
      shownAtRef.current = null;
      return;
    }
    const timer = setTimeout(() => {
      setShow(false);
      shownAtRef.current = null;
    }, remaining);
    return () => clearTimeout(timer);
  }, [isLoading, showDelay, minVisibleMs, show]);

  return show;
}
