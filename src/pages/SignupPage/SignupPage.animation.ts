import { useEffect } from 'react';
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { ENTRANCE_DURATION_MS } from './SignupPage.constants';

export function useEntranceAnimation() {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, { duration: ENTRANCE_DURATION_MS });
  }, [progress]);

  const contentStyle = useAnimatedStyle(() => ({ opacity: progress.value }));

  return { contentStyle };
}
