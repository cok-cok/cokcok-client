import { createContext, useContext } from 'react';
import type { SharedValue } from 'react-native-reanimated';

type ScrollHandler = () => void;

export type TabBarContextValue = {
  hideValue: SharedValue<number>;
  registerScrollToTop: (fn: ScrollHandler | null) => void;
  scrollToTop: () => void;
  onFabPress: () => void;
};

export const TabBarContext = createContext<TabBarContextValue | null>(null);

export function useTabBarContext(): TabBarContextValue {
  const ctx = useContext(TabBarContext);
  if (!ctx) {
    throw new Error('useTabBarContext must be used within TabBarContext.Provider');
  }
  return ctx;
}
