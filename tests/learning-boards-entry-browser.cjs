const assert = require('node:assert/strict');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const { createHarness } = require('./learning-boards-harness.cjs');

(async () => {
  const h = await createHarness({ studentSiteAccess: true });
  let browser;
  try {
    const create = async () => {
      const response = await fetch(h.base + '/api/boards/', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: 'test_teacher=1' },
        body: JSON.stringify({ title: '입장 확인', layout: 'wall', slots: 30 })
      });
      assert.equal(response.status, 201);
      return (await response.json()).board;
    };
    const current = await create(), legacy = await create();
    legacy.code = '123456';
    await h.pool.query('UPDATE learning_boards SET code=$2 WHERE id=$1', [legacy.id, legacy.code]);
    browser = await chromium.launch({ headless: true, ...(process.platform === 'win32' ? { channel: 'msedge' } : {}) });
    const errors = [];
    let number = 0;
    for (const board of [legacy, current]) {
      for (const entry of ['manual', 'room', 'invitation']) {
        const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
        const page = await context.newPage();
        page.on('pageerror', e => errors.push(e.message));
        await page.goto(h.base + (entry === 'room' ? '/room/' : entry === 'invitation' ? '/boards/?code=' + board.code : '/boards/'));
        if (entry !== 'invitation') {
          const input = page.locator(entry === 'room' ? '#roomCode' : '#joinCode');
          await input.pressSequentially(board.code);
          assert.equal(await input.inputValue(), board.code, `${entry}: all digits must survive typing`);
        }
        if (entry === 'room') {
          await page.locator('#roomForm button').click();
          await page.waitForURL('**/boards/?code=' + board.code);
        }
        assert.equal(await page.locator('#joinCode').inputValue(), board.code);
        await page.locator('#joinNumber').fill(String(++number));
        await page.locator('#joinName').fill('학생');
        await page.locator('#joinForm button').click();
        await page.locator('#boardView').waitFor({ state: 'visible' });
        assert.equal(await page.locator('#boardCode').innerText(), board.code);
        await page.locator('#writePost').click();
        const content = `입장 후 작성 ${number}`;
        await page.locator('#postContent').fill(content);
        await page.locator('#submitPost').click();
        await page.getByText(content, { exact: true }).waitFor();
        await page.reload();
        await page.locator('#boardView').waitFor({ state: 'visible' });
        await context.close();
      }
    }
    // Correcting an old invitation to a new code must not leave a six-digit-only pattern.
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(h.base + '/boards/?code=' + legacy.code);
    await page.locator('#joinCode').fill(current.code);
    await page.locator('#joinNumber').fill('20');
    await page.locator('#joinName').fill('학생');
    await page.locator('#joinForm button').click();
    await page.locator('#boardView').waitFor({ state: 'visible' });
    assert.equal(await page.locator('#boardCode').innerText(), current.code);
    assert.deepEqual(errors, []);
    console.log('PASS: four/six-digit manual entry, common room entry, invitation, post, reload, corrected invitation.');
  } finally { await browser?.close(); await h.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
