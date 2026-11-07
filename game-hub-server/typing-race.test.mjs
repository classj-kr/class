import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url),
  express = require('express');
const { createTypingRace } = require('./typing-race'),
  { createRoomCodes } = require('./room-codes'),
  { createRoomEntry } = require('./room-entry');
const Core = require('../learning/inquiry/information-computing/typing/race/race-core');
const { roundItems } = require('./typing-race-words');

test('keystrokes follow the two-set Korean keyboard, including in-between shapes', () => {
  assert.equal(Core.strokes('사과'), 5);
  assert.equal(Core.strokes('닭'), 4);
  assert.equal(Core.strokes('apple'), 5);
  assert.ok(Core.onTrack('삭', '사과'));
  assert.ok(Core.onTrack('닭', '달걀'), '달 + ㄱ shows 닭 before ㅕ arrives');
  assert.ok(!Core.onTrack('닥', '달걀'));
  assert.ok(Core.onTrack('달ㄱ', '달걀'));
  assert.ok(Core.onTrack('ㅅ', '사과'));
  assert.ok(Core.onTrack('사고', '사과'), 'ㅗ then ㅏ becomes ㅘ');
  assert.ok(!Core.onTrack('사기', '사과'));
  assert.equal(Core.itemScore('사과', 10), 10);
  assert.equal(Core.itemScore('사과', 0), 5);
});

test('round items come from the typing practice sources', () => {
  for (const mode of Object.keys(Core.MODES)) {
    const items = roundItems(mode, 200);
    assert.equal(items.length, 200);
    assert.ok(new Set(items).size >= 10, mode);
  }
  assert.ok(roundItems('ko-words', 50).every((w) => /^[가-힣]{2,5}$/.test(w)));
  assert.ok(roundItems('en-words', 50).every((w) => /^[a-z]{2,10}$/.test(w)));
});

test('team board uses totals even for legacy average requests', () => {
  const rows = [
    { team: 0, score: 50, scoredAt: 5 },
    { team: 1, score: 30, scoredAt: 4 },
    { team: 1, score: 30, scoredAt: 3 },
    { team: 1, score: 30, scoredAt: 2 },
  ];
  const sum = Core.teamBoard(rows, 3, 'sum');
  assert.deepEqual(sum.map((t) => [t.size, t.value, t.rank]), [[1, 50, 2], [3, 90, 1], [0, 0, undefined]]);
  const avg = Core.teamBoard(rows, 2, 'avg');
  assert.deepEqual(avg.map((t) => [t.value, t.rank]), [[50, 2], [90, 1]]);
  const withBeginner = Core.teamBoard([...rows, { team: 1, score: 1, scoredAt: 6 }], 3);
  assert.equal(withBeginner[1].value, 91, 'a beginner adds to the team score');
  assert.equal(withBeginner[1].rank, 1);
  const withNewcomer = Core.teamBoard([...rows, { team: 1, score: 0 }], 3);
  assert.equal(withNewcomer[1].value, 90, 'joining with zero points never lowers the team score');
});

