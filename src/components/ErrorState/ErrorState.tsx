import { memo } from 'react';

import { StateView } from '../StateView';
import type { ErrorStateProps } from './ErrorState.types';

function ErrorStateInner(props: ErrorStateProps) {
  return <StateView {...props} />;
}

export const ErrorState = memo(ErrorStateInner);
