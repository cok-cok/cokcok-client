# Button

서비스 전반의 모든 탭 가능한 액션. CTA, 보조 액션, 인라인 링크, 위험 액션, 중립 액션 모두 이 하나로 처리.

## Import

```ts
import { Button } from '@/components/Button';
import type { ButtonProps, ButtonVariant, ButtonSize, ButtonHaptic } from '@/components/Button';
// 상대 경로: '../../components/Button'
```

## Props (Public API)

```ts
type ButtonProps = Omit<PressableProps, 'children' | 'style' | 'onPress'> & {
  label?: string;                                // 텍스트 라벨 (없으면 icon-only)
  variant?: 'primary' | 'secondary' | 'text' | 'danger' | 'normal';  // default 'primary'
  size?: 'sm' | 'md' | 'lg';                     // default 'md'
  fullWidth?: boolean;                            // 부모 너비로 stretch
  iconLeft?: ReactNode;                           // 좌측 아이콘 슬롯
  iconRight?: ReactNode;                          // 우측 아이콘 슬롯
  loading?: boolean;                              // 수동 loading - 콘텐츠 숨기고 Spinner 오버레이
  haptic?: 'light' | 'medium' | 'heavy';         // 누를 때 expo-haptics impact
  onPress?: (e: GestureResponderEvent) => void | Promise<unknown>;
                                                  // Promise 반환 시 자동 loading
  style?: StyleProp<ViewStyle>;                   // 컨테이너 override (배열 마지막)
  labelStyle?: StyleProp<TextStyle>;              // 라벨 override (배열 마지막)
  pressedStyle?: StyleProp<ViewStyle>;            // pressed 상태 추가 스타일
  // ↓ PressableProps 그대로 통과
  // disabled, hitSlop, onPressIn, onPressOut, onLongPress,
  // accessibilityLabel, accessibilityState, accessibilityHint, testID, etc.
};
```

`forwardRef<View>` — 컨테이너 View ref. `measure()`, focus 등에 활용 가능.

## Variants (Visual & Color)

| variant | 배경 | 보더 | 라벨 색 | shadow | 용도 |
|---|---|---|---|---|---|
| `primary` | brand `#FD4C06` | none | 흰색 | brand glow (offset 0,2 / radius 4) | 메인 CTA |
| `secondary` | transparent | brand 1.5px | brand `#FD4C06` | none | 보조 액션 |
| `text` | transparent | none | brand `#FD4C06` (fontWeight 600) | none | 인라인 링크 |
| `danger` | danger `#DC2626` | none | 흰색 | danger glow (offset 0,2 / radius 4) | 파괴적 액션 |
| `normal` | gray-100 `#F3F4F6` | none | gray-900 `#111827` | none | 중립 액션 |

**disabled 시 (variant별 override)**:
- `primary` / `danger` — bg → `#E5E7EB` (gray-200), shadow 제거 (shadowOpacity 0, elevation 0)
- `secondary` — borderColor → `#D1D5DB` (gray-300)
- `text` — 컨테이너 변화 없음
- `normal` — bg → `#E5E7EB`
- **라벨 색은 모든 variant에서 `#9CA3AF` (gray-400)** 로 통일 (d_label)

## Sizes

| size | paddingV | paddingH | label fontSize | spinner | icon size | 자동 hitSlop |
|---|---|---|---|---|---|---|
| `sm` | 7 | 14 | 13 | sm | 16 | +6px |
| `md` | 11 | 18 | 15 | md | 18 | 0 |
| `lg` | 15 | 24 | 17 | lg | 20 | 0 |

**공통**:
- `borderRadius: 12`
- label `fontWeight: '700'`, `letterSpacing: -0.2`, `includeFontPadding: false`
- `alignSelf: 'flex-start'` (default — content-fit). `fullWidth` 시 `'stretch'`
- container `alignItems: 'center'`, `justifyContent: 'center'`
- contentRow `flexDirection: 'row'`, `alignItems: 'center'`, `justifyContent: 'center'`, `gap: 6`
- contentRow `minWidth: SPINNER_TOTAL_WIDTH[size]` — loading 시 spinner가 중앙정렬되도록 보정 (sm 26 / md 34 / lg 42)

## Variant × Spinner 색 매핑 (`BUTTON_SPINNER_COLOR`)

| variant | Spinner color |
|---|---|
| `primary` | `'white'` |
| `secondary` | `'brand'` |
| `text` | `'brand'` |
| `danger` | `'white'` |
| `normal` | `'black'` |

`BUTTON_SPINNER_COLOR[variant]` 로 lookup. variant 추가 시 여기 추가 필요.

## Icon 자동 사이즈 (`BUTTON_ICON_SIZE`)

`Button`은 자체적으로 `IconSizeContext.Provider`로 size 주입. 그래서 `iconLeft={<Icon name="x" />}` 만 써도 부모 Button size에 따라 16 / 18 / 20 자동 적용.

호출자가 `<Icon name="x" size={24} />` 처럼 명시하면 override됨.

**아이콘 색은 자동 매핑 안 됨** — variant가 색을 칠해주지 않음. primary/danger 위에 흰 아이콘 원할 시 `<Icon name="x" color="white" />` 명시 필요.

## Icon Slot Margin

- 라벨과 아이콘이 같이 있을 때만 `marginLeft: -6` (iconLeft) / `marginRight: -6` (iconRight) 적용
- icon-only 시 (label 없음) → margin 적용 안 됨 → 가운데 정렬 유지

## 사용 패턴

