// 배경 — 로그인 페이지와 동일 스펙
export const BG_ASPECT_RATIO = 2559 / 5532;

// 페이지 배경색 — 네이티브 스플래시 backgroundColor와 동일. 핸드오프 색 연속 보장.
export const PAGE_BG_COLOR = '#FBFAF9';

// 배경 이미지 페이드인 (splash dismiss + bg image onLoad 후 시작)
export const BG_FADE_DURATION_MS = 380;

// bg가 보인 뒤 흐려짐/글자 등장까지 고정 대기
export const PRE_OVERLAY_DELAY_MS = 500;

// 흐려짐 + 글자 페이드인
export const OVERLAY_FADE_DURATION_MS = 380;
export const WHITE_OVERLAY_OPACITY = 0.5;

// 글자 등장 → 점프 시작까지 고정 대기
export const PRE_JUMP_DELAY_MS = 500;

// 종료 페이드아웃
export const EXIT_FADE_DURATION_MS = 380;

// 점프 시작까지의 총 누적 지연 (bgReady → 첫 글자 점프 시작)
export const JUMP_START_DELAY_MS =
  BG_FADE_DURATION_MS + PRE_OVERLAY_DELAY_MS + OVERLAY_FADE_DURATION_MS + PRE_JUMP_DELAY_MS;

// COKCOK 6글자 점프 — Spinner damped sine 패턴
export const LETTER_COUNT = 6;
export const LETTER_GAP = 4;
export const LETTER_JUMP_HEIGHT = -16; // 음수: 위로

export const LETTER_BOUNCE_DURATION_MS = 600;
export const LETTER_STAGGER_MS = 130;
export const LETTER_PAUSE_AFTER_ALL_MS = 320;
export const LETTER_PER_LETTER_PAUSE_MS =
  LETTER_STAGGER_MS * (LETTER_COUNT - 1) + LETTER_PAUSE_AFTER_ALL_MS;
export const LETTER_CYCLE_MS = LETTER_BOUNCE_DURATION_MS + LETTER_PER_LETTER_PAUSE_MS;

// 글자 크기 — 디자인 원본 기준 가로폭 비율 C:O:K = 197:229:192.
// LETTER_SCALE로 화면 폭에 맞게 일괄 조정 (1=원본, < 1 = 축소).
export const LETTER_SCALE = 0.27;
export const LETTER_C_WIDTH = Math.round(197 * LETTER_SCALE);
export const LETTER_O_WIDTH = Math.round(229 * LETTER_SCALE);
export const LETTER_K_WIDTH = Math.round(192 * LETTER_SCALE);

// 각 글자 원본 비율 (width / height) — height = width / ratio.
// K가 lowercase 'k'라 ascender 있어서 height가 C/O보다 큼 → 정렬은 alignItems: 'flex-end'.
export const LETTER_C_RATIO = 591 / 675;
export const LETTER_O_RATIO = 687 / 672;
export const LETTER_K_RATIO = 576 / 918;
