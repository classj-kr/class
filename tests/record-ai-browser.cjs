// 생활기록부 화면의 활동 목록 흐름을 실제 브라우저로 돌린다. 키는 서버에 있고 브라우저는
// /api/teacher-ai/generate 만 부르므로, 서버에 (가짜) 제미나이를 붙여 수행평가마다 한 번씩 받아
// 학생별로 잇는지, 한 수행평가가 끝내 실패해도 받은 것은 살리는지, 만든 문장이 계정에 남는지를 본다.
// (주소 바꿔 타기·은퇴 모델·붐빔 재시도는 서버 몫이라 game-hub-server/teacher-ai.test.mjs 가 본다.)
const assert = require('node:assert/strict');
const { startHarness, HttpError } = require('./site-storage-harness.cjs');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const { createTeacherAi } = require('../game-hub-server/teacher-ai');

const VALID_KEY = 'AIzaSyTEST-valid-key-0000000000004321';
const STUDENTS = [{ number: '1', name: '학생 하나' }, { number: '2', name: '학생 둘' }, { number: '3', name: '학생 셋' }];
const FAILING_TOPIC = '도형의 넓이 구하기';
const google = [];
const fetchImpl = async (url, options = {}) => {
  const key = options.headers?.['x-goog-api-key'] || '';
  const body = options.body ? JSON.parse(options.body) : null;
  google.push({ url: String(url), key, body });
  const json = (status, data) => ({ ok: status < 400, status, json: async () => data });
  if (key !== VALID_KEY) return json(403, { error: { message: 'API key not valid' } });
  if (String(url).endsWith('/models')) return json(200, { models: [{ name: 'models/gemini-2.5-flash' }] });
  const text = typeof body?.input === 'string' ? body.input : (body?.contents?.[0]?.parts || []).map((p) => p.text || '').join('');
  // 둘째 수행평가는 어느 주소로 와도 끝내 거절한다(400 은 다시 넣어 보지 않는 오류).
  if (text.includes('[수행평가] ' + FAILING_TOPIC)) return json(400, { error: { message: '흉내: 이 요청은 받지 않습니다.' } });
  const topic = /\[수행평가\] (.+)/.exec(text)?.[1] || '';
  const count = Number(/학생 (\d+)명에게/.exec(text)?.[1] || 1);
  const lines = Array.from({ length: count }, (_, i) => (i + 1) + '. ' + topic + ' 수행평가에서 ' + ['차근차근', '꼼꼼하게', '스스로'][i % 3] + ' 해냄.');
  return json(200, { candidates: [{ content: { parts: [{ text: lines.join('\n') }] } }] });
};

