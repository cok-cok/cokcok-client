import { useEffect } from 'react';
import {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const BOUNCE_DURATION = 700;
const STAGGER = 220;
const PAUSE_AFTER_ALL = 380;
const PER_CIRCLE_PAUSE = STAGGER * 2 + PAUSE_AFTER_ALL;

// damped sine — y = A * scale * sin(2π * cycles * p) * exp(-decay * p)
// 1.5 cycles 동안 진동, exp 감쇠로 0에 자연 수렴 (3개 peak: 위, 아래, 작게 위)
const CYCLES = 1.5;
const DECAY = 1.5;
const PHASE = 2 * Math.PI * CYCLES;
// 첫 peak에서 nominal jumpHeight에 도달하도록 scale 보정
const AMPLITUDE_SCALE = 1 / Math.exp(-DECAY / (4 * CYCLES));

export function useSpinnerAnimation(jumpHeight: number) {
  const p1 = useSharedValue(0);
  const p2 = useSharedValue(0);
  const p3 = useSharedValue(0);

  useEffect(() => {
    const buildLoop = () =>
      withRepeat(
        withSequence(
          withTiming(1, { duration: BOUNCE_DURATION, easing: Easing.linear }),
          withDelay(PER_CIRCLE_PAUSE, withTiming(0, { duration: 1 })),
        ),
        -1,
      );

    p1.value = buildLoop();
    p2.value = withDelay(STAGGER, buildLoop());
    p3.value = withDelay(STAGGER * 2, buildLoop());

    return () => {
      cancelAnimation(p1);
      cancelAnimation(p2);
      cancelAnimation(p3);
    };
  }, [p1, p2, p3]);

  const style1 = useAnimatedStyle(() => ({
    transform: [
      { translateY: jumpHeight * AMPLITUDE_SCALE * Math.sin(p1.value * PHASE) * Math.exp(-DECAY * p1.value) },
    ],
  }));
  const style2 = useAnimatedStyle(() => ({
    transform: [
      { translateY: jumpHeight * AMPLITUDE_SCALE * Math.sin(p2.value * PHASE) * Math.exp(-DECAY * p2.value) },
    ],
  }));
  const style3 = useAnimatedStyle(() => ({
    transform: [
      { translateY: jumpHeight * AMPLITUDE_SCALE * Math.sin(p3.value * PHASE) * Math.exp(-DECAY * p3.value) },
    ],
  }));

  return [style1, style2, style3] as const;
}
