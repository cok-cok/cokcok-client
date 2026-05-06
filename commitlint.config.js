/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 한글 subject 허용 (기본은 lower-case 강제)
    'subject-case': [0],
    // type-enum: config-conventional이 이미 feat, fix, docs, chore, refactor, style, test, build, ci, perf, revert를 포함
  },
};
