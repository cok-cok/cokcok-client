import { useEffect, useMemo } from 'react';
import { Pressable, type StyleProp, Text, type TextStyle, type ViewStyle } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { AnimatedCheck } from '../AnimatedCheck';
import {
  BORDER_DEFAULT,
  BRAND,
  type CheckboxSize,
  SIZES,
  styles,
  TEXT_DEFAULT,
  TEXT_DISABLED,
} from './Checkbox.styles';

type Props = {
  checked: boolean;
  indeterminate?: boolean;
  onPress: () => void;
  label?: string;
  size?: CheckboxSize;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
};

export function Checkbox({
  checked,
  indeterminate = false,
  onPress,
  label,
  size = 'md',
  disabled = false,
  style,
  labelStyle,
  accessibilityLabel,
}: Props) {
  const dim = SIZES[size];
  const active = checked;
  const progress = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(active ? 1 : 0, { duration: 180 });
  }, [active, progress]);

  const boxAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], ['#FFFFFF', BRAND]),
    borderColor: interpolateColor(progress.value, [0, 1], [BORDER_DEFAULT, BRAND]),
  }));

  const boxStaticStyle = useMemo<ViewStyle>(
    () => ({
      width: dim.box,
      height: dim.box,
      borderRadius: dim.radius,
      borderWidth: 1.5,
      alignItems: 'center',
      justifyContent: 'center',
    }),
    [dim.box, dim.radius],
  );

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={6}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: indeterminate ? 'mixed' : checked, disabled }}
      accessibilityLabel={accessibilityLabel ?? label}
      style={({ pressed }) => [styles.row, style, pressed && !disabled ? styles.pressed : null]}
    >
      <Animated.View style={[boxStaticStyle, boxAnimatedStyle, disabled ? styles.boxDisabled : null]}>
        <AnimatedCheck checked={checked} size={dim.icon} />
      </Animated.View>
      {label ? (
        <Text
          style={[
            styles.label,
            { fontSize: dim.font, color: disabled ? TEXT_DISABLED : TEXT_DEFAULT },
            labelStyle,
          ]}
        >
          {label}
        </Text>
      ) : null}
    </Pressable>
  );
}
