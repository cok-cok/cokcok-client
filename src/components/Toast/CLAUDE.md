# Toast

서비스 전반의 임시 알림. 5 type × 자동 position × stack × swipe-to-dismiss × promise × action 버튼. App root에 `<ToastProvider>` 한 번 마운트하면 어디서든 호출 가능.

## Import

```ts
// 컴포넌트에서
import { useToast } from '@/components/Toast';
const toast = useToast();

// 비-React 컨텍스트 (api client, util 등)
import { toast } from '@/components/Toast';

// 타입
import type {
  ToastInput, ToastType, ToastPosition, ToastAction,
  PromiseToastOptions, ToastAPI,
} from '@/components/Toast';

// Provider (app root)
import { ToastProvider } from '@/components/Toast';
```

## Public API (`ToastAPI`)

```ts
type ToastAPI = {
  show: (input: ToastInput) => string;                              // 모든 props 자유
  success: (message: string, options?: ToastShortcutOptions) => string;
  error:   (message: string, options?: ToastShortcutOptions) => string;
  warning: (message: string, options?: ToastShortcutOptions) => string;
  info:    (message: string, options?: ToastShortcutOptions) => string;
  promise: <T>(promise: Promise<T>, options: PromiseToastOptions<T>) => Promise<T>;
  dismiss: (id: string) => void;
  dismissAll: () => void;
};

type ToastShortcutOptions = Omit<ToastInput, 'type' | 'message'>;
```

모든 `show`/`success`/etc는 **id 반환**. 나중에 `toast.dismiss(id)`로 닫을 수 있음.

## ToastInput

```ts
type ToastInput = {
  id?: string;                          // 자동 생성. 명시 시 upsert (promise 패턴에서 활용)
  type?: 'default' | 'success' | 'error' | 'warning' | 'info';   // default 'default'
  message?: string;                     // 단일 메시지 (title 없을 때 사용)
  title?: string;                       // 제목
  description?: string;                 // 본문
  position?: 'top' | 'bottom';          // 미지정 시 type별 자동
  duration?: number;                    // ms. default 3500. Infinity = 영구
  action?: { label: string; onPress: () => void };  // 우측 액션 버튼
  icon?: IconName | ReactNode | null;   // override (null = 숨김)
  onShow?: () => void;
  onDismiss?: () => void;
};
```

- `message` vs `title+description`: 둘 다 줄 수 있지만 보통 message 또는 title+description 둘 중 하나만 씀. `title` 있으면 message 표시 안 됨.
- `id` 명시 시 동일 id 있으면 **upsert** (덮어쓰기). promise 패턴이 이걸로 동작.

## Type별 자동 매핑

| type | 아이콘 | 강조색 (accent + 아이콘) | 기본 position | haptic | a11y liveRegion |
|---|---|---|---|---|---|
| `default` | (없음) | `#6B7280` (gray-500) | bottom | - | polite |
| `success` | `check` | `#16A34A` (green-600) | bottom | Success | polite |
| `info` | `info` | `#2563EB` (blue-600) | bottom | - | polite |
| `warning` | `alertTriangle` | `#F59E0B` (amber-500) | top | Warning | assertive |
| `error` | `xCircle` | `#DC2626` (red-600) | top | Error | assertive |

상수들:
- `TOAST_ACCENT_COLOR[type]` → 색
- `TOAST_DEFAULT_ICON[type]` → IconName | null
- `TOAST_DEFAULT_POSITION[type]` → position

## 레이아웃

```
┌──────────────────────────────────────────────┐
│ [accent bar] [icon] [title         ] [action]│
│                     [description     ]       │
└──────────────────────────────────────────────┘
```

- 좌측 4px 액센트 바 (type 색, 절대 위치 `top: 0, bottom: 0`)
- 아이콘 22px wrap, 사이즈 20px (없으면 wrap 자체 미렌더 → 텍스트 왼쪽 당김)
- 제목/본문 column, `flex: 1`
- 액션 버튼 (있을 때만)
- borderRadius 16, paddingV 12, paddingH 14
- shadow on wrapper (overflow:hidden과 분리), surface는 hairline border `rgba(17, 24, 39, 0.08)`

