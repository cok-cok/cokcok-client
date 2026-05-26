import { useEffect } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import {
  LETTER_BOUNCE_DURATION_MS,
  LETTER_C_RATIO,
  LETTER_COUNT,
  LETTER_HEIGHT,
  LETTER_JUMP_HEIGHT,
  LETTER_K_RATIO,
  LETTER_O_RATIO,
  LETTER_PER_LETTER_PAUSE_MS,
  LETTER_STAGGER_MS,
  PRE_OVERLAY_DELAY_MS,
} from './LoadingPage.constants';
import { styles } from './LoadingPage.styles';

const C_SRC = require('../../../assets/cokcok-letter-c.png');
const O_SRC = require('../../../assets/cokcok-letter-o.png');
const K_SRC = require('../../../assets/cokcok-letter-k.png');

// COKCOK 순서로 6글자
const LETTER_SOURCES = [
  { src: C_SRC, ratio: LETTER_C_RATIO },
  { src: O_SRC, ratio: LETTER_O_RATIO },
  { src: K_SRC, ratio: LETTER_K_RATIO },
  { src: C_SRC, ratio: LETTER_C_RATIO },
  { src: O_SRC, ratio: LETTER_O_RATIO },
  { src: K_SRC, ratio: LETTER_K_RATIO },
] as const;

// damped sine — Spinner와 동일한 패턴 (Spinner.animation.ts 참고)
const CYCLES = 1.5;
const DECAY = 1.5;
const PHASE = 2 * Math.PI * CYCLES;
const AMPLITUDE_SCALE = 1 / Math.exp(-DECAY / (4 * CYCLES));

type LetterProps = {
  source: number;
  ratio: number;
  index: number;
  start: boolean;
  onCycleEnd?: () => void;
};

function Letter({ source, ratio, index, start, onCycleEnd }: LetterProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (!start) return;

    const loop = withRepeat(
      withSequence(
        withTiming(
          1,
          { duration: LETTER_BOUNCE_DURATION_MS, easing: Easing.linear },
          (finished) => {
            'worklet';
            if (finished && onCycleEnd) {
              runOnJS(onCycleEnd)();
            }
          },
        ),
        withDelay(LETTER_PER_LETTER_PAUSE_MS, withTiming(0, { duration: 1 })),
      ),
      -1,
    );

    // PRE_OVERLAY_DELAY 이후 글자 페이드인과 동시에 점프 시작. index에 따라 staggered.
    progress.value = withDelay(PRE_OVERLAY_DELAY_MS + LETTER_STAGGER_MS * index, loop);

    return () => cancelAnimation(progress);
  }, [start, index, onCycleEnd, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY:
          LETTER_JUMP_HEIGHT *
          AMPLITUDE_SCALE *
          Math.sin(progress.value * PHASE) *
          Math.exp(-DECAY * progress.value),
      },
    ],
  }));

  const width = LETTER_HEIGHT * ratio;
  return (
    <Animated.Image
      source={source}
      style={[styles.letter, { width }, animatedStyle]}
      resizeMode="contain"
    />
  );
}

type Props = {
  containerStyle: StyleProp<ViewStyle>;
  start: boolean;
  onCycleEnd: () => void;
};

// 6글자 중 마지막(K, index=5)이 한 cycle BOUNCE를 끝낼 때마다 onCycleEnd 호출 — "모든 글자 1바퀴" 기준.
export function CokcokLetters({ containerStyle, start, onCycleEnd }: Props) {
  return (
    <Animated.View style={[styles.lettersWrap, containerStyle]} pointerEvents="none">
      <Animated.View style={styles.lettersRow}>
        {LETTER_SOURCES.map((l, i) => (
          <Letter
            key={i}
            source={l.src}
            ratio={l.ratio}
            index={i}
            start={start}
            onCycleEnd={i === LETTER_COUNT - 1 ? onCycleEnd : undefined}
          />
        ))}
      </Animated.View>
    </Animated.View>
  );
}
