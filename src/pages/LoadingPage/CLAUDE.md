# LoadingPage

앱 부팅 시 네이티브 스플래시 이후 표시되는 JS 레벨 로딩 페이지. 자체 시각 게이트와 외부 로직 게이트가 모두 만족돼야 종료.

## 부팅 시퀀스 안에서의 위치

```
앱 진입
  ├─ 네이티브 스플래시 (#FBFAF9 — 단색만; expo-splash-screen)
  │   └─ JS 부팅 + Phase1 prefetch (login-bg / C / O / K) 백그라운드 진행
  ├─ Phase1 끝 → SplashScreen.hideAsync (fade) → splashHidden=true
  │   └─ LoadingPage 노출 시작 (이미 RootNavigator 위에 absoluteFill로 mount된 상태)
  ├─ LoadingPage 자체 시퀀스 (아래)
  └─ exit fade → RootNavigator 노출

LoadingPage 시퀀스 (bgReady = splashHidden ∧ bgImageLoaded 시점부터):
  1) bg image fade-in (BG_FADE_DURATION_MS = 380ms)
  2) PRE_OVERLAY_DELAY_MS (500ms) 고정 대기
  3) 흰 50% 오버레이 + COKCOK 6글자 fade-in (OVERLAY_FADE_DURATION_MS = 380ms)
  4) PRE_JUMP_DELAY_MS (500ms) 고정 대기
  5) 6글자 staggered 점프 시작 (C→O→K→C→O→K, damped sine)
  6) 마지막 글자 BOUNCE 완료마다 cycleCount++
  7) cycleCount ≥ 1 ∧ bootstrapReady === true → exiting=true
  8) EXIT_FADE_DURATION_MS(=380ms) 후 onExitComplete() 호출

JUMP_START_DELAY_MS = BG_FADE + PRE_OVERLAY + OVERLAY_FADE + PRE_JUMP = 1760ms (bgReady → 첫 글자 점프).
```

## Props

```ts
type Props = {
  splashHidden: boolean;          // 네이티브 스플래시 dismiss 완료 (App 레벨이 신호)
  bootstrapReady: boolean;        // App 레벨 로직 게이트 (Phase2 완료)
  onExitComplete: () => void;     // exit 페이드 완료 후 호출 — 부모가 unmount
};
```

`splashHidden`은 시각 페이드 시작 조건. 스플래시가 화면에 떠있는 동안 fade-in 해버리면 사용자가 못 보고 fully visible 상태로 splash dismiss → 페이드인이 의미 없어짐.

## 두 게이트

| 게이트 | 충족 조건 | 책임 |
|---|---|---|
| **시각** | 점프 1사이클 이상 완료 (`cycleCount >= 1`) | LoadingPage 내부 |
| **로직** | `bootstrapReady === true` | 호출자(App) — 토큰 검증·초기 데이터 등 추가될 자리 |

둘 다 충족돼야 exit. 시각 게이트 먼저 끝나고 로직이 늦으면 점프가 계속 반복하며 대기. 반대로 로직이 빨라도 1사이클은 보장.

## 배경 — 로그인 페이지와 동일 스펙 + 추가 대기

`login-bg.png` (2559×5532) 를 화면 가로폭 기준으로 `cover`. 흰 오버레이 50% opacity. 로그인 페이지와의 차이:
- bg image **fade-in** (LoginPage는 ready 트리거 후 entrance 페이드, LoadingPage도 동일하지만 짧은 단계 분리)
- bg fade 완료 후 **0.5s 고정 대기** (`PRE_OVERLAY_DELAY_MS`) 후 오버레이/글자 등장
- 글자 fade-in 완료 후 **0.5s 고정 대기** (`PRE_JUMP_DELAY_MS`) 후 점프 시작

이 두 고정 대기가 LoadingPage의 정체성 — 단축하지 말 것.

## 색 연속성 — `PAGE_BG_COLOR`

`root` 의 backgroundColor = `#FBFAF9` (네이티브 스플래시 backgroundColor와 동일). 스플래시가 fade out 되며 그 아래에 깔린 LoadingPage가 드러나는 순간 동일 색이라 깜빡임 없음.

## 글자 사이즈 / 정렬

각 글자 가로폭은 디자인 원본 기준 비율 **C : O : K = 197 : 229 : 192**. `LETTER_SCALE` (default 0.27)로 전체 일괄 조정. 높이는 각 글자의 원본 비율에서 자동 산출.

```
LETTER_C_WIDTH = round(197 * 0.27) = 53
LETTER_O_WIDTH = round(229 * 0.27) = 62
LETTER_K_WIDTH = round(192 * 0.27) = 52

LETTER_C_HEIGHT ≈ 53 / 0.876 = 60.5
LETTER_O_HEIGHT ≈ 62 / 1.022 = 60.7
LETTER_K_HEIGHT ≈ 52 / 0.627 = 82.9
```

K가 lowercase 'k'라 ascender 때문에 더 큼. 행은 `alignItems: 'flex-end'` (아래단 정렬) — C/O는 baseline에 맞고 K만 위로 솟음.

