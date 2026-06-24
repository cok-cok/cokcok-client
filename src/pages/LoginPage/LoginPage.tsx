import { useCallback, useState } from 'react';
import { Keyboard, Pressable, ScrollView, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { PageHeader } from '../../components/PageHeader';
import { PhoneFrameBackground } from '../../components/PhoneFrameBackground';
import { Spinner } from '../../components/Spinner';
import type { RootStackParamList } from '../../navigation/types';
import { LoginForm } from './LoginForm';
import { LoginHeading } from './LoginHeading';
import { LoginLinks } from './LoginLinks';
import { useEntranceAnimation, useKeyboardPadding } from './LoginPage.animation';
import { styles } from './LoginPage.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const BG_SOURCE = require('../../../assets/login-bg.png');

export default function LoginPage({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const keyboardPadStyle = useKeyboardPadding();

  const [bgLoaded, setBgLoaded] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const ready = bgLoaded && logoLoaded;
  const { bgStyle, overlayStyle, contentStyle } = useEntranceAnimation(ready);

  const handleBgLoaded = useCallback(() => setBgLoaded(true), []);
  const handleLogoLoaded = useCallback(() => setLogoLoaded(true), []);
  const handleLoginSuccess = useCallback(() => navigation.navigate('Tabs'), [navigation]);
  const handleSignupPress = useCallback(() => navigation.navigate('Signup'), [navigation]);
  const handleBackPress = useCallback(() => navigation.goBack(), [navigation]);
  const handleDismiss = useCallback(() => Keyboard.dismiss(), []);

  return (
    <View style={styles.root}>
      <PhoneFrameBackground source={BG_SOURCE} bgEntranceStyle={bgStyle} onBgLoad={handleBgLoaded}>
        <Animated.View style={[styles.whiteOverlay, overlayStyle]} pointerEvents="none" />

        <Animated.View style={[styles.flex, keyboardPadStyle]}>
          <ScrollView
            contentContainerStyle={[
              styles.scroll,
              { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 },
            ]}
            keyboardShouldPersistTaps="handled"
          >
            <Pressable style={styles.dismissOverlay} onPress={handleDismiss} />
            <LoginHeading entranceStyle={contentStyle} onLogoLoad={handleLogoLoaded} />
            <LoginForm entranceStyle={contentStyle} onSuccess={handleLoginSuccess} />
            <LoginLinks entranceStyle={contentStyle} onSignupPress={handleSignupPress} />
          </ScrollView>
        </Animated.View>

        <PageHeader
          left={<PageHeader.BackButton onPress={handleBackPress} />}
          style={contentStyle}
        />

        {!ready ? (
          <View style={styles.loadingOverlay} pointerEvents="none">
            <Spinner color="brand" size="lg" />
          </View>
        ) : null}
      </PhoneFrameBackground>
    </View>
  );
}
