const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

const retryBanks = [
  ['대항해시대', 'learning/inquiry/age-of-exploration/server.js', /incorrectIndexes/],
  ['독해', 'learning/literacy-numeracy/reading/app.js', /다시 생각하고 다른 답을 골라보세요/],
  ['맞춤법', 'learning/literacy-numeracy/spelling/app.js', /다시 생각하고 다른 답을 골라보세요/],
  ['속담', 'learning/literacy-numeracy/proverbs/app.js', /다시 생각하고 다른 답을 골라보세요/],
  ['한자성어', 'learning/literacy-numeracy/classical-chinese-idioms/app.js', /다른 답을 골라보세요/],
  ['어휘', 'learning/literacy-numeracy/vocabulary/app.js', /다시 생각하고 다른 그림을 골라보세요/],
  ['국내 지도(지리·유물·유적)', 'learning/inquiry/korea-map/app.js', /다시 생각하고 다른 답을 골라보세요/],
  ['주기율표', 'learning/inquiry/periodic-table/app.js', /다시 생각하고 다른 답을 골라보세요/],
  ['지진파와 진앙', 'learning/inquiry/science-lab/earthquake/app.js', /다시 생각하고 다른 답을 골라보세요/],
  ['용해도', 'learning/inquiry/science-lab/solubility/app.js', /다시 생각하고 다른 답을 골라보세요/],
  ['별과 별자리', 'learning/inquiry/space/constellations/app.js', /다시 생각하고 다른 답을 골라보세요/],
  ['지구와 달', 'learning/inquiry/space/earth-moon/app.js', /다시 생각하고 다른 답을 골라보세요/],
  ['태양계', 'learning/inquiry/space/solar-system/app.js', /다시 생각하고 다른 답을 골라보세요/],
  ['클래식 음악', 'learning/arts/classical-music/app.js', /다시 생각하고 다른 답을 골라보세요/],
  ['음악', 'learning/arts/music-studio/app.js', /다시 들어보세요/],
  ['미술 감상', 'learning/arts/art-appreciation/museum/museum.js', /다시 생각하고 다른 답을 골라보세요/]
];

for (const [name, file, retryPattern] of retryBanks) {
  assert.match(read(file), retryPattern, `${name}: 오답 뒤 정답을 다시 고르는 흐름이 필요합니다.`);
}

assert.doesNotMatch(
  read('learning/literacy-numeracy/reading/app.js'),
  /feedback\.textContent = `\$\{correct \? "정답 · " : "오답 · "\}/,
  '독해 문제는 첫 오답에 해설을 공개하면 안 됩니다.'
);
assert.doesNotMatch(
  read('learning/inquiry/periodic-table/app.js'),
  /아쉽네요! 정답은/,
  '주기율표 문제는 첫 오답에 정답을 공개하면 안 됩니다.'
);
assert.doesNotMatch(
  read('learning/inquiry/space/solar-system/app.js'),
  /오답입니다\. 정답은/,
  '태양계 문제는 첫 오답에 정답을 공개하면 안 됩니다.'
);

console.log(`non-math choice retry contract: ${retryBanks.length} banks validated`);
