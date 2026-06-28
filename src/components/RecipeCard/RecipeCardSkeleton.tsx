import { memo } from 'react';
import { View } from 'react-native';

import { Skeleton } from '../Skeleton';
import { styles } from './RecipeCard.styles';

export type RecipeCardSkeletonVariant = 'image-tall' | 'image-short' | 'no-image';

export type RecipeCardSkeletonProps = {
  layout?: 'horizontal' | 'vertical';
  variant?: RecipeCardSkeletonVariant;
  testID?: string;
};

const VERTICAL_IMAGE_HEIGHT: Record<RecipeCardSkeletonVariant, number> = {
  'image-tall': 220,
  'image-short': 140,
  'no-image': 0,
};

function RecipeCardSkeletonInner({
  layout = 'horizontal',
  variant = 'image-tall',
  testID,
}: RecipeCardSkeletonProps) {
  if (layout === 'horizontal') {
    return (
      <View style={styles.container} testID={testID}>
        <View style={styles.horizontalRow}>
          <View style={styles.horizontalThumbnail}>
            <Skeleton width="100%" height="100%" borderRadius={0} />
          </View>
          <View style={[styles.horizontalContent, styles.horizontalContentWithImage]}>
            <Skeleton width="78%" height={16} />
            <View style={{ gap: 5 }}>
              <Skeleton width="96%" height={13} />
              <Skeleton width="68%" height={13} />
            </View>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              <Skeleton width={50} height={20} borderRadius={10} />
              <Skeleton width={70} height={20} borderRadius={10} />
            </View>
            <View style={{ flexDirection: 'row', gap: 14 }}>
              <Skeleton width={45} height={13} />
              <Skeleton width={45} height={13} />
            </View>
          </View>
        </View>
      </View>
    );
  }

  const imageHeight = VERTICAL_IMAGE_HEIGHT[variant];
  const hasImage = variant !== 'no-image';

  return (
    <View style={styles.container} testID={testID}>
      {hasImage ? <Skeleton width="100%" height={imageHeight} borderRadius={0} /> : null}
      <View style={[styles.verticalContent, { gap: 10 }]}>
        <Skeleton width="85%" height={16} />
        <Skeleton width="65%" height={13} />
        <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
          <Skeleton width={50} height={20} borderRadius={10} />
          <Skeleton width={70} height={20} borderRadius={10} />
        </View>
        <Skeleton width="50%" height={13} />
      </View>
    </View>
  );
}

export const RecipeCardSkeleton = memo(RecipeCardSkeletonInner);
