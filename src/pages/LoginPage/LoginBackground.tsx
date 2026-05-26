import { type StyleProp, useWindowDimensions, type ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

import { BG_ASPECT_RATIO } from './LoginPage.constants';
import { styles } from './LoginPage.styles';

type Props = {
  entranceStyle: StyleProp<ViewStyle>;
  onLoad: () => void;
};

export function LoginBackground({ entranceStyle, onLoad }: Props) {
  const { width: screenWidth } = useWindowDimensions();
  const bgImageHeight = screenWidth / BG_ASPECT_RATIO;

  return (
    <Animated.View style={[styles.bgWrap, entranceStyle]} pointerEvents="none">
      <Animated.Image
        source={require('../../../assets/login-bg.png')}
        style={{ width: screenWidth, height: bgImageHeight }}
        resizeMode="cover"
        onLoad={onLoad}
        onError={onLoad}
      />
    </Animated.View>
  );
}
