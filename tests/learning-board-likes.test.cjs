const test = require('node:test');
const assert = require('node:assert/strict');
const { createHarness } = require('./learning-boards-harness.cjs');

test('board hearts are per member, retry-safe, private, configurable and cleaned up with posts', async () => {
  const h = await createHarness();
  const teacher = 'test_teacher=1';
  async function req(route, method = 'GET', body, cookie = teacher, status = 200) {
    const response = await fetch(h.base + '/api/boards' + route, { method,
      headers: { 'Content-Type': 'application/json', Cookie: cookie },
      body: body === undefined ? undefined : JSON.stringify(body) });
    const data = await response.json();
    assert.equal(response.status, status, JSON.stringify(data));
    return { ...data, cookie: response.headers.get('set-cookie')?.split(';')[0] };
  }
  try {
    const { board } = await req('/', 'POST', { title: '공감', layout: 'wall' }, teacher, 201);
    const base = '/' + board.id;
    assert.equal(board.likesEnabled, true);
    const alice = (await req('/join', 'POST', { code: board.code, name: '하나', number: 1 }, '')).cookie;
    const bob = (await req('/join', 'POST', { code: board.code, name: '둘', number: 2 }, '')).cookie;
    const { id } = await req(base + '/posts', 'POST', { content: '생각 나누기' }, alice, 201);
    const post = base + '/posts/' + id, route = post + '/like';
    await req(route, 'PUT', { liked: true }, '', 401);
    await req(route, 'PUT', { liked: true }, 'test_teacher=2', 401);
    await req(route, 'PUT', { liked: 'yes' }, alice, 400);
    await Promise.all(Array.from({ length: 4 }, () => req(route, 'PUT', { liked: true }, alice)));
    assert.deepEqual((await req(base, 'GET', undefined, alice)).posts[0].likes, { count: 1, liked: true });
    assert.deepEqual((await req(base, 'GET', undefined, bob)).posts[0].likes, { count: 1, liked: false });
    await req(route, 'PUT', { liked: true }, bob);
    assert.equal((await req(route, 'PUT', { liked: true })).count, 3);
    assert.equal((await req(route, 'PUT', { liked: false }, alice)).count, 2);
    assert.equal((await req(route, 'PUT', { liked: false }, alice)).count, 2);
    await req(base, 'PATCH', { likesEnabled: false }, bob, 401);
    await req(base, 'PATCH', { likesEnabled: 'false' }, teacher, 400);
    await req(base, 'PATCH', { likesEnabled: false });
    assert.equal((await req(base, 'GET', undefined, bob)).posts[0].likes, undefined);
    await req(route, 'PUT', { liked: true }, alice, 403);
    await req(base, 'PATCH', { likesEnabled: true, closed: true, hideNames: true });
    assert.equal((await req(route, 'PUT', { liked: true }, alice)).count, 3, 'closing writing does not close reactions');
    await h.initialize();
    assert.deepEqual((await req(base, 'GET', undefined, bob)).posts[0].likes, { count: 3, liked: true });
    const reclaim = await req(base + '/reclaim', 'POST', { number: 2 });
    const recovered = (await req('/reclaim/join', 'POST', { ticket: reclaim.ticket }, '')).cookie;
    await req(route, 'PUT', { liked: true }, bob, 401);
    assert.equal((await req(route, 'PUT', { liked: true }, recovered)).count, 3, 'new device retains the same like');
    await req(post, 'PATCH', { hidden: true });
    await req(route, 'PUT', { liked: true }, alice, 404);
    assert.equal((await req(base, 'GET', undefined, alice)).posts.length, 0);
    await req(post, 'PATCH', { hidden: false });
    const other = (await req('/', 'POST', { title: '다른 방', layout: 'wall' }, teacher, 201)).board;
    await req('/' + other.id + '/posts/' + id + '/like', 'PUT', { liked: true }, teacher, 404);
    const quiz = (await req('/', 'POST', { title: '비공개 문제', layout: 'quiz' }, teacher, 201)).board;
    const question = await req('/' + quiz.id + '/posts', 'POST', { kind: 'ox', content: '비공개', answer: 0 }, teacher, 201);
    await req('/' + quiz.id + '/posts/' + question.id + '/like', 'PUT', { liked: true }, teacher, 404);
    assert.equal((await req('/' + quiz.id)).posts[0].likes, undefined);
    await req(post, 'DELETE');
    assert.equal((await h.pool.query('SELECT COUNT(*)::int AS count FROM learning_board_likes')).rows[0].count, 0);
    await req(route, 'PUT', { liked: true }, alice, 404);
  } finally { await h.close(); }
});
