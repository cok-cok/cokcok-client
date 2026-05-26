import { ScrollView, View } from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useReload } from '../../bootstrap';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'MyRecipeList'>;

export default function MyRecipeListPage({ navigation }: Props) {
  const reload = useReload();

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <View style={{ gap: 8 }}>
        <Button
          variant="secondary"
          label="다시 로드"
          iconLeft={<Icon name="refreshCw" />}
          onPress={reload}
        />
        <Button variant="text" label="로그인" onPress={() => navigation.navigate('Login')} />
        <Button variant="secondary" label="레시피 작성" onPress={() => navigation.navigate('RecipeForm')} />
        <Button variant="secondary" label="레시피 상세" onPress={() => navigation.navigate('RecipeDetail')} />
        <Button variant="primary" label="마이" onPress={() => navigation.navigate('MyPage')} />
      </View>
    </ScrollView>
  );
}
