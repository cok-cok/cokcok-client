# Icon

`lucide-react-native` 기반 아이콘 wrapper. 사용 가능한 아이콘은 레지스트리(`Icon.icons.ts`)에 미리 등록된 것만 — 이름으로 호출.

## Import

```ts
import { Icon, IconSizeContext } from '@/components/Icon';
import type { IconName, IconProps } from '@/components/Icon';
// 상대 경로: '../../components/Icon'
```

## Props (Public API)

```ts
type IconProps = {
  name: IconName; // 레지스트리 키 (TypeScript 자동완성됨)
  size?: number; // px. 미지정 시 IconSizeContext → 20 fallback
  color?: string; // lucide stroke color
  strokeWidth?: number; // lucide default 2
  accessibilityLabel?: string; // 의미 있는 아이콘이면 줘야 함
  accessibilityRole?: AccessibilityRole; // 명시 override (자동 분기 안 따를 때)
  testID?: string;
};
```

## 등록된 아이콘 (17개)

| 키 (camelCase)  | lucide 컴포넌트 (PascalCase) |
| --------------- | ---------------------------- |
| `alertCircle`   | `AlertCircle`                |
| `alertTriangle` | `AlertTriangle`              |
| `check`         | `Check`                      |
| `chevronLeft`   | `ChevronLeft`                |
| `chevronRight`  | `ChevronRight`               |
| `clock`         | `Clock`                      |
| `eye`           | `Eye`                        |
| `eyeOff`        | `EyeOff`                     |
| `image`         | `Image`                      |
| `info`          | `Info`                       |
| `plus`          | `Plus`                       |
| `search`        | `Search`                     |
| `settings`      | `Settings`                   |
| `trash`         | `Trash`                      |
| `user`          | `User`                       |
| `x`             | `X`                          |
| `xCircle`       | `XCircle`                    |

### 새 아이콘 추가하는 법

1. `Icon.icons.ts` 상단 lucide import에 PascalCase 추가
2. `ICONS` 맵에 camelCase 키 = 컴포넌트 매핑 추가
3. `IconName` 타입이 자동으로 union 확장됨 (`keyof typeof ICONS`)

```ts
// 예: 'heart' 추가
import { Heart /* ... */ } from 'lucide-react-native';
export const ICONS = {
  heart: Heart,
  // ...
};
```

## Size Resolution

```
prop.size > IconSizeContext.value > 20 (fallback)
```

`IconSizeContext`는 `createContext<number | undefined>(undefined)`. 별도 파일(`Icon.context.ts`)에 분리 — Button → Icon barrel import 시 순환 의존 회피용.

`Button` / `Input`은 자체적으로 `IconSizeContext.Provider`로 size 주입:

- Button: 16 (sm) / 18 (md) / 20 (lg)
- Input: 16 / 18 / 20 (size별 동일 매핑)

호출자가 `<Icon name="x" />` 만 써도 부모 컨텍스트에 맞게 자동 조정.

## A11y 자동 분기

`accessibilityLabel` 유무로 "장식 vs 의미" 자동 판단:

| 시나리오                              | 적용                                                                                                                   |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `accessibilityLabel` 없음 (장식용)    | `role='none'`, `accessibilityElementsHidden`, `importantForAccessibility='no-hide-descendants'` → 스크린리더 완전 무시 |
| `accessibilityLabel` 있음 (의미 있음) | `role='image'` 자동 (override 가능), 라벨 읽힘                                                                         |
| `accessibilityRole` 명시              | role 강제 적용 (e.g., `'button'` 으로)                                                                                 |

## 렌더 구조

```tsx
<View
  accessibilityLabel={accessibilityLabel}
  accessibilityRole={accessibilityRole ?? (isDecorative ? 'none' : 'image')}
  accessibilityElementsHidden={isDecorative}
  importantForAccessibility={isDecorative ? 'no-hide-descendants' : 'auto'}
  testID={testID}
>
  <LucideComponent size={finalSize} color={color} strokeWidth={strokeWidth} />
</View>
```

a11y는 wrapper View에. lucide 컴포넌트(SVG)에 직접 안 줌 — SVG의 a11y prop 호환이 일부만이라 안전한 wrap.

## 사용 패턴

```tsx
// 장식용 — 스크린리더 무시됨
<Icon name="search" />

// 의미 있는 아이콘 — 스크린리더에 "에러" 안내
<Icon name="alertCircle" color="#DC2626" accessibilityLabel="에러" />

// Button 안에서 — size는 부모에서 주입됨
<Button iconLeft={<Icon name="plus" color="white" />} label="추가" onPress={add} />

// 명시적 role override (의미상 버튼인 아이콘)
<Icon
  name="trash"
  color="#DC2626"
  accessibilityLabel="삭제"
  accessibilityRole="button"
  testID="icon-delete"
/>

// 큰 사이즈 + 색
<Icon name="check" size={48} color="#16A34A" />

// strokeWidth 변경 (얇게/굵게)
<Icon name="settings" strokeWidth={1} />
<Icon name="settings" strokeWidth={3} />
```

## 알아둘 점 / 함정

- **장식 vs 의미는 `accessibilityLabel` 유무로만 판단** — label 없는 게 곧 "장식" 신호. 모든 아이콘에 label 다 박지 말 것 (스크린리더 노이즈).
- **`color`는 stroke 색** (lucide는 stroke 기반). 채워진 색 아님. 필요 시 lucide 컴포넌트의 `fill` prop을 노출시켜야 하는데 현재 안 노출됨.
- **레지스트리에 없는 이름 호출 불가** — `name` 타입이 `keyof typeof ICONS`라 TS 에러로 차단. 새 이름 쓰려면 먼저 등록.
- **`IconSizeContext`는 별도 파일** — 외부에서 직접 import 가능. Button/Input/Toast가 자식 Icon에 사이즈 주입할 때 사용.
- **lucide-react-native는 `react-native-svg` peer dep 필요** — 이미 설치돼 있음. SVG 렌더 비용은 있지만 토스트/버튼 한두 개 수준은 무시 가능.
- **size를 명시하면 컨텍스트 무시** — 명시값이 항상 우선.

## 디렉터리

```
Icon/
├─ Icon.tsx          # 뷰 + a11y 자동 분기
├─ Icon.icons.ts     # lucide import + ICONS 맵 (레지스트리)
├─ Icon.context.ts   # IconSizeContext (createContext<number | undefined>)
├─ Icon.types.ts     # IconProps / IconName (=keyof typeof ICONS)
└─ index.ts          # public export: Icon, IconSizeContext, type IconName/IconProps
```

## 의존성

- `lucide-react-native` — 아이콘 컴포넌트
- `react-native-svg` — peer dep of lucide
