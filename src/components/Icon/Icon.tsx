import { View } from 'react-native';

import { ICONS } from './Icon.icons';
import type { IconProps } from './Icon.types';

export function Icon({
  name,
  size = 20,
  color,
  strokeWidth,
  accessibilityLabel,
  accessibilityRole,
  testID,
}: IconProps) {
  const LucideComponent = ICONS[name];
  const isDecorative = !accessibilityLabel;

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole ?? (isDecorative ? 'none' : 'image')}
      accessibilityElementsHidden={isDecorative}
      importantForAccessibility={isDecorative ? 'no-hide-descendants' : 'auto'}
      testID={testID}
    >
      <LucideComponent size={size} color={color} strokeWidth={strokeWidth} />
    </View>
  );
}