(async () => {
  const recordPlans = new Map();
  const h = await startHarness({
    me: (user) => ({ signedIn: true, isTeacher: true, user: { id: user.id, email: 'teacher@school.test', name: '검증 교사', role: 'teacher' }, membership: null }),
    extraRoutes(app, { pool, userOf }) {
      const requireTeacher = async (req) => { const user = userOf(req); if (!user) throw new HttpError(401, 'AUTH_REQUIRED', '로그인'); return { id: user.id, email: 'teacher@school.test' }; };
      const ai = createTeacherAi({ pool, requireTeacher, requireDatabase() {}, HttpError, fetchImpl, warn() {},
        asyncRoute: (fn) => (req, res, next) => Promise.resolve(fn(req, res)).catch(next), secret: { value: 'harness', derived: false } });
      app.use('/api/teacher-ai', (req, res, next) => ai.initialize().then(() => next(), next), ai.router);
      app.get('/api/teacher/available-classes', (_req, res) => res.json({ classes: [{ id: 1, grade: 6, classNumber: 2, isMyTeaching: false }] }));
      app.get('/api/teacher/groups', (_req, res) => res.json({ groups: [] }));
      app.get('/api/teacher/class', (_req, res) => res.json({ classroom: { grade: 6, classNumber: 2, students: STUDENTS } }));
      // 수행평가 이름은 학년이 함께 쓰는 서버 목록(record-plan)에 남는다. 흉내는 메모리에 둔다.
      const recordKey = (q) => [q.year, q.grade, q.area, q.semester, q.subject].map(String).join('|');
      app.get('/api/teacher/record-plan', (req, res) => res.json(recordPlans.get(recordKey(req.query)) || { items: '', updatedAt: null, updatedByName: '' }));
      app.put('/api/teacher/record-plan', (req, res) => { recordPlans.set(recordKey(req.body), { items: req.body.items, updatedAt: new Date().toISOString(), updatedByName: '검증 교사' }); res.json({ ok: true, updatedAt: new Date().toISOString() }); });
      app.get('/api/teacher/assessment-plans', (_req, res) => res.json({ items: [] }));
    }
  });
  let browser;
  try {
    browser = await chromium.launch({ headless: true, ...(process.platform === 'win32' ? { channel: 'msedge' } : {}) });
    const context = await browser.newContext({ viewport: { width: 1200, height: 900 } });
    await context.addCookies([{ name: 'test_user', value: '1', url: h.base }]);
    const page = await context.newPage();
    const errors = []; page.on('pageerror', (e) => errors.push(e.message));
    const dialogs = [];
    page.on('dialog', (d) => { dialogs.push({ type: d.type(), message: d.message() }); return d.accept(); });
    await page.goto(h.base + '/classtools/record-ai.html');
    await page.locator('#sub-input').waitFor();
    await page.locator('#roster-status').filter({ hasText: '3명' }).waitFor({ timeout: 10000 });
    await page.locator('#sub-input').selectOption('수학');
    await page.locator('#topics-input').fill('분수의 덧셈과 뺄셈\n' + FAILING_TOPIC);

    // 상시 연결 카드는 없고, 실행할 때 키가 없으면 경고창만 보여 준다.
    assert.equal(await page.locator('#key-card').count(), 0);
    assert.deepEqual(dialogs, [], '화면을 열 때는 경고창을 띄우지 않는다');
    await Promise.all([page.waitForEvent('dialog'), page.locator('#generate-btn').click()]);
    assert.deepEqual(dialogs, [{ type: 'alert', message: 'API 키가 등록되어 있지 않습니다. 내 정보 → AI 설정에서 API 키를 등록해 주세요.' }]);
    assert.equal(new URL(page.url()).pathname, '/classtools/record-ai.html', '작성 중인 화면을 강제로 이동하지 않는다');
    assert.equal(await page.locator('#result-section').isVisible(), false);
    assert.equal(google.length, 0, '키가 없으면 구글에 가지 않는다');
    const put = await page.evaluate(async (k) => (await fetch('/api/teacher-ai/key', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: k }) })).status, VALID_KEY);
    assert.equal(put, 200);
    // 적은 수행평가는 0.8초 뒤에 학년 공유 목록으로 간다. 간 것을 보고 나서 다시 연다.
    for (let i = 0; i < 30 && recordPlans.size === 0; i += 1) await page.waitForTimeout(200);
    assert.equal(recordPlans.size, 1, '학년이 함께 쓰는 목록에 저장돼야 한다');
    await page.reload();
    await page.locator('#roster-status').filter({ hasText: '3명' }).waitFor({ timeout: 10000 });
    await page.locator('#sub-input').selectOption('수학');
    await page.locator('#plan-status').filter({ hasText: '검증 교사 선생님이' }).waitFor({ timeout: 10000 });
    assert.equal(await page.locator('#topics-input').inputValue(), '분수의 덧셈과 뺄셈\n' + FAILING_TOPIC, '적어 둔 수행평가는 학년 목록에서 되살아난다');

    await page.locator('#generate-btn').click();
    await page.locator('#result-section').waitFor({ state: 'visible', timeout: 20000 });
    await page.locator('#gen-status').filter({ hasText: '받지 못해 빠졌습니다' }).waitFor({ timeout: 20000 });
    assert.match(await page.locator('#gen-status').innerText(), /「도형의 넓이 구하기」은\(는\) 받지 못해 빠졌습니다/);
    const texts = await page.locator('#result-list textarea').evaluateAll((els) => els.map((e) => e.value));
    assert.equal(texts.length, 3, '학생마다 한 칸');
    for (const text of texts) assert.match(text, /^분수의 덧셈과 뺄셈 수행평가에서 (차근차근|꼼꼼하게|스스로) 해냄\.$/, '실패한 수행평가만 빠지고 나머지는 산다: ' + text);
    assert.equal(new Set(texts).size, 3, '세 학생의 문장이 서로 다르다');
    const labels = await page.locator('#result-list strong').evaluateAll((els) => els.map((e) => e.textContent));
    assert.deepEqual(labels, ['1번 학생 하나', '2번 학생 둘', '3번 학생 셋']);
    const prompts = google.filter((c) => typeof c.body?.input === 'string').map((c) => c.body.input);
    assert.match(prompts[0], /2학기 수학 과목별 학기말 종합의견|1학기 수학 과목별 학기말 종합의견/);
    assert.match(prompts[0], /학생 3명에게/);
    assert.ok(google.every((c) => c.key === VALID_KEY), '구글에는 서버가 등록된 키로 간다');

    // 「전체 복사」 글 머리에는 칸·학기·과목이 적힌다(크롬 확장이 나이스 화면과 대조한다).
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.locator('#copy-btn').click();
    // 윈도 클립보드는 줄 끝에 CR 을 붙인다.
    const copied = (await page.evaluate(() => navigator.clipboard.readText())).replace(/\r\n/g, '\n');
    assert.match(copied, /^칸: 과목별 학기말 종합의견\n학기: [12]학기\n과목: 수학\n\n1번 학생 하나\n분수의 덧셈과 뺄셈/);

    // 다시 열어도 만든 문장이 그대로다(계정의 서버 저장 공간).
    await page.reload();
    await page.locator('#roster-status').filter({ hasText: '3명' }).waitFor({ timeout: 10000 });
    await page.locator('#sub-input').selectOption('수학');
    await page.locator('#result-section').waitFor({ state: 'visible', timeout: 10000 });
    assert.deepEqual(await page.locator('#result-list textarea').evaluateAll((els) => els.map((e) => e.value)), texts);
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ ok: true, googleCalls: google.length }));
  } finally {
    if (browser) await browser.close();
    await h.close();
  }
})().catch((error) => { console.error(error); process.exit(1); });
