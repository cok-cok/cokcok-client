import { memo, useState } from 'react';
import { View } from 'react-native';

import { Tag } from '../Tag';
import { styles } from './RecipeCard.styles';

const TAG_GAP = 6;
const PLUS_N_MEASURE_PLACEHOLDER = '+9';

type Props = {
  tags: string[];
};

function TagOverflowRowInner({ tags }: Props) {
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const [tagWidths, setTagWidths] = useState<(number | null)[]>(() => tags.map(() => null));
  const [plusNWidth, setPlusNWidth] = useState<number | null>(null);

  const allMeasured = containerWidth !== null && tagWidths.every((w) => w !== null) && plusNWidth !== null;

  let visibleCount = tags.length;
  if (allMeasured) {
    const widths = tagWidths as number[];
    let used = 0;
    visibleCount = 0;
    for (let i = 0; i < tags.length; i++) {
      const isLast = i === tags.length - 1;
      const hasOverflow = !isLast;
      const gap = i > 0 ? TAG_GAP : 0;
      const candidate = used + gap + widths[i] + (hasOverflow ? TAG_GAP + (plusNWidth as number) : 0);
      if (candidate > (containerWidth as number)) break;
      used += gap + widths[i];
      visibleCount = i + 1;
    }
  }

  const hiddenCount = tags.length - visibleCount;
  const showPlusN = hiddenCount > 0;

  return (
    <View style={styles.tagRowMeasured} onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}>
      {tags.map((label, i) => {
        const visible = !allMeasured || i < visibleCount;
        return (
          <View
            key={`${label}-${i}`}
            style={!visible ? { display: 'none' } : null}
            onLayout={(e) => {
              const w = e.nativeEvent.layout.width;
              setTagWidths((prev) => {
                if (prev[i] !== null) return prev;
                const next = prev.slice();
                next[i] = w;
                return next;
              });
            }}
          >
            <Tag label={label} />
          </View>
        );
      })}
      <View
        style={!allMeasured ? { position: 'absolute', opacity: 0 } : showPlusN ? null : { display: 'none' }}
        onLayout={(e) => {
          if (plusNWidth === null) setPlusNWidth(e.nativeEvent.layout.width);
        }}
      >
        <Tag label={allMeasured && showPlusN ? `+${hiddenCount}` : PLUS_N_MEASURE_PLACEHOLDER} />
      </View>
    </View>
  );
}

export const TagOverflowRow = memo(TagOverflowRowInner);
