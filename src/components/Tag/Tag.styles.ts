import { StyleSheet } from 'react-native';

const TAG_BG = '#FFF4ED';
const TAG_COLOR = '#FD4C06';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: TAG_BG,
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
  },
  label: {
    color: TAG_COLOR,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: -0.1,
    includeFontPadding: false,
  },
});
