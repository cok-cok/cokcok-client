import { useCallback } from 'react';
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useFocusEffect } from '@react-navigation/native';

import { useTabBarContext } from '../../navigation/TabBarContext';

const HIDE_DELTA_THRESHOLD = 2;
const TOP_THRESHOLD = 8;
const HIDE_DURATION_MS = 250;
const RESET_DURATION_MS = 200;

type UseBottomBarScrollOptions = {
  hideOnScroll?: boolean;
  resetScrollOnFocus?: boolean;
};

export function useBottomBarScroll(options: UseBottomBarScrollOptions = {}) {
  const { hideOnScroll = true, resetScrollOnFocus = true } = options;

  const { hideValue, registerScrollToTop } = useTabBarContext();
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();
  const lastY = useSharedValue(0);

  const scrollToTop = useCallback(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  }, [scrollViewRef]);

  useFocusEffect(
    useCallback(() => {
      let frameId: number | null = null;
      if (resetScrollOnFocus) {
        frameId = requestAnimationFrame(() => {
          scrollViewRef.current?.scrollTo({ y: 0, animated: false });
        });
      }
      hideValue.value = withTiming(0, { duration: RESET_DURATION_MS });
      lastY.value = 0;

      registerScrollToTop(scrollToTop);
      return () => {
        if (frameId !== null) cancelAnimationFrame(frameId);
        registerScrollToTop(null);
      };
    }, [hideValue, lastY, registerScrollToTop, resetScrollOnFocus, scrollToTop, scrollViewRef]),
  );

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      if (!hideOnScroll) {
        lastY.value = event.contentOffset.y;
        return;
      }

      const currentY = event.contentOffset.y;
      const contentHeight = event.contentSize.height;
      const viewportHeight = event.layoutMeasurement.height;
      const maxScroll = Math.max(0, contentHeight - viewportHeight);
      const isOverscroll = currentY < 0 || currentY > maxScroll;

      if (!isOverscroll) {
        const delta = currentY - lastY.value;

        if (currentY <= TOP_THRESHOLD) {
          hideValue.value = withTiming(0, { duration: HIDE_DURATION_MS });
        } else if (delta > HIDE_DELTA_THRESHOLD) {
          hideValue.value = withTiming(1, { duration: HIDE_DURATION_MS });
        } else if (delta < -HIDE_DELTA_THRESHOLD) {
          hideValue.value = withTiming(0, { duration: HIDE_DURATION_MS });
        }
      }

      lastY.value = currentY;
    },
  });

  return { scrollViewRef, onScroll };
}
