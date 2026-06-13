import { StyleSheet } from 'react-native';

import { LETTER_GAP, PAGE_BG_COLOR } from './LoadingPage.constants';

export const styles = StyleSheet.create({
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
    alignItems: 'flex-end',
  },
  letter: {
    marginHorizontal: LETTER_GAP / 2,
  },
});
