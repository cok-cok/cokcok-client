import { type ReactNode } from 'react';
import {
  type StyleProp,
  StyleSheet,
  useWindowDimensions,
  View,
  type ViewStyle,
} from 'react-native';
import Animated from 'react-native-reanimated';

import { PHONE_BLUR_RADIUS, PHONE_MAX_WIDTH } from './PhoneFrameBackground.constants';

type Props = {
  // require()로 가져온 로컬 이미지. PNG/JPG.
  source: number;
  // 외곽 블러 + 내부 cover 이미지 양쪽에 동시 적용되는 fade 스타일. 단일 progress로 둘 다 페이드인.
  bgEntranceStyle?: StyleProp<ViewStyle>;
  // 내부 portrait 이미지의 onLoad. 부모가 부트스트랩 게이트로 사용.
  onBgLoad?: () => void;
  // 내부 컬럼(휴대폰 폭) 안에 렌더되는 요소. 흰 오버레이, 폼, 글자 등.
  children?: ReactNode;
};

// 휴대폰 portrait UI를 큰 화면(폴드 펼침, 태블릿)에서도 유지하기 위한 프레임.
// - 외곽: 같은 bg 이미지를 화면 전체에 cover + 강한 블러로 letterbox 채움
// - 내부: PHONE_MAX_WIDTH 캡으로 가운데 정렬된 휴대폰 폭 컬럼, 안에 선명한 bg + 자식 컨텐츠
export function PhoneFrameBackground({
  source,
  bgEntranceStyle,
  onBgLoad,
  children,
}: Props) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const columnWidth = Math.min(screenWidth, PHONE_MAX_WIDTH);

  return (
    <View style={styles.root}>
      {/* 외곽 letterbox 블러 — 화면 전체 cover. Animated.View가 entrance opacity 담당, Image는 dimension만. */}
      <Animated.View style={[styles.outerWrap, bgEntranceStyle]} pointerEvents="none">
        <Animated.Image
          source={source}
          blurRadius={PHONE_BLUR_RADIUS}
          resizeMode="cover"
          style={{ width: screenWidth, height: screenHeight }}
        />
      </Animated.View>

      {/* 내부 컬럼 — 휴대폰 폭으로 가운데 정렬 */}
      <View style={styles.columnWrap} pointerEvents="box-none">
        <View style={[styles.column, { width: columnWidth }]}>
          {/* 컬럼 안 선명 bg — cover sizing으로 컬럼 영역 전체 채움 */}
          <Animated.View style={[styles.innerBgWrap, bgEntranceStyle]} pointerEvents="none">
            <Animated.Image
              source={source}
              resizeMode="cover"
              style={{ width: columnWidth, height: screenHeight }}
              onLoad={onBgLoad}
              onError={onBgLoad}
            />
          </Animated.View>
          {children}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  outerWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  columnWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
  },
  column: {
    flex: 1,
    overflow: 'hidden',
  },
  innerBgWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
