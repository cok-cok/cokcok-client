import { useCallback, useEffect, useRef, useState } from 'react';
import Animated from 'react-native-reanimated';

import { PhoneFrameBackground } from '../../components/PhoneFrameBackground';
import { CokcokLetters } from './CokcokLetters';
import { useLoadingAnimation } from './LoadingPage.animation';
import { EXIT_FADE_DURATION_MS } from './LoadingPage.constants';
import { styles } from './LoadingPage.styles';

type Props = {
  splashHidden: boolean;
  bootstrapReady: boolean;
  onExitComplete: () => void;
};

const BG_SOURCE = require('../../../assets/login-bg.png');

export function LoadingPage({ splashHidden, bootstrapReady, onExitComplete }: Props) {
  const [bgImageLoaded, setBgImageLoaded] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  const [exiting, setExiting] = useState(false);

  const bgReady = splashHidden && bgImageLoaded;

  const handleBgImageLoaded = useCallback(() => setBgImageLoaded(true), []);
  const handleCycleEnd = useCallback(() => setCycleCount((c) => c + 1), []);

  useEffect(() => {
    if (!exiting && cycleCount >= 1 && bootstrapReady) {
      setExiting(true);
    }
  }, [cycleCount, bootstrapReady, exiting]);

  const exitFiredRef = useRef(false);
  useEffect(() => {
    if (!exiting || exitFiredRef.current) return;
    exitFiredRef.current = true;
    const t = setTimeout(onExitComplete, EXIT_FADE_DURATION_MS);
    return () => clearTimeout(t);
  }, [exiting, onExitComplete]);

  const { bgStyle, overlayStyle, lettersStyle, rootExitStyle } = useLoadingAnimation({
    bgReady,
    exiting,
  });

  return (
    <Animated.View
      style={[styles.root, rootExitStyle]}
      pointerEvents={exiting ? 'none' : 'auto'}
    >
      <PhoneFrameBackground
        source={BG_SOURCE}
        bgEntranceStyle={bgStyle}
        onBgLoad={handleBgImageLoaded}
      >
        <Animated.View style={[styles.whiteOverlay, overlayStyle]} pointerEvents="none" />
        <CokcokLetters containerStyle={lettersStyle} start={bgReady} onCycleEnd={handleCycleEnd} />
      </PhoneFrameBackground>
    </Animated.View>
  );
}
