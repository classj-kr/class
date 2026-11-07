'use strict';
// 타자 순위전 영어 판: 한/영 키가 한글인 채로 영어 낱말을 쳐도(ㅈ댜홋 → weight) 받는지, 앞 낱말 끝 받침이
// 다음 낱말 첫 모음 키에 넘어가도(six 냩 → office 냐태…) 낱말 경계가 흔들리지 않는지 실제 브라우저로 확인한다.
const assert = require('node:assert/strict');
const path = require('node:path');
const express = require('../game-hub-server/node_modules/express');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const { createTypingRace } = require('../game-hub-server/typing-race');
const { createRoomCodes } = require('../game-hub-server/room-codes');
const Core = require('../learning/inquiry/information-computing/typing/race/race-core');
const root = path.resolve(__dirname, '..');
const racePath = '/learning/inquiry/information-computing/typing/race/';
// six(…ㅌ) 다음 office(ㅐ…), office(…ㄷ) 다음 young(ㅛ…): 받침이 다음 글자로 넘어가는 짝.
const WORDS = ['six', 'office', 'young', 'kite', 'map', 'hot', 'blue', 'green', 'apple', 'zoo', 'cat', 'dog'];

// 한글 입력기 흉내: 친 키를 두벌식으로 조합해, 끝 글자만 조합 중으로 두고 앞 글자는 확정한다.
// tail: 앞 낱말 끝 글자가 아직 조합 중이면 그 글자를 만든 키(입력기는 그 글자에 이어 조합한다).
async function imeKeys(cdp, word, tail = '') {
  let committed = '';
  for (let n = 1; n <= word.length; n++) {
    const text = Core.hangulFromKeys(tail + word.slice(0, n));
    const head = text.slice(0, -1);
    if (head !== committed) {
      assert.ok(head.startsWith(committed), `${word}: ${committed} → ${head}`);
      await cdp.send('Input.insertText', { text: head.slice(committed.length) });
      committed = head;
    }
    await cdp.send('Input.imeSetComposition', { text: text.slice(-1), selectionStart: 1, selectionEnd: 1 });
    await new Promise((resolve) => setTimeout(resolve, 70)); // 사람 손 빠르기(서버가 너무 빠른 입력을 막는다)
  }
  return Core.keysFromHangul(Core.hangulFromKeys(tail + word).slice(-1));
}

async function main() {
  assert.equal(Core.keysFromHangul('ㅈ댜홋'), 'weight');
  for (const w of WORDS) assert.equal(Core.keysFromHangul(Core.hangulFromKeys(w)), w, w);
  const app = express();
  app.use(express.json());
  app.get('/api/me/storage/:app', (_, res) => res.status(401).json({ error: 'guest' }));
  app.get('/api/student/profile', (_, res) => res.json({ profile: null }));
  app.get('/api/teacher/settings', (_, res) => res.status(401).json({}));
  app.get('/api/home-content-access', (_, res) => res.json({ globallyDisabledPaths: [] }));
  const platform = {
    roomCodes: createRoomCodes({ isActive: async (e) => race.hasRoomCode(e.code) }),
    isTeacherRequest: async () => false,
    isContentGloballyDisabled: async () => false,
    canBypassGlobalContentLock: async () => false,
    displayNameFor: async () => ({ name: '가람' }),
  };
  const race = createTypingRace({ platform, pickItems: (mode, count) => Array.from({ length: count }, (_, i) => WORDS[i % WORDS.length]) });
  app.use('/api/typing-race', race.router);
  app.use(express.static(root));
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  let browser;
  try {
    browser = await chromium.launch({ channel: 'msedge', headless: true });
    const context = await browser.newContext({ viewport: { width: 1487, height: 722 } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(origin + racePath);
    await page.locator('#createButton').click();
    await page.locator('#startButton').waitFor();
    await page.getByRole('button', { name: '영어 단어', exact: true }).first().click();
    await page.waitForTimeout(400);
    await page.locator('#startButton').click();
    await page.waitForFunction(() => !document.querySelector('#typeInput').disabled && document.activeElement?.id === 'typeInput', null, { timeout: 8000 });
    const words = await page.locator('#board .tile-word').allInnerTexts();
    assert.deepEqual(words.slice(0, 3), ['six', 'office', 'young'], `board ${words}`);
    const cdp = await context.newCDPSession(page);
    const score = async () => Number(await page.locator('#scoreNow').innerText());
    const taken = (w) => page.waitForFunction((w) => [...document.querySelectorAll('#board .tile')].every((t) => t.querySelector('.tile-word').textContent !== w || t.dataset.tier === 'done') && document.querySelector('#typed').textContent === '', w, { timeout: 4000 });

    let tail = '';
    for (const word of ['six', 'office', 'young']) {
      const before = await score();
      // 마지막 키 전까지 화면에는 그 낱말의 앞부분만 영어로 보인다(앞 낱말 받침이 섞이지 않는다).
      const shown = [];
      const watch = setInterval(async () => { try { shown.push(await page.locator('#typed').textContent()); } catch { /* 닫힘 */ } }, 5);
      tail = await imeKeys(cdp, word, tail);
      clearInterval(watch);
      await taken(word).catch(async (e) => { throw new Error(`${word}: ` + JSON.stringify(await page.evaluate(() => ({ value: document.querySelector('#typeInput').value, typed: document.querySelector('#typed').textContent, score: document.querySelector('#scoreNow').textContent, tiles: [...document.querySelectorAll('#board .tile')].map((t) => t.querySelector('.tile-word').textContent + ':' + t.dataset.tier) }))) + e.message); });
      await page.waitForFunction((b) => Number(document.querySelector('#scoreNow').textContent) > b, before, { timeout: 4000 }).catch(() => { throw new Error(`${word}: accepted without Enter (score stayed ${before})`); });
      for (const text of shown) assert.ok(text === '' || word.startsWith(text), `${word}: shown "${text}"`);
      assert.equal(await page.locator('#card.wrong').count(), 0, `${word}: no wrong flash`);
    }
    // 입력기가 끝 글자를 확정하면 칸이 실제로 비워진다.
    await cdp.send('Input.insertText', { text: Core.hangulFromKeys(tail) });
    await page.waitForFunction(() => document.querySelector('#typeInput').value === '');
    assert.match(await page.locator('#toast').innerText(), /영어로 바꿔 받고/);
    assert.deepEqual(errors, []);
    console.log('PASS: English board typed with the Korean IME (ㅈ댜홋 → weight), carried-over 받침 between words, field tidied after commit.');
  } finally {
    await browser?.close();
    server.close();
  }
}

main().catch((error) => { console.error(error); process.exit(1); });
