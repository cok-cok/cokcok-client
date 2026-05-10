import { Button, Text, View } from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Signup'>;

export default function SignupPage({ navigation }: Props) {
  return (
    <View>
      <Text>회원가입 페이지 입니다.</Text>
      <Button title="로그인" onPress={() => navigation.navigate('Login')} />
    </View>
  );
}
