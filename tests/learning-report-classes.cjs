'use strict';
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const { harness } = require('./learning-records-integration.cjs');

async function main() {
  const h = await harness({ teacherRegistrations: async user => [3, 4, 10].includes(Number(user.id)) ? [{
    school_id: Number(user.id) === 4 ? 20 : 10, school_name: '테스트학교', academic_year: 2026,
    teacher_type: Number(user.id) === 10 ? '담임' : '관리자', grade: 4, class_number: 1
  }] : [] });
  let browser;
  const request = async (route, body, user = 3, expected = 200) => {
    const response = await fetch(h.base + '/api/learning-records' + route, {
      headers: { 'Content-Type': 'application/json', 'x-test-user': String(user) },
      ...(body ? { method: 'POST', body: JSON.stringify(body) } : {})
    });
    const data = await response.json(); assert.equal(response.status, expected, JSON.stringify(data));
    assert.equal(response.headers.get('cache-control'), 'no-store'); return data;
  };
  const classIds = async user => (await request('/teacher/classes', null, user)).classes.map(c => c.id);
  try {
    await h.db.exec(`
      INSERT INTO classroom_users VALUES (10,'homeroom@school.kr');
      INSERT INTO classroom_classes VALUES (602,10,2026,6,2),(603,10,2026,6,3),
        (604,10,2026,6,4),(605,10,2026,6,5),(504,10,2025,6,4);
      INSERT INTO school_students VALUES (60,10,2026,6,3,1,'미로그인학생',NULL,NULL),
        (50,10,2025,6,4,1,'작년학생',NULL,NULL);
      INSERT INTO classroom_students (id,class_id,student_number,roster_name,user_id,roster_active)
        VALUES (62,602,1,'기존명단학생',NULL,TRUE),(11,100,1,'가학생',1,TRUE);
      UPDATE classroom_students SET class_id=604 WHERE id=50;
    `);
    // Keep a real saved answer under the class being removed from the roster.
    const historical = (await request('/sessions', { activity: 'proverbs', contentKey: 'ko:0', contentVersion: 'v1',
      title: '보존할 학습 기록', href: '/learning/literacy-numeracy/proverbs/', checkpoint: {} }, 5)).session;
    await request(`/sessions/${historical.id}/changes`, { revision: 0, mutationId: crypto.randomUUID(), checkpoint: {},
      progress: { current: 1, total: 2 }, events: [{ kind: 'answer', questionKey: 'q1', response: '답', correct: true, snapshot: { prompt: '문제' } }] }, 5);
    assert.ok((await classIds(3)).includes('10:2026:6:4'));
    // A whole-school roster save retains this legacy row but deactivates it.
    await h.db.exec('UPDATE classroom_students SET roster_active=FALSE WHERE id=50');
    assert.deepEqual(await classIds(3), ['10:2026:4:1', '10:2026:6:2', '10:2026:6:3'],
      'exclude empty, inactive-only, old-year and other-school classes; retain unlinked and legacy-only pupils');
    assert.deepEqual(await classIds(10), ['10:2026:4:1'], 'homeroom scope remains restricted');
    assert.deepEqual(await classIds(4), ['20:2026:4:1'], 'admin scope remains within its school');
    assert.equal((await request(`/teacher/sessions/${historical.id}`)).session.events.length, 1, 'hiding a class never deletes or revokes authorized history');
    await request(`/teacher/sessions/${historical.id}`, null, 4, 404);
    await request('/teacher/report?classId=10:2026:6:4', null, 10, 403);
    assert.equal((await request('/teacher/report?classId=10:2026:6:4&period=all')).sessions.length, 1);
    await h.db.exec("INSERT INTO school_students VALUES (64,10,2026,6,4,1,'새 학생',NULL,NULL)");
    assert.ok((await classIds(3)).includes('10:2026:6:4'), 'new roster entries appear without creating accounts or class metadata');
    await h.db.exec('DELETE FROM school_students WHERE id=64');
    assert.ok(!(await classIds(3)).includes('10:2026:6:4'), 'removing the last current pupil removes the class again');

    browser = await chromium.launch({ channel: 'msedge', headless: true });
    const context = await browser.newContext({ extraHTTPHeaders: { 'x-test-user': '3' } });
    await context.route('https://**', route => route.abort());
    const page = await context.newPage(), errors = [], reports = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', req => { if (req.url().includes('/teacher/report?')) reports.push(new URL(req.url()).searchParams.get('classId')); });
    const settled = () => page.waitForFunction(() => !document.getElementById('load').disabled);
    const refreshed = async action => {
      const response = page.waitForResponse(r => r.url().endsWith('/teacher/classes'));
      await action(); await response; await settled();
    };
    await page.goto(h.base + '/classtools/learning-reports.html'); await settled();
    const options = () => page.locator('#classSelect option').evaluateAll(items => items.map(item => item.value));
    assert.deepEqual(await options(), ['10:2026:4:1', '10:2026:6:2', '10:2026:6:3']);
    await refreshed(() => page.locator('#classSelect').selectOption('10:2026:6:3'));
    await refreshed(() => page.locator('#allPeriod').click());
    await h.db.exec("INSERT INTO school_students VALUES (32,10,2026,3,2,1,'추가 학생',NULL,NULL)");
    await refreshed(() => page.locator('#load').click());
    assert.equal(await page.locator('#classSelect').inputValue(), '10:2026:6:3', 'refresh preserves a valid selection');
    assert.ok((await options()).includes('10:2026:3:2'));
    assert.equal(await page.locator('#allPeriod').getAttribute('aria-pressed'), 'true', 'refresh preserves the date preset');
    await h.db.exec('DELETE FROM school_students WHERE id=60');
    reports.length = 0;
    await refreshed(() => page.locator('#load').click());
    assert.equal(await page.locator('#classSelect').inputValue(), '10:2026:3:2', 'removed selection falls back to a current class');
    assert.ok(!reports.includes('10:2026:6:3'), 'do not request a removed class from a stale picker');
    assert.ok(!(await options()).includes('10:2026:6:3'));
    await h.db.exec('DELETE FROM school_students WHERE school_id=10; UPDATE classroom_students SET roster_active=FALSE');
    reports.length = 0;
    await refreshed(() => page.locator('#load').click());
    assert.equal(await page.locator('#classSelect').isDisabled(), true);
    assert.equal(await page.locator('#load').isEnabled(), true, 'an empty roster can still be refreshed');
    assert.match(await page.locator('#status').innerText(), /현재 학생 명단/);
    assert.equal(reports.length, 0, 'never request a report with an empty class id');
    await h.db.exec("INSERT INTO school_students VALUES (15,10,2026,4,1,1,'돌아온 학생',1,'a@school.kr')");
    // Returning from the roster editor refreshes the already open report.
    await refreshed(() => page.evaluate(() => window.dispatchEvent(new Event('focus'))));
    assert.deepEqual(await options(), ['10:2026:4:1']);
    assert.equal(await page.locator('#classSelect').isEnabled(), true);
    assert.equal(await page.locator('#activitySelect optgroup').count(), 5, 'refresh does not duplicate activity filters');
    assert.equal((await request(`/teacher/sessions/${historical.id}`)).session.events.length, 1);
    assert.deepEqual(errors, []);
    console.log('PASS report classes: current roster only, inactive/empty classes hidden, new/unlinked/legacy pupils, school/year/homeroom scope, history preserved, refresh/return updates, selection and period retention, empty roster recovery.');
  } finally { if (browser) await browser.close(); await h.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
