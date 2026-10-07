const test = require('node:test');
const assert = require('node:assert/strict');
const { createHarness } = require('./learning-boards-harness.cjs');

test('student authorship, teacher review, immutable approved sets, grading and access control', async () => {
  const h = await createHarness();
  const teacher = 'test_teacher=1'; const other = 'test_teacher=2';
  async function request(path, method = 'GET', body, cookie = teacher, expected = 200) {
    const response = await fetch(h.base + '/api/boards' + path, { method, headers: { 'Content-Type': 'application/json', Cookie: cookie }, body: body === undefined ? undefined : JSON.stringify(body) });
    const payload = await response.json();
    assert.equal(response.status, expected, `${method} ${path}: ${JSON.stringify(payload)}`);
    return { ...payload, cookie: response.headers.get('set-cookie')?.split(';')[0] };
  }
  const make = (layout = 'quiz') => request('/', 'POST', { title: '학생 출제', layout, slots: 3, columns: ['예상', '관찰', '결론'] }, teacher, 201);
  try {
    await request('/mine', 'GET', undefined, '', 401);
    const { board: b } = await make(); const route = '/' + b.id;
    assert.match(b.code, /^\d{4}$/);
    assert.equal((await h.roomCodes.lookup(b.code)).activity, 'board');
    await request(route, 'GET', undefined, '', 401);
    await request(route, 'PATCH', { closed: true }, other, 403);
    const alice = (await request('/join', 'POST', { code: b.code, number: 1, name: '하나' }, '')).cookie;
    const bob = (await request('/join', 'POST', { code: b.code, number: 2, name: '둘' }, '')).cookie;
    await request('/join', 'POST', { code: b.code, number: 1, name: '사칭' }, '', 409);
    await request('/join', 'POST', { code: b.code, number: 1, name: '하나' }, alice);
    await request(route + '/posts', 'POST', { kind: 'note', content: '일반 글' }, alice, 400);
    await request(route + '/posts', 'POST', { kind: 'choice', content: '문제', choices: ['하나'], answer: 0 }, alice, 400);
    const qBody = { kind: 'choice', content: '2 + 3은?', choices: ['4', '5', '6'], answer: 1, explanation: '둘과 셋을 모으면 다섯입니다.' };
    const { id: qId } = await request(route + '/posts', 'POST', qBody, alice, 201);
    let own = await request(route, 'GET', undefined, alice);
    assert.equal(own.posts[0].reviewStatus, 'pending'); assert.equal(own.posts[0].answer, 1);
    assert.equal((await request(route, 'GET', undefined, bob)).posts.length, 0, 'another student cannot read pending questions');
    await request(route + '/posts/' + qId + '/review', 'POST', { status: 'approved', revision: 1 }, alice, 401);
    await request(route + '/sets', 'POST', { title: '미승인 포함', posts: [{ id: qId, revision: 1 }] }, teacher, 409);
    await request(route + '/sets', 'POST', { title: '잘못된 선택', posts: [null] }, teacher, 400);
    await request(route + '/posts/' + qId + '/review', 'POST', { status: 'changes', feedback: '보기와 해설을 확인해 주세요.', revision: 1 });
    own = await request(route, 'GET', undefined, alice); assert.equal(own.posts[0].reviewStatus, 'changes');
    await request(route + '/posts/' + qId, 'PATCH', { ...qBody, revision: 2 }, bob, 403);
    await request(route + '/posts/' + qId, 'PATCH', { ...qBody, revision: 2 }, alice);
    await request(route + '/posts/' + qId + '/review', 'POST', { status: 'approved', revision: 2 }, teacher, 409);
    await request(route + '/posts/' + qId + '/review', 'POST', { status: 'approved', revision: 3 });
    let peer = await request(route, 'GET', undefined, bob);
    assert.equal(peer.posts.length, 1); assert.equal(peer.posts[0].answer, undefined); assert.equal(peer.posts[0].explanation, undefined);
    const { id: setId } = await request(route + '/sets', 'POST', { title: '승인 세트', posts: [{ id: qId, revision: 4 }] }, teacher, 201);
    const setPath = route + '/sets/' + setId;
    assert.equal((await request(setPath, 'GET', undefined, bob)).questions.length, 0);
    await request(setPath, 'PATCH', { status: 'open' }, bob, 401);
    await request(setPath, 'PATCH', { status: 'open' });
    let active = await request(setPath, 'GET', undefined, bob);
    const question = active.questions[0]; assert.equal(question.answer, undefined);
    await request(setPath + '/answer', 'POST', { questionId: question.id, choice: 9 }, bob, 400);
    await request(setPath + '/answer', 'POST', { questionId: question.id, choice: 0 }, bob);
    await request(setPath + '/answer', 'POST', { questionId: question.id, choice: 1 }, bob);
    active = await request(setPath); assert.equal(active.questions[0].results.total, 1); assert.equal(active.questions[0].results.correct, 1);
    assert.equal((await request(setPath, 'GET', undefined, alice)).questions[0].myChoice, undefined);
    // Editing an approved source revokes its approval, but cannot mutate an existing set.
    await request(route + '/posts/' + qId, 'PATCH', { ...qBody, content: '다른 문제', answer: 0, revision: 4 }, alice);
    assert.equal((await request(route, 'GET', undefined, alice)).posts[0].reviewStatus, 'pending');
    assert.equal((await request(setPath)).questions[0].content, '2 + 3은?');
    await request(route + '/sets', 'POST', { title: '낡은 승인', posts: [{ id: qId, revision: 4 }] }, teacher, 409);
    await request(setPath, 'PATCH', { status: 'closed' });
    await request(setPath + '/answer', 'POST', { questionId: question.id, choice: 0 }, bob, 403);
    await request(setPath, 'PATCH', { status: 'revealed' });
    active = await request(setPath, 'GET', undefined, bob); assert.equal(active.questions[0].answer, 1); assert.equal(active.questions[0].myChoice, 1);
    await request(setPath, 'PATCH', { status: 'open' }, teacher, 409);
    const { id: oxId } = await request(route + '/posts', 'POST', { kind: 'ox', content: '지구는 둥글다.', answer: 0 }, bob, 201);
    assert.deepEqual((await request(route, 'GET', undefined, bob)).posts.find(p => p.id === oxId).choices, ['O', 'X']);
    await request(route, 'PATCH', { hideNames: true, locked: true, closed: true });
    await request(route + '/posts', 'POST', qBody, alice, 403);
    await request('/join', 'POST', { code: b.code, number: 3, name: '셋' }, '', 403);
    await request(route, 'GET', undefined, alice); // locks block new joins, not existing reads
    const rotated = await request(route + '/rotate-code', 'POST'); assert.notEqual(rotated.code, b.code);
    assert.match(rotated.code, /^\d{4}$/);
    await request('/join', 'POST', { code: b.code, number: 3, name: '셋' }, '', 404);
    const qr = await fetch(h.base + '/api/boards' + route + '/qr', { headers: { Cookie: teacher } });
    assert.equal(qr.status, 200); assert.match(await qr.text(), /<svg/);
    const ticket = await request(route + '/reclaim', 'POST', { number: 1 });
    await request(route, 'GET', undefined, alice, 401);
    const replacement = (await request('/reclaim/join', 'POST', { ticket: ticket.ticket }, '')).cookie;
    assert.equal((await request(route, 'GET', undefined, replacement)).me.number, 1);
    await request('/reclaim/join', 'POST', { ticket: ticket.ticket }, '', 403);
    await request(route, 'DELETE', undefined, other, 403);
    await request(route, 'DELETE');
    assert.equal((await h.pool.query('SELECT COUNT(*)::int AS n FROM learning_board_answers')).rows[0].n, 0);
    assert.equal((await h.pool.query('SELECT COUNT(*)::int AS n FROM learning_board_sets')).rows[0].n, 0);

    for (const layout of ['wall', 'columns', 'roster']) {
      const { board } = await make(layout); const base = '/' + board.id;
      const student = (await request('/join', 'POST', { code: board.code, number: 1, name: '<img src=x>' }, '')).cookie;
      const note = { kind: 'note', content: '<script>alert(1)</script>', column: 1, link: 'https://example.org/' };
      await request(base + '/posts', 'POST', { ...note, link: 'javascript:alert(1)' }, student, 400);
      if (layout === 'columns') await request(base + '/posts', 'POST', { ...note, column: 8 }, student, 400);
      await request(base + '/posts', 'POST', note, student, 201);
      await request(base + '/posts', 'POST', note, student, layout === 'roster' ? 409 : 201);
      const all = await request(base); const p = all.posts[0];
      await request(base + '/posts/' + p.id, 'PATCH', { hidden: true });
      const visible = await request(base, 'GET', undefined, student);
      assert.ok(visible.posts.every(row => row.id !== p.id));
      await request(base + '/posts/' + p.id, 'DELETE', undefined, student, 403);
    }
  } finally { await h.close(); }
});

test('existing six-digit board invitations survive restart and rotate to four digits', async () => {
  const h = await createHarness();
  async function request(path, body, teacher = true) {
    const response = await fetch(h.base + '/api/boards' + path, { method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: teacher ? 'test_teacher=1' : '' }, body: JSON.stringify(body) });
    assert.ok(response.ok, await response.clone().text());
    return response.json();
  }
  try {
    const { board } = await request('/', { title: '기존 게시판', layout: 'wall' });
    await h.pool.query("UPDATE learning_boards SET code='123456' WHERE id=$1", [board.id]);
    await h.initialize();
    await request('/join', { code: '123456', number: 1, name: '학생' }, false);
    const rotated = await request('/' + board.id + '/rotate-code', {});
    assert.match(rotated.code, /^\d{4}$/);
    await request('/join', { code: rotated.code, number: 2, name: '학생둘' }, false);
  } finally { await h.close(); }
});
