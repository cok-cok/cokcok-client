import { memo } from 'react';
import { View } from 'react-native';

type Props = {
  size?: number;
  color: string;
  filled?: boolean;
  strokeWidth?: number;
};

function MasonryGridIconInner({ size = 20, color, filled = false, strokeWidth = 1.2 }: Props) {
  const colGap = 1;
  const rowGap = 1;
  const colWidth = (size - colGap) / 2;
  const innerHeight = size - rowGap;
  const shortHeight = innerHeight * 0.4;
  const tallHeight = innerHeight * 0.6;
  const radius = 1;

  const baseStyle = {
    width: colWidth,
    borderRadius: radius,
    backgroundColor: filled ? color : 'transparent',
    borderWidth: filled ? 0 : strokeWidth,
    borderColor: color,
  };

  return (
    <View style={{ width: size, height: size, flexDirection: 'row', gap: colGap }}>
      <View style={{ width: colWidth, gap: rowGap }}>
        <View style={{ ...baseStyle, height: shortHeight }} />
        <View style={{ ...baseStyle, height: tallHeight }} />
      </View>
      <View style={{ width: colWidth, gap: rowGap }}>
        <View style={{ ...baseStyle, height: tallHeight }} />
        <View style={{ ...baseStyle, height: shortHeight }} />
      </View>
    </View>
  );
}

export const MasonryGridIcon = memo(MasonryGridIconInner);
