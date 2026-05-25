import { useCallback, useEffect } from 'react';
import { Platform } from 'react-native';
import {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { TOAST_STACK_OFFSET, TOAST_STACK_SCALE_STEP, TOAST_STACK_TRANSITION_MS } from './Toast.styles';
import type { ToastPosition } from './Toast.types';

const ENTRY_SPRING = { mass: 0.5, damping: 14, stiffness: 220 };
const EXIT_TRANSLATE_DISTANCE = 50;
const EXIT_TRANSLATE_TIMING = { duration: 320, easing: Easing.inOut(Easing.cubic) };
const EXIT_OPACITY_TIMING = { duration: 240, easing: Easing.out(Easing.cubic) };
const SWIPE_TRANSLATE_TIMING = { duration: 240, easing: Easing.out(Easing.cubic) };
const ENTRY_OPACITY_TIMING = { duration: 200 };
const ENTRY_OFFSCREEN = 160;
const STACK_TIMING = { duration: TOAST_STACK_TRANSITION_MS, easing: Easing.out(Easing.cubic) };
// Android elevation은 system render라 부모 opacity와 무관하게 잔존 → opacity와 함께 elevation 보간
const ANDROID_ELEVATION = Platform.OS === 'android' ? 10 : 0;

type Args = {
  position: ToastPosition;
  stackIndex: number;
  reduceMotion: boolean;
};

export function useToastAnimation({ position, stackIndex, reduceMotion }: Args) {
  const initialOffset = position === 'top' ? -ENTRY_OFFSCREEN : ENTRY_OFFSCREEN;
  const translateY = useSharedValue(initialOffset);
  const opacity = useSharedValue(0);
  const dragY = useSharedValue(0);
  const stackProgress = useSharedValue(stackIndex);

  useEffect(() => {
    if (reduceMotion) {
      translateY.value = 0;
      opacity.value = withTiming(1, { duration: 120 });
    } else {
      translateY.value = withSpring(0, ENTRY_SPRING);
      opacity.value = withTiming(1, ENTRY_OPACITY_TIMING);
    }
  }, [opacity, reduceMotion, translateY]);

  useEffect(() => {
    if (reduceMotion) {
      stackProgress.value = stackIndex;
    } else {
      stackProgress.value = withTiming(stackIndex, STACK_TIMING);
    }
  }, [reduceMotion, stackIndex, stackProgress]);

  const exit = useCallback(
    (onComplete: () => void) => {
      const target = position === 'top' ? -EXIT_TRANSLATE_DISTANCE : EXIT_TRANSLATE_DISTANCE;
      opacity.value = withTiming(0, EXIT_OPACITY_TIMING);
      translateY.value = withTiming(target, EXIT_TRANSLATE_TIMING, (finished) => {
        if (finished) runOnJS(onComplete)();
      });
    },
    [opacity, position, translateY],
  );

  const swipeDismiss = useCallback(
    (onComplete: () => void) => {
      const target = position === 'top' ? -ENTRY_OFFSCREEN : ENTRY_OFFSCREEN;
      opacity.value = withTiming(0, EXIT_OPACITY_TIMING);
      dragY.value = withTiming(target, SWIPE_TRANSLATE_TIMING, (finished) => {
        if (finished) runOnJS(onComplete)();
      });
    },
    [dragY, opacity, position],
  );

  const animatedStyle = useAnimatedStyle(() => {
    const idx = stackProgress.value;
    const stackTranslateY = position === 'top' ? idx * TOAST_STACK_OFFSET : -idx * TOAST_STACK_OFFSET;
    const stackScale = 1 - idx * TOAST_STACK_SCALE_STEP;
    // 뒤로 밀린 토스트도 background opaque 유지 — 겹쳐 보이지 않게 stackOpacity 적용 안 함
    return {
      opacity: opacity.value,
      transform: [
        { translateY: translateY.value + dragY.value + stackTranslateY },
        { scale: stackScale },
      ] as const,
    };
  });

  // Android elevation을 opacity와 함께 0→10→0으로 보간 (잔여 그림자 방지). iOS는 0으로 no-op
  const shadowStyle = useAnimatedStyle(() => ({
    elevation: opacity.value * ANDROID_ELEVATION,
  }));

  return { animatedStyle, dragY, exit, shadowStyle, swipeDismiss };
}
