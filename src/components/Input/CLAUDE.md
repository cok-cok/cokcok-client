# Input

폼 입력 전반의 텍스트 필드. 단일/멀티라인, 이메일, 비밀번호, 숫자까지 하나의 컴포넌트로 처리. RN `TextInput` wrapper.

## Import

```ts
import { Input } from '@/components/Input';
import type { InputProps, InputVariant, InputSize, InputType } from '@/components/Input';
// 상대 경로: '../../components/Input'
```

## Props (Public API)

```ts
type InputProps = Omit<TextInputProps, 'style'> & {
  variant?: 'outline' | 'underline' | 'filled';                       // default 'outline'
  size?: 'sm' | 'md' | 'lg';                                            // default 'md'
  type?: 'text' | 'email' | 'password' | 'number' | 'multiline';        // default 'text'
  label?: string;                                                       // 상단 라벨
  required?: boolean;                                                   // label 뒤 빨간 *
  helperText?: string;                                                  // 하단 헬퍼
  error?: string;                                                       // 에러 메시지 (있으면 helperText 덮음)
  iconLeft?: ReactNode;                                                 // 박스 좌측 슬롯
  iconRight?: ReactNode;                                                // 박스 우측 슬롯 (loading/password/clearable에 의해 덮일 수 있음)
  loading?: boolean;                                                    // 우측 스피너 표시
  clearable?: boolean;                                                  // 값 있고 disabled 아닐 때 우측 X 아이콘
  trailingAction?: ReactNode;                                           // 박스 우측 외부 컴포넌트 (e.g. "중복확인" Button)
  showCounter?: boolean;                                                // maxLength와 함께 사용 시 'N/M' 표시
  shakeOnError?: boolean;                                               // default true. error false→true 전환에만 발화
  style?: StyleProp<ViewStyle>;                                         // 외부 컨테이너 override
  inputStyle?: StyleProp<TextStyle>;                                    // 내부 TextInput override
  // ↓ TextInputProps 그대로 통과
  // value, onChangeText, defaultValue, editable (false=disabled),
  // returnKeyType, onSubmitEditing, maxLength, autoFocus, blurOnSubmit,
  // accessibilityLabel, accessibilityHint, accessibilityState, ...
};
```

`forwardRef<TextInput>` — 내부 `TextInput` ref. `.focus()`, `.blur()`, `.clear()` 호출 가능.

## Variants (Visual)

| variant | 박스 | focus 시각 변화 |
|---|---|---|
| `outline` | 전체 border 1.5px, `borderRadius: 10` | bg 그대로, border 색 → brand |
| `underline` | bottom border 1.5px만, `borderRadius: 0` | bottom border 색 → brand |
| `filled` | bg gray-100 + 투명 border 1.5px | bg 유지, border가 brand로 등장 |

## `INPUT_COLORS` 매트릭스

`Input.styles.ts`의 `INPUT_COLORS` — `container[variant] × {background, border} × {default, focus, error, disabled}` + `label × {default, focus, error, disabled}` + `helper × {default, error, disabled}`.

색상 상수:
- BRAND `#FD4C06`
- DANGER `#DC2626`
- BORDER_DEFAULT `#D1D5DB` (gray-300)
- BORDER_DISABLED `#E5E7EB` (gray-200)
- BG_FILLED `#F3F4F6` (gray-100)
- BG_FILLED_DISABLED `#F9FAFB` (gray-50)
- LABEL_DEFAULT `#374151` (gray-700)
- LABEL_DISABLED `#9CA3AF` (gray-400)
- HELPER_DEFAULT `#6B7280` (gray-500)
- HELPER_DISABLED `#9CA3AF` (gray-400)
- TEXT_DEFAULT `#111827` (gray-900) — TextInput 본문 색 + cursor + selection
- PLACEHOLDER `#9CA3AF`
- ICON_NEUTRAL `#6B7280` — normal/clearable/password/loading 아이콘
- ICON_DISABLED `#9CA3AF`

variant 추가하거나 색 조정할 때 단일 위치만 수정.

## Sizes

| size | paddingV | paddingH | minHeight | label fontSize | TextInput fontSize | helper fontSize | icon size | spinner |
|---|---|---|---|---|---|---|---|---|
| `sm` | 8 | 12 | 36 | 12 | 13 | 11 | 16 | sm |
| `md` | 10 | 14 | 44 | 13 | 15 | 12 | 18 | md |
| `lg` | 12 | 16 | 52 | 14 | 17 | 13 | 20 | lg |

