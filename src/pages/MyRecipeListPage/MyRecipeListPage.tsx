import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useReload } from '../../bootstrap';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { PageHeader } from '../../components/PageHeader';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'MyRecipeList'>;

const PAGE_BG = '#FBFAF9';
const HEADER_BG = '#FFFFFF';

export default function MyRecipeListPage({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const reload = useReload();

  return (
    <View style={{ flex: 1, backgroundColor: PAGE_BG }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + PageHeader.HEIGHT,
          paddingHorizontal: 16,
          paddingBottom: 32,
        }}
      >
        <View style={{ gap: 8 }}>
          <Button
            variant="secondary"
            label="다시 로드"
            iconLeft={<Icon name="refreshCw" />}
            onPress={reload}
          />
          <Button variant="text" label="로그인" onPress={() => navigation.navigate('Login')} />
          <Button
            variant="secondary"
            label="레시피 작성"
            onPress={() => navigation.navigate('RecipeForm')}
          />
          <Button
            variant="secondary"
            label="레시피 상세"
            onPress={() => navigation.navigate('RecipeDetail')}
          />
          <Button variant="primary" label="마이" onPress={() => navigation.navigate('MyPage')} />
        </View>
      </ScrollView>

      <PageHeader title="내 레시피" backgroundColor={HEADER_BG} borderBottom shadow />
    </View>
  );
}
