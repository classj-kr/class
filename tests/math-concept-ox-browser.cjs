'use strict';
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path'), { spawnSync } = require('node:child_process');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const { harness } = require('./learning-records-integration.cjs');
const C = require('../learning/literacy-numeracy/math-bank/concept-ox.js');
const BANK = '/learning/literacy-numeracy/math-bank/', OUT = path.resolve(__dirname, '../outputs/math-concept-ox');
const TO_WEBP = 'import sys,io;from PIL import Image;im=Image.open(io.BytesIO(sys.stdin.buffer.read())).convert("RGBA");im.save(sys.argv[1],format="WEBP",lossless=True);out=Image.open(sys.argv[1]).convert("RGBA");assert im.size==out.size and im.tobytes()==out.tobytes()';
(async () => {
  const h = await harness(); let browser;
  try {
    browser = await chromium.launch({ headless: true, channel: 'msedge' });
    const context = await browser.newContext({ viewport: { width: 360, height: 780 }, extraHTTPHeaders: { 'x-test-user': '1' } });
    await context.route(/^https:\/\//, route => route.abort());
    const page = await context.newPage(), errors = [];
    page.on('pageerror', error => { errors.push(error.message); console.error('PAGE', error.message); });
    page.on('console', message => { if (message.type() === 'error') console.error('CONSOLE', message.text()); });
    const request = async (route, data) => {
      const response = await context.request.post(h.base + '/api/learning-records' + route, { data });
      assert.equal(response.ok(), true, await response.text()); return (await response.json()).session;
    };
    // 통합 전에 저장한 기록을 만든 뒤, 원래 즐겨찾기 주소로 연다.
    let legacy = await request('/sessions', { activity: 'math-ox', contentKey: '초4', contentVersion: '20261001', title: '수학 기초 OX · 초4', href: '/learning/literacy-numeracy/math-ox/', checkpoint: { answered: {}, unit: '삼각형' } });
    const temp = { window: {} }; require('node:vm').runInNewContext(fs.readFileSync(path.resolve(__dirname, '../learning/literacy-numeracy/math-ox/data.js'), 'utf8'), temp);
    const q = temp.window.MATH_OX_DATA.find(q => C.idsFor('4-1-4').includes(q.id));
    legacy = await request('/sessions/' + legacy.id + '/changes', { revision: legacy.revision, mutationId: require('node:crypto').randomUUID(), checkpoint: { answered: { [q.id]: { selectedChoice: q.answer === 'O' ? 'X' : 'O', isCorrect: false } }, unit: '삼각형' }, progress: { current: 1, total: 96 }, events: [{ kind: 'answer', questionKey: String(q.id), response: q.answer === 'O' ? 'X' : 'O', correct: false, snapshot: { prompt: q.prompt, subject: q.subject, unit: q.unit } }] });
    await page.goto(h.base + '/learning/literacy-numeracy/math-ox/?record=' + encodeURIComponent('초4') + '&unit=' + encodeURIComponent('삼각형'));
    const ready = async () => { try { await page.waitForFunction(() => document.querySelector('.mb-ox-item') && !document.getElementById('main').inert); } catch (error) { console.error('STATE', page.url(), await page.locator('body').innerText()); throw error; } };
    await ready(); assert.ok(page.url().includes(BANK));
    assert.equal(await page.locator('#unitSelect').inputValue(), '4-1-4');
    const card = page.locator('.mb-ox-item[data-question-id="' + q.id + '"]');
    assert.equal(await card.locator('.mb-hint').count(), 1);
    assert.equal(await card.locator('.mb-ox-reason').count(), 0);
    assert.doesNotMatch(await card.locator('.mb-result').innerText(), /정답: /);
    await card.locator('[data-choice="' + q.answer + '"]').click(); await ready();
    await page.reload(); await ready();
    assert.equal(await card.evaluate(card => card.classList.contains('is-right')), true);
    const detail = await (await context.request.get(h.base + '/api/learning-records/sessions/' + legacy.id)).json();
    assert.equal(detail.session.id, legacy.id);
    assert.equal(detail.session.checkpoint.answered[q.id].firstOk, false);
    assert.equal(detail.session.summary.firstCorrect, 0);
    assert.equal(detail.session.summary.solvedAfterRetry, 1);
    assert.equal(await page.locator('learning-records:not([hidden])').count(), 1);
    // OX를 나와 일반 문제를 열어도 저장 단위와 기존 기록은 그대로다.
    await page.locator('.mb-back').click(); await page.locator('.mb-ox-start').waitFor();
    assert.equal(new URL(page.url()).searchParams.has('concept'), false);
    await page.locator('.mb-level').first().click(); await page.locator('.mb-item[data-key]').first().waitFor();
    assert.equal(await page.locator('.mb-ox-item').count(), 0);
    assert.equal(await page.locator('learning-records:not([hidden])').count(), 1);
    assert.ok(new URL(page.url()).searchParams.get('record').startsWith('4-1-4:'));
    const bankKey = new URL(page.url()).searchParams.get('record');
    await page.reload(); await page.locator('.mb-item[data-key]').first().waitFor();
    assert.equal(new URL(page.url()).searchParams.get('record'), bankKey);
    await page.locator('.mb-back').click(); await page.locator('.mb-ox-start').click(); await ready();
    assert.equal(await card.evaluate(card => card.classList.contains('is-right')), true);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    fs.mkdirSync(OUT, { recursive: true });
    async function shot(name) {
      const result = spawnSync('python', ['-c', TO_WEBP, path.join(OUT, name + '.webp')], { input: await page.screenshot() });
      assert.equal(result.status, 0, String(result.stderr));
    }
    await shot('math-mobile');
    await page.setViewportSize({ width: 1280, height: 820 }); await page.locator('.mb-back').click(); await shot('math-units');
    // 네 선택과목은 일반 차시를 만들지 않고 OX만 연다.
    for (const course of C.courses) {
      await page.selectOption('#termSelect', course.key); await page.waitForFunction(() => !document.getElementById('main').inert);
      assert.equal(await page.locator('#unitSelect option').count(), 3);
      assert.equal(await page.locator('.mb-group').count(), 1); assert.equal(await page.locator('.mb-level').count(), 0);
      await page.locator('.mb-ox-start').click(); await ready();
      assert.ok(await page.locator('.mb-ox-item').count() > 0);
      await page.locator('.mb-back').click();
    }
    await page.selectOption('#termSelect', '1-1'); await page.waitForFunction(() => !document.getElementById('main').inert);
    assert.equal(await page.locator('.mb-ox-start').count(), 0);
    // 일반 학습에선 OX 데이터와 수식 라이브러리를 받지 않는다.
    const guestContext = await browser.newContext({ viewport: { width: 360, height: 780 } }), guest = await guestContext.newPage(), fetched = [];
    guest.on('pageerror', error => errors.push(error.message)); guest.on('request', req => fetched.push(req.url()));
    await guest.goto(h.base + BANK); await guest.locator('.mb-group').first().waitFor();
    assert.equal(fetched.some(url => /math-ox\/(data\.js|vendor)/.test(url)), false);
    // 실제로 연결된 110단원 전체를 열어 문항 수·수식·모바일 넘침을 검사한다.
    const visited = new Set(); let currentTerm;
    for (const unitId of [...new Set(C.links.map(link => link[2]))]) {
      const term = C.findUnit(unitId)?.oxCourse || unitId.split('-').slice(0, 2).join('-');
      if (term !== currentTerm) { await guest.selectOption('#termSelect', term); await guest.waitForFunction(() => !document.getElementById('main').inert); currentTerm = term; }
      await guest.selectOption('#unitSelect', unitId); await guest.waitForFunction(() => !document.getElementById('main').inert);
      await guest.locator('.mb-ox-start').click(); await guest.waitForFunction(() => document.querySelector('.mb-ox-item') && !document.getElementById('main').inert);
      const ids = await guest.locator('.mb-ox-item').evaluateAll(cards => cards.map(card => Number(card.dataset.questionId)));
      assert.deepEqual(ids.sort((a,b) => a-b), C.idsFor(unitId).slice().sort((a,b) => a-b), unitId);
      ids.forEach(id => visited.add(id));
      assert.equal(await guest.locator('.katex-error').count(), 0, unitId);
      assert.equal(await guest.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, unitId);
      await guest.locator('.mb-back').click();
    }
    assert.equal(visited.size, 737);
    await page.goto(h.base + '/learning/inquiry/science-lab/'); await page.locator('.grade-navigation').waitFor();
    const backgrounds = await page.evaluate(() => ({ bg: getComputedStyle(document.body, '::before').backgroundImage, body: getComputedStyle(document.body).backgroundColor, heading: getComputedStyle(document.querySelector('.school-section > h2')).color }));
    assert.match(backgrounds.bg, /math-bank\/assets\/math-bg\.webp/); assert.equal(backgrounds.heading, 'rgb(241, 245, 249)');
    assert.equal(backgrounds.body, 'rgba(0, 0, 0, 0)', '공통 과학 테마가 고정 배경을 덮지 않는다');
    await shot('science-desktop');
    await page.setViewportSize({ width: 360, height: 780 }); assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false); await shot('science-mobile');
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ ok: true, questions: visited.size, units: 110, legacySessionPreserved: true }));
  } finally { if (browser) await browser.close(); await h.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
