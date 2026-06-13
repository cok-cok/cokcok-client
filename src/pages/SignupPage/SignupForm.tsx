import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Keyboard, Platform, ScrollView, type StyleProp, TextInput, View, type ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ApiError, authApi } from '../../api';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { Input } from '../../components/Input';
import { useToast } from '../../components/Toast';
import {
  BRAND_COLOR,
  CODE_CONFIRM_LABEL,
  CODE_REQUIRED_MESSAGE,
  CODE_VERIFIED_LABEL,
  EMAIL_HELPER,
  EMAIL_LABEL,
  EMAIL_PLACEHOLDER,
  EMAIL_REGEX,
  EMAIL_RESEND_LABEL,
  EMAIL_VERIFIED_MESSAGE,
  EMAIL_VERIFY_LABEL,
  FAKE_LATENCY_MS,
  INVALID_EMAIL_MESSAGE,
  INVALID_NICKNAME_MESSAGE,
  INVALID_PASSWORD_MESSAGE,
  NETWORK_ERROR_MESSAGE,
  NICKNAME_AVAILABLE_LABEL,
  NICKNAME_AVAILABLE_MESSAGE,
  NICKNAME_CHECK_LABEL,
  NICKNAME_HELPER,
  NICKNAME_LABEL,
  NICKNAME_PLACEHOLDER,
  NICKNAME_REGEX,
  PASSWORD_CONFIRM_LABEL,
  PASSWORD_CONFIRM_PLACEHOLDER,
  PASSWORD_HELPER,
  PASSWORD_LABEL,
  PASSWORD_MISMATCH_MESSAGE,
  PASSWORD_PLACEHOLDER,
  PASSWORD_REGEX,
  SIGNUP_BUTTON_LABEL,
  USE_MOCK_API,
  VERIFICATION_CODE_LABEL,
  VERIFICATION_CODE_PLACEHOLDER,
  VERIFICATION_CODE_SENT_MESSAGE,
} from './SignupPage.constants';
import { styles } from './SignupPage.styles';
import { formatExpiry } from './SignupPage.utils';
import { useEmailVerification } from './useEmailVerification';
import { useNicknameCheck } from './useNicknameCheck';

const AUTO_FOCUS_DELAY_MS = 50;

type Props = {
  entranceStyle: StyleProp<ViewStyle>;
  onSignupSuccess: () => void;
  onValidCountChange?: (count: number) => void;
  onSubmittingChange?: (submitting: boolean) => void;
};

