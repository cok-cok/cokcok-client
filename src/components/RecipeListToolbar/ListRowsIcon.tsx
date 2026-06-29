import { memo } from 'react';
import { View } from 'react-native';

type Props = {
  size?: number;
  color: string;
  filled?: boolean;
  strokeWidth?: number;
};

const WIDTH_RATIOS = [1, 0.72, 0.88];

function ListRowsIconInner({ size = 16, color, filled = false, strokeWidth = 1.2 }: Props) {
  const rowGap = 1;
  const rowHeight = (size - rowGap * (WIDTH_RATIOS.length - 1)) / WIDTH_RATIOS.length;
  const radius = 1;

  return (
    <View
      style={{
        width: size,
        height: size,
        gap: rowGap,
        alignItems: 'flex-start',
      }}
    >
      {WIDTH_RATIOS.map((ratio, i) => (
        <View
          key={i}
          style={{
            width: size * ratio,
            height: rowHeight,
            borderRadius: radius,
            backgroundColor: filled ? color : 'transparent',
            borderWidth: filled ? 0 : strokeWidth,
            borderColor: color,
          }}
        />
      ))}
    </View>
  );
}

export const ListRowsIcon = memo(ListRowsIconInner);
