import {
  LEGAL_FAKE_LATENCY_MS,
  LEGAL_USE_MOCK,
  MOCK_LEGAL_CONTENT,
  MOCK_LEGAL_MANIFEST,
} from '../mocks/legal.mock';
import { apiRequest } from './client';

export type LegalKey =
  | 'terms-of-service'
  | 'privacy-consent'
  | 'age-confirm'
  | 'marketing-consent';

export type LegalManifestItem = {
  key: LegalKey;
  version: string;
  title: string;
  required: boolean;
  hasContent: boolean;
  effectiveDate?: string;
};

export type LegalManifestResponse = {
  items: LegalManifestItem[];
};

const LEGAL_TIMEOUT_MS = 10_000;

export async function getLegalManifest(): Promise<LegalManifestResponse> {
  if (LEGAL_USE_MOCK) {
    await new Promise((r) => setTimeout(r, LEGAL_FAKE_LATENCY_MS));
    return { items: MOCK_LEGAL_MANIFEST };
  }
  return apiRequest<LegalManifestResponse>('/api/legal/manifest', {
    timeoutMs: LEGAL_TIMEOUT_MS,
  });
}

export async function getLegalContent(key: LegalKey, version: string): Promise<string> {
  if (LEGAL_USE_MOCK) {
    await new Promise((r) => setTimeout(r, LEGAL_FAKE_LATENCY_MS));
    return MOCK_LEGAL_CONTENT[key] ?? `# ${key}\n\n(본문 준비 중)`;
  }
  // text/markdown 응답: apiRequest 시그니처 확장 시 적용
  return apiRequest<string>(`/api/legal/${key}/${version}`, { timeoutMs: LEGAL_TIMEOUT_MS });
}
