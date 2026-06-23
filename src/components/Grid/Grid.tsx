import { memo, type ReactElement } from 'react';
import { View } from 'react-native';

import { GRID_DEFAULT_GAP, styles } from './Grid.styles';
import type { GridProps } from './Grid.types';
import { distributeMasonry, groupIntoRows, withIndex } from './Grid.utils';

function GridInner<T>({
  data,
  renderItem,
  columns,
  masonry = false,
  gap = GRID_DEFAULT_GAP,
  keyExtractor,
  getItemHeight,
  testID,
}: GridProps<T>) {
  const getKey = (item: T, index: number) => keyExtractor?.(item, index) ?? String(index);

  if (columns === 1) {
    return (
      <View style={{ gap }} testID={testID}>
        {data.map((item, index) => (
          <View key={getKey(item, index)}>{renderItem(item, index)}</View>
        ))}
      </View>
    );
  }

  const indexed = withIndex(data);

  if (masonry) {
    if (!getItemHeight) {
      throw new Error('Grid: masonry=true requires getItemHeight prop');
    }
    const cols = distributeMasonry(indexed, getItemHeight, columns);
    return (
      <View style={[styles.rowContainer, { gap }]} testID={testID}>
        {cols.map((col, colIndex) => (
          <View key={colIndex} style={[styles.flex, { gap }]}>
            {col.map((wrapped) => (
              <View key={getKey(wrapped.item, wrapped.index)}>{renderItem(wrapped.item, wrapped.index)}</View>
            ))}
          </View>
        ))}
      </View>
    );
  }

  const rows = groupIntoRows(indexed, columns);
  return (
    <View style={{ gap }} testID={testID}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={[styles.rowContainer, { gap }]}>
          {row.map((wrapped) => (
            <View key={getKey(wrapped.item, wrapped.index)} style={styles.flex}>
              {renderItem(wrapped.item, wrapped.index)}
            </View>
          ))}
          {Array.from({ length: columns - row.length }).map((_, padIndex) => (
            <View key={`pad-${padIndex}`} style={styles.flex} />
          ))}
        </View>
      ))}
    </View>
  );
}

export const Grid = memo(GridInner) as <T>(props: GridProps<T>) => ReactElement;
