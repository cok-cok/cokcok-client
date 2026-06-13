import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { AnimatedCheck } from '../AnimatedCheck';
import { BRAND, CIRCLE_COLOR_DURATION, INACTIVE, LINE_DURATION, styles } from './Stepper.styles';

type Props = {
  completedCount: 0 | 1 | 2 | 3;
  line1Progress: number;
  line2Progress: number;
  circle2Checked?: boolean;
  circle3Checked?: boolean;
};

export function Stepper({
  completedCount,
  line1Progress,
  line2Progress,
  circle2Checked,
  circle3Checked,
}: Props) {
  return (
    <View style={styles.row}>
      <Circle active={completedCount >= 1} showCheck={false} />
      <Line progress={line1Progress} />
      <Circle active={completedCount >= 2} showCheck={Boolean(circle2Checked)} />
      <Line progress={line2Progress} />
      <Circle active={completedCount >= 3} showCheck={Boolean(circle3Checked)} />
    </View>
  );
}

function Circle({ active, showCheck }: { active: boolean; showCheck: boolean }) {
  const progress = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(active ? 1 : 0, { duration: CIRCLE_COLOR_DURATION });
  }, [active, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [INACTIVE, BRAND]),
  }));

  return (
    <Animated.View style={[styles.circle, animatedStyle]}>
      {showCheck ? <AnimatedCheck checked={true} size={14} /> : null}
    </Animated.View>
  );
}

function Line({ progress }: { progress: number }) {
  const clamped = Math.max(0, Math.min(1, progress));
  const sv = useSharedValue(clamped);

  useEffect(() => {
    sv.value = withTiming(clamped, { duration: LINE_DURATION });
  }, [clamped, sv]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${sv.value * 100}%`,
  }));

  return (
    <View style={styles.lineTrack}>
      <Animated.View style={[styles.lineFill, fillStyle]} />
    </View>
  );
}
