const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

const checks = [
  ['독해', 'learning/literacy-numeracy/reading/app.js', /shuffle\(item\.choices\.map/],
  ['파닉스', 'learning/literacy-numeracy/phonics/app.js', /options: \[answer, \.\.\.distractorsFor\(answer\)\]\.sort/],
  ['맞춤법', 'learning/literacy-numeracy/spelling/app.js', /choices: shuffle\(question\.choices\)/],
  ['어휘', 'learning/literacy-numeracy/vocabulary/vocabulary-core.js', /choices: shuffleWords\(\[target, \.\.\.distractors\]/],
  ['속담', 'learning/literacy-numeracy/proverbs/app.js', /shuffle\(\[correctIndex, \.\.\.distractors\]\)/],
  ['한자성어', 'learning/literacy-numeracy/classical-chinese-idioms/idioms-core.js', /const options = shuffle\(\[idiom, \.\.\.wrong\]/],
  ['대항해시대', 'learning/inquiry/age-of-exploration/lib/final-quiz.js', /function shuffledQuestion\(source\)/],
  ['국내 지도(지리·유물·유적)', 'learning/inquiry/korea-map/app.js', /const shuffled = shuffle\(question\.options\.map/],
  ['주기율표', 'learning/inquiry/periodic-table/app.js', /\[options\[i\], options\[j\]\] = \[options\[j\], options\[i\]\]/],
  ['지진파와 진앙', 'learning/inquiry/science-lab/earthquake/app.js', /shuffleQuizOptions\(card\)/],
  ['용해도', 'learning/inquiry/science-lab/solubility/app.js', /shuffleQuizOptions\(card\)/],
  ['별과 별자리', 'learning/inquiry/space/constellations/app.js', /const randomizedOptions = item\.opts\.map/],
  ['지구와 달', 'learning/inquiry/space/earth-moon/app.js', /const randomizedOptions = item\.opts\.map/],
  ['태양계', 'learning/inquiry/space/solar-system/app.js', /var shuffled = qObj\.opts\.slice\(\);/],
  ['클래식 음악', 'learning/arts/classical-music/app.js', /const answer=p\[key\], choices=shuffle/],
  ['음악 화음', 'learning/arts/music-studio/app.js', /const choices = Array\.from\(choiceSet\)\.sort/],
  ['음악 전위형', 'learning/arts/music-studio/app.js', /inversions\.forEach\(function \(inversion\)/],
  ['미술 감상', 'learning/arts/art-appreciation/museum/museum.js', /const randomizedChoices=shuffledCopy\(choices\)/]
];

for (const [name, file, pattern] of checks) {
  assert.match(read(file), pattern, `${name}: 보기 무작위 배열이 필요합니다.`);
}

console.log(`non-math choice shuffle contract: ${checks.length} banks validated`);
