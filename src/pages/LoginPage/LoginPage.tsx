import { Button, Text, View } from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginPage({ navigation }: Props) {
  return (
    <View>
      <Text>로그인 페이지 입니다.</Text>
      <Button title="회원가입" onPress={() => navigation.navigate('Signup')} />
      <Button title="내 레시피 리스트" onPress={() => navigation.navigate('MyRecipeList')} />
    </View>
  );
}
