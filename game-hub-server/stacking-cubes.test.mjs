import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url),
  express = require('express');
const { createStackingCubes } = require('./stacking-cubes'),
  { createRoomCodes } = require('./room-codes'),
  { createRoomEntry } = require('./room-entry');
const { project, validBoard } = require('../learning/inquiry/math/stacking-cubes/model');
const { generateRound, drawFromBank } = require('./stacking-race-questions');
const signature = q => ['top', 'front', 'right'].map(v => project(q, v).join('')).join('/');
test('200 generated questions per round stay distinct; a saved bank cycles without replacement', () => {
  const a = generateRound(200, []), b = generateRound(200, a);
  assert.ok([...a, ...b].every(q => validBoard(q) && q.some(Boolean)));
  assert.equal(new Set([...a, ...b].map(signature)).size, 400);
  const bank = { questions: a.slice(0, 9), remaining: [] };
  const first = drawFromBank(bank, 6, []), next = drawFromBank(bank, 6, first);
  assert.equal(new Set([...first, ...next.slice(0, 3)]).size, 9);
  assert.equal(new Set(next).size, 6);
});
test('room entry, server judging, ranking by solved count then time, and closing', async (t) => {
  let clock = Date.now();
  const codes = createRoomCodes({ random: () => 4567, isActive: async (e) => activity.hasRoomCode(e.code) });
  const platform = {
    roomCodes: codes,
    configuration: () => ({ enabled: true }),
    isTeacherRequest: async (req) => req.get('x-role') === 'teacher',
    isContentGloballyDisabled: async () => false,
    canBypassGlobalContentLock: async () => false,
    displayNameFor: async (req) => ({ name: decodeURIComponent(req.get('x-name') || '') }),
  };
  const activity = createStackingCubes({ platform, now: () => clock }),
    app = express();
  app.use(express.json());
  app.use('/api/stacking-race', activity.router);
  app.use('/api/room-entry', createRoomEntry({ roomCodes: codes, stackingExists: (c) => activity.hasRoomCode(c) }));
  const s = app.listen(0, '127.0.0.1');
  await new Promise((r) => s.once('listening', r));
  t.after(() => new Promise((r) => s.close(r)));
  const origin = `http://127.0.0.1:${s.address().port}`, base = origin + '/api/stacking-race';
  // 보드게임 곡은 보드게임에서만 쓴다. 순위전 음악은 /assets/sound/race-music/ 공용 곡이다.
  for (const id of ['fruitbell', 'lastcard', 'glass-pulse-01']) {
    assert.equal((await fetch(`${base}/music/${id}.ogg`)).status, 404);
  }
  async function req(path, body, token = '', role = '', name = '') {
    const response = await fetch(base + path, {
      method: body === undefined ? 'GET' : 'POST',
      headers: { 'Content-Type': 'application/json', 'x-role': role, 'x-name': encodeURIComponent(name), Authorization: 'Bearer ' + token },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    return { status: response.status, data: await response.json() };
  }
  assert.equal((await req('/rooms', {})).status, 403);
  const made = await req('/rooms', { mode: 'views' }, '', 'teacher');
  const code = made.data.state.code, host = made.data.token, path = '/rooms/' + code;
  assert.deepEqual(await (await fetch(`${origin}/api/room-entry/resolve/${code}`)).json(), {
    type: 'stacking',
    href: `/learning/inquiry/math/stacking-cubes/race/?room=${code}`,
  });
  assert.deepEqual(made.data.state.questions, [], 'targets stay hidden before the start');
  assert.equal((await req(path + '/start', {}, host, 'teacher')).status, 409, 'needs a student');
  const one = (await req(path + '/join', {}, '', '', '가')).data, two = (await req(path + '/join', {}, '', '', '나')).data;
  assert.equal((await req(path + '/join', {}, '', '', '가')).status, 409);
  assert.equal((await req(path + '/start', {}, one.token, 'teacher')).status, 403);
  assert.equal((await req(path + '/start', { questionCount: 201 }, host, 'teacher')).status, 400);
  const started = (await req(path + '/start', { mode: 'views', questionCount: 12 }, host, 'teacher')).data;
  const questions = started.questions;
  assert.equal(started.total, 12);
  assert.deepEqual((await req(path, undefined, one.token)).data.questions, questions);
  assert.deepEqual((await req(path, undefined, two.token)).data.questions, questions);
  assert.equal((await req(path + '/join', {}, '', '', '늦음')).status, 409);
  const answer = (token, index, heights) => req(path + '/answer', { roundId: started.roundId, index, heights }, token);
  const wrong = (await answer(one.token, 0, Array(25).fill(0))).data;
  assert.equal(wrong.correct, false);
  assert.ok(wrong.mismatches.length > 0);
  assert.equal((await answer(one.token, 1, questions[1])).status, 409, 'questions are solved in order');
  clock += 5000;
  assert.equal((await answer(one.token, 0, questions[0])).data.correct, true);
  assert.equal((await answer(one.token, 0, questions[0])).data.state.me.solved, 1, 'retries do not count twice');
  clock += 1000;
  await answer(two.token, 0, questions[0]);
  clock += 1000;
  await answer(two.token, 1, questions[1]);
  const live = (await req(path, undefined, host)).data;
  assert.equal(live.phase, 'racing');
  assert.deepEqual(live.participants.map((p) => [p.name, p.solved, p.rank]), [['나', 2, 1], ['가', 1, 2]]);
  assert.ok(!JSON.stringify(live).includes(one.token));
  const stopped = (await req(path + '/stop', {}, host, 'teacher')).data;
  assert.equal(stopped.phase, 'results');
  assert.equal((await answer(one.token, 1, questions[1])).status, 409);
  const again = (await req(path + '/start', { mode: 'copy' }, host, 'teacher')).data;
  assert.equal(again.mode, 'copy');
  assert.equal(new Set([...questions, ...again.questions].map(signature)).size, 24);
  assert.ok(again.participants.every((p) => p.solved === 0 && p.rank === null));
  clock += 10 * 60 * 1000 + 1;
  assert.equal((await req(path, undefined, one.token)).data.phase, 'results');
  assert.equal((await req(path + '/leave', {}, host, 'teacher')).status, 200);
  assert.equal(activity.hasRoomCode(code), false);
  assert.equal((await fetch(`${origin}/api/room-entry/resolve/${code}`)).status, 404);
});
