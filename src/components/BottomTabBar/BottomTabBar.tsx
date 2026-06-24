import { memo, useEffect, useRef, useState } from 'react';
import {
  type LayoutChangeEvent,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

import { BOTTOM_TAB_BAR_ANDROID_BG, BOTTOM_TAB_BAR_COLOR } from './BottomTabBar.constants';
import { styles } from './BottomTabBar.styles';
import type { BottomTabBarProps } from './BottomTabBar.types';

const TAB_ICON_SIZE = 24;
const BLUR_INTENSITY = 5;
const INDICATOR_DURATION_MS = 280;

const isIos = Platform.OS === 'ios';

type TabLayout = { x: number; width: number };

function BottomTabBarInner({ items, activeKey, onTabPress, testID }: BottomTabBarProps) {
  const layoutsRef = useRef<(TabLayout | undefined)[]>([]);
  const [layoutsReady, setLayoutsReady] = useState(false);

  const indicatorX = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);

  const activeIndex = items.findIndex((item) => item.key === activeKey);

  const handleItemLayout = (index: number) => (e: LayoutChangeEvent) => {
    const { x, width } = e.nativeEvent.layout;
    layoutsRef.current[index] = { x, width };
    if (layoutsRef.current.filter(Boolean).length === items.length) {
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
      style={[styles.bar, isIos ? null : { backgroundColor: BOTTOM_TAB_BAR_ANDROID_BG }]}
      testID={testID}
    >
      {isIos ? (
        <BlurView intensity={BLUR_INTENSITY} tint="regular" style={StyleSheet.absoluteFill} />
      ) : null}
      {layoutsReady ? (
        <Animated.View style={[styles.indicator, indicatorStyle]} pointerEvents="none" />
      ) : null}
      {items.map((item, index) => {
        const isActive = item.key === activeKey;
        return (
          <Pressable
            key={item.key}
            style={styles.itemWrap}
            onLayout={handleItemLayout(index)}
            onPress={() => onTabPress(item.key)}
            accessibilityRole="button"
            accessibilityLabel={item.label}
            accessibilityState={{ selected: isActive }}
          >
            <Ionicons
              name={isActive ? item.iconActive : item.iconInactive}
              size={TAB_ICON_SIZE}
              color={BOTTOM_TAB_BAR_COLOR}
            />
            <Text style={styles.label}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export const BottomTabBar = memo(BottomTabBarInner);
