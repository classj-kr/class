// 생활기록부 화면의 「계획서에서 가져오기」를 실제 브라우저로 돌린다. 올린 파일이 서버를 거쳐
// (가짜) 제미나이에 가고, 돌아온 목록을 골라 활동·특성 칸에 넣는 흐름과, 키가 없을 때의 안내를 본다.
const assert = require('node:assert/strict');
const { startHarness, HttpError } = require('./site-storage-harness.cjs');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const { createTeacherAi } = require('../game-hub-server/teacher-ai');

const VALID_KEY = 'AIzaSyTEST-valid-key-0000000000004321';
const google = [];
const fetchImpl = async (url, options = {}) => {
  const key = options.headers?.['x-goog-api-key'] || '';
  const body = options.body ? JSON.parse(options.body) : null;
  google.push({ url: String(url), key, body });
  const json = (status, data) => ({ ok: status < 400, status, json: async () => data });
  if (key !== VALID_KEY) return json(403, { error: { message: 'API key not valid' } });
  if (String(url).endsWith('/models')) return json(200, { models: [{ name: 'models/gemini-2.5-flash' }] });
  const text = (body?.contents?.[0]?.parts || []).map((p) => p.text || '').join('');
  const subject = /과목\(영역\): ([^,.\n]+)/.exec(text)?.[1] || '과목';
  const answer = { subject, semester: '1학기', topics: [
    { title: '분수의 덧셈과 뺄셈 계산하기', detail: '2단원' },
    { title: '직사각형과 삼각형의 넓이 구하기', detail: '5단원' },
    { title: '실생활 문제를 식으로 나타내고 해결하기', detail: '' }
  ], note: '' };
  return json(200, { candidates: [{ content: { parts: [{ text: JSON.stringify(answer) }] } }] });
};

