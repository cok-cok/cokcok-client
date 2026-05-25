# Spinner

서비스 전용 로딩 인디케이터. 3개 원이 좌→우로 순차 점프 (damped sine). 단독으로도, `Button`/`Input`의 loading 슬롯에서도 자동 사용.

## Import

```ts
import { Spinner, SPINNER_TOTAL_WIDTH } from '@/components/Spinner';
import type { SpinnerColor, SpinnerSize, SpinnerProps } from '@/components/Spinner';
// 상대 경로: '../../components/Spinner'
```

## Props (Public API)

```ts
type SpinnerProps = {
  color?: 'brand' | 'white' | 'black';  // default 'brand'
  size?: 'sm' | 'md' | 'lg';             // default 'md'
  style?: StyleProp<ViewStyle>;          // 컨테이너 row override
  accessibilityLabel?: string;           // default '로딩 중'
};
```

## Colors (staircase 그라데이션)

세 원 모두 같은 베이스 + opacity 0.7 / 0.85 / 1.0 단계. 1번 원(좌측)이 가장 흐리고, 3번 원(우측)이 가장 진함.

| color | 1번 (좌) | 2번 (중) | 3번 (우) | 권장 배경 |
|---|---|---|---|---|
| `brand` | `rgba(253, 76, 6, 0.7)` | `rgba(253, 76, 6, 0.85)` | `rgba(253, 76, 6, 1)` | 흰/밝은 배경 |
| `white` | `rgba(255, 255, 255, 0.7)` | `rgba(255, 255, 255, 0.85)` | `rgba(255, 255, 255, 1)` | **어두운 배경 전용** |
| `black` | `rgba(17, 24, 39, 0.7)` | `rgba(17, 24, 39, 0.85)` | `rgba(17, 24, 39, 1)` | 흰/밝은 배경 |

색 매트릭스는 `SPINNER_COLORS` 로 export.

## Sizes

| size | 원 지름 | 원 borderRadius | gap | 전체 너비 `SPINNER_TOTAL_WIDTH` | 점프 높이 `SPINNER_JUMP_HEIGHT` |
|---|---|---|---|---|---|
| `sm` | 6 | 3 | 4 | 26 (6·3 + 4·2) | -3 |
| `md` | 8 | 4 | 5 | 34 (8·3 + 5·2) | -4 |
| `lg` | 10 | 5 | 6 | 42 (10·3 + 6·2) | -5 |

`SPINNER_TOTAL_WIDTH` 는 외부에서 import 가능 — Button이 contentRow `minWidth` 보정용으로 사용 (loading 시 spinner 중앙정렬 보장).

## 컨테이너 레이아웃

```
row: flexDirection 'row', alignItems 'center', justifyContent 'center'
gap: size별 4/5/6
```

각 원은 `Animated.View` (transform: translateY 워클렛 적용). 컨테이너 `style` prop은 row에 마지막 배열로 합쳐짐 — caller가 padding/margin override 가능.

## 애니메이션 (damped sine)

```
y(p) = jumpHeight · AMPLITUDE_SCALE · sin(2π · CYCLES · p) · exp(-DECAY · p)

CYCLES = 1.5     // 1.5 진동
DECAY  = 1.5     // exp 감쇠
PHASE  = 2π · CYCLES = 3π
AMPLITUDE_SCALE = 1 / exp(-DECAY / (4·CYCLES)) = 1 / exp(-0.25) ≈ 1.284
```

`AMPLITUDE_SCALE`은 첫 peak에서 nominal `jumpHeight` 진폭 도달하도록 보정.

### 진행 (jumpHeight = -5 (lg) 기준)

| progress | y | 의미 |
|---|---|---|
| 0.000 | 0 | 시작 |
| 0.167 | -5.0 | 1차 peak (위) |
| 0.333 | 0 | zero crossing |
| 0.500 | +3.0 | 2차 peak (아래, 진폭 ~60%) |
| 0.667 | 0 | zero crossing |
| 0.833 | -1.85 | 3차 peak (위, 진폭 ~37%) |
| 1.000 | 0 | 자연 수렴 (속도/진폭 모두 0) |

마지막 progress=1 지점에서 sin = 0 + 속도도 같이 0이라 자연 정지. 깔끔하게 끝남.

### 타이밍

