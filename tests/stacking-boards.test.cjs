const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { createHarness } = require('./learning-boards-harness.cjs');
const { drawing } = require('../game-hub-server/stacking-boards');

test('four authors verify a persistent bank, then teams edit atomically and judge silhouettes', async () => {
  const h = await createHarness();
  try {
    async function request(url, body, cookie = '', expected = 200) {
      const r = await fetch(h.base + url, { method: body === undefined ? 'GET' : 'POST', headers: { 'Content-Type': 'application/json', Cookie: cookie }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
      const data = await r.json(); assert.equal(r.status, expected, JSON.stringify(data));
      return { data, cookie: r.headers.getSetCookie().map(v => v.split(';')[0]).join('; ') };
    }
    const teacher = 'test_teacher=1';
    const { data: { board } } = await request('/api/boards/', { title: '입체 문제은행', layout: 'stacking', slots: 60 }, teacher, 201);
    const entry = await request('/api/room-entry/resolve/' + board.code);
    assert.equal(entry.data.href, `/learning/inquiry/math/stacking-cubes/coop/?code=${board.code}`);
    const base = '/api/boards/' + board.id + '/stacking';
    const get = async cookie => (await request(base, undefined, cookie)).data;
    const act = async (cookie, action, extra = {}, expected = 200) => {
      const s = await get(cookie);
      return (await request(base + '/actions', { action, opId: crypto.randomUUID(), workId: s.work?.id, version: s.work?.version, ...extra }, cookie, expected)).data;
    };
    await request(base, undefined, '', 401);
    await request(base, undefined, 'test_teacher=2', 401);
    await act(teacher, 'team-count', { count: 2 });
    const teams = (await get(teacher)).teams;
    const players = [];
    for (let i = 0; i < 8; i++) {
      const joined = await request('/api/boards/join', { code: board.code, name: '학생' + (i + 1), number: i + 1 });
      players.push(joined.cookie); await act(joined.cookie, 'join-team', { teamId: teams[i < 4 ? 0 : 1].id });
    }
    assert.deepEqual((await get(players[0])).teams[0].members.map(m => m.role), ['build', 'front', 'right', 'top']);
    await act(players[1], 'edit', { cell: 6, delta: 1 }, 409);
    await act(players[0], 'start-race', { questionIds: [] }, 403);
    const target = Array(25).fill(0); [6, 7, 11].forEach(i => target[i] = 2); target[12] = 1;
    for (let cell = 0; cell < 25; cell++) for (let i = 0; i < target[cell]; i++) await act(players[0], 'edit', { cell, delta: 1 });
    await act(players[0], 'freeze');
    await act(players[0], 'publish', {}, 409);
    assert.equal((await act(players[1], 'check-drawing')).correct, false);
    await act(players[0], 'draw', { cells: Array(30).fill(0) }, 403);
    async function verify() {
      for (const [i, view] of [[1, 'front'], [2, 'right'], [3, 'top']]) {
        await act(players[i], 'draw', { cells: drawing(target, view) });
        assert.equal((await act(players[i], 'check-drawing')).correct, true);
      }
    }
    await verify();
    const oldVersion = (await get(players[1])).work.version;
    await act(players[0], 'revise'); await act(players[0], 'freeze');
    await act(players[1], 'check-drawing', { version: oldVersion }, 409);
    await act(players[0], 'publish', {}, 409);
    await verify();
    const publishId = crypto.randomUUID();
    await act(players[0], 'publish', { title: '숨은 층', opId: publishId });
    await act(players[0], 'publish', { title: '중복', opId: publishId });
    assert.equal((await get(teacher)).questions.length, 1);
    await h.initialize();
    const q = (await get(teacher)).questions[0]; assert.equal(q.title, '숨은 층');
    assert.equal((await request(base + '?bankRevision=1', undefined, teacher)).data.questions, undefined, 'unchanged bank images are not resent with every block edit');
    await act(teacher, 'start-race', { questionIds: [q.id] });
    const initial = await get(players[0]);
    assert.equal(initial.race.question.heights, undefined);
    assert.equal(initial.questions[0].heights, undefined);
    assert.deepEqual(initial.work.heights, Array(25).fill(0));
    // Two people hitting one column add two blocks, without overwriting a snapshot.
    await Promise.all([act(players[0], 'edit', { cell: 6, delta: 1 }), act(players[1], 'edit', { cell: 6, delta: 1 })]);
    assert.equal((await get(players[2])).work.heights[6], 2);
    assert.equal((await get(players[4])).work.heights[6], 0, 'other teams have separate boards');
    await act(players[0], 'undo'); assert.equal((await get(players[0])).work.heights[6], 1);
    await act(players[1], 'edit', { cell: 6, delta: 1 });
    const before = await get(players[0]);
    await act(players[1], 'edit', { cell: 7, delta: 1 });
    await act(players[0], 'clear', { version: before.work.version }, 409);
    const opId = crypto.randomUUID();
    await act(players[2], 'edit', { cell: 7, delta: 1, opId });
    await act(players[2], 'edit', { cell: 7, delta: 1, opId });
    assert.equal((await get(players[0])).work.heights[7], 2);
    for (const cell of [11, 12]) for (let i = 0; i < 2; i++) await act(players[3], 'edit', { cell, delta: 1 });
    // Height 2 in the hidden column differs from the author's 1, with identical views.
    const solved = await act(players[2], 'check-answer'); assert.equal(solved.correct, true); assert.equal(solved.state.race.finished, true);
    await act(players[0], 'check-answer', { workId: initial.work.id }, 409);
    assert.equal((await get(teacher)).teams[0].score, 1);
    await act(teacher, 'stop-race'); await act(teacher, 'return-authoring');
    await act(players[0], 'new-draft');
    assert.equal((await get(players[1])).me.role, 'build', 'roles rotate for the next question');
    const saved = (await get(teacher)).questions; assert.equal(saved.length, 1);
    await act(teacher, 'start-race', { questionIds: [q.id] });
    assert.deepEqual((await get(players[0])).work.heights, Array(25).fill(0), 'the same saved questions can start a fresh race');
  } finally { await h.close(); }
});
