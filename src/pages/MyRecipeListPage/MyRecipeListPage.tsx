import { useCallback, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
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

import { type Recipe,recipesApi } from '../../api';
import { useRequireAuth } from '../../auth';
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

  const [columns, setColumns] = useState<RecipeListColumns>(2);

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
    error,
    endReachedKey,
    loadMore,
    reload,
  } = useInfiniteScroll<Recipe>({ fetcher });

  const showSkeleton = useDelayedSkeleton(isLoading && recipes.length === 0);

  const { hideValue, registerScrollToTop } = useTabBarContext();
  const flashListRef = useAnimatedRef<FlashListRef<Recipe>>();
  const lastY = useSharedValue(0);

  const scrollToTop = useCallback(() => {
    flashListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, [flashListRef]);

  useFocusEffect(
    useCallback(() => {
      hideValue.value = withTiming(0, { duration: RESET_DURATION_MS });
      lastY.value = 0;
      registerScrollToTop(scrollToTop);
      return () => {
        registerScrollToTop(null);
      };
    }, [hideValue, lastY, registerScrollToTop, scrollToTop]),
  );

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentY = event.contentOffset.y;
      const contentHeight = event.contentSize.height;
      const viewportHeight = event.layoutMeasurement.height;
      const maxScroll = Math.max(0, contentHeight - viewportHeight);
      const isOverscroll = currentY < 0 || currentY > maxScroll;

      if (!isOverscroll) {
        const delta = currentY - lastY.value;
        if (currentY <= TOP_THRESHOLD) {
          hideValue.value = withTiming(0, { duration: HIDE_DURATION_MS });
        } else if (delta > HIDE_DELTA_THRESHOLD) {
          hideValue.value = withTiming(1, { duration: HIDE_DURATION_MS });
        } else if (delta < -HIDE_DELTA_THRESHOLD) {
          hideValue.value = withTiming(0, { duration: HIDE_DURATION_MS });
        }
      }

      lastY.value = currentY;
    },
  });

  const toolbarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: hideValue.value * -RECIPE_LIST_TOOLBAR_HEIGHT }],
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
    ),
    [columns, goDetail],
  );

  const renderItemSeparator = useCallback(() => <View style={{ height: GRID_GAP }} />, []);

  const headerOffset = insets.top + PageHeader.HEIGHT;
  const listPaddingTop = headerOffset + RECIPE_LIST_TOOLBAR_HEIGHT + GRID_GAP;
  const listPaddingBottom = insets.bottom + 100;

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
            paddingBottom: listPaddingBottom,
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
            paddingBottom: listPaddingBottom,
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
            paddingBottom: listPaddingBottom,
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
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          ItemSeparatorComponent={renderItemSeparator}
          onScroll={onScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{
            paddingTop: listPaddingTop,
            paddingHorizontal: 16,
            paddingBottom: listPaddingBottom,
          }}
          onEndReached={() => void loadMore()}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            <InfiniteScrollFooter
              isLoadingMore={isLoadingMore}
              endReachedKey={endReachedKey}
              endMessage="마지막 레시피까지 모두 둘러봤어요"
            />
          }
        />
      ) : null}

      {showList ? (
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: headerOffset,
              left: 0,
              right: 0,
              zIndex: 5,
            },
            toolbarAnimatedStyle,
          ]}
        >
          <RecipeListToolbar columns={columns} onColumnsChange={setColumns} />
        </Animated.View>
      ) : null}

      <PageHeader title="내 레시피" backgroundColor={HEADER_BG} borderBottom />
    </View>
  );
}
