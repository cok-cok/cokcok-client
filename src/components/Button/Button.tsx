import { type GestureResponderEvent, Pressable, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { useButtonPressAnimation, useButtonStateAnimation } from './Button.animation';
import { contentStyle, getContainerStyle, getLabelStyle, iconLeftStyle, iconRightStyle } from './Button.styles';
import type { ButtonProps } from './Button.types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  fullWidth,
  iconLeft,
  iconRight,
  style,
  labelStyle,
  disabled,
  onPressIn,
  onPressOut,
  ...rest
}: ButtonProps) {
  const press = useButtonPressAnimation();
  const state = useButtonStateAnimation({ variant, disabled });

  const handlePressIn = (event: GestureResponderEvent) => {
    press.pressIn();
    onPressIn?.(event);
  };

  const handlePressOut = (event: GestureResponderEvent) => {
    press.pressOut();
    onPressOut?.(event);
  };

  return (
    <AnimatedPressable
      {...rest}
      disabled={disabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        getContainerStyle({ variant, size, fullWidth, override: style }),
        state.containerStyle,
        press.animatedStyle,
      ]}
    >
      <View style={contentStyle}>
        {iconLeft ? <View style={iconLeftStyle}>{iconLeft}</View> : null}
        <Animated.Text style={[getLabelStyle({ variant, size, override: labelStyle }), state.labelStyle]}>
          {label}
        </Animated.Text>
        {iconRight ? <View style={iconRightStyle}>{iconRight}</View> : null}
      </View>
    </AnimatedPressable>
  );
}
