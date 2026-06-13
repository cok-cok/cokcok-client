import { useCallback, useEffect, useRef, useState } from 'react';

import { ApiError, authApi } from '../../api';
import {
  COUNTDOWN_TICK_MS,
  FAKE_LATENCY_MS,
  NETWORK_ERROR_MESSAGE,
  USE_MOCK_API,
  VERIFICATION_CODE_EXPIRY_MS,
  VERIFICATION_RESEND_COOLDOWN_MS,
} from './SignupPage.constants';

type VerificationState = {
  sent: boolean;
  verified: boolean;
  codeExpired: boolean;
  cooldownSeconds: number;
  expirySeconds: number;
  busy: boolean;
};

export type ConfirmCodeResult = { ok: true; message?: undefined } | { ok: false; message: string };

type Result = VerificationState & {
  requestCode: (email: string) => Promise<void>;
  confirmCode: (email: string, code: string) => Promise<ConfirmCodeResult>;
  reset: () => void;
};

const initialState: VerificationState = {
  sent: false,
  verified: false,
  codeExpired: false,
  cooldownSeconds: 0,
  expirySeconds: 0,
  busy: false,
};

export function useEmailVerification(): Result {
  const [state, setState] = useState<VerificationState>(initialState);

  const cooldownUntilRef = useRef<number>(0);
  const expiryUntilRef = useRef<number>(0);
  const tickerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTicker = useCallback(() => {
    if (tickerRef.current !== null) {
      clearInterval(tickerRef.current);
      tickerRef.current = null;
    }
  }, []);

  const startTicker = useCallback(() => {
    if (tickerRef.current !== null) return;
    tickerRef.current = setInterval(() => {
      const now = Date.now();
      const cooldownMs = Math.max(0, cooldownUntilRef.current - now);
      const expiryMs = Math.max(0, expiryUntilRef.current - now);
      const cooldownSeconds = Math.ceil(cooldownMs / 1000);
      const expirySeconds = Math.ceil(expiryMs / 1000);

      setState((prev) => {
        if (prev.verified) return prev;
        const codeExpired = expirySeconds === 0;
        if (
          prev.cooldownSeconds === cooldownSeconds &&
          prev.expirySeconds === expirySeconds &&
          prev.codeExpired === codeExpired
        ) {
          return prev;
        }
        return { ...prev, cooldownSeconds, expirySeconds, codeExpired };
      });

      if (cooldownMs === 0 && expiryMs === 0) {
        stopTicker();
      }
    }, COUNTDOWN_TICK_MS);
  }, [stopTicker]);

  useEffect(() => {
    return () => stopTicker();
  }, [stopTicker]);

  const reset = useCallback(() => {
    stopTicker();
    cooldownUntilRef.current = 0;
    expiryUntilRef.current = 0;
    setState(initialState);
  }, [stopTicker]);

  const requestCode = useCallback(
    async (email: string) => {
      if (cooldownUntilRef.current > Date.now()) return;

      setState((prev) => ({ ...prev, busy: true }));

      try {
        if (USE_MOCK_API) {
          await new Promise((r) => setTimeout(r, FAKE_LATENCY_MS));
        } else {
          await authApi.requestEmailVerification({ email });
        }

        const now = Date.now();
        cooldownUntilRef.current = now + VERIFICATION_RESEND_COOLDOWN_MS;
        expiryUntilRef.current = now + VERIFICATION_CODE_EXPIRY_MS;
        setState({
          sent: true,
          verified: false,
          codeExpired: false,
          cooldownSeconds: Math.ceil(VERIFICATION_RESEND_COOLDOWN_MS / 1000),
          expirySeconds: Math.ceil(VERIFICATION_CODE_EXPIRY_MS / 1000),
          busy: false,
        });
        startTicker();
      } catch (err) {
        setState((prev) => ({ ...prev, busy: false }));
        throw err;
      }
    },
    [startTicker],
  );

  const confirmCode = useCallback<
    (email: string, code: string) => Promise<ConfirmCodeResult>
  >(
    async (email, code) => {
      setState((prev) => ({ ...prev, busy: true }));

      try {
        if (USE_MOCK_API) {
          await new Promise((r) => setTimeout(r, FAKE_LATENCY_MS));
        } else {
          await authApi.confirmEmailVerification({ email, code });
        }

        stopTicker();
        cooldownUntilRef.current = 0;
        expiryUntilRef.current = 0;
        setState({
          sent: true,
          verified: true,
          codeExpired: false,
          cooldownSeconds: 0,
          expirySeconds: 0,
          busy: false,
        });
        return { ok: true };
      } catch (err) {
        setState((prev) => ({ ...prev, busy: false }));
        const message = err instanceof ApiError ? err.message : NETWORK_ERROR_MESSAGE;
        return { ok: false, message };
      }
    },
    [stopTicker],
  );

  return { ...state, requestCode, confirmCode, reset };
}
