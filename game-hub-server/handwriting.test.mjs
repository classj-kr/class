import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url),
  express = require('express');
const { createHandwriting } = require('./handwriting'),
  { createRoomCodes } = require('./room-codes'),
  { createRoomEntry } = require('./room-entry');
const C = require('../learning/literacy-numeracy/handwriting/core');
test('shared room entry, teacher controls, authoritative judging, retry, new rounds, and expiration', async (t) => {
  let clock = Date.now(),
    disabled = false;
  const codes = createRoomCodes({ random: () => 3456, isActive: async (e) => activity.hasRoomCode(e.code) });
  const platform = {
    roomCodes: codes,
    configuration: () => ({ enabled: true }),
    isTeacherRequest: async (req) => req.get('x-role') === 'teacher',
    isContentGloballyDisabled: async () => disabled,
    canBypassGlobalContentLock: async () => false,
    displayNameFor: async (req) => ({ name: req.get('x-name') || '' }),
  };
  const activity = createHandwriting({ platform, now: () => clock }),
    app = express();
  app.use(express.json({ limit: '512kb' }));
  app.use('/api/handwriting', activity.router);
  app.use(
    '/api/room-entry',
    createRoomEntry({ roomCodes: codes, handwritingExists: (c) => activity.hasRoomCode(c) }),
  );
  const s = app.listen(0, '127.0.0.1');
  await new Promise((r) => s.once('listening', r));
  t.after(() => new Promise((r) => s.close(r)));
  const base = `http://127.0.0.1:${s.address().port}/api/handwriting`;
  async function req(path, body, token = '', role = '', name = '') {
    const response = await fetch(base + path, {
      method: body === undefined ? 'GET' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-role': role,
        'x-name': encodeURIComponent(name),
        Authorization: 'Bearer ' + token,
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    return { status: response.status, data: await response.json() };
  }
  assert.equal((await req('/rooms', { text: '가' })).status, 403);
  assert.equal((await req('/rooms', { text: 'abc' }, '', 'teacher')).status, 400);
  const made = await req('/rooms', { text: '가나', phase: 'solo' }, '', 'teacher');
  assert.equal(made.status, 200);
  const code = made.data.state.code,
    host = made.data.token,
    path = '/rooms/' + code;
  const resolved = await fetch(base.replace('/api/handwriting', '') + '/api/room-entry/resolve/' + code);
  assert.deepEqual(await resolved.json(), {
    type: 'handwriting',
    href: `/learning/literacy-numeracy/handwriting/race/?room=${code}`,
  });
  assert.equal((await req(path)).status, 403);
  assert.equal((await req(path + '/join', {})).status, 403);
  const one = (await req(path + '/join', {}, '', '', 'one')).data,
    two = (await req(path + '/join', {}, '', '', 'two')).data;
  assert.equal((await req(path + '/join', {}, '', '', 'one')).status, 409);
  assert.equal((await req(path + '/start', { text: '가나' }, one.token, 'teacher')).status, 403);
  assert.equal((await req(path + '/start', { text: '가나' }, host, 'teacher')).status, 409);
  await req(path + '/ready', { ready: true }, one.token);
  await req(path + '/ready', { ready: true }, two.token);
  const started = (await req(path + '/start', { text: '가나', phase: 'solo' }, host, 'teacher')).data,
    id = started.roundId;
  assert.equal((await req(path + '/join', {}, '', '', 'late')).status, 409);
  const cells = C.chars('가나').map((c) => C.model(c).map((points) => ({ points: C.sample(points, 60) })));
  assert.equal((await req(path + '/result', { roundId: 'old', cells }, one.token)).status, 409);
  assert.equal((await req(path + '/result', { roundId: id, cells: [], score: 100 }, one.token)).status, 400);
  const result = await req(path + '/result', { roundId: id, cells, shape: 1 }, one.token);
  assert.equal(result.status, 200);
  assert.ok(
    result.data.participants.every((p) => p.result === null),
    'results wait until everyone finishes',
  );
  const reversed = cells.map((strokes) => [...strokes].reverse());
  const end = (await req(path + '/result', { roundId: id, cells: reversed, score: 100 }, two.token)).data;
  assert.equal(end.phase, 'results');
  assert.equal(end.participants[0].rank, 1);
  assert.equal(end.participants[0].result.order, true);
  assert.ok(end.participants[0].result.shape >= 98);
  assert.equal(end.participants[1].result.order, false);
  assert.equal(end.participants[1].rank, undefined);
  assert.ok(
    !JSON.stringify(end).includes(host) &&
      !JSON.stringify(end).includes(one.token) &&
      !JSON.stringify(end).includes('points'),
  );
  assert.deepEqual(
    (await req(path + '/result', { roundId: id, cells: [] }, one.token)).data.participants,
    end.participants,
    'lost-response retries cannot replace a result',
  );
  await req(path + '/ready', { ready: true }, one.token);
  await req(path + '/ready', { ready: true }, two.token);
  const next = (await req(path + '/start', { text: '가' }, host, 'teacher')).data;
  assert.notEqual(next.roundId, id);
  assert.equal((await req(path + '/result', { roundId: id, cells }, one.token)).status, 409);
  clock += 300001;
  assert.equal((await req(path, undefined, host)).data.phase, 'results');
  assert.equal(
    (await req(path + '/result', { roundId: next.roundId, cells: [cells[0]] }, one.token)).status,
    409,
  );
  disabled = true;
  assert.equal((await req(path, undefined, host)).status, 403);
  disabled = false;
  assert.equal((await req(path + '/leave', {}, host, 'teacher')).status, 200);
  assert.equal(activity.hasRoomCode(code), false);
  assert.equal(
    (await fetch(base.replace('/api/handwriting', '') + '/api/room-entry/resolve/' + code)).status,
    404,
  );
});