```tsx
// 기본 (variant primary, size md 디폴트)
<Button label="로그인" onPress={handleLogin} />

// 메인 CTA — fullWidth + lg + haptic
<Button variant="primary" size="lg" fullWidth haptic="medium" label="저장" onPress={save} />

// async onPress — Promise 반환 시 자동 loading
<Button label="저장" onPress={async () => { await api.save(); }} />

// 수동 loading 토글
<Button label="저장" loading={isSaving} onPress={save} />

// icon + label
<Button iconLeft={<Icon name="plus" color="white" />} label="추가" onPress={add} />

// icon-only — accessibilityLabel 필수
<Button iconLeft={<Icon name="x" color="white" />} accessibilityLabel="닫기" onPress={close} />

// 위험 액션
<Button variant="danger" label="삭제" haptic="heavy" onPress={confirmDelete} />

// text 링크
<Button variant="text" label="회원가입" onPress={() => nav.navigate('Signup')} />

// 중립 (취소 등)
<Button variant="normal" label="취소" onPress={close} />

// pressedStyle override
<Button label="눌러보세요" pressedStyle={{ backgroundColor: 'purple' }} onPress={noop} />
```

## 내부 동작 상세

### Loading 상태

```
isLoading  = loading || pendingPress       // 수동 또는 자동
isBlocked  = disabled || isLoading         // 누름 차단 + a11y busy
```

- **자동 loading (Promise 감지)**:
  ```ts
  const result = onPress(event);
  if (result && typeof (result as Promise).then === 'function') {
    setPendingPress(true);
    result.finally(() => setPendingPress(false));
  }
  ```
  duck typing — 진짜 Promise가 아니어도 thenable이면 작동.
- 로딩 중 콘텐츠 row는 `opacity: 0` 으로 숨김 (레이아웃은 유지 → 사이즈 shift 없음)
- 가운데에 절대 위치 `<Spinner color={BUTTON_SPINNER_COLOR[variant]} size={size} />` 오버레이
- `pointerEvents="none"` on 오버레이 (clicks 통과)

### Press 애니메이션 (`useButtonPressAnimation`)

```
PRESS_SPRING = { mass: 0.4, damping: 14, stiffness: 220 }
pressIn:  scale 1→0.96 (spring), opacity 1→0.92 (timing 80ms)
pressOut: scale 0.96→1 (spring), opacity 0.92→1 (timing 140ms)
```

`AnimatedPressable = Animated.createAnimatedComponent(Pressable)` 사용. press animation은 transform/opacity 워클렛.

### pressedStyle 구현

`Pressable`의 function-as-style 형태 (`style={({pressed}) => [...]}`)를 `AnimatedPressable`이 처리 못 함 (스타일 전체가 무시됨 — 알려진 RN 버그). 우회: 로컬 `useState`로 `pressed` 추적 → `style` 배열 마지막에 `pressed && pressedStyle` 합치기.

### Haptic

```ts
const HAPTIC_STYLE = {
  light: Haptics.ImpactFeedbackStyle.Light,
  medium: Haptics.ImpactFeedbackStyle.Medium,
  heavy: Haptics.ImpactFeedbackStyle.Heavy,
};
```

`Haptics.impactAsync(...).catch(() => {})` — 디바이스 미지원 시 silent fail.

### A11y 자동

- `accessibilityRole="button"` 고정
- `accessibilityLabel ?? label` (둘 다 없으면 undefined — icon-only는 반드시 명시)
- `accessibilityState = { disabled: isBlocked, busy: isLoading, ...accessibilityState }`

## 알아둘 점 / 함정

- **기본 width는 content-fit** (`alignSelf: 'flex-start'`). flex row 컨테이너에서 stretch 원하면 `fullWidth` 명시.
- **`contentRow`에 `minWidth: SPINNER_TOTAL_WIDTH[size]`** 가 늘 적용됨 → 라벨이 매우 짧아도 (`"sm"` 등) 버튼이 spinner 너비 이상으로 늘어남. 의도된 동작 (loading 시 spinner 중앙정렬 위함).
- **`AnimatedPressable` + function-style 안 됨** — 이 컴포넌트가 이미 우회 처리 (배열 형태 + 로컬 pressed state). 직접 비슷한 패턴 만들 때 주의.
- **`text` variant는 disabled 시 컨테이너 시각 변화 없음** (그 위치만 라벨 색만 바뀜).
- **icon 색은 직접 칠해야 함** — variant가 자동으로 안 칠해줌.
- **sm hitSlop 6px 자동** — 시각적으로 작아도 터치 영역 확보. 외부에서 `hitSlop` 명시하면 그게 우선.
- **`labelStyle`은 배열 마지막** — variant·size·disabled 모두 override 가능.
- **`style`도 배열 마지막** — disabled도 override 가능. (의도된 동작)
- **Promise 안의 throw도 자동 처리** — `.finally(() => setPendingPress(false))` 라서 성공/실패 무관하게 loading 해제.

## 디렉터리

```
Button/
├─ Button.tsx          # 뷰 (forwardRef, Pressable + 애니메이션 wrap)
├─ Button.styles.ts    # 색·사이즈 lookup + getContainerStyle / getLabelStyle
├─ Button.types.ts     # ButtonProps / ButtonVariant / ButtonSize / ButtonHaptic
├─ Button.animation.ts # useButtonPressAnimation (scale+opacity spring/timing)
└─ index.ts            # public export: Button + types
```

## 의존성

- `expo-haptics` — haptic feedback
- `react-native-reanimated` — press 애니메이션
- `../Icon` — IconSizeContext (자식 아이콘 사이즈 자동 주입)
- `../Spinner` — loading 시 표시 + SPINNER_TOTAL_WIDTH (contentRow minWidth)
