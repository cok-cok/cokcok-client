import { memo } from 'react';
import { Pressable, View } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { CardBody } from './CardBody';
import { HorizontalThumbnail } from './HorizontalThumbnail';
import {
  RECIPE_CARD_VERTICAL_OVERLAP_FADE_COLORS,
  RECIPE_CARD_VERTICAL_OVERLAP_FADE_LOCATIONS,
  styles,
} from './RecipeCard.styles';
import type { RecipeCardProps } from './RecipeCard.types';
import { VerticalThumbnail } from './VerticalThumbnail';

function RecipeCardInner({
  title,
  thumbnailUrl,
  description,
  tags,
  cookTime,
  portion,
  layout = 'horizontal',
  onPress,
  testID,
}: RecipeCardProps) {
  const hasImage = !!thumbnailUrl;

  const content = (
    <CardBody title={title} description={description} tags={tags} cookTime={cookTime} portion={portion} />
  );

  const inner =
    layout === 'horizontal' ? (
      <View style={styles.horizontalRow}>
        {hasImage ? <HorizontalThumbnail uri={thumbnailUrl as string} /> : null}
        <View style={[styles.horizontalContent, hasImage ? styles.horizontalContentWithImage : null]}>{content}</View>
      </View>
    ) : (
      <View>
        {hasImage ? <VerticalThumbnail uri={thumbnailUrl as string} /> : null}
        <View style={[styles.verticalContent, hasImage ? styles.verticalContentOverlap : null]}>
          {hasImage ? (
            <LinearGradient
              colors={RECIPE_CARD_VERTICAL_OVERLAP_FADE_COLORS}
              locations={RECIPE_CARD_VERTICAL_OVERLAP_FADE_LOCATIONS}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.verticalContentFade}
              pointerEvents="none"
            />
          ) : null}
          {content}
        </View>
      </View>
    );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={styles.container}
        accessibilityRole="button"
        accessibilityLabel={title}
        testID={testID}
      >
        {inner}
      </Pressable>
    );
  }

  return (
    <View style={styles.container} testID={testID}>
      {inner}
    </View>
  );
}

export const RecipeCard = memo(RecipeCardInner);
