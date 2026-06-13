import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  loadingWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  list: {
    flex: 1,
    gap: 14,
    paddingVertical: 8,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E5E7EB',
    marginVertical: 2,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemCheckbox: {
    flex: 1,
  },
  allAgreeLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  viewLink: {
    fontSize: 13,
    color: '#6B7280',
    textDecorationLine: 'underline',
    paddingHorizontal: 4,
  },
});
