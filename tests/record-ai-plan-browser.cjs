// 생활기록부 화면이 「수행평가 계획」을 읽어 쓰는 흐름을 실제 브라우저로 돌린다. 학년·학기·과목의 계획이
// 있으면 학생마다 단계를 고르는 표가 뜨고, 같은 단계끼리 묶어 (가짜) 제미나이에 그 단계의 평가결과 문장을
// 보내며, 돌아온 문장이 학생마다 계획 순서대로 이어지는지, 고른 단계가 계정에 남는지를 본다.
const assert = require('node:assert/strict');
const { startHarness, HttpError } = require('./site-storage-harness.cjs');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const { createTeacherAi } = require('../game-hub-server/teacher-ai');
const { createAssessmentPlans } = require('../game-hub-server/assessment-plans');

const VALID_KEY = 'AIzaSyTEST-valid-key-0000000000004321';
const STUDENTS = [{ number: '1', name: '학생 하나' }, { number: '2', name: '학생 둘' }, { number: '3', name: '학생 셋' }];
const PLAN = [
  { domain: '문학', standards: [{ code: '6국05-05', text: '자신의 경험을 시, 소설, 극, 수필 등 적절한 갈래로 표현한다.' }], element: '경험을 시로 표현하기', levels: 3,
    criteria: [{ label: '잘함', text: '자신의 경험을 시의 특성을 살려 생생하게 표현한다.' }, { label: '보통', text: '자신의 경험을 시로 표현한다.' }, { label: '노력요함', text: '도움을 받아 자신의 경험을 짧은 시로 표현한다.' }] },
  { domain: '읽기', standards: [], element: '글의 짜임 파악하기', levels: 2,
    criteria: [{ label: '잘함', text: '글의 짜임을 정확히 파악하고 내용을 요약한다.' }, { label: '노력요함', text: '' }] }
];
const google = [];
const fetchImpl = async (url, options = {}) => {
  const key = options.headers?.['x-goog-api-key'] || '';
  const body = options.body ? JSON.parse(options.body) : null;
  google.push({ url: String(url), key, body });
  const json = (status, data) => ({ ok: status < 400, status, json: async () => data });
  if (key !== VALID_KEY) return json(403, { error: { message: 'API key not valid' } });
  if (String(url).endsWith('/models')) return json(200, { models: [{ name: 'models/gemini-2.5-flash' }] });
  // /generate 는 interactions 주소(input)를 먼저 써 보고, 안 되면 generateContent(contents)로 간다.
  const text = typeof body?.input === 'string' ? body.input : (body?.contents?.[0]?.parts || []).map((p) => p.text || '').join('');
  const count = Number(/학생 (\d+)명이 똑같이/.exec(text)?.[1] || 1);
  const result = /\[평가결과\] (.+)/.exec(text)?.[1] || '';
  const lines = Array.from({ length: count }, (_, i) => (i + 1) + '. ' + result.replace(/한다\.$/, '함.') + ' (' + (i + 1) + ')');
  return json(200, { candidates: [{ content: { parts: [{ text: lines.join('\n') }] } }] });
};

