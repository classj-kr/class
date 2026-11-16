/* 짝 찾기 소재 자료를 각 학습 앱 자료에서 뽑는다. 앱 자료를 고치면 다시 돌린다.
 *   node learning/games/sachunseong/tools/build-subjects.cjs
 * 결과: learning/games/sachunseong/data/<소재>.json  { labels: {단계: 이름}, levels: {단계: [[A, B], ...]} }
 * 영어 단어는 build-english.py 가 따로 만든다.
 */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '../../../..');
const OUT = path.resolve(__dirname, '../data');
const read = rel => fs.readFileSync(path.join(ROOT, rel), 'utf8');

function runScripts(files) {
  const ctx = {};
  ctx.window = ctx;
  ctx.globalThis = ctx;
  ctx.self = ctx;
  vm.createContext(ctx);
  files.forEach(file => vm.runInContext(read(file), ctx, { filename: file }));
  return ctx;
}

function write(name, labels, levels, note) {
  const out = { labels, levels };
  fs.writeFileSync(path.join(OUT, `${name}.json`), JSON.stringify(out));
  const counts = Object.values(levels).map(list => list.length);
  console.log(`${name}: 단계 ${counts.length}개, 짝 ${counts.reduce((a, b) => a + b, 0)}개 (단계마다 ${Math.min(...counts)}~${Math.max(...counts)})${note ? ' · ' + note : ''}`);
}

// 묶음을 차례대로 이어 붙여 한 단계에 size개 안팎이 되게 나눈다.
function chunk(list, size) {
  const groups = [];
  for (let i = 0; i < list.length; i += size) groups.push(list.slice(i, i + size));
  // 마지막 묶음이 너무 작으면 앞 묶음에 붙인다.
  if (groups.length > 1 && groups[groups.length - 1].length < size / 2) groups[groups.length - 2].push(...groups.pop());
  return groups;
}

/* 한자: 진도표(v2/index.html)의 단계마다 차시 쪽에서 글자와 훈음을 읽는다. */
function hanja() {
  const base = 'learning/literacy-numeracy/hanja-meaning/v2';
  const index = read(`${base}/index.html`);
  const labels = {}, levels = {};
  const stages = index.split('<section class="stage">').slice(1);
  stages.forEach((section, k) => {
    const stage = String(k + 1);
    labels[stage] = `${stage}단계`;
    const seen = new Set();
    levels[stage] = [];
    for (const [, lesson] of section.matchAll(/href="\.\/(\d{3})\/"/g)) {
      const html = read(`${base}/${lesson}/index.html`);
      for (const [, ch, huneum] of html.matchAll(/<article class="meaning-card"><h2><span>([^<]+)<\/span>([^<]+)<\/h2>/g)) {
        if (seen.has(ch)) continue;
        seen.add(ch);
        levels[stage].push([ch, huneum.split('/')[0].trim()]); // 「해 년 / 해 연」은 앞의 것
      }
    }
  });
  write('hanja', labels, levels);
}

/* 교과서 단어: 공개한 학기(terms.js)마다 낱말 ↔ 영어. */
function vocab() {
  const base = 'learning/literacy-numeracy/curriculum-vocabulary';
  const terms = runScripts([`${base}/terms.js`]).CurriculumTerms;
  const labels = {}, levels = {};
  let skipped = 0;
  Object.keys(terms).forEach(term => {
    const data = runScripts([`${base}/words-${term}.js`]).CurriculumWords?.[term];
    const list = [];
    const seen = new Set();
    Object.values(data || {}).forEach(subject => (subject.units || []).forEach(unit => (unit.words || []).forEach(word => {
      const w = String(word.w || '').trim(), en = String(word.en || '').trim();
      if (!w || !en || seen.has(w)) return;
      if (w.length > 8 || en.length > 16) { skipped += 1; return; }
      seen.add(w);
      list.push([w, en]);
    })));
    const [grade, half] = term.split('-');
    labels[term] = Number(grade) <= 6 ? `초${grade} ${half}학기` : `중${Number(grade) - 6} ${half}학기`;
    levels[term] = list;
  });
  write('vocab', labels, levels, `긴 것 ${skipped}개 뺌`);
}

/* 고사성어: 배움 차례(차시 묶음)대로 앞 두 글자 ↔ 뒤 두 글자. */
function idioms() {
  const base = 'learning/literacy-numeracy/classical-chinese-idioms';
  const ctx = runScripts([`${base}/idioms-data.js`, `${base}/idioms-lessons-data.js`]);
  const byId = new Map(Object.values(ctx.IDIOM_DATA).map(entry => [entry.id, entry]));
  const ordered = [];
  ctx.IDIOM_LESSONS.forEach(lesson => lesson.ids.forEach(id => { const e = byId.get(id); if (e && !ordered.includes(e)) ordered.push(e); }));
  byId.forEach(e => { if (!ordered.includes(e)) ordered.push(e); });
  const pairs = ordered.filter(e => /^[가-힣]{4}$/.test(e.word)).map(e => [e.word.slice(0, 2), e.word.slice(2)]);
  const labels = {}, levels = {};
  chunk(pairs, 30).forEach((group, k) => { labels[k + 1] = `${k + 1}단계`; levels[k + 1] = group; });
  write('idioms', labels, levels);
}

