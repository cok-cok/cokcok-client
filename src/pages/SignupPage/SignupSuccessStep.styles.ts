import { StyleSheet } from 'react-native';

export const AVATAR_SIZE = 140;

export const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 22,
  },
  mascot: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
  },
  textWrap: {
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 19,
    fontWeight: '600',
    color: '#111827',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 21,
    letterSpacing: -0.1,
  },
});
