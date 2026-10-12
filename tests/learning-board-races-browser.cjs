const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const { createHarness } = require('./learning-boards-harness.cjs');

(async () => {
  const h = await createHarness();
  let browser;
  try {
    browser = await chromium.launch({ headless: true, ...(process.platform === 'win32' ? { channel: 'msedge' } : {}) });
    const teacherContext = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    await teacherContext.addCookies([{ name: 'test_teacher', value: '1', url: h.base }]);
    const aliceContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const bobContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const teacher = await teacherContext.newPage(), alice = await aliceContext.newPage(), bob = await bobContext.newPage();
    const errors = []; for (const p of [teacher, alice, bob]) p.on('pageerror', e => errors.push(e.message));
    async function post(context, route, data) {
      const res = await context.request.post(h.base + '/api/boards' + route, { data });
      assert.ok(res.ok(), await res.text()); return res.json();
    }
    const { board } = await post(teacherContext, '/', { title: '실시간 경주 확인', layout: 'quiz', slots: 30 });
    const base = '/' + board.id;
    await post(aliceContext, '/join', { code: board.code, number: 1, name: '민서' });
    await post(bobContext, '/join', { code: board.code, number: 2, name: '윤서' });
    const q = await post(aliceContext, base + '/posts', { kind: 'ox', content: '지구는 태양 주위를 돈다.', answer: 0, explanation: '지구는 태양 주위를 공전합니다.' });
    await post(teacherContext, base + '/posts/' + q.id + '/review', { revision: 1, status: 'approved' });
    const q2 = await post(teacherContext, base + '/posts', { kind: 'choice', content: '2 + 3은?', choices: ['4', '5'], answer: 1 });
    await post(teacherContext, base + '/posts/' + q2.id + '/review', { revision: 1, status: 'approved' });
    const set = await post(teacherContext, base + '/sets', { title: '연습', posts: [{ id: q.id, revision: 2 }, { id: q2.id, revision: 2 }] });
    await alice.goto(h.base + '/boards/?id=' + board.id);
    await bob.goto(h.base + '/boards/?id=' + board.id);
    await bob.locator('#boardView').waitFor(); assert.equal(await bob.locator('.post').count(), 0);
    await teacher.goto(h.base + '/boards/?id=' + board.id + '&set=' + set.id);
    await teacher.getByRole('button', { name: '경주 시작', exact: true }).last().click();
    await teacher.locator('#teacher').waitFor({ state: 'visible' });
    await alice.locator('#student').waitFor({ state: 'visible' });
    await bob.locator('#student').waitFor({ state: 'visible' });
    await teacher.waitForFunction(() => document.getElementById('participation').textContent === '입장 2명');
    assert.equal(await alice.locator('#studentName').innerText(), '민서');
    await teacher.locator('#advance').click();
    await bob.locator('#choices button').first().waitFor();
    await alice.waitForFunction(() => document.getElementById('studentStatus').textContent.includes('관전'));
    assert.ok(await alice.locator('#choices button').first().isDisabled());
    assert.equal(await bob.locator('#feedback').innerText(), '');
    await bob.locator('#choices button').first().click();
    await teacher.waitForFunction(() => document.getElementById('participation').textContent === '답변 1 / 1명');
    await teacher.locator('#advance').click();
    await bob.waitForFunction(() => document.getElementById('feedback').textContent.includes('정답'));
    await alice.waitForFunction(() => document.getElementById('feedback').textContent.includes('평균'));
    const output = path.resolve('outputs/learning-board-races'); fs.mkdirSync(output, { recursive: true });
    async function capture(page, name) {
      const bytes = await page.screenshot({ fullPage: true });
      const target = path.join(output, name + '.webp');
      const result = spawnSync('python', ['-c', 'import sys,io; from PIL import Image; Image.open(io.BytesIO(sys.stdin.buffer.read())).save(sys.argv[1],format="WEBP",lossless=True)', target], { input: bytes });
      assert.equal(result.status, 0, result.stderr?.toString());
    }
    await capture(teacher, 'teacher-race'); await capture(bob, 'student-answer');
    await bob.reload(); await bob.locator('#student').waitFor({ state: 'visible' });
    assert.match(await bob.locator('#feedback').innerText(), /정답/);
    await teacher.locator('#advance').click();
    await bob.waitForFunction(() => document.getElementById('question').textContent === '2 + 3은?');
    await bob.locator('#choices button').nth(1).click();
    await alice.waitForFunction(() => document.getElementById('question').textContent === '2 + 3은?');
    await alice.locator('#choices button').nth(1).click();
    await teacher.waitForFunction(() => document.getElementById('participation').textContent === '답변 2 / 2명');
    await teacher.locator('#advance').click();
    await teacher.getByRole('button', { name: '최종 결과', exact: true }).waitFor();
    await teacher.locator('#advance').click();
    await bob.waitForFunction(() => document.getElementById('studentStatus').textContent.includes('경주 종료'));
    for (const page of [teacher, alice, bob]) assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    assert.equal(await bob.locator('#teacher').isVisible(), false);
    assert.deepEqual(errors, []);
    console.log('PASS: teacher + two students, private board, automatic entry, author spectating, current question only, answer/reveal/race, reload, next round and final results.');
  } finally { await browser?.close(); await h.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
