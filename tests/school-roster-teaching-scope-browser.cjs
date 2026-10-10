// 교직원 명단 화면의 전담 담당 학년·과목 입력을 실제 브라우저로 돌린다. 서버가 돌려준 짝이 칸에 글로
// 보이고, 저장할 때 전담 줄은 학년 목록을 글 그대로 보내며, 과목 없는 학년 목록·반 있는 학년 목록은 막는다.
const assert = require('node:assert/strict');
const path = require('node:path');
const express = require('../game-hub-server/node_modules/express');
const { chromium } = require('../game-hub-server/node_modules/playwright');

(async () => {
  const saved = [];
  const app = express();
  app.use(express.json());
  app.get('/api/auth/me', (_req, res) => res.json({ signedIn: true, isTeacher: true, user: { id: 1, name: '학교 관리자', role: 'teacher' } }));
  app.get('/api/school/teachers', (_req, res) => res.json({ isAdmin: true, teachers: [
    { id: 1, name: '학교관리자', type: '관리자', email: 'admin@school.test', grade: null, classNumber: null, subjectName: null, roomName: null, teachingScope: [], linked: true },
    { id: 2, name: '가교사', type: '담임', email: 'a@school.test', grade: 5, classNumber: 2, subjectName: null, roomName: null, teachingScope: [], linked: true },
    { id: 3, name: '라전담', type: '전담', email: 'd@school.test', grade: '3,4,5,6', classNumber: null, subjectName: '음악, 영어(5,6)', roomName: '음악실', teachingScope: [{ grade: 3, subject: '음악' }, { grade: 4, subject: '음악' }, { grade: 5, subject: '음악' }, { grade: 6, subject: '음악' }, { grade: 5, subject: '영어' }, { grade: 6, subject: '영어' }], linked: false }
  ] }));
  app.put('/api/school/teachers', (req, res) => { saved.push(req.body); res.json({ saved: req.body.teachers.length }); });
  app.use('/api', (_req, res) => res.status(404).json({ error: 'NOT_IN_TEST' }));
  app.use(express.static(path.resolve(__dirname, '..', 'apps')));
  app.use(express.static(path.resolve(__dirname, '..')));
  const server = await new Promise((resolve) => { const s = app.listen(0, '127.0.0.1', () => resolve(s)); });
  const base = `http://127.0.0.1:${server.address().port}`;
  let browser;
  try {
    browser = await chromium.launch({ headless: true, ...(process.platform === 'win32' ? { channel: 'msedge' } : {}) });
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const errors = []; page.on('pageerror', (e) => errors.push(e.message));
    page.on('dialog', (d) => d.accept());
    await page.goto(base + '/classtools/school-roster.html');
    await page.locator('#tab-teachers').click();
    await page.locator('#teacherRosterBody tr').nth(2).waitFor();
    const cells = (row) => page.locator('#teacherRosterBody tr').nth(row).locator('input');
    assert.equal(await cells(2).nth(2).inputValue(), '3,4,5,6', '전담 줄의 담당 학년은 목록으로 보인다');
    assert.equal(await cells(2).nth(4).inputValue(), '음악, 영어(5,6)', '담당 과목은 괄호 학년까지 보인다');
    assert.match(await cells(2).nth(2).getAttribute('placeholder'), /전담은 3,4,5,6/);

    // 전담 줄을 고쳐 저장하면 학년 목록은 글 그대로, 담임 줄은 숫자로 간다.
    await cells(2).nth(2).fill('3,4');
    await cells(2).nth(2).dispatchEvent('change');
    await cells(2).nth(4).fill('음악');
    await cells(2).nth(4).dispatchEvent('change');
    await page.locator('#saveTeacherRosterBtn').click();
    for (let i = 0; i < 25 && saved.length === 0; i += 1) await page.waitForTimeout(200);
    assert.equal(saved.length, 1, '저장 요청이 가야 한다');
    const sent = Object.fromEntries(saved[0].teachers.map((t) => [t.name, t]));
    assert.deepEqual([sent['라전담'].type, sent['라전담'].grade, sent['라전담'].classNumber, sent['라전담'].subjectName], ['전담', '3,4', null, '음악']);
    assert.deepEqual([sent['가교사'].type, sent['가교사'].grade, sent['가교사'].classNumber], ['담임', 5, 2]);

    // 저장 뒤에는 명단을 다시 불러와 그린다. 다 그려진 뒤에 고쳐야 고친 것이 남는다.
    await page.locator('#teacherRosterStatus').filter({ hasText: '총 3명' }).waitFor({ timeout: 5000 });

    // 반 없이 학년만 적고 과목을 지우면 막는다. 반이 있는데 학년이 여럿이어도 막는다.
    await cells(2).nth(4).fill('');
    await cells(2).nth(4).dispatchEvent('change');
    await page.locator('#saveTeacherRosterBtn').click();
    await page.locator('#teacherRosterStatus').filter({ hasText: '담당 과목을 적어 주세요' }).waitFor({ timeout: 5000 });
    await cells(2).nth(4).fill('음악');
    await cells(2).nth(4).dispatchEvent('change');
    await cells(1).nth(2).fill('5,6');
    await cells(1).nth(2).dispatchEvent('change');
    await page.locator('#saveTeacherRosterBtn').click();
    await page.locator('#teacherRosterStatus').filter({ hasText: '학년도 하나만' }).waitFor({ timeout: 5000 });
    assert.equal(saved.length, 1, '막힌 저장은 서버로 가지 않는다');
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ ok: true }));
  } finally {
    if (browser) await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
})().catch((error) => { console.error(error); process.exit(1); });
