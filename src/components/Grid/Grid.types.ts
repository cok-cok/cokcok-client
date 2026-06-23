import type { ReactNode } from 'react';

export type GridColumns = 1 | 2;

export type GridProps<T> = {
  data: T[];
  renderItem: (item: T, index: number) => ReactNode;
  columns: GridColumns;
  masonry?: boolean;
  gap?: number;
  keyExtractor?: (item: T, index: number) => string;
  getItemHeight?: (item: T, index: number) => number;
  testID?: string;
};
