import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FBFBFB',
  },
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
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.2,
    maxWidth: '70%',
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  loadingFull: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  agreeWrap: {
    marginTop: 32,
  },
  agreeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  agreeRowItem: {
    flex: 1,
  },
});

export const markdownStyles = {
  body: { color: '#111827', fontSize: 14, lineHeight: 22 },
  heading1: { fontSize: 22, fontWeight: '700' as const, marginTop: 16, marginBottom: 12, color: '#111827' },
  heading2: { fontSize: 18, fontWeight: '700' as const, marginTop: 20, marginBottom: 10, color: '#111827' },
  heading3: { fontSize: 16, fontWeight: '600' as const, marginTop: 16, marginBottom: 8, color: '#111827' },
  paragraph: { marginTop: 0, marginBottom: 10 },
  list_item: { marginVertical: 2 },
  bullet_list: { marginBottom: 10 },
  ordered_list: { marginBottom: 10 },
  blockquote: {
    backgroundColor: '#F3F4F6',
    borderLeftWidth: 3,
    borderLeftColor: '#FD4C06',
    paddingLeft: 12,
    paddingVertical: 8,
    marginVertical: 10,
  },
  code_inline: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 4,
    borderRadius: 4,
    fontFamily: 'Courier',
  },
  strong: { fontWeight: '700' as const },
  hr: { backgroundColor: '#E5E7EB', height: StyleSheet.hairlineWidth, marginVertical: 16 },
};
