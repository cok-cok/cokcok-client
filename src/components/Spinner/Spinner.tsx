import { memo } from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';

import { useSpinnerAnimation } from './Spinner.animation';
import { getCircleStyle, getRowStyle, SPINNER_COLORS, SPINNER_JUMP_HEIGHT } from './Spinner.styles';
import type { SpinnerProps } from './Spinner.types';

function SpinnerInner({ color = 'brand', size = 'md', style, accessibilityLabel = '로딩 중' }: SpinnerProps) {
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

// memo — Button/Input loading 슬롯에서 부모 리렌더 시 props 동일하면 worklet 셋업/3개의
// useAnimatedStyle 재실행을 차단. Spinner는 항상 애니메이션 중이라 비용이 작지 않음
export const Spinner = memo(SpinnerInner);
