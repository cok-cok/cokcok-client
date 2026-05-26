import { StyleSheet } from 'react-native';

import { LETTER_GAP, LETTER_HEIGHT, SPLASH_BG_COLOR } from './LoadingPage.constants';

export const styles = StyleSheet.create({
  // RootNavigator 위에 오버레이로 깔리는 형태 — absoluteFill
  root: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: SPLASH_BG_COLOR,
  },
  bgWrap: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  whiteOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
  },
  lettersWrap: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lettersRow: {
    flexDirection: 'row',
    alignItems: 'flex-end', // K가 길쭉해서 baseline 정렬
  },
  letter: {
    height: LETTER_HEIGHT,
    marginHorizontal: LETTER_GAP / 2,
  },
});
