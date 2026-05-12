import { ICONS } from './Icon.icons';
import type { IconProps } from './Icon.types';

export function Icon({ name, size = 20, color, strokeWidth }: IconProps) {
  const LucideComponent = ICONS[name];
  return <LucideComponent size={size} color={color} strokeWidth={strokeWidth} />;
}
