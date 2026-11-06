'use strict';
// 국어 순위전 문항 자료: 각 학습 화면이 쓰는 파일을 그대로 읽어 온다.
// 화면용 파일은 window 에 자료를 걸어 두므로, 그런 파일은 vm 안에서 읽는다.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const Questions = require('../learning/literacy-numeracy/korean-race/korean-race-questions');

const SITE_ROOT = path.resolve(__dirname, '..');
const APPS = path.join(SITE_ROOT, 'learning/literacy-numeracy');
const read = (file) => fs.readFileSync(path.join(APPS, file), 'utf8');

function browserGlobals(files) {
  const context = vm.createContext({ window: {} });
  for (const file of files) vm.runInContext(read(file), context, { filename: file, timeout: 3000 });
  return context.window;
}
function attempt(label, load, fallback) {
  try { return load(); }
  catch (error) {
    console.error(`[korean-race] ${label} 자료를 읽지 못했습니다:`, error.message);
    return fallback;
  }
}

function loadSources() {
  return {
    spelling: attempt('맞춤법', () => browserGlobals(['spelling/questions.js', 'spelling/questions-extra.js']).SPELLING_QUESTIONS, []),
    idioms: attempt('한자성어', () => ({
      data: require(path.join(APPS, 'classical-chinese-idioms/idioms-data.js')),
      core: require(path.join(APPS, 'classical-chinese-idioms/idioms-core.js')),
    }), null),
    proverbs: attempt('속담', () => browserGlobals(['proverbs/proverbs-data.js', 'proverbs/proverbs-essential-additions.js', 'proverbs/proverbs-lookalikes.js']).PROVERB_BANKS.ko, []),
    expressions: attempt('관용어', () => require(path.join(APPS, 'idiomatic-expressions/idiomatic-expressions-data.js')), []),
    vocabulary: attempt('영단어', () => JSON.parse(read('vocabulary/assets/data/english-vocabulary-3000-v2.json')).words, []),
  };
}

let pools = null;
function load() {
  if (!pools) pools = Questions.buildPools(loadSources());
  return pools;
}

module.exports = { load, loadSources };
