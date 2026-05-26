import { useCallback, useEffect, useRef, useState } from 'react';

import { Asset } from 'expo-asset';
import * as SplashScreen from 'expo-splash-screen';

// 네이티브 스플래시를 수동 제어. 모듈 로드 시점(=가장 빠른 시점)에 호출해야 OS가 자동으로 안 사라짐.
SplashScreen.preventAutoHideAsync().catch(() => {
  // 이미 hide된 상태 등 — 무시
});

// 시각 prerequisites — 스플래시가 사라지기 전에 반드시 로드돼야 LoadingPage 진입이 부드러움
async function prefetchVisualAssets(): Promise<void> {
  await Promise.all([
    Asset.fromModule(require('../../assets/login-bg.png')).downloadAsync(),
    Asset.fromModule(require('../../assets/cokcok-letter-c.png')).downloadAsync(),
    Asset.fromModule(require('../../assets/cokcok-letter-o.png')).downloadAsync(),
    Asset.fromModule(require('../../assets/cokcok-letter-k.png')).downloadAsync(),
  ]);
}

// 앱 데이터 — LoadingPage가 점프 애니메이션 돌리는 동안 진행. 이 promise가 끝나야 bootstrapReady=true.
// 향후 토큰 검증 / 초기 사용자 데이터 fetch / 폰트 로드 등을 여기에 추가.
async function loadAppData(): Promise<void> {
  // TODO: future bootstrap work
  return;
}

type UseBootstrap = {
  showLoading: boolean;
  bootstrapReady: boolean;
  reload: () => void;
  handleLoadingExitComplete: () => void;
};

export function useBootstrap(): UseBootstrap {
  const [trigger, setTrigger] = useState(0);
  const [bootstrapReady, setBootstrapReady] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  // 네이티브 스플래시는 한 번만 hide — 첫 부트스트랩 후 reload엔 다시 안 띄움
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
        }

        await loadAppData();
        if (cancelled) return;

        setBootstrapReady(true);
      } catch {
        // 부트스트랩 실패해도 무한 로딩 회피 — LoadingPage 진행시킴
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

  return { showLoading, bootstrapReady, reload, handleLoadingExitComplete };
}
