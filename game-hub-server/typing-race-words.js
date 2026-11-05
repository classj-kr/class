'use strict';
// 타자 연습 화면과 같은 자료(맞춤법 문제 답, 초등 영단어, 속담)에서 레이스 문제를 뽑는다.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const SITE_ROOT = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(SITE_ROOT, file), 'utf8');
const decode = (value) => {
  try { return JSON.parse(`"${value}"`); } catch { return value; }
};

function spellingWords() {
  const words = [];
  for (const file of ['learning/literacy-numeracy/spelling/questions.js', 'learning/literacy-numeracy/spelling/questions-extra.js']) {
    let text = '';
    try { text = read(file); } catch { continue; }
    for (const m of text.matchAll(/\banswer:\s*"((?:\\.|[^"\\])*)"/g)) words.push(decode(m[1]));
    for (const m of text.matchAll(/makeQuestion\(\s*"(?:\\.|[^"\\])*"\s*,\s*"(?:\\.|[^"\\])*"\s*,\s*"(?:\\.|[^"\\])*"\s*,\s*"((?:\\.|[^"\\])*)"/g)) words.push(decode(m[1]));
  }
  return words.filter((w) => /^[\uAC00-\uD7A3]{2,5}$/.test(w));
}

function englishWords() {
  try {
    const data = JSON.parse(read('learning/literacy-numeracy/vocabulary/assets/data/english-vocabulary-3000-v2.json'));
    return data.words
      .filter((item) => item.stageCode === 'elementary' && /^[a-zA-Z]{2,10}$/.test(item.word))
      .map((item) => item.word.toLowerCase());
  } catch { return []; }
}

function proverbs() {
  try {
    const sandbox = { window: {} };
    vm.runInNewContext(read('learning/literacy-numeracy/proverbs/proverbs-data.js'), sandbox, { timeout: 2000 });
    return (sandbox.window.PROVERB_BANKS?.ko || []).map((item) => (Array.isArray(item) ? item[0] : item.proverb)).filter(Boolean);
  } catch { return []; }
}

const FALLBACK = {
  'ko-words': ['나무', '하늘', '바다', '친구', '학교', '사과', '구름', '연필', '노래', '강아지', '고양이', '무지개', '자전거', '도서관', '선생님'],
  'en-words': ['apple', 'happy', 'school', 'friend', 'water', 'music', 'river', 'green', 'tiger', 'smile', 'cloud', 'dream'],
  'ko-sentences': ['티끌 모아 태산', '돌다리도 두들겨 보고 건너라', '가는 말이 고와야 오는 말이 곱다', '세 살 버릇 여든까지 간다'],
};
let pools = null;
function load() {
  if (pools) return pools;
  const found = { 'ko-words': spellingWords(), 'en-words': englishWords(), 'ko-sentences': proverbs() };
  pools = {};
  for (const [mode, list] of Object.entries(found)) {
    const unique = [...new Set(list)];
    pools[mode] = unique.length >= 10 ? unique : FALLBACK[mode];
  }
  return pools;
}

function shuffle(list, random) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
// 모두 같은 순서의 문제를 받는다. 다 쓰면 다시 섞어 이어 붙인다.
function roundItems(mode, count, random = Math.random) {
  const pool = load()[mode] || FALLBACK['ko-words'];
  const items = [];
  while (items.length < count) {
    const next = shuffle(pool, random);
    if (items.length && next[0] === items[items.length - 1]) next.push(next.shift());
    items.push(...next);
  }
  return items.slice(0, count);
}

module.exports = { roundItems, load };
