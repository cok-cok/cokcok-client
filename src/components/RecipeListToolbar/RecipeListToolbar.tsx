import { memo, useCallback } from 'react';
import { View } from 'react-native';

import { Segmented, type SegmentedOption } from '../Segmented';
import { styles } from './RecipeListToolbar.styles';
import type { RecipeListColumns, RecipeListToolbarProps } from './RecipeListToolbar.types';

const COLUMN_OPTIONS: readonly SegmentedOption<`${RecipeListColumns}`>[] = [
  { value: '1', icon: 'layoutList', accessibilityLabel: '1열로 보기' },
  { value: '2', icon: 'layoutGrid', accessibilityLabel: '2열로 보기' },
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
