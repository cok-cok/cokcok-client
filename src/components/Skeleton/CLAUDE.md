# Skeleton

로딩 placeholder primitive. shimmer 톤·속도가 전역 고정된 단일 block. 사용처에서 width/height/borderRadius로 형태만 결정.

큰 컴포넌트는 dedicated wrapper(예: `RecipeCardSkeleton`)로 조립하고, 자유로운 형태가 필요한 페이지에선 `<Skeleton>`을 직접 배치.

## Import

```ts
import { Skeleton } from '@/components/Skeleton';
import type { SkeletonProps } from '@/components/Skeleton';
// 상대 경로: '../../components/Skeleton'
```

## Props

```ts
type SkeletonProps = {
  width?: DimensionValue;        // 숫자(px) | '50%' | 'auto' 등
  height?: DimensionValue;
  borderRadius?: number;         // default 4
  style?: StyleProp<ViewStyle>;
};
```

## 애니메이션

- 단순 opacity pulse — gray-200(`#E5E7EB`) 배경에 `opacity 0.55 ↔ 1.0` 1100ms 무한 반복
- reanimated worklet (`withRepeat` + `withTiming`) — UI thread, JS jank 영향 없음
- 톤/속도는 `Skeleton.styles.ts` 상수로 전역 고정. 사용처가 색·속도 prop을 받지 않음 → 일관성 보장

## 사용 패턴

```tsx
// 단일 block
<Skeleton width={120} height={120} borderRadius={8} />

// 텍스트 라인 placeholder
<Skeleton width="80%" height={16} />
<Skeleton width="60%" height={13} />

// 동그란 아바타
<Skeleton width={40} height={40} borderRadius={20} />

// 동의 항목 placeholder (체크박스 + 라벨)
<View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
  <Skeleton width={22} height={22} borderRadius={6} />
  <Skeleton width={170} height={14} />
</View>
```

## `useDelayedSkeleton` 훅과 조합 (권장)

API가 매우 빠르게 응답할 때 스켈레톤이 짧게 깜빡이는 인지적 부담을 막기 위해 두 임계값(`showDelay`, `minVisibleMs`)으로 노출 제어.

```tsx
import { useDelayedSkeleton } from '@/hooks';

const [loading, setLoading] = useState(true);
const showSkeleton = useDelayedSkeleton(loading);
// 기본: showDelay 200ms, minVisibleMs 500ms
// loading이 200ms 안에 끝나면 스켈레톤 미표시, 보였다면 500ms 보장

if (showSkeleton) return <SkeletonView />;
if (loading) return null;  // showDelay 동안 빈 화면(보통 50~200ms)
return <ActualContent />;
```

## 알아둘 점

- **DimensionValue 타입**으로 width/height 받음 — number(px) / `'%'` / `'auto'` 모두 OK. 단 부모의 width가 정해져 있어야 `%` 의미 있음.
- **borderRadius default 4** — 텍스트 라인용 무난한 곡률. 동그란 모양은 명시 (`width/2`).
- **shimmer가 "왼→오 빛 줄기"는 아님** — 단순 opacity pulse. 더 화려한 효과 원하면 별도 `ShimmerSkeleton` 후속 추가 가능 (현재 미구현).
- **memo로 감싸짐** — 부모 리렌더에 의해 잘려 들어가도 cheap. 단 sharedValue/animation은 각 instance 마다 별도. 큰 list에 N개 두면 N개 worklet — `useDerivedValue` 한 곳에서 공유 최적화 여지 있음 (현재 미적용, 50개 이상 동시 노출 시 검토).

## 디렉터리

```
Skeleton/
├─ Skeleton.tsx          # opacity pulse 애니메이션 + width/height/radius
├─ Skeleton.styles.ts    # 톤·속도 상수
├─ Skeleton.types.ts     # SkeletonProps
└─ index.ts              # public export
```

## 의존성

- `react-native-reanimated` — opacity pulse 워클렛
