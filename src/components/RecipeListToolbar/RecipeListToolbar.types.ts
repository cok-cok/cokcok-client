import type { ReactNode } from 'react';

export type RecipeListColumns = 1 | 2;

export type RecipeListToolbarProps = {
  columns: RecipeListColumns;
  onColumnsChange: (columns: RecipeListColumns) => void;
  right?: ReactNode;
  testID?: string;
};
