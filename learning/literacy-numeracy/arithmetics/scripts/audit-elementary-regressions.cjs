const assert = require('node:assert/strict');
const { chromium } = require('../../../../game-hub-server/node_modules/playwright');

async function main() {
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const base = process.env.ARITHMETIC_AUDIT_URL || 'http://localhost:6180';
  page.on('dialog', dialog => dialog.accept());
  const grade = () => page.getByRole('button', { name: '전체 채점', exact: true }).click();
  const score = () => page.locator('.counting-progress').textContent();
  const fresh = async seed => {
    await page.evaluate(seed => { Date.now = () => seed; Math.random = () => 0; }, seed);
    await page.getByRole('button', { name: '새 문제', exact: true }).click();
  };
  try {
    for (const route of ['add-subtract-1', 'add-subtract-2', 'add-subtract-3', 'add-subtract-4', 'grade-2-add-subtract-3']) {
      await page.goto(`${base}/arithmetic/${route}`, { waitUntil: 'networkidle' });
      for (const seed of [null, 0, 20260930]) {
        if (seed !== null) await fresh(seed);
        const rows = page.locator('.worksheet-stage .addsub-equation-row');
        assert.equal(await rows.count(), 30);
        for (let index = 0; index < 30; index++) {
          const row = rows.nth(index);
          assert.equal(await row.locator('input').count(), 1, `${route}: row ${index + 1}`);
          const answer = await row.evaluate(row => {
            const fields = [...row.children].slice(0, 5);
            const blank = fields.findIndex(field => field.tagName === 'INPUT');
            const [left, right, result] = [0, 2, 4].map(i => Number(fields[i].textContent));
            const add = fields[1].textContent === '+';
            return blank === 4 ? (add ? left + right : left - right)
              : blank === 0 ? (add ? result - right : result + right)
                : (add ? result - left : left - result);
          });
          await row.locator('input').fill(String(answer));
        }
        await grade();
        assert.match(await score(), /^30\/30/);
        assert.equal(await rows.locator('.counting-result.correct').count(), 30);
      }
      console.log(`${route}: one solvable blank per row, independent answers, initial and new sets PASS`);
    }

    await page.goto(`${base}/arithmetic/grade-2-add-subtract-2`, { waitUntil: 'networkidle' });
    const digits = page.locator('.worksheet-stage .digit-input');
    const digitAnswers = await page.locator('.answer-stage .digit-static-answer').allTextContents();
    assert.equal(await page.locator('.worksheet-stage .digit-equation').count(), 12);
    await grade();
    assert.match(await score(), /^0\/12/);
    await digits.nth(0).fill(digitAnswers[0]);
    await grade();
    assert.match(await score(), /^0\/12/);
    await digits.nth(1).fill(digitAnswers[1]);
    await grade();
    assert.match(await score(), /^1\/12/);
    for (let index = 2; index < digitAnswers.length; index++) await digits.nth(index).fill(digitAnswers[index]);
    await grade();
    assert.match(await score(), /^12\/12/);
    await digits.nth(0).fill(String((Number(digitAnswers[0]) + 1) % 10));
    assert.match(await score(), /^11\/12/);
    await grade();
    assert.match(await score(), /^11\/12/);
    await fresh(20260930);
    assert.match(await score(), /^0\/12/);
    console.log('grade-2-add-subtract-2: partial answers, whole-problem score, correction and reset PASS');

    await page.goto(`${base}/arithmetic/grade-3-time-2`, { waitUntil: 'networkidle' });
    for (const seed of [null, 0, 2, 20260930]) {
      if (seed !== null) await fresh(seed);
      const problems = await page.locator('.worksheet-stage .time-calculation-question').evaluateAll(rows => rows.map(row => {
        const lines = [...row.querySelectorAll('.time-calculation-value')];
        const seconds = text => [...text.matchAll(/(\d+)(시간|분|초)/g)]
          .reduce((sum, [, value, unit]) => sum + Number(value) * ({ 시간: 3600, 분: 60, 초: 1 })[unit], 0);
        const operator = row.querySelectorAll('.time-calculation-line b')[1].textContent;
        let total = seconds(lines[0].textContent) + (operator === '+' ? 1 : -1) * seconds(lines[1].textContent);
        return [...lines[2].querySelectorAll('input')].map(input => {
          const label = input.getAttribute('aria-label');
          const unit = label.split(' ').at(-2);
          const factor = ({ 시간: 3600, 분: 60, 초: 1 })[unit];
          const answer = Math.floor(total / factor);
          total %= factor;
          if (unit !== '시간' && answer >= 60) throw new Error(`Missing carry field: ${label}`);
          return { label, answer: String(answer), maxLength: input.maxLength };
        });
      }));
      const answers = problems.flat();
      assert.equal(problems.length, 8);
      assert.deepEqual(await page.locator('.answer-stage .time-calculation-static').allTextContents(), answers.map(a => a.answer));
      for (const { label, answer, maxLength } of answers) {
        assert.ok(answer.length <= maxLength, `${label}: ${answer} fits`);
        await page.getByRole('textbox', { name: label, exact: true }).fill(answer);
        assert.equal(await page.getByRole('textbox', { name: label, exact: true }).inputValue(), answer);
      }
      await grade();
      assert.match(await score(), /^8\/8/);
      const carriedHours = page.getByRole('textbox', { name: 'grade-three-time-two-ms-add-0 시간 답', exact: true });
      const carriedMinutes = page.getByRole('textbox', { name: 'grade-three-time-two-ms-add-0 분 답', exact: true });
      const expectedHours = await carriedHours.inputValue();
      const expectedMinutes = await carriedMinutes.inputValue();
      if (seed === null) {
        assert.equal(expectedHours, '1');
        assert.equal(expectedMinutes, '22');
        assert.equal(await page.getByRole('textbox', { name: 'grade-three-time-two-ms-add-0 초 답', exact: true }).inputValue(), '54');
        await carriedHours.fill('0');
        await carriedMinutes.fill('82');
        await grade();
        assert.match(await score(), /^7\/8/);
        await carriedHours.fill(expectedHours);
        await carriedMinutes.fill(expectedMinutes);
        await grade();
        assert.match(await score(), /^8\/8/);
        await page.screenshot({ path: 'tmp/time-carry-mobile.png', fullPage: true });
      }
      await carriedHours.fill('');
      await grade();
      assert.match(await score(), /^7\/8/);
      await page.getByRole('button', { name: '다시 쓰기', exact: true }).click();
      assert.match(await score(), /^0\/8/);
    }
    console.log('grade-3-time-2: seconds/minutes carry, hour answer field, printed answers, uncarried-answer rejection and reset PASS');
  } finally {
    await browser.close();
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
