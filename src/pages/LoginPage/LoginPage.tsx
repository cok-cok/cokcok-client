import { useCallback, useState } from 'react';
import { Keyboard, Pressable, ScrollView, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../../navigation/types';
import { LoginBackground } from './LoginBackground';
import { LoginForm } from './LoginForm';
import { LoginHeading } from './LoginHeading';
import { LoginLinks } from './LoginLinks';
import { useEntranceAnimation, useKeyboardPadding } from './LoginPage.animation';
import { styles } from './LoginPage.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginPage({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const keyboardPadStyle = useKeyboardPadding();

  const [bgLoaded, setBgLoaded] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const { bgStyle, overlayStyle, contentStyle } = useEntranceAnimation(bgLoaded && logoLoaded);

  const handleBgLoaded = useCallback(() => setBgLoaded(true), []);
  const handleLogoLoaded = useCallback(() => setLogoLoaded(true), []);
  const handleLoginSuccess = useCallback(() => navigation.navigate('MyRecipeList'), [navigation]);
  const handleSignupPress = useCallback(() => navigation.navigate('Signup'), [navigation]);
  const handleDismiss = useCallback(() => Keyboard.dismiss(), []);

  return (
    <View style={styles.root}>
      <LoginBackground entranceStyle={bgStyle} onLoad={handleBgLoaded} />
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
    </View>
  );
}
