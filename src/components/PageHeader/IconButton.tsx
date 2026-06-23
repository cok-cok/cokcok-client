import { memo } from 'react';
import { Pressable } from 'react-native';

import { Icon } from '../Icon';
import { styles } from './PageHeader.styles';
import type { PageHeaderIconButtonProps } from './PageHeader.types';

const ICON_SIZE = 28;

function IconButtonInner({
  icon,
  onPress,
  label,
  disabled = false,
}: PageHeaderIconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={10}
      style={[styles.pressable, disabled ? styles.disabled : null]}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
    >
      <Icon name={icon} size={ICON_SIZE} />
    </Pressable>
  );
}

export const IconButton = memo(IconButtonInner);
