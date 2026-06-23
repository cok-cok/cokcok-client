import { memo } from 'react';
import { Text, View } from 'react-native';

import { styles } from './Tag.styles';

type Props = {
  label: string;
  testID?: string;
};

function TagInner({ label, testID }: Props) {
  return (
    <View style={styles.container} testID={testID}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

export const Tag = memo(TagInner);
