import { createContext, useContext } from 'react';

type BootstrapContextValue = {
  // 부트스트랩 다시 돌리기 + LoadingPage 재진입 (MyRecipeList의 새로고침 버튼 등에서 호출)
  reload: () => void;
};

export const BootstrapContext = createContext<BootstrapContextValue>({
  reload: () => {},
});

export function useReload(): () => void {
  return useContext(BootstrapContext).reload;
}
