import { useCallback, useEffect, useState } from 'react';
import { AccessibilityInfo, Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Toast } from './Toast';
import {
  clearAllButtonStyle,
  clearAllTextStyle,
  clearAllWrapStyle,
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
const CLEAR_ALL_FADE_MS = 220;
const CLEAR_ALL_MOVE_MS = 220;

export function ToastHost({ items, onRemove, onClearPosition }: Props) {
  const insets = useSafeAreaInsets();
  const [reduceMotion, setReduceMotion] = useState(false);
  const [heights, setHeights] = useState<Record<string, number>>({});

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

  const topItems = items.filter((i) => i.position === 'top').slice(-TOAST_MAX_VISIBLE);
  const bottomItems = items.filter((i) => i.position === 'bottom').slice(-TOAST_MAX_VISIBLE);

  const topFront = topItems[topItems.length - 1];
  const bottomFront = bottomItems[bottomItems.length - 1];
  const topFrontHeight = topFront ? (heights[topFront.id] ?? FALLBACK_HEIGHT) : FALLBACK_HEIGHT;
  const bottomFrontHeight = bottomFront ? (heights[bottomFront.id] ?? FALLBACK_HEIGHT) : FALLBACK_HEIGHT;

  const topOffset = topFrontHeight + Math.max(0, topItems.length - 1) * TOAST_STACK_OFFSET + CLEAR_ALL_GAP;
  const bottomOffset = bottomFrontHeight + Math.max(0, bottomItems.length - 1) * TOAST_STACK_OFFSET + CLEAR_ALL_GAP;

  // _dismissing 제외한 "실제로 살아있는" 토스트 수가 3 이상일 때만 버튼 노출
  // -> "모두 제거" 누른 순간 active=0 되어 토스트와 동시에 fade out
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
          onPress={() => onClearPosition('top')}
        />
      </View>
      <View style={[hostBottomStyle, { bottom: insets.bottom + TOAST_GAP }]} pointerEvents="box-none">
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
          onPress={() => onClearPosition('bottom')}
        />
      </View>
    </>
  );
}

type ClearAllButtonProps = {
  position: ToastPosition;
  offset: number;
  visible: boolean;
  onPress: () => void;
};

function ClearAllButton({ position, offset, visible, onPress }: ClearAllButtonProps) {
  const opacity = useSharedValue(visible ? 1 : 0);
  const translateY = useSharedValue(offset);
  const sign = position === 'top' ? 1 : -1;

  useEffect(() => {
    opacity.value = withTiming(visible ? 1 : 0, { duration: CLEAR_ALL_FADE_MS });
  }, [opacity, visible]);

  useEffect(() => {
    translateY.value = withTiming(offset, { duration: CLEAR_ALL_MOVE_MS });
  }, [offset, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: sign * translateY.value }],
  }));

  const anchor = position === 'top' ? { top: 0 } : { bottom: 0 };

  return (
    <Animated.View
      style={[clearAllWrapStyle, anchor, animatedStyle]}
      pointerEvents={visible ? 'box-none' : 'none'}
    >
      <Pressable
        onPress={onPress}
        style={clearAllButtonStyle}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="모두 제거"
      >
        <Text style={clearAllTextStyle}>모두 제거</Text>
      </Pressable>
    </Animated.View>
  );
}
