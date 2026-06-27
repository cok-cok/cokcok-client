import { memo, type ReactElement } from 'react';

import { FlashList } from '@shopify/flash-list';

import type { VirtualGridProps } from './VirtualGrid.types';

function VirtualGridInner<T>({
  columns = 2,
  masonry = false,
  flashListRef,
  ...rest
}: VirtualGridProps<T>): ReactElement {
  return <FlashList ref={flashListRef} numColumns={columns} masonry={masonry} {...rest} />;
}

export const VirtualGrid = memo(VirtualGridInner) as <T>(
  props: VirtualGridProps<T>,
) => ReactElement;
