import { useCallback, useState } from 'react';

import { ApiError, authApi } from '../../api';
import { SIGNUP_FAKE_LATENCY_MS, SIGNUP_USE_MOCK } from '../../mocks/signup.mock';
import { NETWORK_ERROR_MESSAGE } from './SignupPage.constants';

type NicknameCheckState = {
  available: boolean | undefined;
  busy: boolean;
};

export type CheckResult = { ok: true; message?: undefined } | { ok: false; message: string };

type Result = NicknameCheckState & {
  check: (nickname: string) => Promise<CheckResult>;
  reset: () => void;
};

const initial: NicknameCheckState = { available: undefined, busy: false };

export function useNicknameCheck(): Result {
  const [state, setState] = useState<NicknameCheckState>(initial);

  const reset = useCallback(() => setState(initial), []);

  const check = useCallback<(nickname: string) => Promise<CheckResult>>(async (nickname) => {
    setState((prev) => ({ ...prev, busy: true }));
    try {
      if (SIGNUP_USE_MOCK) {
        await new Promise((r) => setTimeout(r, SIGNUP_FAKE_LATENCY_MS));
      } else {
        await authApi.checkNickname(nickname);
      }
      setState({ available: true, busy: false });
      return { ok: true };
    } catch (err) {
      // ApiError(서버가 확정한 "중복" 등)는 available=false. 그 외는 변화 없음 → 재시도 가능
      if (err instanceof ApiError) {
        setState({ available: false, busy: false });
        return { ok: false, message: err.message };
      }
      setState((prev) => ({ ...prev, busy: false }));
      return { ok: false, message: NETWORK_ERROR_MESSAGE };
    }
  }, []);

  return { ...state, check, reset };
}