(async () => {
  const h = await startHarness({
    me: (user) => ({ signedIn: true, isTeacher: true, user: { id: user.id, email: 'teacher@school.test', name: '검증 교사', role: 'teacher' }, membership: null }),
    extraRoutes(app, { db, pool, userOf }) {
      const requireTeacher = async (req) => { const user = userOf(req); if (!user) throw new HttpError(401, 'AUTH_REQUIRED', '로그인'); return { id: user.id, email: 'teacher@school.test' }; };
      const asyncRoute = (fn) => (req, res, next) => Promise.resolve(fn(req, res)).catch(next);
      const ai = createTeacherAi({ pool, requireTeacher, requireDatabase() {}, HttpError, fetchImpl, warn() {}, asyncRoute, secret: { value: 'harness', derived: false } });
      const plans = createAssessmentPlans({ pool, requireTeacher, requireDatabase() {}, HttpError, asyncRoute,
        async teacherRegistration() { return { id: 101, school_id: 10, school_name: '검증초', grade: 5, class_number: 2, teacher_name: '검증 교사' }; } });
      const semester = (new Date().getMonth() + 1 >= 8 || new Date().getMonth() + 1 <= 1) ? 2 : 1;
      const ready = db.exec("CREATE TABLE classroom_schools(id BIGINT PRIMARY KEY); INSERT INTO classroom_schools VALUES(10); ALTER TABLE classroom_users ADD COLUMN display_name TEXT; CREATE TABLE classroom_teachers(id BIGINT PRIMARY KEY, school_id BIGINT, teaching_scope JSONB); INSERT INTO classroom_teachers VALUES (101, 10, NULL); CREATE TABLE school_master_timetable(id BIGSERIAL PRIMARY KEY, school_id BIGINT, academic_year INTEGER, grade INTEGER, subject_name TEXT, teacher_user_id BIGINT);")
        .then(() => Promise.all([ai.initialize(), plans.initialize()]))
        .then(() => pool.query('INSERT INTO assessment_plans (school_id, academic_year, grade, semester, subject_name, items, updated_by) VALUES ($1,$2,$3,$4,$5,$6::jsonb,1)', [10, new Date().getFullYear(), 5, semester, '국어', JSON.stringify(PLAN)]));
      app.use('/api/teacher-ai', (req, res, next) => ready.then(() => next(), next), ai.router);
      app.use('/api/teacher/assessment-plans', (req, res, next) => ready.then(() => next(), next), plans.router);
      app.get('/api/teacher/available-classes', (_req, res) => res.json({ classes: [{ id: 1, grade: 5, classNumber: 2, isMyTeaching: false }] }));
      app.get('/api/teacher/groups', (_req, res) => res.json({ groups: [] }));
      app.get('/api/teacher/class', (_req, res) => res.json({ classroom: { grade: 5, classNumber: 2, students: STUDENTS } }));
      app.get('/api/teacher/record-plan', (_req, res) => res.json({ items: '', updatedAt: null, updatedByName: '' }));
      app.put('/api/teacher/record-plan', (_req, res) => res.json({ ok: true, updatedAt: new Date().toISOString() }));
    }
  });
  let browser;
  try {
    browser = await chromium.launch({ headless: true, ...(process.platform === 'win32' ? { channel: 'msedge' } : {}) });
    const context = await browser.newContext({ viewport: { width: 1200, height: 900 } });
    await context.addCookies([{ name: 'test_user', value: '1', url: h.base }]);
    const page = await context.newPage();
    const errors = []; page.on('pageerror', (e) => errors.push(e.message));
    page.on('dialog', (d) => d.accept());
    await page.goto(h.base + '/classtools/record-ai.html');
    await page.locator('#sub-input').waitFor();
    await page.locator('#sub-input').selectOption('국어');
    await page.locator('#assess-group').waitFor({ state: 'visible', timeout: 10000 });
    await page.locator('.level-table tbody tr').nth(2).waitFor();
    assert.equal(await page.locator('.level-table tbody tr').count(), 3, '학생마다 한 줄');
    assert.equal(await page.locator('.level-table thead th').count(), 3, '학생 칸 + 수행평가 2개');
    assert.equal(await page.locator('#topics-group').isVisible(), false, '계획이 있으면 활동 목록 칸은 숨긴다');
    assert.match(await page.locator('#assess-status').innerText(), /3명 가운데 0명/);

    // 첫 수행평가는 '모두' 로 잘함을 깔고 2번만 노력요함으로 바꾼다. 둘째 수행평가는 1번만 잘함을 고른다.
    await page.locator('.level-table thead th select.all').nth(0).selectOption('잘함');
    await page.locator('.level-table tbody tr').nth(1).locator('select').nth(0).selectOption('노력요함');
    await page.locator('.level-table tbody tr').nth(0).locator('select').nth(1).selectOption('잘함');
    assert.match(await page.locator('#assess-status').innerText(), /3명 가운데 3명 단계를 골랐습니다\./);

    // 키 없이 누르면 안내만, 키를 넣은 뒤 만든다.
    const put = await page.evaluate(async (k) => (await fetch('/api/teacher-ai/key', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: k }) })).status, VALID_KEY);
    assert.equal(put, 200);
    await page.reload();
    await page.locator('.level-table tbody tr').nth(2).waitFor();
    // 고른 단계가 계정에 남아 다시 열어도 그대로다.
    assert.deepEqual(await page.locator('.level-table tbody tr').nth(1).locator('select').evaluateAll((els) => els.map((e) => e.value)), ['노력요함', '']);
    assert.deepEqual(await page.locator('.level-table tbody tr').nth(0).locator('select').evaluateAll((els) => els.map((e) => e.value)), ['잘함', '잘함']);
    await page.locator('#generate-btn').click();
    await page.locator('#result-section').waitFor({ state: 'visible', timeout: 20000 });
    await page.locator('#gen-status').filter({ hasText: '3명분을 만들었습니다' }).waitFor({ timeout: 20000 });

    // 제미나이에는 (수행평가, 단계) 묶음마다 한 번: 잘함 2명, 노력요함 1명, 둘째 잘함 1명.
    const calls = google.filter((c) => typeof c.body?.input === 'string').map((c) => c.body.input);
    assert.equal(calls.length, 3, '묶음 셋');
    assert.match(calls[0], /학생 2명이 똑같이/);
    assert.match(calls[0], /\[평가결과\] 자신의 경험을 시의 특성을 살려 생생하게 표현한다\./);
    assert.match(calls[0], /\[성취기준\] 자신의 경험을 시, 소설/);
    assert.match(calls[0], /뜻이 같아야 합니다/);
    assert.match(calls[1], /학생 1명이 똑같이/);
    assert.match(calls[1], /도움을 받아 자신의 경험을/);
    assert.match(calls[2], /글의 짜임을 정확히 파악하고/);

    const texts = await page.locator('#result-list textarea').evaluateAll((els) => els.map((e) => e.value));
    assert.equal(texts.length, 3);
    assert.match(texts[0], /^자신의 경험을 시의 특성을 살려 생생하게 표현함\. \(\d\) 글의 짜임을 정확히 파악하고 내용을 요약함\. \(1\)$/, '1번: 첫 수행평가 잘함 + 둘째 잘함, 계획 순서대로');
    assert.match(texts[1], /^도움을 받아 자신의 경험을 짧은 시로 표현함\. \(1\)$/, '2번: 노력요함 문장만');
    assert.match(texts[2], /^자신의 경험을 시의 특성을 살려 생생하게 표현함\. \(\d\)$/, '3번: 첫 수행평가 잘함만');

    // 「활동 목록으로」 로 돌리면 예전 칸이 다시 보인다.
    await page.locator('#mode-list-btn').click();
    assert.equal(await page.locator('#topics-group').isVisible(), true);
    assert.equal(await page.locator('.level-table').count(), 0);
    await page.locator('#mode-plan-btn').click();
    assert.equal(await page.locator('.level-table').count(), 1);

    // 계획이 없는 과목에서는 표가 없고 활동 목록 칸만 있다.
    await page.locator('#sub-input').selectOption('수학');
    await page.locator('#assess-group').waitFor({ state: 'hidden', timeout: 10000 });
    assert.equal(await page.locator('#topics-group').isVisible(), true);
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ ok: true, googleCalls: google.length }));
  } finally {
    if (browser) await browser.close();
    await h.close();
  }
})().catch((error) => { console.error(error); process.exit(1); });
