import { StyleSheet } from 'react-native';

export const SEGMENTED_HEIGHT = 36;
export const SEGMENTED_ITEM_HEIGHT = 30;
export const SEGMENTED_PADDING = 3;

const TRACK_BG = '#EDEEF1';
const INDICATOR_BG = '#FFFFFF';
const ACTIVE_TEXT = '#111827';
const INACTIVE_TEXT = '#6B7280';

export const SEGMENTED_ACTIVE_COLOR = ACTIVE_TEXT;
export const SEGMENTED_INACTIVE_COLOR = INACTIVE_TEXT;

export const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    alignItems: 'center',
    height: SEGMENTED_HEIGHT,
    borderRadius: SEGMENTED_HEIGHT / 2,
    backgroundColor: TRACK_BG,
    padding: SEGMENTED_PADDING,
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    top: SEGMENTED_PADDING,
    height: SEGMENTED_ITEM_HEIGHT,
    borderRadius: SEGMENTED_ITEM_HEIGHT / 2,
    backgroundColor: INDICATOR_BG,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  item: {
    height: SEGMENTED_ITEM_HEIGHT,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
});
