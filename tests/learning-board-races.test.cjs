const test = require('node:test');
const assert = require('node:assert/strict');
const { createHarness } = require('./learning-boards-harness.cjs');
const { scoreAnswer } = require('../game-hub-server/learning-board-races');

test('automatic race advances on all answers or timeout, preserves reveal, pause and restart', async () => {
  let time = Date.now();
  const h = await createHarness({ now: () => time }), teacher = 'test_teacher=1';
  async function req(path, method = 'GET', body, cookie = teacher, status = 200) {
    const res = await fetch(h.base + '/api/boards' + path, { method, headers: { 'Content-Type': 'application/json', Cookie: cookie }, body: body === undefined ? undefined : JSON.stringify(body) });
    const data = await res.json(); assert.equal(res.status, status, JSON.stringify(data));
    return { ...data, cookie: res.headers.get('set-cookie')?.split(';')[0] };
  }
  try {
    const { board } = await req('/', 'POST', { title: '자동 경주', layout: 'quiz' }, teacher, 201);
    const base = '/' + board.id;
    const alice = (await req('/join', 'POST', { code: board.code, number: 1, name: '하나' }, '')).cookie;
    const bob = (await req('/join', 'POST', { code: board.code, number: 2, name: '둘' }, '')).cookie;
    const posts = [];
    for (let i = 0; i < 3; i++) {
      const p = await req(base + '/posts', 'POST', { kind: 'ox', content: '문제 ' + i, answer: 0 }, teacher, 201);
      await req(base + '/posts/' + p.id + '/review', 'POST', { status: 'approved', revision: 1 });
      posts.push({ id: p.id, revision: 2 });
    }
    const set = await req(base + '/sets', 'POST', { title: '세트', posts }, teacher, 201);
    const race = await req(base + '/races', 'POST', { setId: set.id, seconds: 10 }, teacher, 201);
    const route = base + '/races/' + race.id;
    await req(route + '/join', 'POST', {}, alice); await req(route + '/join', 'POST', {}, bob);
    let s = await req(route);
    assert.equal(s.autoAdvance, true);
    await req(route + '/control', 'POST', { action: 'automatic', enabled: false, phase: 'lobby', index: -1 }, alice, 401);
    await req(route + '/control', 'POST', { action: 'automatic', enabled: 'false', phase: 'lobby', index: -1 }, teacher, 400);
    await req(route + '/control', 'POST', { action: 'start', phase: 'lobby', index: -1 });
    time += 3100; s = await req(route, 'GET', undefined, alice);
    await req(route + '/answer', 'POST', { questionId: s.question.id, choice: 0 }, alice);
    assert.equal((await req(route, 'GET', undefined, alice)).phase, 'question');
    assert.equal((await req(route, 'GET', undefined, alice)).question.answer, undefined);
    await req(route + '/answer', 'POST', { questionId: s.question.id, choice: 0 }, bob);
    s = await req(route, 'GET', undefined, bob);
    assert.equal(s.phase, 'reveal'); assert.equal(s.question.answer, 0); assert.equal(s.nextAt, time + 6000);
    assert.equal(s.me.attempts, 1); const score = s.me.score;
    time += 2000;
    await req(route + '/control', 'POST', { action: 'automatic', enabled: false, phase: 'reveal', index: 0 });
    time += 30000; await h.initialize(); s = await req(route, 'GET', undefined, alice);
    assert.equal(s.phase, 'reveal'); assert.equal(s.nextAt, null); assert.equal(s.me.score, score);
    s = await req(route + '/control', 'POST', { action: 'automatic', enabled: true, phase: 'reveal', index: 0 });
    assert.equal(s.nextAt, time + 6000);
    time += 5999; assert.equal((await req(route, 'GET', undefined, alice)).phase, 'reveal');
    time++; await h.initialize();
    const states = await Promise.all([req(route, 'GET', undefined, alice), req(route, 'GET', undefined, bob)]);
    assert.ok(states.every(v => v.phase === 'countdown' && v.index === 1 && v.question === null));
    await req(route + '/control', 'POST', { action: 'next', phase: 'reveal', index: 0 }, teacher, 409);
    time += 3100; s = await req(route, 'GET', undefined, alice);
    await req(route + '/answer', 'POST', { questionId: s.question.id, choice: 0 }, alice);
    time += 10000; s = await req(route, 'GET', undefined, bob);
    assert.equal(s.phase, 'reveal'); assert.equal(s.me.delta, 0); assert.equal(s.me.attempts, 2);
    // A long disconnection must not skip unseen questions or their countdown.
    time += 86400000; s = await req(route, 'GET', undefined, bob);
    assert.equal(s.phase, 'countdown'); assert.equal(s.index, 2); assert.equal(s.startsAt, time + 3000);
    time += 3100; s = await req(route, 'GET', undefined, alice);
    await Promise.all([alice, bob].map(cookie => req(route + '/answer', 'POST', { questionId: s.question.id, choice: 0 }, cookie)));
    s = await req(route, 'GET', undefined, alice); assert.equal(s.phase, 'reveal'); assert.equal(s.me.attempts, 3);
    time += 6000; s = await req(route, 'GET', undefined, alice);
    assert.equal(s.phase, 'finished'); assert.equal(s.me.attempts, 3);
    assert.equal((await req(base)).live, null);
    const row = (await h.pool.query('SELECT state FROM learning_board_races WHERE id=$1', [race.id])).rows[0];
    assert.equal(row.state.history.length, 3, 'each question grades exactly once');
    assert.equal((await req(route, 'GET', undefined, alice)).me.score, s.me.score);
  } finally { await h.close(); }
});

