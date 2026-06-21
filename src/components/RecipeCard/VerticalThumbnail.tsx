import { memo, useState } from 'react';
import { View } from 'react-native';

import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

import {
  RECIPE_CARD_GRADIENT_COLORS,
  RECIPE_CARD_GRADIENT_LOCATIONS,
  RECIPE_CARD_VERTICAL_MAX_ASPECT,
  RECIPE_CARD_VERTICAL_MIN_ASPECT,
  styles,
} from './RecipeCard.styles';

type Props = {
  uri: string;
};

function VerticalThumbnailInner({ uri }: Props) {
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);

  const effectiveAspect =
    aspectRatio === null
      ? 1
      : Math.min(Math.max(aspectRatio, RECIPE_CARD_VERTICAL_MIN_ASPECT), RECIPE_CARD_VERTICAL_MAX_ASPECT);

  return (
    <View style={[styles.verticalThumbnail, { aspectRatio: effectiveAspect }]}>
      <Image
        source={{ uri }}
        style={styles.imageFill}
        contentFit="cover"
        onLoad={(e) => {
          const { width, height } = e.source;
          if (width > 0 && height > 0) setAspectRatio(width / height);
        }}
      />
      <LinearGradient
        colors={RECIPE_CARD_GRADIENT_COLORS}
        locations={RECIPE_CARD_GRADIENT_LOCATIONS}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.verticalGradient}
        pointerEvents="none"
      />
    </View>
  );
}

export const VerticalThumbnail = memo(VerticalThumbnailInner);
