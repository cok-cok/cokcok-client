const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'https://api.cokcok.com';

export const DEFAULT_TIMEOUT_MS = 20_000;

export class ApiError extends Error {
  readonly status: number;
  readonly payload: unknown;

  constructor(status: number, message: string, payload?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

export class NetworkError extends Error {
  constructor(cause?: unknown) {
    super('Network error');
    this.name = 'NetworkError';
    if (cause !== undefined) (this as { cause?: unknown }).cause = cause;
  }
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type RequestOptions = {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  timeoutMs?: number;
};

function combineSignals(signals: (AbortSignal | undefined)[]): AbortSignal {
  const controller = new AbortController();
  for (const s of signals) {
    if (!s) continue;
    if (s.aborted) {
      controller.abort();
      break;
    }
    s.addEventListener('abort', () => controller.abort(), { once: true });
  }
  return controller.signal;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {}, signal: externalSignal, timeoutMs = DEFAULT_TIMEOUT_MS } = options;

  const timeoutController = new AbortController();
  const timeoutId = setTimeout(() => timeoutController.abort(), timeoutMs);
  const signal = combineSignals([externalSignal, timeoutController.signal]);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json', ...headers },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (err) {
    clearTimeout(timeoutId);
    throw new NetworkError(err);
  }
  clearTimeout(timeoutId);

  let parsed: unknown = null;
  if (response.status !== 204) {
    try {
      parsed = await response.json();
    } catch {
      // ignore non-JSON body
    }
  }

  if (!response.ok) {
    const message =
      typeof parsed === 'object' && parsed !== null && 'message' in parsed
        ? String((parsed as { message: unknown }).message)
        : `Request failed (${response.status})`;
    throw new ApiError(response.status, message, parsed);
  }

  return parsed as T;
}