```
BOUNCE_DURATION  = 700ms          // 한 원의 점프 사이클 (0→1)
STAGGER          = 220ms          // 원 사이 시작 텀
PAUSE_AFTER_ALL  = 380ms          // 3번 끝나고 1번 재시작까지의 실제 텀
PER_CIRCLE_PAUSE = STAGGER·2 + PAUSE_AFTER_ALL = 820ms
TOTAL_CYCLE      = BOUNCE_DURATION + PER_CIRCLE_PAUSE = 1520ms
```

**각 원의 cycle 길이는 동일** (1520ms), STAGGER만큼 시작 시점만 offset.

1번 입장에서 다음 점프까지 대기 = `BOUNCE(700) + PER_CIRCLE_PAUSE(820) = 1520ms`. 3번이 끝나는 시점 (`STAGGER·2 + BOUNCE = 1140ms`) 후 380ms 가 PAUSE_AFTER_ALL → 1번 재시작.

### 구현 (`useSpinnerAnimation`)

```ts
const buildLoop = () => withRepeat(
  withSequence(
    withTiming(1, { duration: BOUNCE_DURATION, easing: Easing.linear }),
    withDelay(PER_CIRCLE_PAUSE, withTiming(0, { duration: 1 })),
  ),
  -1,  // infinite
);

p1.value = buildLoop();
p2.value = withDelay(STAGGER, buildLoop());
p3.value = withDelay(STAGGER * 2, buildLoop());
```

각 원의 translateY는 useAnimatedStyle에서 위 공식으로 계산.

### Cleanup

`useEffect` cleanup에서 `cancelAnimation(p1/p2/p3)` — unmount 시 메모리 leak 방지.

## 사용 패턴

```tsx
// 기본 (brand, md)
<Spinner />

// 어두운 배경 위 — white
<View style={{ padding: 12, backgroundColor: '#111827' }}>
  <Spinner color="white" size="lg" />
</View>

// 인라인 텍스트 옆
<View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
  <Spinner color="black" size="sm" />
  <Text>저장 중...</Text>
</View>

// 외부 style override
<Spinner style={{ marginTop: 20 }} />

// a11y label override
<Spinner accessibilityLabel="레시피 동기화 중" />
```

## Button/Input 내부 사용

**직접 import해서 쓰면 됨** — 별도 wrapping 불필요.

- Button: `loading` prop 시 자동으로 `<Spinner color={BUTTON_SPINNER_COLOR[variant]} size={size} />` 오버레이
- Input: `loading` prop 시 우측 슬롯에 `<Spinner color="black" size={size} />` (loading > password > clearable > iconRight 우선순위)

## 알아둘 점 / 함정

- **단독으로도 잘 쓰이고 Button/Input에서도 이미 사용 중** — 새 컴포넌트에서 "로딩 어떻게 표시?" 싶으면 이거 갖다 쓰면 됨.
- **`white`는 어두운 배경 전용** — 흰 배경 위에 쓰면 안 보임 (특히 1번 원은 70% opacity).
- **계단식 opacity는 staircase 효과용** — 단색이 필요하면 `Spinner.styles.ts`의 `SPINNER_COLORS` 직접 수정.
- **`accessibilityRole="progressbar"`** 자동.
- **`SPINNER_TOTAL_WIDTH` 외부 import 가능** — Button이 이걸 써서 contentRow minWidth 보정.
- **첫 peak는 정확히 nominal jumpHeight** — AMPLITUDE_SCALE 보정 덕분. 시각적으로 일관됨.
- **마지막 progress=1 지점에서 y=0** — sin(3π) = 0. 자연 정지하고 PAUSE 동안 멈춤. PAUSE 동안에는 withTiming(0, duration:1)로 progress 0으로 리셋 (1ms 진행).
- **재시작 시 1번부터** — 모든 원이 phase offset만큼 시작 시점이 어긋나서 영원히 같은 wave 패턴 반복.
- **메모리 안전** — `cancelAnimation` cleanup으로 unmount 시 정리.

## 디렉터리

```
Spinner/
├─ Spinner.tsx          # 뷰 (3개 Animated.View 원 + row 컨테이너)
├─ Spinner.styles.ts    # SPINNER_COLORS / SPINNER_JUMP_HEIGHT / SPINNER_TOTAL_WIDTH + getRowStyle/getCircleStyle
├─ Spinner.types.ts     # SpinnerProps / SpinnerColor / SpinnerSize
├─ Spinner.animation.ts # useSpinnerAnimation (damped sine worklet)
└─ index.ts             # public export: Spinner, SPINNER_TOTAL_WIDTH, type 3개
```

## 의존성

- `react-native-reanimated` — 워클렛 애니메이션. 자체 deps 없음.
