'use strict';
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { harness } = require('./learning-records-integration.cjs');
const { mathQuestions } = require('../game-hub-server/learning-record-units');
const { chromium } = require('../game-hub-server/node_modules/playwright');

async function main() {
  const h = await harness();
  let browser;
  const unit = '분수의 나눗셈', nextUnit = '각기둥과 각뿔';
  const questions = [...mathQuestions().values()].filter(q => q.subject === '초6' && q.unit === unit);
  const request = async (route, body, user = 1, expected = 200) => {
    const response = await fetch(h.base + '/api/learning-records' + route, { headers: { 'Content-Type': 'application/json', 'x-test-user': String(user) },
      ...(body ? { method: 'POST', body: JSON.stringify(body) } : {}) });
    const data = await response.json(); assert.equal(response.status, expected, JSON.stringify(data)); return data;
  };
  try {
    const start = { activity: 'math-ox', contentKey: '초6', title: '수학 기초 OX · 초6', contentVersion: '20261001', href: '/learning/literacy-numeracy/math-ox/', checkpoint: { answered: {}, unit } };
    let session = (await request('/sessions', start)).session;
    const checkpoint = { answered: {}, unit };
    // Legacy grade-wide record: eight submissions yesterday, the ninth today.
    // All answers are wrong: completing the work is independent of accuracy.
    for (const q of questions) checkpoint.answered[q.id] = { selectedChoice: q.answer === 'O' ? 'X' : 'O', isCorrect: false };
    session = (await request(`/sessions/${session.id}/changes`, { revision: session.revision, mutationId: crypto.randomUUID(), checkpoint,
      progress: { current: questions.length, total: 81 }, events: questions.map(q => ({ kind: 'answer', questionKey: String(q.id), response: checkpoint.answered[q.id].selectedChoice,
        snapshot: { prompt: q.prompt, subject: q.subject, unit: 'forged unit must not affect grouping' } })) })).session;
    const today = new Date(Date.now() + 32400000).toISOString().slice(0, 10), yesterday = new Date(Date.parse(today) - 86400000).toISOString().slice(0, 10);
    await h.pool.query("UPDATE learning_record_events SET recorded_at = $2::date::timestamp AT TIME ZONE 'Asia/Seoul' + interval '12 hour' WHERE session_id=$1", [session.id, yesterday]);
    await h.pool.query("UPDATE learning_record_events SET recorded_at = $2::date::timestamp AT TIME ZONE 'Asia/Seoul' + interval '12 hour' WHERE session_id=$1 AND question_key=$3", [session.id, today, String(questions.at(-1).id)]);
    session = (await request(`/sessions/${session.id}`)).session;
    assert.equal(session.units.length, 1);
    assert.equal(session.units[0].status, 'completed');
    assert.deepEqual(session.units[0].progress, { current: 9, total: 9 });
    assert.equal(session.units[0].summary.firstCorrect, 0);
    assert.equal(session.units[0].summary.firstScored, 9);
    assert.equal(session.status, 'active', 'course stays available for the next unit');
    assert.equal((await request('/sessions', start)).session.id, session.id, 'same grade checkpoint resumes across devices');
    let report = await request(`/teacher/report?classId=10:2026:4:1&from=${yesterday}&to=${yesterday}`, null, 3);
    let row = report.sessions.find(s => s.id === session.id).units[0];
    assert.equal(row.status, 'active', 'historical reports do not see later completion');
    assert.equal(row.progress.current, 8); assert.equal(row.completedAt, null);
    report = await request(`/teacher/report?classId=10:2026:4:1&from=${today}&to=${today}`, null, 3);
    row = report.sessions.find(s => s.id === session.id).units[0];
    assert.equal(row.status, 'completed'); assert.equal(row.summary.firstScored, 1, 'daily score excludes earlier first answers');
    const completedAt = row.completedAt;
    await request(`/teacher/sessions/${session.id}?unit=${encodeURIComponent(unit)}`, null, 4, 404);
    await request(`/sessions/${session.id}?unit=${encodeURIComponent(unit)}`, null, 2, 404);
    await request(`/teacher/sessions/${session.id}?unit=unknown`, null, 3, 404);

    browser = await chromium.launch({ channel: 'msedge', headless: true });
    const context = await browser.newContext({ extraHTTPHeaders: { 'x-test-user': '1' }, viewport: { width: 1440, height: 1000 } });
    await context.route('https://**', route => route.abort());
    const page = await context.newPage(), errors = []; page.on('pageerror', e => errors.push(e.message));
    const url = h.base + '/learning/literacy-numeracy/math-ox/?record=' + encodeURIComponent('초6') + '&unit=' + encodeURIComponent(unit);
    await page.goto(url); await page.waitForFunction(() => !document.getElementById('questionsList').inert && document.querySelectorAll('.question-card').length === 9);
    assert.match(await page.locator('learning-records .progress').innerText(), /단원 완료/);
    assert.equal(await page.locator('.question-card.answered').count(), 9);
    assert.match(await page.locator(`.unit-btn[data-unit="${unit}"]`).innerText(), /완료/);
    const saveAction = async action => {
      const pending = page.waitForResponse(r => /\/sessions\/[^/]+\/changes$/.test(r.url()) && r.status() === 200);
      await action(); const result = (await (await pending).json()).session;
      await page.waitForFunction(() => !document.getElementById('questionsList').inert); return result;
    };
    await page.locator(`#q-card-${questions[0].id} .retry-question`).click();
    session = await saveAction(() => page.locator(`#q-card-${questions[0].id} [data-choice="${questions[0].answer}"]`).click());
    assert.equal(session.units[0].status, 'completed'); assert.equal(session.units[0].completedAt, completedAt);
    assert.equal(session.units[0].summary.firstCorrect, 0); assert.equal(session.units[0].summary.retryCount, 1);
    await saveAction(() => page.locator(`.unit-btn[data-unit="${nextUnit}"]`).click());
    session = await saveAction(() => page.locator('.ox-btn[data-choice="O"]').first().click());
    assert.equal(session.units.length, 2, 'next unit saves without resetting the finished unit');
    assert.equal(session.units.find(u => u.unit === nextUnit).status, 'active');
    for (const q of [...mathQuestions().values()].filter(q => q.subject === '초6' && q.unit === nextUnit).slice(1)) {
      session = await saveAction(() => page.locator(`#q-card-${q.id} [data-choice="O"]`).click());
    }
    assert.equal(session.units.find(u => u.unit === nextUnit).status, 'completed', 'last submission automatically completes a new unit');
    assert.match(await page.locator('learning-records .progress').innerText(), /단원 완료/);
    await saveAction(() => page.locator('.unit-btn[data-unit="소수의 나눗셈"]').click());
    session = await saveAction(() => page.locator('.ox-btn[data-choice="O"]').first().click());
    await page.getByRole('button', { name: '학습 기록', exact: true }).click();
    await page.getByRole('button', { name: '전체 기록', exact: true }).click();
    await page.locator('learning-records .row').filter({ hasText: unit }).waitFor();
    const studentRow = page.locator('learning-records .row').filter({ hasText: unit });
    assert.equal(await studentRow.locator('.badge').innerText(), '완료');
    await studentRow.getByRole('button', { name: '응답 보기', exact: true }).click();
    await page.locator('learning-records .detail').first().waitFor();
    assert.equal(await page.locator('learning-records .detail').count(), 10, 'student detail contains only this unit and its retry');
    assert.deepEqual(await page.evaluate(() => [Object.keys(localStorage), Object.keys(sessionStorage)]), [[], []]);
    const home = await browser.newContext({ extraHTTPHeaders: { 'x-test-user': '1' } });
    await home.route('https://**', route => route.abort());
    const homePage = await home.newPage(); await homePage.goto(url);
    await homePage.locator(`#q-card-${questions[0].id}.correct`).waitFor();
    assert.equal(await homePage.locator('.question-card.answered').count(), 9);

    const teacher = await browser.newContext({ extraHTTPHeaders: { 'x-test-user': '3' } });
    const teacherPage = await teacher.newPage(); teacherPage.on('pageerror', e => errors.push(e.message));
    await teacherPage.goto(h.base + '/classtools/learning-reports.html');
    await teacherPage.locator('.record-card').filter({ hasText: unit }).waitFor();
    const unitCard = teacherPage.locator('.record-card').filter({ hasText: unit });
    assert.equal(await unitCard.locator('.badge').innerText(), '완료');
    assert.equal(await teacherPage.locator('#summary article').filter({ hasText: '완료 활동' }).locator('strong').innerText(), '2');
    assert.equal(await teacherPage.locator('.record-card').filter({ hasText: '소수의 나눗셈' }).locator('.badge').innerText(), '진행 중');
    await unitCard.getByRole('button').click();
    await teacherPage.locator('#detailBody .answer').first().waitFor();
    assert.equal(await teacherPage.locator('#detailBody .answer').count(), 10, 'teacher unit detail excludes the next unit');
    await teacherPage.locator('#closeDetail').click();
    await teacherPage.setViewportSize({ width: 390, height: 844 });
    assert.equal(await teacherPage.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await teacherPage.screenshot({ path: 'output/learning-records-review/teacher-unit-completion-mobile.png', fullPage: true });
    await teacherPage.setViewportSize({ width: 1440, height: 1000 });
    await teacherPage.screenshot({ path: 'output/learning-records-review/teacher-unit-completion.png', fullPage: true });
    assert.deepEqual(errors, []);
    console.log('PASS unit completion: old 9/9 wrong answers complete, cumulative KST progress/daily scores, no future completion, retry retention, next unit, student/teacher detail isolation, access controls, cross-device restore, no local storage, mobile layout.');
  } finally { if (browser) await browser.close(); await h.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
