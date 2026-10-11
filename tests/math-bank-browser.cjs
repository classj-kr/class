// 수학 문제은행을 실제 브라우저로 돌린다. 학생으로 한 판을 풀며 채점·저장·이어 풀기·다시 풀기를 보고,
// 손님(둘러보기)으로도 풀리는지, 휴대폰 너비에서 가로로 넘치지 않는지 본다.
//   node tests/math-bank-browser.cjs          통과하면 {"ok":true}
//   node tests/math-bank-browser.cjs --shots  outputs/math-bank-review 에 화면 사진을 남긴다
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const { harness } = require('./learning-records-integration.cjs');

const SHOTS = process.argv.includes('--shots');
const OUT = path.resolve(__dirname, '../outputs/math-bank-review');
const URL_PATH = '/learning/literacy-numeracy/math-bank/';

(async () => {
  const h = await harness();
  const browser = await chromium.launch({ headless: true, ...(process.platform === 'win32' ? { channel: 'msedge' } : {}) });
  const errors = [];
  if (SHOTS) fs.mkdirSync(OUT, { recursive: true });
  const open = async (user, viewport = { width: 1100, height: 900 }) => {
    const context = await browser.newContext({ viewport, ...(user ? { extraHTTPHeaders: { 'x-test-user': String(user) } } : {}) });
    await context.route('https://**', (route) => route.abort());
    const page = await context.newPage();
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('dialog', (d) => d.accept());
    return { context, page };
  };
  // 지금 열린 판의 문항(답 포함)을 엔진으로 다시 만든다. 씨앗은 서버에 저장된 진도에서 읽는다.
  const roundOf = async (page, group, level) => page.evaluate(async ({ group, level }) => {
    const key = '3-1-1:' + group + ':' + level;
    const data = await (await fetch('/api/learning-records/sessions?activity=math-bank')).json();
    const session = data.sessions.find((s) => s.contentKey === key && s.status === 'active') || data.sessions.find((s) => s.contentKey === key);
    const detail = await (await fetch('/api/learning-records/sessions/' + session.id)).json();
    const seed = detail.session.checkpoint.seed;
    const items = window.MathBank.makeRound(window.MathBank.findUnit('3-1-1'), group, level, seed);
    return { seed, status: session.status, items: items.map((it) => ({ key: it.key, choice: it.choice ? it.choice.answer : null, answers: it.inputs ? it.inputs.map((i) => i.answer) : null })) };
  }, { group, level });
  const solve = async (page, item, wrong = false) => {
    const card = page.locator(`.mb-item[data-key="${item.key}"]`);
    if (item.choice !== null) {
      const count = await card.locator('.mb-choice').count();
      await card.locator('.mb-choice').nth(wrong ? (item.choice + 1) % count : item.choice).click();
    } else {
      const boxes = card.locator('.mb-field input');
      for (let i = 0; i < item.answers.length; i += 1) await boxes.nth(i).fill(String(item.answers[i] + (wrong && i === 0 ? 1 : 0)));
      await card.locator('.mb-primary').click();
    }
    await card.locator('.mb-result:not([hidden])').waitFor({ timeout: 10000 });
    await page.locator('learning-records .status').filter({ hasText: '저장 완료' }).waitFor({ timeout: 10000 });
  };

  try {
    // ── 학생: 묶음 목록 → 한 판 ──
    const { page } = await open(1);
    await page.goto(h.base + URL_PATH);
    await page.locator('.mb-group').first().waitFor();
    assert.equal(await page.locator('.mb-group').count(), 8, '묶음 여덟 개');
    assert.equal(await page.locator('.mb-group').first().locator('.mb-level').count(), 1, '첫 묶음은 기본만');
    assert.equal(await page.locator('.mb-group').nth(1).locator('.mb-level').count(), 2, '둘째 묶음은 기본·실력');
    assert.equal(await page.locator('#unitSelect').inputValue(), '3-1-1');
    if (SHOTS) await page.screenshot({ path: path.join(OUT, '1-groups.png') });

    await page.locator('.mb-group').first().locator('.mb-level').click();
    await page.locator('.mb-item').first().waitFor();
    let round = await roundOf(page, 'add0', '기본');
    assert.equal(await page.locator('.mb-item').count(), round.items.length);
    assert.equal(await page.locator('.mb-blocks svg').count(), 2, '수 모형 그림 둘');
    assert.equal(await page.locator('#finish').isHidden(), true);
    if (SHOTS) await page.screenshot({ path: path.join(OUT, '2-round.png'), fullPage: true });

    // 빈칸으로 확인을 누르면 채점하지 않는다.
    await page.locator('.mb-item').first().locator('.mb-primary').click();
    assert.equal(await page.locator('.mb-item.is-right, .mb-item.is-wrong').count(), 0);

    // 첫 문항은 일부러 틀리고, 둘은 맞힌다.
    await solve(page, round.items[0], true);
    assert.equal(await page.locator('.mb-item').first().evaluate((el) => el.classList.contains('is-wrong')), true);
    assert.match(await page.locator('.mb-item').first().locator('.mb-result').innerText(), new RegExp('답: ' + round.items[0].answers[0]));
    await solve(page, round.items[1]);
    await solve(page, round.items[2]);
    assert.match(await page.locator('.mb-item').nth(1).locator('.mb-result').innerText(), /정답/);
    assert.equal(await page.locator('.mb-item').nth(1).locator('input').isDisabled(), true, '답한 문항은 잠긴다');

    // 새로 고침 해도 같은 문제와 답한 것이 그대로다(씨앗과 답이 서버에 있다).
    assert.match(page.url(), /record=3-1-1%3Aadd0%3A%EA%B8%B0%EB%B3%B8|record=3-1-1:add0:/);
    const before = await page.locator('.mb-item').evaluateAll((els) => els.map((el) => el.querySelector('.mb-text').textContent + (el.querySelector('.mb-figure')?.textContent || '')));
    await page.reload();
    await page.locator('.mb-item').first().waitFor();
    const after = await page.locator('.mb-item').evaluateAll((els) => els.map((el) => el.querySelector('.mb-text').textContent + (el.querySelector('.mb-figure')?.textContent || '')));
    assert.deepEqual(after, before, '이어 풀 때 같은 문제');
    assert.equal(await page.locator('.mb-item.is-wrong').count(), 1);
    assert.equal(await page.locator('.mb-item.is-right').count(), 2);

    // 나머지를 다 풀면 결과가 나오고 판이 끝난다.
    for (const item of round.items.slice(3)) await solve(page, item);
    await page.locator('#finish:not([hidden])').waitFor();
    assert.match(await page.locator('#finish').innerText(), new RegExp(round.items.length + '문항 중 ' + (round.items.length - 1) + '문항 정답'));
    assert.equal(await page.locator('#finish button', { hasText: '실력 문제 풀기' }).count(), 0, '실력이 없는 묶음에는 단추가 없다');
    assert.equal((await roundOf(page, 'add0', '기본')).status, 'completed');
    if (SHOTS) await page.screenshot({ path: path.join(OUT, '3-finished.png'), fullPage: true });

    // 새 문제로 다시 풀기: 수가 바뀐다.
    await page.locator('#finish button', { hasText: '새 문제로 다시 풀기' }).click();
    await page.locator('.mb-item').first().waitFor();
    await page.waitForFunction(() => document.querySelectorAll('.mb-item.is-right, .mb-item.is-wrong').length === 0);
    const again = await roundOf(page, 'add0', '기본');
    assert.notEqual(again.seed, round.seed, '새 씨앗');
    assert.equal(again.status, 'active');

    // 사이트 공용 뒤로가기: 푸는 중에는 묶음 목록으로 한 칸만.
    const prevented = await page.evaluate(() => !window.dispatchEvent(new CustomEvent('sitebackrequest', { bubbles: true, cancelable: true })));
    assert.equal(prevented, true);
    await page.locator('.mb-group').first().waitFor();
    assert.match(await page.locator('.mb-group').first().locator('.mb-level').innerText(), new RegExp((round.items.length - 1) + ' / ' + round.items.length), '끝낸 판의 결과가 단추에 보인다');
    assert.equal(await page.evaluate(() => !window.dispatchEvent(new CustomEvent('sitebackrequest', { bubbles: true, cancelable: true }))), false, '목록에서는 가로채지 않는다');

    // 고르기 문항이 있는 판과 실력 판.
    await page.locator('.mb-group').nth(1).locator('.mb-level', { hasText: '기본' }).click();
    await page.locator('.mb-item').first().waitFor();
    round = await roundOf(page, 'add1', '기본');
    const choiceItem = round.items.find((it) => it.choice !== null);
    await solve(page, choiceItem, true);
    const card = page.locator(`.mb-item[data-key="${choiceItem.key}"]`);
    assert.equal(await card.locator('.mb-choice.is-answer').count(), 1);
    assert.equal(await card.locator('.mb-choice.is-picked').count(), 1);
    for (const item of round.items.filter((it) => it !== choiceItem)) await solve(page, item);
    await page.locator('#finish button', { hasText: '실력 문제 풀기' }).click();
    await page.locator('.mb-column .mb-box').first().waitFor();
    round = await roundOf(page, 'add1', '실력');
    for (const item of round.items) await solve(page, item);
    assert.match(await page.locator('#finish').innerText(), /2문항 중 2문항 정답/);
    if (SHOTS) await page.screenshot({ path: path.join(OUT, '4-hard.png'), fullPage: true });

    // ── 손님(둘러보기): 저장 없이도 풀린다 ──
    const guest = await open(0);
    await guest.page.goto(h.base + URL_PATH);
    await guest.page.locator('.mb-group').nth(6).locator('.mb-level', { hasText: '실력' }).click();
    await guest.page.locator('.mb-item').first().waitFor();
    await guest.page.locator('learning-records .status').filter({ hasText: '둘러보기' }).waitFor();
    await guest.page.locator('.mb-item').first().locator('.mb-choice').first().click();
    await guest.page.locator('.mb-item').first().locator('.mb-result:not([hidden])').waitFor();
    if (SHOTS) await guest.page.screenshot({ path: path.join(OUT, '5-guest-budget.png'), fullPage: true });

    // ── 휴대폰 너비: 어느 판도 가로로 넘치지 않는다 ──
    const phone = await open(0, { width: 360, height: 760 });
    await phone.page.goto(h.base + URL_PATH);
    const groups = await phone.page.locator('.mb-group').count();
    for (let g = 0; g < groups; g += 1) {
      const levels = await phone.page.locator('.mb-group').nth(g).locator('.mb-level').count();
      for (let l = 0; l < levels; l += 1) {
        await phone.page.locator('.mb-group').nth(g).locator('.mb-level').nth(l).click();
        await phone.page.locator('.mb-item').first().waitFor();
        const overflow = await phone.page.evaluate(() => {
          const wide = [...document.querySelectorAll('.mb-item, .mb-item *')].filter((el) => el.getBoundingClientRect().right > document.documentElement.clientWidth + 1);
          return { page: document.documentElement.scrollWidth - document.documentElement.clientWidth, wide: wide.slice(0, 3).map((el) => el.className + ':' + Math.round(el.getBoundingClientRect().right)) };
        });
        assert.deepEqual(overflow, { page: 0, wide: [] }, `휴대폰 너비에서 넘침 (묶음 ${g + 1}, 수준 ${l + 1})`);
        if (SHOTS && (g === 1 || g === 7)) await phone.page.screenshot({ path: path.join(OUT, `6-phone-${g + 1}-${l + 1}.png`), fullPage: true });
        await phone.page.evaluate(() => window.dispatchEvent(new CustomEvent('sitebackrequest', { bubbles: true, cancelable: true })));
        await phone.page.locator('.mb-group').first().waitFor();
      }
    }
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ ok: true }));
  } finally {
    await browser.close();
    await h.close();
  }
})().catch((error) => { console.error(error); process.exit(1); });