### 텍스트 스타일

| element | fontSize | fontWeight | color |
|---|---|---|---|
| title | 14 | 700 | `#111827` |
| description | 13 | 500 | `#4B5563` |
| message (title 없을 때) | 14 | 600 | `#111827` |

## 사용 패턴

```tsx
// 단순
toast.show({ message: '저장됨' });

// 타입 단축
toast.success('레시피가 저장되었습니다');
toast.error('네트워크 오류', { description: '잠시 후 다시 시도해주세요' });
toast.warning('변경사항이 저장되지 않을 수 있습니다');
toast.info('새 알림이 도착했습니다');

// title + description 분리
toast.show({
  type: 'success',
  title: '저장 완료',
  description: '내 레시피에 추가됨',
});

// Promise — loading → success/error 자동 전환
toast.promise(api.save(recipe), {
  loading: '저장 중...',
  success: '저장 완료',
  error: (err) => `저장 실패: ${err.message}`,
});

// 액션 버튼 (Undo 패턴)
toast.show({
  message: '레시피가 삭제되었습니다',
  duration: 5000,
  action: {
    label: '실행 취소',
    onPress: () => undoDelete(),
  },
});

// position 강제
toast.error('상단 강제', { position: 'top' });

// 영구 + 수동 dismiss
const id = toast.show({ type: 'info', message: '...', duration: Infinity });
// 나중에:
toast.dismiss(id);

// 아이콘 교체 / 숨김
toast.show({ type: 'success', message: '플러스', icon: 'plus' });
toast.show({ type: 'success', message: '아이콘 없음', icon: null });

// 모두 닫기
toast.dismissAll();
```

## ToastProvider 설치 (이미 App.tsx에 설치돼 있음)

```tsx
<GestureHandlerRootView style={{ flex: 1 }}>
  <SafeAreaProvider>
    <NavigationContainer>
      <ToastProvider>
        <RootNavigator />
      </ToastProvider>
    </NavigationContainer>
  </SafeAreaProvider>
</GestureHandlerRootView>
```

- **`GestureHandlerRootView`** 필요 (swipe-to-dismiss에 react-native-gesture-handler 사용)
- **`SafeAreaProvider`** 필요 (host inset 계산)
- ToastProvider는 NavigationContainer 안쪽이어야 nav 안의 컴포넌트에서 useToast 가능

## 호출 컨텍스트별 사용

| 위치 | 사용 |
|---|---|
| React 컴포넌트 | `const toast = useToast(); toast.success(...)` |
| 비-React (api client, store middleware 등) | `import { toast } from '@/components/Toast'; toast.error(...)` |

`toast` 싱글톤은 `ToastProvider`가 마운트되면서 내부 API를 등록 (`_registerToastAPI`). 마운트 전 호출은 **silent no-op** (id는 `''` 반환).

## 상호작용

### Swipe-to-dismiss

`react-native-gesture-handler` `Gesture.Pan()` 사용. 조건:

```
거리 임계값: 24px (포지션 방향)
속도 임계값: 600 px/s (포지션 방향)
```

OR 조건 — 둘 중 하나만 충족하면 dismiss.

```
top 토스트: 위로 swipe → translationY < -24 또는 velocityY < -600
bottom 토스트: 아래로 swipe → translationY > 24 또는 velocityY > 600
```

뒤로 밀린 토스트(isFront=false)는 `Gesture.Pan().enabled(false)` — 비활성.

### Press-and-hold 일시정지

뒤로 밀린 토스트가 아닌 한, Pressable로 감싸서 누른 동안 `paused=true`. auto-dismiss 타이머가 멈춤. 손 떼면 재개 (전체 시간 새로 시작).

### 액션 버튼

Button 컴포넌트(variant="text", size="sm") 재사용. 누르면:
1. `action.onPress()` 호출
2. 즉시 dismiss (exit 애니메이션 거침)

## 스택 (Stack)

### 룰

