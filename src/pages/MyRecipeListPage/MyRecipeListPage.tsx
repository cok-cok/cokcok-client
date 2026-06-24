import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Image } from 'expo-image';

import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useRequireAuth } from '../../auth';
import { useBottomBarScroll } from '../../components/BottomBar';
import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { PageHeader } from '../../components/PageHeader';
import type { RootStackParamList, TabParamList } from '../../navigation/types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'MyRecipeList'>,
  NativeStackScreenProps<RootStackParamList>
>;

const PAGE_BG = '#FBFAF9';
const HEADER_BG = '#FFFFFF';

export default function MyRecipeListPage({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const requireAuth = useRequireAuth();
  const { scrollViewRef, onScroll } = useBottomBarScroll();

  const goCreateRecipe = () => requireAuth(() => navigation.navigate('RecipeForm'));

  return (
    <View style={{ flex: 1, backgroundColor: PAGE_BG }}>
      <Animated.ScrollView
        ref={scrollViewRef}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          paddingTop: insets.top + PageHeader.HEIGHT,
          paddingHorizontal: 16,
          paddingBottom: insets.bottom + 100,
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
      </Animated.ScrollView>

      <PageHeader title="내 레시피" backgroundColor={HEADER_BG} borderBottom shadow />
    </View>
  );
}
