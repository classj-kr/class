'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), { spawnSync } = require('node:child_process');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const { harness } = require('./learning-records-integration.cjs');
const OUT = path.resolve(__dirname, '../outputs/math-twins');
(async () => {
  const h = await harness(), browser = await chromium.launch({ headless: true, channel: 'msedge' });
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, extraHTTPHeaders: { 'x-test-user': '1' } });
    await context.route('https://**', route => route.abort());
    const page = await context.newPage(), errors = [], requests = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => { if (/twins\/.*json/.test(request.url())) requests.push(request.url()); });
    const ready = () => page.waitForFunction(() => document.querySelector('.mb-item') && !document.getElementById('main').inert);
    const answer = async (index, wrong = false) => {
      const data = await page.locator('.mb-item').nth(index).evaluate(card => ({ key: card.dataset.key }));
      const correct = await page.evaluate(async key => {
        const B = window.MathBank, unit = B.findUnit(document.getElementById('unitSelect').value), record = new URL(location.href).searchParams.get('record').split(':');
        const originals = B.makeRound(unit, record[1], record[2], Number(record[3]));
        let item = originals.find(item => item.key === key);
        if (!item) {
          const base = originals.find(item => key.startsWith(item.key + '~t'));
          item = (await window.MathBankTwins.forItem(B, unit, B.findGroup(unit, record[1]), base)).find(item => item.key === key);
        }
        return { choice: item.choice && { answer: item.choice.answer, count: item.choice.options.length }, values: item.inputs && item.inputs.map(input => input.answer), negative: item.negative };
      }, data.key);
      const card = page.locator('.mb-item').nth(index);
      if (correct.choice) await card.locator('.mb-choice').nth((correct.choice.answer + (wrong ? 1 : 0)) % correct.choice.count).click();
      else {
        const inputs = card.locator('.mb-field input, select.mb-rel');
        for (let i = 0; i < correct.values.length; i++) {
          let value = correct.values[i]; if (wrong && i === 0) value = typeof value === 'number' ? value + 1 : value === '<' ? '>' : '<';
          if (correct.negative && i === 0) value = -value;
          if (await inputs.nth(i).evaluate(input => input.tagName === 'SELECT')) await inputs.nth(i).selectOption(String(value));
          else await inputs.nth(i).fill(String(value));
        }
        await card.locator('.mb-primary').click();
      }
      await page.waitForFunction(() => !document.getElementById('main').inert);
    };
    const saved = () => page.evaluate(async () => (await (await fetch('/api/learning-records/sessions?activity=math-bank')).json()).sessions);
    await page.goto(h.base + '/learning/literacy-numeracy/math-bank/');
    await page.locator('.mb-group').first().waitFor();
    await page.locator('.mb-level').first().click(); await ready();
    const parentKey = new URL(page.url()).searchParams.get('record');
    await answer(0, true);
    assert.equal(await page.locator('.mb-result').first().locator('.mb-hint').count(), 1);
    await page.locator('.mb-twin-start').first().click(); await page.locator('.mb-twin-label').first().waitFor(); await ready();
    assert.equal(await page.locator('.mb-item').count(), 3);
    const content = await page.locator('.mb-item').allTextContents();
    assert.equal(new Set(content).size, 3);
    const childKey = new URL(page.url()).searchParams.get('record');
    assert.equal(childKey, parentKey + ':twins:0');
    await answer(0); await answer(1, true);
    assert.equal(await page.locator('.mb-choice.is-answer').count() > 0 || await page.locator('.mb-item[data-closed]').count() > 0, true);
    await page.reload(); await ready();
    assert.equal(await page.locator('.mb-item').count(), 3);
    assert.equal(await page.locator('.mb-item.is-right').count(), 1);
    assert.equal(await page.locator('.mb-item.is-wrong').count(), 1);
    await answer(1); await answer(2);
    await page.locator('#finish:not([hidden])').waitFor();
    assert.match(await page.locator('#finish').innerText(), /3문항 중 2문항 정답/);
    const sessions = await saved(), parent = sessions.find(session => session.contentKey === parentKey), child = sessions.find(session => session.contentKey === childKey);
    assert.equal(parent.summary.firstCorrect, 0); assert.equal(parent.status, 'active');
    assert.equal(child.summary.firstCorrect, 2); assert.equal(child.summary.solvedAfterRetry, 1); assert.equal(child.status, 'completed');
    const detail = await page.evaluate(async id => (await (await fetch('/api/learning-records/sessions/' + id)).json()).session, child.id);
    assert.equal(detail.events.filter(event => event.kind === 'answer').every(event => event.snapshot.originalQuestionKey && event.snapshot.twinNumber), true);
    assert.equal(detail.checkpoint.parentSessionId, parent.id);
    assert.equal(detail.events.filter(event => event.kind === 'answer').every(event => event.snapshot.parentSessionId === parent.id), true);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    fs.mkdirSync(OUT, { recursive: true });
    const result = spawnSync('python', ['-c', 'import sys,io;from PIL import Image;im=Image.open(io.BytesIO(sys.stdin.buffer.read())).convert("RGBA");im.save(sys.argv[1],format="WEBP",lossless=True);out=Image.open(sys.argv[1]).convert("RGBA");assert out.size==im.size and out.tobytes()==im.tobytes()', path.join(OUT, 'review-mobile.webp')], { input: await page.screenshot({ fullPage: true }) });
    assert.equal(result.status, 0, String(result.stderr));
    // 원래 회차를 완료한 뒤에도 처음 틀린 문항만 골라 세 개씩 복습한다.
    await page.goto(h.base + '/learning/literacy-numeracy/math-bank/?record=' + encodeURIComponent(parentKey)); await ready();
    const originalCount = await page.locator('.mb-item').count();
    for (let i = 1; i < originalCount; i++) await answer(i);
    await answer(0); await page.locator('#finish .mb-review-start').waitFor();
    assert.match(await page.locator('#finish .mb-review-start').innerText(), /3문항/);
    await page.locator('#finish .mb-review-start').click(); await page.locator('.mb-twin-label').first().waitFor(); await ready();
    assert.equal(await page.locator('.mb-item').count(), 3);
    assert.equal(await page.locator('.mb-item.is-right, .mb-item.is-wrong').count(), 0, '복습 재시작은 새 기록으로 연다');
    // 고1 1학기에도 진입할 수 있고, 원본과 다른 실제 계산 문항 세 개가 나온다.
    await page.goto(h.base + '/learning/literacy-numeracy/math-bank/?unit=10-1-1');
    await page.locator('.mb-group').first().waitFor(); await page.locator('.mb-level').first().click(); await ready();
    await answer(0, true); await page.locator('.mb-twin-start').first().click(); await page.locator('.mb-twin-label').first().waitFor(); await ready();
    assert.equal(await page.locator('.mb-item').count(), 3); await answer(0);
    assert.equal(await page.locator('.mb-item.is-right').count(), 1);
    // 고1 2학기의 일곱 단원 모두 오답→힌트→쌍둥이→저장·복원이 이어진다.
    for (let no = 1; no <= 7; no++) {
      await page.goto(h.base + '/learning/literacy-numeracy/math-bank/?unit=10-2-' + no);
      await page.locator('.mb-group').first().waitFor(); await page.locator('.mb-level').first().click(); await ready();
      const baseKey = new URL(page.url()).searchParams.get('record');
      await answer(0, true);
      const first = page.locator('.mb-item').first();
      assert.equal(await first.locator('.mb-hint').count(), 1);
      assert.equal(await first.locator('.mb-reveal').count(), 1, '정답·전체 풀이는 별도 버튼으로 요청한다');
      assert.doesNotMatch(await first.locator('.mb-result').innerText(), /답: /, '오답 직후 정답을 자동 공개하지 않는다');
      await answer(0);
      await page.reload(); await ready();
      const baseSession = (await saved()).find(session => session.contentKey === baseKey);
      const baseDetail = await page.evaluate(async id => (await (await fetch('/api/learning-records/sessions/' + id)).json()).session, baseSession.id);
      const baseAnswers = baseDetail.events.filter(event => event.kind === 'answer');
      assert.equal(baseAnswers[0].correct, false);
      assert.equal(baseSession.summary.firstCorrect, 0, '힌트를 보고 고쳐도 최초 오답이다');
      await page.locator('.mb-twin-start').first().click(); await page.locator('.mb-twin-label').first().waitFor(); await ready();
      assert.equal(await page.locator('.mb-item').count(), 3);
      for (let i = 0; i < 3; i++) await answer(i, i === 1);
      await page.reload(); await ready();
      assert.equal(await page.locator('.mb-item.is-right').count(), 2);
      assert.equal(await page.locator('.mb-item.is-wrong').count(), 1);
      await answer(1); await page.locator('#finish:not([hidden])').waitFor();
      assert.match(await page.locator('#finish').innerText(), /3문항 중 2문항 정답/);
      const reviewKey = new URL(page.url()).searchParams.get('record'), reviewSession = (await saved()).find(session => session.contentKey === reviewKey);
      assert.equal(reviewSession.summary.firstCorrect, 2); assert.equal(reviewSession.status, 'completed');
      if (no === 7) {
        const captured = spawnSync('python', ['-c', 'import sys,io;from PIL import Image;im=Image.open(io.BytesIO(sys.stdin.buffer.read())).convert("RGBA");im.save(sys.argv[1],format="WEBP",lossless=True);assert Image.open(sys.argv[1]).convert("RGBA").tobytes()==im.tobytes()', path.join(OUT, 'review-high1-semester2-mobile.webp')], { input: await page.screenshot({ fullPage: true }) });
        assert.equal(captured.status, 0, String(captured.stderr));
      }
    }
    // 벤 다이어그램이 들어 있는 묶음은 생성 호출 순서가 달라도 검증·복원이 된다.
    await page.goto(h.base + '/learning/literacy-numeracy/math-bank/?record=' + encodeURIComponent('10-2-4:demorgan:기본:1')); await ready();
    await page.evaluate(() => {
      const B = window.MathBank, type = B.findGroup(B.findUnit('10-2-4'), 'demorgan').types.find(type => type.id === 'dm-shade');
      for (let i = 0; i < 20; i++) type.make(new B.Dice(7919 + i), 0);
    });
    const shaded = await page.locator('.mb-item').evaluateAll(cards => cards.findIndex(card => card.dataset.key === 'dm-shade#1'));
    assert.ok(shaded >= 0);
    await answer(shaded, true); await page.locator('.mb-twin-start').first().click(); await page.locator('.mb-twin-label').first().waitFor(); await ready();
    await page.reload(); await ready();
    assert.equal(await page.locator('.mb-item').count(), 3); await answer(0);
    assert.equal(await page.locator('.mb-item.is-right').count(), 1);
    assert.equal(requests.some(url => /twins\/10-2\.json/.test(url)), true);
    assert.equal(requests.some(url => /twins\/11-/.test(url)), false);
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ ok: true, checks: ['wrong-to-twins', 'three-per-original', 'resume', 'first-score', 'separate-history', 'finish-to-review', 'high1-semester1', 'high1-semester2-all-seven-units', 'hinted-remains-wrong', 'venn-restoration', 'mobile'] }));
  } finally { await browser.close(); await h.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
