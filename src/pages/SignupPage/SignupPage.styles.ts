import { StyleSheet } from 'react-native';

import { PAGE_BG_COLOR } from './SignupPage.constants';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: PAGE_BG_COLOR,
  },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    paddingHorizontal: 4,
    position: 'relative',
  },
  headerBack: {
    position: 'absolute',
    left: 4,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.2,
  },
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
