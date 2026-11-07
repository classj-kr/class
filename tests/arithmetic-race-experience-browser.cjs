'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { execFileSync } = require('node:child_process');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const root = path.resolve(__dirname, '..');
const base = process.env.ARITHMETIC_TEST_URL || 'http://127.0.0.1:8791';
const built = path.join(root, 'learning/literacy-numeracy/arithmetics/dist/client');
const out = process.env.ARITHMETIC_CAPTURE_DIR || path.join(root, 'outputs/arithmetic-race');

async function capture(page, name) {
  fs.mkdirSync(out, { recursive: true });
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const png = await page.screenshot({ fullPage: true, animations: 'disabled' });
  execFileSync('python', ['-c', 'import io,sys\nfrom PIL import Image,ImageChops\na=Image.open(io.BytesIO(sys.stdin.buffer.read())).convert("RGBA")\na.save(sys.argv[1],"WEBP",lossless=True,exact=True)\nb=Image.open(sys.argv[1]).convert("RGBA")\nassert a.size==b.size and ImageChops.difference(a,b).getbbox() is None', path.join(out, name + '.webp')], { input: png });
}

async function main() {
  const { raceCard, cardFields, isRaceAnswerCorrect, raceAnswerText } = await import(pathToFileURL(path.join(root, 'learning/literacy-numeracy/arithmetics/lib/race-cards.ts')));
  // Real local API: the countdown is enforced on the server and doesn't consume game time.
  const api = async body => {
    const response = await fetch(base + '/api/arithmetic-race', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
    return { status: response.status, data: await response.json() };
  };
  const created = await api({ action: 'create', worksheetRoute: '/arithmetic/add-subtract-1', durationSeconds: 60, name: '연출확인' });
  assert.equal(created.status, 201);
  const room = created.data;
  try {
    assert.equal((await api({ action: 'start', roomCode: room.roomCode, hostToken: 'wrong' })).status, 403);
    const sent = Date.now();
    const started = await api({ action: 'start', roomCode: room.roomCode, hostToken: room.hostToken });
    assert.equal(started.status, 200);
    assert.ok(started.data.startedAt >= sent + 3400);
    const first = raceCard('/arithmetic/add-subtract-1', room.race.seed, 0);
    const answer = { action: 'card', roomCode: room.roomCode, participantId: room.participantId, participantToken: room.participantToken, cardIndex: 0, answers: Object.fromEntries(Object.entries(first.answers).map(([key, values]) => [key, values[0]])) };
    assert.equal((await api(answer)).status, 409, 'no scoring during countdown');
    await new Promise(resolve => setTimeout(resolve, Math.max(0, started.data.startedAt - Date.now()) + 30));
    const scored = await api(answer);
    assert.equal(scored.data.outcome, 'correct');
    assert.equal(scored.data.participant.score, 1);
    const snapshot = await (await fetch(base + '/api/arithmetic-race?' + new URLSearchParams({ room: room.roomCode, hostToken: room.hostToken }))).json();
    assert.equal(snapshot.race.endsAt - snapshot.race.startedAt, 60000);
  } finally { await api({ action: 'delete', roomCode: room.roomCode, hostToken: room.hostToken }); }

  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => {
      if (message.type() === 'error' && /hydrat|server rendered HTML/i.test(message.text())) errors.push(message.text());
    });
    let created = null;
    const me = { id: 'me', name: '가람', score: 0, cardIndex: 0, correctCount: 0, wrongCount: 0, skipCount: 0 };
    const peers = [{ id: 'a', name: '나래', score: 3, correctCount: 3 }, { id: 'b', name: '다솜', score: 2, correctCount: 2 }, { id: 'c', name: '하람', score: 1, correctCount: 1 }, { id: 'd', name: '새봄', score: 0, correctCount: 0 }];
    const race = { roomCode: '2468', worksheetName: '초1 · 덧셈과 뺄셈', worksheetRoute: '/arithmetic/add-subtract-1', seed: 20260720, status: 'waiting', startedAt: null, endsAt: null, durationSeconds: 60, mode: 'cards' };
    const snapshot = () => {
      const ranking = [me, ...peers].slice().sort((a, b) => b.score - a.score || b.correctCount - a.correctCount).map((entry, index) => ({ ...entry, rank: index + 1 }));
      return { race, participant: { ...me, rank: ranking.find(entry => entry.id === me.id).rank }, ranking, participants: [me, ...peers], serverNow: Date.now() };
    };
    await page.route('**/assets/**', async route => {
      const target = path.resolve(root, '.' + decodeURIComponent(new URL(route.request().url()).pathname));
      if (target.startsWith(root + path.sep) && fs.existsSync(target) && fs.statSync(target).isFile()) await route.fulfill({ path: target });
      // 앱이 빌드한 조각(/assets/index-*.js)은 저장소에 없으니 빌드 결과에서 주고, 없으면 서버로 넘긴다.
      else {
        const app = path.resolve(built, '.' + decodeURIComponent(new URL(route.request().url()).pathname));
        if (app.startsWith(built + path.sep) && fs.existsSync(app) && fs.statSync(app).isFile()) await route.fulfill({ path: app });
        else await route.continue();
      }
    });
    await page.route('**/api/**', async route => {
      const url = new URL(route.request().url());
      if (url.pathname === '/api/auth/me') return route.fulfill({ json: { user: { name: '가람' } } });
      if (url.pathname !== '/api/arithmetic-race') return route.fulfill({ json: {} });
      if (route.request().method() === 'GET') return route.fulfill({ json: snapshot() });
      const body = route.request().postDataJSON();
      if (body.action === 'create') {
        created = body;
        return route.fulfill({ status: 201, json: { roomCode: '2468', participantId: 'me', participantToken: 'test', hostToken: 'host', race } });
      }
      if (body.action === 'start') {
        race.status = 'running'; race.startedAt = Date.now() + 3500; race.endsAt = race.startedAt + 60000;
        return route.fulfill({ json: { ok: true, startedAt: race.startedAt } });
      }
      if (body.action === 'card') {
        const card = raceCard(race.worksheetRoute, race.seed, me.cardIndex);
        const outcome = body.skip ? 'skip' : isRaceAnswerCorrect(card, body.answers) ? 'correct' : 'wrong';
        me.score += outcome === 'correct' ? 1 : outcome === 'wrong' ? -1 : -2;
        if (outcome === 'correct') me.correctCount++;
        else if (outcome === 'wrong') me.wrongCount++;
        else me.skipCount++;
        if (outcome !== 'wrong') me.cardIndex++;
        return route.fulfill({ json: { outcome, participant: { ...me }, answer: outcome === 'skip' ? raceAnswerText(card) : '' } });
      }
      return route.fulfill({ json: {} });
    });
    // 학습지 오른쪽 아래 기록 단추 줄의 「🏁 순위전」은 묻는 창 없이 바로 방을 만들고 대기실로 간다.
    await page.goto(base + '/arithmetic/add-subtract-1');
    await page.locator('learning-records a.race').click();
    await page.waitForURL(/\/arithmetic\/race\?room=2468&participant=me&participantToken=test&hostToken=host$/);
    assert.equal(created.worksheetRoute, '/arithmetic/add-subtract-1');
    assert.equal(created.durationSeconds, undefined, 'the lobby picks the time, not a dialog');
    await page.getByRole('button', { name: '🏁 출발!' }).waitFor();
    assert.equal(await page.locator('.math-race-logo').count(), 0, 'no keycap title copied from the typing race');
    await page.waitForFunction(() => document.querySelectorAll('.race-participant-list li').length === 5);
    await page.getByRole('button', { name: '설정 열기', exact: true }).click();
    await page.locator('#sfxMuteBtn').click();
    assert.equal(await page.evaluate(() => ClassGameSfx.getAudioBus()), null);
    await page.locator('#sfxMuteBtn').click();
    await page.keyboard.press('Escape');
    await capture(page, 'lobby-desktop');
    await page.getByRole('button', { name: '🏁 출발!' }).click();
    await page.waitForURL(/\/race\/play/);
    await page.locator('.math-race-countdown').waitFor();
    assert.equal(await page.locator('input[aria-label="답"]').count(), 0);
    await capture(page, 'countdown-desktop');
    await page.locator('form.card-race-card').waitFor();
    const answer = async (wrong = false) => {
      await page.locator('form.phase-play').waitFor();
      const card = raceCard(race.worksheetRoute, race.seed, me.cardIndex);
      const fields = cardFields(card);
      for (let index = 0; index < fields.length; index++) await page.getByRole('textbox', { name: '답', exact: true }).nth(index).fill(wrong ? '999' : String(card.answers[fields[index].blank][0]));
      const response = page.waitForResponse(response => response.url().endsWith('/api/arithmetic-race') && response.request().method() === 'POST');
      await page.locator('form').getByRole('button', { name: '확인', exact: true }).click();
      await response;
    };
    await answer(true);
    await page.locator('.phase-wrong').waitFor();
    assert.equal(me.cardIndex, 0);
    assert.equal(me.score, -1);
    await page.locator('form.phase-play').waitFor();
    await page.getByRole('button', { name: '포기 −2' }).click();
    await page.locator('.card-race-reveal').waitFor();
    assert.equal(me.skipCount, 1);
    await page.locator('form.phase-play').waitFor();
    for (let i = 0; i < 8; i++) {
      const index = me.cardIndex;
      await answer();
      await page.waitForFunction(expected => document.querySelector('.card-race-number')?.textContent === `${expected}번째 미션`, index + 2);
    }
    assert.ok(await page.locator('main.is-fever').count());
    // 5연속째부터 한 문제 +2: 카드에 +2 도장이 찍힌다.
    assert.equal(await page.locator('.math-race-stamp').innerText(), '+2');
    await page.waitForFunction(() => document.querySelector('.math-race-rank')?.textContent === '1위');
    // 점수 5 = 일 모형 다섯 개. 열 개가 넘으면 십 모형 막대로 합쳐진다.
    assert.equal(await page.locator('.math-race-towers .is-me .math-race-cube').count(), me.score % 10);
    peers[0].score = 12;
    await page.waitForFunction(() => document.querySelectorAll('.math-race-towers .math-race-rod').length === 1);
    await capture(page, 'playing-desktop');
    const animations = await page.locator('.math-race-cloud').evaluateAll(nodes => nodes.map(node => node.getAnimations()[0]?.playState));
    assert.ok(animations.length > 0 && animations.every(state => state === 'running'));
    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate(() => scrollTo(0, 0));
    await capture(page, 'playing-mobile');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    const bounds = await page.locator('form.card-race-card').boundingBox();
    assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= 390);
    race.endsAt = Date.now() - 50;
    await page.locator('.card-race-result').waitFor();
    assert.equal(await page.locator('form.card-race-card').count(), 0);
    await capture(page, 'results-mobile');
    await page.setViewportSize({ width: 1440, height: 1000 });
    await capture(page, 'results-desktop');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    assert.equal(await page.locator('.math-race-avatar').first().evaluate(el => getComputedStyle(el).animationName), 'none');
    assert.deepEqual(errors, []);
    console.log('PASS: real API countdown + full duration, lobby, countdown input lock, correct/wrong/skip, streak, overtaking, base-ten towers, results, mobile, reduced motion.');
    console.log('WebP captures: ' + out);
  } finally { await browser.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
