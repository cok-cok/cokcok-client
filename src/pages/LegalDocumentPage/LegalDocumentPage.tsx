import { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { legalApi } from '../../api';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { Spinner } from '../../components/Spinner';
import { useToast } from '../../components/Toast';
import type { RootStackParamList } from '../../navigation/types';
import { markdownStyles, styles } from './LegalDocumentPage.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'LegalDocument'>;

const BACK_ICON_SIZE = 28;

export default function LegalDocumentPage({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const { key, version, title, onAgree, isOptional } = route.params;

  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    legalApi
      .getLegalContent(key, version)
      .then((md) => {
        if (!cancelled) {
          setContent(md);
          setLoading(false);
        }
      })
      .catch(() => {
        if (cancelled) return;
        toast.error('약관을 불러오지 못했어요. 잠시 후 다시 시도해주세요.');
        navigation.goBack();
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, version]);

  const handleCancel = useCallback(() => navigation.goBack(), [navigation]);

  const handleAgree = useCallback(() => {
    onAgree(key, version);
  }, [onAgree, key, version]);

  const handleDecline = useCallback(() => navigation.goBack(), [navigation]);

  return (
    <View style={styles.root}>
      <View style={{ paddingTop: insets.top }}>
        <View style={styles.header}>
          <Pressable
            onPress={handleCancel}
            style={styles.headerBack}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="취소"
          >
            <Icon name="chevronLeft" size={BACK_ICON_SIZE} />
          </Pressable>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {title}
          </Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingFull}>
          <Spinner color="brand" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 24 }]}
        >
          <Markdown style={markdownStyles}>{content ?? ''}</Markdown>
          <View style={styles.agreeWrap}>
            {isOptional ? (
              <View style={styles.agreeRow}>
                <View style={styles.agreeRowItem}>
                  <Button
                    fullWidth
                    size="lg"
                    variant="normal"
                    label="동의 안 함"
                    onPress={handleDecline}
                  />
                </View>
                <View style={styles.agreeRowItem}>
                  <Button fullWidth size="lg" label="동의" onPress={handleAgree} />
                </View>
              </View>
            ) : (
              <Button fullWidth size="lg" label="동의" onPress={handleAgree} />
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
