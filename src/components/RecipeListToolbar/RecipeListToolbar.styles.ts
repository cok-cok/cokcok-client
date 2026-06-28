import { StyleSheet } from 'react-native';

export const RECIPE_LIST_TOOLBAR_HEIGHT = 52;

const TOOLBAR_BG = '#FFFFFF';
const TOOLBAR_BORDER = 'rgba(0,0,0,0.06)';

export const styles = StyleSheet.create({
  container: {
    height: RECIPE_LIST_TOOLBAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: TOOLBAR_BG,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: TOOLBAR_BORDER,
  },
  rightSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
