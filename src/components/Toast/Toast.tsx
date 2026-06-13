import { isValidElement, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AccessibilityInfo, Pressable, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS } from 'react-native-reanimated';

import * as Haptics from 'expo-haptics';

import { Button } from '../Button';
import { Icon, type IconName } from '../Icon';
import { useToastAnimation } from './Toast.animation';
import {
  actionWrapStyle,
  contentColumnStyle,
  descriptionStyle,
  getAccentBarStyle,
  iconWrapStyle,
  messageStyle,
  titleStyle,
  TOAST_ACCENT_COLOR,
  TOAST_DEFAULT_ICON,
  toastShadowStyle,
  toastSurfaceStyle,
  toastWrapperStyle,
} from './Toast.styles';
import type { ToastItem, ToastType } from './Toast.types';

const SWIPE_DISMISS_DISTANCE = 24;
const SWIPE_DISMISS_VELOCITY = 600;

const HAPTIC_BY_TYPE: Partial<Record<ToastType, Haptics.NotificationFeedbackType>> = {
  success: Haptics.NotificationFeedbackType.Success,
  error: Haptics.NotificationFeedbackType.Error,
  warning: Haptics.NotificationFeedbackType.Warning,
};

type Props = {
  item: ToastItem;
  stackIndex: number;
  isFront: boolean;
  onRemove: (id: string) => void;
  onMeasure?: (id: string, height: number) => void;
  reduceMotion: boolean;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function ToastInner({ item, stackIndex, isFront, onRemove, onMeasure, reduceMotion }: Props) {
  const { animatedStyle, dragY, exit, shadowStyle, surfaceColorStyle, swipeDismiss } = useToastAnimation({
    position: item.position,
    stackIndex,
    reduceMotion,
  });

  const [paused, setPaused] = useState(false);
  const removedRef = useRef(false);
  const exitingRef = useRef(false);

  const remove = useCallback(() => {
    if (removedRef.current) return;
    removedRef.current = true;
    item.onDismiss?.();
    onRemove(item.id);
  }, [item, onRemove]);

  const triggerExit = useCallback(() => {
    if (exitingRef.current) return;
    exitingRef.current = true;
    exit(remove);
  }, [exit, remove]);

  const triggerSwipeExit = useCallback(() => {
    if (exitingRef.current) return;
    exitingRef.current = true;
    swipeDismiss(remove);
  }, [remove, swipeDismiss]);

  useEffect(() => {
    item.onShow?.();
    const hapticType = HAPTIC_BY_TYPE[item.type];
    if (hapticType) {
      Haptics.notificationAsync(hapticType).catch(() => {});
    }
    const text = [item.title, item.description, item.message].filter(Boolean).join(', ');
    if (text) AccessibilityInfo.announceForAccessibility(text);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id]);

  useEffect(() => {
    if (item._dismissing) {
      triggerExit();
    }
  }, [item._dismissing, triggerExit]);

  // 뒤로 밀린 토스트는 timer 멈춤. _resetKey 변경 시(dedup) timer 재시작.
  useEffect(() => {
    if (!isFront || item.duration === Infinity || paused) return;
    const timer = setTimeout(triggerExit, item.duration);
    return () => clearTimeout(timer);
  }, [isFront, item.duration, item.id, item._resetKey, paused, triggerExit]);

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .enabled(isFront)
        .onUpdate((e) => {
          dragY.value = e.translationY;
        })
        .onEnd((e) => {
          const towardAway = item.position === 'top' ? -1 : 1;
          const movedAway = e.translationY * towardAway > SWIPE_DISMISS_DISTANCE;
          const flickedAway = e.velocityY * towardAway > SWIPE_DISMISS_VELOCITY;
          if (movedAway || flickedAway) {
            runOnJS(triggerSwipeExit)();
          } else {
            dragY.value = 0;
          }
        }),
    [isFront, item.position, dragY, triggerSwipeExit],
  );

  const accent = TOAST_ACCENT_COLOR[item.type];
  const iconNode = (() => {
    if (item.icon === null) return null;
    if (isValidElement(item.icon)) return item.icon;
    const iconName = (item.icon as IconName | undefined) ?? TOAST_DEFAULT_ICON[item.type];
    if (!iconName) return null;
    return <Icon name={iconName} size={20} color={accent} accessibilityLabel={item.type} />;
  })();

  const liveRegion = item.type === 'error' || item.type === 'warning' ? 'assertive' : 'polite';
  const anchorStyle = item.position === 'top' ? { top: 0 } : { bottom: 0 };

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={[toastWrapperStyle, anchorStyle, animatedStyle]}
        // Android에서 nested View + opacity + elevation 페이드 시 레이어 분리 이슈 회피 — 오프스크린 합성 강제
        needsOffscreenAlphaCompositing
        pointerEvents={isFront ? 'auto' : 'none'}
        accessibilityRole="alert"
        accessibilityLiveRegion={liveRegion}
      >
        <Animated.View
          style={[toastShadowStyle, shadowStyle]}
          onLayout={(e) => onMeasure?.(item.id, e.nativeEvent.layout.height)}
        >
          <AnimatedPressable
            disabled={!isFront}
            onPressIn={() => setPaused(true)}
            onPressOut={() => setPaused(false)}
            style={[toastSurfaceStyle, surfaceColorStyle]}
          >
            <View style={getAccentBarStyle(item.type)} pointerEvents="none" />
            {iconNode ? <View style={iconWrapStyle}>{iconNode}</View> : null}
            <View style={contentColumnStyle}>
              {item.title ? <Text style={titleStyle}>{item.title}</Text> : null}
              {item.description ? <Text style={descriptionStyle}>{item.description}</Text> : null}
              {item.message && !item.title ? <Text style={messageStyle}>{item.message}</Text> : null}
            </View>
            {item.action ? (
              <View style={actionWrapStyle}>
                <Button
                  variant="text"
                  size="sm"
                  label={item.action.label}
                  onPress={() => {
                    item.action?.onPress();
                    triggerExit();
                  }}
                />
              </View>
            ) : null}
          </AnimatedPressable>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}

export const Toast = memo(ToastInner);
