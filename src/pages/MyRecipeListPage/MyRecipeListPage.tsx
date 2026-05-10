import { Button, Text, View } from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'MyRecipeList'>;

export default function MyRecipeListPage({ navigation }: Props) {
  return (
    <View>
      <Text>내 레시피 리스트 페이지 입니다.</Text>
      <Button title="로그인" onPress={() => navigation.navigate('Login')} />
      <Button title="레시피 작성" onPress={() => navigation.navigate('RecipeForm')} />
      <Button title="레시피 상세" onPress={() => navigation.navigate('RecipeDetail')} />
      <Button title="마이" onPress={() => navigation.navigate('MyPage')} />
    </View>
  );
}
