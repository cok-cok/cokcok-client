import { apiRequest } from './client';

// TODO 실제 API 붙으면 false로 변경
const USE_MOCK_API = true;
const FAKE_LATENCY_MS = 300;

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
  if (USE_MOCK_API) {
    await new Promise((r) => setTimeout(r, FAKE_LATENCY_MS));
    return { items: MOCK_MANIFEST };
  }
  return apiRequest<LegalManifestResponse>('/api/legal/manifest', {
    timeoutMs: LEGAL_TIMEOUT_MS,
  });
}

export async function getLegalContent(key: LegalKey, version: string): Promise<string> {
  if (USE_MOCK_API) {
    await new Promise((r) => setTimeout(r, FAKE_LATENCY_MS));
    return MOCK_CONTENT[key] ?? `# ${key}\n\n(본문 준비 중)`;
  }
  // TODO: text/markdown 응답을 받기 위해 apiRequest 시그니처 확장 필요할 수 있음.
  return apiRequest<string>(`/api/legal/${key}/${version}`, { timeoutMs: LEGAL_TIMEOUT_MS });
}

const MOCK_MANIFEST: LegalManifestItem[] = [
  {
    key: 'terms-of-service',
    version: '1.0.0',
    title: '서비스 이용약관',
    required: true,
    hasContent: true,
    effectiveDate: '2026-06-01',
  },
  {
    key: 'privacy-consent',
    version: '1.0.0',
    title: '개인정보 수집·이용',
    required: true,
    hasContent: true,
    effectiveDate: '2026-06-01',
  },
  {
    key: 'age-confirm',
    version: '1.0.0',
    title: '만 14세 이상입니다',
    required: true,
    hasContent: false,
  },
  {
    key: 'marketing-consent',
    version: '1.0.0',
    title: '마케팅 정보 수신 동의',
    required: false,
    hasContent: true,
    effectiveDate: '2026-06-01',
  },
];

