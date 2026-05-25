import { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

const PRESS_SPRING = { mass: 0.4, damping: 14, stiffness: 220 };

export function useButtonPressAnimation() {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const pressIn = () => {
    scale.value = withSpring(0.96, PRESS_SPRING);
    opacity.value = withTiming(0.92, { duration: 80 });
  };

  const pressOut = () => {
    scale.value = withSpring(1, PRESS_SPRING);
    opacity.value = withTiming(1, { duration: 140 });
  };

  return { animatedStyle, pressIn, pressOut };
}
