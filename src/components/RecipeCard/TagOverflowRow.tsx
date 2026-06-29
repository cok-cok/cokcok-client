import { memo, useState } from 'react';
import { Platform, View } from 'react-native';

import { Tag } from '../Tag';
import { styles } from './RecipeCard.styles';

const TAG_GAP = 6;
const PLUS_N_MEASURE_PLACEHOLDER = '+9';
// 측정 실패 fallback (Android 등에서 onLayout이 안정적으로 호출 안 되는 경우)
const FALLBACK_VISIBLE_COUNT = 2;

type Props = {
  tags: string[];
};

function TagOverflowRowInner({ tags }: Props) {
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const [tagWidths, setTagWidths] = useState<(number | null)[]>(() => tags.map(() => null));
  const [plusNWidth, setPlusNWidth] = useState<number | null>(null);

  const allMeasured =
    containerWidth !== null && tagWidths.every((w) => w !== null) && plusNWidth !== null;

  let visibleCount: number;
  if (allMeasured) {
    const widths = tagWidths as number[];
    let used = 0;
    visibleCount = 0;
    for (let i = 0; i < tags.length; i++) {
      const isLast = i === tags.length - 1;
      const hasOverflow = !isLast;
      const gap = i > 0 ? TAG_GAP : 0;
      const candidate =
        used + gap + widths[i] + (hasOverflow ? TAG_GAP + (plusNWidth as number) : 0);
      if (candidate > (containerWidth as number)) break;
      used += gap + widths[i];
      visibleCount = i + 1;
    }
  } else if (Platform.OS === 'android') {
    // Android에서 측정 안정성 보강: 측정 끝나기 전이라도 안전 fallback
    visibleCount = Math.min(tags.length, FALLBACK_VISIBLE_COUNT);
  } else {
    visibleCount = tags.length;
  }

  const hiddenCount = tags.length - visibleCount;
  const showPlusN = hiddenCount > 0;

  return (
    <View
      style={styles.tagRowMeasured}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      {tags.map((label, i) => {
        const visible = i < visibleCount;
        return (
          <View
            key={`${label}-${i}`}
            // 측정용으로는 항상 렌더(absolute hidden), 표시는 visibleCount 안일 때만
            style={visible ? null : { position: 'absolute', opacity: 0 }}
            pointerEvents={visible ? undefined : 'none'}
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
      {/* 측정 전용 +N */}
      <View
        style={{ position: 'absolute', opacity: 0 }}
        pointerEvents="none"
        onLayout={(e) => {
          if (plusNWidth === null) setPlusNWidth(e.nativeEvent.layout.width);
        }}
      >
        <Tag label={PLUS_N_MEASURE_PLACEHOLDER} />
      </View>
      {/* 실제 표시 — 측정 여부와 무관하게 hiddenCount 있으면 표시 */}
      {showPlusN ? <Tag label={`+${hiddenCount}`} /> : null}
    </View>
  );
}

export const TagOverflowRow = memo(TagOverflowRowInner);
