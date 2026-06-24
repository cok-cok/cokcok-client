import { Button, Text, View } from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export default function SettingsPage({ navigation }: Props) {
  return (
    <View>
      <Text>설정 페이지 입니다.</Text>
      <Button title="로그인" onPress={() => navigation.navigate('Login')} />
      <Button title="마이" onPress={() => navigation.navigate('Tabs', { screen: 'MyPage' })} />
    </View>
  );
}
