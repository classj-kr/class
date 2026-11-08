// 교과 단어 원고(JSON)를 검사하고 앱이 읽는 words-<학기>.js 로 묶는다.
// node tools/curriculum-vocabulary/build.mjs 5-2
import fs from 'node:fs';
import path from 'node:path';

const term = process.argv[2] || '5-2';
const here = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'));
const dir = path.join(here, term);
const out = path.resolve(here, '../../learning/literacy-numeracy/curriculum-vocabulary', `words-${term}.js`);
const order = ['국어', '수학', '사회', '과학'];
const after = /^(의|도|만|에서|에게|에|까지|부터|처럼|보다|\(이\)라고|\(이\)라는|\(으\)로|을\/를|이\/가|은\/는|와\/과|인|이다|입니다)/;
const problems = [];
const data = {};

for (const file of fs.readdirSync(dir).filter(name => name.endsWith('.json'))) {
  const book = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
  const seen = new Map();
  for (const unit of book.units) {
    for (const word of unit.words) {
      const at = `${book.subject} ${unit.id} ${word.w}`;
      if (seen.has(word.w)) problems.push(`${at}: ${seen.get(word.w)}단원과 겹침`);
      seen.set(word.w, unit.id);
      if (word.mean.includes(word.w)) problems.push(`${at}: 뜻풀이에 낱말이 들어 있음`);
      if (!word.use.includes(word.w)) problems.push(`${at}: 예문에 낱말이 없음`);
      if (!Array.isArray(word.blanks) || word.blanks.length < 2) problems.push(`${at}: 빈칸 문장이 둘보다 적음`);
      for (const text of word.blanks || []) {
        const parts = text.split('{}');
        if (parts.length !== 2) { problems.push(`${at}: {}가 하나가 아님 — ${text}`); continue; }
        const rest = parts[1];
        if (rest && !/^[\s.,?!”’"')]/.test(rest) && !after.test(rest)) problems.push(`${at}: 빈칸 뒤 조사 — ${text}`);
        if (word.w.length > 1 && text.includes(word.w)) problems.push(`${at}: 빈칸 문장에 답이 드러남 — ${text}`);
      }
      for (const text of [word.mean, word.use, ...(word.blanks || [])]) {
        if (/\*\*/.test(text)) problems.push(`${at}: 별표`);
        if (/\d(km|m|cm|mm|kg|g|L|mL|℃|%)(?![a-zA-Z])/.test(text)) problems.push(`${at}: 수와 단위 붙음 — ${text}`);
      }
    }
  }
  data[book.subject] = {
    book: book.book,
    units: book.units.map(unit => ({
      id: unit.id,
      title: unit.title,
      words: unit.words.map(({ w, hanja, en, mean, explain, use, blanks }) => Object.fromEntries(Object.entries({ w, hanja, en, mean, explain, use, blanks }).filter(([, v]) => v)))
    }))
  };
}

if (problems.length) {
  console.log(problems.join('\n'));
  console.log(`문제 ${problems.length}곳 — 고친 뒤 다시 돌린다.`);
  process.exit(1);
}
const sorted = Object.fromEntries(order.filter(name => data[name]).map(name => [name, data[name]]));
const body = `// tools/curriculum-vocabulary/build.mjs 가 ${term} 원고에서 만든 파일이다. 직접 고치지 말 것.\n(function (root) {\n  'use strict';\n  const words = ${JSON.stringify(sorted, null, 1)};\n  root.CurriculumWords = Object.assign(root.CurriculumWords || {}, { '${term}': words });\n  if (typeof module === 'object' && module.exports) module.exports = root.CurriculumWords;\n})(typeof window !== 'undefined' ? window : globalThis);\n`;
fs.writeFileSync(out, body);
for (const [name, book] of Object.entries(sorted)) console.log(name, book.units.map(unit => `${unit.id}:${unit.words.length}`).join(' '), '=', book.units.reduce((sum, unit) => sum + unit.words.length, 0));