multiline: `minHeight: 80`, `textAlignVertical: 'top'`, `paddingTop: 0`.

## Types — TextInputProps 자동 매핑 (`TYPE_DEFAULTS`)

| type | 적용 TextInputProps |
|---|---|
| `text` | (없음) |
| `email` | `keyboardType: 'email-address'`, `autoCapitalize: 'none'`, `autoComplete: 'email'`, `textContentType: 'emailAddress'`, `autoCorrect: false`, `spellCheck: false` |
| `password` | `autoCapitalize: 'none'`, `autoComplete: 'password'`, `textContentType: 'password'`, `autoCorrect: false`, `spellCheck: false` + 내부 visibility state + 눈 아이콘 자동 |
| `number` | `keyboardType: 'numeric'`, `autoCorrect: false`, `spellCheck: false` |
| `multiline` | `multiline: true`, `textAlignVertical: 'top'` (+ min-height 80) |

**적용 순서**: `{...typeDefaults, ...rest}` → user props가 typeDefaults를 override 가능. ref·value 등 컴포넌트 내부에서 강제하는 props는 마지막에 또 덮어씀.

## 사용 패턴

```tsx
// 기본 (uncontrolled)
<Input label="이름" placeholder="이름 입력" />

// controlled
<Input label="이름" value={name} onChangeText={setName} placeholder="이름 입력" />

// 이메일 + 필수
<Input type="email" label="이메일" required placeholder="example@cokcok.com" />

// 비밀번호 (눈 토글 자동)
<Input type="password" label="비밀번호" helperText="영문/숫자 8자 이상" />

// 에러 (있으면 자동으로 shake 한 번 + alertCircle 아이콘 + 빨강 텍스트)
<Input label="이메일" value={email} error={emailError} onChangeText={setEmail} />

// clearable
<Input label="검색" value={q} onChangeText={setQ} clearable />

// loading (검증 중)
<Input label="닉네임" value={nick} onChangeText={setNick} loading={isChecking} />

// trailingAction (외부 버튼)
<Input
  label="닉네임"
  value={nick}
  onChangeText={setNick}
  trailingAction={<Button size="md" variant="secondary" label="중복 확인" onPress={check} />}
/>

// counter + maxLength
<Input
  type="multiline"
  label="설명"
  value={desc}
  onChangeText={setDesc}
  maxLength={100}
  showCounter
/>

// disabled (RN 표준: editable=false)
<Input label="비활성" editable={false} value="고정값" />

// forwardRef + 체이닝
const pwRef = useRef<TextInput>(null);
<>
  <Input type="email" returnKeyType="next" onSubmitEditing={() => pwRef.current?.focus()} />
  <Input ref={pwRef} type="password" returnKeyType="done" />
</>
```

## 우측 아이콘 우선순위

```
loading > password (eye/eyeOff 토글) > clearable (값 있고 !disabled 일 때 X) > iconRight (caller)
```

`loading` 켜져 있으면 `clearable`이나 `password` 토글 무시되고 spinner 표시.

## 상태 애니메이션 (`useInputStateAnimation`)

각 상태(focus / error / disabled)마다 독립 progress shared value.

```
TIMING = { duration: 180 }   // 색 전환

progress (0→1) ─ withTiming ─→ interpolateColor 체인
                                 ↓ default → focus
                                 ↓ → error
                                 ↓ → disabled (우선순위: disabled > error > focus > default)
                                 ↓
                                 backgroundColor / borderColor 합성
```

- box: backgroundColor + borderColor (layer 합성)
- label: color
- helper: color (focus는 영향 안 줌 — error와 disabled만)

### shakeOnError

```
SHAKE_TIMING = { duration: 60 } per step
SHAKE_OFFSETS = [-6, 6, -4, 4, -2, 0]  // 5단계 진동 + rest
```

`error` false→true 전환에만 발화 (`prevErrorRef`로 비교). 매 렌더마다 흔들리지 않음. `shakeOnError={false}` 로 끌 수 있음.

## 내부 동작 상세

### Controlled / Uncontrolled

```ts
const isControlled = value !== undefined;
const currentValue = isControlled ? value : internalValue;
```

- `value` 있으면 controlled. `internalValue` state 무시.
- 없으면 uncontrolled. `defaultValue` 로 초기화, `internalValue` state로 추적.
- `onChangeText` 콜백은 둘 다에서 호출.

### Disabled signaling

