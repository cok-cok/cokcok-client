# VirtualGrid

`@shopify/flash-list`(v2+) 기반 2열 그리드 가상화 컴포넌트. 긴 리스트(수백~수만 아이템)에서 viewport + 버퍼만 마운트해 메모리/성능 안정.

`Grid` 컴포넌트는 작은 N(< 50개)의 정적 리스트용 layout primitive. 동적·페이지네이션·긴 리스트는 `VirtualGrid`로.

## Import

```ts
import { VirtualGrid } from '@/components/VirtualGrid';
import type {
  VirtualGridProps,
  FlashListRef,
  ListRenderItem,
  ListRenderItemInfo,
} from '@/components/VirtualGrid';
// 상대 경로: '../../components/VirtualGrid'
```

`FlashListRef`/`ListRenderItem`/`ListRenderItemInfo`는 자주 쓰여 한 import에서 같이 끌어쓰도록 재노출.

## Props (Public API)

```ts
type VirtualGridProps<T> = Omit<FlashListProps<T>, 'numColumns'> & {
  columns?: 1 | 2;                  // default 2
  flashListRef?: Ref<FlashListRef<T>>;
};
```

- `FlashListProps`를 그대로 펴서 받는 wrapper — `data`, `renderItem`, `keyExtractor`, `onEndReached`, `onEndReachedThreshold`, `ListEmptyComponent`, `ListFooterComponent`, `ListHeaderComponent`, `onScroll`, `scrollEventThrottle`, `contentContainerStyle` 등 모두 사용 가능.
- `numColumns` 대신 `columns: 1 | 2`로 좁힘 — `Grid` 컴포넌트와 동일한 시그니처. 디자인상 3열 이상은 차단.
- `masonry?: boolean`: FlashList v2부터 단일 prop으로 staggered 2열 가상화 지원. 카드 높이가 다양할 때 사용.
- `flashListRef`: scroll-to-top / scroll-to-index 등 외부 제어 필요 시 ref 노출.

## 사용 패턴

```tsx
// 2열 균등 (모든 카드 height 비슷)
<VirtualGrid
  data={recipes}
  columns={2}
  renderItem={({ item }) => <RecipeCard {...item} layout="vertical" />}
  keyExtractor={(item) => String(item.id)}
/>

// 2열 masonry (카드 높이 다양)
<VirtualGrid
  data={recipes}
  columns={2}
  masonry
  renderItem={({ item }) => <RecipeCard {...item} layout="vertical" />}
  keyExtractor={(item) => String(item.id)}
/>

// 1열 list + onEndReached (인피니티 스크롤 연동)
const { data, isLoadingMore, endReachedKey, loadMore } = useInfiniteScroll({ fetcher });

<VirtualGrid
  data={data}
  columns={1}
  renderItem={({ item }) => <RecipeCard {...item} layout="horizontal" />}
  keyExtractor={(item) => String(item.id)}
  onEndReached={loadMore}
  onEndReachedThreshold={0.8}
  ListFooterComponent={
    <InfiniteScrollFooter isLoadingMore={isLoadingMore} endReachedKey={endReachedKey} />
  }
/>

// ref로 scroll-to-top
const listRef = useRef<FlashListRef<Recipe>>(null);
<VirtualGrid
  flashListRef={listRef}
  data={recipes}
  renderItem={...}
/>
// 어딘가에서
listRef.current?.scrollToOffset({ offset: 0, animated: true });
```

## 알아둘 점 / 함정

- **VirtualGrid는 자체 scroll container**. `ScrollView` 안에 넣지 말 것 — 가상화가 깨지고 RN warning 발생.
- **renderItem 시그니처는 FlashList의 `ListRenderItem`** (`{ item, index, target, extraData }`), `Grid`의 시그니처(`(item, index)`)와 다름. 마이그레이션 시 주의.
- **카드 간 gap은 contentContainerStyle padding + renderItem 내부 padding 조합**으로 처리. `Grid`처럼 `gap` prop 직접 없음.
- **masonry 모드의 컬럼 균형은 greedy(짧은 컬럼에 다음 아이템 배치)**. 마지막 페이지에서 한쪽 컬럼이 더 길어질 수 있음 — pixel-perfect masonry는 fundamentally 가상화와 양립 불가.
- **onEndReachedThreshold는 0~1 비율** (viewport 비율). FlatList의 동일 prop 의미와 같음.
- **`flashListRef` ref API는 FlashList의 메서드 그대로** (`scrollToOffset`, `scrollToIndex`, `scrollToEnd`, `recordInteraction` 등).
- **v2부터 `estimatedItemSize` prop 불필요** — 내부 자동 추정. v1과 다름.
- **카드 컴포넌트가 무겁다면 `memo`로 감싸기** — 가상화로 재마운트가 잦을 수 있으니 동등 비교 cost 절감 권장.

## Grid vs VirtualGrid 언제 뭘 쓸까

| 상황 | 선택 |
|---|---|
| 정적 리스트(< 50개), 마이페이지 메뉴 같은 고정 항목 | `Grid` |
| 페이지네이션/인피니티 스크롤, 길어질 수 있는 리스트 | `VirtualGrid` |
| 1열 단순 list | `VirtualGrid` (FlatList 대체) |
| 2열 masonry(높이 다양) | `VirtualGrid` masonry |
| ScrollView 내부의 작은 그리드 (예: 카드 안 아이콘 grid) | `Grid` |

## 디렉터리

```
VirtualGrid/
├─ VirtualGrid.tsx       # FlashList wrapper
├─ VirtualGrid.types.ts  # VirtualGridProps
└─ index.ts              # public export + FlashList 타입 재노출
```

## 의존성

- `@shopify/flash-list` (v2+) — 가상화 엔진. v2부터 masonry / numColumns가 단일 컴포넌트 prop으로 통합 + `estimatedItemSize` 자동 추정.
