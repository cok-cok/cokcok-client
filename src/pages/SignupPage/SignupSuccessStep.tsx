import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Image as ExpoImage } from 'expo-image';

import { Button } from '../../components/Button';
import { styles as pageStyles } from './SignupPage.styles';
import { styles as localStyles } from './SignupSuccessStep.styles';

type Props = {
  onConfirm: () => void;
};

const MASCOT = require('../../../assets/cokcok-mascot.png');

export function SignupSuccessStep({ onConfirm }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={pageStyles.stepContainer}>
      <View style={localStyles.body}>
        <ExpoImage
          source={MASCOT}
          style={localStyles.mascot}
          contentFit="cover"
          cachePolicy="memory-disk"
        />
        <View style={localStyles.textWrap}>
          <Text style={localStyles.title}>회원가입 완료</Text>
          <Text style={localStyles.subtitle}>
            {'이제 로그인해서 cokcok과 함께\n요리를 시작해보세요'}
          </Text>
        </View>
      </View>
      <View style={[pageStyles.stepFooter, { paddingBottom: insets.bottom + 12 }]}>
        <Button fullWidth size="lg" label="로그인 하러 가기" onPress={onConfirm} />
      </View>
    </View>
  );
}
