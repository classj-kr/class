// 교과 단어 원고(JSON)를 검사하고 앱이 읽는 words-<학기>.js 로 묶는다.
// node tools/curriculum-vocabulary/build.mjs 5-2
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const term = process.argv[2] || '5-2';
const here = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'));
const dir = path.join(here, term);
const out = path.resolve(here, '../../learning/literacy-numeracy/curriculum-vocabulary', `words-${term}.js`);
const order = ['국어', '수학', '사회', '과학'];
const after = /^(의|도|만|에서|에게|에|까지|부터|처럼|보다|\(이\)라고|\(이\)라는|\(으\)로|을\/를|이\/가|은\/는|와\/과|인|이다|입니다|한|하고|했|적인)/;
const problems = [];
const data = {};
const codes = { 국어: 'kor', 수학: 'math', 사회: 'soc', 과학: 'sci' };
const picDir = path.resolve(here, '../../learning/literacy-numeracy/curriculum-vocabulary/images', term);
// 그림 명세·영어·설명은 extra/*.json 에 따로 둔다: { 단원 id: { 낱말: { en, beats, explain, img, imgKo } } }
const extra = {};
const extraDir = path.join(dir, 'extra');
// senses-*.json: { 과목 코드: { 단원 id: { 낱말: { senses: [{ mean, use, hanja }] } } } } — 단원 뜻 말고 다른 뜻
const senses = {};
if (fs.existsSync(extraDir)) for (const name of fs.readdirSync(extraDir).filter(n => /^senses.*\.json$/.test(n))) {
  for (const [code, units] of Object.entries(JSON.parse(fs.readFileSync(path.join(extraDir, name), 'utf8')))) {
    for (const [unit, words] of Object.entries(units)) for (const [w, row] of Object.entries(words)) if (row.senses?.length) senses[`${code}/${unit}/${w}`] = row.senses;
  }
}
// rel-*.json: { 과목 코드: { 단원 id: { 낱말: { syn: [{ w, note }], ant, up, down, see } } } } — 이 단원 뜻의 유의어·반의어·상위어·하위어, see 는 견주어 볼 관련 단어(rel-c.json)
const rels = {};
if (fs.existsSync(extraDir)) for (const name of fs.readdirSync(extraDir).filter(n => /^rel.*\.json$/.test(n))) {
  for (const [code, units] of Object.entries(JSON.parse(fs.readFileSync(path.join(extraDir, name), 'utf8')))) {
    for (const [unit, words] of Object.entries(units)) for (const [w, row] of Object.entries(words)) {
      const kept = Object.fromEntries(['syn', 'ant', 'up', 'down', 'see'].filter(k => row[k]?.length).map(k => [k, row[k]]));
      // rel-a·rel-b·rel-c 가 같은 낱말을 나눠 가질 수 있어 칸마다 합친다.
      if (Object.keys(kept).length) {
        const prev = rels[`${code}/${unit}/${w}`] || {};
        rels[`${code}/${unit}/${w}`] = { ...prev, ...Object.fromEntries(Object.entries(kept).map(([k, list]) => [k, [...(prev[k] || []), ...list.filter(row => !(prev[k] || []).some(old => old.w === row.w))]])) };
      }
    }
  }
}
// foils-*.json: { 과목 코드: { 단원 id: { 낱말: [오답 후보 낱말…] } } } — 연습에서 읽어야 가려지는 헷갈리는 오답(같은 과목 낱말)
const foils = {};
if (fs.existsSync(extraDir)) for (const name of fs.readdirSync(extraDir).filter(n => /^foils.*\.json$/.test(n))) {
  for (const [code, units] of Object.entries(JSON.parse(fs.readFileSync(path.join(extraDir, name), 'utf8')))) {
    for (const [unit, words] of Object.entries(units)) for (const [w, list] of Object.entries(words)) if (list?.length) foils[`${code}/${unit}/${w}`] = list;
  }
}
// kor.json 을 먼저, kor-g.json(글자 도식의 칸 글처럼 덧붙이는 파일)을 나중에 읽어 칸마다 덮어쓴다.
// 덧붙임 파일 차례: <과목>.json → <과목>-x.json 같은 화면 글 → <과목>-g/-h.json(도식 칸 글, 언제나 마지막에 이김)
const rank = (name) => /-[gh]\.json$/.test(name) ? 2 : /-[a-z]\.json$/.test(name) ? 1 : 0;
const extraNames = fs.existsSync(extraDir) ? fs.readdirSync(extraDir).filter(n => n.endsWith('.json') && !n.startsWith('senses') && !n.startsWith('rel') && !n.startsWith('foils'))
  .sort((a, b) => rank(a) - rank(b) || a.localeCompare(b)) : [];
