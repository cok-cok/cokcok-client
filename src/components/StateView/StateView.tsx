import { memo } from 'react';
import { Text, View } from 'react-native';

import { styles } from './StateView.styles';
import type { StateViewProps } from './StateView.types';

function StateViewInner({ icon, title, description, action, style, testID }: StateViewProps) {
  return (
    <View style={[styles.container, style]} testID={testID}>
      {icon ? <View style={styles.iconWrap}>{icon}</View> : null}
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
      {action ? <View style={styles.actionWrap}>{action}</View> : null}
    </View>
  );
}

export const StateView = memo(StateViewInner);
