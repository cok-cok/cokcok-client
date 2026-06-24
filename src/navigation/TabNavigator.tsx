import { useCallback, useMemo, useRef } from 'react';
import { useSharedValue } from 'react-native-reanimated';

import { type BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useRequireAuth } from '../auth';
import { BottomBar } from '../components/BottomBar';
import MyPage from '../pages/MyPage';
import MyRecipeListPage from '../pages/MyRecipeListPage';
import { TabBarContext, type TabBarContextValue, useTabBarContext } from './TabBarContext';
import type { RootStackParamList, TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

function TabBarSlot(props: BottomTabBarProps) {
  const { state, navigation } = props;
  const activeKey = state.routes[state.index]?.name ?? '';
  const { hideValue, scrollToTop, onFabPress } = useTabBarContext();
  const requireAuth = useRequireAuth();

  const handleTabPress = useCallback(
    (key: string) => {
      if (key === activeKey) return;
      if (key === 'MyPage') {
        requireAuth(() => navigation.navigate(key as never));
        return;
      }
      navigation.navigate(key as never);
    },
    [activeKey, navigation, requireAuth],
  );

  return (
    <BottomBar
      activeKey={activeKey}
      onTabPress={handleTabPress}
      onFabPress={onFabPress}
      onScrollToTop={scrollToTop}
      hideValue={hideValue}
    />
  );
}

const renderTabBar = (props: BottomTabBarProps) => <TabBarSlot {...props} />;

export default function TabNavigator() {
  const hideValue = useSharedValue(0);
  const scrollToTopRef = useRef<(() => void) | null>(null);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const requireAuth = useRequireAuth();

  const registerScrollToTop = useCallback((fn: (() => void) | null) => {
    scrollToTopRef.current = fn;
  }, []);

  const scrollToTop = useCallback(() => {
    scrollToTopRef.current?.();
  }, []);

  const onFabPress = useCallback(() => {
    requireAuth(() => navigation.navigate('RecipeForm'));
  }, [requireAuth, navigation]);

  const ctxValue: TabBarContextValue = useMemo(
    () => ({ hideValue, registerScrollToTop, scrollToTop, onFabPress }),
    [hideValue, registerScrollToTop, scrollToTop, onFabPress],
  );

  return (
    <TabBarContext.Provider value={ctxValue}>
      <Tab.Navigator
        id={undefined}
        detachInactiveScreens={false}
        screenOptions={{
          headerShown: false,
          animation: 'shift',
          freezeOnBlur: false,
        }}
        tabBar={renderTabBar}
      >
        <Tab.Screen name="MyRecipeList" component={MyRecipeListPage} />
        <Tab.Screen name="MyPage" component={MyPage} />
      </Tab.Navigator>
    </TabBarContext.Provider>
  );
}
