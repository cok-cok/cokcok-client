import { Platform, StyleSheet } from 'react-native';

import {
  BOTTOM_TAB_BAR_COLOR,
  BOTTOM_TAB_BAR_HEIGHT,
  BOTTOM_TAB_BAR_INDICATOR_BG,
  BOTTOM_TAB_BAR_INDICATOR_BORDER,
  BOTTOM_TAB_BAR_INDICATOR_INSET_V,
  BOTTOM_TAB_BAR_PADDING_H,
} from './BottomTabBar.constants';

export const styles = StyleSheet.create({
  bar: {
    height: BOTTOM_TAB_BAR_HEIGHT,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: BOTTOM_TAB_BAR_PADDING_H,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    ...Platform.select({
      android: {
        boxShadow: '0px 1px 8px rgba(0,0,0,0.15)',
      },
    }),
  },
  indicator: {
    position: 'absolute',
    top: BOTTOM_TAB_BAR_INDICATOR_INSET_V,
    bottom: BOTTOM_TAB_BAR_INDICATOR_INSET_V,
    left: 0,
    borderRadius: 999,
    backgroundColor: BOTTOM_TAB_BAR_INDICATOR_BG,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: BOTTOM_TAB_BAR_INDICATOR_BORDER,
    ...Platform.select({
      android: {
        boxShadow: '0px 1px 3px rgba(0,0,0,0.12)',
      },
    }),
  },
  itemWrap: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: -0.1,
    includeFontPadding: false,
    color: BOTTOM_TAB_BAR_COLOR,
  },
});
