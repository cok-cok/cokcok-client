export const BG_ASPECT_RATIO = 2559 / 5532;
export const PAGE_BG_COLOR = '#FBFAF9';

const LOGO_ASPECT_RATIO = 3858 / 918;
export const LOGO_WIDTH = 160;
export const LOGO_HEIGHT = LOGO_WIDTH / LOGO_ASPECT_RATIO;

export const BRAND_COLOR = '#FD4C06';
export const LINK_TEXT_COLOR = '#6B7280';
export const DIVIDER_COLOR = '#E5E7EB';
export const TAGLINE_COLOR = '#9CA3AF';
export const LINK_SEPARATOR_COLOR = '#D1D5DB';

export const ENTRANCE_DURATION_MS = 380;
export const KEYBOARD_ANIM_DURATION_MS = 180;
export const WHITE_OVERLAY_OPACITY = 0.5;

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const TAGLINE = '내 손 안의 레시피, 콕콕';
export const EMAIL_PLACEHOLDER = 'Email';
export const PASSWORD_PLACEHOLDER = 'Password';
export const LOGIN_BUTTON_LABEL = '로그인';
export const SIGNUP_BUTTON_LABEL = '회원가입';
export const FIND_EMAIL_LABEL = '이메일 찾기';
export const RESET_PASSWORD_LABEL = '비밀번호 재설정';
export const LINK_SEPARATOR = '|';

export const INVALID_EMAIL_MESSAGE = '올바른 이메일 형식을 입력해주세요.';
export const NETWORK_ERROR_MESSAGE = '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
export const COMING_SOON_DESCRIPTION = '곧 만나보실 수 있습니다.';
export const buildComingSoonMessage = (feature: string) => `${feature}는 아직 준비중이에요`;

// TODO 실제 API 붙으면 이 블록 + 사용처 제거 — 개발 임시 backdoor 계정
export const TEST_EMAIL = 'cokcok.ghw@gmail.com';
export const TEST_PASSWORD = '!Password123';
