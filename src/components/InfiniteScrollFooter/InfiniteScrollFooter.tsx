import { memo, useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { Spinner } from '../Spinner';
import {
  END_MESSAGE_FADE_IN_MS,
  END_MESSAGE_FADE_OUT_MS,
  END_MESSAGE_SHOW_MS,
  SPINNER_FADE_IN_MS,
  SPINNER_FADE_OUT_MS,
  styles,
} from './InfiniteScrollFooter.styles';
import type { InfiniteScrollFooterProps } from './InfiniteScrollFooter.types';

const DEFAULT_END_MESSAGE = '더 이상 불러올 항목이 없어요';

function InfiniteScrollFooterInner({
  isLoadingMore,
  endReachedKey,
  endMessage = DEFAULT_END_MESSAGE,
}: InfiniteScrollFooterProps) {
  const spinnerOpacity = useSharedValue(0);
  const messageOpacity = useSharedValue(0);

  useEffect(() => {
    spinnerOpacity.value = withTiming(isLoadingMore ? 1 : 0, {
      duration: isLoadingMore ? SPINNER_FADE_IN_MS : SPINNER_FADE_OUT_MS,
    });
  }, [isLoadingMore, spinnerOpacity]);

  useEffect(() => {
    if (endReachedKey == null || endReachedKey <= 0) return;
    messageOpacity.value = withTiming(1, { duration: END_MESSAGE_FADE_IN_MS });
    const showTimer = setTimeout(() => {
      messageOpacity.value = withTiming(0, { duration: END_MESSAGE_FADE_OUT_MS });
    }, END_MESSAGE_FADE_IN_MS + END_MESSAGE_SHOW_MS);
    return () => clearTimeout(showTimer);
  }, [endReachedKey, messageOpacity]);

  const spinnerStyle = useAnimatedStyle(() => ({ opacity: spinnerOpacity.value }));
  const messageStyle = useAnimatedStyle(() => ({ opacity: messageOpacity.value }));

  const triggered = endReachedKey != null && endReachedKey > 0;

  return (
    <View style={styles.container}>
      {isLoadingMore || spinnerOpacity.value > 0 ? (
        <Animated.View style={[styles.layer, spinnerStyle]} pointerEvents="none">
          <Spinner />
        </Animated.View>
      ) : null}
      {triggered ? (
        <Animated.View style={[styles.layer, messageStyle]} pointerEvents="none">
          <Text style={styles.endMessage}>{endMessage}</Text>
        </Animated.View>
      ) : null}
    </View>
  );
}

export const InfiniteScrollFooter = memo(InfiniteScrollFooterInner);
