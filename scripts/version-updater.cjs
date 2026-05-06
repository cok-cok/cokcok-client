// commit-and-tag-version용 커스텀 updater
// app.json의 expo.version (마케팅 버전, store 노출)을 package.json과 함께 bump
module.exports = {
  readVersion(contents) {
    return JSON.parse(contents).expo.version;
  },
  writeVersion(contents, version) {
    const json = JSON.parse(contents);
    json.expo.version = version;
    return JSON.stringify(json, null, 2) + '\n';
  },
};
