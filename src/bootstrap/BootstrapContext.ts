import { createContext, useContext } from 'react';

type BootstrapContextValue = {
  reload: () => void;
};

export const BootstrapContext = createContext<BootstrapContextValue>({
  reload: () => {},
});

export function useReload(): () => void {
  return useContext(BootstrapContext).reload;
}
