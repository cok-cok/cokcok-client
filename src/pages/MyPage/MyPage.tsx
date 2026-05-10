import { Button, Text, View } from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'MyPage'>;

export default function MyPage({ navigation }: Props) {
  return (
    <View>
      <Text>마이페이지 입니다.</Text>
      <Button title="내 레시피 리스트" onPress={() => navigation.navigate('MyRecipeList')} />
      <Button title="설정" onPress={() => navigation.navigate('Settings')} />
    </View>
  );
}
