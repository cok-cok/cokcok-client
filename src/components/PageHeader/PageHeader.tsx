import { memo, type ReactNode } from 'react';
import { Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackButton } from './BackButton';
import { IconButton } from './IconButton';
import { PAGE_HEADER_CONTENT_HEIGHT, styles } from './PageHeader.styles';
import type { PageHeaderProps } from './PageHeader.types';

function renderRight(right: ReactNode | ReactNode[]): ReactNode {
  if (Array.isArray(right)) {
    return <View style={styles.rightRow}>{right}</View>;
  }
  return right;
}

function PageHeaderInner({
  left,
  title,
  right,
  borderBottom = false,
  shadow = false,
  backgroundColor = 'transparent',
  style,
  testID,
}: PageHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <Animated.View
      style={[
        styles.rootFloating,
        { paddingTop: insets.top, backgroundColor },
        borderBottom ? styles.borderBottom : null,
        shadow ? styles.shadow : null,
        style,
      ]}
      pointerEvents="box-none"
      testID={testID}
    >
      <View style={styles.body}>
        {left ? <View style={styles.leftSlot}>{left}</View> : null}
        {title ? (
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        ) : null}
        {right ? <View style={styles.rightSlot}>{renderRight(right)}</View> : null}
      </View>
    </Animated.View>
  );
}

const PageHeaderBase = memo(PageHeaderInner);

type PageHeaderComponent = typeof PageHeaderBase & {
  BackButton: typeof BackButton;
  IconButton: typeof IconButton;
  HEIGHT: typeof PAGE_HEADER_CONTENT_HEIGHT;
};

export const PageHeader = PageHeaderBase as PageHeaderComponent;
PageHeader.BackButton = BackButton;
PageHeader.IconButton = IconButton;
PageHeader.HEIGHT = PAGE_HEADER_CONTENT_HEIGHT;