원본 디자인 크기(LETTER_SCALE=1) 사용 시 행 폭이 ~1236px라 phone 화면에 맞지 않음 — 적절히 LETTER_SCALE 조정.

## 점프 애니메이션

`CokcokLetters` 내부 `Letter` 컴포넌트가 글자당 독립적인 `useSharedValue` + `useAnimatedStyle`. Spinner와 동일한 damped sine:

```
y(p) = JUMP_HEIGHT · AMPLITUDE_SCALE · sin(2π · 1.5 · p) · exp(-1.5 · p)
```

| 상수 | 값 | 의미 |
|---|---|---|
| `LETTER_BOUNCE_DURATION_MS` | 600 | 글자당 BOUNCE 진행 시간 |
| `LETTER_STAGGER_MS` | 130 | 글자 사이 시작 텀 |
| `LETTER_PAUSE_AFTER_ALL_MS` | 320 | 마지막 글자 끝 → 첫 글자 재시작까지 |
| `LETTER_CYCLE_MS` | 1570 (= 600 + 130·5 + 320) | 한 사이클 총 길이 |
| `LETTER_JUMP_HEIGHT` | −16 | 점프 픽셀 (음수 = 위) |
| `JUMP_START_DELAY_MS` | 1760 | bgReady → 첫 글자 점프 시작까지의 누적 지연 |

`onCycleEnd` 콜백은 **마지막 글자(index=5, K)의 BOUNCE가 완료될 때마다** 발화 → 모든 글자가 한 번씩 뛴 시점.

## 종료 페이드

`exiting === true`되면 `rootExitStyle` opacity 1→0 (`EXIT_FADE_DURATION_MS = 380ms`). 점프는 자연 종료 (root 사라지며 보이지 않음). 페이드 끝나면 `onExitComplete`.

## 호출 패턴 — `App.tsx`

`LoadingPage`는 RootNavigator 위에 sibling으로 렌더 (absoluteFill). 부모(`useBootstrap`)가 `showLoading` state로 mount/unmount + `splashHidden` / `bootstrapReady` 신호.

```tsx
<RootNavigator />
{showLoading && (
  <LoadingPage
    splashHidden={splashHidden}
    bootstrapReady={bootstrapReady}
    onExitComplete={() => setShowLoading(false)}
  />
)}
```

## Reload — `BootstrapContext`

`MyRecipeList` 등에서 `useReload()` 호출 시 `useBootstrap`이 `trigger` 증가시켜 부트스트랩을 다시 돌리고 LoadingPage 다시 표시. 네이티브 스플래시는 한 번만 보이고 이후 reload엔 `splashHidden=true` 그대로라 LoadingPage가 즉시 시퀀스 진입.

## 알아둘 점 / 함정

- **PRE_OVERLAY_DELAY_MS + PRE_JUMP_DELAY_MS는 의도된 고정 시간** — LoadingPage가 LoginPage와 시각적으로 구분되는 정체성. 단축하지 말 것.
- **splashHidden 게이트 필수** — fade-in을 splash dismiss 전에 시작하면 사용자가 못 봄.
- **bootstrapReady는 외부 책임** — 미래에 토큰 검증·초기 데이터 등이 추가될 자리. 이 값이 늦어지면 LoadingPage가 자동으로 점프 반복하며 대기.
- **`cycleCount >= 1`** — "1사이클 완료" 정의는 마지막 글자가 한 번 뛴 시점.
- **로컬 onCycleEnd 콜백은 매 사이클마다 발화** — withRepeat 안의 withTiming 콜백이 매 iteration 호출됨. 처음 1회만 효과 있고 이후 중복 setState로 cycleCount는 무한 증가하지만 조건은 ≥1만 검사하므로 무해.
- **`PAGE_BG_COLOR` ↔ `app.json` 의 `expo-splash-screen.backgroundColor`** — 둘이 같아야 색 연속성 보장.
- **LETTER_SCALE 변경 시** — 폭만 비례 변경. 점프 높이/간격은 별개 상수 (시각적 균형 위해 별도 조정 가능).
- **`alignItems: 'flex-end'` 필수** — K가 다른 글자보다 길쭉해서 baseline 정렬 안 하면 비대칭.

## 디렉터리

```
LoadingPage/
├─ LoadingPage.tsx          # 오케스트레이션 (게이트 결합, exit 트리거)
├─ LoadingPage.constants.ts # 상수 (timing / 색 / 사이즈)
├─ LoadingPage.styles.ts    # StyleSheet
├─ LoadingPage.animation.ts # useLoadingAnimation (bg / overlay / letters / exit fade)
├─ CokcokLetters.tsx        # 6글자 컨테이너 + 글자별 Letter 컴포넌트
├─ CLAUDE.md
└─ index.ts                 # public export: LoadingPage
```

## 의존성

- `expo-splash-screen` — 네이티브 스플래시 hide 제어 (App 레벨)
- `expo-asset` — 이미지 prefetch (App 레벨)
- `react-native-reanimated` — fade + 점프 worklet
- `assets/login-bg.png`, `cokcok-letter-c/o/k.png`