- **최대 동시 표시 3개** (`TOAST_MAX_VISIBLE`). 그 이상은 큐로 대기.
- **최대 큐 10개** (`TOAST_MAX_QUEUE`). 초과 시 같은 position의 가장 오래된 것부터 evict. 다른 position은 보존 (알림 이관 대비).
- 새 토스트는 newest=front (stackIndex 0). 기존 토스트들이 뒤로 밀림 (1, 2, ...).
- 뒤 토스트는 timer 멈춤 — 앞으로 와야만 시작.
- 뒤 토스트는 인터랙션 비활성 (`pointerEvents: 'none'`, `Pressable.disabled`, `Gesture.enabled(false)`).

### 시각

```
stackTranslateY = stackIndex · 10px  (top: 아래로, bottom: 위로)
stackScale      = 1 - stackIndex · 0.06
```

- stackIndex 0: 원본 크기, 위치 원점
- stackIndex 1: 94% scale, 10px offset
- stackIndex 2: 88% scale, 20px offset

stackProgress shared value에 prop change 시 `withTiming(260ms, easeOut)` 으로 부드럽게 보간.

### 렌더 순서

```
topItems = items.filter(top).slice(-3)      // 마지막 3개 (newest 포함)
bottomItems = items.filter(bottom).slice(-3)
```

배열 순서대로 render → 마지막 child가 z-index 최상 (RN 기본). newest가 front (stackIndex=0)로 보임.

### 호스트 위치

```
top host:    position: 'absolute', top: insets.top + 8
bottom host: position: 'absolute', bottom: insets.bottom + 8
```

각 토스트는 `position: 'absolute'`, `top: 0` (top host) 또는 `bottom: 0` (bottom host) + transform으로 stack offset.

### 모두 제거 버튼

활성 토스트 (`!_dismissing`) 가 3개 이상일 때 host 안에 등장.

- top 토스트 → stack 아래에 (`top: frontHeight + (count-1)·10 + 14`)
- bottom 토스트 → stack 위에 (`bottom: frontHeight + (count-1)·10 + 14`)
- 위치는 **front 토스트의 실측 높이** 기반 (`onMeasure` 콜백으로 측정)
- 위치/visibility 모두 sharedValue + withTiming(220ms)로 부드럽게 보간

활성 카운트 0 되면 (= 모두제거 누른 순간 모두 `_dismissing` 마킹) 즉시 fade out.

스타일: `borderRadius: 999` (pill), `backgroundColor: 'rgba(17,24,39,0.06)'`, 텍스트 `#6B7280` (subtle).

## 애니메이션

### Entry

```
ENTRY_SPRING = { mass: 0.5, damping: 14, stiffness: 220 }
- translateY: -160 (top) / +160 (bottom) → 0  (spring)
- opacity: 0 → 1  (timing 200ms)
```

### Exit (자동 dismiss / 외부 dismiss / action click)

```
EXIT_TRANSLATE_DISTANCE = 50
- translateY: 0 → -50 (top) / +50 (bottom)  (timing 320ms easeInOut cubic)
- opacity: 1 → 0  (timing 240ms easeOut cubic)
```

### Swipe exit

```
ENTRY_OFFSCREEN = 160 (= entry 거리와 동일, 멀리 슬라이드 아웃)
- dragY: continuing finger value → -160/+160  (timing 240ms easeOut cubic)
- opacity: 1 → 0  (timing 240ms easeOut cubic)
```

### Stack 보간

```
stackProgress shared value (= stackIndex)
withTiming(stackIndex, { duration: 260, easing: Easing.out(Easing.cubic) })
→ stackTranslateY / stackScale 자동 보간
```

### Android elevation 페이드 보정

```
elevation = opacity.value * 10  (Android만, iOS는 0 no-op)
```

Android의 elevation은 system 컴포지터가 별도 레이어로 렌더해서 부모 opacity가 cascade되지 않음 → opacity 0이 됐는데 shadow만 남는 잔여 효과 방지용. iOS는 shadow가 layer-based라 cascade 정상 → no-op.

### `needsOffscreenAlphaCompositing`

