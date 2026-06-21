import { StyleSheet } from 'react-native';

const RECIPE_CARD_BORDER_RADIUS = 12;
const RECIPE_CARD_THUMBNAIL_WIDTH = 120;
const RECIPE_CARD_HORIZONTAL_MIN_HEIGHT = 120;
const RECIPE_CARD_CONTENT_GAP = 8;
const RECIPE_CARD_CONTENT_PADDING = 16;
const CARD_BG_COLOR = '#FFFFFF';

export const RECIPE_CARD_VERTICAL_MIN_ASPECT = 3 / 4;
export const RECIPE_CARD_VERTICAL_MAX_ASPECT = 2 / 1;

const RECIPE_CARD_GRADIENT_SIZE = 16;
export const RECIPE_CARD_GRADIENT_COLORS: readonly [string, string, string, string, string] = [
  'rgba(255,255,255,0)',
  'rgba(255,255,255,0.016)',
  'rgba(255,255,255,0.125)',
  'rgba(255,255,255,0.422)',
  CARD_BG_COLOR,
];
export const RECIPE_CARD_GRADIENT_LOCATIONS: readonly [number, number, number, number, number] = [
  0, 0.25, 0.5, 0.75, 1,
];

const TITLE_COLOR = '#111827';
const DESCRIPTION_COLOR = '#6B7280';
const META_TEXT_COLOR = '#6B7280';
const META_DIVIDER_COLOR = '#E5E7EB';
const IMAGE_PLACEHOLDER_BG = '#F5F0EC';

export const META_ICON_COLOR = '#FD4C06';

const HORIZONTAL_CONTENT_PADDING_LEFT_WITH_IMAGE = RECIPE_CARD_THUMBNAIL_WIDTH + RECIPE_CARD_CONTENT_PADDING;

export const styles = StyleSheet.create({
  container: {
    backgroundColor: CARD_BG_COLOR,
    borderRadius: RECIPE_CARD_BORDER_RADIUS,
    overflow: 'hidden',
    alignSelf: 'stretch',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },

  horizontalRow: {
    position: 'relative',
  },
  horizontalThumbnail: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: RECIPE_CARD_THUMBNAIL_WIDTH,
    backgroundColor: IMAGE_PLACEHOLDER_BG,
  },
  horizontalContent: {
    padding: RECIPE_CARD_CONTENT_PADDING,
    gap: RECIPE_CARD_CONTENT_GAP,
  },
  horizontalContentWithImage: {
    paddingLeft: HORIZONTAL_CONTENT_PADDING_LEFT_WITH_IMAGE,
    minHeight: RECIPE_CARD_HORIZONTAL_MIN_HEIGHT,
  },

  verticalThumbnail: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: IMAGE_PLACEHOLDER_BG,
  },
  verticalContent: {
    padding: RECIPE_CARD_CONTENT_PADDING,
    gap: RECIPE_CARD_CONTENT_GAP,
  },

  middle: {
    flex: 1,
    gap: RECIPE_CARD_CONTENT_GAP,
  },

  imageFill: {
    width: '100%',
    height: '100%',
  },

  horizontalGradient: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: RECIPE_CARD_GRADIENT_SIZE,
  },
  verticalGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: RECIPE_CARD_GRADIENT_SIZE,
  },

  title: {
    color: TITLE_COLOR,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  description: {
    color: DESCRIPTION_COLOR,
    fontSize: 13,
    lineHeight: 18,
  },

  tagRowMeasured: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    overflow: 'hidden',
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    color: META_TEXT_COLOR,
    fontSize: 13,
    fontWeight: '500',
  },
  metaDivider: {
    width: 1,
    height: 12,
    backgroundColor: META_DIVIDER_COLOR,
    marginHorizontal: 10,
  },
});
