import { useCallback, useEffect, useRef, useState } from 'react';

import { Asset } from 'expo-asset';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync().catch(() => {});

async function prefetchVisualAssets(): Promise<void> {
  await Promise.all([
    Asset.fromModule(require('../../assets/login-bg.png')).downloadAsync(),
    Asset.fromModule(require('../../assets/cokcok-letter-c.png')).downloadAsync(),
    Asset.fromModule(require('../../assets/cokcok-letter-o.png')).downloadAsync(),
    Asset.fromModule(require('../../assets/cokcok-letter-k.png')).downloadAsync(),
  ]);
}

async function loadAppData(): Promise<void> {
  // TODO: future bootstrap work
  return;
}

type UseBootstrap = {
  showLoading: boolean;
  splashHidden: boolean;
  bootstrapReady: boolean;
  reload: () => void;
  handleLoadingExitComplete: () => void;
};

export function useBootstrap(): UseBootstrap {
  const [trigger, setTrigger] = useState(0);
  const [bootstrapReady, setBootstrapReady] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [splashHidden, setSplashHidden] = useState(false);
  const splashHiddenRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    setBootstrapReady(false);

    (async () => {
      try {
        await prefetchVisualAssets();
        if (cancelled) return;

        if (!splashHiddenRef.current) {
          splashHiddenRef.current = true;
          SplashScreen.setOptions({ fade: true, duration: 300 });
          await SplashScreen.hideAsync().catch(() => {});
          if (!cancelled) setSplashHidden(true);
        }

        await loadAppData();
        if (cancelled) return;

        setBootstrapReady(true);
      } catch {
        if (!cancelled) setBootstrapReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [trigger]);

  const reload = useCallback(() => {
    setShowLoading(true);
    setTrigger((t) => t + 1);
  }, []);

  const handleLoadingExitComplete = useCallback(() => {
    setShowLoading(false);
  }, []);

  return { showLoading, splashHidden, bootstrapReady, reload, handleLoadingExitComplete };
}
