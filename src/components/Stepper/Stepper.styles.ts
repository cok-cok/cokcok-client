import { StyleSheet } from 'react-native';

export const BRAND = '#FD4C06';
export const INACTIVE = '#E5E7EB';
export const CIRCLE_SIZE = 22;
export const LINE_HEIGHT = 3;
export const LINE_DURATION = 240;
export const CIRCLE_COLOR_DURATION = 240;

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 12,
    gap: 0,
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lineTrack: {
    flex: 1,
    height: LINE_HEIGHT,
    backgroundColor: INACTIVE,
    borderRadius: LINE_HEIGHT / 2,
    overflow: 'hidden',
    marginHorizontal: 4,
  },
  lineFill: {
    height: '100%',
    backgroundColor: BRAND,
  },
});