export function SignupForm({
  entranceStyle,
  onSignupSuccess,
  onValidCountChange,
  onSubmittingChange,
}: Props) {
  const toast = useToast();
  const insets = useSafeAreaInsets();

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const show = Keyboard.addListener(showEvent, (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hide = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const codeRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const passwordConfirmRef = useRef<TextInput>(null);
  const nicknameRef = useRef<TextInput>(null);

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [nickname, setNickname] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const verification = useEmailVerification();
  const nick = useNicknameCheck();

  useEffect(() => {
    verification.reset();
    setCode('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  useEffect(() => {
    nick.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nickname]);

  const emailValid = EMAIL_REGEX.test(email);
  const passwordValid = PASSWORD_REGEX.test(password);
  const passwordsMatch = passwordConfirm.length > 0 && password === passwordConfirm;
  const nicknameValid = NICKNAME_REGEX.test(nickname);

  const canSubmit =
    emailValid &&
    verification.verified &&
    passwordValid &&
    passwordsMatch &&
    nicknameValid &&
    nick.available === true &&
    !submitting;

  const validCount =
    (emailValid ? 1 : 0) +
    (verification.verified ? 1 : 0) +
    (passwordValid ? 1 : 0) +
    (passwordsMatch ? 1 : 0) +
    (nicknameValid ? 1 : 0) +
    (nick.available === true ? 1 : 0);

  useEffect(() => {
    onValidCountChange?.(validCount);
  }, [validCount, onValidCountChange]);

  useEffect(() => {
    onSubmittingChange?.(submitting);
  }, [submitting, onSubmittingChange]);

  const verifyButtonLabel = useMemo(() => {
    if (verification.verified) return '재입력';
    if (verification.cooldownSeconds > 0) return `${EMAIL_RESEND_LABEL} (${verification.cooldownSeconds}s)`;
    if (verification.sent) return EMAIL_RESEND_LABEL;
    return EMAIL_VERIFY_LABEL;
  }, [verification.verified, verification.cooldownSeconds, verification.sent]);

  const codeHelper = useMemo(() => {
    if (verification.verified) return undefined;
    if (!verification.sent) return undefined;
    if (verification.codeExpired) return undefined;
    return `${formatExpiry(verification.expirySeconds)} 안에 입력해주세요`;
  }, [verification.verified, verification.sent, verification.codeExpired, verification.expirySeconds]);

  const codeError = verification.codeExpired ? '인증 코드가 만료되었어요. 다시 인증해주세요.' : undefined;

  const nicknameHelper = useMemo(() => {
    if (nick.available === true) return NICKNAME_AVAILABLE_LABEL;
    return NICKNAME_HELPER;
  }, [nick.available]);

  const handleRequestVerification = useCallback(async () => {
    if (!EMAIL_REGEX.test(email)) {
      toast.error(INVALID_EMAIL_MESSAGE);
      return;
    }
    try {
      await verification.requestCode(email);
      toast.info(VERIFICATION_CODE_SENT_MESSAGE);
      setTimeout(() => codeRef.current?.focus(), AUTO_FOCUS_DELAY_MS);
    } catch (err) {
      if (err instanceof ApiError) toast.error(err.message);
      else toast.error(NETWORK_ERROR_MESSAGE);
    }
  }, [email, verification, toast]);

  const handleConfirmCode = useCallback(async () => {
    if (code.trim().length === 0) {
      toast.error(CODE_REQUIRED_MESSAGE);
      return;
    }
    const result = await verification.confirmCode(email, code.trim());
    if (result.ok) {
      toast.success(EMAIL_VERIFIED_MESSAGE);
      setTimeout(() => passwordRef.current?.focus(), AUTO_FOCUS_DELAY_MS);
    } else {
      toast.error(result.message);
    }
  }, [code, email, verification, toast]);

  // 닉네임 input은 하단 회원가입 버튼 바로 위 — 토스트가 버튼을 가리지 않도록 모두 상단 표시
  const handleCheckNickname = useCallback(async () => {
    if (!NICKNAME_REGEX.test(nickname)) {
      toast.error(INVALID_NICKNAME_MESSAGE, { position: 'top' });
      return;
    }
    const result = await nick.check(nickname);
    if (result.ok) {
      toast.success(NICKNAME_AVAILABLE_MESSAGE, { position: 'top' });
      nicknameRef.current?.blur();
      Keyboard.dismiss();
    } else {
      toast.error(result.message, { position: 'top' });
    }
  }, [nickname, nick, toast]);

  const prevPasswordsMatchRef = useRef(false);
  useEffect(() => {
    if (passwordsMatch && !prevPasswordsMatchRef.current) {
      if (passwordConfirmRef.current?.isFocused()) {
        nicknameRef.current?.focus();
      }
    }
    prevPasswordsMatchRef.current = passwordsMatch;
  }, [passwordsMatch]);

  const handleSubmit = useCallback(async () => {
    if (!emailValid) {
      toast.error(INVALID_EMAIL_MESSAGE);
      return;
    }
    if (!verification.verified) {
      toast.error('이메일 인증을 완료해주세요.');
      return;
    }
    if (!passwordValid) {
      toast.error(INVALID_PASSWORD_MESSAGE);
      return;
    }
    if (!passwordsMatch) {
      toast.error(PASSWORD_MISMATCH_MESSAGE);
      return;
    }
    if (!nicknameValid) {
      toast.error(INVALID_NICKNAME_MESSAGE);
      return;
    }
    if (nick.available !== true) {
      toast.error('닉네임 중복 확인을 진행해주세요.');
      return;
    }

    setSubmitting(true);
    try {
      if (USE_MOCK_API) {
        await new Promise((r) => setTimeout(r, FAKE_LATENCY_MS));
      } else {
        await authApi.signup({ email, password, nickname });
      }

      // submitting을 풀지 않고 유지 → success step 전환까지 버튼이 spinner 상태 유지
      Keyboard.dismiss();
      onSignupSuccess();
    } catch (err) {
      if (err instanceof ApiError) toast.error(err.message);
      else toast.error(NETWORK_ERROR_MESSAGE);
      setSubmitting(false);
    }
  }, [
    email,
    password,
    nickname,
    emailValid,
    passwordValid,
    passwordsMatch,
    nicknameValid,
    verification.verified,
    nick.available,
    toast,
    onSignupSuccess,
  ]);

  const passwordConfirmError = useMemo(() => {
    if (passwordConfirm.length === 0) return undefined;
    if (passwordsMatch) return undefined;
    return PASSWORD_MISMATCH_MESSAGE;
  }, [passwordConfirm, passwordsMatch]);

  const verifyButtonDisabled =
    !verification.verified &&
    (verification.busy || !emailValid || verification.cooldownSeconds > 0);

  const handleVerifyButtonPress = useCallback(() => {
    if (verification.verified) {
      verification.reset();
      setCode('');
      return;
    }
    handleRequestVerification();
  }, [verification, handleRequestVerification]);

  const codeInputEditable =
    verification.sent && !verification.verified && !verification.codeExpired;

  const codeConfirmDisabled =
    verification.verified || verification.busy || !codeInputEditable || code.trim().length === 0;

  const nicknameCheckDisabled = !nicknameValid || nick.busy || nick.available === true;

  const focusPasswordConfirm = useCallback(() => passwordConfirmRef.current?.focus(), []);
  const focusNickname = useCallback(() => nicknameRef.current?.focus(), []);

  return (
    <View style={styles.stepContainer}>
      <ScrollView
        contentContainerStyle={[
          styles.stepScroll,
          { paddingBottom: keyboardHeight + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View style={[styles.form, entranceStyle]} needsOffscreenAlphaCompositing>
          <Input
            variant="filled"
            type="email"
            label={EMAIL_LABEL}
            required
            placeholder={EMAIL_PLACEHOLDER}
            helperText={!verification.verified ? EMAIL_HELPER : undefined}
            value={email}
            onChangeText={setEmail}
            iconLeft={<Icon name="mail" color={BRAND_COLOR} />}
            editable={!verification.verified}
            completed={verification.verified}
            trailingAction={
              <Button
                variant="secondary"
                size="md"
                label={verifyButtonLabel}
                disabled={verifyButtonDisabled}
                loading={verification.busy && !verification.sent}
                onPress={handleVerifyButtonPress}
              />
            }
          />

          {verification.sent ? (
            <Input
              ref={codeRef}
              variant="filled"
              label={VERIFICATION_CODE_LABEL}
              required
              placeholder={VERIFICATION_CODE_PLACEHOLDER}
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              editable={codeInputEditable}
              helperText={codeHelper}
              error={codeError}
              trailingAction={
                <Button
                  variant={verification.verified ? 'secondary' : 'primary'}
                  size="md"
                  label={verification.verified ? CODE_VERIFIED_LABEL : CODE_CONFIRM_LABEL}
                  disabled={codeConfirmDisabled}
                  loading={verification.busy && verification.sent && !verification.verified}
                  onPress={handleConfirmCode}
                />
              }
            />
          ) : null}

          <Input
            ref={passwordRef}
            variant="filled"
            type="password"
            label={PASSWORD_LABEL}
            required
            placeholder={PASSWORD_PLACEHOLDER}
            value={password}
            onChangeText={setPassword}
            iconLeft={<Icon name="lock" color={BRAND_COLOR} />}
            helperText={PASSWORD_HELPER}
            completed={passwordValid}
            returnKeyType="next"
            onSubmitEditing={focusPasswordConfirm}
          />

          <Input
            ref={passwordConfirmRef}
            variant="filled"
            type="password"
            label={PASSWORD_CONFIRM_LABEL}
            required
            placeholder={PASSWORD_CONFIRM_PLACEHOLDER}
            value={passwordConfirm}
            onChangeText={setPasswordConfirm}
            iconLeft={<Icon name="lock" color={BRAND_COLOR} />}
            error={passwordConfirmError}
            completed={passwordsMatch}
            returnKeyType="next"
            onSubmitEditing={focusNickname}
          />

          <Input
            ref={nicknameRef}
            variant="filled"
            label={NICKNAME_LABEL}
            required
            placeholder={NICKNAME_PLACEHOLDER}
            value={nickname}
            onChangeText={setNickname}
            iconLeft={<Icon name="user" color={BRAND_COLOR} />}
            helperText={nicknameHelper}
            editable={true}
            completed={nick.available === true}
            trailingAction={
              <Button
                variant="secondary"
                size="md"
                label={nick.available === true ? NICKNAME_AVAILABLE_LABEL : NICKNAME_CHECK_LABEL}
                disabled={nicknameCheckDisabled}
                loading={nick.busy}
                onPress={handleCheckNickname}
              />
            }
          />
        </Animated.View>
      </ScrollView>

      <View style={[styles.stepFooter, { paddingBottom: insets.bottom + 12 }]}>
        <Button
          fullWidth
          size="lg"
          label={SIGNUP_BUTTON_LABEL}
          disabled={!canSubmit}
          loading={submitting}
          onPress={handleSubmit}
        />
      </View>
    </View>
  );
}
