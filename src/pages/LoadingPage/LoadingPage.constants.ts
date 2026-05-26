// 배경 — 로그인 페이지와 동일 스펙
export const BG_ASPECT_RATIO = 2559 / 5532;

// 네이티브 스플래시 배경과 동일색 — 스플래시 fade-out 중 LoadingPage가 보이기 시작할 때 색 연속성 보장
export const SPLASH_BG_COLOR = '#FF490D';

// 시각 게이트 — 배경이 보인 뒤 흐려짐/글자 등장까지 고정 대기
export const PRE_OVERLAY_DELAY_MS = 500;

// 흐려짐 + 글자 페이드인
export const OVERLAY_FADE_DURATION_MS = 380;
export const WHITE_OVERLAY_OPACITY = 0.5;

// 종료 페이드아웃
export const EXIT_FADE_DURATION_MS = 380;

// COKCOK 6글자 점프 — Spinner의 damped sine 패턴을 6글자로 확장
export const LETTER_COUNT = 6;
export const LETTER_HEIGHT = 44;       // 화면상 픽셀 높이 (가로는 원본 비율 유지)
export const LETTER_GAP = 4;           // 글자 사이 horizontal margin (양쪽)
export const LETTER_JUMP_HEIGHT = -16; // 음수: 위로

export const LETTER_BOUNCE_DURATION_MS = 600;
export const LETTER_STAGGER_MS = 130;
export const LETTER_PAUSE_AFTER_ALL_MS = 320;
export const LETTER_PER_LETTER_PAUSE_MS =
  LETTER_STAGGER_MS * (LETTER_COUNT - 1) + LETTER_PAUSE_AFTER_ALL_MS;
export const LETTER_CYCLE_MS = LETTER_BOUNCE_DURATION_MS + LETTER_PER_LETTER_PAUSE_MS;

// 글자 원본 비율 (압축 전 원본 W/H — 아래 값은 가공 전 원본 dimensions에 맞춰 픽셀 정확)
export const LETTER_C_RATIO = 591 / 675;
export const LETTER_O_RATIO = 687 / 672;
export const LETTER_K_RATIO = 576 / 918;
