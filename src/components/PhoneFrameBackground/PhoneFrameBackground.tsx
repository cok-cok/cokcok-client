import { type ReactNode } from 'react';
import {
  type StyleProp,
  StyleSheet,
  useWindowDimensions,
  View,
  type ViewStyle,
} from 'react-native';
import Animated from 'react-native-reanimated';

import { Image as ExpoImage, type ImageSource } from 'expo-image';

import { PHONE_BLUR_RADIUS, PHONE_MAX_WIDTH } from './PhoneFrameBackground.constants';

const AnimatedExpoImage = Animated.createAnimatedComponent(ExpoImage);

type Props = {
  source: number;
  bgEntranceStyle?: StyleProp<ViewStyle>;
  onBgLoad?: () => void;
  children?: ReactNode;
};

export function PhoneFrameBackground({
  source,
  bgEntranceStyle,
  onBgLoad,
  children,
}: Props) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const columnWidth = Math.min(screenWidth, PHONE_MAX_WIDTH);

  const imageSource: ImageSource = source as unknown as ImageSource;

  return (
    <View style={styles.root}>
      <Animated.View style={[styles.outerWrap, bgEntranceStyle]} pointerEvents="none">
        <ExpoImage
          source={imageSource}
          blurRadius={PHONE_BLUR_RADIUS}
          contentFit="cover"
          cachePolicy="memory-disk"
          style={{ width: screenWidth, height: screenHeight }}
        />
      </Animated.View>

      <View style={styles.columnWrap} pointerEvents="box-none">
        <View style={[styles.column, { width: columnWidth }]}>
          <Animated.View style={[styles.innerBgWrap, bgEntranceStyle]} pointerEvents="none">
            <AnimatedExpoImage
              source={imageSource}
              contentFit="cover"
              cachePolicy="memory-disk"
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