RN 표준 따라 `editable={false}` 가 disabled 신호.

```ts
const disabled = editable === false;
```

`editable={!disabled}` 로 다시 TextInput에 전달. `disabled` 상태가 다른 곳(아이콘 색, a11y state)도 트리거.

### 자동 blur

```ts
useEffect(() => {
  if (disabled && focused) {
    internalRef.current?.blur();
  }
}, [disabled, focused]);
```

포커스 중에 `editable={false}` 되면 자동으로 키보드 내려감.

### Password Toggle

내부 `passwordVisible` state. 우측에 자동으로 Pressable 렌더:
- `eye` / `eyeOff` 아이콘 (lucide)
- `accessibilityLabel`: `'비밀번호 보이기'` / `'비밀번호 숨기기'` — 한글 hardcoded. 다국어 시 수정 필요.
- `hitSlop: 8`
- `secureTextEntry = isPassword && !passwordVisible`

### Clearable

```ts
const hasValue = Boolean(currentValue && currentValue.length > 0);
// clearable && hasValue && !disabled 일 때만 X 아이콘 표시
```

X 누르면 `handleClear`:
```ts
handleChangeText('');     // uncontrolled면 state 비우고, controlled면 onChangeText('')만
internalRef.current?.focus();  // 다시 포커스
```

### Counter

```ts
const counter = showCounter && maxLength ? `${currentValue?.length ?? 0}/${maxLength}` : null;
```

bottom row의 우측에 표시. 색은 helperStyle 따라감.

### Bottom row 렌더 조건

`error || helperText || counter` 중 하나라도 있으면 렌더.

- 에러 있을 때: `[alertCircle 14px / error 텍스트]` (helperText 덮음)
- 에러 없으면: helperText
- 카운터 있으면 우측 끝에 추가

### Layout

- `trailingAction` 없으면: `[ container[gap:6] → boxWrapper → label / box / bottomRow ]`
- `trailingAction` 있으면: `[ outerContainer[gap:4] → rowWithTrailing → boxWrapper + trailingAction ]`
- 박스 전체 영역이 `AnimatedPressable` — 어디 눌러도 TextInput focus

### 색 매핑

- `placeholderTextColor`: `#9CA3AF`
- `cursorColor`: `#111827` (iOS 기본 파랑 회피)
- `selectionColor`: `#111827`

### a11y 자동

```ts
accessibilityLabel = userLabel ?? label;
accessibilityHint = userHint ?? error ?? helperText;
accessibilityState = { disabled, ...userState };
```

에러 아이콘에도 `accessibilityLabel="에러"` 자동.

## 알아둘 점 / 함정

- **`editable={false}`가 disabled 신호** — `disabled` prop은 없음. RN 표준 따름.
- **`error` 있으면 helperText 표시 안 됨** — helperText 자리에 error 메시지로 대체.
- **`shakeOnError`는 false→true 전환에만** — 매 렌더마다 흔들리지 않음. 의도된 동작.
- **password 토글 라벨이 한글 hardcoded** — 다국어 들어가면 i18n 처리 필요.
- **`iconRight` prop은 loading/password/clearable에 의해 덮일 수 있음** — 4개 동시에 켜면 우선순위에 따라 1개만 보임.
- **multiline 시 minHeight 80px 보장** — `multilineInput` 스타일에서.
- **forwardedRef는 함수형도 지원** — `(node) => {}` ref callback도 처리.
- **`AnimatedPressable`이 박스 클릭 처리** — Pressable's function-as-style 안 쓰고 그냥 배열로 처리해서 안전.
- **`accessibilityHint` 우선순위: 사용자 명시 > error > helperText**.
- **자동 blur는 `editable={false}` 들어올 때만** — `disabled` 다른 신호 없음.

## 디렉터리

```
Input/
├─ Input.tsx           # 뷰 (forwardRef + 상태 관리)
├─ Input.styles.ts     # INPUT_COLORS + StyleSheet + 조합 함수
├─ Input.types.ts      # InputProps / InputVariant / InputSize / InputType
├─ Input.animation.ts  # useInputStateAnimation (focus/error/disabled 보간 + shake)
└─ index.ts            # public export
```

## 의존성

- `react-native-reanimated` — 색 보간 + shake
- `../Icon` — Icon (alertCircle / eye / eyeOff / x) + IconSizeContext (아이콘 크기 자동 주입)
- `../Spinner` — loading 시 표시 (현재 `color="black"` 고정)
