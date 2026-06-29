import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  ScrollView,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { FlashListRef } from '@shopify/flash-list';
import { Image } from 'expo-image';

import { type Recipe, recipesApi } from '../../api';
import { useRequireAuth } from '../../auth';
import {
  BOTTOM_BAR_BOTTOM_OFFSET,
  BOTTOM_BAR_FAB_SIZE,
} from '../../components/BottomBar/BottomBar.constants';
import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { ErrorState } from '../../components/ErrorState';
import { InfiniteScrollFooter } from '../../components/InfiniteScrollFooter';
import { PageHeader } from '../../components/PageHeader';
import {
  RecipeCard,
  RecipeCardSkeleton,
  type RecipeCardSkeletonVariant,
} from '../../components/RecipeCard';
import {
  RECIPE_LIST_TOOLBAR_HEIGHT,
  type RecipeListColumns,
  RecipeListToolbar,
} from '../../components/RecipeListToolbar';
import { VirtualGrid } from '../../components/VirtualGrid';
import { useDelayedSkeleton, useInfiniteScroll } from '../../hooks';
import { useTabBarContext } from '../../navigation/TabBarContext';
import type { RootStackParamList, TabParamList } from '../../navigation/types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'MyRecipeList'>,
  NativeStackScreenProps<RootStackParamList>
>;

const PAGE_BG = '#FAF9F6';
const HEADER_BG = '#FFFFFF';

const SKELETON_COUNT = 8;
const VERTICAL_SKELETON_VARIANTS: RecipeCardSkeletonVariant[] = [
  'image-tall',
  'image-short',
  'no-image',
];

const HIDE_DELTA_THRESHOLD = 2;
const TOP_THRESHOLD = 8;
const HIDE_DURATION_MS = 250;
const RESET_DURATION_MS = 200;
const GRID_GAP = 8;

function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] as T;
}

