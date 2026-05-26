import { useCallback } from 'react';
import { type StyleProp, Text, View, type ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

import { Button } from '../../components/Button';
import { useToast } from '../../components/Toast';
import {
  buildComingSoonMessage,
  COMING_SOON_DESCRIPTION,
  FIND_EMAIL_LABEL,
  LINK_SEPARATOR,
  LINK_TEXT_COLOR,
  RESET_PASSWORD_LABEL,
  SIGNUP_BUTTON_LABEL,
} from './LoginPage.constants';
import { styles } from './LoginPage.styles';

type Props = {
  entranceStyle: StyleProp<ViewStyle>;
  onSignupPress: () => void;
};

const labelStyleOverride = { color: LINK_TEXT_COLOR };

export function LoginLinks({ entranceStyle, onSignupPress }: Props) {
  const toast = useToast();

  const showComingSoon = useCallback(
    (feature: string) => {
      toast.info(buildComingSoonMessage(feature), { description: COMING_SOON_DESCRIPTION });
    },
    [toast],
  );

  const handleFindEmail = useCallback(() => showComingSoon(FIND_EMAIL_LABEL), [showComingSoon]);
  const handleResetPassword = useCallback(
    () => showComingSoon(RESET_PASSWORD_LABEL),
    [showComingSoon],
  );

  return (
    <Animated.View style={entranceStyle} needsOffscreenAlphaCompositing>
      <View style={styles.divider} />
      <View style={styles.linksRow}>
        <Button
          variant="text"
          size="sm"
          label={FIND_EMAIL_LABEL}
          labelStyle={labelStyleOverride}
          onPress={handleFindEmail}
        />
        <Text style={styles.linkSeparator}>{LINK_SEPARATOR}</Text>
        <Button
          variant="text"
          size="sm"
          label={RESET_PASSWORD_LABEL}
          labelStyle={labelStyleOverride}
          onPress={handleResetPassword}
        />
        <Text style={styles.linkSeparator}>{LINK_SEPARATOR}</Text>
        <Button
          variant="text"
          size="sm"
          label={SIGNUP_BUTTON_LABEL}
          labelStyle={labelStyleOverride}
          onPress={onSignupPress}
        />
      </View>
    </Animated.View>
  );
}
