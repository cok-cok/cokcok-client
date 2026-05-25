import { forwardRef, useCallback, useState } from 'react';
import { ActivityIndicator, type GestureResponderEvent, Pressable, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

import * as Haptics from 'expo-haptics';

import { IconSizeContext } from '../Icon';
import { useButtonPressAnimation } from './Button.animation';
import {
  BUTTON_ICON_SIZE,
  BUTTON_SPINNER_COLOR,
  BUTTON_SPINNER_SIZE,
  contentRowStyle,
  getContainerStyle,
  getLabelStyle,
  hiddenStyle,
  iconLeftStyle,
  iconRightStyle,
  spinnerOverlayStyle,
} from './Button.styles';
import type { ButtonHaptic, ButtonProps } from './Button.types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const HAPTIC_STYLE = {
  light: Haptics.ImpactFeedbackStyle.Light,
  medium: Haptics.ImpactFeedbackStyle.Medium,
  heavy: Haptics.ImpactFeedbackStyle.Heavy,
} as const satisfies Record<ButtonHaptic, Haptics.ImpactFeedbackStyle>;

export const Button = forwardRef<View, ButtonProps>(function Button(
  {
    label,
    variant = 'primary',
    size = 'md',
    fullWidth,
    iconLeft,
    iconRight,
    loading,
    haptic,
    onPress,
    style,
    labelStyle,
    pressedStyle,
    disabled,
    hitSlop,
    accessibilityLabel,
    accessibilityState,
    onPressIn,
    onPressOut,
    ...rest
  },
  ref,
) {
  const press = useButtonPressAnimation();
  const [pendingPress, setPendingPress] = useState(false);
  const [pressed, setPressed] = useState(false);

  const isLoading = Boolean(loading || pendingPress);
  const isBlocked = Boolean(disabled || isLoading);

  const handlePressIn = useCallback(
    (event: GestureResponderEvent) => {
      setPressed(true);
      press.pressIn();
      if (haptic) {
        Haptics.impactAsync(HAPTIC_STYLE[haptic]).catch(() => {});
      }
      onPressIn?.(event);
    },
    [haptic, onPressIn, press],
  );

  const handlePressOut = useCallback(
    (event: GestureResponderEvent) => {
      setPressed(false);
      press.pressOut();
      onPressOut?.(event);
    },
    [onPressOut, press],
  );

  const handlePress = useCallback(
    (event: GestureResponderEvent) => {
      if (!onPress) return;
      const result = onPress(event);
      if (result && typeof (result as Promise<unknown>).then === 'function') {
        setPendingPress(true);
        (result as Promise<unknown>).finally(() => setPendingPress(false));
      }
    },
    [onPress],
  );

  const resolvedHitSlop = hitSlop ?? (size === 'sm' ? 6 : undefined);
  const iconSize = BUTTON_ICON_SIZE[size];

  return (
    <AnimatedPressable
      {...rest}
      ref={ref}
      disabled={isBlocked}
      hitSlop={resolvedHitSlop}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: isBlocked, busy: isLoading, ...accessibilityState }}
      style={[
        getContainerStyle({ variant, size, fullWidth, disabled, override: style }),
        press.animatedStyle,
        pressed && pressedStyle,
      ]}
    >
      <View>
        <IconSizeContext.Provider value={iconSize}>
          <View style={[contentRowStyle, isLoading && hiddenStyle]}>
            {iconLeft ? <View style={label ? iconLeftStyle : undefined}>{iconLeft}</View> : null}
            {label ? (
              <Text style={getLabelStyle({ variant, size, disabled, override: labelStyle })}>{label}</Text>
            ) : null}
            {iconRight ? <View style={label ? iconRightStyle : undefined}>{iconRight}</View> : null}
          </View>
        </IconSizeContext.Provider>
        {isLoading ? (
          <View style={spinnerOverlayStyle} pointerEvents="none">
            <ActivityIndicator size={BUTTON_SPINNER_SIZE[size]} color={BUTTON_SPINNER_COLOR[variant]} />
          </View>
        ) : null}
      </View>
    </AnimatedPressable>
  );
});
