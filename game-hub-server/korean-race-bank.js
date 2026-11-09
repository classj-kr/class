'use strict';
// 순위전 문항 자료: 각 학습 화면이 쓰는 파일을 그대로 읽어 온다.
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
// 속담 차시는 화면 코드(app.js) 안의 규칙으로 나뉜다. 화면을 띄우지 않고 그 규칙만 받아 온다.
function proverbLessonFor(banks) {
  let config = null;
  const context = vm.createContext({ window: { PROVERB_BANKS: banks }, document: {}, runRecordedLessons: (value) => { config = value; } });
  vm.runInContext(read('proverbs/app.js'), context, { filename: 'proverbs/app.js', timeout: 3000 });
  return config?.lessonFor ? (item, language) => config.lessonFor(item, language) : null;
}
function idiomLessons() {
  const context = vm.createContext({});
  vm.runInContext(read('classical-chinese-idioms/idioms-lessons-data.js'), context, { filename: 'idioms-lessons-data.js', timeout: 3000 });
  return context.IDIOM_LESSONS || [];
}
// 한자 단계 문제는 진도표의 단계마다 문제 풀기 화면(v2/quiz/NN/index.html)에 JSON으로 심겨 있다.
function hanjaStages() {
  const dir = path.join(APPS, 'hanja-meaning/v2/quiz');
  return fs.readdirSync(dir).filter((name) => /^\d+$/.test(name)).sort((a, b) => Number(a) - Number(b)).map((name) => {
    const items = attempt(`한자 ${Number(name)}단계`, () => {
      const html = fs.readFileSync(path.join(dir, name, 'index.html'), 'utf8');
      const block = /<script type="application\/json" id="quiz-data">([\s\S]*?)<\/script>/.exec(html);
      if (!block) throw new Error('문항 묶음(quiz-data)이 없습니다');
      return JSON.parse(block[1]);
    }, []);
    return { stage: Number(name), items };
  });
}
// 낱말만으로는 뜻이 갈려 예문을 다 보여 줄 문항: "목표 한자|정답 낱말"
function hanjaWhole() {
  return new Set(JSON.parse(read('hanja-meaning/race-full-sentence.json')).items.map((item) => `${item.target}|${item.answer}`));
}
// 교과서 단어: 학생 화면에 올린 학기(terms.js 의 CurriculumTerms)의 낱말 파일만 읽는다.
let textbookCache = null;
function textbookBooks() {
  if (textbookCache) return textbookCache;
  const window = browserGlobals(['curriculum-vocabulary/terms.js']);
  const books = {};
  for (const term of Object.keys(window.CurriculumTerms || {})) {
    const context = vm.createContext({ window: {} });
    context.self = context.window;
    vm.runInContext(read(`curriculum-vocabulary/words-${term}.js`), context, { filename: `words-${term}.js`, timeout: 5000 });
    const words = context.window.CurriculumWords?.[term];
    if (words) books[term] = words;
  }
  textbookCache = books;
  return books;
}
// 시험 범위 고르기 화면에 띄울 단원 목록(학기 → 과목 → 단원 이름·낱말 수).
const SUBJECT_CODES = { 국어: 'kor', 수학: 'math', 사회: 'soc', 과학: 'sci' };
let catalogCache = null;
function textbookCatalog() {
  if (catalogCache) return catalogCache;
  const books = attempt('교과서 단어 단원 목록', textbookBooks, {});
  catalogCache = Object.entries(books).sort(([a], [b]) => a.localeCompare(b)).map(([term, subjects]) => ({
    term,
    subjects: Object.entries(subjects).filter(([name]) => SUBJECT_CODES[name]).map(([name, book]) => ({
      code: SUBJECT_CODES[name], name,
      units: (book.units || []).map((unit) => ({ id: String(unit.id), title: unit.title || '', count: (unit.words || []).length })),
    })),
  }));
  return catalogCache;
}
function attempt(label, load, fallback) {
  try { return load(); }
  catch (error) {
    console.error(`[korean-race] ${label} 자료를 읽지 못했습니다:`, error.message);
    return fallback;
  }
}

function loadSources() {
  const spelling = attempt('맞춤법', () => browserGlobals(['spelling/questions.js', 'spelling/questions-extra.js', 'spelling/lessons.js']), {});
  const proverbBanks = attempt('속담', () => browserGlobals(['proverbs/proverbs-data.js', 'proverbs/proverbs-essential-additions.js', 'proverbs/proverbs-lookalikes.js']).PROVERB_BANKS, null);
  return {
    spelling: spelling.SPELLING_QUESTIONS || [],
    spellingLessons: spelling.SPELLING_LESSONS || [],
    idioms: attempt('한자성어', () => ({
      data: require(path.join(APPS, 'classical-chinese-idioms/idioms-data.js')),
      core: require(path.join(APPS, 'classical-chinese-idioms/idioms-core.js')),
      lessons: attempt('한자성어 차시', idiomLessons, []),
    }), null),
    proverbs: proverbBanks?.ko || [],
    proverbLessonFor: proverbBanks ? attempt('속담 차시', () => proverbLessonFor(proverbBanks), null) : null,
    expressions: attempt('관용어', () => require(path.join(APPS, 'idiomatic-expressions/idiomatic-expressions-data.js')), []),
    vocabulary: attempt('영단어', () => JSON.parse(read('vocabulary/assets/data/english-vocabulary-3000-v2.json')).words, []),
    hanja: attempt('한자', hanjaStages, []),
    hanjaWhole: attempt('한자 예문 목록', hanjaWhole, new Set()),
    sentences: attempt('문장 고르기', () => browserGlobals(['sentence-building/curriculum.js']).SENTENCE_COURSE, null),
    textbook: attempt('교과서 단어', textbookBooks, {}),
  };
}

let pools = null;
function load() {
  if (!pools) pools = Questions.buildPools(loadSources());
  return pools;
}

module.exports = { load, loadSources, textbookCatalog };
