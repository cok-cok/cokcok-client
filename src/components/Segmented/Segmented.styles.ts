import { Platform, StyleSheet } from 'react-native';

export const SEGMENTED_HEIGHT = 36;
export const SEGMENTED_PADDING_H = 3;
export const SEGMENTED_INDICATOR_INSET_V = 3;

export const SEGMENTED_ANDROID_BG = 'rgba(235,238,242,0.9)';
export const SEGMENTED_IOS_TINT_OVERLAY = 'rgba(235,238,242,0.65)';

export const SEGMENTED_INDICATOR_BG =
  Platform.OS === 'android' ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.9)';
export const SEGMENTED_INDICATOR_BORDER = 'rgba(255,255,255,0.85)';

export const styles = StyleSheet.create({
  bar: {
    height: SEGMENTED_HEIGHT,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SEGMENTED_PADDING_H,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  iosTintOverlay: {
    backgroundColor: SEGMENTED_IOS_TINT_OVERLAY,
  },
  indicator: {
    position: 'absolute',
    top: SEGMENTED_INDICATOR_INSET_V,
    bottom: SEGMENTED_INDICATOR_INSET_V,
    left: 0,
    borderRadius: 999,
    backgroundColor: SEGMENTED_INDICATOR_BG,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: SEGMENTED_INDICATOR_BORDER,
    ...Platform.select({
      android: {
        boxShadow: '0px 1px 4px rgba(0,0,0,0.08)',
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
      },
    }),
  },
  item: {
    height: SEGMENTED_HEIGHT,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
