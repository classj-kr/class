'use strict';
// 연산 순위전 팀전: 실제 API로 팀 수(2~8)·팀 고르기·출발 때 빈자리 채우기·제한 시간 바꾸기를 확인하고,
// 대기실(여덟 팀까지)·경기·결과 화면을 찍어 본다.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const root = path.resolve(__dirname, '..');
const base = process.env.ARITHMETIC_TEST_URL || 'http://127.0.0.1:8791';
const built = path.join(root, 'learning/literacy-numeracy/arithmetics/dist/client');
const out = process.env.ARITHMETIC_CAPTURE_DIR || path.join(root, 'outputs/arithmetic-race-teams');
// 팀 이름은 팀 색 그대로(문해력 순위전과 같은 차례·색).
const NAMES = [['빨강팀', '🔴', 0], ['파랑팀', '🔵', 220], ['노랑팀', '🟡', 48], ['초록팀', '🟢', 130], ['보라팀', '🟣', 275], ['주황팀', '🟠', 26], ['분홍팀', '🩷', 330], ['하늘팀', '🩵', 195]];

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
  const created = (await api({ action: 'create', worksheetRoute: '/arithmetic/add-subtract-1', name: '팀장' })).data;
  const room = created.roomCode, host = created.hostToken;
  try {
    // 학습지 단추는 묻지 않고 기본 3분으로 방을 만들고, 시간은 대기실에서 방장만 바꾼다.
    assert.equal(created.race.durationSeconds, 180);
    assert.equal((await api({ action: 'duration', roomCode: room, hostToken: 'nope', durationSeconds: 60 })).status, 403);
    assert.equal((await api({ action: 'duration', roomCode: room, hostToken: host, durationSeconds: 90 })).status, 400);
    assert.equal((await api({ action: 'duration', roomCode: room, hostToken: host, durationSeconds: 60 })).status, 200);
    const waiting = await (await fetch(base + '/api/arithmetic-race?' + new URLSearchParams({ room, hostToken: host }))).json();
    assert.equal(waiting.race.durationSeconds, 60);
    const kids = [];
    for (const name of ['가람', '나래', '다솜']) kids.push((await api({ action: 'join', roomCode: room, name })).data);
    const seat = kid => ({ roomCode: room, participantId: kid.participantId, participantToken: kid.participantToken });
    assert.equal((await api({ action: 'team', ...seat(kids[0]), team: 0 })).status, 400, 'solo race has no teams');
    assert.equal((await api({ action: 'teams', roomCode: room, hostToken: 'nope', teamCount: 2 })).status, 403);
    assert.equal((await api({ action: 'teams', roomCode: room, hostToken: host, teamCount: 9 })).status, 400);
    assert.equal((await api({ action: 'teams', roomCode: room, hostToken: host, teamCount: 1 })).status, 400);
    assert.equal((await api({ action: 'teams', roomCode: room, hostToken: host, teamCount: 8 })).status, 200);
    assert.equal((await api({ action: 'team', ...seat(kids[1]), team: 7 })).status, 200, 'the eighth team exists');
    assert.equal((await api({ action: 'teams', roomCode: room, hostToken: host, teamCount: 2 })).status, 200);
    assert.equal((await api({ action: 'team', ...seat(kids[0]), team: 2 })).status, 400, 'only existing teams');
    assert.equal((await api({ action: 'team', ...seat(kids[0]), team: 1 })).status, 200);
    assert.equal((await api({ action: 'start', roomCode: room, hostToken: host })).status, 200);
    const snapshot = await (await fetch(base + '/api/arithmetic-race?' + new URLSearchParams({ room, hostToken: host }))).json();
    assert.equal(snapshot.race.teamCount, 2);
    assert.ok(snapshot.participants.every(person => person.team === 0 || person.team === 1), 'everyone has a team after the start');
    assert.deepEqual(snapshot.teams.map(team => team.size).sort(), [2, 2]);
    assert.equal((await api({ action: 'team', ...seat(kids[0]), team: 0 })).status, 409, 'no switching after the start');
    assert.equal((await api({ action: 'duration', roomCode: room, hostToken: host, durationSeconds: 120 })).status, 409, 'no time change after the start');
    assert.equal(snapshot.race.endsAt - snapshot.race.startedAt, 60000);
  } finally { await api({ action: 'delete', roomCode: room, hostToken: host }); }

  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    // vinext start 는 /assets 를 내주지 않으니(사이트 서버가 내준다) 저장소와 빌드 결과에서 바로 준다.
    await page.route('**/assets/**', async route => {
      const pathname = decodeURIComponent(new URL(route.request().url()).pathname);
      const target = path.resolve(root, '.' + pathname), app = path.resolve(built, '.' + pathname);
      if (target.startsWith(root + path.sep) && fs.existsSync(target) && fs.statSync(target).isFile()) await route.fulfill({ path: target });
      else if (app.startsWith(built + path.sep) && fs.existsSync(app) && fs.statSync(app).isFile()) await route.fulfill({ path: app });
      else await route.continue();
    });
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
      const teams = race.teamCount ? NAMES.slice(0, race.teamCount).map(([name, emoji, hue], index) => {
        const members = people.filter(p => p.team === index);
        return { index, name, emoji, hue, score: members.reduce((sum, p) => sum + p.score, 0), size: members.length, memberIds: members.map(p => p.id), rank: 0 };
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
      if (body.action === 'duration') race.durationSeconds = body.durationSeconds;
      if (body.action === 'start') {
        people.forEach(p => { if (p.team === null) p.team = 1; });
        race.status = 'running'; race.startedAt = Date.now() - 1000; race.endsAt = race.startedAt + 60000;
      }
      return route.fulfill({ json: { ok: true } });
    });
    await page.goto(base + '/arithmetic/race?room=2468&participant=me&participantToken=test&hostToken=host');
    await page.getByRole('button', { name: '개인전' }).waitFor();
    // 제한 시간은 방장이 대기실에서 고른다. 방장 화면에는 따로 시간 딱지를 두지 않는다.
    const time = page.getByRole('group', { name: '제한 시간' });
    assert.equal(await time.getByRole('button', { name: '1분', exact: true }).getAttribute('aria-pressed'), 'true');
    await time.getByRole('button', { name: '2분', exact: true }).click();
    await page.waitForFunction(() => document.querySelector('[aria-label="제한 시간"] button[aria-pressed="true"]')?.textContent === '2분');
    assert.equal(race.durationSeconds, 120);
    assert.equal(await page.locator('.race-mode-note b').count(), 0);
    // 여덟 팀: 넓은 화면은 한 줄, 중간 폭은 두 줄, 휴대폰은 두 칸씩. 어디서도 칸 밖으로 넘치지 않는다.
    await page.getByRole('button', { name: '8팀', exact: true }).click();
    await page.waitForFunction(() => document.querySelectorAll('.math-race-team-column').length === 8);
    for (const [width, columns] of [[1680, 8], [1007, 8], [768, 4], [390, 2]]) {
      await page.setViewportSize({ width, height: 900 });
      const grid = await page.evaluate(() => {
        const heads = [...document.querySelectorAll('.math-race-team-column')];
        // 글꼴이 섞이면 한 줄도 조각이 여럿이므로, 위아래로 겹치지 않는 조각만 다른 줄로 센다.
        const lines = node => {
          const range = document.createRange(); range.selectNodeContents(node);
          const rows = [];
          for (const rect of range.getClientRects()) if (rect.height && !rows.some(row => rect.top < row.bottom - 2 && rect.bottom > row.top + 2)) rows.push(rect);
          return rows.length;
        };
        return {
          tops: new Set(heads.map(head => Math.round(head.getBoundingClientRect().top))).size,
          lefts: new Set(heads.map(head => Math.round(head.getBoundingClientRect().left))).size,
          overflow: heads.filter(head => head.scrollWidth > head.clientWidth + 1).length,
          wrapped: [...document.querySelectorAll('.math-race-team-head b, .math-race-team-setup button')].filter(node => lines(node) > 1).map(node => node.textContent),
          pageFits: document.documentElement.scrollWidth <= innerWidth,
          names: heads.map(head => head.querySelector('b').textContent),
        };
      });
      assert.equal(grid.lefts, columns, `${width}: ${columns} columns`);
      assert.equal(grid.tops, 8 / columns, `${width}: ${8 / columns} rows`);
      assert.equal(grid.overflow, 0, `${width}: team columns do not overflow`);
      assert.deepEqual(grid.wrapped, [], `${width}: labels stay on one line`);
      assert.ok(grid.pageFits, `${width}: no sideways scroll`);
      assert.deepEqual(grid.names, NAMES.map(([name]) => name));
      if (width === 1680 || width === 390) await capture(page, `lobby-8-${width}`);
    }
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.getByRole('button', { name: '3팀' }).click();
    await page.waitForFunction(() => document.querySelectorAll('.math-race-team-column').length === 3);
    await page.getByRole('button', { name: '2팀' }).click();
    await page.waitForFunction(() => document.querySelectorAll('.math-race-team-column').length === 2);
    await page.getByRole('button', { name: /파랑팀/ }).click();
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
    assert.match(await page.locator('.math-race-stat').first().innerText(), /우리 팀[\s\S]*1위[\s\S]*파랑팀/);
    assert.equal(await page.locator('.math-race-towers .is-me .math-race-rod').count(), 1, '파랑팀 9+6+3 = 18 → one rod');
    // 팀 탑 꼭대기에는 팀 기호가 아니라 팀원 모두의 아바타가 선다.
    assert.equal(await page.locator('.math-race-towers .is-me .math-race-crew .math-race-avatar').count(), 4, '파랑팀 네 명이 탑 위에');
    assert.equal(await page.locator('.math-race-towers li:not(.is-me) .math-race-crew .math-race-avatar').count(), 1);
    assert.equal(await page.locator('.math-race-towers .is-leader').count(), 1, '1위 팀 왕관');
    await capture(page, 'playing-desktop');
    // 팀 점수가 오르면 그 팀이 튀고 +점수가 솟는다.
    people[1].score += 3;
    await page.locator('.math-race-towers li:not(.is-me) .math-race-gain').waitFor({ timeout: 5000 });
    assert.equal(await page.locator('.math-race-towers li:not(.is-me) .math-race-gain').innerText(), '+3');
    assert.equal(await page.locator('.math-race-towers li:not(.is-me) .math-race-crew.is-hop').count(), 1);
    people[1].score -= 3;
    race.endsAt = Date.now() - 50;
    await page.locator('.math-race-team-podium').waitFor();
    assert.match(await page.locator('.card-race-result h2').innerText(), /파랑팀 1위/);
    // 시상대에는 팀이 오르고 팀원 모두가 단 위에 선다. 개인 순위는 표에만(메달 없이).
    const podium = await page.evaluate(() => [...document.querySelectorAll('.math-race-team-podium .step:not(.empty)')].map(step => ({ name: step.querySelector('strong').textContent, faces: step.querySelectorAll('.math-race-podium-crew .math-race-avatar').length })));
    assert.deepEqual(podium, [{ name: '🔴 빨강팀', faces: 1 }, { name: '🔵 파랑팀', faces: 4 }]);
    assert.equal(await page.locator('.card-race-board.final li').count(), people.length);
    assert.doesNotMatch(await page.locator('.card-race-board.final').innerText(), /🥇|🥈|🥉/);
    await capture(page, 'results-desktop');

    // 여덟 팀 경기: 탑 여덟 개가 모두 서고, 짧은 이름이 칸 안에 들어가며, 결과에 여덟 팀이 다 나온다.
    const extra = [['e', '보라', 4], ['f', '하늘', 5], ['g', '분홍', 6], ['h', '노랑', 7], ['i', '초록', 2], ['j', '주황', 3]];
    for (const [id, name, team] of extra) people.push({ id, name, score: 2 + team, correctCount: 2 + team, team });
    people[0].team = 7; people[0].score = 4;
    race.teamCount = 8; race.status = 'running'; race.startedAt = Date.now() - 1000; race.endsAt = race.startedAt + 120000;
    for (const width of [1280, 390]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(base + '/arithmetic/race/play?room=2468&participant=me&participantToken=test');
      await page.locator('.math-race-towers ol.is-crowded').waitFor();
      const towers = await page.evaluate(() => {
        const items = [...document.querySelectorAll('.math-race-towers li')];
        const box = document.querySelector('.math-race-towers').getBoundingClientRect();
        return {
          count: items.length,
          names: items.map(item => item.querySelector('.math-race-tower-name').textContent),
          clipped: items.filter(item => { const name = item.querySelector('.math-race-tower-name'); return name.scrollWidth > name.clientWidth + 1; }).length,
          outside: items.filter(item => { const rect = item.getBoundingClientRect(); return rect.left < box.left - 1 || rect.right > box.right + 1; }).length,
          pageFits: document.documentElement.scrollWidth <= innerWidth,
        };
      });
      assert.equal(towers.count, 8, `${width}: all eight team towers`);
      assert.ok(towers.names.some(name => /하늘$/.test(name)), `${width}: short team names`);
      assert.equal(towers.clipped, 0, `${width}: tower names fit`);
      assert.equal(towers.outside, 0, `${width}: towers stay inside the panel`);
      assert.ok(towers.pageFits, `${width}: no sideways scroll`);
      await capture(page, `playing-8-${width}`);
    }
    race.endsAt = Date.now() - 50;
    await page.locator('.math-race-team-podium').waitFor();
    assert.equal(await page.locator('.math-race-team-podium .step:not(.empty)').count(), 3);
    assert.equal(await page.locator('.math-race-team-results li').count(), 5, 'teams 4-8 under the podium');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await capture(page, 'results-8-mobile');
    assert.deepEqual(errors, []);
    console.log('PASS: team count 2-8, team pick, auto-fill at start, no switching mid-race, duration set in the lobby, eight-team lobby/towers/results.');
    console.log('WebP captures: ' + out);
  } finally { await browser.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
