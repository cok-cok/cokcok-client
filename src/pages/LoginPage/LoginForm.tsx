import { useCallback, useRef, useState } from 'react';
import { Keyboard, type StyleProp, TextInput, type ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

import { ApiError, authApi } from '../../api';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { Input } from '../../components/Input';
import { useToast } from '../../components/Toast';
import {
  BRAND_COLOR,
  EMAIL_PLACEHOLDER,
  EMAIL_REGEX,
  INVALID_EMAIL_MESSAGE,
  LOGIN_BUTTON_LABEL,
  NETWORK_ERROR_MESSAGE,
  PASSWORD_PLACEHOLDER,
  TEST_EMAIL,
  TEST_PASSWORD,
} from './LoginPage.constants';
import { styles } from './LoginPage.styles';

type Props = {
  entranceStyle: StyleProp<ViewStyle>;
  onSuccess: () => void;
};

export function LoginForm({ entranceStyle, onSuccess }: Props) {
  const toast = useToast();
  const passwordRef = useRef<TextInput>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = email.length > 0 && password.length > 0 && !submitting;

  const focusPassword = useCallback(() => passwordRef.current?.focus(), []);

  const handleSubmit = useCallback(async () => {
    if (!EMAIL_REGEX.test(email)) {
      toast.error(INVALID_EMAIL_MESSAGE);
      return;
    }

    // TODO 실제 API 붙으면 제거 — 개발 임시 backdoor 계정 (UI 검수용)
    if (email === TEST_EMAIL && password === TEST_PASSWORD) {
      setEmail('');
      setPassword('');
      Keyboard.dismiss();
      onSuccess();
      return;
    }

    setSubmitting(true);
    try {
      const result = await authApi.login({ email, password });
      // TODO: accessToken을 secure storage에 저장 + user를 auth store에 저장
      void result;
      setEmail('');
      setPassword('');
      Keyboard.dismiss();
      onSuccess();
    } catch (err) {
      // 서버 응답이 있는 케이스(4xx/5xx) — 서버가 내려준 message 그대로 노출.
      // 그 외(network, parse, 알 수 없음) — 사용자에게 노출 가능한 일반 안내로 fallback.
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error(NETWORK_ERROR_MESSAGE);
      }
    } finally {
      setSubmitting(false);
    }
  }, [email, password, toast, onSuccess]);

  return (
    <Animated.View style={[styles.form, entranceStyle]} needsOffscreenAlphaCompositing>
      <Input
        variant="filled"
        type="email"
        placeholder={EMAIL_PLACEHOLDER}
        value={email}
        onChangeText={setEmail}
        iconLeft={<Icon name="mail" color={BRAND_COLOR} />}
        returnKeyType="next"
        onSubmitEditing={focusPassword}
      />
      <Input
        ref={passwordRef}
        variant="filled"
        type="password"
        placeholder={PASSWORD_PLACEHOLDER}
        value={password}
        onChangeText={setPassword}
        iconLeft={<Icon name="lock" color={BRAND_COLOR} />}
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
      />
      <Button
        fullWidth
        size="lg"
        label={LOGIN_BUTTON_LABEL}
        disabled={!canSubmit}
        loading={submitting}
        onPress={handleSubmit}
      />
    </Animated.View>
  );
}
