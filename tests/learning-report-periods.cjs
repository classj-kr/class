'use strict';
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const path = require('node:path');
const fs = require('node:fs');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const { harness } = require('./learning-records-integration.cjs');

async function main() {
  const h = await harness();
  let browser;
  const today = new Date(Date.now() + 9 * 3600000).toISOString().slice(0, 10);
  const day = offset => new Date(Date.parse(today) - offset * 86400000).toISOString().slice(0, 10);
  const request = async (route, body, user = 1, status = 200) => {
    const response = await fetch(h.base + '/api/learning-records' + route, {
      headers: { 'Content-Type': 'application/json', 'x-test-user': String(user) },
      ...(body ? { method: 'POST', body: JSON.stringify(body) } : {})
    });
    const data = await response.json(); assert.equal(response.status, status, JSON.stringify(data)); return data;
  };
  const reportUrl = '/teacher/report?classId=10:2026:4:1';
  try {
    const sessions = [];
    for (const [offset, activity, title, correct, complete] of [
      [0, 'proverbs', '오늘 속담', true, false], [1, 'proverbs', '어제 속담', false, true],
      [6, 'world-tales', '6일 전 독서', null, true], [7, 'spelling', '7일 전 맞춤법', true, false],
      [400, 'world-novels', '오래된 독서', null, false]
    ]) {
      const reading = activity.startsWith('world-');
      const opened = await request('/sessions', { activity, contentKey: `period-${offset}`, contentVersion: 'v1', title,
        href: `/learning/literacy-numeracy/${reading ? 'story-books/' : ''}${activity}/`, checkpoint: {} });
      const session = opened.session;
      await request(`/sessions/${session.id}/changes`, { revision: 0, mutationId: crypto.randomUUID(), checkpoint: {}, complete,
        progress: { current: 1, total: 1 }, events: [{ kind: reading ? 'read' : 'answer', questionKey: 'q1', response: '기록', correct, snapshot: { title } }] });
      const timestamp = day(offset) + 'T03:00:00Z';
      await h.pool.query('UPDATE learning_record_sessions SET started_at=$2::timestamptz,updated_at=$2::timestamptz,completed_at=CASE WHEN status=\'completed\' THEN $2::timestamptz ELSE NULL END WHERE id=$1', [session.id, timestamp]);
      await h.pool.query('UPDATE learning_record_events SET recorded_at=$2::timestamptz WHERE session_id=$1', [session.id, timestamp]);
      sessions.push(session.id);
    }
    const all = await request(reportUrl + '&period=all', null, 3);
    assert.deepEqual(all.range, { all: true, from: null, to: null });
    assert.equal(all.sessions.length, 5);
    assert.equal(all.sessions.reduce((sum, s) => sum + s.summary.firstScored, 0), 3);
    assert.equal(all.sessions.reduce((sum, s) => sum + s.summary.readCount, 0), 2);
    for (const [days, count] of [[1, 1], [2, 2], [7, 3]]) {
      const result = await request(`${reportUrl}&from=${day(days - 1)}&to=${today}`, null, 3);
      assert.equal(result.sessions.length, count);
    }
    await request(reportUrl + '&period=all', null, 4, 403);
    await request(reportUrl + '&period=all&cursor=invalid', null, 3, 400);
    await request(reportUrl + '&period=unknown', null, 3, 400);
    await request(reportUrl + '&cursor=' + sessions[0], null, 3, 400);

    browser = await chromium.launch({ channel: 'msedge', headless: true });
    const context = await browser.newContext({ extraHTTPHeaders: { 'x-test-user': '3' }, viewport: { width: 1440, height: 1000 } });
    await context.route('https://**', route => route.abort());
    const page = await context.newPage(), errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(h.base + '/classtools/learning-reports.html');
    await page.locator('.record-card').waitFor();
    assert.deepEqual(await page.locator('.quick button').allTextContents(), ['오늘', '최근 2일', '최근 7일', '전체']);
    const choose = async (id, count) => {
      const response = page.waitForResponse(r => r.url().includes('/teacher/report?'));
      await page.locator('#' + id).click(); await response;
      await page.waitForFunction(() => document.getElementById('status').hidden && !document.getElementById('load').disabled);
      assert.equal(await page.locator('.record-card').count(), count);
    };
    await choose('twoDays', 2);
    assert.equal(await page.locator('#fromDate').inputValue(), day(1));
    assert.equal(await page.locator('#twoDays').getAttribute('aria-pressed'), 'true');
    assert.equal(await page.locator('#summary .rate-count').innerText(), '1/2');
    await choose('week', 3);
    assert.equal(await page.locator('#fromDate').inputValue(), day(6));
    await choose('allPeriod', 5);
    assert.equal(await page.locator('#fromDate').isDisabled(), true);
    assert.equal(await page.locator('#summary .rate-count').innerText(), '2/3');
    assert.equal(await page.locator('#summary article').nth(1).locator('strong').innerText(), '2', 'all-period completed total includes old completions');
    assert.match(await page.locator('.record-card').first().innerText(), /오늘 속담/, 'all-period output remains newest first');
    const output = path.resolve(__dirname, '../outputs/learning-records-review'); fs.mkdirSync(output, { recursive: true });
    await page.screenshot({ path: path.join(output, 'teacher-periods-desktop.png'), fullPage: true });
    for (const width of [320, 390]) {
      await page.setViewportSize({ width, height: 844 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${width}px presets do not overflow`);
    }
    await page.screenshot({ path: path.join(output, 'teacher-periods-mobile.png'), fullPage: true });
    await choose('today', 1);
    assert.equal(await page.locator('#fromDate').isDisabled(), false);
    await page.locator('#fromDate').fill(day(7)); await page.locator('#toDate').fill(day(7));
    await choose('load', 1);
    assert.match(await page.locator('.record-card').innerText(), /7일 전 맞춤법/);
    assert.equal(await page.locator('.quick button[aria-pressed=true]').count(), 0);

    // More than the old 1,000-record ceiling, plus rows outside this teacher's scope.
    await h.db.exec(`INSERT INTO classroom_users VALUES (9,'different-class@school.kr');
      INSERT INTO school_students VALUES (9,10,2026,3,1,9,'다른반',9,'different-class@school.kr');`);
    const insert = `INSERT INTO learning_record_sessions(id,user_id,school_id,academic_year,grade,class_number,student_number,student_name,activity,content_key,content_version,title,href,started_at,updated_at)
      SELECT gen_random_uuid(),$1,$2,$3,$4,1,'1','테스트','proverbs','bulk-' || n,'v1','이전 활동','/learning/literacy-numeracy/proverbs/','2025-01-01T00:00:00Z','2025-01-01T00:00:00Z' FROM generate_series(1,$5::int) n`;
    await h.pool.query(insert, [1, 10, 2026, 4, 1001]);
    for (const scope of [[2, 20, 2026, 4, 1], [1, 10, 2025, 4, 1], [9, 10, 2026, 3, 1]]) await h.pool.query(insert, scope);
    const seen = new Set(); let cursor = null, pages = 0;
    do {
      const part = await request(reportUrl + '&period=all' + (cursor ? '&cursor=' + cursor : ''), null, 3);
      assert.ok(part.sessions.length <= 200);
      for (const session of part.sessions) { assert.equal(seen.has(session.id), false); seen.add(session.id); }
      cursor = part.nextCursor; pages++;
      if (pages === 1) await h.pool.query('UPDATE learning_record_sessions SET updated_at=NOW() WHERE id=$1', [part.sessions[0].id]);
    } while (cursor);
    assert.equal(pages, 6); assert.equal(seen.size, 1006, 'every authorized session is returned exactly once, including ongoing saves');
    await choose('allPeriod', 1006);
    assert.equal(await page.locator('#summary .rate-count').innerText(), '2/3', 'final totals include all pages');
    assert.equal(await page.locator('.quick button[aria-pressed=true]').count(), 1);
    assert.deepEqual(errors, []);
    console.log('PASS report periods: today/two days/seven days/all/custom, old reading and answers, completion and accuracy totals, 1,006 sessions across stable pages, class/school/year isolation, mobile controls.');
  } finally { if (browser) await browser.close(); await h.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
