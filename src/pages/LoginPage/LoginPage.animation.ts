import { useEffect } from 'react';
import { Keyboard, Platform } from 'react-native';
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import {
  ENTRANCE_DURATION_MS,
  KEYBOARD_ANIM_DURATION_MS,
  WHITE_OVERLAY_OPACITY,
} from './LoginPage.constants';

// 배경 이미지 + 로고가 둘 다 로드된 후(`ready`) 단일 sharedValue로 동시 fade-in
export function useEntranceAnimation(ready: boolean) {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (ready) {
      progress.value = withTiming(1, { duration: ENTRANCE_DURATION_MS });
    }
  }, [ready, progress]);

  const bgStyle = useAnimatedStyle(() => ({ opacity: progress.value }));
  const overlayStyle = useAnimatedStyle(() => ({ opacity: progress.value * WHITE_OVERLAY_OPACITY }));
  const contentStyle = useAnimatedStyle(() => ({ opacity: progress.value }));

  return { bgStyle, overlayStyle, contentStyle };
}

// 두 플랫폼 모두 manual — softInputMode=pan으로 시스템 자동 동작 끈 상태라 paddingBottom 직접 보정.
// KeyboardAvoidingView 안 쓰는 이유: iOS padding behavior가 input 포커스 전환 시 frame 재계산해서 덜컥거림
export function useKeyboardPadding() {
  const kbHeight = useSharedValue(0);

  useEffect(() => {
    const isIos = Platform.OS === 'ios';
    const showEvent = isIos ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = isIos ? 'keyboardWillHide' : 'keyboardDidHide';
    const show = Keyboard.addListener(showEvent, (e) => {
      kbHeight.value = withTiming(e.endCoordinates.height, { duration: KEYBOARD_ANIM_DURATION_MS });
    });
    const hide = Keyboard.addListener(hideEvent, () => {
      kbHeight.value = withTiming(0, { duration: KEYBOARD_ANIM_DURATION_MS });
    });
    return () => {
      show.remove();
      hide.remove();
    };
  }, [kbHeight]);

  return useAnimatedStyle(() => ({ paddingBottom: kbHeight.value }));
}