토스트 wrapper의 RN prop. Android에서 nested View + opacity + elevation 페이드 시 각 레이어(elevation 그림자, border, surface bg)가 개별 합성돼서 "여백은 회색, 콘텐츠 영역은 투명" 으로 분리되는 이슈 해결. 트리 전체를 오프스크린 비트맵으로 한 번에 그린 다음 opacity 적용. iOS와 동일하게 균일 페이드.

### Reduce motion

`AccessibilityInfo.isReduceMotionEnabled()` true 시:
- entry: translateY 즉시 0 (spring 없음), opacity timing 120ms
- stack 변화: timing 없이 즉시 적용

`reduceMotionChanged` 이벤트 구독해서 런타임 변화도 반영.

## Promise 패턴

```ts
const id = upsert({ message: opts.loading, type: 'default', duration: Infinity });
try {
  const value = await promise;
  upsert({ id, type: 'success', message: typeof opts.success === 'function' ? opts.success(value) : opts.success });
  return value;
} catch (err) {
  upsert({ id, type: 'error', message: typeof opts.error === 'function' ? opts.error(err) : opts.error });
  throw err;
}
```

- 동일 `id` upsert → 토스트는 그 자리에서 내용/타입만 바뀜 (re-mount 안 함, 자체 onShow/haptic 재실행 안 함)
- 최종 duration은 `TOAST_DEFAULT_DURATION` (3500ms)
- promise 에러는 호출자에게 re-throw

## 외부 dismiss 흐름

```
toast.dismiss(id)
  → markDismissing(id) → setItems(prev.map: _dismissing=true)
  → Toast 컴포넌트가 useEffect로 _dismissing 감지 → triggerExit
  → exit 애니메이션 (320ms translateY + 240ms opacity) 완료
  → onComplete: onDismiss callback + onRemove(id)
  → setItems(prev.filter: id !== this.id) → 실제 unmount
```

### Bulk dismiss (모두제거 / dismissAll / dismissPosition)

동시 fade하면 overlap 영역이 see-through로 보이는 시각 이슈 회피 위해 **80ms staggered sequential**:

```
target = items.filter(condition).filter(!_dismissing).reverse()
target.forEach((item, idx) =>
  idx === 0 ? markDismissing(item.id) : setTimeout(() => markDismissing(item.id), idx * 80)
)
```

front부터 거꾸로 80ms 간격으로 마킹 → 각 토스트는 자체 exit 애니메이션 재생 → 동시에 fading하는 토스트가 사실상 1개라 overlap 시각 이슈 없음.

## `_dismissing` 플래그 (내부 전용)

`ToastItem`에 internal field. 외부에서 만지면 안 됨. provider가 마킹하고 Toast 컴포넌트가 감지. 마킹된 토스트:
- 모두제거 버튼의 active count에서 제외
- 자체 exit 애니메이션 트리거

## `onMeasure` (내부 전용)

Toast wrapper의 `onLayout` 콜백으로 실측 높이 측정 → ToastHost가 모두제거 버튼 위치 보정. promise 등으로 내용 변경되면 자동 재측정.

## A11y

- 토스트 wrapper: `accessibilityRole="alert"`
- `accessibilityLiveRegion`: error/warning은 `'assertive'`, 그 외 `'polite'`
- 등장 시 `AccessibilityInfo.announceForAccessibility(text)` 자동 호출 — 스크린리더 즉시 안내. `text`는 `[title, description, message]` filter(Boolean).join(', ').
- 액션 버튼은 Button 컴포넌트의 a11y 그대로
- 모두제거 버튼: `accessibilityRole="button"` + `accessibilityLabel="모두 제거"`
- 아이콘은 `accessibilityLabel={item.type}` (type 이름) — meaningful icon으로 처리

## Haptic

```
success → Haptics.notificationAsync(Success)
error   → Haptics.notificationAsync(Error)
warning → Haptics.notificationAsync(Warning)
default / info → 없음
```

silent fail (`.catch(() => {})`).

## 알아둘 점 / 함정

