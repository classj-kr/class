'use strict';
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const { harness } = require('./learning-records-integration.cjs');
const { inspectLearningRecords } = require('../scripts/inspect-learning-records.cjs');
const catalog = require('../assets/learning-record-catalog');

async function main() {
  const h = await harness();
  let browser;
  const today = new Date(Date.now() + 32400000).toISOString().slice(0, 10);
  const yesterday = new Date(Date.parse(today) - 86400000).toISOString().slice(0, 10);
  const previousTime = yesterday + 'T03:00:00.000Z';
  const request = async (route, body, user = 1) => {
    const response = await fetch(h.base + '/api/learning-records' + route, {
      headers: { 'Content-Type': 'application/json', 'x-test-user': String(user) },
      ...(body ? { method: 'POST', body: JSON.stringify(body) } : {})
    });
    const data = await response.json(); assert.equal(response.status, 200, JSON.stringify(data)); return data;
  };
  const report = query => request('/teacher/report?classId=10:2026:4:1' + (query || ''), null, 3);
  const save = async (session, events = [], complete = false, progress = { current: 0, total: 3 }) =>
    (await request(`/sessions/${session.id}/changes`, { revision: session.revision, mutationId: crypto.randomUUID(),
      checkpoint: { filter: 'changed' }, progress, events, complete }, 5)).session;
  try {
    const empty = [];
    for (const activity of catalog) {
      const start = { activity: activity.id, contentKey: 'open-only', contentVersion: 'v1', title: '열기만 한 활동', href: activity.href, checkpoint: {} };
      const session = (await request('/sessions', start, 5)).session;
      assert.equal((await request('/sessions', start, 5)).session.id, session.id);
      empty.push(await save(session));
    }
    await save(empty.find(s => s.activity === 'csat-math'), [], true);
    assert.equal((await report()).sessions.length, 0, 'opening, changing filters and finishing empty sessions do not count');
    assert.equal((await report('&period=all')).sessions.length, 0, 'all-period reports also exclude opens');
    assert.equal((await request('/sessions', null, 5)).sessions.length, catalog.length, 'resumable checkpoints are preserved');

    // Filter before LIMIT: a large pile of empty opens must not break today's
    // report or consume whole-period pages ahead of actual activity.
    await h.pool.query(`INSERT INTO learning_record_sessions
      (id,user_id,school_id,academic_year,grade,class_number,student_number,student_name,activity,content_key,content_version,title,href)
      SELECT gen_random_uuid(),5,10,2026,4,1,'3','다학생','proverbs','empty-'||n,'v1','빈 활동','/learning/literacy-numeracy/proverbs/'
      FROM generate_series(1,1010) n`);
    assert.equal((await report()).sessions.length, 0);
    assert.equal((await report('&period=all')).nextCursor, null);

    browser = await chromium.launch({ channel: 'msedge', headless: true });
    const student = await browser.newContext({ extraHTTPHeaders: { 'x-test-user': '1' } });
    await student.route('https://**', route => route.abort());
    const teacher = await browser.newContext({ extraHTTPHeaders: { 'x-test-user': '3' } });
    const page = await student.newPage(), teacherPage = await teacher.newPage(), errors = [];
    for (const tab of [page, teacherPage]) tab.on('pageerror', error => errors.push(error.message));
    const saveAction = async action => {
      const [response] = await Promise.all([
        page.waitForResponse(r => /\/sessions\/[^/]+\/changes$/.test(r.url()) && r.status() === 200), action()
      ]);
      return (await response.json()).session;
    };
    await page.goto(h.base + '/learning/literacy-numeracy/math-ox/');
    await page.locator('learning-records .status').filter({ hasText: '저장 완료' }).waitFor();
    assert.equal((await report()).sessions.length, 0, 'real OX page opening is not work');
    await teacherPage.goto(h.base + '/classtools/learning-reports.html');
    await teacherPage.locator('#status').waitFor({ state: 'hidden' });
    assert.equal(await teacherPage.locator('#summary article').first().locator('strong').innerText(), '0 / 2');
    assert.equal(await teacherPage.locator('.student-row.no-records').count(), 2);
    const first = page.locator('.mb-ox-answer[data-choice="O"]').first();
    await saveAction(() => first.click());
    assert.equal((await report()).sessions.length, 1, 'a submitted OX answer counts before completion');
    await teacherPage.locator('#load').click(); await teacherPage.locator('.record-card').waitFor();
    assert.equal(await teacherPage.locator('#summary article').first().locator('strong').innerText(), '1 / 2');
    assert.equal(await teacherPage.locator('.student-row.has-records').count(), 1);
    assert.equal(await teacherPage.locator('.student-row.no-records').count(), 1);
    assert.match(await teacherPage.locator('.student-row.no-records').innerText(), /기록 없음/);

    const questions = await page.locator('.mb-ox-item').evaluateAll(cards => cards.map(card => {
      const q = window.MATH_OX_DATA.find(q => q.id === Number(card.dataset.questionId));
      return { id: q.id, answer: q.answer };
    }));
    for (const q of questions) {
      const button = page.locator(`.mb-ox-item[data-question-id="${q.id}"] [data-choice="${q.answer}"]`);
      if (await button.isEnabled()) await saveAction(() => button.click());
    }
    const completedUnit = (await report()).sessions.find(s => s.activity === 'math-ox').units[0];
    assert.equal(completedUnit.status, 'completed', 'unit completion still follows submitted answers');
    assert.equal(completedUnit.progress.current, questions.length);

    await saveAction(() => page.goto(h.base + '/learning/literacy-numeracy/story-books/world-tales/jack-beanstalk/'));
    assert.equal((await report()).sessions.length, 1, 'book cover alone is excluded');
    await saveAction(() => page.evaluate(() => goTo(PAGES.findIndex(p => ['chapter', 'spread'].includes(p.kind)))));
    assert.equal((await report()).sessions.length, 2, 'deliberate reading navigation is included without quiz answers');

    const poetryUrl = h.base + '/learning/literacy-numeracy/story-books/poetry/';
    await page.goto(poetryUrl);
    await saveAction(() => page.locator('[data-book-idx]').first().click());
    assert.equal((await report()).sessions.length, 2, 'poetry cover is excluded');
    const poem = await saveAction(() => page.locator('[data-jump-spread]').first().click());
    assert.equal((await report()).sessions.length, 3);
    await h.pool.query('UPDATE learning_record_events SET recorded_at=$2::timestamptz WHERE session_id=$1', [poem.id, previousTime]);
    const reopenedPoem = await saveAction(() => page.reload());
    assert.equal(reopenedPoem.events.length, poem.events.length, 'automatic poetry restoration adds no reading event');
    assert.equal((await report()).sessions.some(s => s.id === poem.id), false, 'yesterday\'s poem reopened today is not today\'s activity');
    assert.equal((await report('&period=all')).sessions.find(s => s.id === poem.id).updatedAt, previousTime, 'all-period date reflects actual reading, not reopening');

    await page.goto(h.base + '/learning/literacy-numeracy/metacognition/grade4.html');
    await page.locator('#startBtn').click();
    assert.equal((await report()).sessions.some(s => s.activity === 'metacognition'), false);
    await saveAction(() => page.locator('#choiceGroup button').first().click());
    assert.equal((await report()).sessions.some(s => s.activity === 'metacognition'), false, 'an incomplete check response is not submitted work');
    await saveAction(() => page.locator('#confidenceGroup button').first().click());
    const check = (await report()).sessions.find(s => s.activity === 'metacognition');
    assert.equal(check.progress.current, 1, 'saved check responses remain reportable while scoring is deferred');
    assert.equal(check.summary.firstScored, 0);
    assert.equal((await request(`/sessions/${check.id}`)).session.events.length, 0, 'no live correctness is exposed during the check');

    let finishing = empty.find(s => s.activity === 'spelling');
    finishing = await save(finishing, [{ kind: 'answer', questionKey: 'q1', response: '답', correct: false, snapshot: { prompt: '문제' } }]);
    await h.pool.query('UPDATE learning_record_events SET recorded_at=$2::timestamptz WHERE session_id=$1', [finishing.id, previousTime]);
    finishing = await save(finishing);
    assert.equal((await report()).sessions.some(s => s.id === finishing.id), false, 'checkpoint-only saves cannot revive old work today');
    finishing = await save(finishing, [], true);
    assert.equal((await report()).sessions.find(s => s.id === finishing.id).status, 'completed', 'finishing previous actual work today still counts');
    const inspected = await inspectLearningRecords(h.pool, { schoolId: 10, academicYear: 2026, grade: 4, classNumber: 1, from: today, to: today });
    assert.equal(inspected.currentClass.sessions, (await report()).sessions.length, 'diagnostics follow the same activity rule');
    assert.equal(inspected.currentClass.learners, 2);
    assert.deepEqual(errors, []);
    console.log('PASS meaningful activity: all catalog opens excluded, empty completion excluded, 1,010 opens filtered before pagination, answer/read/draft/finish retained, unit completion, no replay credit, correct dates and roster badges, resume data preserved.');
  } finally { if (browser) await browser.close(); await h.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
