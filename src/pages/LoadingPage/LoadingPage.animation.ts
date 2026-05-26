import { useEffect } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import {
  BG_FADE_DURATION_MS,
  EXIT_FADE_DURATION_MS,
  OVERLAY_FADE_DURATION_MS,
  PRE_OVERLAY_DELAY_MS,
  WHITE_OVERLAY_OPACITY,
} from './LoadingPage.constants';

// bgReady=true 시점부터 시퀀스 시작:
// 1) bg 이미지 fade-in (BG_FADE)
// 2) PRE_OVERLAY_DELAY 대기
// 3) 흰 오버레이 + 글자 fade-in (OVERLAY_FADE)
//
// 점프 시작은 별도 — CokcokLetters 내부에서 JUMP_START_DELAY_MS 로 처리.
export function useLoadingAnimation({
  bgReady,
  exiting,
}: {
  bgReady: boolean;
  exiting: boolean;
}) {
  const bgOpacity = useSharedValue(0);
  const overlayProgress = useSharedValue(0);
  const exit = useSharedValue(0);

  useEffect(() => {
    if (!bgReady) return;
    bgOpacity.value = withTiming(1, { duration: BG_FADE_DURATION_MS });
    overlayProgress.value = withDelay(
      BG_FADE_DURATION_MS + PRE_OVERLAY_DELAY_MS,
      withTiming(1, { duration: OVERLAY_FADE_DURATION_MS }),
    );
  }, [bgReady, bgOpacity, overlayProgress]);

  useEffect(() => {
    if (exiting) {
      exit.value = withTiming(1, { duration: EXIT_FADE_DURATION_MS });
    }
  }, [exiting, exit]);

  const bgStyle = useAnimatedStyle(() => ({ opacity: bgOpacity.value }));
  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayProgress.value * WHITE_OVERLAY_OPACITY,
  }));
  const lettersStyle = useAnimatedStyle(() => ({ opacity: overlayProgress.value }));
  const rootExitStyle = useAnimatedStyle(() => ({ opacity: 1 - exit.value }));

  return { bgStyle, overlayStyle, lettersStyle, rootExitStyle };
}
