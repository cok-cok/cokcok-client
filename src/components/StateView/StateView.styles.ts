import { StyleSheet } from 'react-native';

export const STATE_VIEW_TITLE_COLOR = '#374151';
export const STATE_VIEW_DESCRIPTION_COLOR = '#6B7280';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
    gap: 8,
  },
  iconWrap: {
    marginBottom: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: STATE_VIEW_TITLE_COLOR,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
    color: STATE_VIEW_DESCRIPTION_COLOR,
    textAlign: 'center',
    lineHeight: 20,
  },
  actionWrap: {
    marginTop: 16,
  },
});
