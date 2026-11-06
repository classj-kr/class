// 글씨 쓰기 글감: 속담·한자성어·관용어 학습 자료에서 쓸 문구와 뜻을 뽑아
// learning/literacy-numeracy/handwriting/writing-texts.js 로 만든다.
// 다른 수업 메뉴가 잠겨 있어도 글씨 쓰기 화면이 쓸 수 있도록 글씨 쓰기 폴더 안에 둔다.
// 다시 만들기: node scripts/build-handwriting-texts.cjs
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const MAX_LETTERS = 24; // 원고지 두세 줄 안에 들어오는 길이

// 문장 부호는 빼고, 남은 글자가 한글과 띄어쓰기뿐일 때만 쓴다(채점 글꼴이 한글만 다룬다).
function clean(text) {
  const plain = String(text || '').replace(/[.,!?·'"“”‘’…~()\-]/g, ' ').replace(/\s+/g, ' ').trim();
  if (!/^[가-힣 ]+$/.test(plain)) return null;
  const letters = plain.replace(/ /g, '').length;
  return letters >= 2 && letters <= MAX_LETTERS ? plain : null;
}
function collect(list) {
  const seen = new Set(), out = [];
  for (const [text, meaning] of list) {
    const t = clean(text);
    if (!t || seen.has(t)) continue;
    seen.add(t);
    out.push([t, String(meaning || '').trim()]);
  }
  return out;
}

const sandbox = { window: {} };
vm.runInNewContext(read('learning/literacy-numeracy/proverbs/proverbs-data.js'), sandbox, { timeout: 5000 });
const proverbs = collect((sandbox.window.PROVERB_BANKS?.ko || []).map((p) => [p.proverb, p.meaning]));
const idioms = collect(require(path.join(root, 'learning/literacy-numeracy/classical-chinese-idioms/idioms-data.js')).map((p) => [p.word, p.meaning]));
const expressions = collect(require(path.join(root, 'learning/literacy-numeracy/idiomatic-expressions/idiomatic-expressions-data.js')).map((p) => [p.expression, p.meaning]));

const data = { proverbs, idioms, expressions };
const body = `// 자동 생성: node scripts/build-handwriting-texts.cjs (직접 고치지 마세요)
// 속담·한자성어·관용어 학습 자료의 문구와 뜻. [쓸 문구, 뜻]
window.HANDWRITING_TEXTS = ${JSON.stringify(data, null, 0).replace(/\],\[/g, '],\n[')};
`;
fs.writeFileSync(path.join(root, 'learning/literacy-numeracy/handwriting/writing-texts.js'), body);
console.log(Object.fromEntries(Object.entries(data).map(([k, v]) => [k, v.length])));
