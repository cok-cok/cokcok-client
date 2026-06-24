import { memo } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomTabBar } from '../BottomTabBar';
import {
  BOTTOM_BAR_BOTTOM_OFFSET,
  BOTTOM_BAR_HIDE_DISTANCE,
  BOTTOM_BAR_SCROLL_TOP_HIDE_DISTANCE,
  BOTTOM_BAR_TABS,
  FAB_ICON_COLOR,
} from './BottomBar.constants';
import { styles } from './BottomBar.styles';
import type { BottomBarProps } from './BottomBar.types';
import { GlassFab } from './GlassFab';

function BottomBarInner({ activeKey, onTabPress, onFabPress, onScrollToTop, hideValue, testID }: BottomBarProps) {
  const insets = useSafeAreaInsets();
  const bottomY = insets.bottom + BOTTOM_BAR_BOTTOM_OFFSET;

  const bottomRowAnimated = useAnimatedStyle(() => ({
    transform: [{ translateY: hideValue.value * BOTTOM_BAR_HIDE_DISTANCE }],
  }));

  const scrollTopAnimated = useAnimatedStyle(() => ({
    transform: [{ translateX: (1 - hideValue.value) * BOTTOM_BAR_SCROLL_TOP_HIDE_DISTANCE }],
    opacity: hideValue.value,
  }));

  return (
    <View testID={testID}>
      <Animated.View style={[styles.bottomRow, { bottom: bottomY }, bottomRowAnimated]} pointerEvents="box-none">
        <View style={styles.tabBarFlex}>
          <BottomTabBar items={BOTTOM_BAR_TABS} activeKey={activeKey} onTabPress={onTabPress} />
        </View>
        <GlassFab icon="plus" iconColor={FAB_ICON_COLOR} onPress={onFabPress} accessibilityLabel="레시피 작성" />
      </Animated.View>

      <Animated.View style={[styles.scrollTopSlot, { bottom: bottomY }, scrollTopAnimated]} pointerEvents="box-none">
        <GlassFab icon="arrowUp" iconColor={FAB_ICON_COLOR} onPress={onScrollToTop} accessibilityLabel="맨 위로" />
      </Animated.View>
    </View>
  );
}

export const BottomBar = memo(BottomBarInner);
