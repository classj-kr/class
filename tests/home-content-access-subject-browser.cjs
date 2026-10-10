// 홈 화면의 메뉴 공개/잠금 단추를 실제 브라우저로 돌린다. 전담은 같은 단추로 가르치는 반 전부에
// 오늘 하루 열고, 담임은 전담이 열어 둔 묶음을 보되 자기 공개만 껐다 켤 수 있다(닫히지 않는다).
const assert = require('node:assert/strict');
const path = require('node:path');
const express = require('../game-hub-server/node_modules/express');
const { chromium } = require('../game-hub-server/node_modules/playwright');

(async () => {
  const puts = [];
  let scenario = 'subject';
  const access = {
    subject: {
      mode: 'open', enabledPaths: [], ownEnabledPaths: [], openedBySubjectTeachers: {}, globallyDisabledPaths: [],
      hasClassAccess: false, canManage: true, manageScope: 'subject', managedClasses: ['3-1', '3-2', '4-1'], canManageGlobally: false
    },
    homeroom: {
      mode: 'open', enabledPaths: ['/learning/literacy-numeracy/story-books', '/learning/literacy-numeracy/reading'], ownEnabledPaths: [],
      openedBySubjectTeachers: { '/learning/literacy-numeracy/story-books': ['다전담'], '/learning/literacy-numeracy/reading': ['다전담'] },
      globallyDisabledPaths: [], hasClassAccess: true, canManage: true, manageScope: 'homeroom', managedClasses: ['3-1'], canManageGlobally: false
    }
  };
  const me = {
    subject: { signedIn: true, user: { id: 4, name: '다전담', email: 'music@school.test', role: 'teacher' } },
    homeroom: { signedIn: true, user: { id: 2, name: '가교사', email: 'a@school.test', role: 'teacher' } }
  };
  const profiles = {
    subject: [{ name: '다전담', schoolName: '시험학교', teacherType: '전담', grade: null, classNumber: null }],
    homeroom: [{ name: '가교사', schoolName: '시험학교', teacherType: '담임', grade: 3, classNumber: 1 }]
  };
  const app = express();
  app.use(express.json());
  app.get('/api/site/access', (_req, res) => res.json({ mode: 'open' }));
  app.get('/api/auth/me', (_req, res) => res.json(me[scenario]));
  app.get('/api/teacher/profile', (_req, res) => res.json({ profiles: profiles[scenario] }));
  app.get('/api/schools', (_req, res) => res.json({ schools: [] }));
  app.get('/api/home-content-access', (_req, res) => res.json(access[scenario]));
  app.put('/api/teacher/home-content-access', (req, res) => { puts.push(req.body); res.json({ ok: true, ...req.body }); });
  app.use('/api', (_req, res) => res.status(404).json({ error: 'NOT_IN_TEST' }));
  app.use(express.static(path.resolve(__dirname, '..', 'apps')));
  app.use(express.static(path.resolve(__dirname, '..')));
  const server = await new Promise((resolve) => { const s = app.listen(0, '127.0.0.1', () => resolve(s)); });
  const base = `http://127.0.0.1:${server.address().port}`;
  const waitFor = async (page, count) => { for (let i = 0; i < 25 && puts.length < count; i += 1) await page.waitForTimeout(200); assert.equal(puts.length, count); };
  // 서버가 요청을 받은 뒤에도 화면은 응답을 받고 나서야 바뀐다. 글과 속성은 나타날 때까지 기다린다.
  const waitText = (page, pattern) => page.waitForFunction((source) => new RegExp(source).test(document.body.innerText), pattern.source, { timeout: 5000 });
  const waitLocked = (page, selector, value) => page.locator(`${selector}[data-class-locked="${value}"]`).waitFor({ state: 'attached', timeout: 5000 });
  const storyBooks = 'summary[data-content-paths="learning/literacy-numeracy/story-books/|learning/literacy-numeracy/reading/"]';
  let browser;
  try {
    browser = await chromium.launch({ headless: true, ...(process.platform === 'win32' ? { channel: 'msedge' } : {}) });
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const errors = []; page.on('pageerror', (e) => errors.push(e.message));

    // ── 전담: 같은 단추, 가르치는 반 전부에 오늘 하루 ──
    await page.goto(base + '/');
    const button = page.locator('#contentAccessButton');
    await button.waitFor({ state: 'visible', timeout: 10000 });
    assert.equal(await button.textContent(), '🔒 가르치는 3개 반 메뉴 오늘 공개/잠금 설정');
    assert.equal(await button.getAttribute('title'), '3-1, 3-2, 4-1');
    await button.click();
    // 갈래 묶음은 접혀 있어 먼저 '기초학력' 갈래를 편다.
    await page.locator('#category-literacy-toggle').click();
    const control = page.locator(storyBooks);
    assert.equal(await control.getAttribute('data-class-locked'), 'true', '전담이 아직 열지 않은 묶음은 잠겨 보인다');
    await control.click();
    await waitFor(page, 2);
    assert.deepEqual(puts.map((b) => [b.path, b.enabled]).sort(), [
      ['/learning/literacy-numeracy/reading', true], ['/learning/literacy-numeracy/story-books', true]
    ]);
    await waitLocked(page, storyBooks, 'false');
    await waitText(page, /가르치는 3개 반 학생에게 오늘 하루 공개했습니다/);
    await button.click();
    await waitText(page, /가르치는 반 공개 설정을 저장했습니다\. 전담이 연 메뉴는 오늘 밤 자정에 닫힙니다/);
    assert.equal(await button.textContent(), '🔒 가르치는 3개 반 메뉴 오늘 공개/잠금 설정');

    // ── 담임: 전담이 오늘 열어 둔 묶음은 열려 보이고, 담임이 꺼도 학생에게는 열린 채다 ──
    scenario = 'homeroom';
    puts.length = 0;
    await page.goto(base + '/');
    await button.waitFor({ state: 'visible', timeout: 10000 });
    assert.equal(await button.textContent(), '🔒 우리 반 기초학력 메뉴 공개/잠금 설정');
    await button.click();
    await page.locator('#category-literacy-toggle').click();
    assert.equal(await control.getAttribute('data-class-locked'), 'false', '전담이 열어 둔 묶음은 담임에게도 열려 보인다');
    assert.match(await control.getAttribute('title'), /전담 다전담 선생님이 오늘 열어 둠/);
    // 담임의 칸은 비어 있으니 첫 누름은 담임 공개를 켠다.
    await control.click();
    await waitFor(page, 2);
    assert.ok(puts.every((b) => b.enabled === true));
    await waitText(page, /우리 반 학생에게 공개했습니다/);
    assert.equal(await control.getAttribute('title'), null, '담임도 열었으면 전담 표시는 내린다');
    // 다시 누르면 담임 공개만 꺼지고, 전담이 열어 두어 학생에게는 열린 채라는 안내가 뜬다.
    await control.click();
    await waitFor(page, 4);
    assert.ok(puts.slice(2).every((b) => b.enabled === false));
    await waitText(page, /우리 반 공개는 껐지만 전담 다전담 선생님이 오늘 열어 두어 학생에게는 오늘까지 열려 있습니다/);
    assert.equal(await control.getAttribute('data-class-locked'), 'false', '전담이 열어 둔 묶음은 담임이 꺼도 잠기지 않는다');
    assert.match(await control.getAttribute('title'), /전담 다전담 선생님이 오늘 열어 둠/);

    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ ok: true }));
  } finally {
    if (browser) await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
})().catch((error) => { console.error(error); process.exit(1); });
