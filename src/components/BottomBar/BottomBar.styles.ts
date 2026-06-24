import { Platform, StyleSheet } from 'react-native';

import { BOTTOM_BAR_FAB_SIZE } from './BottomBar.constants';

export const styles = StyleSheet.create({
  bottomRow: {
    position: 'absolute',
    left: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  tabBarFlex: {
    flex: 1,
  },
  scrollTopSlot: {
    position: 'absolute',
    right: 10,
    width: BOTTOM_BAR_FAB_SIZE,
    height: BOTTOM_BAR_FAB_SIZE,
  },
  fabShadow: {
    width: BOTTOM_BAR_FAB_SIZE,
    height: BOTTOM_BAR_FAB_SIZE,
    borderRadius: BOTTOM_BAR_FAB_SIZE / 2,
    backgroundColor: 'rgba(255,255,255,0.001)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    ...Platform.select({
      android: {
        boxShadow: '0px 1px 6px rgba(0,0,0,0.15)',
      },
    }),
  },
  fabInner: {
    flex: 1,
    borderRadius: BOTTOM_BAR_FAB_SIZE / 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
