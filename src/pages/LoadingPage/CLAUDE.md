# LoadingPage

앱 부팅 시 네이티브 스플래시 이후 표시되는 JS 레벨 로딩 페이지. 자체 시각 게이트와 외부 로직 게이트가 모두 만족돼야 종료.

## 부팅 시퀀스 안에서의 위치

```
앱 진입
  ├─ 네이티브 스플래시 (icon.png + #FF490D, expo-splash-screen)
  │   └─ JS 부팅 + Phase1 prefetch (login-bg / C / O / K) 백그라운드 진행
  ├─ Phase1 끝 → SplashScreen.hideAsync (fade)
  │   └─ LoadingPage 노출 시작 (이미 RootNavigator 위에 absoluteFill로 mount된 상태)
  ├─ LoadingPage 자체 시퀀스 (아래 7-step)
  └─ exit fade → RootNavigator 노출

LoadingPage 7-step:
  1) login-bg.png onLoad → start=true
  2) PRE_OVERLAY_DELAY_MS(=500ms) 고정 대기
  3) 흰 오버레이 + COKCOK 글자 fade-in (동시)
  4) 6글자 staggered 점프 시작 (C→O→K→C→O→K)
  5) 마지막 글자 BOUNCE 완료마다 cycleCount++
  6) cycleCount ≥ 1 ∧ bootstrapReady === true → exiting=true
  7) EXIT_FADE_DURATION_MS(=380ms) 후 onExitComplete() 호출 → 부모가 unmount
```

## Props

```ts
type Props = {
  bootstrapReady: boolean;        // App 레벨 로직 게이트 (Phase2 완료)
  onExitComplete: () => void;     // exit 페이드 완료 후 호출 — 부모가 LoadingPage unmount
};
```

## 두 게이트

| 게이트 | 충족 조건 | 책임 |
|---|---|---|
| **시각** | 점프 1사이클 이상 완료 (`cycleCount >= 1`) | LoadingPage 내부 |
| **로직** | `bootstrapReady === true` | 호출자(App) — 토큰 검증·초기 데이터 등이 추가될 자리 |

둘 다 충족돼야 exit 시작. 시각 게이트 먼저 끝나고 로직이 늦으면 점프가 계속 반복되며 대기. 반대로 로직이 빨라도 1사이클은 보장.

## 배경 — 로그인 페이지와 동일 스펙

`login-bg.png` (2559×5532) 를 화면 가로폭 기준으로 `cover`. 흰 오버레이 50% opacity. 차이점은 LoadingPage엔 **PRE_OVERLAY_DELAY_MS(0.5s) 고정 대기**가 추가돼 배경이 단독으로 잠깐 보인다는 점.

## 색 연속성 — `SPLASH_BG_COLOR`

`root` 의 backgroundColor = `#FF490D` (네이티브 스플래시 backgroundColor와 동일). 스플래시가 fade out 되며 그 아래에 깔린 LoadingPage가 드러나는 순간 동일 색이라 깜빡임 없음. 직후 login-bg 이미지가 그 위에 보임.

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

`onCycleEnd` 콜백은 **마지막 글자(index=5, K)의 BOUNCE가 완료될 때마다** 발화 → 모든 글자가 한 번씩 뛴 시점.

## 사이즈 / 레이아웃

- 글자: `height: 44px` (= `LETTER_HEIGHT`). 가로폭은 원본 비율 (`width = height * ratio`).
- 행 내 글자 간 `marginHorizontal: 2` (= `LETTER_GAP / 2`) 양쪽.
- 행 자체는 `alignItems: 'flex-end'` — K가 길쭉(576×918)해서 baseline 정렬.
- 화면 정가운데 (`lettersWrap` `justifyContent/alignItems: center`).

## 종료 페이드

`exiting === true`되면 `rootExitStyle` opacity 1→0 (`EXIT_FADE_DURATION_MS = 380ms`). 점프는 `cancelAnimation` 없이 자연 종료 (root가 사라지면 보이지 않음). 페이드 끝나면 `onExitComplete` 호출.

## 호출 패턴 — `App.tsx`

`LoadingPage`는 RootNavigator 위에 sibling으로 렌더 (absoluteFill). 부모(`useBootstrap`)가 `showLoading` state로 mount/unmount 제어.

```tsx
<RootNavigator />
{showLoading && (
  <LoadingPage
    bootstrapReady={bootstrapReady}
    onExitComplete={() => setShowLoading(false)}
  />
)}
```

## Reload — `BootstrapContext`

`MyRecipeList` 등 페이지에서 `useReload()` 호출 시 `useBootstrap`이 `trigger` 증가시켜 부트스트랩을 다시 돌리고 LoadingPage 다시 표시. 네이티브 스플래시는 한 번만 보이고 이후 reload엔 LoadingPage만 다시 나타남.

## 알아둘 점 / 함정

- **PRE_OVERLAY_DELAY_MS는 의도된 고정 시간** — 로딩 페이지가 LoginPage와 시각적으로 구분되는 정체성. 단축하지 말 것.
- **bootstrapReady는 외부 책임** — 미래에 토큰 검증·초기 데이터 등이 추가될 자리. 이 값이 늦어지면 LoadingPage가 자동으로 점프 반복하며 대기.
- **`cycleCount >= 1`** — "1사이클 완료" 정의는 마지막 글자가 한 번 뛴 시점. 모든 글자가 다 뛰었다고 해석 가능.
- **로컬 onCycleEnd 콜백은 매 사이클마다 발화** — withRepeat 안의 withTiming 콜백이 매 iteration 호출됨. 처음 1회만 효과 있고 이후는 중복 setState로 cycleCount는 무한 증가하지만 UI 영향 없음 (조건은 ≥1만 검사).
- **`SPLASH_BG_COLOR` ↔ `app.json` 의 `expo-splash-screen.backgroundColor`** — 둘이 같아야 색 연속성 보장. 한쪽 바꾸면 다른쪽도.
- **글자 압축 비율 변경 시** — `LETTER_*_RATIO` 상수도 새 이미지의 W/H로 업데이트.
- **점프 timing은 디자이너 감각으로 조정 자유** — `LETTER_BOUNCE_DURATION_MS` / `STAGGER` / `JUMP_HEIGHT` / `HEIGHT` 모두 `LoadingPage.constants.ts`에서 일괄 조정.

## 디렉터리

```
LoadingPage/
├─ LoadingPage.tsx          # 오케스트레이션 (시각/로직 게이트 결합, exit 트리거)
├─ LoadingPage.constants.ts # 상수 (timing / 색 / 사이즈)
├─ LoadingPage.styles.ts    # StyleSheet
├─ LoadingPage.animation.ts # useLoadingAnimation (overlay/letters/exit fade)
├─ CokcokLetters.tsx        # 6글자 컨테이너 + 글자별 Letter 컴포넌트 (개별 점프 worklet)
├─ CLAUDE.md
└─ index.ts                 # public export: LoadingPage
```

## 의존성

- `expo-splash-screen` — 네이티브 스플래시 hide 제어 (App 레벨에서 호출, LoadingPage 자체는 import 안 함)
- `expo-asset` — 이미지 prefetch (App 레벨)
- `react-native-reanimated` — fade + 점프 worklet
- `assets/login-bg.png`, `cokcok-letter-c/o/k.png`, `icon.png`