for (const name of extraNames) {
  const code = name.replace(/(-[a-z])?\.json$/, '');
  for (const [unit, words] of Object.entries(JSON.parse(fs.readFileSync(path.join(extraDir, name), 'utf8')))) {
    for (const [w, row] of Object.entries(words)) extra[`${code}/${unit}/${w}`] = { ...extra[`${code}/${unit}/${w}`], ...row };
  }
}
// 그림 파일 이름: <과목>-<단원>-<두 자리 차례>. 파일 크기·시각으로 버전을 붙인다(서버가 그림을 오래 캐시한다).
const picOf = (code, unit, index) => {
  const id = `${code}-${unit}-${String(index + 1).padStart(2, '0')}`;
  const file = path.join(picDir, id + '.webp');
  if (!fs.existsSync(file)) return null;
  const st = fs.statSync(file);
  return `${id}.webp?v=${(st.size % 100000).toString(36)}${Math.floor(st.mtimeMs / 1000).toString(36)}`;
};

// 수와 단위 사이 빈칸은 줄이 바뀌지 않는 빈칸으로 바꾼다('8 cm'가 '8 / cm'로 갈라지지 않게).
const unitGap = /(\d) (km²|cm²|m²|km|cm|mm|m|kg|g|mL|L|℃|%)(?![A-Za-z])/g;
const glue = (v) => typeof v === 'string' ? v.replace(unitGap, '$1\u00a0$2') : Array.isArray(v) ? v.map(glue) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, glue(x)])) : v;

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
  const code = codes[book.subject];
  data[book.subject] = {
    book: book.book,
    units: book.units.map(unit => ({
      id: unit.id,
      title: unit.title,
      words: unit.words.map((word, index) => {
        const more = extra[`${code}/${unit.id}/${word.w}`] || {};
        // 설명은 줄마다 이름표(한자 뜻·생활 속 예·꼭 알기)로 시작하고(견주는 말은 관련 단어 칸으로), 셋 이하·이름표 뺀 글 130자 이하.
        const explainRows = more.explain || word.explain || [];
        const bodyLength = explainRows.reduce((sum, line) => sum + line.replace(/^(쉬운 뜻|낱말 나누기|한자 뜻|생활 속 예): /, '').length, 0);
        if (explainRows.length > 3) problems.push(`${book.subject} ${unit.id} ${word.w}: 설명 줄이 셋보다 많음`);
        if (bodyLength > 160) problems.push(`${book.subject} ${unit.id} ${word.w}: 설명이 너무 김(${bodyLength}자)`);
        for (const line of explainRows) if (/^[^:]{1,6}: /.test(line) && !/^(쉬운 뜻|낱말 나누기|한자 뜻|생활 속 예): /.test(line)) problems.push(`${book.subject} ${unit.id} ${word.w}: 쓰지 않는 설명 이름표 — ${line.slice(0, 30)}`);
        if (explainRows.some(line => line.includes('헷갈'))) problems.push(`${book.subject} ${unit.id} ${word.w}: 설명에 '헷갈' — 아이에게 헷갈린다고 말하지 않는다`);
        // 한자 훈은 아이가 아는 말로: '글월 문' 말고 '글 문'처럼(옛 훈 목록에 걸리면 고친다).
        const oldReadings = ['글월', '잇닿을', '요긴할', '중매', '성품 성', '간략할', '꾀 계', '본디', '대 대', '써 이', '호걸', '사기그릇', '뭍 ', '부릴', '대개 개'];
        const readings = [...(word.hanja || more.hanja || []).map(h => h[1]), ...explainRows.flatMap(line => [...line.matchAll(/[一-鿿]\(([^)]+)\)/g)].map(m => m[1]))];
        for (const r of readings) if (oldReadings.some(o => r.startsWith(o))) problems.push(`${book.subject} ${unit.id} ${word.w}: 어려운 한자 훈 — ${r}`);
        // 한자는 원고(kor.json 등)에 없으면 덧붙임 파일(-x)의 hanja 를 쓴다.
        const row = { w: word.w, hanja: word.hanja || more.hanja, en: more.en || word.en, mean: word.mean, explain: more.explain || word.explain, use: word.use, blanks: word.blanks, beats: more.beats, senses: senses[`${code}/${unit.id}/${word.w}`], rel: rels[`${code}/${unit.id}/${word.w}`], foils: foils[`${code}/${unit.id}/${word.w}`], pic: picOf(code, unit.id, index) };
        return Object.fromEntries(Object.entries(row).filter(([, v]) => v).map(([k, v]) => [k, k === 'pic' || k === 'en' ? v : glue(v)]));
      })
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
// 학기 목록(terms.js): 앱은 고른 학기의 낱말 파일과 도식 파일만 불러온다. 파일 내용으로 버전을 붙인다.
const appDir = path.dirname(out);
const ver = (file) => crypto.createHash('md5').update(fs.readFileSync(file)).digest('hex').slice(0, 8);
const manifest = {}, preview = {};
// 앱에 내보낼 학기는 terms-ready.json 에 적은 것만(만드는 중인 학기는 빼 두고, ?preview=1 에서만 보인다).
const readyTerms = JSON.parse(fs.readFileSync(path.join(here, 'terms-ready.json'), 'utf8'));
for (const name of fs.readdirSync(appDir).filter(n => /^words-\d-\d\.js$/.test(n)).sort()) {
  const key = name.slice(6, 9);
  const figDir = path.join(appDir, 'figures', key);
  const figures = fs.existsSync(figDir) ? fs.readdirSync(figDir).filter(n => n.endsWith('.js')).sort().map(n => `figures/${key}/${n}?v=${ver(path.join(figDir, n))}`) : [];
  preview[key] = { words: `${name}?v=${ver(path.join(appDir, name))}`, figures };
  if (readyTerms.includes(key)) manifest[key] = preview[key];
}
const termsFile = path.join(appDir, 'terms.js');
fs.writeFileSync(termsFile, `// tools/curriculum-vocabulary/build.mjs 가 만든 학기 목록이다. 직접 고치지 말 것.
window.CurriculumTerms = ${JSON.stringify(manifest, null, 1)};
// 만드는 중인 학기까지(주소에 ?preview=1 을 붙일 때만 씀)
window.CurriculumTermsPreview = ${JSON.stringify(preview, null, 1)};
`);
const indexFile = path.join(appDir, 'index.html');
const html = fs.readFileSync(indexFile, 'utf8');
const nextHtml = html.replace(/terms\.js\?v=[\w-]+/, `terms.js?v=${ver(termsFile)}`);
if (nextHtml !== html) fs.writeFileSync(indexFile, nextHtml);
for (const [name, book] of Object.entries(sorted)) console.log(name, book.units.map(unit => `${unit.id}:${unit.words.length}`).join(' '), '=', book.units.reduce((sum, unit) => sum + unit.words.length, 0));
