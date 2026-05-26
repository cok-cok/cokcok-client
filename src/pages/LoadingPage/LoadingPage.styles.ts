import { StyleSheet } from 'react-native';

import { LETTER_GAP, PAGE_BG_COLOR } from './LoadingPage.constants';

export const styles = StyleSheet.create({
  // RootNavigator 위에 oerlay로 깔리는 형태 — absoluteFill
  root: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: PAGE_BG_COLOR,
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
    alignItems: 'flex-end', // 아래단 기준 정렬 (K가 길쭉해서 위로 솟음)
  },
  letter: {
    marginHorizontal: LETTER_GAP / 2,
  },
});
