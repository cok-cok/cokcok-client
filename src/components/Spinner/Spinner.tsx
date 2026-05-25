import { View } from 'react-native';
import Animated from 'react-native-reanimated';

import { useSpinnerAnimation } from './Spinner.animation';
import { getCircleStyle, getRowStyle, SPINNER_COLORS, SPINNER_JUMP_HEIGHT } from './Spinner.styles';
import type { SpinnerProps } from './Spinner.types';

export function Spinner({ color = 'brand', size = 'md', style, accessibilityLabel = '로딩 중' }: SpinnerProps) {
  const [c1, c2, c3] = SPINNER_COLORS[color];
  const [s1, s2, s3] = useSpinnerAnimation(SPINNER_JUMP_HEIGHT[size]);

  return (
    <View
      style={[getRowStyle(size), style]}
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
    >
      <Animated.View style={[getCircleStyle(size, c1), s1]} />
      <Animated.View style={[getCircleStyle(size, c2), s2]} />
      <Animated.View style={[getCircleStyle(size, c3), s3]} />
    </View>
  );
}