(async () => {
  const h = await startHarness({
    me: (user) => ({ signedIn: true, isTeacher: true, user: { id: user.id, email: 'teacher@school.test', name: '검증 교사', role: 'teacher' }, membership: null }),
    extraRoutes(app, { pool, userOf }) {
      const requireTeacher = async (req) => { const user = userOf(req); if (!user) throw new HttpError(401, 'AUTH_REQUIRED', '로그인'); return { id: user.id, email: 'teacher@school.test' }; };
      const feature = createTeacherAi({ pool, requireTeacher, requireDatabase() {}, HttpError, fetchImpl, warn() {},
        asyncRoute: (fn) => (req, res, next) => Promise.resolve(fn(req, res)).catch(next), secret: { value: 'harness', derived: false } });
      app.use('/api/teacher-ai', (req, res, next) => feature.initialize().then(() => next(), next), feature.router);
      app.get('/api/teacher/available-classes', (_req, res) => res.json({ classes: [{ classId: 1, grade: 5, classNumber: 2, label: '5학년 2반', isHomeroom: true, schoolName: '검증초' }] }));
      app.get('/api/teacher/groups', (_req, res) => res.json({ groups: [] }));
      const plans = new Map();
      app.get('/api/teacher/record-plan', (req, res) => { if (process.env.DEBUG_PLAN) console.error('PLAN GET', JSON.stringify(req.query), [...plans.keys()].join(' | ')); return res.json(plans.get(JSON.stringify(req.query)) || { items: '' }); });
      app.put('/api/teacher/record-plan', (req, res) => { if (process.env.DEBUG_PLAN) console.error('PLAN PUT', JSON.stringify(req.body)); plans.set(JSON.stringify({ year: String(req.body.year), grade: String(req.body.grade), area: req.body.area, semester: req.body.semester, subject: req.body.subject }), { items: req.body.items }); res.json({ ok: true, updatedAt: new Date().toISOString() }); });
      app.plans = plans;
    }
  });
  let browser;
  try {
    browser = await chromium.launch({ headless: true, ...(process.platform === 'win32' ? { channel: 'msedge' } : {}) });
    const context = await browser.newContext({ viewport: { width: 1200, height: 900 } });
    await context.addCookies([{ name: 'test_user', value: '1', url: h.base }]);
    const page = await context.newPage();
    const errors = []; page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(h.base + '/classtools/record-ai.html');
    await page.locator('#import-plan-btn').waitFor();

    // 키가 없으면 안내만 한다.
    await page.locator('#import-plan-btn').click();
    await page.locator('#import-plan-status').filter({ hasText: 'API 키를 먼저 등록' }).waitFor({ timeout: 10000 });

    // 키를 등록한 뒤 파일을 올린다(파일 고르기 창 대신 입력칸에 바로 넣는다).
    const put = await page.evaluate(async (key) => (await fetch('/api/teacher-ai/key', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key }) })).status, VALID_KEY);
    assert.equal(put, 200);
    await page.locator('#topics-input').fill('이미 적어 둔 활동');
    await page.locator('#import-plan-file').setInputFiles({ name: '수행평가계획.txt', mimeType: 'text/plain', buffer: Buffer.from('5학년 수학 1학기 수행평가\n1. 분수의 덧셈과 뺄셈\n2. 다각형의 넓이\n3. 실생활 문제', 'utf8') });
    await page.locator('#import-plan-dialog[open]').waitFor({ timeout: 15000 });
    assert.equal(await page.locator('#import-plan-list label').count(), 3);
    assert.match(await page.locator('#import-plan-meta').innerText(), /3개를 찾았습니다/);
    const sent = google.at(-1);
    assert.equal(sent.key, VALID_KEY, '서버가 등록된 키로 구글에 간다');
    assert.match(sent.body.contents[0].parts[0].text, /다각형의 넓이/);
    assert.match(sent.body.contents[0].parts[0].text, /학년: 5학년/);

    // 하나를 빼고 덧붙인다.
    await page.locator('#import-plan-list label').nth(1).locator('input').uncheck();
    await page.locator('#import-plan-append').click();
    assert.equal(await page.locator('#topics-input').inputValue(), '이미 적어 둔 활동\n분수의 덧셈과 뺄셈 계산하기\n실생활 문제를 식으로 나타내고 해결하기');
    assert.match(await page.locator('#import-plan-status').innerText(), /2개를 덧붙였습니다/);
    // 학년이 함께 쓰는 계획(record-plan)에도 입력 이벤트를 타고 저장된다.
    // (waitForFunction 에 async 함수를 주면 약속 자체가 참으로 잡히므로 직접 되풀이해 묻는다.)
    let planItems = '';
    for (let attempt = 0; attempt < 50 && !/실생활 문제를 식으로/.test(planItems); attempt += 1) {
      await page.waitForTimeout(200);
      planItems = await page.evaluate(async () => {
        const query = new URLSearchParams({ year: new Date().getFullYear(), grade: 5, area: 'subject', semester: document.querySelector('#semester-select').value, subject: document.querySelector('#sub-input').value.trim() });
        return ((await (await fetch('/api/teacher/record-plan?' + query)).json()).items) || '';
      });
    }
    assert.match(planItems, /실생활 문제를 식으로/, '학년 공유 계획에 저장돼야 한다');

    // 바꾸기는 기존 줄을 지운다.
    await page.locator('#import-plan-file').setInputFiles({ name: 'plan.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4 fake') });
    await page.locator('#import-plan-dialog[open]').waitFor({ timeout: 15000 });
    assert.equal(google.at(-1).body.contents[0].parts[0].inline_data.mime_type, 'application/pdf', 'PDF 는 파일째 간다');
    await page.locator('#import-plan-replace').click();
    assert.equal(await page.locator('#topics-input').inputValue(), '분수의 덧셈과 뺄셈 계산하기\n직사각형과 삼각형의 넓이 구하기\n실생활 문제를 식으로 나타내고 해결하기');

    // 못 읽는 파일은 안내만.
    await page.locator('#import-plan-file').setInputFiles({ name: 'plan.hwp', mimeType: 'application/octet-stream', buffer: Buffer.from([1, 2, 3]) });
    await page.locator('#import-plan-status').filter({ hasText: 'hwp' }).waitFor({ timeout: 10000 });
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ ok: true, googleCalls: google.length }));
  } finally {
    if (browser) await browser.close();
    await h.close();
  }
})().catch((error) => { console.error(error); process.exit(1); });
