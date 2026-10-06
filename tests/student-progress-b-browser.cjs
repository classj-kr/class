// 학습 진도를 브라우저가 아니라 계정별 서버 저장 공간에 두는지 실제 화면으로 확인한다(예술·탐구 묶음 B).
// 앱마다: 로그인 계정으로 진도가 남는 가장 작은 행동을 하고 → 서버에 있고 브라우저(localStorage)에는 없고
// → 다른 브라우저에서 같은 계정으로 열면 되살아나고 → 게스트는 같은 행동을 해도 어디에도 남지 않는지 본다.
// 대상: 청음(ear-training), 조형 원리(design-principles), 클래식(classical-music), 미술관(museum), 조각 공원(park), 지구본 학습(atlas).
// 음악 작업실(music-studio)은 어느 쪽도 불러 쓰지 않는 파일이라(index.html 이 청음으로 넘김) 화면 검사가 없다.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { startHarness } = require('./site-storage-harness.cjs');
const { chromium } = require('../game-hub-server/node_modules/playwright');

const root = path.resolve(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const LEGACY_KEYS = ['earTraining.v2', 'art-composition-studio-v2', 'classics-bank-progress-v1', 'museumFinaleRoomsV2', 'parkFinaleStampV1', 'classj-atlas-progress-2022-v1', 'musicLabPractice'];
const legacyKeys = (page) => page.evaluate((keys) => Object.keys(localStorage).filter((k) => keys.includes(k)), LEGACY_KEYS);
const errors = [];

// waitForFunction 에 async 함수를 주면 Promise 자체가 참으로 잡히므로 직접 되풀이해 묻는다.
async function waitFor(label, fn, timeoutMs = 15000) {
  const until = Date.now() + timeoutMs;
  let last;
  while (Date.now() < until) {
    last = await fn();
    if (last) return last;
    await new Promise((r) => setTimeout(r, 150));
  }
  throw new Error(`기다리다 지쳤다: ${label}`);
}
async function rowCount(h) { return (await h.db.query('SELECT COUNT(*)::int AS n FROM user_storage')).rows[0].n; }

async function openPage(browser, h, url, { signedIn, before } = {}) {
  const context = await browser.newContext({ viewport: { width: 900, height: 650 } });
  if (signedIn) await context.addCookies([{ name: 'test_user', value: '1', url: h.base }]);
  const page = await context.newPage();
  page.on('pageerror', (e) => errors.push(`${url}: ${e.message}`));
  if (before) { await page.goto(h.base + url); await before(page); }
  await page.goto(h.base + url);
  return { context, page };
}

// 게스트는 같은 행동을 해도 서버 행 수가 늘지 않고 브라우저에도 남지 않아야 한다.
async function asGuest(browser, h, url, act) {
  const before = await rowCount(h);
  const { context, page } = await openPage(browser, h, url, { signedIn: false });
  await act(page);
  await page.waitForTimeout(900);
  assert.deepEqual(await legacyKeys(page), [], `${url}: 게스트의 브라우저에 옛 키가 남았다`);
  assert.equal(await rowCount(h), before, `${url}: 게스트의 진도가 서버에 남았다`);
  await context.close();
}

/* 청음 ------------------------------------------------------------------ */
async function earTraining(browser, h) {
  const url = '/learning/arts/music-theory/ear-training/';
  const openFirstLesson = async (page, nth) => {
    await page.waitForSelector('#courseList .genre-card', { timeout: 15000 });
    await page.locator('#courseList .genre-card').first().click();
    await page.waitForSelector('#lessonList .row-act.is-text', { timeout: 10000 });
    await page.locator('#lessonList .row-act.is-text').nth(nth).click();
    await page.waitForSelector('#lessonScreen:not([hidden])', { timeout: 10000 });
  };
  const marks = (items) => Object.values(items.saved?.progress || {}).flatMap((course) => Object.values(course));

  // 예전 화면이 브라우저에 두었던 기록은 서버로 옮겨지고 브라우저에서는 지워진다.
  const { context, page } = await openPage(browser, h, url, {
    signedIn: true,
    before: (p) => p.evaluate(() => localStorage.setItem('earTraining.v2', JSON.stringify({ stats: { interval: { m3: { right: 2, total: 3 } } }, presets: {}, setup: {}, progress: {} })))
  });
  await page.waitForSelector('#courseList .genre-card', { timeout: 15000 });
  assert.deepEqual(await legacyKeys(page), []);
  await waitFor('청음 옛 기록 옮김', async () => (await h.items('ear-training')).saved?.stats?.interval?.m3?.total === 3);

  await openFirstLesson(page, 0);
  await waitFor('청음 차시 읽음 표시 저장', async () => marks(await h.items('ear-training')).some((mark) => mark.read === true));
  assert.deepEqual(await legacyKeys(page), []);
  await context.close();

  // 다른 브라우저: 서버 기록을 읽은 위에 두 번째 차시를 더하면 두 표시가 모두 남는다(읽지 않았다면 첫 표시가 사라진다).
  const second = await openPage(browser, h, url, { signedIn: true });
  await openFirstLesson(second.page, 1);
  await waitFor('청음 두 차시 표시 합침', async () => marks(await h.items('ear-training')).length === 2);
  assert.equal((await h.items('ear-training')).saved.stats.interval.m3.total, 3, '옮겨 둔 통계도 그대로 있어야 한다');
  await second.context.close();

  await asGuest(browser, h, url, (p) => openFirstLesson(p, 0));
}

/* 조형 원리 작업실 -------------------------------------------------------- */
async function designPrinciples(browser, h) {
  const url = '/learning/arts/art-theory/design-principles/';
  const shapes = (page) => page.evaluate(() => document.querySelectorAll('#canvas [data-object]').length);
  const { context, page } = await openPage(browser, h, url, { signedIn: true });
  await waitFor('작업판 준비', () => shapes(page).then((n) => n === 4));
  await page.click('[data-add="square"]');
  assert.equal(await shapes(page), 5);
  await waitFor('구성 저장', async () => (await h.items('design-principles')).studio?.items?.length === 5);
  assert.equal(await page.textContent('#storageStatus'), '내 계정에 저장됨');
  assert.deepEqual(await legacyKeys(page), []);
  await context.close();

  const second = await openPage(browser, h, url, { signedIn: true });
  await waitFor('다른 브라우저에서 구성 되살림', () => shapes(second.page).then((n) => n === 5));
  await second.context.close();

  await asGuest(browser, h, url, async (p) => {
    await waitFor('작업판 준비(게스트)', () => shapes(p).then((n) => n === 4));
    await p.click('[data-add="square"]');
    assert.match(await p.textContent('#storageStatus'), /저장되지 않습니다/);
  });
}

/* 클래식 음악 감상실 ------------------------------------------------------ */
function classicalAnswers() {
  // 자료 검사(classical-music-data.test.mjs)와 같은 방식으로 문제 자료만 떼어 돌려 정답 글을 얻는다.
  const vm = require('node:vm');
  const source = read('learning/arts/classical-music/app.js');
  const context = vm.createContext({ encodeURIComponent, Math, Set });
  vm.runInContext(`${source.slice(0, source.indexOf('const $=s=>'))}\nglobalThis.__q = allQuestions;`, context);
  return Object.fromEntries(context.__q.map((q) => [q.id, q.answer]));
}
async function classicalMusic(browser, h) {
  const url = '/learning/arts/classical-music/';
  const answers = classicalAnswers();
  const solveQuiz = async (page) => {
    await page.waitForSelector('#new-quiz', { timeout: 10000 });
    await page.selectOption('#quiz-count', '5');
    await page.click('#new-quiz');
    await page.waitForSelector('#quiz-box fieldset', { timeout: 10000 });
    const ids = await page.evaluate(() => [...document.querySelectorAll('#quiz-box fieldset')].map((f) => f.dataset.id));
    for (const id of ids) {
      const picked = await page.evaluate(([qid, answer]) => {
        const field = document.querySelector(`fieldset[data-id="${qid}"]`);
        const label = [...field.querySelectorAll('label')].find((l) => l.textContent.replace(/^\d/, '') === answer);
        if (!label) return false;
        label.querySelector('input').click();
        return true;
      }, [id, answers[id]]);
      assert.ok(picked, `${id}: 정답 보기를 찾지 못했다`);
    }
    await page.click('#check-answer');
    return ids.length;
  };

  const { context, page } = await openPage(browser, h, url, {
    signedIn: true,
    before: (p) => p.evaluate(() => localStorage.setItem('classics-bank-progress-v1', JSON.stringify({ solved: 3, correct: 2, wrong: ['01-1'] })))
  });
  await page.waitForSelector('#new-quiz', { timeout: 10000 });
  assert.deepEqual(await legacyKeys(page), []);
  await waitFor('클래식 옛 기록 옮김 + 화면 반영', async () => (await h.items('classical-music')).progress?.solved === 3 && (await page.textContent('#solved-count')) === '3');
  const count = await solveQuiz(page);
  await waitFor('클래식 풀이 저장', async () => (await h.items('classical-music')).progress?.solved === 3 + count);
  assert.deepEqual(await legacyKeys(page), []);
  await context.close();

  const second = await openPage(browser, h, url, { signedIn: true });
  await waitFor('다른 브라우저에서 푼 문제 수 되살림', () => second.page.textContent('#solved-count').then((t) => t === String(3 + count)));
  assert.equal(await second.page.textContent('#wrong-count'), '1');
  await second.context.close();

  await asGuest(browser, h, url, async (p) => {
    await solveQuiz(p);
    await waitFor('게스트 화면에는 이번 탭 풀이만', () => p.textContent('#solved-count').then((t) => t === '5'));
  });
}

/* 확인 문제 풀이(미술관·조각 공원 공용) ------------------------------------- */
// 화면에 보이는 문제 글/사진으로 정답 보기를 찾아 주는 함수를 받아 다섯 문제를 모두 맞힌다.
async function solveFinale(page, answerFor) {
  for (let step = 0; step < 5; step += 1) {
    await page.waitForSelector('#finale-question-wrap:not([hidden]) #finale-options button', { timeout: 10000 });
    const seen = await page.evaluate(() => ({
      q: document.getElementById('finale-question').textContent,
      image: document.getElementById('finale-artwork').hidden ? null : document.getElementById('finale-artwork-image').getAttribute('src'),
      options: [...document.querySelectorAll('#finale-options button')].map((b) => b.textContent)
    }));
    const answer = answerFor(seen);
    const index = seen.options.indexOf(answer);
    assert.ok(index >= 0, `정답 보기를 찾지 못했다: ${seen.q} → ${answer} / ${seen.options.join(' | ')}`);
    await page.locator('#finale-options button').nth(index).click();
    await page.waitForSelector('#finale-next:not([hidden])', { timeout: 5000 });
    await page.click('#finale-next');
  }
  await page.waitForSelector('#finale-complete:not([hidden])', { timeout: 5000 });
  return page.textContent('#finale-complete-title');
}

/* 미술관 ---------------------------------------------------------------- */
function museumAnswerKey() {
  const source = read('learning/arts/art-appreciation/museum/museum.js');
  const bank = new Map([...source.matchAll(/\{q:'([^']+)',options:\[([^\]]+)\],answer:(\d),explain:'([^']+)'\}/g)]
    .map((m) => [m[1], [...m[2].matchAll(/'([^']+)'/g)].map((o) => o[1])[Number(m[3])]]));
  global.window = {};
  require(path.join(root, 'learning/arts/art-appreciation/museum/art-data.js'));
  const works = global.window.MUSEUM_ROOMS.flatMap((room) => room.works);
  delete global.window;
  const byImage = (src) => works.find((w) => src.endsWith(w.image.split('?')[0]) || w.image.endsWith(src.split('?')[0]));
  return ({ q, image }) => {
    if (q === '이 작품의 제목은 무엇일까요?') return byImage(image).title.replace(/\s*\(.*\)$/, '');
    if (q === '이 작품을 만든 작가는 누구일까요?') return byImage(image).artist.replace(/ 전칭$/, '');
    return bank.get(q);
  };
}
// 첫 전시실 끝의 확인 문제 벽까지 걸어가 화면 가운데(바라보는 곳)를 눌러 연다.
// Enter 는 열린 대화상자의 닫기 단추로 초점이 옮겨 가 바로 닫히는 기존 버릇이 있어 쓰지 않는다.
async function walkToFinale(page) {
  await page.waitForSelector('#loading.done', { timeout: 60000 });
  await page.keyboard.down('ArrowUp');
  try {
    await waitFor('확인 문제 벽 앞', () => page.evaluate(() => !document.getElementById('art-prompt').hidden && document.getElementById('prompt-kicker').textContent === '전시실 확인'), 60000);
  } finally { await page.keyboard.up('ArrowUp'); }
  const size = page.viewportSize();
  await page.mouse.click(size.width / 2, size.height / 2);
  await page.waitForSelector('#finale-modal[open]', { timeout: 5000 });
}
async function museum(browser, h) {
  const url = '/learning/arts/art-appreciation/museum/';
  const answerFor = museumAnswerKey();
  const { context, page } = await openPage(browser, h, url, { signedIn: true });
  await walkToFinale(page);
  assert.equal(await solveFinale(page, answerFor), '관찰의 눈을 얻었어요');
  await waitFor('미술관 도장 저장', async () => (await h.items('museum')).finaleRooms?.portrait === true);
  assert.deepEqual(await legacyKeys(page), []);
  await context.close();

  const second = await openPage(browser, h, url, { signedIn: true });
  await walkToFinale(second.page);
  assert.equal(await second.page.textContent('#finale-complete-title'), '이미 획득한 큐레이터 도장이에요', '다른 브라우저에서 도장이 되살아나야 한다');
  await second.context.close();

  await asGuest(browser, h, url, async (p) => {
    await walkToFinale(p);
    assert.equal(await solveFinale(p, answerFor), '관찰의 눈을 얻었어요');
  });
}

/* 조각 공원 --------------------------------------------------------------- */
function parkAnswerKey() {
  const source = read('learning/arts/art-appreciation/park/park.js');
  const bank = [...source.matchAll(/\{ q: '([^']+)', options: \[([^\]]+)\], answer: (\d)/g)]
    .map((m) => [m[1], [...m[2].matchAll(/'([^']+)'/g)].map((o) => o[1])[Number(m[3])]]);
  const zones = [...source.matchAll(/id: '(\w+)', order: '\d+', title: '([^']+)'[\s\S]*?image: '([^']+)'/g)].map((m) => ({ title: m[2].replace(/\s*\(.*\)$/, ''), image: m[3].replace(/^(\.\.\/)+/, '') }));
  assert.equal(bank.length, 27); assert.equal(zones.length, 9);
  return ({ q, image }) => {
    if (image) return zones.find((z) => image.endsWith(z.image)).title;
    const hit = bank.find(([question]) => q.endsWith(question));
    return hit && hit[1];
  };
}
async function park(browser, h) {
  const url = '/learning/arts/art-appreciation/park/';
  const answerFor = parkAnswerKey();
  const startQuiz = async (page) => {
    await page.waitForSelector('#loading.done', { timeout: 60000 });
    await page.click('#quiz-button');
    await page.waitForSelector('#finale-modal[open]', { timeout: 5000 });
  };

  const { context, page } = await openPage(browser, h, url, {
    signedIn: true,
    before: (p) => p.evaluate(() => localStorage.setItem('parkFinaleStampV1', '1'))
  });
  await page.waitForSelector('#loading.done', { timeout: 60000 });
  assert.deepEqual(await legacyKeys(page), []);
  await waitFor('공원 옛 도장 옮김', async () => (await h.items('park')).finaleStamp === true);
  // 옛 도장이 옮겨졌으니 다시 다 맞히면 "이미 획득" 으로 보인다.
  await startQuiz(page);
  assert.equal(await solveFinale(page, answerFor), '이미 획득한 큐레이터 도장이에요');
  await context.close();

  // 서버 도장을 지운 뒤 새로 받아 보고, 다른 브라우저에서 되살아나는지 본다.
  await h.db.query("DELETE FROM user_storage WHERE app = 'park'");
  const fresh = await openPage(browser, h, url, { signedIn: true });
  await startQuiz(fresh.page);
  assert.equal(await solveFinale(fresh.page, answerFor), '관찰의 눈을 얻었어요');
  await waitFor('공원 도장 저장', async () => (await h.items('park')).finaleStamp === true);
  assert.deepEqual(await legacyKeys(fresh.page), []);
  await fresh.context.close();

  const second = await openPage(browser, h, url, { signedIn: true });
  await startQuiz(second.page);
  assert.equal(await solveFinale(second.page, answerFor), '이미 획득한 큐레이터 도장이에요', '다른 브라우저에서 도장이 되살아나야 한다');
  await second.context.close();

  await asGuest(browser, h, url, async (p) => {
    await startQuiz(p);
    assert.equal(await solveFinale(p, answerFor), '관찰의 눈을 얻었어요');
  });
}

/* 지구본 학습(세계 지도) --------------------------------------------------- */
async function atlas(browser, h) {
  const url = '/learning/inquiry/globe/';
  const { WORLD_QUESTIONS } = await import(path.join(root, 'learning/inquiry/globe/curriculum.mjs').replace(/\\/g, '/').replace(/^([A-Za-z]):/, 'file:///$1:'));
  const byId = Object.fromEntries(WORLD_QUESTIONS.map((q) => [q.id, q]));
  const openLessonQuiz = async (page) => {
    // 목록은 접힌 details 안에 있어 보이지 않으므로 붙어 있는지만 기다리고 직접 누른다.
    await page.waitForSelector('#topicList .topic-item', { state: 'attached', timeout: 20000 });
    await page.evaluate(() => document.querySelector('#topicList .topic-item').click());
    await page.waitForSelector('#lessonPractice', { state: 'attached', timeout: 10000 });
    await page.evaluate(() => document.getElementById('lessonPractice').click());
    await page.waitForSelector('#atlasQuiz[open] [data-answer]', { timeout: 10000 });
    return page.evaluate(() => document.getElementById('quizBody').dataset.questionId);
  };
  // 첫 시도에 틀리고 나서 맞힌다. 틀린 기록이 서버에 남아야 "오답 다시 풀기" 에 나온다.
  const answerWrongThenRight = async (page, qid) => {
    const q = byId[qid];
    assert.ok(q, `${qid}: 문제 자료에 없다`);
    const wrong = [0, 1, 2, 3].find((i) => i !== q.answer);
    await page.evaluate((i) => document.querySelector(`#quizBody [data-answer="${i}"]`).click(), wrong);
    await page.evaluate((i) => document.querySelector(`#quizBody [data-answer="${i}"]`).click(), q.answer);
    await page.waitForSelector('#nextQuestion:not([hidden])', { timeout: 5000 });
  };

  const { context, page } = await openPage(browser, h, url, { signedIn: true });
  const qid = await openLessonQuiz(page);
  await answerWrongThenRight(page, qid);
  await waitFor('지구본 풀이 저장', async () => {
    const p = (await h.items('atlas')).progress;
    return p && p[qid] && p[qid].wrong === 1 && p[qid].correct === 0 && p[qid].lastCorrect === false;
  });
  assert.deepEqual(await legacyKeys(page), []);
  await context.close();

  const second = await openPage(browser, h, url, { signedIn: true });
  await second.page.waitForSelector('#wrongPractice', { state: 'attached', timeout: 20000 });
  await second.page.evaluate(() => document.getElementById('wrongPractice').click());
  await second.page.waitForSelector('#atlasQuiz[open] [data-answer]', { timeout: 10000 });
  assert.equal(await second.page.evaluate(() => document.getElementById('quizBody').dataset.questionId), qid, '다른 브라우저의 오답 다시 풀기에 틀린 문제가 나와야 한다');
  await second.context.close();

  await asGuest(browser, h, url, async (p) => { await answerWrongThenRight(p, await openLessonQuiz(p)); });
}

(async () => {
  const h = await startHarness();
  let browser;
  const only = process.argv.slice(2);
  const suites = { 'ear-training': earTraining, 'design-principles': designPrinciples, 'classical-music': classicalMusic, museum, park, atlas };
  try {
    browser = await chromium.launch({ headless: true, ...(process.platform === 'win32' ? { channel: 'msedge' } : {}) });
    for (const [name, run] of Object.entries(suites)) {
      if (only.length && !only.includes(name)) continue;
      await run(browser, h);
      console.log(`${name}: 서버 저장·브라우저 비움·다른 브라우저 복원·게스트 무저장 확인`);
    }
    assert.deepEqual(errors, [], '화면 오류가 없어야 한다');
    console.log(JSON.stringify({ ok: true, apps: Object.keys(suites).filter((n) => !only.length || only.includes(n)) }));
  } finally {
    if (browser) await browser.close();
    await h.close();
  }
})().catch((error) => { console.error(error); process.exit(1); });
