import { type StyleProp, Text, type ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

import { LOGO_HEIGHT, LOGO_WIDTH, TAGLINE } from './LoginPage.constants';
import { styles } from './LoginPage.styles';

type Props = {
  entranceStyle: StyleProp<ViewStyle>;
  onLogoLoad: () => void;
};

export function LoginHeading({ entranceStyle, onLogoLoad }: Props) {
  return (
    <Animated.View style={[styles.heading, entranceStyle]} needsOffscreenAlphaCompositing>
      <Animated.Image
        source={require('../../../assets/cokcok-logo.png')}
        style={{ width: LOGO_WIDTH, height: LOGO_HEIGHT }}
        resizeMode="contain"
        accessibilityLabel="cokcok 로고"
        onLoad={onLogoLoad}
        onError={onLogoLoad}
      />
      <Text style={styles.tagline}>{TAGLINE}</Text>
    </Animated.View>
  );
}
