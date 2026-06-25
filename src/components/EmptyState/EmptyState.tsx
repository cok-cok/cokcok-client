import { memo } from 'react';

import { StateView } from '../StateView';
import type { EmptyStateProps } from './EmptyState.types';

function EmptyStateInner(props: EmptyStateProps) {
  return <StateView {...props} />;
}

export const EmptyState = memo(EmptyStateInner);