- **`ToastProvider` 한 번만 마운트** — 중첩 X. 이미 App root에 있음.
- **promise 패턴은 id 재사용** — `upsert(id, type='success/error')` 로 동일 토스트 갱신. 새 토스트 안 만듦.
- **`message` vs `title`** — title 있으면 message 표시 안 됨 (둘 다 줘도). description은 둘 다와 공존 가능.
- **`id`를 직접 명시하면 충돌 시 덮어쓰기** — 의도 안 했으면 자동 생성 (`toast_${seq}`)에 맡길 것.
- **`duration: Infinity`** 면 auto-dismiss 안 됨 — 반드시 수동 `dismiss(id)` 호출.
- **`_dismissing`은 internal field** — 직접 set/read하지 말 것. provider의 dismiss API만 사용.
- **싱글톤 `toast`는 ToastProvider 마운트 전엔 no-op** — 앱 시작 시점에 너무 일찍 호출하면 silent fail. provider 마운트 이후부터 안전.
- **swipe 임계값 24px / 600px/s 는 OR** — 둘 중 하나만 만족하면 dismiss.
- **뒤 토스트는 timer 정지** — 5개 큐일 때 가장 오래된 거 timer 안 돎. front 될 때 fresh duration으로 시작.
- **bulk dismiss는 staggered 80ms sequential** — 시각 이슈 회피용. 동시 트리거 아님.
- **Android elevation은 opacity와 함께 보간** — 잔여 그림자 방지. `useToastAnimation` `shadowStyle` 참고.
- **`needsOffscreenAlphaCompositing`** — Android 페이드 시 레이어 분리 이슈 회피. 토스트 wrapper에 항상 적용.
- **stack 효과는 scale + translateY 만** — 색 변화 없음. 첫 시도 때 회색 dim overlay를 줬다가 overlap/peek 색 불일치 이슈로 제거됨. 이력 참고용.
- **dismiss 시 onDismiss 콜백 → onRemove(id) → state filter** 순서. callback 안에서 다시 dismiss 호출해도 `removedRef`/`exitingRef` 가드로 안전.
- **`useToast()`는 ToastContext가 null이면 throw** — provider 밖에서 호출 시 dev에서 즉시 발견.

## 디렉터리

```
Toast/
├─ Toast.tsx            # 개별 토스트 뷰 (gesture, 애니메이션, dismiss 트리거)
├─ ToastHost.tsx        # 포지션별 스택 호스트 + ClearAllButton (모두제거)
├─ ToastProvider.tsx    # Context + 큐 상태 + upsert/dismiss + promise + 싱글톤 등록
├─ useToast.ts          # ToastContext + useToast hook + toast 싱글톤 + _registerToastAPI
├─ Toast.styles.ts      # 색·아이콘·layout lookup + 상수 + getAccentBarStyle
├─ Toast.types.ts       # ToastInput / ToastItem / ToastAPI / PromiseToastOptions 등
├─ Toast.animation.ts   # useToastAnimation (entry/exit/swipe + stack + Android elevation)
└─ index.ts             # public export
```

## 의존성

- `react-native-reanimated` — 모든 애니메이션 워클렛
- `react-native-gesture-handler` — swipe-to-dismiss (Pan gesture)
- `react-native-safe-area-context` — 호스트 inset 보정
- `expo-haptics` — type별 haptic
- `../Icon` — 아이콘 표시 + IconName 타입 + Icon 컴포넌트
- `../Button` — 액션 버튼 (variant="text" size="sm")
- `../Spinner` — (간접) Toast가 직접 안 쓰지만 같은 컴포넌트 family

## 공개 vs 내부 API

| 공개 | 내부 (외부 사용 X) |
|---|---|
| `Toast` (개별 컴포넌트는 안 export됨) | |
| `ToastProvider` | |
| `useToast`, `toast` | `_registerToastAPI` (provider 전용) |
| `ToastContext` (X — 안 export됨) | `ToastContext` 내부 |
| 타입: `ToastInput`, `ToastType`, `ToastPosition`, `ToastAction`, `PromiseToastOptions`, `ToastAPI` | `ToastItem._dismissing`, `ToastShortcutOptions` (내부 helper 타입) |
