const assert = require('node:assert/strict');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const { createHarness } = require('./learning-boards-harness.cjs');

(async () => {
  const h = await createHarness({ studentSiteAccess: true });
  let browser;
  try {
    const response = await fetch(h.base + '/api/boards/', { method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: 'test_teacher=1' },
      body: JSON.stringify({ title: '자동 입장', layout: 'wall' }) });
    assert.equal(response.status, 201);
    const { board } = await response.json();
    browser = await chromium.launch({ headless: true, ...(process.platform === 'win32' ? { channel: 'msedge' } : {}) });
    const errors = [];
    for (const entry of ['room', 'invitation', 'manual']) {
      const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
      await context.addCookies([{ name: 'test_student', value: '3', url: h.base }]);
      const page = await context.newPage(), joins = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('request', request => { if (request.url().endsWith('/api/boards/join')) joins.push(request.postDataJSON()); });
      await page.goto(h.base + (entry === 'room' ? '/room/' : entry === 'manual' ? '/boards/' : '/boards/?code=' + board.code));
      if (entry === 'room') {
        await page.locator('#roomCode').fill(board.code);
        await page.locator('#roomForm button').click();
      } else if (entry === 'manual') {
        assert.equal(await page.locator('#joinIdentityFields').isVisible(), false);
        await page.locator('#joinCode').fill(board.code);
        await page.locator('#joinForm button').click();
      }
      await page.locator('#boardView').waitFor({ state: 'visible' });
      assert.equal(await page.locator('#myIdentity').innerText(), '7번 학생3');
      assert.deepEqual(joins, [{ code: board.code }], 'only the room number is sent');
      assert.equal(await page.locator('#joinIdentityFields').isVisible(), false);
      if (entry === 'room') {
        await page.locator('#writePost').click();
        await page.locator('#postContent').fill('로그인 정보로 작성');
        await page.locator('#submitPost').click();
      }
      await page.getByText('로그인 정보로 작성', { exact: true }).waitFor();
      await page.getByRole('button', { name: '수정', exact: true }).waitFor();
      await page.reload();
      await page.locator('#boardView').waitFor({ state: 'visible' });
      await context.close();
    }
    for (const [cookie, identity] of [['test_teacher', '선생님'], ['test_guest', '1번 게스트']]) {
      const context = await browser.newContext();
      await context.addCookies([{ name: cookie, value: '1', url: h.base }]);
      const page = await context.newPage();
      await page.goto(h.base + '/boards/?code=' + board.code);
      await page.locator('#boardView').waitFor({ state: 'visible' });
      assert.equal(await page.locator('#myIdentity').innerText(), identity);
      await context.close();
    }
    assert.equal((await h.pool.query('SELECT COUNT(*)::int AS n FROM learning_board_members WHERE board_id=$1', [board.id])).rows[0].n, 2);
    assert.deepEqual(errors, []);
    console.log('PASS: signed-in student enters from room/code/link without identity questions; account re-entry, authorship, teacher and guest entry.');
  } finally { await browser?.close(); await h.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
