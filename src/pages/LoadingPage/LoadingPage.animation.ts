import { useEffect } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import {
  EXIT_FADE_DURATION_MS,
  OVERLAY_FADE_DURATION_MS,
  PRE_OVERLAY_DELAY_MS,
  WHITE_OVERLAY_OPACITY,
} from './LoadingPage.constants';

// 흐려짐 오버레이 + 글자 페이드인 + 전체 종료 페이드아웃.
// start: 배경 이미지가 보이기 시작한 시점부터 true. PRE_OVERLAY_DELAY_MS 후 fade-in 시작.
// exiting: true면 전체 root opacity를 1→0으로 페이드아웃 (시각/로직 게이트가 모두 충족된 후).
export function useLoadingAnimation({ start, exiting }: { start: boolean; exiting: boolean }) {
  const enter = useSharedValue(0); // 0 hidden → 1 visible (overlay + letters)
  const exit = useSharedValue(0); // 0 visible → 1 fully exited

  useEffect(() => {
    if (start) {
      enter.value = withDelay(
        PRE_OVERLAY_DELAY_MS,
        withTiming(1, { duration: OVERLAY_FADE_DURATION_MS }),
      );
    }
  }, [start, enter]);

  useEffect(() => {
    if (exiting) {
      exit.value = withTiming(1, { duration: EXIT_FADE_DURATION_MS });
    }
  }, [exiting, exit]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: enter.value * WHITE_OVERLAY_OPACITY,
  }));
  const lettersStyle = useAnimatedStyle(() => ({
    opacity: enter.value,
  }));
  const rootExitStyle = useAnimatedStyle(() => ({
    opacity: 1 - exit.value,
  }));

  return { overlayStyle, lettersStyle, rootExitStyle };
}
