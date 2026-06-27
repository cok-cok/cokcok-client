import type { FlashListProps, FlashListRef } from '@shopify/flash-list';
import type { Ref } from 'react';

export type VirtualGridProps<T> = Omit<FlashListProps<T>, 'numColumns'> & {
  columns?: 1 | 2;
  flashListRef?: Ref<FlashListRef<T>>;
};
