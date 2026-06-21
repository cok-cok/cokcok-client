import { StyleSheet } from 'react-native';

import { PAGE_BG_COLOR } from './SignupPage.constants';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: PAGE_BG_COLOR,
  },
  flex: { flex: 1 },
  form: {
    gap: 14,
  },
  stepContainer: {
    flex: 1,
  },
  stepScroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
  },
  stepFooter: {
    paddingHorizontal: 24,
    paddingTop: 12,
  },
});
