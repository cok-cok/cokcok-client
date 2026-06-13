import { Pressable, type StyleProp, Text, View, type ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '../../components/Icon';
import { PAGE_TITLE } from './SignupPage.constants';
import { styles } from './SignupPage.styles';

const BACK_ICON_SIZE = 28;

type Props = {
  entranceStyle: StyleProp<ViewStyle>;
  onBackPress: () => void;
  disabled?: boolean;
};

export function SignupHeader({ entranceStyle, onBackPress, disabled = false }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <Animated.View style={[{ paddingTop: insets.top }, entranceStyle]}>
      <View style={styles.header}>
        <Pressable
          onPress={onBackPress}
          disabled={disabled}
          style={[styles.headerBack, disabled ? { opacity: 0.4 } : null]}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="뒤로가기"
          accessibilityState={{ disabled }}
        >
          <Icon name="chevronLeft" size={BACK_ICON_SIZE} />
        </Pressable>
        <Text style={styles.headerTitle}>{PAGE_TITLE}</Text>
      </View>
    </Animated.View>
  );
}
