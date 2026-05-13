import { ActivityIndicator, type GestureResponderEvent, Pressable, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { useButtonPressAnimation, useButtonStateAnimation } from './Button.animation';
import {
  BUTTON_HIT_SLOP,
  BUTTON_SPINNER_COLOR,
  BUTTON_SPINNER_SIZE,
  contentRowStyle,
  contentStyle,
  getContainerStyle,
  getLabelStyle,
  hiddenStyle,
  iconLeftStyle,
  iconRightStyle,
  spinnerOverlayStyle,
} from './Button.styles';
import type { ButtonProps } from './Button.types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  fullWidth,
  iconLeft,
  iconRight,
  loading,
  style,
  labelStyle,
  disabled,
  hitSlop,
  accessibilityLabel,
  accessibilityState,
  onPressIn,
  onPressOut,
  ...rest
}: ButtonProps) {
  const press = useButtonPressAnimation();
  const state = useButtonStateAnimation({ variant, disabled });

  const isBlocked = Boolean(disabled || loading);

  const handlePressIn = (event: GestureResponderEvent) => {
    press.pressIn();
    onPressIn?.(event);
  };

  const handlePressOut = (event: GestureResponderEvent) => {
    press.pressOut();
    onPressOut?.(event);
  };

  const resolvedHitSlop = hitSlop ?? BUTTON_HIT_SLOP[size];

  return (
    <AnimatedPressable
      {...rest}
      disabled={isBlocked}
      hitSlop={resolvedHitSlop}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: isBlocked, busy: loading, ...accessibilityState }}
      style={[
        getContainerStyle({ variant, size, fullWidth, override: style }),
        state.containerStyle,
        press.animatedStyle,
      ]}
    >
      <View style={contentStyle}>
        <View style={[contentRowStyle, loading && hiddenStyle]}>
          {iconLeft ? <View style={iconLeftStyle}>{iconLeft}</View> : null}
          {label ? (
            <Animated.Text style={[getLabelStyle({ variant, size, override: labelStyle }), state.labelStyle]}>
              {label}
            </Animated.Text>
          ) : null}
          {iconRight ? <View style={iconRightStyle}>{iconRight}</View> : null}
        </View>
        {loading ? (
          <View style={spinnerOverlayStyle} pointerEvents="none">
            <ActivityIndicator size={BUTTON_SPINNER_SIZE[size]} color={BUTTON_SPINNER_COLOR[variant]} />
          </View>
        ) : null}
      </View>
    </AnimatedPressable>
  );
}
