const { chromium } = require('../game-hub-server/node_modules/playwright');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  try {
    for (const game of ['omok', 'reversi', 'chess', 'janggi', 'baduk']) {
      const page = await browser.newPage();
      const errors = [];
      let workers = 0;
      page.on('pageerror', error => errors.push(error.message));
      page.on('worker', () => workers++);
      const file = game === 'baduk' ? 'baduk.html' : 'coach.html';
      await page.goto(`http://127.0.0.1:8937/learning/games/board-coach/${file}?game=${game}`);
      await page.locator('html[data-coach-state="ready"]').waitFor();
      assert.equal(await page.locator('#startLearning').textContent(), '시작');

      // Closing before the first start must neither apply AI-first nor run AI.
      await page.locator('input[name="color"][value="2"]').check();
      await page.locator('#closeSetup').click();
      await page.waitForTimeout(700);
      assert.match(await page.locator('#turn').textContent(), /골라 시작하세요/);
      assert.equal(workers, 0);
      assert.equal(await page.locator('#hint').isDisabled(), true);

      await page.locator('#newGame').click();
      await page.locator('input[name="color"][value="1"]').check();
      await page.locator('#startLearning').click();
      assert.match(await page.locator('#turn').textContent(), /내 차례/);
      assert.equal(await page.locator('#hint').isEnabled(), true);
      const before = await page.locator('#board').innerHTML();
      const levelBefore = await page.locator('#levelLabel').textContent();

      // Dismissed changes must not reset the board, change sides or apply level.
      await page.locator('#newGame').click();
      await page.locator('input[name="color"][value="2"]').check();
      await page.locator('input[name="level"][value="advanced"]').check();
      await page.locator('#closeSetup').click();
      await page.waitForTimeout(700);
      assert.match(await page.locator('#turn').textContent(), /내 차례/);
      assert.equal(await page.locator('#board').innerHTML(), before);
      assert.equal(await page.locator('#levelLabel').textContent(), levelBefore);
      assert.equal(workers, 0);

      // Only Start applies the newly selected level.
      await page.locator('#newGame').click();
      await page.locator('input[name="color"][value="1"]').check();
      await page.locator('#startLearning').click();
      assert.notEqual(await page.locator('#levelLabel').textContent(), levelBefore);
      assert.match(await page.locator('#turn').textContent(), /내 차례/);
      assert.deepEqual(errors, []);
      console.log(`PASS ${game}: close leaves game/settings unchanged; Start applies settings`);
      await page.close();
    }
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });

