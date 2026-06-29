import { Platform } from 'react-native';

import type { BottomTabBarItem } from '../BottomTabBar';

export const BOTTOM_BAR_FAB_SIZE = 64;
export const BOTTOM_BAR_BOTTOM_OFFSET = Platform.OS === 'ios' ? 0 : 12;
export const BOTTOM_BAR_HIDE_DISTANCE = 200;
export const BOTTOM_BAR_SCROLL_TOP_HIDE_DISTANCE = BOTTOM_BAR_FAB_SIZE + 32;

export const FAB_ICON_COLOR = '#111827';
export const FAB_TINT_OVERLAY =
  Platform.OS === 'android' ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.93)';

export const BOTTOM_BAR_TABS: BottomTabBarItem[] = [
  {
    key: 'MyRecipeList',
    label: '내 레시피',
    iconInactive: 'book',
    iconActive: 'book-outline',
  },
  {
    key: 'RecommendedRecipes',
    label: '추천 레시피',
    iconInactive: 'restaurant',
    iconActive: 'restaurant-outline',
    disabled: true,
  },
  {
    key: 'MyPage',
    label: '마이페이지',
    iconInactive: 'person',
    iconActive: 'person-outline',
  },
];
