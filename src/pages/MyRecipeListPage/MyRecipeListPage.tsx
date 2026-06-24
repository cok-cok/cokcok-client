import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useReload } from '../../bootstrap';
import { useBottomBarScroll } from '../../components/BottomBar';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
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
  const reload = useReload();
  const { scrollViewRef, onScroll } = useBottomBarScroll();

  return (
    <View style={{ flex: 1, backgroundColor: PAGE_BG }}>
      <Animated.ScrollView
        ref={scrollViewRef}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingTop: insets.top + PageHeader.HEIGHT,
          paddingHorizontal: 16,
          paddingBottom: insets.bottom + 100,
        }}
      >
        <View style={{ gap: 8 }}>
          <Button variant="secondary" label="다시 로드" iconLeft={<Icon name="refreshCw" />} onPress={reload} />
          <Button variant="text" label="로그인" onPress={() => navigation.navigate('Login')} />
          <Button variant="secondary" label="레시피 작성" onPress={() => navigation.navigate('RecipeForm')} />
          <Button variant="secondary" label="레시피 상세" onPress={() => navigation.navigate('RecipeDetail')} />
        </View>
      </Animated.ScrollView>

      <PageHeader title="내 레시피" backgroundColor={HEADER_BG} borderBottom shadow />
    </View>
  );
}
