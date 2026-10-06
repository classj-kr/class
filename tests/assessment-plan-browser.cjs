// 수행평가 계획 화면을 실제 브라우저로 돌린다. 교사로 들어가 항목을 만들고 성취기준을 고르면
// 학교가 함께 쓰는 계획(/api/teacher/assessment-plans)에 저장되는지, (가짜) 제미나이로 평가결과 문장
// 초안과 계획서 파일 읽기가 되는지, 생기부 활동 목록으로 넘어가는지, 다시 열어도 남아 있는지를 본다.
const assert = require('node:assert/strict');
const { startHarness, HttpError } = require('./site-storage-harness.cjs');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const { createTeacherAi } = require('../game-hub-server/teacher-ai');
const { createAssessmentPlans } = require('../game-hub-server/assessment-plans');

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
  let answer;
  if (/단계별 평가결과」 문장을 쓴다/.test(text)) {
    const labels = [...text.matchAll(/\{"label":"([^"]+)","text":"…"\}/g)].map((m) => m[1]);
    answer = { criteria: labels.map((label, i) => ({ label, text: '초안 ' + (i + 1) + ': 경험을 알맞은 갈래로 표현할 수 있다.' })) };
  } else {
    answer = { items: [
      { domain: '읽기', codes: ['6국02-01'], element: '글의 짜임 파악하기', levels: 3, criteria: [{ label: '잘함', text: '짜임을 정확히 파악한다.' }, { label: '보통', text: '짜임을 파악한다.' }, { label: '노력요함', text: '도움을 받아 파악한다.' }] },
      { domain: '', codes: ['6국03-02', '9국99-99'], element: '주장하는 글 쓰기', levels: 2, criteria: [] }
    ], note: '' };
  }
  return json(200, { candidates: [{ content: { parts: [{ text: '```json\n' + JSON.stringify(answer) + '\n```' }] } }] });
};

