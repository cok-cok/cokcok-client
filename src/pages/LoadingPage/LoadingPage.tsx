import { useCallback, useEffect, useRef, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { CokcokLetters } from './CokcokLetters';
import { useLoadingAnimation } from './LoadingPage.animation';
import { BG_ASPECT_RATIO, EXIT_FADE_DURATION_MS } from './LoadingPage.constants';
import { styles } from './LoadingPage.styles';

type Props = {
  // 네이티브 스플래시 dismiss 완료 (App에서 SplashScreen.hideAsync resolve 후 true)
  splashHidden: boolean;
  // App-level bootstrap 완료 — 로직 게이트
  bootstrapReady: boolean;
  // exit 페이드아웃까지 모두 끝났을 때 호출 — 부모가 LoadingPage를 unmount
  onExitComplete: () => void;
};

export function LoadingPage({ splashHidden, bootstrapReady, onExitComplete }: Props) {
  const { width: screenWidth } = useWindowDimensions();
  const bgImageHeight = screenWidth / BG_ASPECT_RATIO;

  const [bgImageLoaded, setBgImageLoaded] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  const [exiting, setExiting] = useState(false);

  // 네이티브 스플래시가 사라진 뒤 + bg 이미지 로드 완료 → 시퀀스 시작.
  // 스플래시 dismiss 전에 fade-in을 시작하면 스플래시에 가려 사용자가 못 봄.
  const bgReady = splashHidden && bgImageLoaded;

  const handleBgImageLoaded = useCallback(() => setBgImageLoaded(true), []);
  const handleCycleEnd = useCallback(() => setCycleCount((c) => c + 1), []);

  // 시각 게이트(점프 1사이클 완료) + 로직 게이트(bootstrap 완료) 모두 만족 시 exit
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

  const { bgStyle, overlayStyle, lettersStyle, rootExitStyle } = useLoadingAnimation({
    bgReady,
    exiting,
  });

  return (
    <Animated.View
      style={[styles.root, rootExitStyle]}
      pointerEvents={exiting ? 'none' : 'auto'}
    >
      <Animated.View style={[styles.bgWrap, bgStyle]} pointerEvents="none">
        <View>
          <Animated.Image
            source={require('../../../assets/login-bg.png')}
            style={{ width: screenWidth, height: bgImageHeight }}
            resizeMode="cover"
            onLoad={handleBgImageLoaded}
            onError={handleBgImageLoaded}
          />
        </View>
      </Animated.View>
      <Animated.View style={[styles.whiteOverlay, overlayStyle]} pointerEvents="none" />
      <CokcokLetters containerStyle={lettersStyle} start={bgReady} onCycleEnd={handleCycleEnd} />
    </Animated.View>
  );
}
