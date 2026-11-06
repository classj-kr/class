const test = require('node:test');
const assert = require('node:assert/strict');
const { createHarness } = require('./learning-boards-harness.cjs');

// 1x1 images: smallest real files of each accepted type.
const PNG = Buffer.from('89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000d49444154789c6360f8cfc0f01f0005000201a2b2b1c50000000049454e44ae426082', 'hex');
const GIF = Buffer.from('474946383961010001008000000000ffffff21f90401000000002c00000000010001000002024401003b', 'hex');

test('board images upload, attach, display and follow post visibility', async () => {
  const h = await createHarness(), teacher = 'test_teacher=1';
  async function req(path, method = 'GET', body, cookie = teacher, status = 200) {
    const res = await fetch(h.base + '/api/boards' + path, { method,
      headers: { 'Content-Type': 'application/json', Cookie: cookie }, body: body === undefined ? undefined : JSON.stringify(body) });
    const value = await res.json(); assert.equal(res.status, status, JSON.stringify(value));
    return { ...value, cookie: res.headers.get('set-cookie')?.split(';')[0] };
  }
  async function upload(boardId, data, cookie, status = 201, type = 'image/png') {
    const res = await fetch(`${h.base}/api/boards/${boardId}/images`, { method: 'POST', headers: { 'Content-Type': type, Cookie: cookie }, body: data });
    const value = await res.json(); assert.equal(res.status, status, JSON.stringify(value));
    return value;
  }
  async function image(boardId, imageId, cookie, status = 200) {
    const res = await fetch(`${h.base}/api/boards/${boardId}/images/${imageId}`, { headers: { Cookie: cookie } });
    assert.equal(res.status, status);
    return res;
  }
  try {
    const { board } = await req('/', 'POST', { title: '그림 전시', layout: 'wall' }, teacher, 201);
    const base = '/' + board.id;
    // Background is random at creation and changeable by the teacher only.
    assert.ok(['default', 'space', 'ocean', 'forest', 'snow', 'sunset', 'petals'].includes(board.theme));
    await req(base, 'PATCH', { theme: 'neon' }, teacher, 400);
    await req(base, 'PATCH', { theme: 'space' });
    assert.equal((await req(base)).board.theme, 'space');
    const alice = (await req('/join', 'POST', { code: board.code, name: '하나', number: 1 }, '')).cookie;
    const bob = (await req('/join', 'POST', { code: board.code, name: '둘', number: 2 }, '')).cookie;
    // 그림판 sends only the code: a known device re-enters, a new one is asked.
    assert.equal((await req('/join', 'POST', { code: board.code }, alice)).board.id, board.id);
    assert.equal((await req('/join', 'POST', { code: board.code }, '', 400)).error, 'IDENTITY_REQUIRED');
    assert.equal((await req('/join', 'POST', { code: board.code, name: '셋' }, '', 400)).error, 'INVALID_NUMBER');

    await upload(board.id, PNG, '', 401);
    await upload(board.id, Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"/>'), alice, 400, 'image/svg+xml');
    assert.equal((await upload(board.id, Buffer.alloc(3 * 1024 * 1024 + 10, 1), alice, 413)).error, 'INVALID_IMAGE');

    const up = await upload(board.id, PNG, alice);
    // Before it is attached only the uploader (and teacher) can open it.
    await image(board.id, up.id, bob, 404);
    await image(board.id, up.id, alice);
    // Someone else's upload cannot be attached.
    await req(base + '/posts', 'POST', { content: '훔친 그림', image: up.id }, bob, 409);
    await req(base + '/posts', 'POST', { content: '잘못된 값', image: '../x' }, alice, 400);
    const post = await req(base + '/posts', 'POST', { content: '우리 동네', image: up.id }, alice, 201);
    await req(base + '/posts', 'POST', { content: '두 번 붙이기', image: up.id }, alice, 409);

    const list = await req(base, 'GET', undefined, bob);
    assert.equal(list.posts[0].image, up.id);
    assert.equal(list.posts[0].commentCount, 0, 'image posts keep comments');
    const res = await image(board.id, up.id, bob);
    assert.equal(res.headers.get('content-type'), 'image/png');
    assert.match(res.headers.get('cache-control'), /immutable/);
    assert.deepEqual(Buffer.from(await res.arrayBuffer()), PNG);
    await image(board.id, up.id, '', 401);
    await image(board.id, 'not-an-id', bob, 404);

    // Comments work on picture posts.
    await req(base + '/posts/' + post.id + '/comments', 'POST', { content: '색이 예뻐요' }, bob, 201);

    // Teacher hides the post: students lose the picture, teacher keeps it.
    await req(base + '/posts/' + post.id, 'PATCH', { hidden: true });
    await image(board.id, up.id, bob, 404);
    await image(board.id, up.id, teacher);
    await req(base + '/posts/' + post.id, 'PATCH', { hidden: false });

    // Teacher and GIF uploads.
    const gif = await upload(board.id, GIF, teacher, 201, 'image/gif');
    const tpost = await req(base + '/posts', 'POST', { content: '선생님 플립북', image: gif.id }, teacher, 201);
    assert.equal((await image(board.id, gif.id, alice)).headers.get('content-type'), 'image/gif');

    // Editing text keeps the picture; deleting the post removes it.
    await req(base + '/posts/' + post.id, 'PATCH', { content: '우리 동네 지도', revision: 1 }, alice);
    assert.equal((await req(base)).posts.find(p => p.id === post.id).image, up.id);
    await req(base + '/posts/' + post.id, 'DELETE', undefined, alice);
    assert.equal((await h.pool.query('SELECT id FROM learning_board_images WHERE id=$1', [up.id])).rows.length, 0);

    // Stale unattached uploads are swept on the next upload.
    const stale = await upload(board.id, PNG, bob);
    await h.pool.query("UPDATE learning_board_images SET created_at=NOW() - INTERVAL '2 hours' WHERE id=$1", [stale.id]);
    await upload(board.id, PNG, bob);
    assert.equal((await h.pool.query('SELECT id FROM learning_board_images WHERE id=$1', [stale.id])).rows.length, 0);

    // Closed board, quiz board and storage cap.
    await req(base, 'PATCH', { closed: true });
    await upload(board.id, PNG, alice, 403);
    await upload(board.id, PNG, teacher);
    await req(base, 'PATCH', { closed: false });
    const quiz = (await req('/', 'POST', { title: '문제', layout: 'quiz' }, teacher, 201)).board;
    await upload(quiz.id, PNG, teacher, 400);
    await h.pool.query('UPDATE learning_board_images SET size=$2 WHERE id=$1', [gif.id, 100 * 1024 * 1024]);
    await upload(board.id, PNG, alice, 409);

    await h.initialize();
    assert.equal((await req(base)).posts.find(p => p.id === tpost.id).image, gif.id, 'restart keeps pictures');
    await req(base, 'DELETE');
    assert.equal((await h.pool.query('SELECT COUNT(*)::int AS count FROM learning_board_images')).rows[0].count, 0);
  } finally { await h.close(); }
});