export default function MyRecipeListPage({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const requireAuth = useRequireAuth();

  const headerOffset = insets.top + PageHeader.HEIGHT;
  const toolbarTop = headerOffset + GRID_GAP;
  const listPaddingTop = toolbarTop + RECIPE_LIST_TOOLBAR_HEIGHT + GRID_GAP;
  const bottomBarOverlayHeight = insets.bottom + BOTTOM_BAR_FAB_SIZE + BOTTOM_BAR_BOTTOM_OFFSET;

  const [columns, setColumns] = useState<RecipeListColumns>(1);

  const fetcher = useCallback(
    async ({ page }: { page: number }) => {
      const res = await recipesApi.getMyRecipes({ page });
      return { items: res.recipes, nextPage: res.nextPage };
    },
    [],
  );

  const {
    data: recipes,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    endReachedKey,
    loadMore,
    reload,
  } = useInfiniteScroll<Recipe>({ fetcher });

  const showSkeleton = useDelayedSkeleton(isLoading && recipes.length === 0);

  useEffect(() => {
    if (!hasMore && recipes.length > 0 && !isLoading) {
      void loadMore();
    }
  }, [hasMore, recipes.length, isLoading, loadMore]);

  const didInitialNudgeRef = useRef(false);
  useEffect(() => {
    if (didInitialNudgeRef.current) return;
    if (recipes.length === 0 || isLoading) return;
    didInitialNudgeRef.current = true;
    setTimeout(() => {
      flashListRef.current?.scrollToOffset({ offset: 0, animated: false });
    }, 80);
  }, [recipes.length, isLoading]);


  const { hideValue, registerScrollToTop } = useTabBarContext();
  const flashListRef = useRef<FlashListRef<Recipe>>(null);
  const lastY = useSharedValue(0);
  const skipDeltaUntilRef = useRef(0);
  const pendingScrollIndexRef = useRef<number | null>(null);
  const hasUserScrolledRef = useRef(false);

  const scrollToTop = useCallback(() => {
    flashListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);

  useFocusEffect(
    useCallback(() => {
      hideValue.value = withTiming(0, { duration: RESET_DURATION_MS });
      lastY.value = 0;
      skipDeltaUntilRef.current = Date.now() + 600;
      registerScrollToTop(scrollToTop);
      return () => {
        registerScrollToTop(null);
      };
    }, [hideValue, lastY, registerScrollToTop, scrollToTop]),
  );

  const measureTopVisibleIndex = useCallback((): number => {
    const ref = flashListRef.current;
    if (!ref) return 0;

    const scrollOffset = ref.getAbsoluteLastScrollOffset();
    // 초기/최상단: layout 측정 부정확 가능 → 첫 카드 고정
    if (scrollOffset <= TOP_THRESHOLD) return 0;

    // ListHeaderComponent는 list 카드 layout과 별개라서 카드 #0.layout.y = 0.
    // 화면 위치 = X.layout.y - scrollOffset + listPaddingTop
    // toolbar bottom = headerOffset + RECIPE_LIST_TOOLBAR_HEIGHT
    // 안 겹치는 첫 카드 조건: X.layout.y >= scrollOffset - GRID_GAP
    const targetY = scrollOffset - GRID_GAP;
    const total = recipes.length;
    if (total === 0) return 0;

    let leftX = Infinity;
    for (let i = 0; i < total; i++) {
      const layout = ref.getLayout(i);
      if (!layout) continue;
      if (layout.x < leftX) leftX = layout.x;
    }
    if (!Number.isFinite(leftX)) return 0;

    let bestIdx = 0;
    let bestY = Infinity;
    for (let i = 0; i < total; i++) {
      const layout = ref.getLayout(i);
      if (!layout) continue;
      if (Math.abs(layout.x - leftX) > 5) continue;
      if (layout.y < targetY) continue;
      if (layout.y < bestY) {
        bestY = layout.y;
        bestIdx = i;
      }
    }
    return bestIdx;
  }, [recipes.length]);

  const handleColumnsChange = useCallback(
    (next: RecipeListColumns) => {
      if (next === columns) return;
      pendingScrollIndexRef.current = hasUserScrolledRef.current
        ? measureTopVisibleIndex()
        : 0;
      setColumns(next);
      hideValue.value = withTiming(0, { duration: RESET_DURATION_MS });
      skipDeltaUntilRef.current = Date.now() + 1500;
    },
    [columns, hideValue, measureTopVisibleIndex],
  );

  useEffect(() => {
    if (pendingScrollIndexRef.current == null) return;
    const targetIndex = pendingScrollIndexRef.current;
    pendingScrollIndexRef.current = null;

    const attempt = (retries: number) => {
      const ref = flashListRef.current;
      if (!ref) return;
      const layout = ref.getLayout(targetIndex);
      if (!layout) {
        if (retries > 0) setTimeout(() => attempt(retries - 1), 60);
        return;
      }
      // 화면 위치 = X.layout.y - scrollOffset + listPaddingTop
      // toolbar 바로 아래 + GRID_GAP = listPaddingTop 위치
      // → scrollOffset = X.layout.y
      const targetOffset = Math.max(0, layout.y);
      ref.scrollToOffset({ offset: targetOffset, animated: false });
    };

    requestAnimationFrame(() => attempt(4));
  }, [columns]);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const currentY = event.nativeEvent.contentOffset.y;
      const contentHeight = event.nativeEvent.contentSize.height;
      const viewportHeight = event.nativeEvent.layoutMeasurement.height;
      const maxScroll = Math.max(0, contentHeight - viewportHeight);
      const atEnd = maxScroll > 0 && currentY >= maxScroll - 1;
      const isOverscroll = currentY < 0 || currentY > maxScroll;
      const ignoreDelta = Date.now() < skipDeltaUntilRef.current;

      if (!ignoreDelta) {
        const delta = currentY - lastY.value;
        if (currentY <= TOP_THRESHOLD) {
          hideValue.value = withTiming(0, { duration: HIDE_DURATION_MS });
        } else if (delta > HIDE_DELTA_THRESHOLD || atEnd) {
          hideValue.value = withTiming(1, { duration: HIDE_DURATION_MS });
        } else if (delta < -HIDE_DELTA_THRESHOLD && currentY < maxScroll - 10) {
          hideValue.value = withTiming(0, { duration: HIDE_DURATION_MS });
        }
      }

      if (atEnd || isOverscroll) {
        void loadMore();
      }

      lastY.value = currentY;
    },
    [hideValue, lastY, loadMore],
  );

  const handleScrollBeginDrag = useCallback(() => {
    hasUserScrolledRef.current = true;
  }, []);

  const handleScrollEndDrag = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const currentY = event.nativeEvent.contentOffset.y;
      const contentHeight = event.nativeEvent.contentSize.height;
      const viewportHeight = event.nativeEvent.layoutMeasurement.height;
      const maxScroll = Math.max(0, contentHeight - viewportHeight);
      if (maxScroll > 0 && currentY >= maxScroll - 1) {
        hideValue.value = withTiming(1, { duration: HIDE_DURATION_MS });
        void loadMore();
      }
    },
    [hideValue, loadMore],
  );

  const toolbarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: hideValue.value * -(RECIPE_LIST_TOOLBAR_HEIGHT + GRID_GAP) }],
  }));

  const skeletonVariants = useMemo(
    () => Array.from({ length: SKELETON_COUNT }, () => pickRandom(VERTICAL_SKELETON_VARIANTS)),
    [],
  );

  const goCreateRecipe = useCallback(
    () => requireAuth(() => navigation.navigate('RecipeForm')),
    [navigation, requireAuth],
  );

  const goDetail = useCallback(
    (_recipe: Recipe) => navigation.navigate('RecipeDetail'),
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: Recipe }) => (
      <View style={{ paddingHorizontal: columns === 2 ? GRID_GAP / 2 : 0 }}>
        <RecipeCard
          title={item.title}
          thumbnailUrl={item.thumbnailUrl || undefined}
          description={item.description}
          tags={item.tags}
          cookTime={item.cookTime}
          portion={item.portion}
          layout={columns === 2 ? 'vertical' : 'horizontal'}
          onPress={() => goDetail(item)}
        />
      </View>
    ),
    [columns, goDetail],
  );

  const renderItemSeparator = useCallback(() => <View style={{ height: GRID_GAP }} />, []);

  const keyExtractor = useCallback((item: Recipe) => String(item.id), []);

  const handleEndReached = useCallback(() => void loadMore(), [loadMore]);

  const handleListLoad = useCallback(() => {
    flashListRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, []);

  const listContentContainerStyle = useMemo(
    () => ({
      paddingTop: 0,
      paddingHorizontal: columns === 2 ? 16 - GRID_GAP / 2 : 16,
      paddingBottom: 0,
    }),
    [columns],
  );

  const listHeader = useMemo(
    () => <View style={{ height: listPaddingTop }} />,
    [listPaddingTop],
  );

  const listFooter = useMemo(
    () => (
      <View style={{ paddingTop: 12 }}>
        <View style={{ height: bottomBarOverlayHeight, justifyContent: 'flex-start' }}>
          <InfiniteScrollFooter
            isLoadingMore={isLoadingMore}
            endReachedKey={endReachedKey}
            endMessage="마지막 레시피까지 모두 둘러봤어요"
          />
        </View>
      </View>
    ),
    [bottomBarOverlayHeight, endReachedKey, isLoadingMore],
  );

  const showError = error !== null && recipes.length === 0;
  const showEmpty = !isLoading && !error && recipes.length === 0;
  const showList = recipes.length > 0;

  return (
    <View style={{ flex: 1, backgroundColor: PAGE_BG }}>
      {showSkeleton ? (
        <ScrollView
          contentContainerStyle={{
            paddingTop: headerOffset + GRID_GAP,
            paddingHorizontal: 16,
            paddingBottom: bottomBarOverlayHeight,
          }}
        >
          {columns === 2 ? (
            <View style={{ flexDirection: 'row', gap: GRID_GAP }}>
              {[0, 1].map((col) => (
                <View key={col} style={{ flex: 1, gap: GRID_GAP }}>
                  {skeletonVariants
                    .filter((_, i) => i % 2 === col)
                    .map((variant, i) => (
                      <RecipeCardSkeleton key={i} layout="vertical" variant={variant} />
                    ))}
                </View>
              ))}
            </View>
          ) : (
            <View style={{ gap: GRID_GAP }}>
              {Array.from({ length: SKELETON_COUNT }, (_, i) => (
                <RecipeCardSkeleton key={i} layout="horizontal" />
              ))}
            </View>
          )}
        </ScrollView>
      ) : null}

      {showError ? (
        <View
          style={{
            flex: 1,
            paddingTop: headerOffset,
            paddingBottom: bottomBarOverlayHeight,
            justifyContent: 'center',
          }}
        >
          <ErrorState
            title="레시피를 불러오지 못했어요"
            description="네트워크 상태를 확인하고 다시 시도해주세요."
            action={<Button label="다시 시도" onPress={() => void reload()} />}
          />
        </View>
      ) : null}

      {showEmpty ? (
        <View
          style={{
            flex: 1,
            paddingTop: headerOffset,
            paddingBottom: bottomBarOverlayHeight,
            justifyContent: 'center',
          }}
        >
          <EmptyState
            icon={
              <Image
                source={require('../../../assets/state-empty.png')}
                style={{ width: 200, height: 121 }}
                contentFit="contain"
              />
            }
            title="아직 작성한 레시피가 없습니다"
            description="첫 레시피를 만들어보세요!"
            action={<Button variant="primary" label="레시피 작성" onPress={goCreateRecipe} />}
          />
        </View>
      ) : null}

      {showList ? (
        <VirtualGrid
          flashListRef={flashListRef}
          data={recipes}
          columns={columns}
          masonry={columns === 2}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ItemSeparatorComponent={renderItemSeparator}
          onScroll={handleScroll}
          onScrollBeginDrag={handleScrollBeginDrag}
          onScrollEndDrag={handleScrollEndDrag}
          scrollEventThrottle={16}
          overScrollMode="always"
          contentContainerStyle={listContentContainerStyle}
          ListHeaderComponent={listHeader}
          drawDistance={1500}
          onLoad={handleListLoad}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={listFooter}
        />
      ) : null}

      {showList ? (
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: toolbarTop,
              left: 0,
              right: 0,
              zIndex: 5,
            },
            toolbarAnimatedStyle,
          ]}
        >
          <RecipeListToolbar columns={columns} onColumnsChange={handleColumnsChange} />
        </Animated.View>
      ) : null}

      <PageHeader title="내 레시피" backgroundColor={HEADER_BG} borderBottom />
    </View>
  );
}
