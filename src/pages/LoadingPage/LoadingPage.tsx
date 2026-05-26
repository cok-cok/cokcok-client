import { useCallback, useEffect, useRef, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { CokcokLetters } from './CokcokLetters';
import { useLoadingAnimation } from './LoadingPage.animation';
import { BG_ASPECT_RATIO, EXIT_FADE_DURATION_MS } from './LoadingPage.constants';
import { styles } from './LoadingPage.styles';

type Props = {
  // App-level bootstrap이 끝났음을 알림 — 로직 게이트
  bootstrapReady: boolean;
  // exit 페이드아웃까지 모두 끝났을 때 호출 — 부모가 LoadingPage를 unmount
  onExitComplete: () => void;
};

export function LoadingPage({ bootstrapReady, onExitComplete }: Props) {
  const { width: screenWidth } = useWindowDimensions();
  const bgImageHeight = screenWidth / BG_ASPECT_RATIO;

  const [bgLoaded, setBgLoaded] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  const [exiting, setExiting] = useState(false);

  const handleBgLoaded = useCallback(() => setBgLoaded(true), []);
  const handleCycleEnd = useCallback(() => setCycleCount((c) => c + 1), []);

  // 시각 게이트(점프 1사이클 완료) + 로직 게이트(bootstrap 완료) 모두 만족 시 exit 트리거
  useEffect(() => {
    if (!exiting && cycleCount >= 1 && bootstrapReady) {
      setExiting(true);
    }
  }, [cycleCount, bootstrapReady, exiting]);

  // exit 페이드아웃 시간이 지난 뒤 부모에게 알림 (LoadingPage unmount)
  const exitFiredRef = useRef(false);
  useEffect(() => {
    if (!exiting || exitFiredRef.current) return;
    exitFiredRef.current = true;
    const t = setTimeout(onExitComplete, EXIT_FADE_DURATION_MS);
    return () => clearTimeout(t);
  }, [exiting, onExitComplete]);

  const { overlayStyle, lettersStyle, rootExitStyle } = useLoadingAnimation({
    start: bgLoaded,
    exiting,
  });

  return (
    <Animated.View
      style={[styles.root, rootExitStyle]}
      pointerEvents={exiting ? 'none' : 'auto'}
    >
      <View style={styles.bgWrap} pointerEvents="none">
        <Animated.Image
          source={require('../../../assets/login-bg.png')}
          style={{ width: screenWidth, height: bgImageHeight }}
          resizeMode="cover"
          onLoad={handleBgLoaded}
          onError={handleBgLoaded}
        />
      </View>
      <Animated.View style={[styles.whiteOverlay, overlayStyle]} pointerEvents="none" />
      <CokcokLetters
        containerStyle={lettersStyle}
        start={bgLoaded}
        onCycleEnd={handleCycleEnd}
      />
    </Animated.View>
  );
}
