import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useBottomBarScroll } from '../../components/BottomBar';
import { Button } from '../../components/Button';
import { PageHeader } from '../../components/PageHeader';
import type { RootStackParamList, TabParamList } from '../../navigation/types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'MyPage'>,
  NativeStackScreenProps<RootStackParamList>
>;

const PAGE_BG = '#FBFAF9';
const HEADER_BG = '#FFFFFF';

export default function MyPage({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { scrollViewRef, onScroll } = useBottomBarScroll({ hideOnScroll: false });

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
          <Button variant="secondary" label="설정" onPress={() => navigation.navigate('Settings')} />
        </View>
      </Animated.ScrollView>

      <PageHeader title="마이페이지" backgroundColor={HEADER_BG} borderBottom shadow />
    </View>
  );
}
