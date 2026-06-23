import { memo } from 'react';
import { Text, View } from 'react-native';

import { Icon } from '../Icon';
import { META_ICON_COLOR, styles } from './RecipeCard.styles';
import type { RecipeCardProps } from './RecipeCard.types';
import { formatCookTime, formatPortion } from './RecipeCard.utils';
import { TagOverflowRow } from './TagOverflowRow';

const META_ICON_SIZE = 14;
const DESCRIPTION_LINES = 2;

type Props = Pick<RecipeCardProps, 'title' | 'description' | 'tags' | 'cookTime' | 'portion'>;

function CardBodyInner({ title, description, tags, cookTime, portion }: Props) {
  const hasTags = !!tags && tags.length > 0;
  const hasDescription = !!description;

  return (
    <>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.middle}>
        {hasTags ? <TagOverflowRow tags={tags as string[]} /> : null}
        {hasDescription ? (
          <Text style={styles.description} numberOfLines={DESCRIPTION_LINES} ellipsizeMode="tail">
            {description}
          </Text>
        ) : null}
      </View>
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Icon name="clock" size={META_ICON_SIZE} color={META_ICON_COLOR} />
          <Text style={styles.metaText}>{formatCookTime(cookTime)}</Text>
        </View>
        <View style={styles.metaDivider} />
        <View style={styles.metaItem}>
          <Icon name="user" size={META_ICON_SIZE} color={META_ICON_COLOR} />
          <Text style={styles.metaText}>{formatPortion(portion)}</Text>
        </View>
      </View>
    </>
  );
}

export const CardBody = memo(CardBodyInner);
