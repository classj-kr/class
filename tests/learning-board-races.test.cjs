const test = require('node:test');
const assert = require('node:assert/strict');
const { createHarness } = require('./learning-boards-harness.cjs');
const { scoreAnswer } = require('../game-hub-server/learning-board-races');

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
    const { id: raceId } = await req(base + '/races', 'POST', { setId, seconds: 10 }, teacher, 201);
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
        assert.equal((await req(route, 'GET', undefined, alice)).me.spectator, true);
        await req(route + '/answer', 'POST', { questionId: state.question.id, choice: 1 }, alice, 403);
        await req(route + '/answer', 'POST', { questionId: teacherQuestions[1].id, choice: 1 }, bob, 409);
      } else await req(route + '/answer', 'POST', { questionId: state.question.id, choice: 1 }, alice);
      const accepted = await req(route + '/answer', 'POST', { questionId: state.question.id, choice: 1 }, bob);
      assert.deepEqual(Object.keys(accepted).filter(k => k !== 'cookie').sort(), ['accepted', 'choice']);
      assert.equal((await req(route + '/answer', 'POST', { questionId: state.question.id, choice: 0 }, bob)).choice, 1, 'first answer is final');
      assert.equal((await req(route, 'GET', undefined, bob)).question.answer, undefined, 'no immediate correctness oracle');
      time += 10000;
      await req(route + '/answer', 'POST', { questionId: state.question.id, choice: 0 }, bob, 409);
      await h.initialize(); // restart cannot reset an in-progress race or its deadline
      state = await req(route);
      assert.equal(state.phase, 'reveal'); assert.equal(state.question.answer, 1);
      const a = state.racers.find(p => p.number === 1), b = state.racers.find(p => p.number === 2);
      if (i === 0) assert.equal(a.delta, b.delta, 'author receives neutral average movement');
      if (i === 2) { assert.equal(b.boost, true); assert.ok(b.delta >= 160); }
      const score = b.score;
      assert.equal((await req(route)).racers.find(p => p.number === 2).score, score, 'grading is exactly once');
      assert.equal((await req(route + '/join', 'POST', {}, bob)).me.score, score, 'rejoin preserves score');
      const body = { action: 'next', phase: 'reveal', index: i };
      state = await req(route + '/control', 'POST', body);
      await req(route + '/control', 'POST', body, teacher, 409);
    }
    assert.equal(state.phase, 'finished'); assert.equal((await req(base)).live, null);
    const again = await req(base + '/races', 'POST', { setId }, teacher, 201);
    assert.notEqual(again.id, raceId);
    assert.equal((await req(base + '/races/' + again.id + '/join', 'POST', {}, bob)).me.score, 0);
    const other = (await req('/', 'POST', { title: '다른 방', layout: 'quiz' }, teacher, 201)).board;
    await req('/' + other.id + '/races/' + raceId, 'GET', undefined, teacher, 404);
    await req(route, 'GET', undefined, 'test_teacher=2', 401);
  } finally { await h.close(); }
});
