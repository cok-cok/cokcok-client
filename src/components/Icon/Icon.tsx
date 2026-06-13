import { memo, useContext } from 'react';
import { View } from 'react-native';

import { IconSizeContext } from './Icon.context';
import { ICONS } from './Icon.icons';
import type { IconProps } from './Icon.types';

function IconInner({
  name,
  size,
  color,
  strokeWidth,
  accessibilityLabel,
  accessibilityRole,
  testID,
}: IconProps) {
  const contextSize = useContext(IconSizeContext);
  const LucideComponent = ICONS[name];
  const finalSize = size ?? contextSize ?? 20;
  const isDecorative = !accessibilityLabel;

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole ?? (isDecorative ? 'none' : 'image')}
      accessibilityElementsHidden={isDecorative}
      importantForAccessibility={isDecorative ? 'no-hide-descendants' : 'auto'}
      testID={testID}
    >
      <LucideComponent size={finalSize} color={color} strokeWidth={strokeWidth} />
    </View>
  );
}

export const Icon = memo(IconInner);
