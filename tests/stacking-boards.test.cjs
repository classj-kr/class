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
      return (await request(base + '/actions', { action, opId: crypto.randomUUID(), workId: s.work?.id, boardSize: Math.sqrt(s.work?.heights.length), version: s.work?.version, ...extra }, cookie, expected)).data;
    };
    await request(base, undefined, '', 401);
    await request(base, undefined, 'test_teacher=2', 401);
    await act(teacher, 'team-count', { count: 2 });
    const teams = (await get(teacher)).teams;
    const emptyStart = await act(teacher, 'start-race', { questionIds: [] });
    assert.equal(emptyStart.state.race.total, 6);
    assert.equal(emptyStart.state.questions.length, 0, 'automatic rounds leave the teacher bank intact');
    const players = [];
    for (let i = 0; i < 8; i++) {
      const joined = await request('/api/boards/join', { code: board.code, name: '학생' + (i + 1), number: i + 1 });
      players.push(joined.cookie); await act(joined.cookie, 'join-team', { teamId: teams[i < 4 ? 0 : 1].id });
    }
    assert.ok((await get(players[7])).work.canBuild, 'teams can join after an empty room starts');
    await act(teacher, 'stop-race'); await act(teacher, 'return-authoring');
    assert.equal((await get(players[0])).work.heights.length, 9);
    for (let i = 0; i < 15; i++) await act(players[0], 'edit', { cell: Math.floor(i / 4), delta: 1 });
    const draftId = (await get(players[0])).work.id;
    const lastCube = await Promise.all(players.slice(0, 2).map(cookie => fetch(h.base + base + '/actions', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: cookie },
      body: JSON.stringify({ action: 'edit', workId: draftId, opId: crypto.randomUUID(), boardSize: 3, cell: 4, delta: 1 })
    })));
    assert.deepEqual(lastCube.map(r => r.status).sort(), [200, 409], 'concurrent edits cannot place a 17th cube');
    await act(players[2], 'edit', { cell: 0, delta: -1 });
    await act(players[0], 'edit', { cell: 5, delta: 1 });
    await act(players[2], 'undo', {}, 409);
    await act(players[0], 'freeze');
    assert.equal((await get(players[0])).work.drawings.front.length, 12, 'a four-storey shape gets a fourth row');
    await act(players[0], 'revise'); await act(players[0], 'clear');
    await act(players[0], 'board-size', { size: 4 });
    await act(players[0], 'edit', { cell: 4, delta: 1, boardSize: 3 }, 409);
    await Promise.all(players.slice(0, 4).map(p => act(p, 'edit', { cell: 12, delta: 1 })));
    assert.equal((await get(players[3])).work.heights[12], 4, 'all four edits survive on the same authoring cell');
    await act(players[1], 'clear');
    await act(players[0], 'start-race', { questionIds: [] }, 403);
    const target = Array(16).fill(0); [6, 7, 10].forEach(i => target[i] = 2); target[11] = 1;
    for (let cell = 0; cell < target.length; cell++) for (let i = 0; i < target[cell]; i++) await act(players[0], 'edit', { cell, delta: 1 });
    await act(players[0], 'freeze');
    await act(players[0], 'publish', {}, 409);
    assert.equal((await act(players[1], 'check-drawing')).correct, false);
    await act(players[0], 'draw', { view: 'invalid', cells: Array(30).fill(0) }, 403);
    async function verify() {
      for (const [i, view] of [[1, 'front'], [2, 'right'], [3, 'top']]) {
        await act(players[i], 'draw', { view, cells: drawing(target, view) });
        assert.equal((await act(players[i], 'check-drawing', { view })).correct, true);
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
    assert.deepEqual((await request('/api/boards/stacking-race-banks', undefined, teacher)).data.banks, [{ id: board.id, title: board.title, count: 1 }]);
    await request('/api/stacking-race/rooms', { bankId: board.id, questionIds: [q.id] }, 'test_teacher=2', 404);
    await request('/api/stacking-race/rooms', { bankId: board.id, questionIds: ['missing'] }, teacher, 409);
    const individual = (await request('/api/stacking-race/rooms', { bankId: board.id, questionIds: [q.id] }, teacher)).data;
    assert.equal(individual.state.sourceTitle, board.title);
    assert.equal(individual.state.total, 1);
    assert.deepEqual(individual.state.questions, []);
    assert.equal((await request(base + '?bankRevision=1', undefined, teacher)).data.questions, undefined, 'unchanged bank images are not resent with every block edit');
    await act(teacher, 'start-race', { questionIds: [q.id] });
    const initial = await get(players[0]);
    assert.equal(initial.race.question.heights, undefined);
    assert.equal(initial.questions[0].heights, undefined);
    assert.deepEqual(initial.work.heights, Array(16).fill(0));
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
    for (const cell of [10, 11]) for (let i = 0; i < 2; i++) await act(players[3], 'edit', { cell, delta: 1 });
    // Height 2 in the hidden column differs from the author's 1, with identical views.
    const solved = await act(players[2], 'check-answer'); assert.equal(solved.correct, true); assert.equal(solved.state.race.finished, true);
    await act(players[0], 'check-answer', { workId: initial.work.id }, 409);
    assert.equal((await get(teacher)).teams[0].score, 1);
    assert.equal((await get(teacher)).teams[0].finishShape, undefined, 'the projector does not show a solution while others are solving');
    await act(teacher, 'stop-race');
    const podium = await get(teacher);
    assert.equal(podium.teams[0].finishShape[11], 2, 'the result keeps the actual accepted alternative the team built');
    assert.equal(podium.teams[1].finishShape, undefined, 'stopping a round does not award a finish');
    assert.equal((await get(players[4])).teams[0].finishShape, undefined);
    await act(teacher, 'return-authoring');
    const published = await get(players[0]);
    await act(players[3], 'new-draft');
    await act(players[1], 'new-draft', { workId: published.work.id }, 409);
    const snapshots = await Promise.all(players.slice(0, 4).map(get));
    assert.ok(snapshots.every(s => s.work.canBuild && s.work.id === snapshots[0].work.id && !s.work.heights.some(Boolean)));
    assert.equal(snapshots[0].board.teamCapacity, null, 'existing boards start unrestricted');
    await act(players[0], 'team-capacity', { capacity: 4 }, 403);
    await act(teacher, 'team-capacity', { capacity: 0 }, 400);
    await act(teacher, 'team-capacity', { capacity: 5 });
    const extra = [];
    for (const number of [9, 10]) extra.push((await request('/api/boards/join', { code: board.code, name: '학생' + number, number })).cookie);
    const targetTeam = { action: 'join-team', teamId: teams[0].id };
    const attempts = await Promise.all(extra.map(cookie => fetch(h.base + base + '/actions', { method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookie }, body: JSON.stringify({ ...targetTeam, opId: crypto.randomUUID() }) })));
    assert.deepEqual(attempts.map(r => r.status).sort(), [200, 409], 'only one student can take the final seat');
    const waiting = extra[attempts.findIndex(r => r.status === 409)];
    await act(players[4], 'join-team', { teamId: teams[0].id }, 409);
    assert.equal((await get(players[4])).me.teamId, teams[1].id, 'a rejected transfer keeps the original seat');
    await act(teacher, 'team-capacity', { capacity: 4 });
    assert.equal((await get(teacher)).teams[0].members.length, 5, 'lowering the cap preserves current members');
    await act(teacher, 'start-race', { questionIds: [q.id] });
    assert.deepEqual((await get(players[0])).work.heights, Array(16).fill(0), 'the same saved questions can start a fresh race');
    await act(players[0], 'join-team', { teamId: teams[0].id });
    await act(waiting, 'join-team', { teamId: teams[0].id }, 409);
    await act(teacher, 'team-capacity', { capacity: null });
    assert.ok((await act(waiting, 'join-team', { teamId: teams[0].id })).state.work.canBuild, 'the teacher can reopen seats mid-race');
    // Replay a board containing both a pre-upgrade question and a new question.
    await act(teacher, 'stop-race');
    const legacy = Array(25).fill(0); legacy[24] = 6;
    const saved = (await h.pool.query('SELECT state FROM learning_board_stacking WHERE board_id=$1', [board.id])).rows[0].state;
    saved.questions.push({ id: 'old', title: '이전 문제', author: '모둠', heights: legacy,
      pictures: Object.fromEntries(['top', 'front', 'right'].map(v => [v, drawing(legacy, v)])) });
    await h.pool.query('UPDATE learning_board_stacking SET state=$2::jsonb WHERE board_id=$1', [board.id, JSON.stringify(saved)]);
    await act(teacher, 'start-race', { questionIds: ['old', q.id] });
    for (let i = 0; i < 6; i++) await act(players[0], 'edit', { cell: 24, delta: 1 });
    const switched = await act(players[0], 'check-answer');
    assert.equal(switched.correct, true); assert.equal(switched.state.work.heights.length, 16);
  } finally { await h.close(); }
});

