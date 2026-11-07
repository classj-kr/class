'use strict';
// 타자 순위전 낱말판: 다 친 순간 Enter·Space 없이 들어가는지(그냥 입력, 두벌식 영문 키, IME 조합 중),
// 칸 점수·등급이 보이는지, 8팀 대기실·경주·결과가 화면에 맞게 놓이는지 실제 브라우저로 확인한다.
// 캡처는 저장소 밖(TYPING_RACE_SHOTS 폴더)에만, 무손실 WebP로 남긴다.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const express = require('../game-hub-server/node_modules/express');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const { createTypingRace } = require('../game-hub-server/typing-race');
const { createRoomCodes } = require('../game-hub-server/room-codes');
const Core = require('../learning/inquiry/information-computing/typing/race/race-core');
const root = path.resolve(__dirname, '..');
const shots = process.env.TYPING_RACE_SHOTS || '';
const racePath = '/learning/inquiry/information-computing/typing/race/';
const WORDS = ['한라산', '좇았다', '안쳤다', '뚝배기', '하굣길', '어쨌든', '무지개', '도서관', '자전거', '고양이', '강아지', '선생님', '나무꾼', '달걀', '사과나무', '연필깎이'];
const KEY = { ㅂ: 'q', ㅈ: 'w', ㄷ: 'e', ㄱ: 'r', ㅅ: 't', ㅛ: 'y', ㅕ: 'u', ㅑ: 'i', ㅐ: 'o', ㅔ: 'p', ㅁ: 'a', ㄴ: 's', ㅇ: 'd', ㄹ: 'f', ㅎ: 'g', ㅗ: 'h', ㅓ: 'j', ㅏ: 'k', ㅣ: 'l', ㅋ: 'z', ㅌ: 'x', ㅊ: 'c', ㅍ: 'v', ㅠ: 'b', ㅜ: 'n', ㅡ: 'm', ㅃ: 'Q', ㅉ: 'W', ㄸ: 'E', ㄲ: 'R', ㅆ: 'T', ㅒ: 'O', ㅖ: 'P' };
const qwerty = (word) => [...Core.keys(word)].map((j) => KEY[j]).join('');

async function shot(page, name, fullPage = false) {
  if (!shots) return;
  fs.mkdirSync(shots, { recursive: true });
  const png = await page.screenshot({ fullPage });
  execFileSync('python', ['-c', [
    'import io, sys',
    'from PIL import Image',
    'Image.open(io.BytesIO(sys.stdin.buffer.read())).convert("RGB").save(sys.argv[1], "WEBP", lossless=True)',
  ].join('\n'), path.join(shots, name + '.webp')], { input: png });
}

// 실제 한글 IME처럼 한 키씩: 앞 글자는 확정(insertText), 끝 글자는 조합 중(imeSetComposition)으로 둔다.
async function imeType(cdp, word, hooks = {}) {
  const keys = qwerty(word);
  let committed = '';
  for (let n = 1; n <= keys.length; n++) {
    if (n === 2) await hooks.first?.();
    if (n === keys.length) await hooks.beforeLast?.();
    const text = Core.hangulFromKeys(keys.slice(0, n));
    const head = text.slice(0, -1), tail = text.slice(-1);
    if (head !== committed) {
      assert.ok(head.startsWith(committed), `${word}: ${committed} → ${head}`);
      await cdp.send('Input.insertText', { text: head.slice(committed.length) });
      committed = head;
    }
    await cdp.send('Input.imeSetComposition', { text: tail, selectionStart: 1, selectionEnd: 1 });
  }
}

