// 학생 학습 기록을 브라우저가 아니라 계정별 서버 저장 공간에 두는지 실제 화면으로 확인한다(2026-10-06 결정).
// 네 앱: 타자 연습, 컴퓨터 이론(차시 목록·차시 화면·1차시 교재), 한능검 기출, 국내 지도.
// 각 앱마다 (1) 예전에 브라우저에 두던 기록이 서버로 옮겨지고 브라우저에서 지워지는지,
// (2) 기록을 남기는 가장 작은 조작이 서버에 닿는지, (3) 다른 브라우저에서 같은 계정으로 열면 그대로 보이는지,
// (4) 게스트(로그인 없음)는 서버에도 브라우저에도 아무것도 남기지 않는지 본다.
// 실행: node tests/student-progress-a-browser.cjs
const assert = require('node:assert/strict');
const { startHarness } = require('./site-storage-harness.cjs');
const { chromium } = require('../game-hub-server/node_modules/playwright');

const TYPING = '/learning/inquiry/information-computing/typing/';
const COURSE = '/learning/inquiry/information-computing/computer-fundamentals/';
const HISTORY = '/learning/inquiry/korean-history/';
const MAP = '/learning/inquiry/korea-map/';

// waitForFunction 에 async 함수를 주면 Promise 자체가 참으로 잡혀 바로 끝나므로 직접 되풀이해 묻는다.
async function waitUntil(probe, test, message, timeoutMs = 15000) {
  const until = Date.now() + timeoutMs;
  let last;
  while (Date.now() < until) {
    last = await probe();
    if (test(last)) return last;
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  throw new Error(`${message}\n마지막 값: ${JSON.stringify(last)}`);
}
const localKeys = (page, pattern) => page.evaluate((source) => Object.keys(localStorage).filter((key) => new RegExp(source).test(key)), pattern.source);

(async () => {
  const h = await startHarness();
  const items = (app) => h.items(app);
  const rowCount = async () => (await h.db.query('SELECT COUNT(*)::int AS n FROM user_storage')).rows[0].n;
  const errors = [];
  let browser;
  const open = async (signedIn, url, options) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    if (signedIn) await context.addCookies([{ name: 'test_user', value: '1', url: h.base }]);
    const page = await context.newPage();
    page.on('pageerror', (error) => errors.push(`${url}: ${error.message}`));
    await page.goto(h.base + url, options);
    return page;
  };
  // 게스트가 한 일은 서버에 한 줄도 남지 않아야 한다.
  const expectNothingSaved = async (page, pattern, before) => {
    await page.waitForTimeout(900);   // 모아서 보내는 400ms 를 넉넉히 지나 보낸다
    assert.deepEqual(await localKeys(page, pattern), [], '게스트 쪽 브라우저에 기록이 남으면 안 된다');
    assert.equal(await rowCount(), before, '게스트 쪽은 서버에도 없다');
  };

  try {
    browser = await chromium.launch({ headless: true, ...(process.platform === 'win32' ? { channel: 'msedge' } : {}) });

    // ───────── 타자 연습 ─────────
    {
      const legacy = /^typing-/;
      const page = await open(true, TYPING);
      await page.evaluate(() => {
        localStorage.setItem('typing-records-v1', JSON.stringify({ 'words-ko-all': { mode: 'words', lang: 'ko', filter: 'all', bestSpeed: 200, bestAccuracy: 99, completions: 1, lastDate: '2026-10-01T00:00:00.000Z' } }));
        localStorage.setItem('typing-best-words-ko-all', '200');
        localStorage.setItem('classTypingBgmTrackIndex', '2');   // 기기 설정: 그대로 남아야 한다
      });
      await page.reload();
      // 옮긴 기록으로 첫 화면에 「완료」 딱지가 붙는다.
      await page.waitForSelector('[data-practice-mode="words"] em.completed', { timeout: 15000 });
      await waitUntil(() => items('typing'), (s) => s['typing-records-v1']?.['words-ko-all']?.completions === 1 && s['typing-best-words-ko-all'] === 200, '타자: 예전 기록이 서버로 옮겨져야 한다');
      assert.deepEqual(await localKeys(page, legacy), [], '타자: 옮긴 뒤 브라우저에 남으면 안 된다');
      assert.equal(await page.evaluate(() => localStorage.getItem('classTypingBgmTrackIndex')), '2', '배경 음악 곡 번호는 기기 설정이라 그대로 둔다');

      // 단어 연습 한 판(열 낱말)을 끝내면 이어하기·최근 문제·최고 기록·기록이 모두 서버에 남는다.
      await page.click('[data-practice-mode="words"]');
      await page.waitForSelector('.practice:not([hidden]) #typingInput', { timeout: 20000 });
      await waitUntil(() => items('typing'), (s) => s['typing-current-session-v5']?.mode === 'words' && Array.isArray(s['typing-recent-words-ko-all']), '타자: 이어하기와 최근 문제가 서버에 남아야 한다');
      for (let step = 0; step < 10; step += 1) {
        const target = await page.$eval('#prompt', (node) => [...node.querySelectorAll(':scope > span')].map((span) => span.textContent).join('').replace(/ /g, ' '));
        await page.fill('#typingInput', target);
        await waitUntil(() => page.evaluate(() => ({ step: document.getElementById('stepLabel').textContent, done: !document.getElementById('resultCard').hidden })),
          (view) => view.done || view.step.startsWith(`${step + 2} /`), `타자: ${step + 1}번째 낱말 뒤 다음으로 넘어가야 한다`);
      }
      await page.waitForSelector('#resultCard:not([hidden])');
      await waitUntil(() => items('typing'), (s) => s['typing-records-v1']?.['words-ko-all']?.completions === 2 && s['typing-current-session-v5']?.completed === true && Number(s['typing-best-words-ko-all']) >= 200, '타자: 한 판 결과가 서버에 남아야 한다');
      assert.deepEqual(await localKeys(page, legacy), []);

      // 다른 브라우저, 같은 계정: 「완료」 딱지와 「내 기록」이 그대로다.
      const other = await open(true, TYPING);
      await other.waitForSelector('[data-practice-mode="words"] em.completed', { timeout: 15000 });
      await other.click('#recordsButton');
      await other.waitForSelector('#recordsCard:not([hidden]) .record-row');
      const rows = await other.$$eval('#recordsList .record-row', (nodes) => nodes.map((node) => node.textContent));
      assert.ok(rows.some((row) => row.includes('단어 연습 · 한글') && row.includes('완료 2회')), `타자: 기록 화면에 옮긴 기록이 보여야 한다 ${JSON.stringify(rows)}`);
      assert.deepEqual(await localKeys(other, legacy), []);

      // 게스트
      const before = await rowCount();
      const guest = await open(false, TYPING);
      await guest.click('[data-practice-mode="words"]');
      await guest.waitForSelector('.practice:not([hidden]) #typingInput', { timeout: 20000 });
      const target = await guest.$eval('#prompt', (node) => [...node.querySelectorAll(':scope > span')].map((span) => span.textContent).join(''));
      await guest.fill('#typingInput', target);
      await expectNothingSaved(guest, legacy, before);
    }

    // ───────── 컴퓨터 이론 ─────────
    {
      const legacy = /computer-literacy:|classj:textbook:/;
      // 차시 목록: 예전 완료 기록이 서버로 옮겨지고 목록에 완료로 표시된다.
      const list = await open(true, COURSE);
      await list.evaluate(() => localStorage.setItem('computer-literacy:a03', JSON.stringify({ completed: true, score: 5, updatedAt: '2026-10-01T00:00:00.000Z' })));
      await list.reload();
      await list.waitForSelector('li.is-complete a[href="lessons/?lesson=a03"]', { timeout: 15000 });
      await waitUntil(() => items('computer-literacy'), (s) => s['computer-literacy:a03']?.completed === true, '컴퓨터: 차시 완료 기록이 서버로 옮겨져야 한다');
      assert.deepEqual(await localKeys(list, legacy), []);

      // 차시 화면(a02, 새 교재): 확인 문제 하나를 맞히면 답 확인 기록이 서버에 남는다.
      const lesson = await open(true, COURSE + 'lessons/?lesson=a02');
      // 확인 문제 쪽은 본문 뒤에 숨어 있다. 있는지만 기다리고 스크립트로 답한다.
      await lesson.waitForSelector('#edition form[data-question="3"] input[type="radio"]', { state: 'attached', timeout: 20000 });
      assert.match(await lesson.$eval('.edition-note', (node) => node.textContent), /내 계정에 저장됩니다/);
      await lesson.evaluate(() => {
        const answer = window.COMPUTER_EDITION_DATA.a02.checks[0].answer;
        const form = document.querySelector('#edition form[data-question="3"]');
        form.querySelector(`input[value="${answer}"]`).click();
        form.querySelector('.edition-submit').click();
      });
      await waitUntil(() => items('computer-literacy'), (s) => s['classj:textbook:a02:v1']?.answers?.[3]?.solved === true, '컴퓨터: 답 확인 기록이 서버에 남아야 한다');
      assert.deepEqual(await localKeys(lesson, legacy), []);
      const lessonAgain = await open(true, COURSE + 'lessons/?lesson=a02');
      await lessonAgain.waitForSelector('#edition form[data-question="3"] .edition-feedback', { state: 'attached', timeout: 20000 });
      assert.match(await lessonAgain.$eval('#edition form[data-question="3"] .edition-feedback', (node) => node.textContent), /이전에 해결한 문항입니다/);

      // 1차시 교재(a01): 확인 문제 1번을 맞히면 기록이 서버에 남고, 다른 브라우저에서 「1 / 4 해결」로 보인다.
      const first = await open(true, COURSE + 'textbook/a01.html');
      await first.waitForSelector('#questions .question', { state: 'attached', timeout: 15000 });
      assert.match(await first.$eval('#storageNotice', (node) => node.textContent), /내 계정에 기록됩니다/);
      await first.click('[data-page="check"]');   // 확인 문제 쪽으로 넘어간다
      await first.click('input[name="question-0"][value="1"]');
      await first.click('section[data-question="0"] .answer-check');
      await waitUntil(() => items('computer-literacy'), (s) => s['classj:textbook:a01:v1']?.answers?.[0]?.solved === true, '컴퍼터: 1차시 교재 기록이 서버에 남아야 한다');
      assert.deepEqual(await localKeys(first, legacy), []);
      const firstAgain = await open(true, COURSE + 'textbook/a01.html');
      await waitUntil(() => firstAgain.$eval('#questionCount', (node) => node.textContent), (text) => text === '1 / 4 해결', '컴퓨터: 다른 브라우저에서도 1차시 기록이 보여야 한다');

      // 게스트
      const before = await rowCount();
      const guest = await open(false, COURSE + 'textbook/a01.html');
      await guest.waitForSelector('#questions .question', { state: 'attached', timeout: 15000 });
      assert.match(await guest.$eval('#storageNotice', (node) => node.textContent), /로그인하지 않아/);
      await guest.click('[data-page="check"]');
      await guest.click('input[name="question-0"][value="1"]');
      await guest.click('section[data-question="0"] .answer-check');
      await expectNothingSaved(guest, legacy, before);
    }

    // ───────── 한능검 기출 ─────────
    {
      const legacy = /^hanguksa-/;
      const page = await open(true, HISTORY);
      const [first, second] = await page.evaluate(() => window.HANGUKSA.questions.slice(0, 2).map((q) => q.id));
      await page.evaluate(([mine, theirs]) => {
        // 예전 화면은 이름 꼬리표를 붙여 두었다. 이 학생(검증 학생→검증학생) 것은 옮기고, 다른 이름 것은 지우기만 한다.
        localStorage.setItem('hanguksa-done:' + encodeURIComponent('검증학생'), JSON.stringify({ [mine]: 'right' }));
        localStorage.setItem('hanguksa-done:' + encodeURIComponent('다른아이'), JSON.stringify({ [theirs]: 'wrong' }));
      }, [first, second]);
      await page.reload();
      await waitUntil(() => items('korean-history'), (s) => s['hanguksa-done']?.[first] === 'right', '한능검: 이 학생의 예전 기록이 서버로 옮겨져야 한다');
      assert.deepEqual(await localKeys(page, legacy), []);
      assert.equal((await items('korean-history'))['hanguksa-done'][second], undefined, '다른 이름이 붙은 기록은 옮기지 않는다');

      // 전체 시대를 열어 아직 안 푼 첫 문제에 답한다.
      await page.click('#era-tabs .era-tab');
      await page.waitForSelector('#list .item:not(.is-done) .choice');
      const answered = await page.evaluate(() => {
        const card = document.querySelector('#list .item:not(.is-done)');
        card.querySelector('.choice').click();
        return card.querySelector('.item-src').textContent;
      });
      await waitUntil(() => items('korean-history'), (s) => Object.keys(s['hanguksa-done'] || {}).length === 2, '한능검: 푼 기록이 서버에 남아야 한다');
      assert.deepEqual(await localKeys(page, legacy), []);
      const other = await open(true, HISTORY);
      await other.click('#era-tabs .era-tab');
      await other.waitForSelector('#list .item');
      const doneCards = await other.$$eval('#list .item.is-done .item-src', (nodes) => nodes.map((node) => node.textContent));
      assert.ok(doneCards.includes(answered), `한능검: 다른 브라우저에서도 ${answered} 가 푼 것으로 보여야 한다 ${JSON.stringify(doneCards)}`);

      // 게스트
      const before = await rowCount();
      const guest = await open(false, HISTORY);
      await guest.click('#era-tabs .era-tab');
      await guest.waitForSelector('#list .item .choice');
      await guest.click('#list .item .choice');
      await expectNothingSaved(guest, legacy, before);
    }

    // ───────── 국내 지도 ─────────
    {
      const legacy = /^classj-korea-geography-progress/;
      const page = await open(true, MAP, { waitUntil: 'domcontentloaded' });
      await page.evaluate(() => localStorage.setItem('classj-korea-geography-progress-v2', JSON.stringify({ correct: 3, total: 5, lastScore: 3, lastTotal: 5, items: {} })));
      await page.reload({ waitUntil: 'domcontentloaded' });
      await waitUntil(() => page.$eval('#progressScore', (node) => node.textContent), (text) => text === '3 / 5', '지도: 예전 누적 기록이 화면에 보여야 한다');
      await waitUntil(() => items('korea-map'), (s) => s['classj-korea-geography-progress-v2']?.total === 5, '지도: 예전 기록이 서버로 옮겨져야 한다');
      assert.deepEqual(await localKeys(page, legacy), []);

      // 개념 문제 하나를 맞힌다.
      await page.waitForSelector('#practiceLesson:not([disabled])', { timeout: 20000 });
      await page.click('#practiceLesson');
      await page.waitForSelector('#answerOptions .answer-button');
      await page.evaluate(() => {
        const prompt = document.querySelector('#questionTitle').innerHTML;
        const buttons = [...document.querySelectorAll('#answerOptions .answer-button')];
        const options = buttons.map((button) => button.lastElementChild.textContent);
        const question = window.KOREA_GEOGRAPHY.questions.find((q) => q.prompt === prompt && q.options.every((option) => options.includes(option)));
        buttons.find((button) => button.lastElementChild.textContent === question.options[question.answer]).click();
      });
      await waitUntil(() => items('korea-map'), (s) => s['classj-korea-geography-progress-v2']?.total === 6 && s['classj-korea-geography-progress-v2']?.correct === 4, '지도: 답한 기록이 서버에 남아야 한다');
      assert.equal(await page.$eval('#progressScore', (node) => node.textContent), '4 / 6');
      assert.deepEqual(await localKeys(page, legacy), []);
      const other = await open(true, MAP, { waitUntil: 'domcontentloaded' });
      await waitUntil(() => other.$eval('#progressScore', (node) => node.textContent), (text) => text === '4 / 6', '지도: 다른 브라우저에서도 누적 기록이 보여야 한다');

      // 게스트
      const before = await rowCount();
      const guest = await open(false, MAP, { waitUntil: 'domcontentloaded' });
      await guest.waitForSelector('#practiceLesson:not([disabled])', { timeout: 20000 });
      await guest.click('#practiceLesson');
      await guest.waitForSelector('#answerOptions .answer-button');
      await guest.click('#answerOptions .answer-button');
      await expectNothingSaved(guest, legacy, before);
    }

    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ ok: true, apps: ['typing', 'computer-literacy', 'korean-history', 'korea-map'], rows: await rowCount() }));
  } finally {
    if (browser) await browser.close();
    await h.close();
  }
})().catch((error) => { console.error(error); process.exit(1); });