test('one to six authors keep their draft, share missing views, and start with any occupied teams', async () => {
  const h = await createHarness();
  try {
    async function request(url, body, cookie = '', expected = 200) {
      const r = await fetch(h.base + url, { method: body === undefined ? 'GET' : 'POST', headers: { 'Content-Type': 'application/json', Cookie: cookie }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
      const data = await r.json(); assert.equal(r.status, expected, JSON.stringify(data));
      return { data, cookie: r.headers.getSetCookie().map(v => v.split(';')[0]).join('; ') };
    }
    const teacher = 'test_teacher=1';
    const { data: { board } } = await request('/api/boards/', { title: '자유 인원', layout: 'stacking', slots: 60 }, teacher, 201);
    const base = '/api/boards/' + board.id + '/stacking', get = async cookie => (await request(base, undefined, cookie)).data;
    const act = async (cookie, action, extra = {}) => {
      const s = await get(cookie);
      return (await request(base + '/actions', { action, workId: s.work?.id, boardSize: Math.sqrt(s.work?.heights.length), version: s.work?.version, opId: crypto.randomUUID(), ...extra }, cookie)).data;
    };
    const teams = (await get(teacher)).teams, players = [];
    const shape = Array(9).fill(0); shape[4] = 1;
    let author, other;
    for (let count = 1; count <= 6; count++) {
      const joined = await request('/api/boards/join', { code: board.code, name: '학생' + count, number: count });
      const before = author ? await get(author) : null;
      players.push(joined.cookie); await act(joined.cookie, 'join-team', { teamId: teams[0].id });
      if (!author) { author = players[0]; await act(author, 'edit', { cell: 4, delta: 1 }); }
      else {
        const after = await get(author);
        assert.equal(after.work.id, before.work.id); assert.deepEqual(after.work.heights, before.work.heights, 'joining never discards the current shape');
        assert.equal(after.work.canBuild, true, 'late arrivals can build alongside existing teammates');
      }
      await act(author, 'freeze');
      const states = await Promise.all(players.map(get));
      assert.ok(states.every(s => s.me.roles.length === 4), 'everyone can edit all views');
      if (count > 4) {
        const frontAuthors = players.filter((_, i) => states[i].me.roles.includes('front'));
        await Promise.all(frontAuthors.slice(0, 2).map((p, i) => act(p, 'draw', { view: 'front', cell: i, value: 1 })));
        assert.deepEqual((await get(author)).work.drawings.front.slice(0, 2), [1, 1], 'shared drawing edits merge cell by cell');
      }
      for (const [i, s] of states.entries()) for (const view of s.me.roles.filter(v => v !== 'build')) {
        await act(players[i], 'draw', { view, cells: drawing(shape, view) });
        assert.equal((await act(players[i], 'check-drawing', { view })).correct, true);
      }
      await act(author, 'publish');
      if (count === 3) {
        other = (await request('/api/boards/join', { code: board.code, name: '다른 모둠', number: 20 })).cookie;
        await act(other, 'join-team', { teamId: teams[1].id });
      }
      const q = (await get(teacher)).questions[0];
      const started = (await act(teacher, 'start-race', { questionIds: [q.id] })).state;
      assert.equal(started.teams.filter(t => t.score !== undefined).length, other ? 2 : 1, 'empty slots do not block or enter the match');
      assert.ok((await get(players[count - 1])).work.canBuild, 'every present teammate can build');
      if (other) assert.ok((await get(other)).work.canBuild, 'unequal teams can play, including a solo team');
      await act(teacher, 'stop-race'); await act(teacher, 'return-authoring');
      if (count < 6) {
        await act(author, 'new-draft');
        author = players[count - 1];
        await act(author, 'edit', { cell: 4, delta: 1 });
      }
    }
    assert.equal((await get(teacher)).questions.length, 6);
  } finally { await h.close(); }
});
