import { memo } from 'react';
import { View } from 'react-native';

import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

import { RECIPE_CARD_GRADIENT_COLORS, RECIPE_CARD_GRADIENT_LOCATIONS, styles } from './RecipeCard.styles';

type Props = {
  uri: string;
};

function HorizontalThumbnailInner({ uri }: Props) {
  return (
    <View style={styles.horizontalThumbnail}>
      <Image source={{ uri }} style={styles.imageFill} contentFit="cover" />
      <LinearGradient
        colors={RECIPE_CARD_GRADIENT_COLORS}
        locations={RECIPE_CARD_GRADIENT_LOCATIONS}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.horizontalGradient}
        pointerEvents="none"
      />
    </View>
  );
}

export const HorizontalThumbnail = memo(HorizontalThumbnailInner);
