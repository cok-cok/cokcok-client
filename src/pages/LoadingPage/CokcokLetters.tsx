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
  JUMP_START_DELAY_MS,
  LETTER_BOUNCE_DURATION_MS,
  LETTER_C_RATIO,
  LETTER_C_WIDTH,
  LETTER_COUNT,
  LETTER_JUMP_HEIGHT,
  LETTER_K_RATIO,
  LETTER_K_WIDTH,
  LETTER_O_RATIO,
  LETTER_O_WIDTH,
  LETTER_PER_LETTER_PAUSE_MS,
  LETTER_STAGGER_MS,
} from './LoadingPage.constants';
import { styles } from './LoadingPage.styles';

const C_SRC = require('../../../assets/cokcok-letter-c.png');
const O_SRC = require('../../../assets/cokcok-letter-o.png');
const K_SRC = require('../../../assets/cokcok-letter-k.png');

type LetterSpec = { src: number; width: number; ratio: number };

// COKCOK 순서로 6글자 — 폭은 사용자 지정 비율(C:O:K = 197:229:192)에 맞춰 LoadingPage.constants에서 산출.
const LETTER_SPECS: LetterSpec[] = [
  { src: C_SRC, width: LETTER_C_WIDTH, ratio: LETTER_C_RATIO },
  { src: O_SRC, width: LETTER_O_WIDTH, ratio: LETTER_O_RATIO },
  { src: K_SRC, width: LETTER_K_WIDTH, ratio: LETTER_K_RATIO },
  { src: C_SRC, width: LETTER_C_WIDTH, ratio: LETTER_C_RATIO },
  { src: O_SRC, width: LETTER_O_WIDTH, ratio: LETTER_O_RATIO },
  { src: K_SRC, width: LETTER_K_WIDTH, ratio: LETTER_K_RATIO },
];

// damped sine — Spinner와 동일 (Spinner.animation.ts 참고)
const CYCLES = 1.5;
const DECAY = 1.5;
const PHASE = 2 * Math.PI * CYCLES;
const AMPLITUDE_SCALE = 1 / Math.exp(-DECAY / (4 * CYCLES));

type LetterProps = {
  source: number;
  width: number;
  ratio: number;
  index: number;
  start: boolean;
  onCycleEnd?: () => void;
};

function Letter({ source, width, ratio, index, start, onCycleEnd }: LetterProps) {
  const progress = useSharedValue(0);
  const height = width / ratio;

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

    // bgReady=true 시점부터 글자 페이드인이 끝나고 PRE_JUMP_DELAY 후 점프 시작 (인덱스별 stagger).
    progress.value = withDelay(JUMP_START_DELAY_MS + LETTER_STAGGER_MS * index, loop);

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

  return (
    <Animated.Image
      source={source}
      style={[styles.letter, { width, height }, animatedStyle]}
      resizeMode="contain"
    />
  );
}

type Props = {
  containerStyle: StyleProp<ViewStyle>;
  start: boolean;
  onCycleEnd: () => void;
};

// 마지막 글자(index=5, K)의 BOUNCE 완료마다 onCycleEnd 발화 — "모든 글자 1바퀴" 기준.
export function CokcokLetters({ containerStyle, start, onCycleEnd }: Props) {
  return (
    <Animated.View style={[styles.lettersWrap, containerStyle]} pointerEvents="none">
      <Animated.View style={styles.lettersRow}>
        {LETTER_SPECS.map((l, i) => (
          <Letter
            key={i}
            source={l.src}
            width={l.width}
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
