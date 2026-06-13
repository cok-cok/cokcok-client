import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { legalApi, type LegalKey, type LegalManifestItem } from '../../api';
import { Button } from '../../components/Button';
import { Checkbox } from '../../components/Checkbox';
import { Spinner } from '../../components/Spinner';
import { useToast } from '../../components/Toast';
import type { RootStackParamList } from '../../navigation/types';
import { styles as localStyles } from './SignupAgreementsStep.styles';
import { styles as pageStyles } from './SignupPage.styles';

export type AgreedMap = Partial<Record<LegalKey, string>>;

type Props = {
  agreed: AgreedMap;
  onAgreedChange: (next: AgreedMap | ((prev: AgreedMap) => AgreedMap)) => void;
  onManifestReady: (items: LegalManifestItem[]) => void;
  onNext: () => void;
};

export function SignupAgreementsStep({
  agreed,
  onAgreedChange,
  onManifestReady,
  onNext,
}: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const toast = useToast();
  const insets = useSafeAreaInsets();

  const [manifest, setManifest] = useState<LegalManifestItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  const chainRef = useRef<{ queue: LegalManifestItem[]; index: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    legalApi
      .getLegalManifest()
      .then((res) => {
        if (cancelled) return;
        setManifest(res.items);
        onManifestReady(res.items);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        toast.error('약관 정보를 불러오지 못했어요. 잠시 후 다시 시도해주세요.');
        navigation.replace('Login');
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requiredItems = useMemo(() => manifest?.filter((i) => i.required) ?? [], [manifest]);
  const allRequiredAgreed = useMemo(
    () => requiredItems.every((i) => agreed[i.key] === i.version),
    [requiredItems, agreed],
  );
  const allAgreed = useMemo(
    () => (manifest ?? []).every((i) => agreed[i.key] === i.version),
    [manifest, agreed],
  );
  const someAgreed = useMemo(
    () => (manifest ?? []).some((i) => agreed[i.key]),
    [manifest, agreed],
  );

  const singleAgreeCallback = useCallback(
    (k: LegalKey, v: string) => {
      onAgreedChange((prev) => ({ ...prev, [k]: v }));
      navigation.goBack();
    },
    [navigation, onAgreedChange],
  );

  const chainAgreeCallback = useCallback(
    (k: LegalKey, v: string) => {
      onAgreedChange((prev) => ({ ...prev, [k]: v }));
      const state = chainRef.current;
      if (!state) {
        navigation.goBack();
        return;
      }
      const nextIndex = state.index + 1;
      const next = state.queue[nextIndex];
      if (next) {
        chainRef.current = { ...state, index: nextIndex };
        navigation.replace('LegalDocument', {
          key: next.key,
          version: next.version,
          title: next.title,
          onAgree: chainAgreeCallback,
          isOptional: !next.required,
        });
      } else {
        chainRef.current = null;
        navigation.goBack();
      }
    },
    [navigation, onAgreedChange],
  );

  const handleCheckboxPress = useCallback(
    (item: LegalManifestItem) => {
      if (agreed[item.key]) {
        onAgreedChange((prev) => {
          const next = { ...prev };
          delete next[item.key];
          return next;
        });
        return;
      }
      if (!item.hasContent) {
        onAgreedChange((prev) => ({ ...prev, [item.key]: item.version }));
        return;
      }
      chainRef.current = null;
      navigation.navigate('LegalDocument', {
        key: item.key,
        version: item.version,
        title: item.title,
        onAgree: singleAgreeCallback,
        isOptional: !item.required,
      });
    },
    [agreed, navigation, onAgreedChange, singleAgreeCallback],
  );

  const handleViewPress = useCallback(
    (item: LegalManifestItem) => {
      chainRef.current = null;
      navigation.navigate('LegalDocument', {
        key: item.key,
        version: item.version,
        title: item.title,
        onAgree: singleAgreeCallback,
        isOptional: !item.required,
      });
    },
    [navigation, singleAgreeCallback],
  );

  const handleAgreeAllPress = useCallback(() => {
    if (!manifest) return;

    if (allAgreed) {
      onAgreedChange({});
      return;
    }

    const noContentItems = manifest.filter((i) => !i.hasContent);
    if (noContentItems.length > 0) {
      onAgreedChange((prev) => {
        const next = { ...prev };
        noContentItems.forEach((i) => {
          next[i.key] = i.version;
        });
        return next;
      });
    }

    const queue = manifest.filter(
      (i) => i.hasContent && agreed[i.key] !== i.version,
    );
    if (queue.length === 0) return;

    chainRef.current = { queue, index: 0 };
    const first = queue[0];
    navigation.navigate('LegalDocument', {
      key: first.key,
      version: first.version,
      title: first.title,
      onAgree: chainAgreeCallback,
      isOptional: !first.required,
    });
  }, [allAgreed, manifest, agreed, navigation, onAgreedChange, chainAgreeCallback]);

  if (loading || !manifest) {
    return (
      <View style={[pageStyles.stepContainer, localStyles.loadingWrap]}>
        <Spinner color="brand" />
      </View>
    );
  }

  return (
    <View style={pageStyles.stepContainer}>
      <ScrollView contentContainerStyle={pageStyles.stepScroll}>
        <View style={localStyles.list}>
          <Checkbox
            checked={allAgreed}
            indeterminate={someAgreed && !allAgreed}
            onPress={handleAgreeAllPress}
            label="전체 동의"
            size="lg"
            labelStyle={localStyles.allAgreeLabel}
          />
          <View style={localStyles.divider} />
          {manifest.map((item) => {
            const isAgreed = Boolean(agreed[item.key]);
            return (
              <View key={item.key} style={localStyles.itemRow}>
                <View style={localStyles.itemCheckbox}>
                  <Checkbox
                    checked={isAgreed}
                    onPress={() => handleCheckboxPress(item)}
                    label={`${item.required ? '(필수) ' : '(선택) '}${item.title}`}
                  />
                </View>
                {item.hasContent ? (
                  <Pressable
                    onPress={() => handleViewPress(item)}
                    hitSlop={6}
                    accessibilityRole="button"
                    accessibilityLabel={`${item.title} 보기`}
                  >
                    <Text style={localStyles.viewLink}>보기</Text>
                  </Pressable>
                ) : null}
              </View>
            );
          })}
        </View>
      </ScrollView>

      <View style={[pageStyles.stepFooter, { paddingBottom: insets.bottom + 12 }]}>
        <Button
          fullWidth
          size="lg"
          label="다음"
          disabled={!allRequiredAgreed}
          onPress={onNext}
        />
      </View>
    </View>
  );
}
