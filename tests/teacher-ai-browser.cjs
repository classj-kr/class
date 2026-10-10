// 프로필 화면의 AI 설정을 실제 브라우저로 돌린다: 키 등록·확인·삭제가 서버로 가고,
// 브라우저 저장소에는 키가 남지 않으며, 예전에 남아 있던 키는 서버로 옮겨진 뒤 지워진다.
const assert = require('node:assert/strict');
const path = require('node:path');
const express = require('../game-hub-server/node_modules/express');
const { PGlite } = require('../game-hub-server/node_modules/@electric-sql/pglite');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const { createTeacherAi } = require('../game-hub-server/teacher-ai');

class HttpError extends Error { constructor(status, code, message) { super(message); this.status = status; this.code = code; } }
const VALID_KEY = 'AIzaSyTEST-valid-key-0000000000005678';

async function startHarness() {
  const db = new PGlite();
  await db.exec('CREATE TABLE classroom_users(id BIGINT PRIMARY KEY); INSERT INTO classroom_users VALUES(1);');
  const pool = { query: (sql, args) => db.query(sql, args) };
  const google = [];
  const fetchImpl = async (url, options = {}) => {
    const key = options.headers?.['x-goog-api-key'] || '';
    google.push({ url: String(url), key });
    const json = (status, data) => ({ ok: status < 400, status, json: async () => data });
    if (key !== VALID_KEY) return json(403, { error: { message: 'API key not valid' } });
    if (String(url).endsWith('/models')) return json(200, { models: [{ name: 'models/gemini-2.5-flash' }] });
    if (String(url).endsWith('/interactions')) return json(404, {});
    return json(200, { candidates: [{ content: { parts: [{ text: '서버가 만든 문장' }] } }] });
  };
  const requireTeacher = async (req) => {
    if (!/test_teacher=1/.test(req.headers.cookie || '')) throw new HttpError(401, 'AUTH_REQUIRED', '교사 계정으로 로그인해 주세요.');
    return { id: 1, email: 'teacher@school.test' };
  };
  const feature = createTeacherAi({ pool, requireTeacher, requireDatabase() {}, HttpError, fetchImpl, warn() {},
    asyncRoute: (fn) => (req, res, next) => Promise.resolve(fn(req, res)).catch(next), secret: { value: 'harness', derived: false } });
  await feature.initialize();
  const app = express();
  app.use(express.json({ limit: '256kb' }));
  app.get('/api/auth/me', (req, res) => res.json(/test_teacher=1/.test(req.headers.cookie || '')
    ? { signedIn: true, isTeacher: true, user: { email: 'teacher@school.test', name: '검증 교사', role: 'teacher' }, membership: null }
    : { signedIn: false }));
  app.get('/api/teacher/profile', (_req, res) => res.json({ profiles: [{ active: true, schoolName: '검증초', teacherType: 'homeroom', grade: 3, classNumber: 1 }] }));
  app.get('/api/teacher/me/profile', (_req, res) => res.json({ profile: { name: '검증 교사', birthdayMmdd: '', birthdayVisible: false, avatar: null } }));
  app.get(/^\/api\/.*profile$/, (_req, res) => res.json({ profile: { name: '검증 교사', birthdayMmdd: '', birthdayVisible: false, avatar: null } }));
  app.use('/api/teacher-ai', feature.router);
  app.use('/api', (_req, res) => res.status(404).json({ error: 'NOT_IN_HARNESS' }));
  app.use((error, _req, res, _next) => res.status(error.status || 500).json({ error: error.code, message: error.message }));
  app.use(express.static(path.resolve(__dirname, '..', 'apps')));
  app.use(express.static(path.resolve(__dirname, '..')));
  const server = await new Promise((resolve) => { const s = app.listen(0, '127.0.0.1', () => resolve(s)); });
  return { db, google, base: `http://127.0.0.1:${server.address().port}`, async close() { await new Promise((r) => server.close(r)); await db.close(); } };
}

(async () => {
  const h = await startHarness();
  let browser;
  try {
    browser = await chromium.launch({ headless: true, ...(process.platform === 'win32' ? { channel: 'msedge' } : {}) });
    const context = await browser.newContext({ viewport: { width: 1200, height: 900 } });
    await context.addCookies([{ name: 'test_teacher', value: '1', url: h.base }]);
    const page = await context.newPage();
    const errors = []; page.on('pageerror', (e) => errors.push(e.message));

    // 예전 화면이 브라우저에 남긴 키가 있는 상태로 시작한다.
    await page.goto(h.base + '/classtools/profile.html');
    await page.evaluate((key) => localStorage.setItem('classroom_ai:' + encodeURIComponent('teacher@school.test') + ':gemini_api_key', key), VALID_KEY);
    await page.goto(h.base + '/classtools/profile.html#ai-settings');
    await page.locator('#aiStatus').filter({ hasText: '등록된 키를 교사용 AI 기능에서 함께 사용합니다.' }).waitFor({ timeout: 10000 });
    const migrated = await page.evaluate(() => Object.keys(localStorage).filter((k) => /gemini|classroom_ai/.test(k)));
    assert.deepEqual(migrated, [], '옮긴 뒤 브라우저에 키 이름이 남으면 안 된다');
    assert.equal((await h.db.query('SELECT key_last4 FROM teacher_ai_keys WHERE user_id = 1')).rows[0]?.key_last4, '5678');
    assert.match(await page.locator('#geminiKey').getAttribute('placeholder'), /…5678/);

    // 삭제 → 새 키 저장(틀린 키는 거부) → 연결 확인.
    await page.locator('#deleteAiKey').click();
    await page.locator('#aiStatus').filter({ hasText: '삭제했습니다' }).waitFor();
    assert.equal((await h.db.query('SELECT COUNT(*)::int AS n FROM teacher_ai_keys')).rows[0].n, 0);
    await page.locator('#geminiKey').fill('AIzaSyWRONG-key-00000000000000000000');
    await page.locator('#saveAiKey').click();
    await page.locator('#aiStatus').filter({ hasText: 'API 키 또는 접근 권한을 확인해 주세요.' }).waitFor();
    await page.locator('#geminiKey').fill(VALID_KEY);
    await page.locator('#saveAiKey').click();
    await page.locator('#aiStatus').filter({ hasText: 'API 키를 저장했습니다.' }).waitFor();
    assert.equal(await page.locator('#geminiKey').inputValue(), '', '저장 뒤 입력칸에 키가 남지 않는다');
    await page.locator('#checkAiKey').click();
    await page.locator('#aiStatus').filter({ hasText: '연결을 확인했습니다' }).waitFor();

    // 생성 요청은 서버가 키를 들고 구글에 간다. 브라우저가 받는 것은 글뿐이다.
    const text = await page.evaluate(() => window.ClassroomAI.generate('검증용 요청'));
    assert.equal(text, '서버가 만든 문장');
    assert.equal(h.google.at(-1).key, VALID_KEY);
    assert.deepEqual(await page.evaluate(() => Object.keys(localStorage).filter((k) => /gemini|classroom_ai/.test(k))), []);
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ ok: true, googleCalls: h.google.length }));
  } finally {
    if (browser) await browser.close();
    await h.close();
  }
})().catch((error) => { console.error(error); process.exit(1); });
