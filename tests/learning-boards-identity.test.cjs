const test = require('node:test');
const assert = require('node:assert/strict');
const { createHarness } = require('./learning-boards-harness.cjs');

test('board entry trusts platform identity and preserves authorship across devices', async () => {
  const h = await createHarness();
  async function request(path, method, body, cookie, status = 200) {
    const r = await fetch(h.base + '/api/boards' + path, { method, headers: { 'Content-Type': 'application/json', Cookie: cookie || '' }, body: body && JSON.stringify(body) });
    const data = await r.json();
    assert.equal(r.status, status, JSON.stringify(data));
    return { ...data, cookie: r.headers.get('set-cookie')?.split(';')[0] };
  }
  try {
    const teacher = 'test_teacher=1', student = 'test_student=3';
    const { board } = await request('/', 'POST', { title: '자동 입장', layout: 'wall' }, teacher, 201);
    const route = '/' + board.id;
    assert.equal((await request('/identity', 'GET', null, student)).recognized, true);
    assert.equal((await request('/identity', 'GET')).recognized, false);
    const joined = await request('/join', 'POST', { code: board.code, name: '사칭', number: 23 }, student);
    let view = await request(route, 'GET', null, student);
    assert.equal(view.me.name, '학생3'); assert.equal(view.me.number, 7);
    await request(route + '/posts', 'POST', { content: '내 글', kind: 'note' }, student, 201);
    // Account-linked member cookies alone do not let another account (or a signed-out user) read it.
    await request(route, 'GET', null, joined.cookie, 401);
    await request(route, 'GET', null, 'test_student=4; ' + joined.cookie, 401);
    await Promise.all(Array.from({ length: 3 }, () => request('/join', 'POST', { code: board.code }, student)));
    view = await request(route, 'GET', null, student);
    assert.equal(view.members.length, 1); assert.equal(view.posts[0].mine, true);
    await request('/join', 'POST', { code: board.code }, 'test_student=4');
    view = await request(route, 'GET', null, 'test_student=4');
    assert.equal(view.me.number, 1); assert.equal(view.posts[0].mine, false);
    await request('/join', 'POST', { code: board.code }, teacher);
    assert.equal((await request(route, 'GET', null, teacher)).members.length, 2, 'teacher does not consume a student seat');
    const guest = await request('/join', 'POST', { code: board.code }, 'test_guest=1');
    view = await request(route, 'GET', null, guest.cookie);
    assert.equal(view.me.name, '게스트'); assert.equal(view.me.number, 2);
    await request('/join', 'POST', { code: board.code }, 'test_guest=1; ' + guest.cookie);
    assert.equal((await request(route, 'GET', null, teacher)).members.length, 3);
    await request(route, 'PATCH', { locked: true }, teacher);
    await request('/join', 'POST', { code: board.code }, 'test_student=5', 403);
    await request('/join', 'POST', { code: board.code }, student);
  } finally { await h.close(); }
});

test('only possession of an existing anonymous membership can link its work to an account', async () => {
  const h = await createHarness();
  const call = async (path, body, cookie = '') => {
    const r = await fetch(h.base + '/api/boards' + path, { method: body ? 'POST' : 'GET', headers: { 'Content-Type': 'application/json', Cookie: cookie }, body: body && JSON.stringify(body) });
    assert.ok(r.ok, await r.clone().text());
    return { ...await r.json(), cookie: r.headers.get('set-cookie')?.split(';')[0] };
  };
  try {
    const { board } = await call('/', { title: '기존 글', layout: 'wall' }, 'test_teacher=1');
    const old = await call('/join', { code: board.code, name: '학생3', number: 7 });
    await call('/' + board.id + '/posts', { content: '기존 글', kind: 'note' }, old.cookie);
    await call('/join', { code: board.code }, 'test_student=3; ' + old.cookie);
    const view = await call('/' + board.id, null, 'test_student=3');
    assert.equal(view.members.length, 1); assert.equal(view.posts[0].mine, true);
    assert.equal(view.me.number, 7);
  } finally { await h.close(); }
});
