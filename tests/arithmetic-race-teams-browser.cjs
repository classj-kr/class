'use strict';
// 연산 순위전 팀전: 실제 API로 팀 수·팀 고르기·출발 때 빈자리 채우기를 확인하고,
// 대기실·경기·결과 화면을 찍어 본다.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const root = path.resolve(__dirname, '..');
const base = process.env.ARITHMETIC_TEST_URL || 'http://127.0.0.1:8791';
const out = path.join(root, 'outputs/arithmetic-race-teams');

async function capture(page, name) {
  fs.mkdirSync(out, { recursive: true });
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const png = await page.screenshot({ fullPage: true, animations: 'disabled' });
  execFileSync('python', ['-c', 'import io,sys\nfrom PIL import Image\nImage.open(io.BytesIO(sys.stdin.buffer.read())).convert("RGBA").save(sys.argv[1],"WEBP",lossless=True,exact=True)', path.join(out, name + '.webp')], { input: png });
}

async function main() {
  const api = async body => {
    const response = await fetch(base + '/api/arithmetic-race', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
    return { status: response.status, data: await response.json() };
  };
  const created = (await api({ action: 'create', worksheetRoute: '/arithmetic/add-subtract-1', durationSeconds: 60, name: '팀장' })).data;
  const room = created.roomCode, host = created.hostToken;
  try {
    const kids = [];
    for (const name of ['가람', '나래', '다솜']) kids.push((await api({ action: 'join', roomCode: room, name })).data);
    const seat = kid => ({ roomCode: room, participantId: kid.participantId, participantToken: kid.participantToken });
    assert.equal((await api({ action: 'team', ...seat(kids[0]), team: 0 })).status, 400, 'solo race has no teams');
    assert.equal((await api({ action: 'teams', roomCode: room, hostToken: 'nope', teamCount: 2 })).status, 403);
    assert.equal((await api({ action: 'teams', roomCode: room, hostToken: host, teamCount: 5 })).status, 400);
    assert.equal((await api({ action: 'teams', roomCode: room, hostToken: host, teamCount: 2 })).status, 200);
    assert.equal((await api({ action: 'team', ...seat(kids[0]), team: 2 })).status, 400, 'only existing teams');
    assert.equal((await api({ action: 'team', ...seat(kids[0]), team: 1 })).status, 200);
    assert.equal((await api({ action: 'start', roomCode: room, hostToken: host })).status, 200);
    const snapshot = await (await fetch(base + '/api/arithmetic-race?' + new URLSearchParams({ room, hostToken: host }))).json();
    assert.equal(snapshot.race.teamCount, 2);
    assert.ok(snapshot.participants.every(person => person.team === 0 || person.team === 1), 'everyone has a team after the start');
    assert.deepEqual(snapshot.teams.map(team => team.size).sort(), [2, 2]);
    assert.equal((await api({ action: 'team', ...seat(kids[0]), team: 0 })).status, 409, 'no switching after the start');
  } finally { await api({ action: 'delete', roomCode: room, hostToken: host }); }

  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const people = [
      { id: 'me', name: '가람', score: 0, correctCount: 0, team: null },
      { id: 'a', name: '나래', score: 14, correctCount: 14, team: 0 },
      { id: 'b', name: '다솜', score: 9, correctCount: 9, team: 1 },
      { id: 'c', name: '하람', score: 6, correctCount: 6, team: 1 },
      { id: 'd', name: '새봄', score: 3, correctCount: 3, team: null },
    ];
    const race = { roomCode: '2468', worksheetName: '초1 · 덧셈과 뺄셈', worksheetRoute: '/arithmetic/add-subtract-1', seed: 20260720, status: 'waiting', startedAt: null, endsAt: null, durationSeconds: 60, mode: 'cards', teamCount: null };
    const board = () => {
      const ranking = people.slice().sort((x, y) => y.score - x.score).map((entry, index) => ({ ...entry, wrongCount: 0, skipCount: 0, rank: index + 1 }));
      const names = [['더하기팀', '+', 4], ['빼기팀', '−', 214], ['곱하기팀', '×', 146], ['나누기팀', '÷', 32]];
      const teams = race.teamCount ? names.slice(0, race.teamCount).map(([name, symbol, hue], index) => {
        const members = people.filter(p => p.team === index);
        return { index, name, symbol, hue, score: members.reduce((sum, p) => sum + p.score, 0), size: members.length, memberIds: members.map(p => p.id), rank: 0 };
      }) : null;
      if (teams) [...teams].sort((x, y) => y.score - x.score).forEach((team, index) => { team.rank = index + 1; });
      const me = people[0];
      return { race, ranking, teams, participants: people, participant: { ...me, cardIndex: 0, wrongCount: 0, skipCount: 0, rank: ranking.find(e => e.id === 'me').rank }, serverNow: Date.now() };
    };
    await page.route('**/api/**', async route => {
      const url = new URL(route.request().url());
      if (url.pathname !== '/api/arithmetic-race') return route.fulfill({ json: {} });
      if (route.request().method() === 'GET') return route.fulfill({ json: board() });
      const body = route.request().postDataJSON();
      if (body.action === 'teams') { race.teamCount = body.teamCount; people.forEach(p => { if (p.team !== null && (!race.teamCount || p.team >= race.teamCount)) p.team = null; }); }
      if (body.action === 'team') people[0].team = body.team;
      if (body.action === 'start') {
        people.forEach(p => { if (p.team === null) p.team = 1; });
        race.status = 'running'; race.startedAt = Date.now() - 1000; race.endsAt = race.startedAt + 60000;
      }
      return route.fulfill({ json: { ok: true } });
    });
    await page.goto(base + '/arithmetic/race?room=2468&participant=me&participantToken=test&hostToken=host');
    await page.getByRole('button', { name: '개인전' }).waitFor();
    await page.getByRole('button', { name: '3팀' }).click();
    await page.locator('.math-race-team-column').nth(2).waitFor();
    assert.equal(await page.locator('.math-race-team-column').count(), 3);
    await page.getByRole('button', { name: '2팀' }).click();
    await page.waitForFunction(() => document.querySelectorAll('.math-race-team-column').length === 2);
    await page.getByRole('button', { name: /빼기팀/ }).click();
    await page.locator('.math-race-team-column.is-mine').waitFor();
    assert.match(await page.locator('.math-race-team-column.is-mine').innerText(), /가람/);
    assert.match(await page.locator('.math-race-team-waiting').innerText(), /1명은 출발할 때/);
    await capture(page, 'lobby-desktop');
    await page.setViewportSize({ width: 390, height: 844 });
    await capture(page, 'lobby-mobile');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.getByRole('button', { name: '🏁 출발!' }).click();
    await page.waitForURL(/\/race\/play/);
    await page.locator('.math-race-teammates li').first().waitFor();
    assert.equal(await page.locator('.math-race-towers li').count(), 2);
    assert.match(await page.locator('.math-race-stat').first().innerText(), /우리 팀[\s\S]*1위[\s\S]*빼기팀/);
    assert.equal(await page.locator('.math-race-towers .is-me .math-race-rod').count(), 1, '빼기팀 9+6+3 = 18 → one rod');
    await capture(page, 'playing-desktop');
    race.endsAt = Date.now() - 50;
    await page.locator('.math-race-team-results').waitFor();
    assert.match(await page.locator('.card-race-result h2').innerText(), /빼기팀 1위/);
    await capture(page, 'results-desktop');
    assert.deepEqual(errors, []);
    console.log('PASS: team count, team pick, auto-fill at start, no switching mid-race, team lobby/towers/results.');
    console.log('WebP captures: ' + out);
  } finally { await browser.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