test('race scoring rewards accuracy, server-timed speed and every third consecutive answer', () => {
  assert.deepEqual(scoreAnswer(false, 5, 0, 20000), { points: 0, streak: 0, boost: false });
  assert.equal(scoreAnswer(true, 0, 20000, 20000).points, 100);
  assert.deepEqual(scoreAnswer(true, 2, 0, 20000), { points: 180, streak: 3, boost: true });
});

test('private submissions, synchronized rounds, immutable answers, restart, scoring and access isolation', async () => {
  let time = Date.now();
  const h = await createHarness({ now: () => time });
  const teacher = 'test_teacher=1';
  async function req(path, method = 'GET', body, cookie = teacher, expected = 200) {
    const response = await fetch(h.base + '/api/boards' + path, { method,
      headers: { 'Content-Type': 'application/json', Cookie: cookie }, body: body === undefined ? undefined : JSON.stringify(body) });
    const data = await response.json(); assert.equal(response.status, expected, JSON.stringify(data));
    return { ...data, cookie: response.headers.get('set-cookie')?.split(';')[0] };
  }
  try {
    const { board } = await req('/', 'POST', { title: '경주', layout: 'quiz', slots: 5 }, teacher, 201);
    const base = '/' + board.id;
    const alice = (await req('/join', 'POST', { code: board.code, number: 1, name: '하나' }, '')).cookie;
    const bob = (await req('/join', 'POST', { code: board.code, number: 2, name: '둘' }, '')).cookie;
    const late = (await req('/join', 'POST', { code: board.code, number: 3, name: '셋' }, '')).cookie;
    const posts = [];
    for (let i = 0; i < 3; i++) {
      const { id } = await req(base + '/posts', 'POST', { kind: 'choice', content: '비공개 문제 ' + i,
        choices: ['A', 'B'], answer: 1, explanation: '비공개 해설 ' + i }, i === 0 ? alice : teacher, 201);
      await req(base + '/posts/' + id + '/review', 'POST', { revision: 1, status: 'approved' });
      posts.push({ id, revision: 2 });
    }
    assert.equal((await req(base, 'GET', undefined, bob)).posts.length, 0);
    const { id: setId } = await req(base + '/sets', 'POST', { title: '세트', posts }, teacher, 201);
    const teacherQuestions = (await req(base + '/sets/' + setId)).questions;
    for (const status of ['open', 'closed', 'revealed']) {
      await req(base + '/sets/' + setId, 'PATCH', { status });
      await req(base + '/sets/' + setId, 'GET', undefined, bob, 401);
    }
    assert.deepEqual((await req(base, 'GET', undefined, bob)).sets, []);
    await req(base + '/sets/' + setId + '/answer', 'POST', { choice: 1 }, bob, 410);
    await req(base + '/races', 'POST', { setId }, bob, 401);
    const { id: raceId } = await req(base + '/races', 'POST', { setId, seconds: 10, autoAdvance: false }, teacher, 201);
    assert.equal((await req(base + '/races', 'POST', { setId }, teacher, 201)).id, raceId, 'creation resumes the active race');
    const route = base + '/races/' + raceId;
    await req(route, 'GET', undefined, '', 401);
    assert.equal((await req(base, 'GET', undefined, bob)).live.id, raceId);
    await req(route + '/control', 'POST', { action: 'start', phase: 'lobby', index: -1 }, teacher, 409);
    await req(route + '/join', 'POST', {}, alice); await req(route + '/join', 'POST', {}, bob);
    let state = await req(route);
    assert.equal(state.racers.length, 2); assert.equal(state.question, null);
    await req(route + '/control', 'POST', { action: 'start', phase: 'lobby', index: -1 }, bob, 401);
    state = await req(route + '/control', 'POST', { action: 'start', phase: 'lobby', index: -1 });
    assert.equal(state.phase, 'countdown');
    assert.equal((await req(route, 'GET', undefined, bob)).question, null);
    await req(route + '/answer', 'POST', { questionId: teacherQuestions[0].id, choice: 1 }, bob, 409);
    await req(route + '/join', 'POST', {}, late, 409);
    assert.equal((await req(route, 'GET', undefined, late)).question, null);
    for (let i = 0; i < 3; i++) {
      time += 3100;
      state = await req(route, 'GET', undefined, bob);
      assert.equal(state.phase, 'question'); assert.equal(state.question.answer, undefined);
      assert.equal(state.question.explanation, undefined); assert.equal(state.racers, undefined);
      assert.equal(state.question.content, '비공개 문제 ' + i);
      if (i < 2) assert.equal(JSON.stringify(state).includes('비공개 문제 ' + (i + 1)), false);
      if (i === 0) {
        await req(route + '/answer', 'POST', { questionId: teacherQuestions[1].id, choice: 1 }, bob, 409);
      }
      const authorView = await req(route, 'GET', undefined, alice);
      assert.equal(authorView.question.answer, undefined);
      assert.equal(authorView.eligible, 2, 'authors count as answering participants');
      await req(route + '/answer', 'POST', { questionId: state.question.id, choice: 1 }, alice);
      const accepted = await req(route + '/answer', 'POST', { questionId: state.question.id, choice: 1 }, bob);
      assert.deepEqual(Object.keys(accepted).filter(k => k !== 'cookie').sort(), ['accepted', 'choice']);
      assert.equal((await req(route + '/answer', 'POST', { questionId: state.question.id, choice: 0 }, bob)).choice, 1, 'first answer is final');
      assert.equal((await req(route, 'GET', undefined, bob)).question.answer, undefined, 'no immediate correctness oracle');
      assert.equal((await req(route)).answered, 2);
      time += 10000;
      await req(route + '/answer', 'POST', { questionId: state.question.id, choice: 0 }, bob, 409);
      await h.initialize(); // restart cannot reset an in-progress race or its deadline
      state = await req(route);
      assert.equal(state.phase, 'reveal'); assert.equal(state.question.answer, 1);
      const a = state.racers.find(p => p.number === 1), b = state.racers.find(p => p.number === 2);
      assert.equal(a.delta, b.delta, 'identical answers and timing earn identical movement regardless of authorship');
      if (i === 2) {
        assert.equal(a.boost, true); assert.equal(b.boost, true); assert.ok(b.delta >= 160);
        const authorResult = (await req(route, 'GET', undefined, alice)).me;
        assert.equal(authorResult.correctCount, 3); assert.equal(authorResult.attempts, 3);
      }
      const score = b.score;
      assert.equal((await req(route)).racers.find(p => p.number === 2).score, score, 'grading is exactly once');
      assert.equal((await req(route + '/join', 'POST', {}, bob)).me.score, score, 'rejoin preserves score');
      const body = { action: 'next', phase: 'reveal', index: i };
      state = await req(route + '/control', 'POST', body);
      await req(route + '/control', 'POST', body, teacher, 409);
    }
    assert.equal(state.phase, 'finished'); assert.equal((await req(base)).live, null);
    const again = await req(base + '/races', 'POST', { setId, autoAdvance: false }, teacher, 201);
    assert.notEqual(again.id, raceId);
    assert.equal((await req(base + '/races/' + again.id + '/join', 'POST', {}, bob)).me.score, 0);
    const replay = base + '/races/' + again.id;
    await req(replay + '/join', 'POST', {}, alice);
    await req(replay + '/control', 'POST', { action: 'start', phase: 'lobby', index: -1 });
    time += 3100;
    await req(replay + '/answer', 'POST', { questionId: teacherQuestions[0].id, choice: 0 }, alice);
    await req(replay + '/answer', 'POST', { questionId: teacherQuestions[0].id, choice: 1 }, bob);
    const replayResult = await req(replay + '/control', 'POST', { action: 'reveal', phase: 'question', index: 0 });
    assert.equal(replayResult.racers.find(p => p.number === 1).delta, 0, 'incorrect own answer earns no average movement');
    assert.ok(replayResult.racers.find(p => p.number === 2).delta >= 100);
    await req(replay + '/control', 'POST', { action: 'finish', phase: 'reveal', index: 0 });
    const timed = await req(base + '/races', 'POST', { setId, seconds: 10, duration: 60, teamCount: 2 }, teacher, 201);
    const teamRace = base + '/races/' + timed.id;
    await req(teamRace + '/join', 'POST', {}, alice);
    await req(teamRace + '/join', 'POST', {}, bob);
    await req(teamRace + '/team', 'POST', { team: 0 }, alice);
    await req(teamRace + '/team', 'POST', { team: 0 }, bob, 409);
    const teamStart = await req(teamRace + '/control', 'POST', { action: 'start', phase: 'lobby', index: -1 });
    assert.equal(teamStart.raceEndsAt - teamStart.startsAt, 60000);
    assert.deepEqual(teamStart.teams.map(t => t.size), [1, 1]);
    await req(teamRace + '/team', 'POST', { team: 1 }, alice, 409);
    time += 3100;
    const bobFirst = await req(teamRace, 'GET', undefined, bob);
    let firstId, earned = 0;
    for (let i = 0; i < 4; i++) {
      const current = await req(teamRace, 'GET', undefined, alice);
      assert.equal(current.index, i);
      assert.equal(current.question.answer, undefined);
      if (i === 0) firstId = current.question.id;
      if (i === 3) {
        assert.equal(current.question.content, bobFirst.question.content);
        assert.notEqual(current.question.id, firstId);
        await req(teamRace + '/answer', 'POST', { questionId: firstId, choice: 1 }, alice, 409);
      }
      const body = { questionId: current.question.id, choice: 1 };
      await req(teamRace + '/answer', 'POST', body, alice);
      assert.equal((await req(teamRace + '/answer', 'POST', { ...body, choice: 0 }, alice)).choice, 1);
      const feedback = await req(teamRace, 'GET', undefined, alice);
      assert.equal(feedback.phase, 'reveal');
      assert.equal(feedback.question.answer, 1);
      earned += feedback.me.delta;
      time += 900;
    }
    const bobWaiting = await req(teamRace, 'GET', undefined, bob);
    assert.equal(bobWaiting.question.id, bobFirst.question.id);
    assert.equal(bobWaiting.question.answer, undefined);
    assert.equal(bobWaiting.me.attempts, 0);
    assert.equal(bobWaiting.racers, undefined);
    const standings = await req(teamRace);
    assert.equal(standings.question, null);
    assert.equal(standings.teams[0].score, earned);
    assert.equal(standings.answered, 4);
    time = bobWaiting.endsAt;
    await req(teamRace + '/answer', 'POST', { questionId: bobFirst.question.id, choice: 1 }, bob, 409);
    assert.equal((await req(teamRace, 'GET', undefined, bob)).phase, 'reveal');
    time = teamStart.raceEndsAt;
    assert.equal((await req(base)).live, null);
    assert.equal((await req(teamRace)).phase, 'finished');
    const other = (await req('/', 'POST', { title: '다른 방', layout: 'quiz' }, teacher, 201)).board;
    await req('/' + other.id + '/races/' + raceId, 'GET', undefined, teacher, 404);
    await req(route, 'GET', undefined, 'test_teacher=2', 401);
  } finally { await h.close(); }
});
