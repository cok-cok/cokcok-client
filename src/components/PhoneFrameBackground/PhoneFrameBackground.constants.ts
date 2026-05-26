// 큰 화면(폴드 펼침, 태블릿 등)에서도 컨텐츠가 휴대폰 폭으로 가운데 정렬되도록 캡.
// 휴대폰(가로 360~430)에선 화면 폭이 이 값보다 작아 항상 화면 전체를 사용.
export const PHONE_MAX_WIDTH = 480;

// 외곽 letterbox 영역에 깔리는 같은 bg 이미지의 블러 강도. 0~100 (RN Image blurRadius).
// 강한 블러로 디테일 없애고 컬러 무드만 깔려 컬럼이 도드라지게.
export const PHONE_BLUR_RADIUS = 30;
