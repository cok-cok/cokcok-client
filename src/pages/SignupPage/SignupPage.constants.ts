export const BRAND_COLOR = '#FD4C06';
export const PAGE_BG_COLOR = '#FBFBFB';

export const ENTRANCE_DURATION_MS = 380;

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s]).{8,}$/;
export const NICKNAME_REGEX = /^[a-zA-Z0-9가-힣]{2,12}$/;

export const VERIFICATION_RESEND_COOLDOWN_MS = 10 * 1000;
export const VERIFICATION_CODE_EXPIRY_MS = 3 * 60 * 1000;
export const COUNTDOWN_TICK_MS = 1000;

export const PAGE_TITLE = '회원가입';

export const EMAIL_LABEL = '이메일';
export const VERIFICATION_CODE_LABEL = '인증 코드';
export const PASSWORD_LABEL = '비밀번호';
export const PASSWORD_CONFIRM_LABEL = '비밀번호 확인';
export const NICKNAME_LABEL = '닉네임';

export const EMAIL_PLACEHOLDER = '이메일';
export const VERIFICATION_CODE_PLACEHOLDER = '인증 코드';
export const PASSWORD_PLACEHOLDER = '비밀번호';
export const PASSWORD_CONFIRM_PLACEHOLDER = '비밀번호 다시 입력';
export const NICKNAME_PLACEHOLDER = '닉네임';

export const EMAIL_HELPER = '회원가입에 사용할 이메일이에요';
export const PASSWORD_HELPER = '영문 대/소문자, 숫자, 특수문자 포함 8자 이상';
export const NICKNAME_HELPER = '특수문자 없이 2~12자';

export const EMAIL_VERIFY_LABEL = '인증';
export const EMAIL_RESEND_LABEL = '재전송';
export const CODE_CONFIRM_LABEL = '확인';
export const CODE_VERIFIED_LABEL = '인증 완료';
export const NICKNAME_CHECK_LABEL = '중복 확인';
export const NICKNAME_AVAILABLE_LABEL = '사용 가능';
export const SIGNUP_BUTTON_LABEL = '회원가입';

export const INVALID_EMAIL_MESSAGE = '올바른 이메일 형식을 입력해주세요.';
export const CODE_REQUIRED_MESSAGE = '이메일에 발송된 인증 코드를 입력해주세요.';
export const INVALID_PASSWORD_MESSAGE =
  '비밀번호는 영문 대문자, 소문자, 숫자, 특수문자를 포함하여 8자 이상 입력해주세요.';
export const PASSWORD_MISMATCH_MESSAGE = '비밀번호가 일치하지 않습니다.';
export const INVALID_NICKNAME_MESSAGE = '닉네임은 특수문자 없이 2자 이상 12자 이하로 입력해주세요.';

export const VERIFICATION_CODE_SENT_MESSAGE = '메일로 인증 코드를 보냈어요. 메일함을 확인해주세요.';
export const EMAIL_VERIFIED_MESSAGE = '이메일 인증이 완료됐어요.';
export const NICKNAME_AVAILABLE_MESSAGE = '사용 가능한 닉네임이에요.';

export const NETWORK_ERROR_MESSAGE = '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';

// TODO 실제 API 붙으면 false로 바꾸고 mock 블록 제거
export const USE_MOCK_API = true;
export const FAKE_LATENCY_MS = 500;
