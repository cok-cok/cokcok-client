import { StyleSheet } from 'react-native';

import {
  DIVIDER_COLOR,
  LINK_SEPARATOR_COLOR,
  PAGE_BG_COLOR,
  TAGLINE_COLOR,
} from './LoginPage.constants';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: PAGE_BG_COLOR,
  },
  flex: { flex: 1 },
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
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 36,
    gap: 28,
  },
  dismissOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  heading: {
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  tagline: {
    fontSize: 13,
    color: TAGLINE_COLOR,
    fontWeight: '500',
    letterSpacing: -0.1,
  },
  form: {
    gap: 12,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: DIVIDER_COLOR,
    marginTop: 16,
    marginBottom: 4,
  },
  linksRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 0,
  },
  linkSeparator: {
    fontSize: 12,
    color: LINK_SEPARATOR_COLOR,
    marginHorizontal: 2,
  },
});
