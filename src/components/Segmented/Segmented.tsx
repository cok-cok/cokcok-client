import { memo, type ReactElement, useEffect, useRef, useState } from 'react';
import {
  type LayoutChangeEvent,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { BlurView } from 'expo-blur';

import { SEGMENTED_ANDROID_BG, styles } from './Segmented.styles';
import type { SegmentedProps } from './Segmented.types';

const INDICATOR_DURATION_MS = 280;
const BLUR_INTENSITY = 12;

const isIos = Platform.OS === 'ios';

type ItemLayout = { x: number; width: number };

function SegmentedInner<T extends string>({
  options,
  value,
  onChange,
  style,
  testID,
}: SegmentedProps<T>): ReactElement {
  const layoutsRef = useRef<(ItemLayout | undefined)[]>([]);
  const [layoutsReady, setLayoutsReady] = useState(false);

  const indicatorX = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);

  const activeIndex = options.findIndex((o) => o.value === value);

  const handleItemLayout = (index: number) => (e: LayoutChangeEvent) => {
    const { x, width } = e.nativeEvent.layout;
    layoutsRef.current[index] = { x, width };
    if (layoutsRef.current.filter(Boolean).length === options.length) {
      setLayoutsReady(true);
    }
  };

  useEffect(() => {
    if (!layoutsReady || activeIndex < 0) return;
    const layout = layoutsRef.current[activeIndex];
    if (!layout) return;
    indicatorX.value = withTiming(layout.x, { duration: INDICATOR_DURATION_MS });
    indicatorWidth.value = withTiming(layout.width, { duration: INDICATOR_DURATION_MS });
  }, [layoutsReady, activeIndex, indicatorX, indicatorWidth]);

  const indicatorStyle = useAnimatedStyle(() => ({
    width: indicatorWidth.value,
    transform: [{ translateX: indicatorX.value }],
  }));

  return (
    <View
      style={[styles.bar, isIos ? null : { backgroundColor: SEGMENTED_ANDROID_BG }, style]}
      testID={testID}
    >
      {isIos ? (
        <>
          <BlurView intensity={BLUR_INTENSITY} tint="regular" style={StyleSheet.absoluteFill} />
          <View style={[StyleSheet.absoluteFill, styles.iosTintOverlay]} pointerEvents="none" />
        </>
      ) : null}
      {layoutsReady ? (
        <Animated.View style={[styles.indicator, indicatorStyle]} pointerEvents="none" />
      ) : null}
      {options.map((option, index) => {
        const isActive = option.value === value;
        return (
          <Pressable
            key={option.value}
            style={styles.item}
            onLayout={handleItemLayout(index)}
            onPress={() => onChange(option.value)}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={option.accessibilityLabel}
          >
            {isActive ? option.iconActive : option.iconInactive}
          </Pressable>
        );
      })}
    </View>
  );
}

export const Segmented = memo(SegmentedInner) as <T extends string>(
  props: SegmentedProps<T>,
) => ReactElement;
