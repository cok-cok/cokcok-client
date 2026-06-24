import { memo } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { BlurView } from 'expo-blur';

import { Icon, type IconName } from '../Icon';
import { FAB_TINT_OVERLAY } from './BottomBar.constants';
import { styles } from './BottomBar.styles';

const FAB_ICON_SIZE = 28;
const BLUR_INTENSITY = 5;

const isIos = Platform.OS === 'ios';

type Props = {
  icon: IconName;
  iconColor: string;
  onPress: () => void;
  accessibilityLabel: string;
};

function GlassFabInner({ icon, iconColor, onPress, accessibilityLabel }: Props) {
  return (
    <View style={styles.fabShadow}>
      <Pressable
        style={styles.fabInner}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
      >
        {isIos ? (
          <BlurView intensity={BLUR_INTENSITY} tint="regular" style={StyleSheet.absoluteFill} />
        ) : null}
        <View
          style={[StyleSheet.absoluteFill, { backgroundColor: FAB_TINT_OVERLAY }]}
          pointerEvents="none"
        />
        <Icon name={icon} color={iconColor} size={FAB_ICON_SIZE} />
      </Pressable>
    </View>
  );
}

export const GlassFab = memo(GlassFabInner);
