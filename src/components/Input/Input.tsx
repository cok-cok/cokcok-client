import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import {
  type NativeSyntheticEvent,
  Pressable,
  Text,
  TextInput,
  type TextInputFocusEventData,
  type TextInputProps,
  View,
} from 'react-native';
import Animated from 'react-native-reanimated';

import { Icon } from '../Icon';
import { useInputStateAnimation } from './Input.animation';
import {
  containerStyle,
  CURSOR_COLOR,
  getBoxStyle,
  getHelperStyle,
  getInputStyle,
  getLabelStyle,
  ICON_DISABLED_COLOR,
  ICON_NEUTRAL_COLOR,
  labelBaseStyle,
  PLACEHOLDER_COLOR,
  REQUIRED_MARK_COLOR,
  SELECTION_COLOR,
} from './Input.styles';
import type { InputProps, InputType } from './Input.types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const TYPE_DEFAULTS: Record<InputType, Partial<TextInputProps>> = {
  text: {},
  email: {
    keyboardType: 'email-address',
    autoCapitalize: 'none',
    autoComplete: 'email',
    textContentType: 'emailAddress',
    autoCorrect: false,
    spellCheck: false,
  },
  password: {
    autoCapitalize: 'none',
    autoComplete: 'password',
    textContentType: 'password',
    autoCorrect: false,
    spellCheck: false,
  },
  number: {
    keyboardType: 'numeric',
    autoCorrect: false,
    spellCheck: false,
  },
  multiline: {
    multiline: true,
    textAlignVertical: 'top',
  },
};

export const Input = forwardRef<TextInput, InputProps>(function Input(
  {
    variant = 'outline',
    size = 'md',
    type = 'text',
    label,
    required,
    helperText,
    error,
    iconLeft,
    iconRight,
    style,
    inputStyle,
    onFocus,
    onBlur,
    editable,
    accessibilityLabel,
    accessibilityHint,
    accessibilityState,
    ...rest
  },
  forwardedRef,
) {
  const internalRef = useRef<TextInput | null>(null);
  const [focused, setFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const disabled = editable === false;
  const isError = Boolean(error);
  const isMultiline = type === 'multiline';
  const isPassword = type === 'password';

  const state = useInputStateAnimation({ variant, focused, error: isError, disabled });

  const setRef = useCallback(
    (node: TextInput | null) => {
      internalRef.current = node;
      if (typeof forwardedRef === 'function') {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    },
    [forwardedRef],
  );

  useEffect(() => {
    if (disabled && focused) {
      internalRef.current?.blur();
    }
  }, [disabled, focused]);

  const handleFocus = useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setFocused(true);
      onFocus?.(e);
    },
    [onFocus],
  );

  const handleBlur = useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setFocused(false);
      onBlur?.(e);
    },
    [onBlur],
  );

  const focusInput = useCallback(() => {
    internalRef.current?.focus();
  }, []);

  const typeDefaults = TYPE_DEFAULTS[type];
  const secureTextEntry = isPassword && !passwordVisible;

  const resolvedIconRight = isPassword ? (
    <Pressable
      onPress={() => setPasswordVisible((v) => !v)}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={passwordVisible ? '비밀번호 숨기기' : '비밀번호 보이기'}
    >
      <Icon
        name={passwordVisible ? 'eyeOff' : 'eye'}
        size={20}
        color={disabled ? ICON_DISABLED_COLOR : ICON_NEUTRAL_COLOR}
      />
    </Pressable>
  ) : iconRight;

  return (
    <View style={[containerStyle, style]}>
      {label ? (
        <Animated.Text style={[labelBaseStyle, getLabelStyle({ size }), state.labelStyle]}>
          {label}
          {required ? <Text style={{ color: REQUIRED_MARK_COLOR }}> *</Text> : null}
        </Animated.Text>
      ) : null}

      <AnimatedPressable
        onPress={focusInput}
        disabled={disabled}
        style={[getBoxStyle({ variant, size, multiline: isMultiline }), state.boxStyle]}
      >
        {iconLeft ? <View>{iconLeft}</View> : null}
        <TextInput
          ref={setRef}
          placeholderTextColor={PLACEHOLDER_COLOR}
          cursorColor={CURSOR_COLOR}
          selectionColor={SELECTION_COLOR}
          {...typeDefaults}
          {...rest}
          editable={!disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={secureTextEntry}
          accessibilityLabel={accessibilityLabel ?? label}
          accessibilityHint={accessibilityHint ?? error ?? helperText}
          accessibilityState={{ disabled, ...accessibilityState }}
          style={getInputStyle({ size, multiline: isMultiline, override: inputStyle })}
        />
        {resolvedIconRight ? <View>{resolvedIconRight}</View> : null}
      </AnimatedPressable>

      {error || helperText ? (
        <Animated.Text style={[getHelperStyle({ size }), state.helperStyle]}>{error ?? helperText}</Animated.Text>
      ) : null}
    </View>
  );
});
