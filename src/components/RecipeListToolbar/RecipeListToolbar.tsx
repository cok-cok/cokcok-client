import { memo, useCallback } from 'react';
import { View } from 'react-native';

import { Segmented, type SegmentedOption } from '../Segmented';
import { ListRowsIcon } from './ListRowsIcon';
import { MasonryGridIcon } from './MasonryGridIcon';
import { styles } from './RecipeListToolbar.styles';
import type { RecipeListColumns, RecipeListToolbarProps } from './RecipeListToolbar.types';

const ICON_COLOR = '#111827';
const LIST_ICON_SIZE = 16;
const GRID_ICON_SIZE = 18;

const COLUMN_OPTIONS: readonly SegmentedOption<`${RecipeListColumns}`>[] = [
  {
    value: '1',
    iconInactive: <ListRowsIcon size={LIST_ICON_SIZE} color={ICON_COLOR} filled />,
    iconActive: <ListRowsIcon size={LIST_ICON_SIZE} color={ICON_COLOR} filled={false} />,
    accessibilityLabel: '1열로 보기',
  },
  {
    value: '2',
    iconInactive: <MasonryGridIcon size={GRID_ICON_SIZE} color={ICON_COLOR} filled />,
    iconActive: <MasonryGridIcon size={GRID_ICON_SIZE} color={ICON_COLOR} filled={false} />,
    accessibilityLabel: '2열로 보기',
  },
];

function RecipeListToolbarInner({
  columns,
  onColumnsChange,
  right,
  testID,
}: RecipeListToolbarProps) {
  const handleChange = useCallback(
    (next: `${RecipeListColumns}`) => {
      onColumnsChange(next === '1' ? 1 : 2);
    },
    [onColumnsChange],
  );

  return (
    <View style={styles.container} testID={testID}>
      <Segmented
        options={COLUMN_OPTIONS}
        value={`${columns}` as `${RecipeListColumns}`}
        onChange={handleChange}
      />
      {right ? <View style={styles.rightSlot}>{right}</View> : null}
    </View>
  );
}

export const RecipeListToolbar = memo(RecipeListToolbarInner);
