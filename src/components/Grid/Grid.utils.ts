type Indexed<T> = { item: T; index: number };

export function withIndex<T>(items: T[]): Indexed<T>[] {
  return items.map((item, index) => ({ item, index }));
}

export function distributeMasonry<T>(
  items: Indexed<T>[],
  getHeight: (item: T, index: number) => number,
  columns: number,
): Indexed<T>[][] {
  const cols: Indexed<T>[][] = Array.from({ length: columns }, () => []);
  const heights = new Array(columns).fill(0);
  for (const wrapped of items) {
    let shortestIndex = 0;
    for (let i = 1; i < columns; i++) {
      if (heights[i] < heights[shortestIndex]) shortestIndex = i;
    }
    cols[shortestIndex].push(wrapped);
    heights[shortestIndex] += getHeight(wrapped.item, wrapped.index);
  }
  return cols;
}

export function groupIntoRows<T>(items: Indexed<T>[], itemsPerRow: number): Indexed<T>[][] {
  if (itemsPerRow <= 1) return items.map((wrapped) => [wrapped]);
  const rows: Indexed<T>[][] = [];
  for (let i = 0; i < items.length; i += itemsPerRow) {
    rows.push(items.slice(i, i + itemsPerRow));
  }
  return rows;
}
