import { useCallback, useEffect, useRef, useState } from 'react';

export type InfiniteScrollFetchResult<T> = {
  items: T[];
  hasMore: boolean;
};

export type UseInfiniteScrollOptions<T> = {
  fetcher: (params: { page: number }) => Promise<InfiniteScrollFetchResult<T>>;
  initialPage?: number;
  autoLoad?: boolean;
};

export type UseInfiniteScrollResult<T> = {
  data: T[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: Error | null;
  endReachedKey: number;
  loadMore: () => Promise<void>;
  reload: () => Promise<void>;
};

const DEFAULT_INITIAL_PAGE = 1;
const END_CHECK_DELAY_MS = 500;
const END_MESSAGE_LOCK_MS = 1700;
const SPINNER_HIDE_DELAY_MS = 180;

export function useInfiniteScroll<T>({
  fetcher,
  initialPage = DEFAULT_INITIAL_PAGE,
  autoLoad = true,
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [endReachedKey, setEndReachedKey] = useState(0);

  const pageRef = useRef(initialPage);
  const lockRef = useRef(false);
  const hasMoreRef = useRef(true);
  const endLockUntilRef = useRef(0);

  const fetchPage = useCallback(
    async (target: number, append: boolean) => {
      lockRef.current = true;
      if (append) setIsLoadingMore(true);
      else setIsLoading(true);
      setError(null);

      try {
        const result = await fetcher({ page: target });
        pageRef.current = target;
        hasMoreRef.current = result.hasMore;
        setHasMore(result.hasMore);

        if (append) {
          setIsLoadingMore(false);
          await new Promise<void>((r) => setTimeout(r, SPINNER_HIDE_DELAY_MS));
        }
        setData((prev) => (append ? [...prev, ...result.items] : result.items));
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        if (append) setIsLoadingMore(false);
      } finally {
        if (!append) setIsLoading(false);
        lockRef.current = false;
      }
    },
    [fetcher],
  );

  const loadMore = useCallback(async () => {
    if (lockRef.current) return;
    if (!hasMoreRef.current) {
      if (Date.now() < endLockUntilRef.current) return;
      lockRef.current = true;
      setIsLoadingMore(true);
      await new Promise<void>((r) => setTimeout(r, END_CHECK_DELAY_MS));
      setIsLoadingMore(false);
      await new Promise<void>((r) => setTimeout(r, SPINNER_HIDE_DELAY_MS));
      setEndReachedKey((k) => k + 1);
      endLockUntilRef.current = Date.now() + END_MESSAGE_LOCK_MS;
      lockRef.current = false;
      return;
    }
    await fetchPage(pageRef.current + 1, true);
  }, [fetchPage]);

  const reload = useCallback(() => {
    if (lockRef.current) return Promise.resolve();
    pageRef.current = initialPage;
    hasMoreRef.current = true;
    endLockUntilRef.current = 0;
    setHasMore(true);
    setEndReachedKey(0);
    return fetchPage(initialPage, false);
  }, [fetchPage, initialPage]);

  useEffect(() => {
    if (autoLoad) void reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, isLoading, isLoadingMore, hasMore, error, endReachedKey, loadMore, reload };
}
