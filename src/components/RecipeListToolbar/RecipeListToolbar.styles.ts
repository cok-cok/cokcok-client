import { StyleSheet } from 'react-native';

export const RECIPE_LIST_TOOLBAR_HEIGHT = 36;

export const styles = StyleSheet.create({
  container: {
    height: RECIPE_LIST_TOOLBAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    backgroundColor: 'transparent',
  },
  rightSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