(async () => {
  const recordPlans = new Map();
  const h = await startHarness({
    me: (user) => ({ signedIn: true, isTeacher: true, user: { id: user.id, email: 'teacher@school.test', name: '검증 교사', role: 'teacher' }, membership: null }),
    extraRoutes(app, { db, pool, userOf }) {
      const requireTeacher = async (req) => { const user = userOf(req); if (!user) throw new HttpError(401, 'AUTH_REQUIRED', '로그인'); return { id: user.id, email: 'teacher@school.test' }; };
      const asyncRoute = (fn) => (req, res, next) => Promise.resolve(fn(req, res)).catch(next);
      const ai = createTeacherAi({ pool, requireTeacher, requireDatabase() {}, HttpError, fetchImpl, warn() {}, asyncRoute, secret: { value: 'harness', derived: false } });
      // 계정 1은 5학년 2반 담임, 계정 2는 6학년 영어 전담(교직원 명단의 담당 학년·과목).
      const REGISTRATIONS = {
        1: { id: 101, school_id: 10, school_name: '검증초', grade: 5, class_number: 2, teacher_name: '검증 교사' },
        2: { id: 102, school_id: 10, school_name: '검증초', grade: null, class_number: null, teacher_name: '영어 전담' }
      };
      const plans = createAssessmentPlans({ pool, requireTeacher, requireDatabase() {}, HttpError, asyncRoute,
        async teacherRegistration(user) { return REGISTRATIONS[user.id] || null; } });
      const ready = db.exec(`CREATE TABLE classroom_schools(id BIGINT PRIMARY KEY); INSERT INTO classroom_schools VALUES(10);
        ALTER TABLE classroom_users ADD COLUMN display_name TEXT; UPDATE classroom_users SET display_name = '검증 교사';
        CREATE TABLE classroom_teachers(id BIGINT PRIMARY KEY, school_id BIGINT, teaching_scope JSONB);
        INSERT INTO classroom_teachers VALUES (101, 10, NULL), (102, 10, '[{"grade":6,"subject":"영어"}]');
        CREATE TABLE school_master_timetable(id BIGSERIAL PRIMARY KEY, school_id BIGINT, academic_year INTEGER, grade INTEGER, subject_name TEXT, teacher_user_id BIGINT);`)
        .then(() => Promise.all([ai.initialize(), plans.initialize()]));
      app.use('/api/teacher-ai', (req, res, next) => ready.then(() => next(), next), ai.router);
      app.use('/api/teacher/assessment-plans', (req, res, next) => ready.then(() => next(), next), plans.router);
      app.get('/api/teacher/available-classes', (_req, res) => res.json({ classes: [{ classId: 1, grade: 5, classNumber: 2, label: '5학년 2반', isHomeroom: true, schoolName: '검증초' }] }));
      app.put('/api/teacher/record-plan', (req, res) => { recordPlans.set([req.body.grade, req.body.area, req.body.semester, req.body.subject].join('|'), req.body.items); res.json({ ok: true, updatedAt: new Date().toISOString() }); });
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
    await page.goto(h.base + '/classtools/assessment-plan/plan.html');
    await page.locator('#subject-select option').first().waitFor({ state: 'attached' });
    assert.equal(await page.locator('#grade-select').inputValue(), '5', '교사 반의 학년이 먼저 잡힌다');
    await page.locator('#subject-select').selectOption('국어');
    await page.locator('#save-status').filter({ hasText: '아직 계획이 없습니다' }).waitFor({ timeout: 10000 });
    const semester = await page.locator('#semester-select').inputValue();
    const key = { year: new Date().getFullYear(), grade: 5, semester, subject: '국어' };
    const saved = async () => page.evaluate(async (k) => (await (await fetch('/api/teacher/assessment-plans?' + new URLSearchParams(k))).json()).items, key);
    const waitSaved = async (check) => { let items = []; for (let i = 0; i < 50 && !check(items); i += 1) { await page.waitForTimeout(200); items = await saved(); } assert.ok(check(items), '서버에 저장돼야 한다: ' + JSON.stringify(items)); return items; };

    // 항목을 만들고 평가요소를 적고 성취기준을 고른다. 영역명은 고른 성취기준의 영역으로 채워진다.
    await page.locator('#add-item-btn').click();
    assert.equal(await page.locator('.item').count(), 1);
    await page.locator('.item textarea').first().fill('경험을 시로 표현하기');
    await page.locator('.item .pick').click();
    await page.locator('#picker-dialog[open]').waitFor();
    await page.locator('#picker-search').fill('갈래');
    const matches = await page.locator('#picker-list label').count();
    assert.ok(matches >= 1 && matches < 10, '찾기로 걸러진다: ' + matches);
    await page.locator('#picker-list label').filter({ hasText: '6국05-05' }).locator('input').check();
    await page.locator('#picker-apply').click();
    assert.equal(await page.locator('.item .chip').count(), 1);
    assert.equal(await page.locator('.item select.form-control').first().inputValue(), '문학', '영역명은 고르기 칸이고 성취기준의 영역으로 채워진다');
    const domainOptions = await page.locator('.item select.form-control').first().locator('option').evaluateAll((els) => els.map((e) => e.textContent));
    assert.deepEqual(domainOptions.slice(1, 7), ['듣기⋅말하기', '읽기', '쓰기', '문법', '문학', '매체'], '그 교과의 영역이 다 보인다');
    // 「직접 적기」를 고르면 글 칸이 되고, 적고 나가면 다시 고르기 칸에 그 이름이 남는다.
    await page.locator('.item select.form-control').first().selectOption({ label: '직접 적기…' });
    const custom = page.locator('.item .field input.form-control').first();
    await custom.fill('독서');
    await custom.blur();
    assert.equal(await page.locator('.item select.form-control').first().inputValue(), '독서');
    await page.locator('.item select.form-control').first().selectOption('문학');
    let items = await waitSaved((list) => list.length === 1 && list[0].standards.length === 1);
    assert.equal(items[0].standards[0].code, '6국05-05');
    assert.equal(items[0].element, '경험을 시로 표현하기');
    assert.equal(items[0].levels, 3);

    // 단계 수를 4로 바꾸면 단계 이름이 기본값으로 다시 깔린다.
    await page.locator('.item .levels-head select').selectOption('4');
    assert.deepEqual(await page.locator('.item .level input').evaluateAll((els) => els.map((e) => e.value)), ['매우잘함', '잘함', '보통', '노력요함']);
    await waitSaved((list) => list[0]?.levels === 4);

    // 키가 없으면 초안 단추는 안내만 한다.
    await page.locator('.item .levels-head .btn').click();
    await page.locator('#toast').filter({ hasText: 'API 키를 먼저 등록' }).waitFor({ timeout: 10000 });
    const put = await page.evaluate(async (k) => (await fetch('/api/teacher-ai/key', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: k }) })).status, VALID_KEY);
    assert.equal(put, 200);
    await page.reload();
    await page.locator('.item').first().waitFor();
    await page.locator('.item .levels-head .btn').click();
    await page.locator('#toast').filter({ hasText: '초안을 넣었습니다' }).waitFor({ timeout: 15000 });
    assert.deepEqual(await page.locator('.item .level textarea').evaluateAll((els) => els.map((e) => e.value.slice(0, 4))), ['초안 1', '초안 2', '초안 3', '초안 4']);
    const criteriaCall = google.at(-1).body.contents[0].parts[0].text;
    assert.match(criteriaCall, /\[6국05-05\]/);
    assert.match(criteriaCall, /평가요소: 경험을 시로 표현하기/);
    assert.match(criteriaCall, /단계 4개\(매우잘함 \/ 잘함 \/ 보통 \/ 노력요함\)/);
    await waitSaved((list) => list[0]?.criteria?.[0]?.text?.startsWith('초안 1'));

    // 계획서 파일을 올리면 읽은 항목을 골라 덧붙인다. 지어낸 코드는 빠진다.
    await page.locator('#import-file').setInputFiles({ name: '수행평가계획.txt', mimeType: 'text/plain', buffer: Buffer.from('5학년 국어 수행평가\n읽기: 글의 짜임\n쓰기: 주장하는 글', 'utf8') });
    await page.locator('#import-dialog[open]').waitFor({ timeout: 15000 });
    assert.equal(await page.locator('#import-list label').count(), 2);
    assert.match(await page.locator('#import-meta').innerText(), /2개 항목을 읽었습니다/);
    const planCall = google.at(-1).body.contents[0].parts.map((p) => p.text || '').join('');
    assert.match(planCall, /조건: 5학년, 교과 국어/);
    assert.match(planCall, /6국02-01: 읽기 \//);
    assert.match(planCall, /주장하는 글/);
    await page.locator('#import-append').click();
    assert.equal(await page.locator('.item').count(), 3);
    items = await waitSaved((list) => list.length === 3);
    assert.deepEqual(items[1].standards.map((s) => s.code), ['6국02-01']);
    assert.deepEqual(items[2].standards.map((s) => s.code), ['6국03-02']);
    assert.equal(items[2].domain, '쓰기', '영역명이 비었으면 성취기준의 영역으로 채운다');
    assert.equal(items[2].levels, 2);

    // 파일을 창에 끌어다 놓아도 똑같이 읽는다. 끄는 동안 놓을 자리가 보이고, 놓으면 사라진다.
    const dropFile = (name, text) => page.evaluateHandle(({ name, text }) => { const dt = new DataTransfer(); dt.items.add(new File([text], name, { type: 'text/plain' })); return dt; }, { name, text });
    const dt = await dropFile('계획서.txt', '5학년 국어 수행평가\n읽기: 글의 짜임');
    await page.dispatchEvent('body', 'dragenter', { dataTransfer: dt });
    assert.equal(await page.locator('#drop-hint').isVisible(), true, '끌고 들어오면 놓을 자리가 보인다');
    await page.dispatchEvent('body', 'drop', { dataTransfer: dt });
    assert.equal(await page.locator('#drop-hint').isVisible(), false);
    await page.locator('#import-dialog[open]').waitFor({ timeout: 15000 });
    assert.equal(await page.locator('#import-list label').count(), 2);
    assert.match(google.at(-1).body.contents[0].parts.map((p) => p.text || '').join(''), /글의 짜임/);
    await page.locator('#import-cancel').click();
    assert.equal(await page.locator('.item').count(), 3, '취소하면 계획은 그대로');
    const bad = await dropFile('계획서.hwp', 'x');
    await page.dispatchEvent('body', 'drop', { dataTransfer: bad });
    await page.locator('#toast').filter({ hasText: 'txt 파일만' }).waitFor({ timeout: 5000 });

    // 평가요소를 생기부 활동 목록으로 보낸다(확인 창은 자동으로 수락).
    await page.locator('#send-record-btn').click();
    await page.locator('#toast').filter({ hasText: '보냈습니다' }).waitFor({ timeout: 10000 });
    assert.equal(recordPlans.get(['5', 'subject', semester + '학기', '국어'].join('|')) ?? recordPlans.get([5, 'subject', semester + '학기', '국어'].join('|')), '경험을 시로 표현하기\n글의 짜임 파악하기\n주장하는 글 쓰기');

    // 다시 열어도, 다른 교과로 갔다 와도 그대로다.
    await page.reload();
    await page.locator('.item').nth(2).waitFor();
    assert.equal(await page.locator('.item').count(), 3);
    assert.match(await page.locator('#save-status').innerText(), /검증 교사 선생님이 .*에 저장/);
    await page.locator('#subject-select').selectOption('수학');
    await page.locator('#save-status').filter({ hasText: '아직 계획이 없습니다' }).waitFor({ timeout: 10000 });
    assert.equal(await page.locator('.item').count(), 0);
    await page.locator('#subject-select').selectOption('국어');
    await page.locator('.item').nth(2).waitFor();

    // 삭제도 저장된다.
    await page.locator('.item').nth(2).locator('button', { hasText: '삭제' }).click();
    await waitSaved((list) => list.length === 2);

    // 담임이 다른 학년을 열면 보기만: 칸이 잠기고 추가·채우기 단추가 사라진다. 서버도 저장을 거절한다.
    assert.match(await page.locator('#grade-select option[value="6"]').innerText(), /보기만/);
    assert.doesNotMatch(await page.locator('#grade-select option[value="5"]').innerText(), /보기만/);
    await page.locator('#grade-select').selectOption('6');
    await page.locator('#save-status').filter({ hasText: '보기만 할 수 있습니다' }).waitFor({ timeout: 10000 });
    assert.equal(await page.locator('#add-item-btn').isVisible(), false);
    assert.equal(await page.locator('#import-btn').isVisible(), false);
    const refused = await page.evaluate(async (k) => (await fetch('/api/teacher/assessment-plans', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...k, grade: 6, items: [{ element: '몰래' }] }) })).status, key);
    assert.equal(refused, 403, '서버가 다른 학년 저장을 거절한다');
    const calls = google.length;
    await page.dispatchEvent('body', 'drop', { dataTransfer: await dropFile('계획서.txt', '6학년') });
    await page.locator('#toast').filter({ hasText: '보기만 할 수 있어' }).waitFor({ timeout: 5000 });
    assert.equal(google.length, calls, '보기만인 계획에는 끌어다 놓아도 읽지 않는다');
    await page.locator('#grade-select').selectOption('5');
    await page.locator('.item').nth(1).waitFor();
    assert.equal(await page.locator('#add-item-btn').isVisible(), true);

    // 영어 전담(계정 2)은 6학년 영어부터 열리고, 그 학년의 다른 교과는 잠긴다.
    const context2 = await browser.newContext({ viewport: { width: 1200, height: 900 } });
    await context2.addCookies([{ name: 'test_user', value: '2', url: h.base }]);
    const page2 = await context2.newPage();
    page2.on('pageerror', (e) => errors.push(e.message));
    await page2.goto(h.base + '/classtools/assessment-plan/plan.html');
    await page2.locator('#subject-select option').first().waitFor({ state: 'attached' });
    assert.equal(await page2.locator('#grade-select').inputValue(), '6');
    assert.equal(await page2.locator('#subject-select').inputValue(), '영어');
    await page2.locator('#save-status').filter({ hasText: '아직 계획이 없습니다. 항목을 추가하거나' }).waitFor({ timeout: 10000 });
    assert.equal(await page2.locator('#add-item-btn').isVisible(), true);
    assert.match(await page2.locator('#subject-select option[value="수학"]').innerText(), /보기만/);
    await page2.locator('#grade-select').selectOption('5');
    await page2.locator('#save-status').filter({ hasText: '보기만 할 수 있습니다' }).waitFor({ timeout: 10000 });
    assert.equal(await page2.locator('#subject-select').inputValue(), '영어', '5학년에는 맡은 교과가 없으니 보던 교과를 보기만 한다');
    await page2.locator('#subject-select').selectOption('국어');
    await page2.locator('.item').nth(1).waitFor();
    assert.equal(await page2.locator('.item').count(), 2, '담임이 적은 5학년 국어 계획을 읽는다');
    assert.equal(await page2.locator('.item textarea').first().isDisabled(), true);
    await context2.close();
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ ok: true, googleCalls: google.length }));
  } finally {
    if (browser) await browser.close();
    await h.close();
  }
})().catch((error) => { console.error(error); process.exit(1); });
