import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { LegalManifestItem } from '../../api';
import { Stepper } from '../../components/Stepper';
import { useToast } from '../../components/Toast';
import type { RootStackParamList } from '../../navigation/types';
import { type AgreedMap, SignupAgreementsStep } from './SignupAgreementsStep';
import { SignupForm } from './SignupForm';
import { SignupHeader } from './SignupHeader';
import { useEntranceAnimation } from './SignupPage.animation';
import { styles } from './SignupPage.styles';
import { SignupSuccessStep } from './SignupSuccessStep';

type Props = NativeStackScreenProps<RootStackParamList, 'Signup'>;

type Step = 'agreements' | 'form' | 'success';

const FORM_VALID_TOTAL = 6;
const SUCCESS_TRANSITION_DELAY_MS = 700;

export default function SignupPage({ navigation }: Props) {
  const toast = useToast();

  const { contentStyle } = useEntranceAnimation();

  const [step, setStep] = useState<Step>('agreements');

  const [manifest, setManifest] = useState<LegalManifestItem[] | null>(null);
  const [agreed, setAgreed] = useState<AgreedMap>({});

  const [formValidCount, setFormValidCount] = useState(0);

  const [submitting, setSubmitting] = useState(false);

  const [circle3Filled, setCircle3Filled] = useState(false);

  const hasAnyInput = Object.keys(agreed).length > 0;

  const exitConfirmedRef = useRef(false);

  const exitToLogin = useCallback(() => {
    exitConfirmedRef.current = true;
    navigation.goBack();
  }, [navigation]);

  const handleBackPress = useCallback(() => {
    if (submitting) return;
    if (!hasAnyInput) {
      exitToLogin();
      return;
    }
    toast.show({
      id: 'signup-exit-confirm',
      type: 'warning',
      title: '나가시겠어요?',
      description: '입력한 정보가 모두 사라집니다.',
      duration: Infinity,
      action: {
        label: '나가기',
        onPress: exitToLogin,
      },
    });
  }, [hasAnyInput, submitting, toast, exitToLogin]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (exitConfirmedRef.current) return;
      (e as unknown as { preventDefault: () => void }).preventDefault();
      handleBackPress();
    });
    return unsubscribe;
  }, [navigation, handleBackPress]);

  useEffect(() => {
    navigation.setOptions({ gestureEnabled: !hasAnyInput });
  }, [navigation, hasAnyInput]);

  const handleAgreementsNext = useCallback(() => setStep('form'), []);

  const handleSignupSuccess = useCallback(() => {
    setCircle3Filled(true);
    const t = setTimeout(() => setStep('success'), SUCCESS_TRANSITION_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  const handleSuccessConfirm = useCallback(() => {
    exitConfirmedRef.current = true;
    navigation.goBack();
  }, [navigation]);

  const line1Progress = useMemo(() => {
    if (!manifest) return 0;
    const required = manifest.filter((i) => i.required);
    if (required.length === 0) return 0;
    const agreedRequired = required.filter((i) => agreed[i.key]).length;
    return agreedRequired / required.length;
  }, [manifest, agreed]);

  const line2Progress = formValidCount / FORM_VALID_TOTAL;

  const completedCount: 0 | 1 | 2 | 3 =
    step === 'success' || circle3Filled ? 3 : step === 'form' ? 2 : 1;

  const circle2Checked = step === 'form' || step === 'success';
  const circle3Checked = circle3Filled || step === 'success';

  const showHeader = step !== 'success';

  return (
    <View style={styles.root}>
      <Animated.View style={styles.flex}>
        {showHeader ? (
          <>
            <SignupHeader
              entranceStyle={contentStyle}
              onBackPress={handleBackPress}
              disabled={submitting}
            />
            <Stepper
              completedCount={completedCount}
              line1Progress={line1Progress}
              line2Progress={line2Progress}
              circle2Checked={circle2Checked}
              circle3Checked={circle3Checked}
            />
          </>
        ) : null}

        <Animated.View key={step} entering={FadeIn.duration(220)} style={styles.flex}>
          {step === 'agreements' ? (
            <SignupAgreementsStep
              agreed={agreed}
              onAgreedChange={setAgreed}
              onManifestReady={setManifest}
              onNext={handleAgreementsNext}
            />
          ) : null}

          {step === 'form' ? (
            <SignupForm
              entranceStyle={contentStyle}
              onSignupSuccess={handleSignupSuccess}
              onValidCountChange={setFormValidCount}
              onSubmittingChange={setSubmitting}
            />
          ) : null}

          {step === 'success' ? (
            <SignupSuccessStep onConfirm={handleSuccessConfirm} />
          ) : null}
        </Animated.View>
      </Animated.View>
    </View>
  );
}
