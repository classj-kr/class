const assert = require('node:assert/strict');
const path = require('node:path');
const express = require('../game-hub-server/node_modules/express');
const { chromium } = require('../game-hub-server/node_modules/playwright');

(async () => {
  const app = express();
  app.use('/exams', express.static(path.resolve(__dirname, '../apps/exams')));
  const server = await new Promise(resolve => { const s = app.listen(0, '127.0.0.1', () => resolve(s)); });
  const base = `http://127.0.0.1:${server.address().port}`;
  let browser;
  const exam = { id: 'exam-1', code: '1234', title: '진단평가', durationMinutes: 20, status: 'draft', startedAt: null, deadline: null };
  let questions = [];
  let answer = null;
  let submitted = false;
  try {
    browser = await chromium.launch({ headless: true, ...(process.platform === 'win32' ? { channel: 'msedge' } : {}) });
    async function mock(page, teacher) {
      await page.route('**/api/exams**', async route => {
        const request = route.request(); const url = new URL(request.url()); const pathname = url.pathname;
        const body = request.postData() ? request.postDataJSON() : {};
        let data = {}; let status = 200;
        if (pathname.endsWith('/mine')) data = { exams: [exam] };
        else if (/^\/api\/exams\/?$/.test(pathname) && request.method() === 'POST') { Object.assign(exam, { title: body.title, durationMinutes: body.durationMinutes }); data = { id: exam.id, code: exam.code }; status = 201; }
        else if (pathname.endsWith('/join')) data = { exam, member: { number: 1, name: '민서' } };
        else if (pathname.endsWith('/start')) { Object.assign(exam, { status: 'open', startedAt: new Date().toISOString(), deadline: new Date(Date.now() + 1200000).toISOString() }); data = { exam }; }
        else if (pathname.endsWith('/submit')) { submitted = true; data = { ok: true }; }
        else if (pathname.includes('/answers/')) { answer = body; data = { ok: true }; }
        else if (pathname.endsWith('/exam-1') && request.method() === 'PUT') { questions = body.questions.map((q,i) => ({ ...q, id: q.id || `q-${i}` })); exam.title = body.title; data = { questions }; }
        else if (pathname.endsWith('/exam-1')) data = teacher ? { exam, questions, members: [] } :
          { exam, member: { number: 1, name: '민서', submittedAt: submitted ? new Date().toISOString() : null },
            questions: exam.status === 'draft' ? [] : questions.map(({ answer, aliases, ...q }) => q), answers: answer ? [{ question_id: questions[0].id, response: answer.response }] : [], score: submitted ? 1 : null };
        else { status = 404; data = { message: '찾을 수 없음' }; }
        await route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(data) });
      });
    }
    const teacher = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    const student = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const errors = [];
    for (const page of [teacher, student]) page.on('pageerror', error => errors.push(error.message));
    await mock(teacher, true); await mock(student, false);
    await teacher.goto(base + '/exams/?mode=teacher');
    await teacher.locator('#teacherHome').waitFor({ state: 'visible' });
    await teacher.locator('#newTitle').fill('진단평가');
    await teacher.locator('#createForm button').click();
    await teacher.locator('#teacherExam').waitFor({ state: 'visible' });
    await teacher.locator('#addShortButton').click();
    await teacher.locator('.question-editor textarea').fill('빈칸에 들어갈 말은?');
    await teacher.locator('.question-editor input').first().fill('한글');
    await teacher.locator('#saveButton').click();
    await teacher.getByRole('status').filter({ hasText: '저장했습니다.' }).waitFor();
    assert.equal(questions[0].kind, 'short');
    await student.goto(base + '/exams/?code=1234');
    await student.locator('#joinNumber').fill('1'); await student.locator('#joinName').fill('민서');
    await student.locator('#joinForm button').click();
    await student.locator('#studentExam').waitFor({ state: 'visible' });
    await student.locator('#waitingPanel').waitFor({ state: 'visible' });
    assert.equal(await student.locator('#questionPanel').isVisible(), false);
    await teacher.once('dialog', dialog => dialog.accept());
    await teacher.locator('#startButton').click();
    await teacher.waitForFunction(() => document.querySelector('#examMeta')?.textContent?.includes('진행 중'));
    await student.locator('#questionPanel').waitFor({ state: 'visible' });
    await student.locator('#shortAnswer').fill('한글');
    await student.locator('#answerArea button').click();
    assert.equal(answer.response, '한글');
    await student.once('dialog', dialog => dialog.accept());
    await student.locator('#submitButton').click();
    await student.waitForFunction(() => document.querySelector('#studentMeta')?.textContent?.includes('자동채점'));
    assert.equal(errors.length, 0, errors.join('\n'));
    assert.equal(await student.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    console.log('CBT teacher and student browser flow passed');
  } finally { if (browser) await browser.close(); await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });
