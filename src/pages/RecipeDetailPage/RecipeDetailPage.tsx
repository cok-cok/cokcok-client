import { Button, Text, View } from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'RecipeDetail'>;

export default function RecipeDetailPage({ navigation }: Props) {
  return (
    <View>
      <Text>레시피 상세 페이지 입니다.</Text>
      <Button title="내 레시피 리스트" onPress={() => navigation.navigate('Tabs')} />
    </View>
  );
}
