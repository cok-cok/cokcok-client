import { useMemo } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { NavigationContainer } from '@react-navigation/native';

import { BootstrapContext, useBootstrap } from './src/bootstrap';
import { ToastProvider } from './src/components/Toast';
import RootNavigator from './src/navigation/RootNavigator';
import { LoadingPage } from './src/pages/LoadingPage';

export default function App() {
  const { showLoading, bootstrapReady, reload, handleLoadingExitComplete } = useBootstrap();
  const bootstrapCtx = useMemo(() => ({ reload }), [reload]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <BootstrapContext.Provider value={bootstrapCtx}>
            <ToastProvider>
              <RootNavigator />
              {showLoading ? (
                <LoadingPage
                  bootstrapReady={bootstrapReady}
                  onExitComplete={handleLoadingExitComplete}
                />
              ) : null}
            </ToastProvider>
          </BootstrapContext.Provider>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
