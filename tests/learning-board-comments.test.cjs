const test = require('node:test');
const assert = require('node:assert/strict');
const { createHarness } = require('./learning-boards-harness.cjs');

test('comments enforce authorship, moderation, private posts, settings and recovery', async () => {
  const h = await createHarness(), teacher = 'test_teacher=1';
  async function req(path, method = 'GET', body, cookie = teacher, status = 200) {
    const res = await fetch(h.base + '/api/boards' + path, { method,
      headers: { 'Content-Type': 'application/json', Cookie: cookie }, body: body === undefined ? undefined : JSON.stringify(body) });
    const value = await res.json(); assert.equal(res.status, status, JSON.stringify(value));
    return { ...value, cookie: res.headers.get('set-cookie')?.split(';')[0] };
  }
  try {
    const { board } = await req('/', 'POST', { title: '댓글', layout: 'wall' }, teacher, 201);
    const base = '/' + board.id;
    assert.equal(board.commentsEnabled, true);
    const alice = (await req('/join', 'POST', { code: board.code, name: '하나', number: 1 }, '')).cookie;
    const bob = (await req('/join', 'POST', { code: board.code, name: '둘', number: 2 }, '')).cookie;
    const post = await req(base + '/posts', 'POST', { content: '의견 나누기' }, alice, 201);
    const route = base + '/posts/' + post.id + '/comments';
    await req(route, 'GET', undefined, '', 401);
    await req(route, 'POST', { content: '침입' }, 'test_teacher=2', 401);
    await req(route, 'POST', { content: '  ' }, alice, 400);
    await req(route, 'POST', { content: '가'.repeat(501) }, alice, 400);
    const c = await req(route, 'POST', { content: '<script>alert(1)</script>' }, alice, 201);
    const tc = await req(route, 'POST', { content: '선생님 댓글' }, teacher, 201);
    let rows = (await req(route, 'GET', undefined, bob)).comments;
    assert.equal(rows.length, 2); assert.equal(rows[0].canEdit, false); assert.equal(rows[0].canDelete, false);
    assert.equal(rows[0].member_id, undefined); assert.equal(rows[0].author, '1번 하나');
    assert.equal((await req(route)).comments[0].canEdit, false, 'teacher cannot rewrite a student comment');
    assert.equal((await req(route)).comments[0].canDelete, true);
    await req(route + '/' + c.id, 'PATCH', { content: '변조', revision: 1 }, teacher, 403);
    await req(route + '/' + c.id, 'PATCH', { content: '변조', revision: 1 }, bob, 403);
    await req(route + '/' + c.id, 'DELETE', undefined, bob, 403);
    await req(route + '/' + tc.id, 'DELETE', undefined, alice, 403);
    await req(route + '/' + c.id, 'PATCH', { content: '수정한 댓글', revision: 1 }, alice);
    await req(route + '/' + c.id, 'PATCH', { content: '이전 수정', revision: 1 }, alice, 409);
    rows = (await req(route, 'GET', undefined, alice)).comments;
    assert.equal(rows[0].content, '수정한 댓글'); assert.equal(rows[0].edited, true); assert.equal(rows[0].revision, 2);
    assert.equal((await req(base)).posts[0].commentCount, 2);
    await req(base, 'PATCH', { hideNames: true });
    assert.equal((await req(route, 'GET', undefined, bob)).comments[0].author, '1번');
    assert.equal((await req(route)).comments[0].author, '1번 하나');
    await req(base, 'PATCH', { commentsEnabled: false }, alice, 401);
    await req(base, 'PATCH', { commentsEnabled: 'no' }, teacher, 400);
    await req(base, 'PATCH', { commentsEnabled: false });
    assert.equal((await req(base)).posts[0].commentCount, undefined);
    await req(route, 'GET', undefined, alice, 403);
    await req(route, 'POST', { content: '금지' }, teacher, 403);
    await req(base, 'PATCH', { commentsEnabled: true, closed: true });
    assert.equal((await req(route, 'GET', undefined, alice)).comments[0].canEdit, false);
    await req(route, 'POST', { content: '마감' }, alice, 403);
    await req(route + '/' + c.id, 'PATCH', { content: '마감', revision: 2 }, alice, 403);
    await req(route + '/' + tc.id, 'PATCH', { content: '교사 수정', revision: 1 });
    await h.initialize();
    assert.equal((await req(route)).comments.length, 2, 'restart and disabled settings retain comments');
    const recovery = await req(base + '/reclaim', 'POST', { number: 1 });
    const newCookie = (await req('/reclaim/join', 'POST', { ticket: recovery.ticket }, '')).cookie;
    await req(route, 'GET', undefined, alice, 401);
    assert.equal((await req(route, 'GET', undefined, newCookie)).comments[0].canDelete, true);
    await req(route + '/' + c.id, 'DELETE', undefined, newCookie);
    await req(base + '/posts/' + post.id, 'PATCH', { hidden: true });
    await req(route, 'GET', undefined, bob, 404);
    await req(route, 'POST', { content: '숨김' }, teacher, 404);
    await req(base + '/posts/' + post.id, 'PATCH', { hidden: false });
    const post2 = await req(base + '/posts', 'POST', { content: '다른 글' }, teacher, 201);
    await req(base + '/posts/' + post2.id + '/comments/' + tc.id, 'DELETE', undefined, teacher, 404);
    const quiz = (await req('/', 'POST', { title: '문제', layout: 'quiz' }, teacher, 201)).board;
    const q = await req('/' + quiz.id + '/posts', 'POST', { kind: 'ox', content: '비공개 문제', answer: 0 }, teacher, 201);
    await req('/' + quiz.id + '/posts/' + q.id + '/comments', 'GET', undefined, teacher, 404);
    await req('/' + quiz.id + '/posts/' + post.id + '/comments/' + tc.id, 'DELETE', undefined, teacher, 404);
    await req(route + '/' + tc.id, 'DELETE');
    const moderated = await req(base + '/posts/' + post2.id + '/comments', 'POST', { content: '삭제 대상' }, teacher, 201);
    await req(base + '/posts/' + post2.id, 'DELETE');
    assert.equal((await h.pool.query('SELECT id FROM learning_board_comments WHERE id=$1', [moderated.id])).rows.length, 0);
    await h.pool.query(`INSERT INTO learning_board_comments(id,board_id,post_id,content)
      SELECT 'limit-' || n, $1, $2, '댓글' FROM generate_series(1,100) n`, [board.id, post.id]);
    await req(route, 'POST', { content: '초과' }, teacher, 409);
    await req(base, 'DELETE');
    assert.equal((await h.pool.query('SELECT COUNT(*)::int AS count FROM learning_board_comments')).rows[0].count, 0);
  } finally { await h.close(); }
});
