# cokcok

> 요리가 쉬워지는 순간

iOS + Android 네이티브 앱.

## Stack

- Expo SDK 54 / React Native 0.81
- TypeScript / Yarn 4

## Scripts

- `yarn ios` / `yarn android` — 로컬 시뮬레이터·에뮬레이터 빌드
- `yarn lint` / `yarn typecheck` / `yarn format` — 검증
- `yarn release` — semver bump + CHANGELOG + commit + tag

## Deployment

dev / rel / prod 3단계 배포. 자세한 흐름은 `.github/workflows/` 참고.