/* 속담: 낱말 경계에서 앞부분 ↔ 뒷부분으로 나눈다(가운데에 가장 가까운 띄어쓰기). */
function proverbs() {
  const base = 'learning/literacy-numeracy/proverbs';
  const ctx = runScripts([`${base}/proverbs-data.js`, `${base}/proverbs-essential-additions.js`]);
  const list = ctx.PROVERB_BANKS.ko.map(item => (Array.isArray(item) ? item[0] : item.proverb)).filter(Boolean);
  const pairs = [];
  const seen = new Set();
  list.forEach(text => {
    const words = text.trim().split(/\s+/);
    if (words.length < 2 || seen.has(text)) return;
    seen.add(text);
    let best = 1, bestGap = Infinity;
    for (let k = 1; k < words.length; k += 1) {
      const gap = Math.abs(words.slice(0, k).join(' ').length - words.slice(k).join(' ').length);
      if (gap < bestGap) { best = k; bestGap = gap; }
    }
    pairs.push([words.slice(0, best).join(' '), words.slice(best).join(' ')]);
  });
  const labels = {}, levels = {};
  chunk(pairs, 30).forEach((group, k) => { labels[k + 1] = `${k + 1}단계`; levels[k + 1] = group; });
  write('proverbs', labels, levels);
}

/* 원소: 중·고등 과학에서 외우는 원소만(1~20번 + 생활 속 금속·할로젠). 101~118번 같은 원소는 교과서에 나오지 않는다. */
function elements() {
  const ctx = runScripts(['learning/inquiry/periodic-table/elements-data.js']);
  const bySymbol = new Map(ctx.ELEMENTS_DATA.map(e => [e.symbol, e]));
  const first20 = ctx.ELEMENTS_DATA.filter(e => e.number <= 20).sort((a, b) => a.number - b.number);
  const everyday = ['Fe', 'Cu', 'Zn', 'Ag', 'Au', 'Pb', 'Hg', 'Sn', 'Ni', 'Pt', 'Mn', 'Cr', 'Br', 'I', 'Ba'].map(s => bySymbol.get(s)).filter(Boolean);
  const pair = e => [e.symbol, e.name];
  const labels = { 1: '1~20번', 2: '1~20번과 생활 속 원소' };
  const levels = { 1: first20.map(pair), 2: [...first20, ...everyday].map(pair) };
  write('elements', labels, levels);
}

/* 나라와 수도: 대륙마다 나라 ↔ 수도. */
function capitals() {
  const data = JSON.parse(read('learning/inquiry/globe/data/capitals.json'));
  const names = {};
  (Array.isArray(data.continents) ? data.continents : Object.entries(data.continents || {}).map(([id, v]) => ({ id, ...(typeof v === 'string' ? { name: v } : v) })))
    .forEach(c => { names[c.id || c.key] = c.name || c.label || c.ko || c.id; });
  const labels = {}, levels = {};
  // 오세아니아는 나라가 적어 판이 안 되니 아시아와 묶는다.
  const merge = { oceania: 'asia' };
  if (names.asia && names.oceania) names.asia = `${names.asia}·${names.oceania}`;
  // 북한은 헌법상 나라로 다루지 않는다(사용자 지적, 2026-11-17).
  data.countries.filter(c => c.iso !== 'KP').forEach(c => {
    const key = merge[c.continent] || c.continent;
    if (!levels[key]) { levels[key] = []; labels[key] = names[key] || key; }
    levels[key].push([c.country, c.capital]);
  });
  write('capitals', labels, levels);
}

/* 아바타 영단어: 아바타 그림 ↔ 영어 답(타자 게임 아바타 칸과 같은 목록). 그림 패는 'img:주소|이름'. */
function avatars() {
  const catalog = require(path.join(ROOT, 'assets/avatar-catalog.js'));
  const names = { animal: '동물', food: '음식', object: '물건' };
  const labels = {}, levels = {};
  catalog.items.forEach(item => {
    const key = item.category;
    if (!levels[key]) { levels[key] = []; labels[key] = names[key] || key; }
    levels[key].push([`img:/assets/avatars/${encodeURIComponent(item.key)}|${item.name}`, item.answer]);
  });
  write('avatars', labels, levels);
}

/* 한국사: 수능 필수 키워드 짝(tools/history-pairs.json 원고). 시대마다 한 단계, 끝에 「전체」. */
function history() {
  const src = JSON.parse(fs.readFileSync(path.join(__dirname, 'history-pairs.json'), 'utf8'));
  const labels = {}, levels = {};
  src.eras.forEach((era, k) => { labels[k + 1] = era.label; levels[k + 1] = era.pairs; });
  labels.all = '전체';
  levels.all = src.eras.flatMap(era => era.pairs);
  write('history', labels, levels);
}

fs.mkdirSync(OUT, { recursive: true });
history();
avatars();
hanja();
vocab();
idioms();
proverbs();
elements();
capitals();