async function main() {
  const app = express();
  app.use(express.json());
  app.get('/api/me/storage/:app', (_, res) => res.status(401).json({ error: 'guest' }));
  app.get('/api/student/profile', (_, res) => res.json({ profile: null }));
  app.get('/api/home-content-access', (_, res) => res.json({ globallyDisabledPaths: [] }));
  const platform = {
    roomCodes: createRoomCodes({ isActive: async (e) => race.hasRoomCode(e.code) }),
    isTeacherRequest: async () => false,
    isContentGloballyDisabled: async () => false,
    canBypassGlobalContentLock: async () => false,
    displayNameFor: async (req) => ({ name: decodeURIComponent(req.get('x-name') || '가람') }),
  };
  const race = createTypingRace({ platform, pickItems: (mode, count) => Array.from({ length: count }, (_, i) => WORDS[i % WORDS.length]) });
  app.use('/api/typing-race', race.router);
  app.use(express.static(root));
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const api = async (p, body, token = '', name = '') => {
    const r = await fetch(origin + '/api/typing-race' + p, { method: body === undefined ? 'GET' : 'POST', headers: { 'Content-Type': 'application/json', 'x-name': encodeURIComponent(name), Authorization: 'Bearer ' + token }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
    return r.json();
  };
  let browser;
  try {
    // 두 학생 창이 겹쳐 있어도 뒤 창의 애니메이션 시계가 멈추지 않게 한다(실제 교실에서는 각자 한 화면).
    browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--disable-backgrounding-occluded-windows', '--disable-renderer-backgrounding', '--disable-background-timer-throttling'] });
    const errors = [];
    const watch = (page, who) => page.on('pageerror', (e) => errors.push(`${who}: ${e.message}`));

    // ── 1. 방장(함께 달림) 대기실: 설정 칸이 방번호 옆을 채우고, 묶음마다 한 줄 ──
    const hostContext = await browser.newContext({ viewport: { width: 1487, height: 722 } });
    const page = await hostContext.newPage();
    watch(page, 'host');
    await page.goto(origin + racePath);
    const created = page.waitForResponse((r) => r.url().endsWith('/api/typing-race/rooms') && r.request().method() === 'POST');
    await page.locator('#createButton').click();
    const room = await (await created).json();
    const code = room.state.code, hostToken = room.token;
    await page.locator('#startButton').waitFor();
    const settle = (p) => p.waitForFunction(() => document.getAnimations().every((a) => a.effect?.getTiming().iterations === Infinity || a.playState !== 'running'));
    await settle(page);
    const oneLine = (selector) => page.locator(selector).evaluateAll((rows) => rows.map((row) => new Set([...row.children].map((b) => Math.round(b.getBoundingClientRect().top))).size));
    for (const width of [1487, 1195]) {
      await page.setViewportSize({ width, height: 722 });
      const code = await page.locator('.code-card').boundingBox(), settings = await page.locator('.lobby-settings').boundingBox();
      assert.ok(Math.abs(code.y - settings.y) < 2 && settings.x > code.x + code.width, `${width}: settings sit beside the room code ${JSON.stringify([code, settings])}`);
      assert.ok((await oneLine('[data-settings="lobby"] .option-row')).every((n) => n === 1), `${width}: every option group on one line`);
    }
    await page.setViewportSize({ width: 1487, height: 722 });
    await shot(page, 'lobby-host-1487');

    // ── 2. 둘째 학생은 브라우저로 들어와 같은 판을 본다 ──
    const friendContext = await browser.newContext({ viewport: { width: 1366, height: 768 }, extraHTTPHeaders: { 'x-name': encodeURIComponent('나래') } });
    const friend = await friendContext.newPage();
    watch(friend, 'friend');
    await friend.goto(origin + racePath + '?room=' + code);
    const kids = [await api('/rooms/' + code + '/join', {}, '', '다솜'), await api('/rooms/' + code + '/join', {}, '', '라온')];
    await friend.waitForFunction(() => document.querySelector('#myName')?.textContent === '나래');
    await page.bringToFront();
    await page.locator('#startButton').click();
    await page.waitForFunction(() => !document.querySelector('#typeInput').disabled && document.activeElement?.id === 'typeInput', null, { timeout: 8000 });
    await friend.waitForFunction(() => !document.querySelector('#typeInput').disabled);
    const tiles = () => page.locator('#board .tile').evaluateAll((list) => list.map((t) => ({ id: t.dataset.id, word: t.querySelector('.tile-word').textContent, tier: t.dataset.tier, medal: t.querySelector('.tile-medal').textContent, points: t.querySelector('.tile-points').textContent })));
    let board = await tiles();
    assert.equal(board.length, 6);
    for (const t of board) {
      assert.equal(t.tier, 'gold');
      assert.equal(t.medal, '🥇');
      assert.equal(t.points, '+' + Core.claimScore(t.word, 1, 1), `${t.word}: the cell shows what typing it now earns`);
    }
    assert.equal(await page.locator('#typeHint').count(), 0, 'no Space/Enter hint line');
    // 칸이 다른 것에 가려지지 않는다(가운데를 누르면 그 칸이 잡힌다).
    const covered = async (p) => p.locator('#board .tile').evaluateAll((list) => list.filter((t) => {
      const r = t.getBoundingClientRect();
      const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return r.bottom > innerHeight || r.right > innerWidth || !t.contains(hit);
    }).length);
    assert.equal(await covered(page), 0, 'all six cells fully visible at 1487×722');
    assert.equal(await covered(friend), 0, 'all six cells fully visible at 1366×768');

    let combo = 0, score = 0;
    const accepted = async (word, how) => {
      combo++;
      score += Core.claimScore(word, combo, 1);
      await page.waitForFunction(([w, s]) => document.querySelector('#typeInput').value === '' && [...document.querySelectorAll('#board .tile')].every((t) => t.querySelector('.tile-word').textContent !== w || t.dataset.tier === 'done') && document.querySelector('#scoreNow').textContent === String(s), [word, score], { timeout: 4000 })
        .catch(async (e) => { throw new Error(`${how} ${word}: not accepted (value=${await page.locator('#typeInput').inputValue()}, score=${await page.locator('#scoreNow').innerText()}) ${e.message}`); });
      assert.equal(await page.locator('#comboNow').innerText(), String(combo), `${how}: no mistake was counted`);
    };
    const cell = (i) => board[i].word;

    // ── 3. 그냥 입력(글자가 하나씩 들어옴): 끝 글자에서 바로 들어간다 ──
    await page.keyboard.type(cell(0), { delay: 40 });
    await accepted(cell(0), 'typed');
    await page.locator('#countdown').waitFor({ state: 'hidden' });
    await shot(page, 'race-after-claim-1487');
    // 친구 화면: 그 칸이 은빛 🥈 으로 내려가고 2등 점수를 단다.
    await friend.bringToFront();
    await friend.waitForFunction((w) => [...document.querySelectorAll('#board .tile')].some((t) => t.querySelector('.tile-word').textContent === w && t.dataset.tier === 'silver'), cell(0), { timeout: 3000 });
    const silver = await friend.locator('#board .tile[data-tier="silver"]').evaluate((t) => ({ medal: t.querySelector('.tile-medal').textContent, points: t.querySelector('.tile-points').textContent, faces: t.querySelectorAll('.tile-face').length }));
    assert.deepEqual(silver, { medal: '🥈', points: '+' + Core.claimScore(cell(0), 1, 2), faces: 1 });
    await shot(friend, 'friend-silver-1366');
    await page.bringToFront();
    const clock = await page.evaluate(() => new Promise((done) => { const t0 = document.timeline.currentTime, p0 = performance.now(); setTimeout(() => done((document.timeline.currentTime - t0) / (performance.now() - p0)), 500); }));
    assert.ok(clock > 0.8, `the host window keeps animating (timeline speed ${clock.toFixed(2)})`);

    // ── 4. 한/영 키가 영어(두벌식 키로 입력): 한글로 바뀌며 끝 키에서 들어간다 ──
    await page.keyboard.type(qwerty(cell(1)), { delay: 40 });
    await accepted(cell(1), 'english keys');

    // ── 5. IME 조합 중: 끝 글자가 아직 조합 중일 때 들어가고, 칸이 비고, 그 글자가 되살아나지 않는다 ──
    const cdp = await hostContext.newCDPSession(page);
    const imeWord = cell(2);
    await imeType(cdp, imeWord, {
      beforeLast: async () => {
        assert.equal(await page.locator('#typeInput').inputValue(), Core.hangulFromKeys(qwerty(imeWord).slice(0, -1)));
        assert.equal(await page.locator('#scoreNow').innerText(), String(score), 'not accepted one key early');
      },
    });
    assert.equal(await page.locator('#typeInput').inputValue(), '', 'cleared while the last syllable was still composing');
    // 브라우저가 조합하던 끝 글자를 뒤늦게 확정해 넣어도 지워진다.
    await cdp.send('Input.insertText', { text: imeWord.slice(-1) });
    await accepted(imeWord, 'IME');
    assert.equal(await page.evaluate(() => document.activeElement?.id), 'typeInput', 'focus comes straight back');
    // 다음 낱말 첫 키는 깨끗한 칸에서 새로 조합된다(되살아난 글자가 앞에 붙지 않는다).
    board = await tiles();
    const imeNext = board.find((t) => t.tier === 'gold').word;
    await imeType(cdp, imeNext, { first: async () => assert.equal(await page.locator('#typeInput').inputValue(), Core.keys(imeNext)[0]) });
    await accepted(imeNext, 'IME again');

    // ── 6. 버릇처럼 Space·Enter를 눌러도 아무 일 없다 ──
    board = await tiles();
    const habit = board.find((t) => t.tier === 'gold').word;
    await page.keyboard.type(habit, { delay: 30 });
    await page.keyboard.press('Space');
    await page.keyboard.press('Enter');
    await accepted(habit, 'Space/Enter habit');
    assert.equal(await page.locator('#card.wrong').count(), 0);

    // ── 7. 날아가는 낱말: 친 칸에서 출발해 내 로켓·순위표 쪽으로 ──
    board = await tiles();
    const flyWord = board.find((t) => t.tier === 'gold').word;
    await page.keyboard.type(flyWord.slice(0, -1), { delay: 30 });
    // 앞 낱말들이 다 날아간 뒤에 친다(낱말 하나가 0.6초 동안 난다).
    await page.waitForFunction(() => !document.querySelector('.fly-word'));
    const flight = page.waitForFunction((w) => [...document.querySelectorAll('.fly-word')].some((el) => el.textContent === w && el.getAnimations()[0]?.currentTime > 200), flyWord, { timeout: 3000, polling: 16 });
    await page.keyboard.type(flyWord.slice(-1));
    await flight;
    await shot(page, 'race-flying-1487');
    await accepted(flyWord, 'typed');

    // ── 8. 등급: 한 명이 친 칸은 은빛, 둘은 동빛, 셋은 흐린 칸(보너스 없음). 칸의 수가 그 셈을 그대로 보여 준다 ──
    await page.waitForFunction(() => document.querySelectorAll('#board .tile[data-tier="gold"]').length >= 3, null, { timeout: 9000 });
    const fresh = (await tiles()).filter((t) => t.tier === 'gold').slice(0, 3);
    const roundId = (await api('/rooms/' + code, undefined, kids[0].token)).roundId;
    const slotOf = async (word) => (await api('/rooms/' + code, undefined, kids[0].token)).board.find((x) => x.text === word).id;
    for (const [who, word] of [[0, fresh[0].word], [0, fresh[1].word], [1, fresh[1].word], [0, fresh[2].word], [1, fresh[2].word]]) {
      const r = await api('/rooms/' + code + '/type', { roundId, slot: await slotOf(word), text: word, mistakes: 0 }, kids[who].token);
      assert.ok(r.gained, r.message);
    }
    await friend.bringToFront();
    await friend.keyboard.type(fresh[2].word, { delay: 30 });
    await friend.waitForFunction(() => document.querySelector('#typeInput').value === '');
    await page.bringToFront();
    const expect = [['silver', '🥈', 2], ['bronze', '🥉', 3], ['plain', '', 4]];
    await page.waitForFunction((words) => words.every(([w, tier]) => [...document.querySelectorAll('#board .tile')].some((t) => t.querySelector('.tile-word').textContent === w && t.dataset.tier === tier)), fresh.map((t, i) => [t.word, expect[i][0]]), { timeout: 4000 });
    const now = await tiles();
    fresh.forEach((t, i) => {
      const seen = now.find((x) => x.word === t.word);
      assert.deepEqual([seen.tier, seen.medal, seen.points], [expect[i][0], expect[i][1], '+' + Core.claimScore(t.word, combo + 1, expect[i][2])], t.word);
    });
    await page.waitForTimeout(700);
    await shot(page, 'race-tiers-1487');

    for (const [w, h, name] of [[1366, 768, 'race-1366'], [390, 844, 'race-390']]) {
      await page.setViewportSize({ width: w, height: h });
      await page.waitForTimeout(300);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${name}: no sideways scroll`);
      if (w > 400) assert.equal(await covered(page), 0, `${name}: cells fully visible`);
      await shot(page, name);
    }
    await page.setViewportSize({ width: 1487, height: 722 });
    await api('/rooms/' + code + '/leave', {}, hostToken);

    // ── 9. 8팀: 대기실 네 칸씩 두 줄, 경주 중 팀 막대 두 줄, 결과 ──
    const teamContext = await browser.newContext({ viewport: { width: 1487, height: 722 } });
    const teacher = await teamContext.newPage();
    watch(teacher, 'teams');
    await teacher.goto(origin + racePath);
    await teacher.locator('#createPanel').getByRole('button', { name: '팀전', exact: true }).click();
    await teacher.locator('#createPanel').getByRole('button', { name: '8팀', exact: true }).click();
    assert.ok((await teacher.locator('[data-settings="create"] .option-row').evaluateAll((rows) => rows.map((row) => new Set([...row.children].map((b) => Math.round(b.getBoundingClientRect().top))).size))).every((n) => n === 1), 'create panel: one line per group');
    await shot(teacher, 'create-8teams-1487');
    const made = teacher.waitForResponse((r) => r.url().endsWith('/api/typing-race/rooms') && r.request().method() === 'POST');
    await teacher.locator('#createButton').click();
    const teamRoom = await (await made).json();
    assert.equal(teamRoom.state.config.teamCount, 8);
    const tpath = '/rooms/' + teamRoom.state.code;
    const names = ['가온', '나비', '다온', '라희', '마루', '바다', '사랑', '아라', '자람', '차미', '카이', '타미', '파랑', '하늘', '한결'];
    for (const [i, name] of names.entries()) {
      const kid = await api(tpath + '/join', {}, '', name);
      await api(tpath + '/team', { team: (i + 1) % 8 }, kid.token);
    }
    await teacher.locator('.team-col').nth(0).locator('.team-head').click();
    await teacher.waitForFunction(() => document.querySelectorAll('#teamColumns .team-col').length === 8 && document.querySelector('#racerCount').textContent === '16');
    const grid = async () => teacher.locator('#teamColumns .team-col').evaluateAll((cols) => ({
      rows: new Set(cols.map((c) => Math.round(c.getBoundingClientRect().top))).size,
      columns: new Set(cols.map((c) => Math.round(c.getBoundingClientRect().left))).size,
      overflow: document.documentElement.scrollWidth > innerWidth,
    }));
    assert.deepEqual(await grid(), { rows: 2, columns: 4, overflow: false }, '8 teams: four by two');
    await teacher.setViewportSize({ width: 1000, height: 722 });
    assert.deepEqual(await grid(), { rows: 2, columns: 4, overflow: false }, '8 teams at 1000px: still four by two');
    await teacher.setViewportSize({ width: 1487, height: 722 });
    assert.ok((await teacher.locator('[data-settings="lobby"] .option-row').evaluateAll((rows) => rows.map((row) => new Set([...row.children].map((b) => Math.round(b.getBoundingClientRect().top))).size))).every((n) => n === 1), 'lobby: one line per group with 8 teams');
    await shot(teacher, 'lobby-8teams-1487', true);
    await teacher.setViewportSize({ width: 390, height: 844 });
    await teacher.waitForTimeout(200);
    assert.deepEqual(await grid(), { rows: 4, columns: 2, overflow: false }, '8 teams on a phone: two by four');
    assert.ok((await teacher.locator('[data-settings="lobby"] .option-row').evaluateAll((rows) => rows.map((row) => new Set([...row.children].map((b) => Math.round(b.getBoundingClientRect().top))).size))).every((n) => n === 1), 'phone lobby: one line per group');
    assert.ok(await teacher.locator('[data-settings="lobby"] .option').evaluateAll((list) => list.every((b) => b.scrollWidth <= b.clientWidth + 1)), 'phone: option labels fit their buttons');
    await shot(teacher, 'lobby-8teams-390', true);
    await teacher.setViewportSize({ width: 1487, height: 722 });
    await teacher.locator('#startButton').click();
    await teacher.locator('#teamBar').waitFor();
    await teacher.waitForFunction(() => !document.querySelector('#typeInput').disabled, null, { timeout: 8000 });
    const bar = await teacher.locator('#teamBar').evaluate((b) => ({ many: b.classList.contains('many'), rows: b.children.length, height: b.getBoundingClientRect().height }));
    assert.equal(bar.rows, 8);
    assert.ok(bar.many && bar.height < 170, `team bar in two columns (height ${bar.height})`);
    await teacher.locator('#countdown').waitFor({ state: 'hidden' });
    assert.equal(await covered(teacher), 0, '8-team race: all cells fully visible at 1487×722');
    await shot(teacher, 'race-8teams-1487');
    await api(tpath + '/stop', {}, teamRoom.token);
    await teacher.locator('#teamResult .team-card').first().waitFor({ timeout: 4000 });
    assert.equal(await teacher.locator('#teamResult .team-card').count(), 8);
    assert.equal(await teacher.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await teacher.waitForTimeout(1500);
    await shot(teacher, 'results-8teams-1487', true);
    await teacher.waitForTimeout(1500);
    await shot(teacher, 'results-8teams-1487-view');
    await teacher.setViewportSize({ width: 390, height: 844 });
    await teacher.waitForTimeout(300);
    assert.equal(await teacher.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'phone results: no sideways scroll');
    await shot(teacher, 'results-8teams-390', true);

    assert.deepEqual(errors, []);
    console.log('PASS: auto-accept without Enter (typed, 두벌식 keys, IME mid-composition, late re-insert), no hint line, cell points and tiers, flying word, 8 teams lobby/race/results, settings rows on one line.');
    if (shots) console.log('WebP captures: ' + shots);
  } finally {
    await browser?.close();
    await new Promise((resolve) => server.close(resolve));
  }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
