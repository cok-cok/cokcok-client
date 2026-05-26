# PhoneFrameBackground

휴대폰 portrait UI를 큰 화면(폴드 펼침, 태블릿)에서도 유지하기 위한 프레임. 같은 bg 이미지를 두 번 깔되:

- **외곽**: 화면 전체 cover + 강한 블러로 letterbox 영역 채움
- **내부**: `PHONE_MAX_WIDTH` 캡으로 가운데 정렬된 휴대폰 폭 컬럼. 안에 선명한 bg + 자식 컨텐츠.

음악·동영상 앱이 widescreen 콘텐츠를 portrait 화면에 letterbox 대신 자기 콘텐츠 블러로 채우는 그 패턴.

## Import

```ts
import { PhoneFrameBackground } from '@/components/PhoneFrameBackground';
import { PHONE_MAX_WIDTH, PHONE_BLUR_RADIUS } from '@/components/PhoneFrameBackground';
// 상대 경로: '../../components/PhoneFrameBackground'
```

## Props

```ts
type Props = {
  source: number;                          // require()로 가져온 로컬 이미지
  bgEntranceStyle?: StyleProp<ViewStyle>;  // 외곽 블러 + 내부 cover 양쪽에 동시 적용되는 fade
  onBgLoad?: () => void;                    // 내부 portrait 이미지 onLoad — 부트스트랩 게이트
  children?: ReactNode;                     // 내부 컬럼 안에 렌더 (오버레이/폼/글자 등)
};
```

## 레이어 구조

```
┌────────────────────────────────────────────────┐
│ root  (flex: 1)                                │
│ ┌────────────────────────────────────────────┐ │
│ │ Animated.View outerWrap (absoluteFill)     │ │
│ │   ↳ Animated.Image  bg + blurRadius=30     │ │
│ │     width=screenWidth, height=screenHeight │ │
│ │     resizeMode=cover, pointerEvents=none   │ │
│ └────────────────────────────────────────────┘ │
│ ┌────────────────────────────────────────────┐ │
│ │ View columnWrap (absoluteFill, center)     │ │
│ │   ┌─────────────────────────────────────┐  │ │
│ │   │ column (width=min(screenW, 480))    │  │ │
│ │   │  ┌──────────────────────────────┐   │  │ │
│ │   │  │ Animated.View innerBgWrap    │   │  │ │
│ │   │  │   ↳ Animated.Image  bg cover │   │  │ │
│ │   │  │     width=colW, height=screenH│  │ │ │
│ │   │  └──────────────────────────────┘   │  │ │
│ │   │  ↳ children (절대 위에)             │  │ │
│ │   └─────────────────────────────────────┘  │ │
│ └────────────────────────────────────────────┘ │
└────────────────────────────────────────────────┘
```

`bgEntranceStyle`는 외곽 wrapper와 내부 wrapper **둘 다**에 적용 → 단일 progress shared value로 두 레이어가 동시에 fade-in. `Animated.View`를 거쳐 적용하는 이유: `Animated.Image`의 style 타입이 `MaybeSharedValue` 기반이라 `StyleProp<ViewStyle>` 직접 통과 시 타입 에러.

## 상수 (`PhoneFrameBackground.constants.ts`)

| 상수 | 값 | 의미 |
|---|---|---|
| `PHONE_MAX_WIDTH` | 480 | 내부 컬럼 가로 폭 캡. 화면이 이보다 좁으면 그대로(screen). 휴대폰엔 외곽 letterbox 안 보임. |
| `PHONE_BLUR_RADIUS` | 30 | 외곽 블러 강도 (RN `Image.blurRadius` 0~100). 강해야 디테일 사라지고 컬러 무드만 깔림. |

폴드 펼침(1768w)에선 컬럼 480, 양 옆 644씩 외곽 블러. 휴대폰(393w)에선 컬럼=393, 외곽 안 보임.

## 사용 패턴

```tsx
const BG = require('./bg.png');

<PhoneFrameBackground source={BG} bgEntranceStyle={bgStyle} onBgLoad={handleLoad}>
  <Animated.View style={[styles.whiteOverlay, overlayStyle]} pointerEvents="none" />
  <ScrollView>...</ScrollView>
</PhoneFrameBackground>
```

자식 컴포넌트는 컬럼 영역 안에서만 렌더 — `whiteOverlay`의 `absoluteFillObject`도 컬럼 폭만 덮음. 컬럼 밖(외곽 블러)은 안 가려짐. 의도된 동작.

## 사이즈 결정

- `useWindowDimensions()` 로 매 렌더마다 현 화면 dimensions 가져옴 → 회전/접힘 변경 즉시 반영.
- `columnWidth = min(screenWidth, PHONE_MAX_WIDTH)`. 480 캡.
- 외곽 블러 이미지: `width=screenWidth, height=screenHeight`. 명시 픽셀로 Android 호환.
- 내부 이미지: `width=columnWidth, height=screenHeight`. 컬럼 폭에 맞추고 세로는 화면 가득 → `resizeMode=cover`가 알아서 cropping.

## a11y / pointerEvents

- 외곽 wrapper: `pointerEvents="none"` (장식, 터치 안 받음)
- columnWrap: `pointerEvents="box-none"` (자기는 안 받지만 자식엔 전달)
- innerBgWrap: `pointerEvents="none"` (장식)
- 자식: 기본 처리

## 알아둘 점 / 함정

- **`bgEntranceStyle`는 `Animated.View`에 적용** — `Animated.Image`에 직접 넘기면 reanimated style 타입 충돌. Image는 dimensions만.
- **외곽/내부 이미지 동일 source** — Metro가 한 번만 디코드하고 캐시 공유. 외곽 블러가 추가 메모리 거의 안 씀.
- **외곽 onLoad는 무시** — 내부 이미지 onLoad 하나로 충분 (같은 source, 같은 캐시 hit).
- **컬럼 폭 변경 시 dimension 자동 갱신** — `useWindowDimensions()` 사용. AVD 접힘/펼침 시 즉시 반영.
- **`PHONE_MAX_WIDTH = 480` 변경 시 모든 페이지에 영향** — 두 페이지가 공유 사용. 페이지별 다른 폭 원하면 prop으로 expose.

## 디렉터리

```
PhoneFrameBackground/
├─ PhoneFrameBackground.tsx     # 뷰
├─ PhoneFrameBackground.constants.ts  # PHONE_MAX_WIDTH / PHONE_BLUR_RADIUS
├─ CLAUDE.md
└─ index.ts                     # public export
```

## 의존성

- `react-native-reanimated` — fade 스타일 합성
- 호출자가 제공하는 bg 이미지 (예: `assets/login-bg.png`)
