import { memo, useEffect } from 'react';
import { Pressable, Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { clearAllButtonStyle, clearAllTextStyle, clearAllWrapStyle } from './Toast.styles';
import type { ToastPosition } from './Toast.types';

const FADE_MS = 220;
const MOVE_MS = 220;
const A11Y_LABEL = '모두 제거';
const BUTTON_LABEL = '모두 제거';

type Props = {
  position: ToastPosition;
  offset: number;
  visible: boolean;
  onPress: () => void;
};

export const ClearAllButton = memo(function ClearAllButton({
  position,
  offset,
  visible,
  onPress,
}: Props) {
  const opacity = useSharedValue(visible ? 1 : 0);
  const translateY = useSharedValue(offset);
  const sign = position === 'top' ? 1 : -1;

  useEffect(() => {
    opacity.value = withTiming(visible ? 1 : 0, { duration: FADE_MS });
  }, [opacity, visible]);

  useEffect(() => {
    translateY.value = withTiming(offset, { duration: MOVE_MS });
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
        accessibilityLabel={A11Y_LABEL}
      >
        <Text style={clearAllTextStyle}>{BUTTON_LABEL}</Text>
      </Pressable>
    </Animated.View>
  );
});
