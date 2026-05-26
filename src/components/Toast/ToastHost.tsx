import { useCallback, useEffect, useState } from 'react';
import { AccessibilityInfo, Keyboard, Platform, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ClearAllButton } from './ClearAllButton';
import { Toast } from './Toast';
import {
  hostBottomStyle,
  hostTopStyle,
  TOAST_GAP,
  TOAST_MAX_VISIBLE,
  TOAST_STACK_OFFSET,
} from './Toast.styles';
import type { ToastItem, ToastPosition } from './Toast.types';

type Props = {
  items: ToastItem[];
  onRemove: (id: string) => void;
  onClearPosition: (position: ToastPosition) => void;
};

const FALLBACK_HEIGHT = 60;
const CLEAR_ALL_GAP = 14;
const KEYBOARD_ANIM_MS = 180;

export function ToastHost({ items, onRemove, onClearPosition }: Props) {
  const insets = useSafeAreaInsets();
  const [reduceMotion, setReduceMotion] = useState(false);
  const [heights, setHeights] = useState<Record<string, number>>({});
  const keyboardHeight = useSharedValue(0);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((v) => {
        if (mounted) setReduceMotion(v);
      })
      .catch(() => {});
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => {
      mounted = false;
      sub.remove();
    };
  }, []);

  // softInputMode=pan 으로 시스템 자동 동작 끈 상태라 manual로 bottom 토스트를 키보드 위로 보정
  useEffect(() => {
    const isIos = Platform.OS === 'ios';
    const showEvent = isIos ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = isIos ? 'keyboardWillHide' : 'keyboardDidHide';
    const show = Keyboard.addListener(showEvent, (e) => {
      keyboardHeight.value = withTiming(e.endCoordinates.height, { duration: KEYBOARD_ANIM_MS });
    });
    const hide = Keyboard.addListener(hideEvent, () => {
      keyboardHeight.value = withTiming(0, { duration: KEYBOARD_ANIM_MS });
    });
    return () => {
      show.remove();
      hide.remove();
    };
  }, [keyboardHeight]);

  const bottomHostStyle = useAnimatedStyle(() => ({
    bottom: insets.bottom + TOAST_GAP + keyboardHeight.value,
  }));

  // unmount된 토스트의 높이 정리
  useEffect(() => {
    setHeights((prev) => {
      const ids = new Set(items.map((i) => i.id));
      let changed = false;
      const next: Record<string, number> = {};
      for (const id of Object.keys(prev)) {
        if (ids.has(id)) next[id] = prev[id];
        else changed = true;
      }
      return changed ? next : prev;
    });
  }, [items]);

  const handleMeasure = useCallback((id: string, height: number) => {
    setHeights((prev) => (prev[id] === height ? prev : { ...prev, [id]: height }));
  }, []);

  const handleClearTop = useCallback(() => onClearPosition('top'), [onClearPosition]);
  const handleClearBottom = useCallback(() => onClearPosition('bottom'), [onClearPosition]);

  const topItems = items.filter((i) => i.position === 'top').slice(-TOAST_MAX_VISIBLE);
  const bottomItems = items.filter((i) => i.position === 'bottom').slice(-TOAST_MAX_VISIBLE);

  const topFront = topItems[topItems.length - 1];
  const bottomFront = bottomItems[bottomItems.length - 1];
  const topFrontHeight = topFront ? (heights[topFront.id] ?? FALLBACK_HEIGHT) : FALLBACK_HEIGHT;
  const bottomFrontHeight = bottomFront ? (heights[bottomFront.id] ?? FALLBACK_HEIGHT) : FALLBACK_HEIGHT;

  const topOffset = topFrontHeight + Math.max(0, topItems.length - 1) * TOAST_STACK_OFFSET + CLEAR_ALL_GAP;
  const bottomOffset =
    bottomFrontHeight + Math.max(0, bottomItems.length - 1) * TOAST_STACK_OFFSET + CLEAR_ALL_GAP;

  // 모두제거 버튼은 _dismissing 제외한 active 카운트 기준 — 누른 순간 토스트와 동시에 fade out
  const topActiveCount = topItems.filter((i) => !i._dismissing).length;
  const bottomActiveCount = bottomItems.filter((i) => !i._dismissing).length;
  const topReady = !topFront || heights[topFront.id] !== undefined;
  const bottomReady = !bottomFront || heights[bottomFront.id] !== undefined;

  return (
    <>
      <View style={[hostTopStyle, { top: insets.top + TOAST_GAP }]} pointerEvents="box-none">
        {topItems.map((item, i) => {
          const stackIndex = topItems.length - 1 - i;
          return (
            <Toast
              key={item.id}
              item={item}
              stackIndex={stackIndex}
              isFront={stackIndex === 0}
              onRemove={onRemove}
              onMeasure={handleMeasure}
              reduceMotion={reduceMotion}
            />
          );
        })}
        <ClearAllButton
          position="top"
          offset={topOffset}
          visible={topActiveCount >= 3 && topReady}
          onPress={handleClearTop}
        />
      </View>
      <Animated.View style={[hostBottomStyle, bottomHostStyle]} pointerEvents="box-none">
        {bottomItems.map((item, i) => {
          const stackIndex = bottomItems.length - 1 - i;
          return (
            <Toast
              key={item.id}
              item={item}
              stackIndex={stackIndex}
              isFront={stackIndex === 0}
              onRemove={onRemove}
              onMeasure={handleMeasure}
              reduceMotion={reduceMotion}
            />
          );
        })}
        <ClearAllButton
          position="bottom"
          offset={bottomOffset}
          visible={bottomActiveCount >= 3 && bottomReady}
          onPress={handleClearBottom}
        />
      </Animated.View>
    </>
  );
}
