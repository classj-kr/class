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
  assert.equal((await req(path + '/start', {}, host, 'teacher')).data.message, '아직 팀이 없는 학생이 1명 있어요.');
  assert.equal((await req(path + '/assign', { playerId: kids[6].state.me.id, team: 0 }, kids[0].token)).status, 403);
  const moved = (await req(path + '/assign', { playerId: kids[6].state.me.id, team: 0 }, host, 'teacher')).data;
  assert.deepEqual(moved.teams.map((x) => x.size), [2, 5], 'uneven teams are allowed');
  const shrunk = (await req(path + '/settings', { teamCount: 3, teamScore: 'avg' }, host, 'teacher')).data;
  assert.equal(shrunk.config.teamScore, 'sum');
  assert.equal(shrunk.teams.length, 3);
  const shuffled = (await req(path + '/shuffle', {}, host, 'teacher')).data;
  assert.deepEqual(shuffled.teams.map((x) => x.size).sort(), [2, 2, 3]);
  assert.ok(shuffled.participants.every((x) => x.team !== null));
  const started = (await req(path + '/start', { teamCount: 3, teamScore: 'avg' }, host, 'teacher')).data;
  assert.equal(started.config.teamScore, 'sum');
  assert.equal((await req(path + '/team', { team: 0 }, kids[0].token)).status, 409, 'no switching mid-race');
  clock = started.startsAt + 5000;
  const typed = (await req(path + '/type', { roundId: started.roundId, index: 0, text: started.items[0], mistakes: 0 }, kids[0].token)).data;
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
  const typed = (await req(path + '/type', { roundId: started.roundId, index: 0, text: started.items[0], mistakes: 0 }, host)).data;
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
  assert.equal((await req(path + '/start', {}, host, 'teacher')).status, 409, 'needs a student');
  const a = (await req(path + '/join', { avatarUrl: '/assets/avatars/animal-fox.webp' }, '', '', '가람')).data;
  const b = (await req(path + '/join', { avatarUrl: 'https://evil.example/x.webp' }, '', '', '나래')).data;
  assert.equal(a.state.me.avatarUrl, '/assets/avatars/animal-fox.webp');
  assert.equal(b.state.me.avatarUrl, null, 'only site avatar paths are kept');
  const again = (await req(path + '/join', {}, '', '', '가람')).data;
  assert.equal(again.state.me.id, a.state.me.id, 'a reload reclaims the same seat');
  assert.equal(again.state.me.avatarUrl, '/assets/avatars/animal-fox.webp', 'avatar survives a reload');
  assert.equal((await req(path, undefined, a.token)).status, 403, 'the old tab loses the seat');
  a.token = again.token;
  assert.equal(again.state.participants.length, 2);
  assert.notEqual(a.state.me.racer, b.state.me.racer);
  assert.equal((await req(path + '/start', {}, a.token, 'teacher')).status, 403, 'students cannot start');
  const started = (await req(path + '/start', { mode: 'en-words', duration: 60 }, host, 'teacher')).data;
  assert.equal(started.config.mode, 'en-words');
  const items = started.items, roundId = started.roundId;
  assert.equal((await req(path)).status, 403);
  assert.equal((await req(path, undefined, a.token)).data.items, undefined);
  assert.deepEqual((await req(path + '?items=1', undefined, a.token)).data.items, items);
  const type = (token, index, text = items[index], mistakes = 0) => req(path + '/type', { roundId, index, text, mistakes }, token);
  assert.equal((await type(a.token, 0)).status, 409, 'not before the countdown');
  clock = started.startsAt + 30;
  assert.equal((await type(a.token, 0)).status, 429, 'too fast to be typed');
  clock = started.startsAt + 5000;
  assert.equal((await type(a.token, 1)).status, 409, 'must follow the shared order');
  assert.equal((await type(a.token, 0, items[0] + 'x')).status, 409);
  const first = (await type(a.token, 0)).data;
  assert.equal(first.combo, 1);
  assert.equal(first.gained, Core.itemScore(items[0], 1));
  const second = (await type(a.token, 1)).data;
  assert.equal(second.combo, 2);
  clock += 4000;
  const missed = (await type(a.token, 2, items[2], 2)).data;
  assert.equal(missed.combo, 0);
  assert.equal(missed.state.me.rank, 1);
  const boardRow = missed.state.participants[0];
  assert.equal(boardRow.name, '가람');
  assert.equal(boardRow.count, 3);
  assert.ok(boardRow.accuracy < 100);
  const lateComer = (await req(path + '/join', {}, '', '', '다솜')).data;
  assert.deepEqual(lateComer.state.items, items, 'late joiners get the same list');
  clock = started.deadline + 2000;
  const done = (await req(path, undefined, b.token)).data;
  assert.equal(done.phase, 'results');
  assert.equal(done.participants[0].name, '가람');
  assert.equal((await type(a.token, 3)).status, 409);
  const back = (await req(path + '/lobby', {}, host, 'teacher')).data;
  assert.equal(back.phase, 'lobby');
  assert.ok(back.participants.every((x) => x.score === 0));
  assert.equal((await req(path + '/leave', {}, host, 'teacher')).status, 200);
  assert.equal(activity.hasRoomCode(code), false);
  assert.equal((await fetch(`${origin}/api/room-entry/resolve/${code}`)).status, 404);
});
