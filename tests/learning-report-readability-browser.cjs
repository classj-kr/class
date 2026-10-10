'use strict';
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const { harness } = require('./learning-records-integration.cjs');

async function main() {
  const h = await harness(), browser = await chromium.launch({ channel: 'msedge', headless: true });
  const output = path.resolve(__dirname, '../outputs/learning-records-review');
  const request = async (route, body) => {
    const response = await fetch(h.base + '/api/learning-records' + route, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'x-test-user': '1' }, body: JSON.stringify(body)
    });
    const data = await response.json(); assert.equal(response.status, 200, JSON.stringify(data)); return data.session;
  };
  try {
    const math = { window: {} };
    require('node:vm').runInNewContext(fs.readFileSync(path.resolve(__dirname, '../learning/literacy-numeracy/math-ox/data.js'), 'utf8'), math);
    const questions = math.window.MATH_OX_DATA.filter(q => q.subject === '초6' && /\\frac/.test(q.prompt)).slice(0, 5);
    const session = await request('/sessions', { activity: 'math-ox', contentKey: '초6', contentVersion: 'readability-test', title: '수학 기초 OX · 초6', href: '/learning/literacy-numeracy/math-ox/', checkpoint: {} });
    const events = questions.map((q, i) => ({ kind: 'answer', questionKey: String(q.id), response: i === 1 || i === 2 ? (q.answer === 'O' ? 'X' : 'O') : q.answer, snapshot: { prompt: q.prompt } }));
    events.push({ ...events[1], response: questions[1].answer });
    await request(`/sessions/${session.id}/changes`, { revision: 0, mutationId: crypto.randomUUID(), checkpoint: {}, progress: { current: 5, total: 10 }, events });
    const reading = await request('/sessions', { activity: 'world-tales', contentKey: 'jack-beanstalk', contentVersion: 'readability-test', title: '잭과 콩나무', href: '/learning/literacy-numeracy/story-books/world-tales/jack-beanstalk/', checkpoint: {} });
    await request(`/sessions/${reading.id}/changes`, { revision: 0, mutationId: crypto.randomUUID(), checkpoint: {}, progress: { current: 1, total: 10 }, events: [
      { kind: 'read', questionKey: 'chapter-1', response: '1장 · 신기한 콩', snapshot: { title: '1장 · 신기한 콩' } },
      { kind: 'self-assessment', questionKey: 'reflection', response: '<img src=x onerror="window.injected=true">', snapshot: { prompt: '<script>window.injected=true</script>' } }
    ] });
    for (const [activity, title, answers] of [['spelling', '맞춤법', [true, true]], ['sentence-building', '문장 고르기', [false, false, false]], ['proverbs', '속담', []]]) {
      const opened = await request('/sessions', { activity, contentKey: 'rate-check', contentVersion: 'readability-test', title, href: `/learning/literacy-numeracy/${activity}/`, checkpoint: {} });
      if (answers.length) await request(`/sessions/${opened.id}/changes`, { revision: 0, mutationId: crypto.randomUUID(), checkpoint: {}, progress: { current: answers.length, total: answers.length },
        events: answers.map((correct, index) => ({ kind: 'answer', questionKey: `q-${index}`, response: '답', correct, snapshot: { prompt: `문항 ${index + 1}` } })) });
    }
    const context = await browser.newContext({ extraHTTPHeaders: { 'x-test-user': '3' }, viewport: { width: 1440, height: 1000 } });
    // Reports must render math even without access to an external CDN.
    await context.route('https://**', route => route.abort());
    const page = await context.newPage(), errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(h.base + '/classtools/learning-reports.html');
    await page.locator('.record-card').first().waitFor();
    const mathCard = page.locator('.record-card').filter({ hasText: '수학 기초 OX' });
    assert.equal(await mathCard.locator('.rate-value').innerText(), '60%', 'successful retry does not inflate first-attempt accuracy');
    assert.equal(await mathCard.locator('.rate-count').innerText(), '3/5');
    assert.equal(await mathCard.locator('.rate-fill').evaluate(el => el.style.width), '60%');
    const spellingCard = page.locator('.record-card').filter({ hasText: '맞춤법' });
    assert.equal(await spellingCard.locator('.rate-value').innerText(), '100%');
    const wrongCard = page.locator('.record-card').filter({ hasText: '문장 고르기' });
    assert.equal(await wrongCard.locator('.rate-value').innerText(), '0%');
    assert.equal(await wrongCard.locator('.rate-fill').evaluate(el => el.style.width), '0%');
    const emptyCard = page.locator('.record-card').filter({ hasText: '속담' });
    assert.equal(await emptyCard.locator('.rate-value').innerText(), '—');
    assert.equal(await emptyCard.locator('.rate-track,.rate-count').count(), 0, 'no attempts is not zero accuracy');
    assert.equal(await page.locator('.record-card').filter({ hasText: '잭과 콩나무' }).locator('.first-rate').count(), 0, 'reading and self-check are not given a score');
    assert.equal(await page.locator('#summary .rate-value').innerText(), '50%', 'class accuracy uses summed first attempts, not averaged percentages');
    assert.equal(await page.locator('#summary .rate-count').innerText(), '5/10');
    fs.mkdirSync(output, { recursive: true });
    await page.screenshot({ path: path.join(output, 'teacher-rates-desktop.png'), fullPage: true });
    for (const width of [320, 390]) {
      await page.setViewportSize({ width, height: 844 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${width}px: no page overflow`);
      assert.equal(await page.locator('.first-rate').evaluateAll(items => items.some(el => el.scrollWidth > el.clientWidth)), false, `${width}px: rate stays on one line`);
    }
    await page.screenshot({ path: path.join(output, 'teacher-rates-mobile.png'), fullPage: true });
    await page.setViewportSize({ width: 1440, height: 1000 });
    await mathCard.locator('.detail-button').click();
    await page.locator('#detailBody .answer').first().waitFor();
    assert.equal(await page.locator('.answer.correct').count(), 4);
    assert.equal(await page.locator('.answer.incorrect').count(), 2);
    assert.equal(await page.locator('.answer .retry').count(), 1);
    assert.equal(await page.locator('.answer .katex-error').count(), 0);
    assert.ok(await page.locator('.answer .katex .mfrac').count() > 5, 'fractions are typeset');
    const promptText = await page.locator('.answer-prompt').first().innerText();
    assert.doesNotMatch(promptText, /\\frac|\\div|\$/);
    assert.notEqual(await page.locator('.answer.correct .outcome').first().evaluate(el => getComputedStyle(el).backgroundColor), await page.locator('.answer.incorrect .outcome').first().evaluate(el => getComputedStyle(el).backgroundColor));
    fs.mkdirSync(output, { recursive: true });
    await page.screenshot({ path: path.join(output, 'teacher-answers-desktop.png') });
    await page.getByRole('button', { name: '오답 2', exact: true }).click();
    assert.equal(await page.locator('.answer').count(), 2);
    assert.equal(await page.locator('.answer.correct').count(), 0);
    await page.getByRole('button', { name: '재풀이 1', exact: true }).click();
    assert.equal(await page.locator('.answer').count(), 1);
    assert.match(await page.locator('.answer').innerText(), /2번째 풀이/);
    await page.getByRole('button', { name: '전체 6', exact: true }).click();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: path.join(output, 'teacher-answers-mobile.png') });
    assert.equal(await page.locator('#detailBody').evaluate(el => el.scrollWidth > el.clientWidth), false, 'no horizontal modal overflow');
    await page.locator('#detailBody').evaluate(el => { el.scrollTop = el.scrollHeight; });
    assert.ok(await page.locator('#closeDetail').isVisible(), 'close button stays visible while reading');
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#detailDialog').isVisible(), false);
    await page.locator('.record-card').filter({ hasText: '잭과 콩나무' }).locator('.detail-button').click();
    await page.locator('.answer.reading').waitFor();
    assert.equal(await page.locator('.answer.correct,.answer.incorrect').count(), 0, 'reading and self-check are not marked as right/wrong');
    assert.equal(await page.locator('.answer img,.answer script').count(), 0, 'saved text is never interpreted as HTML');
    assert.equal(await page.evaluate(() => window.injected), undefined);
    assert.equal(await page.locator('.answer.reflection').count(), 1);
    assert.deepEqual(errors, []);
    console.log('PASS report readability: weighted first-attempt rates, retries excluded, 0%/100%/no attempts, 320px layout, actual fractional OX records, local math rendering, result colors, wrong/retry filters, safe text, desktop/mobile dialog.');
  } finally { await browser.close(); await h.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
