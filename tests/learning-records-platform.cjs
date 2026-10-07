'use strict';
// Exercise the real platform schema, Google-login handler and session cookies.
// Only the external Google verifier and PostgreSQL transport are replaced.
const assert = require('node:assert/strict');
const Module = require('node:module');
const path = require('node:path');
const { PGlite } = require('../game-hub-server/node_modules/@electric-sql/pglite');
const express = require('../game-hub-server/node_modules/express');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const { inspectLearningRecords } = require('../scripts/inspect-learning-records.cjs');

async function main() {
  const db = new PGlite();
  let queue = Promise.resolve(), browser, server;
  const lease = async () => {
    const previous = queue;
    let release;
    queue = new Promise(resolve => { release = resolve; });
    await previous;
    return release;
  };
  const query = async (sql, params) => {
    const result = params ? await db.query(sql, params) : (await db.exec(sql)).at(-1);
    return { ...result, rows: result?.rows || [], rowCount: result?.rows?.length || result?.affectedRows || 0 };
  };
  class Pool {
    on() {}
    async query(sql, params) {
      const release = await lease();
      try { return await query(sql, params); } finally { release(); }
    }
    async connect() {
      const release = await lease();
      return { query, release, on() {} };
    }
  }
  class OAuth2Client {
    async verifyIdToken({ idToken }) {
      assert.match(idToken, /^fixture-(teacher|pupil-\d+)$/);
      return { getPayload: () => ({ sub: idToken, email: `${idToken}@fixture.invalid`,
        email_verified: true, name: idToken, hd: 'fixture.invalid' }) };
    }
  }
  const originalLoad = Module._load;
  let platform;
  try {
    Module._load = function (name, ...args) {
      if (name === 'pg') return { Pool };
      if (name === 'google-auth-library') return { OAuth2Client };
      return originalLoad.call(this, name, ...args);
    };
    const { createClassroomPlatform } = require('../game-hub-server/classroom-platform');
    platform = createClassroomPlatform({ databaseUrl: 'postgres://isolated/test', googleClientId: 'fixture' });
  } finally { Module._load = originalLoad; }
  try {
    await platform.initialize();
    assert.equal(platform.configuration().enabled, true, JSON.stringify(platform.configuration()));
    await query(`INSERT INTO classroom_schools(id,name,google_domain) VALUES (10,'검증학교','fixture.invalid');
      INSERT INTO classroom_teachers(school_id,teacher_name,google_email,teacher_type,academic_year,grade,class_number)
      VALUES (10,'검증교사','fixture-teacher@fixture.invalid','담임',2026,6,1);
      INSERT INTO classroom_classes(id,school_id,academic_year,grade,class_number,teacher_name,join_code)
      VALUES (100,10,2026,6,1,'검증교사','TEST01'),(90,10,2026,5,1,'이전학급','TEST02');
      INSERT INTO classroom_content_enabled(class_id,content_path) VALUES
        (100,'/learning/literacy-numeracy/math-ox'),
        (100,'/learning/literacy-numeracy/story-books/world-tales'),
        (100,'/learning/literacy-numeracy/story-books/world-novels'),
        (100,'/learning/literacy-numeracy/story-books/korea-tales');`);
    for (let n = 1; n <= 23; n++) {
      const args = [String(n), `검증학생${n}`, `fixture-pupil-${n}@fixture.invalid`];
      await query(`INSERT INTO school_students(school_id,academic_year,grade,class_number,student_number,roster_name,student_email)
        VALUES (10,2026,6,1,$1,$2,$3)`, args);
      // Google sign-in links both copies. Site access resolves the current class;
      // the old records query instead picked the lower grade even when inactive.
      await query(`INSERT INTO classroom_students(class_id,student_number,roster_name,student_email,roster_active)
        VALUES (90,$1,$2,$3,FALSE)`, args);
    }
    const app = express();
    app.use('/api/learning-records', express.json({ limit: '512kb' }));
    app.use(express.json({ limit: '32kb' }));
    app.use('/api', platform.router);
    app.use(['/learning','/classtools'], platform.requireSiteAccess);
    app.use(express.static(path.resolve(__dirname, '..')));
    server = await new Promise(resolve => { const s = app.listen(0, '127.0.0.1', () => resolve(s)); });
    const base = `http://127.0.0.1:${server.address().port}`;
    browser = await chromium.launch({ channel: 'msedge', headless: true });
    async function login(name) {
      const context = await browser.newContext();
      await context.route('https://**', route => route.abort());
      const response = await context.request.post(`${base}/api/auth/google`, { data: { credential: `fixture-${name}` } });
      assert.equal(response.status(), 200, await response.text());
      return context;
    }
    // Four simultaneous clients exercise independent session cookies and writes.
    const students = [], errors = [], saves = [], readings = [];
    const books = ['world-tales/jack-beanstalk', 'world-novels/monte-cristo', 'korea-tales/heungbujeon'];
    for (let start = 1; start <= 23; start += 4) {
      await Promise.all(Array.from({ length: Math.min(4, 24 - start) }, async (_, offset) => {
        const n = start + offset, context = await login(`pupil-${n}`);
        students[n - 1] = context;
        const me = await (await context.request.get(`${base}/api/auth/me`)).json();
        assert.equal(me.membership.grade, 6, `student ${n} is logged into the current class`);
        const page = await context.newPage();
        page.on('pageerror', error => errors.push(error.message));
        page.on('response', response => {
          if (/\/learning-records\/sessions\/[^/]+\/changes$/.test(response.url()) &&
            response.request().postDataJSON()?.events.some(event => event.kind === 'answer')) saves.push(response.status());
        });
        await page.goto(`${base}/learning/literacy-numeracy/math-ox/`);
        await page.locator('learning-records .status').filter({ hasText: '저장 완료' }).waitFor();
        await page.locator('.ox-btn[data-choice="O"]').first().click();
        await page.locator('.question-card.answered').first().waitFor();
        await page.locator('learning-records .status').filter({ hasText: '저장 완료' }).waitFor();
        const savedBook = async action => {
          const response = page.waitForResponse(r => /\/learning-records\/sessions\/[^/]+\/changes$/.test(r.url()) && r.status() === 200);
          await action();
          return (await (await response).json()).session;
        };
        await savedBook(() => page.goto(`${base}/learning/literacy-numeracy/story-books/${books[(n - 1) % books.length]}/`));
        await page.waitForFunction(() => !document.getElementById('book').inert);
        const reading = await savedBook(() => page.evaluate(() => goTo(PAGES.findIndex(p => p.kind === 'chapter' || p.kind === 'spread'))));
        assert.equal(reading.summary.readCount, 1, 'reading without answering a quiz is recorded');
        assert.equal(reading.summary.firstScored, 0);
        assert.equal(reading.status, 'active', 'unfinished reading is visible in reports');
        assert.equal(await page.locator('learning-records .strip').count(), 0, 'recording preserves the book layout');
        readings.push(reading);
        assert.deepEqual(await page.evaluate(() => Object.keys(localStorage)), []);
        await page.close();
      }));
    }
    assert.equal(saves.length, 23, 'every actual OX button click sent a save request');
    assert.ok(saves.every(status => status === 200), JSON.stringify(saves));
    assert.equal(readings.length, 23);
    const day = new Date(Date.now() + 9 * 3600000).toISOString().slice(0, 10);
    const inspection = await inspectLearningRecords({ query }, { schoolId: 10, academicYear: 2026, grade: 6, classNumber: 1, from: day, to: day });
    console.log('Isolated fixture save destinations:', JSON.stringify(inspection));
    const teacher = await login('teacher');
    const report = await (await teacher.request.get(`${base}/api/learning-records/teacher/report?classId=10:2026:6:1`)).json();
    assert.equal(report.sessions.filter(s => s.activity === 'math-ox').length, 23);
    assert.equal(report.sessions.reduce((sum, s) => sum + s.summary.firstScored, 0), 23);
    assert.equal(report.sessions.filter(s => s.domain === '읽기').length, 23);
    assert.equal(report.sessions.reduce((sum, s) => sum + s.summary.readCount, 0), 23);
    assert.equal(inspection.currentClass.answerEvents, 23);
    assert.equal(inspection.currentClass.readEvents, 23);
    assert.deepEqual(inspection.otherClasses, []);
    // Reproduce records already written by the old code, then verify that the
    // report and detail endpoints can read them without a destructive migration.
    await query('UPDATE learning_record_sessions SET grade=5 WHERE school_id=10 AND academic_year=2026');
    const existing = await (await teacher.request.get(`${base}/api/learning-records/teacher/report?classId=10:2026:6:1`)).json();
    assert.deepEqual(existing.sessions.map(s => s.id).sort(), report.sessions.map(s => s.id).sort());
    assert.equal(existing.sessions.reduce((sum, s) => sum + s.summary.readCount, 0), 23);
    const page = await teacher.newPage();
    await page.goto(`${base}/classtools/learning-reports.html`);
    await page.locator('.record-card').first().waitFor();
    await page.getByRole('button', { name: '영역별', exact: true }).click();
    await page.locator('#activitySelect').selectOption('math-ox');
    assert.equal(await page.locator('#records .record-card').count(), 23);
    await page.locator('#records .detail-button').first().click();
    await page.locator('#detailBody .answer').waitFor();
    assert.match(await page.locator('#detailBody').innerText(), /응답: O/);
    await page.locator('#closeDetail').click();
    await page.getByRole('button', { name: '읽기', exact: true }).click();
    assert.equal(await page.locator('#records .record-card').count(), 23);
    await page.locator('#records .detail-button').first().click();
    await page.locator('#detailBody .answer').waitFor();
    assert.match(await page.locator('#detailBody').innerText(), /열어 본 부분/);
    await page.locator('#closeDetail').click();
    await page.getByRole('button', { name: '학생별', exact: true }).click();
    assert.equal(await page.locator('#records .record-card').count(), 2, 'daily student report includes both reading and OX');
    assert.deepEqual(errors, []);
    console.log('PASS real platform schema and session cookies: OX and unfinished reading for 23 pupils, three book categories, existing old-class records in student/area reports and details; no device storage.');
  } finally {
    if (browser) await browser.close();
    if (server) await new Promise(resolve => server.close(resolve));
    await db.close();
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
