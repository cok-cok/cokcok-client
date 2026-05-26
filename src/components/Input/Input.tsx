import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import {
  type NativeSyntheticEvent,
  Platform,
  Pressable,
  Text,
  TextInput,
  type TextInputFocusEventData,
  type TextInputProps,
  View,
} from 'react-native';
import Animated from 'react-native-reanimated';

import { Icon, IconSizeContext } from '../Icon';
import { Spinner } from '../Spinner';
import { useInputStateAnimation } from './Input.animation';
import {
  CLEAR_INPUT_LABEL,
  ERROR_ICON_LABEL,
  PASSWORD_HIDE_LABEL,
  PASSWORD_SHOW_LABEL,
} from './Input.constants';
import {
  bottomRowStyle,
  boxWrapperStyle,
  containerStyle,
  counterStyle,
  ERROR_COLOR,
  errorIconWrapperStyle,
  getBoxStyle,
  getHelperStyle,
  getInputStyle,
  getLabelStyle,
  helperContentStyle,
  ICON_DISABLED_COLOR,
  ICON_NEUTRAL_COLOR,
  INPUT_ICON_SIZE,
  outerContainerStyle,
  PLACEHOLDER_COLOR,
  REQUIRED_MARK_COLOR,
  rowWithTrailingStyle,
  SELECTION_COLOR,
  trailingActionWrapperStyle,
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
    // 영문 키보드 고정으로 secureTextEntry 토글 시 IME 리셋(한/영 전환) 차단.
    // iOS: ascii-capable로 한글 IME 비활성. Android: visible-password로 영문 키보드 강제
    // (secureTextEntry=true와 함께 쓰면 가시화는 secureTextEntry가 우선해 정상적으로 가려짐)
    keyboardType: Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password',
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
    loading,
    clearable,
    trailingAction,
    showCounter,
    shakeOnError = true,
    style,
    inputStyle,
    onFocus,
    onBlur,
    onChangeText,
    editable,
    value,
    defaultValue,
    maxLength,
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
  const [internalValue, setInternalValue] = useState<string>(typeof defaultValue === 'string' ? defaultValue : '');

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const disabled = editable === false;
  const isMultiline = type === 'multiline';
  const isPassword = type === 'password';
  const hasValue = Boolean(currentValue && currentValue.length > 0);
  const iconSize = INPUT_ICON_SIZE[size];

  const state = useInputStateAnimation({ variant, focused, error: Boolean(error), disabled, shakeOnError });

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

  const handleChangeText = useCallback(
    (text: string) => {
      if (!isControlled) setInternalValue(text);
      onChangeText?.(text);
    },
    [isControlled, onChangeText],
  );

  const focusInput = useCallback(() => {
    internalRef.current?.focus();
  }, []);

  const handleClear = useCallback(() => {
    handleChangeText('');
    internalRef.current?.focus();
  }, [handleChangeText]);

  const typeDefaults = TYPE_DEFAULTS[type];
  const secureTextEntry = isPassword && !passwordVisible;
  const iconColor = disabled ? ICON_DISABLED_COLOR : ICON_NEUTRAL_COLOR;

  let resolvedIconRight = iconRight;
  if (loading) {
    resolvedIconRight = <Spinner color="black" size={size} />;
  } else if (isPassword) {
    resolvedIconRight = (
      <Pressable
        onPress={() => setPasswordVisible((v) => !v)}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={passwordVisible ? PASSWORD_HIDE_LABEL : PASSWORD_SHOW_LABEL}
      >
        <Icon name={passwordVisible ? 'eyeOff' : 'eye'} size={20} color={iconColor} />
      </Pressable>
    );
  } else if (clearable && hasValue && !disabled) {
    resolvedIconRight = (
      <Pressable onPress={handleClear} hitSlop={8} accessibilityRole="button" accessibilityLabel={CLEAR_INPUT_LABEL}>
        <Icon name="x" size={20} color={iconColor} />
      </Pressable>
    );
  }

  const counter = showCounter && maxLength ? `${currentValue?.length ?? 0}/${maxLength}` : null;
  const showBottomRow = Boolean(error || helperText || counter);

  const inputBox = (
    <View style={boxWrapperStyle}>
      {label ? (
        <Animated.Text style={[getLabelStyle({ size }), state.labelStyle]}>
          {label}
          {required ? <Text style={{ color: REQUIRED_MARK_COLOR }}> *</Text> : null}
        </Animated.Text>
      ) : null}

      <AnimatedPressable
        onPress={focusInput}
        disabled={disabled}
        style={[getBoxStyle({ variant, size, multiline: isMultiline }), state.boxStyle]}
      >
        <IconSizeContext.Provider value={iconSize}>
          {iconLeft ? <View>{iconLeft}</View> : null}
          <TextInput
            ref={setRef}
            placeholderTextColor={PLACEHOLDER_COLOR}
            cursorColor={SELECTION_COLOR}
            selectionColor={SELECTION_COLOR}
            {...typeDefaults}
            {...rest}
            value={isControlled ? value : internalValue}
            defaultValue={isControlled ? undefined : defaultValue}
            maxLength={maxLength}
            editable={!disabled}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChangeText={handleChangeText}
            secureTextEntry={secureTextEntry}
            accessibilityLabel={accessibilityLabel ?? label}
            accessibilityHint={accessibilityHint ?? error ?? helperText}
            accessibilityState={{ disabled, ...accessibilityState }}
            style={getInputStyle({ size, multiline: isMultiline, override: inputStyle })}
          />
          {resolvedIconRight ? <View>{resolvedIconRight}</View> : null}
        </IconSizeContext.Provider>
      </AnimatedPressable>

      {showBottomRow ? (
        <View style={bottomRowStyle}>
          {error ? (
            <View style={errorIconWrapperStyle}>
              <Icon name="alertCircle" size={14} color={ERROR_COLOR} accessibilityLabel={ERROR_ICON_LABEL} />
            </View>
          ) : null}
          {error || helperText ? (
            <Animated.Text style={[getHelperStyle({ size }), helperContentStyle, state.helperStyle]}>
              {error ?? helperText}
            </Animated.Text>
          ) : null}
          {counter ? (
            <Animated.Text style={[getHelperStyle({ size }), counterStyle, state.helperStyle]}>{counter}</Animated.Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );

  if (trailingAction) {
    return (
      <View style={[outerContainerStyle, style]}>
        <View style={rowWithTrailingStyle}>
          {inputBox}
          <View style={trailingActionWrapperStyle}>{trailingAction}</View>
        </View>
      </View>
    );
  }

  return <View style={[containerStyle, style]}>{inputBox}</View>;
});
