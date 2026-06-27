import { Platform, StyleSheet } from 'react-native';

export const END_MESSAGE_SHOW_MS = 1000;
export const END_MESSAGE_FADE_IN_MS = 200;
export const END_MESSAGE_FADE_OUT_MS = 300;
export const SPINNER_FADE_IN_MS = Platform.OS === 'ios' ? 100 : 200;
export const SPINNER_FADE_OUT_MS = 150;

const END_MESSAGE_COLOR = '#9CA3AF';

export const styles = StyleSheet.create({
  container: {
    position: 'relative',
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  layer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  endMessage: {
    fontSize: 14,
    color: END_MESSAGE_COLOR,
  },
});
