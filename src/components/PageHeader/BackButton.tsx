import { memo } from 'react';
import { Pressable } from 'react-native';

import { Icon } from '../Icon';
import { styles } from './PageHeader.styles';
import type { PageHeaderBackButtonProps } from './PageHeader.types';

const ICON_SIZE = 28;

function BackButtonInner({
  onPress,
  disabled = false,
  label = '뒤로가기',
}: PageHeaderBackButtonProps) {
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
      <Icon name="chevronLeft" size={ICON_SIZE} />
    </Pressable>
  );
}

export const BackButton = memo(BackButtonInner);
