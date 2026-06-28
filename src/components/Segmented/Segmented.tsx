import { memo, type ReactElement, useEffect, useState } from 'react';
import { type LayoutChangeEvent, Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { Icon } from '../Icon';
import {
  SEGMENTED_ACTIVE_COLOR,
  SEGMENTED_INACTIVE_COLOR,
  SEGMENTED_PADDING,
  styles,
} from './Segmented.styles';
import type { SegmentedProps } from './Segmented.types';

function SegmentedInner<T extends string>({
  options,
  value,
  onChange,
  style,
  testID,
}: SegmentedProps<T>): ReactElement {
  const [itemWidth, setItemWidth] = useState(0);
  const indicatorX = useSharedValue(0);

  const activeIndex = options.findIndex((o) => o.value === value);

  const handleTrackLayout = (e: LayoutChangeEvent) => {
    const innerWidth = e.nativeEvent.layout.width - SEGMENTED_PADDING * 2;
    setItemWidth(innerWidth / options.length);
  };

  useEffect(() => {
    if (itemWidth <= 0 || activeIndex < 0) return;
    indicatorX.value = withSpring(activeIndex * itemWidth, {
      damping: 22,
      stiffness: 220,
      mass: 0.7,
    });
  }, [activeIndex, itemWidth, indicatorX]);

  const indicatorStyle = useAnimatedStyle(() => ({
    width: itemWidth,
    transform: [{ translateX: indicatorX.value }],
  }));

  return (
    <View style={[styles.track, style]} onLayout={handleTrackLayout} testID={testID}>
      {itemWidth > 0 ? (
        <Animated.View
          style={[styles.indicator, { left: SEGMENTED_PADDING }, indicatorStyle]}
          pointerEvents="none"
        />
      ) : null}
      {options.map((option) => {
        const isActive = option.value === value;
        const color = isActive ? SEGMENTED_ACTIVE_COLOR : SEGMENTED_INACTIVE_COLOR;
        return (
          <Pressable
            key={option.value}
            style={[styles.item, { width: itemWidth || undefined }]}
            onPress={() => onChange(option.value)}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={option.accessibilityLabel}
          >
            {option.icon ? <Icon name={option.icon} size={18} color={color} /> : null}
            {option.label ? <Text style={[styles.label, { color }]}>{option.label}</Text> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

export const Segmented = memo(SegmentedInner) as <T extends string>(
  props: SegmentedProps<T>,
) => ReactElement;