const MOCK_CONTENT: Record<LegalKey, string> = {
  'terms-of-service': `# cokcok 서비스 이용약관

본 약관은 cokcok(운영자: 구현우, 이하 "회사")이 제공하는 cokcok 서비스(이하 "서비스")의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.

## 제1조 (목적)

본 약관은 회사가 제공하는 서비스의 이용조건 및 절차, 회원과 회사 간의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.

## 제2조 (용어의 정의)

1. **서비스**: 회사가 제공하는 레시피 작성·저장·공유, 타이머 기반 레시피 실행 기능 등 cokcok 모바일 애플리케이션 및 부속 서비스 일체를 의미합니다.
2. **회원**: 본 약관에 동의하고 회사가 정한 가입 절차를 거쳐 서비스를 이용하는 자를 의미합니다.
3. **콘텐츠**: 회원이 서비스를 통해 작성·업로드한 레시피, 이미지, 텍스트, 코멘트 등 일체의 자료를 의미합니다.
4. **공유 콘텐츠**: 회원이 공개 옵션을 선택하여 불특정 다수가 열람할 수 있도록 게시한 콘텐츠를 의미합니다.

## 제3조 (약관의 명시와 개정)

1. 회사는 본 약관의 내용을 회원이 쉽게 알 수 있도록 서비스 초기 화면 및 설정 화면에 게시합니다.
2. 회사는 약관규제법, 개인정보보호법, 정보통신망법 등 관련 법령을 위반하지 않는 범위에서 본 약관을 개정할 수 있습니다.
3. 회사가 약관을 개정할 경우 적용일자 및 개정사유를 명시하여 시행일로부터 7일 이전부터 공지합니다.

## 제4조 (회원의 콘텐츠와 저작권)

1. 회원이 서비스 내에서 작성·업로드한 콘텐츠의 저작권은 회원 본인에게 있습니다.
2. 회원은 회사에 서비스 운영을 위한 무상·비독점적·전 세계적 라이선스를 부여합니다.

## 제5조 (공유 콘텐츠)

cokcok은 회원이 자신의 레시피를 다른 회원과 공유하고, 다른 회원이 이를 가져가 자신의 레시피로 커스텀하는 기능을 핵심으로 합니다. 공유 옵션을 선택한 콘텐츠에 한해, 다른 회원은 열람·복사·수정해 자신의 레시피로 활용할 수 있으며, 한 번 가져간 사본은 회수되지 않습니다.

> 본 약관은 mock 데이터로, 실 API 연동 시 전체 본문(docs/legal/published/terms-of-service.md)이 반환됩니다.

(검수용 — 스크롤 강제 UX 확인을 위해 본문이 충분히 길어야 합니다. 본 줄 아래로 더 많은 조항이 들어갑니다.)

## 제6조 ~ 제15조

본 약관의 나머지 조항은 실 API에서 제공됩니다. 본 mock에서는 검수 편의를 위해 일부만 표시.
`,

  'privacy-consent': `# 개인정보 수집·이용 동의 [필수]

「개인정보 보호법」 제15조에 따라 cokcok 서비스 회원가입을 위해 수집하는 개인정보 항목, 이용 목적 및 보유 기간을 안내드리며 동의를 받습니다.

## 1. 수집·이용하는 개인정보 항목

### 1) 회원가입 시 수집 (필수)
- 이메일 주소
- 비밀번호 (단방향 해시 처리하여 저장)
- 닉네임
- 만 14세 이상 여부 확인

### 2) 서비스 이용 중 자동 수집
- 접속 IP, 접속 로그, 기기 정보(OS 버전, 단말 모델, 앱 버전)
- 서비스 이용 기록, 작성·공유한 레시피, 업로드한 이미지

## 2. 개인정보의 수집·이용 목적

- 회원 식별 및 본인 인증
- 회원자격 유지·관리, 부정 이용 방지
- 레시피 작성·저장·공유·검색·추천 등 서비스 제공
- 타이머 기반 레시피 실행 알림
- 고객 문의 응대 및 분쟁 해결

## 3. 보유·이용 기간

- 원칙: 회원 탈퇴 시까지
- 접속 로그 등 자동 수집 정보: 3개월

## 4. 동의 거부 권리

회원은 위 개인정보 수집·이용에 동의하지 않으실 권리가 있습니다. 다만 본 동의는 회원가입 및 서비스 이용에 필수적이며, 동의 거부 시 회원가입이 제한됩니다.

> 본 동의서는 mock 데이터입니다. 실 API 연동 시 전체 본문이 반환됩니다.
`,

  'age-confirm': '',

  'marketing-consent': `# 마케팅 정보 수신 동의 [선택]

「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 제50조에 따라 영리 목적의 광고성 정보를 전송하기 위해서는 사전 동의가 필요합니다. 본 동의는 **선택 동의**이며, 동의하지 않으셔도 회원가입 및 서비스 이용에는 지장이 없습니다.

## 1. 광고성 정보의 내용

- 신규 기능, 신규 서비스 안내
- 이벤트, 프로모션, 캠페인 안내
- 회사의 서비스 업데이트 홍보

> ※ 계정 보안 안내, 회원가입·탈퇴 처리 결과, 약관 변경 공지 등 회원에게 의무적으로 전달되어야 하는 운영상 필수 안내는 본 동의 여부와 관계없이 전송됩니다.

## 2. 전송 매체

- 이메일
- 모바일 푸시 알림 (앱 알림 권한 허용 시)

## 3. 보유 기간 및 재확인

- 본 동의는 동의 철회 시까지 유효합니다.
- 정보통신망법 제50조의2에 따라 회사는 동의 후 2년마다 동의 여부를 재확인합니다.

## 4. 동의 철회

회원은 언제든지 앱 내 설정 메뉴 또는 회사 고객센터를 통해 동의를 철회할 수 있습니다.

> 본 동의서는 mock 데이터입니다. 실 API 연동 시 전체 본문이 반환됩니다.
`,
};
