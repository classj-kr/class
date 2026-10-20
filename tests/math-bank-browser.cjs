// 「수학 문제」를 실제 브라우저로 돌린다. 학생으로 한 회차를 풀며 채점·저장·이어 풀기·다시 풀기를 보고,
// 손님(둘러보기)으로도 풀리는지, 모든 회차가 휴대폰 너비에서 가로로 넘치지 않는지 본다.
//   node tests/math-bank-browser.cjs          통과하면 {"ok":true}
//   node tests/math-bank-browser.cjs --shots  outputs/math-bank-review 에 화면 사진을 무손실 WebP로 남긴다(모든 회차)
//   node tests/math-bank-browser.cjs --feedback-only  오답·힌트·재시도·기록과 대표 화면만 검사한다.
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const { harness } = require('./learning-records-integration.cjs');

const SHOTS = process.argv.includes('--shots');
const FEEDBACK_ONLY = process.argv.includes('--feedback-only');
const OUT = path.resolve(__dirname, '../outputs/math-bank-review');
// 화면 사진은 무손실 WebP로 남긴다. 브라우저는 PNG로만 찍으므로 메모리에서 바꾸어 저장하고, 화소가 같은지 확인한다.
const TO_WEBP = "import io,sys;from PIL import Image;im=Image.open(io.BytesIO(sys.stdin.buffer.read())).convert('RGBA');im.save(sys.argv[1],format='WEBP',lossless=True);out=Image.open(sys.argv[1]).convert('RGBA');assert im.size==out.size and im.tobytes()==out.tobytes()";
async function shot(page, name) {
  const png = await page.screenshot({ fullPage: true });
  const result = spawnSync(process.env.PYTHON || 'python', ['-c', TO_WEBP, path.join(OUT, name + '.webp')], { input: png });
  assert.equal(result.status, 0, 'WebP 저장 실패: ' + String(result.stderr));
}
const URL_PATH = '/learning/literacy-numeracy/math-bank/';
// 화면이 처음 여는 단원(은행의 첫 단원).
const UNIT = '1-1-1';

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
  // 은행의 얼개(묶음·수준·회차 수)와 한 회차의 문항(답 포함)을 엔진에서 읽는다.
  const outline = (page, unitId = UNIT) => page.evaluate((unitId) => {
    const B = window.MathBank, unit = B.findUnit(unitId);
    return unit.groups.map((group) => ({ id: group.id, rounds: B.LEVELS.flatMap((level) => Array.from({ length: B.roundCount(unit, group.id, level) }, (_, i) => ({ level, no: i + 1, of: B.roundCount(unit, group.id, level) }))) }));
  }, unitId);
  const itemsOf = (page, group, level, no) => page.evaluate(({ unitId, group, level, no }) => {
    const B = window.MathBank;
    return B.makeRound(B.findUnit(unitId), group, level, no).map((it) => ({ key: it.key, choice: it.choice ? it.choice.answer : null, answers: it.inputs ? it.inputs.map((i) => i.answer) : null }));
  }, { unitId: UNIT, group, level, no });
  const statusOf = (page, key) => page.evaluate(async (key) => {
    const data = await (await fetch('/api/learning-records/sessions?activity=math-bank')).json();
    return data.sessions.filter((s) => s.contentKey === key).map((s) => s.status);
  }, key);
  const sessionOf = (page, key) => page.evaluate(async (key) => {
    const data = await (await fetch('/api/learning-records/sessions?activity=math-bank')).json();
    const session = data.sessions.find((s) => s.contentKey === key);
    return (await (await fetch('/api/learning-records/sessions/' + session.id)).json()).session;
  }, key);
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
    await page.waitForFunction(() => !document.getElementById('main').inert);
    await page.locator('learning-records .status').filter({ hasText: '저장 완료' }).waitFor({ timeout: 10000 });
  };
  const texts = (page) => page.locator('.mb-item').evaluateAll((els) => els.map((el) => el.querySelector('.mb-text').textContent + (el.querySelector('.mb-figure')?.textContent || '')));

  try {
    // ── 학생: 묶음 목록 → 한 회차 ──
    const { page } = await open(1);
    await page.goto(h.base + URL_PATH + '?unit=' + UNIT);
    await page.locator('.mb-group:not(.mb-ox-group)').first().waitFor();
    const plan = await outline(page);
    assert.equal(await page.locator('.mb-group:not(.mb-ox-group)').count(), plan.length);
    for (let g = 0; g < plan.length; g += 1) assert.equal(await page.locator('.mb-group:not(.mb-ox-group)').nth(g).locator('.mb-level').count(), plan[g].rounds.length, `묶음 ${g + 1}의 단추 수`);
    assert.ok(plan.every((group) => group.rounds.length >= 1), '빈 묶음이 없다');
    assert.ok(plan.some((group) => group.rounds.some((r) => r.level === '실력')), '실력 문제가 있다');
    assert.equal(await page.locator('#unitSelect').inputValue(), UNIT);
    if (SHOTS) await shot(page, '0-groups');

    const first = plan[0], firstKey = `${UNIT}:${first.id}:기본:1`;
    await page.locator('.mb-group:not(.mb-ox-group)').first().locator('.mb-level').first().click();
    await page.locator('.mb-item').first().waitFor();
    const items = await itemsOf(page, first.id, '기본', 1);
    assert.equal(await page.locator('.mb-item').count(), items.length);
    assert.ok(items.length >= 4, '첫 회차 문항 수: ' + items.length);
    assert.equal(await page.locator('#finish').isHidden(), true);

    // 빈칸으로 확인을 누르면 채점하지 않는다.
    const typed = items.find((it) => it.choice === null);
    await page.locator(`.mb-item[data-key="${typed.key}"] .mb-primary`).click();
    assert.equal(await page.locator('.mb-item.is-right, .mb-item.is-wrong').count(), 0);

    // 첫 문항은 일부러 틀리고, 둘은 맞힌다.
    await solve(page, items[0], true);
    assert.equal(await page.locator('.mb-item').first().evaluate((el) => el.classList.contains('is-wrong')), true);
    const wrongCard = page.locator('.mb-item').first();
    assert.match(await wrongCard.locator('.mb-result').innerText(), /힌트/);
    assert.doesNotMatch(await wrongCard.locator('.mb-result').innerText(), /답: /);
    assert.equal(await wrongCard.locator('.mb-choice.is-answer').count(), 0, '정답 보기를 표시하지 않는다');
    assert.equal(await wrongCard.locator('input, .mb-choice').first().isEnabled(), true, '오답은 바로 수정할 수 있다');
    await solve(page, items[0], true);
    assert.doesNotMatch(await wrongCard.locator('.mb-result').innerText(), /답: /, '여러 번 틀려도 자동 공개하지 않는다');
    await solve(page, items[1]);
    await solve(page, items[2]);
    assert.match(await page.locator('.mb-item').nth(1).locator('.mb-result').innerText(), /정답/);
    assert.equal(await page.locator('.mb-item').nth(1).locator('input, .mb-choice').first().isDisabled(), true, '답한 문항은 잠긴다');

    // 새로 고침 해도 같은 문제와 답한 것이 그대로다(답이 서버에 있다).
    assert.match(decodeURIComponent(page.url()), new RegExp('record=' + firstKey));
    const before = await texts(page);
    await page.reload();
    await page.locator('.mb-item').first().waitFor();
    assert.deepEqual(await texts(page), before, '이어 풀 때 같은 문제');
    assert.equal(await page.locator('.mb-item.is-wrong').count(), 1);
    assert.equal(await page.locator('.mb-item.is-right').count(), 2);
    assert.equal(await wrongCard.locator('input, .mb-choice').first().isEnabled(), true, '새로고침 뒤에도 힌트와 재시도 유지');
    assert.doesNotMatch(await wrongCard.locator('.mb-result').innerText(), /답: /);

    // 나머지를 다 풀면 결과가 나오고 회차가 끝난다.
    for (const item of items.slice(3)) await solve(page, item);
    assert.equal(await page.locator('#finish').isHidden(), true, '해결하지 않은 오답이 남으면 회차를 완료하지 않는다');
    assert.deepEqual(await statusOf(page, firstKey), ['active']);
    await solve(page, items[0]);
    assert.match(await wrongCard.locator('.mb-result').innerText(), /다시 풀어 맞혔어요/);
    await page.locator('#finish:not([hidden])').waitFor();
    assert.match(await page.locator('#finish').innerText(), new RegExp(items.length + '문항 중 ' + (items.length - 1) + '문항 정답'));
    assert.deepEqual(await statusOf(page, firstKey), ['completed']);
    const savedSession = await sessionOf(page, firstKey);
    assert.equal(savedSession.summary.firstCorrect, items.length - 1, '힌트 후 맞혀도 최초 정답 수를 올리지 않는다');
    assert.equal(savedSession.summary.retryCount, 2);
    assert.equal(savedSession.summary.solvedAfterRetry, 1);
    assert.equal(savedSession.summary.hints, 1, '자동 표시한 힌트도 기록한다');
    assert.equal(savedSession.checkpoint.answers[items[0].key].firstOk, false);
    assert.equal(savedSession.checkpoint.answers[items[0].key].hinted, true);
    assert.doesNotMatch(await page.locator('#main').innerText(), /오답으로 기록|오답 기록.*유지|처음 풀이 기준/);
    if (SHOTS) await shot(page, '0-finished');

    // 다시 풀기: 같은 문제가 빈 채로 다시 열리고 새 기록이 생긴다.
    await page.locator('#finish button', { hasText: '다시 풀기' }).click();
    await page.waitForFunction(() => document.querySelectorAll('.mb-item').length > 0 && document.querySelectorAll('.mb-item.is-right, .mb-item.is-wrong').length === 0);
    assert.deepEqual(await texts(page), before, '회차의 문제는 정해져 있다');
    assert.deepEqual((await statusOf(page, firstKey)).sort(), ['active', 'completed']);

    // 사이트 공용 뒤로가기: 푸는 중에는 묶음 목록으로 한 칸만.
    const prevented = await page.evaluate(() => !window.dispatchEvent(new CustomEvent('sitebackrequest', { bubbles: true, cancelable: true })));
    assert.equal(prevented, true);
    await page.locator('.mb-group:not(.mb-ox-group)').first().waitFor();
    assert.match(await page.locator('.mb-group:not(.mb-ox-group)').first().locator('.mb-level').first().innerText(), new RegExp((items.length - 1) + ' / ' + items.length), '끝낸 회차의 결과가 단추에 보인다');
    assert.equal(await page.evaluate(() => !window.dispatchEvent(new CustomEvent('sitebackrequest', { bubbles: true, cancelable: true }))), false, '목록에서는 가로채지 않는다');

    // 회차가 여럿인 묶음: 오답의 정답은 명시적으로 풀이 보기를 누른 뒤에만 표시한다.
    const g = plan.findIndex((group) => group.rounds.some((r) => r.of > 1));
    if (g >= 0) {
      const target = plan[g].rounds.find((r) => r.of > 1 && r.no === 1);
      const index = plan[g].rounds.indexOf(target);
      await page.locator('.mb-group:not(.mb-ox-group)').nth(g).locator('.mb-level').nth(index).click();
      await page.locator('.mb-item').first().waitFor();
      assert.match(await page.locator('.mb-round-title').innerText(), new RegExp(target.level + ' 1회'));
      const list = await itemsOf(page, plan[g].id, target.level, 1);
      const choiceItem = list.find((it) => it.choice !== null);
      if (choiceItem) {
        await solve(page, choiceItem, true);
        const card = page.locator(`.mb-item[data-key="${choiceItem.key}"]`);
        assert.equal(await card.locator('.mb-choice.is-answer').count(), 0);
        assert.equal(await card.locator('.mb-choice.is-picked').count(), 1);
        await card.locator('.mb-reveal').click();
        await page.waitForFunction(() => !document.getElementById('main').inert);
        assert.equal(await card.locator('.mb-choice.is-answer').count(), 1);
        assert.match(await card.locator('.mb-result').innerText(), /답: /);
        assert.equal(await card.locator('.mb-choice').first().isDisabled(), true);
        await page.reload();
        await page.locator('.mb-item').first().waitFor();
        assert.match(await card.locator('.mb-result').innerText(), /답: /, '직접 확인한 풀이의 상태도 복원한다');
      }
      for (const item of list.filter((it) => it !== choiceItem)) await solve(page, item);
      await page.locator('#finish button', { hasText: '다음 회차' }).click();
      await page.waitForFunction(() => /2회/.test(document.querySelector('.mb-round-title')?.textContent || ''));
      const second = await itemsOf(page, plan[g].id, target.level, 2);
      assert.equal(await page.locator('.mb-item').count(), second.length);
      assert.equal(second.some((it) => list.some((x) => x.key === it.key)), false, '회차끼리 문항이 겹치지 않는다');
    }

    // ── 손님(둘러보기): 저장 없이도 풀린다 ──
    const guest = await open(0);
    await guest.page.goto(h.base + URL_PATH + '?unit=' + UNIT);
    const hardAt = plan.findIndex((group) => group.rounds.some((r) => r.level === '실력'));
    await guest.page.locator('.mb-group:not(.mb-ox-group)').nth(hardAt).locator('.mb-level.is-hard').first().click();
    await guest.page.locator('.mb-item').first().waitFor();
    await guest.page.locator('learning-records .status').filter({ hasText: '둘러보기' }).waitFor();
    const guestItems = await itemsOf(guest.page, plan[hardAt].id, '실력', 1);
    const guestCard = guest.page.locator(`.mb-item[data-key="${guestItems[0].key}"]`);
    if (guestItems[0].choice !== null) await guestCard.locator('.mb-choice').first().click();
    else { const boxes = guestCard.locator('.mb-field input'); for (let i = 0; i < guestItems[0].answers.length; i += 1) await boxes.nth(i).fill(String(guestItems[0].answers[i])); await guestCard.locator('.mb-primary').click(); }
    await guestCard.locator('.mb-result:not([hidden])').waitFor();

    // 아직 쌍둥이가 준비되지 않은 학년의 경계를 가상 데이터로 확인한다.
    const excluded = await open(0);
    await excluded.page.goto(h.base + URL_PATH + '?unit=' + UNIT);
    await excluded.page.locator('.mb-group:not(.mb-ox-group)').first().waitFor();
    await excluded.page.evaluate((id) => { const unit = window.MathBank.findUnit(id); unit.grade = 11; unit.semester = 1; }, UNIT);
    await excluded.page.locator('.mb-group:not(.mb-ox-group)').first().locator('.mb-level').first().click();
    const excludedCard = excluded.page.locator(`.mb-item[data-key="${items[0].key}"]`);
    if (items[0].choice !== null) await excludedCard.locator('.mb-choice').nth((items[0].choice + 1) % await excludedCard.locator('.mb-choice').count()).click();
    else {
      for (let i = 0; i < items[0].answers.length; i += 1) await excludedCard.locator('.mb-field input').nth(i).fill(String(items[0].answers[i] + (i === 0 ? 1 : 0)));
      await excludedCard.locator('.mb-primary').click();
    }
    await excluded.page.waitForFunction(() => !document.getElementById('main').inert);
    assert.match(await excludedCard.locator('.mb-result').innerText(), /답: /, '준비되지 않은 학년은 기존 오답 표시를 유지한다');
    assert.equal(await excludedCard.locator('.mb-hint').count(), 0);
    assert.equal(await excludedCard.locator('input, .mb-choice').first().isDisabled(), true);
    await excluded.context.close();

    // ── 모든 단원의 모든 회차를 열어 본다: 휴대폰 너비에서 가로로 넘치지 않고, 그림이 제 크기로 그려진다 ──
    // 단원 파일은 고른 학기의 것만 불러오므로, 단원 번호는 index.html 의 목록에서 얻는다.
    const unitIds = await page.evaluate(() => window.MathBank.lazy.ids());
    for (const [name, viewport] of [['phone', { width: 360, height: 760 }], ['wide', { width: 1100, height: 900 }]]) {
      const view = await open(0, viewport);
      await view.page.goto(h.base + URL_PATH);
      await view.page.locator('.mb-group:not(.mb-ox-group)').first().waitFor();
      for (const unitId of FEEDBACK_ONLY ? [UNIT, '7-2-4'] : unitIds) {
        const termOf = unitId.split('-').slice(0, 2).join('-');
        await view.page.selectOption('#termSelect', termOf);
        await view.page.selectOption('#unitSelect', unitId);
        await view.page.waitForFunction((id) => new URL(location.href).searchParams.get('unit') === id && document.querySelectorAll('.mb-group:not(.mb-ox-group)').length > 0, unitId);
        const groups = await outline(view.page, unitId);
        assert.equal(await view.page.locator('.mb-group:not(.mb-ox-group)').count(), groups.length, unitId + ' 묶음 수');
        for (let gi = 0; gi < (FEEDBACK_ONLY ? 1 : groups.length); gi += 1) {
          for (let li = 0; li < (FEEDBACK_ONLY ? 1 : groups[gi].rounds.length); li += 1) {
            await view.page.locator('.mb-group:not(.mb-ox-group)').nth(gi).locator('.mb-level').nth(li).click();
            await view.page.locator('.mb-item').first().waitFor();
            const report = await view.page.evaluate(() => {
              const wide = [...document.querySelectorAll('.mb-item, .mb-item *')].filter((el) => el.getBoundingClientRect().right > document.documentElement.clientWidth + 1);
              const flat = [...document.querySelectorAll('.mb-figure svg:not(.mb-inline), .mb-figure table, .mb-column, .mb-chain')].filter((el) => el.getBoundingClientRect().height < 20 || el.getBoundingClientRect().width < 60);
              return { page: document.documentElement.scrollWidth - document.documentElement.clientWidth, wide: wide.slice(0, 3).map((el) => (el.className.baseVal || el.className) + ':' + Math.round(el.getBoundingClientRect().right)), flat: flat.map((el) => el.className.baseVal || el.className) };
            });
            const tag = `${unitId} ${groups[gi].id} ${groups[gi].rounds[li].level} ${groups[gi].rounds[li].no}회 (${name})`;
            assert.deepEqual(report, { page: 0, wide: [], flat: [] }, '넘치거나 찌그러진 그림: ' + tag);
            if (FEEDBACK_ONLY) {
              const wrong = await view.page.evaluate(({ unitId, group, level, no }) => {
                const B = window.MathBank, item = B.makeRound(B.findUnit(unitId), group, level, no)[0];
                return { choice: item.choice && (item.choice.answer + 1) % item.choice.options.length, inputs: item.inputs && item.inputs.map((input, i) => input.answer + (i === 0 ? 1 : 0)) };
              }, { unitId, group: groups[gi].id, level: groups[gi].rounds[li].level, no: groups[gi].rounds[li].no });
              const hintCard = view.page.locator('.mb-item').first();
              if (wrong.choice !== undefined && wrong.choice !== null) await hintCard.locator('.mb-choice').nth(wrong.choice).click();
              else {
                for (let i = 0; i < wrong.inputs.length; i += 1) await hintCard.locator('.mb-field input').nth(i).fill(String(wrong.inputs[i]));
                await hintCard.locator('.mb-primary').click();
              }
              await hintCard.locator('.mb-hint').waitFor();
              assert.equal(await view.page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth), false, '힌트 표시 뒤에도 화면이 넘치지 않는다');
            }
            if (SHOTS) await shot(view.page, `${name}-${unitId}-${gi + 1}${groups[gi].id}-${groups[gi].rounds[li].level}${groups[gi].rounds[li].no}`);
            await view.page.evaluate(() => window.dispatchEvent(new CustomEvent('sitebackrequest', { bubbles: true, cancelable: true })));
            await view.page.locator('.mb-group:not(.mb-ox-group)').first().waitFor();
          }
        }
      }
      await view.context.close();
    }
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ ok: true }));
  } finally {
    await browser.close();
    await h.close();
  }
})().catch((error) => { console.error(error); process.exit(1); });