test('team race: self-pick, 5-member cap, teacher moves, shuffle, start checks, team results', async (t) => {
  let clock = Date.now();
  const codes = createRoomCodes({ random: () => 5678, isActive: async (e) => activity.hasRoomCode(e.code) });
  const platform = {
    roomCodes: codes,
    isTeacherRequest: async (req) => req.get('x-role') === 'teacher',
    isContentGloballyDisabled: async () => false,
    canBypassGlobalContentLock: async () => false,
    displayNameFor: async (req) => ({ name: decodeURIComponent(req.get('x-name') || '') }),
  };
  const activity = createTypingRace({ platform, now: () => clock }), app = express();
  app.use(express.json());
  app.use('/api/typing-race', activity.router);
  const s = app.listen(0, '127.0.0.1');
  await new Promise((r) => s.once('listening', r));
  t.after(() => new Promise((r) => s.close(r)));
  const base = `http://127.0.0.1:${s.address().port}/api/typing-race`;
  const req = async (path, body, token = '', role = '', name = '') => {
    const r = await fetch(base + path, { method: body === undefined ? 'GET' : 'POST', headers: { 'Content-Type': 'application/json', 'x-role': role, 'x-name': encodeURIComponent(name), Authorization: 'Bearer ' + token }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
    return { status: r.status, data: await r.json() };
  };
  const made = (await req('/rooms', { teamMode: true, teamCount: 2, teamScore: 'avg' }, '', 'teacher')).data;
  assert.equal(made.state.config.teamScore, 'sum');
  const host = made.token, path = '/rooms/' + made.state.code;
  const kids = [];
  for (const name of ['가', '나', '다', '라', '마', '바', '사']) kids.push((await req(path + '/join', {}, '', '', name)).data);
  assert.equal(kids[0].state.me.team, null);
  assert.equal(kids[0].state.teams.length, 2);
  for (const k of kids.slice(0, 5)) assert.equal((await req(path + '/team', { team: 1 }, k.token)).status, 200);
  assert.equal((await req(path + '/team', { team: 1 }, kids[5].token)).status, 409, 'five per team');
  assert.equal((await req(path + '/team', { team: 2 }, kids[5].token)).status, 400);
  assert.equal((await req(path + '/team', { team: 0 }, kids[5].token)).status, 200);
  assert.equal(made.state.me.plays, true, 'the teacher host races too');
  assert.equal((await req(path + '/team', { team: 0 }, host)).status, 200);
  assert.equal((await req(path + '/start', {}, host, 'teacher')).data.message, '아직 팀이 없는 사람이 1명 있어요.');
  assert.equal((await req(path + '/assign', { playerId: kids[6].state.me.id, team: 0 }, kids[0].token)).status, 403);
  const moved = (await req(path + '/assign', { playerId: kids[6].state.me.id, team: 0 }, host, 'teacher')).data;
  assert.deepEqual(moved.teams.map((x) => x.size), [3, 5], 'uneven teams are allowed');
  const shrunk = (await req(path + '/settings', { teamCount: 3, teamScore: 'avg' }, host, 'teacher')).data;
  assert.equal(shrunk.config.teamScore, 'sum');
  assert.equal(shrunk.teams.length, 3);
  const shuffled = (await req(path + '/shuffle', {}, host, 'teacher')).data;
  assert.deepEqual(shuffled.teams.map((x) => x.size).sort(), [2, 3, 3]);
  assert.ok(shuffled.participants.every((x) => x.team !== null));
  const started = (await req(path + '/start', { teamCount: 3, teamScore: 'avg' }, host, 'teacher')).data;
  assert.equal(started.config.teamScore, 'sum');
  assert.equal((await req(path + '/team', { team: 0 }, kids[0].token)).status, 409, 'no switching mid-race');
  clock = started.startsAt + 5000;
  const typed = (await req(path + '/type', { roundId: started.roundId, slot: started.board[0].id, text: started.board[0].text, mistakes: 0 }, kids[0].token)).data;
  const myTeam = typed.state.me.team;
  assert.equal(typed.state.teams[myTeam].rank, 1);
  assert.equal(typed.state.teams[myTeam].total, typed.state.me.score);
  assert.equal(typed.state.teams[myTeam].value, typed.state.me.score, 'team score is not divided by teammates');
  const late = (await req(path + '/join', {}, '', '', '아')).data;
  assert.notEqual(late.state.me.team, null, 'late joiners land on an open team');
  const solo = (await req(path + '/settings', { teamMode: false }, host, 'teacher'));
  assert.equal(solo.status, 409, 'settings stay during a race');
});

test('students open their own room and race in it as host', async (t) => {
  let clock = Date.now();
  const codes = createRoomCodes({ random: () => 2468, isActive: async (e) => activity.hasRoomCode(e.code) });
  const platform = {
    roomCodes: codes,
    isTeacherRequest: async (req) => req.get('x-role') === 'teacher',
    isContentGloballyDisabled: async () => false,
    canBypassGlobalContentLock: async () => false,
    displayNameFor: async (req) => ({ name: decodeURIComponent(req.get('x-name') || '') }),
  };
  const activity = createTypingRace({ platform, now: () => clock }), app = express();
  app.use(express.json());
  app.use('/api/typing-race', activity.router);
  const s = app.listen(0, '127.0.0.1');
  await new Promise((r) => s.once('listening', r));
  t.after(() => new Promise((r) => s.close(r)));
  const base = `http://127.0.0.1:${s.address().port}/api/typing-race`;
  const req = async (path, body, token = '', name = '') => {
    const r = await fetch(base + path, { method: body === undefined ? 'GET' : 'POST', headers: { 'Content-Type': 'application/json', 'x-name': encodeURIComponent(name), Authorization: 'Bearer ' + token }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
    return { status: r.status, data: await r.json() };
  };
  assert.equal((await req('/rooms', {})).status, 403, 'a name is needed');
  const first = (await req('/rooms', { avatarUrl: '/assets/avatars/animal-cat.webp' }, '', '가람')).data;
  const made = (await req('/rooms', {}, '', '가람')).data;
  assert.equal(activity.hasRoomCode(first.state.code) && first.state.code !== made.state.code, false, 'one open room per student');
  const host = made.token, path = '/rooms/' + made.state.code;
  assert.equal(made.state.me.host, true);
  assert.equal(made.state.me.plays, true);
  assert.equal(made.state.participants.length, 1, 'the host is on the board');
  const friend = (await req(path + '/join', {}, '', '나래')).data;
  assert.equal((await req(path + '/start', {}, friend.token)).status, 403, 'only the host starts');
  const started = (await req(path + '/start', { duration: 60 }, host)).data;
  clock = started.startsAt + 5000;
  const typed = (await req(path + '/type', { roundId: started.roundId, slot: started.board[0].id, text: started.board[0].text, mistakes: 0 }, host)).data;
  assert.ok(typed.state.me.score > 0, 'the host races too');
  assert.equal(typed.state.participants[0].name, '가람');
  assert.equal((await req(path + '/leave', {}, host)).status, 200);
  assert.equal(activity.hasRoomCode(made.state.code), false);
});

test('teacher room, shared entry, live scoring, combo, speed guard, and results', async (t) => {
  let clock = Date.now();
  const codes = createRoomCodes({ random: () => 4321, isActive: async (e) => activity.hasRoomCode(e.code) });
  const platform = {
    roomCodes: codes,
    configuration: () => ({ enabled: true }),
    isTeacherRequest: async (req) => req.get('x-role') === 'teacher',
    isContentGloballyDisabled: async () => false,
    canBypassGlobalContentLock: async () => false,
    displayNameFor: async (req) => ({ name: decodeURIComponent(req.get('x-name') || '') }),
  };
  const activity = createTypingRace({ platform, now: () => clock }),
    app = express();
  app.use(express.json());
  app.use('/api/typing-race', activity.router);
  app.use('/api/room-entry', createRoomEntry({ roomCodes: codes, typingExists: (c) => activity.hasRoomCode(c) }));
  const s = app.listen(0, '127.0.0.1');
  await new Promise((r) => s.once('listening', r));
  t.after(() => new Promise((r) => s.close(r)));
  const origin = `http://127.0.0.1:${s.address().port}`;
  async function req(path, body, token = '', role = '', name = '') {
    const response = await fetch(origin + '/api/typing-race' + path, {
      method: body === undefined ? 'GET' : 'POST',
      headers: { 'Content-Type': 'application/json', 'x-role': role, 'x-name': encodeURIComponent(name), Authorization: 'Bearer ' + token },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    return { status: response.status, data: await response.json() };
  }
  assert.equal((await req('/rooms', {})).status, 403);
  const made = await req('/rooms', { mode: 'ko-words', duration: 60 }, '', 'teacher');
  const code = made.data.state.code, host = made.data.token, path = '/rooms/' + code;
  assert.deepEqual(await (await fetch(`${origin}/api/room-entry/resolve/${code}`)).json(), {
    type: 'typing',
    href: `/learning/inquiry/information-computing/typing/race/?room=${code}`,
  });
  assert.equal(made.data.state.me.plays, true, 'the teacher host races like a student host');
  // "참여하지 않고 관전하기": 교사 방장은 순위판에 없고 큰 화면만 본다.
  const watching = (await req('/rooms', { spectate: true }, '', 'teacher')).data;
  assert.equal(watching.state.me.plays, false);
  assert.equal(watching.state.participants.length, 0);
  assert.equal((await req('/rooms/' + watching.state.code + '/leave', {}, watching.token, 'teacher')).status, 200);
  const a = (await req(path + '/join', { avatarUrl: '/assets/avatars/animal-fox.webp' }, '', '', '가람')).data;
  const b = (await req(path + '/join', { avatarUrl: 'https://evil.example/x.webp' }, '', '', '나래')).data;
  assert.equal(a.state.me.avatarUrl, '/assets/avatars/animal-fox.webp');
  assert.equal(b.state.me.avatarUrl, null, 'only site avatar paths are kept');
  const again = (await req(path + '/join', {}, '', '', '가람')).data;
  assert.equal(again.state.me.id, a.state.me.id, 'a reload reclaims the same seat');
  assert.equal(again.state.me.avatarUrl, '/assets/avatars/animal-fox.webp', 'avatar survives a reload');
  assert.equal((await req(path, undefined, a.token)).status, 403, 'the old tab loses the seat');
  a.token = again.token;
  assert.equal(again.state.participants.length, 3, 'teacher + two students');
  assert.notEqual(a.state.me.racer, b.state.me.racer);
  assert.equal((await req(path + '/start', {}, a.token, 'teacher')).status, 403, 'students cannot start');
  const started = (await req(path + '/start', { mode: 'en-words', duration: 60 }, host, 'teacher')).data;
  assert.equal(started.config.mode, 'en-words');
  const roundId = started.roundId;
  assert.equal(started.board.length, Core.boardSize('en-words'), 'everyone sees one shared board of words');
  assert.equal((await req(path)).status, 403);
  const type = (token, cell, mistakes = 0, text = cell.text) => req(path + '/type', { roundId, slot: cell.id, text, mistakes }, token);
  const [w0, w1, w2, w3] = started.board;
  assert.equal((await type(a.token, w0)).status, 409, 'not before the countdown');
  clock = started.startsAt + 30;
  assert.equal((await type(a.token, w0)).status, 429, 'too fast to be typed');
  clock = started.startsAt + 5000;
  assert.equal((await type(a.token, w0, 0, w0.text + 'x')).status, 409, 'must match the word on the board');
  // 아무 낱말이나 골라 친다. 먼저 친 순서대로 1등 +5, 2등 +3, 3등 +1.
  const first = (await type(a.token, w1)).data;
  assert.equal(first.order, 1);
  assert.equal(first.combo, 1);
  assert.equal(first.gained, Core.itemScore(w1.text, 1) + 5);
  assert.equal((await type(a.token, w1)).status, 409, 'one claim per word per person');
  clock += 1000;
  const secondPlace = (await type(b.token, w1)).data;
  assert.equal(secondPlace.order, 2);
  assert.equal(secondPlace.gained, Core.itemScore(w1.text, 1) + 3);
  const cell = secondPlace.state.board.find((x) => x.id === w1.id);
  assert.equal(cell.count, 2);
  assert.equal(cell.mine, 2, 'the board shows which place I took');
  assert.deepEqual(cell.claims.map((x) => x.name), ['가람', '나래']);
  const second = (await type(a.token, w0)).data;
  assert.equal(second.combo, 2);
  // 첫 사람이 친 뒤 HOLD_MS가 지나면 새 낱말로 바뀌고, 막 바뀐 낱말은 잠깐 더 받아 준다.
  clock += Core.HOLD_MS;
  const later = (await req(path, undefined, b.token)).data;
  assert.ok(!later.board.some((x) => x.id === w0.id || x.id === w1.id), 'claimed words are replaced');
  assert.ok(later.recent.some((x) => x.id === w0.id), 'a word that just left can still be finished');
  assert.equal((await type(b.token, w0)).data.order, 2, 'finishing a word that just left still counts');
  clock += 4000;
  const missed = (await type(a.token, w2, 2)).data;
  assert.equal(missed.combo, 0);
  assert.equal(missed.state.me.rank, 1);
  const boardRow = missed.state.participants[0];
  assert.equal(boardRow.name, '가람');
  assert.equal(boardRow.count, 3);
  assert.ok(boardRow.accuracy < 100);
  const lateComer = (await req(path + '/join', {}, '', '', '다솜')).data;
  assert.deepEqual(lateComer.state.board.map((x) => x.id), missed.state.board.map((x) => x.id), 'late joiners see the same board');
  void w3;
  clock = started.deadline + 2000;
  const done = (await req(path, undefined, b.token)).data;
  assert.equal(done.phase, 'results');
  assert.equal(done.participants[0].name, '가람');
  assert.equal((await type(a.token, w3)).status, 409);
  const back = (await req(path + '/lobby', {}, host, 'teacher')).data;
  assert.equal(back.phase, 'lobby');
  assert.ok(back.participants.every((x) => x.score === 0));
  assert.equal((await req(path + '/leave', {}, host, 'teacher')).status, 200);
  assert.equal(activity.hasRoomCode(code), false);
  assert.equal((await fetch(`${origin}/api/room-entry/resolve/${code}`)).status, 404);
});

test('keys typed with 한/영 left on English become the Korean they meant (두벌식)', () => {
  assert.equal(Core.hangulFromKeys('qjfduTek'), '벌였다');
  assert.equal(Core.hangulFromKeys('dkssudgktpdy'), '안녕하세요');
  assert.equal(Core.hangulFromKeys('ekfrdl'), '닭이');
  assert.equal(Core.hangulFromKeys('gksrmf tkfkd'), '한글 사랑');
  assert.equal(Core.hangulFromKeys('QJFDUtEK'), '벌였다', 'Caps Lock: capitals are plain keys, lowercase was Shift');
  assert.equal(Core.hangulFromKeys('벌였'), '벌였', 'Korean already typed stays as is');
});

test('a word that starts another word never shares the board (typing it would end the longer one early)', async (t) => {
  assert.ok(Core.clash('가', '가방'));
  assert.ok(Core.clash('삭', '사과'), '삭 is how 사과 looks halfway through');
  assert.ok(Core.clash('to', 'today'));
  assert.ok(Core.clash('나무', '나무'), 'the same word twice is a clash too');
  assert.ok(!Core.clash('사과', '사자'));
  assert.ok(Core.clash('닭', '달걀'), '달걀 shows 닭 for a moment before ㅕ moves the ㄱ');
  let clock = Date.now();
  const words = ['가', '가방', '삭', '사과', '나무', '나무꾼', '하늘', '바다', '구름', '연필', '노래', '친구', '학교', '강아지', '고양이', '무지개'];
  const codes = createRoomCodes({ random: () => 1357, isActive: async (e) => activity.hasRoomCode(e.code) });
  const platform = {
    roomCodes: codes,
    isTeacherRequest: async () => false,
    isContentGloballyDisabled: async () => false,
    canBypassGlobalContentLock: async () => false,
    displayNameFor: async () => ({ name: '가람' }),
  };
  const activity = createTypingRace({ platform, now: () => clock, pickItems: (mode, count) => Array.from({ length: count }, (_, i) => words[i % words.length]) });
  const app = express();
  app.use(express.json());
  app.use('/api/typing-race', activity.router);
  const s = app.listen(0, '127.0.0.1');
  await new Promise((r) => s.once('listening', r));
  t.after(() => new Promise((r) => s.close(r)));
  const base = `http://127.0.0.1:${s.address().port}/api/typing-race`;
  const req = async (path, body, token = '') => {
    const r = await fetch(base + path, { method: body === undefined ? 'GET' : 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
    return { status: r.status, data: await r.json() };
  };
  const made = (await req('/rooms', {})).data;
  const path = '/rooms/' + made.state.code;
  let state = (await req(path + '/start', { mode: 'ko-words', duration: 60 }, made.token)).data;
  assert.deepEqual(state.board.map((x) => x.text), ['가', '삭', '나무', '하늘', '바다', '구름'], '가방, 사과, 나무꾼 wait for a later board');
  const clean = (st) => {
    const open = [...st.board, ...st.recent].map((x) => x.text);
    for (let i = 0; i < open.length; i++) for (let j = i + 1; j < open.length; j++) assert.ok(!Core.clash(open[i], open[j]), `${open[i]} / ${open[j]}`);
  };
  clean(state);
  clock = state.startsAt + 3000;
  for (let n = 0; n < 40; n++) {
    clock += 700;
    const cell = state.board[n % state.board.length];
    const typed = await req(path + '/type', { roundId: state.roundId, slot: cell.id, text: cell.text, mistakes: 0 }, made.token);
    assert.equal(typed.status, 200, typed.data.message);
    state = typed.data.state;
    clean(state);
    clean((await req(path, undefined, made.token)).data);
  }
});

test('class races allow up to eight teams', async (t) => {
  assert.deepEqual(Core.TEAM_COUNTS, [2, 3, 4, 5, 6, 7, 8]);
  assert.equal(Core.TEAMS.length, 8);
  assert.equal(new Set(Core.TEAMS.map((x) => x.hue)).size, 8);
  assert.equal(new Set(Core.TEAMS.map((x) => x.emoji)).size, 8);
  const codes = createRoomCodes({ random: () => 9753, isActive: async (e) => activity.hasRoomCode(e.code) });
  const platform = {
    roomCodes: codes,
    isTeacherRequest: async (req) => req.get('x-role') === 'teacher',
    isContentGloballyDisabled: async () => false,
    canBypassGlobalContentLock: async () => false,
    displayNameFor: async (req) => ({ name: decodeURIComponent(req.get('x-name') || '') }),
  };
  const activity = createTypingRace({ platform }), app = express();
  app.use(express.json());
  app.use('/api/typing-race', activity.router);
  const s = app.listen(0, '127.0.0.1');
  await new Promise((r) => s.once('listening', r));
  t.after(() => new Promise((r) => s.close(r)));
  const base = `http://127.0.0.1:${s.address().port}/api/typing-race`;
  const req = async (path, body, token = '', role = '', name = '') => {
    const r = await fetch(base + path, { method: body === undefined ? 'GET' : 'POST', headers: { 'Content-Type': 'application/json', 'x-role': role, 'x-name': encodeURIComponent(name), Authorization: 'Bearer ' + token }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
    return { status: r.status, data: await r.json() };
  };
  const made = (await req('/rooms', { teamMode: true, teamCount: 8, spectate: true }, '', 'teacher')).data;
  assert.equal(made.state.config.teamCount, 8);
  assert.equal(made.state.teams.length, 8);
  const path = '/rooms/' + made.state.code;
  const kid = (await req(path + '/join', {}, '', '', '여덟')).data;
  assert.equal((await req(path + '/team', { team: 7 }, kid.token)).status, 200, 'the eighth team can be picked');
  assert.equal((await req(path + '/settings', { teamCount: 9 }, made.token, 'teacher')).data.config.teamCount, 8, 'nine is not offered');
  for (let i = 0; i < 39; i++) await req(path + '/join', {}, '', '', '학생' + i);
  const shuffled = (await req(path + '/shuffle', {}, made.token, 'teacher')).data;
  assert.deepEqual(shuffled.teams.map((x) => x.size), [5, 5, 5, 5, 5, 5, 5, 5], 'forty students fill eight teams of five');
});
