const test = require('node:test');
const assert = require('node:assert/strict');
const express = require('../game-hub-server/node_modules/express');
const { PGlite } = require('../game-hub-server/node_modules/@electric-sql/pglite');
const { createExams, normalizeQuestions, matchesAnswer } = require('../game-hub-server/exams');
const { createRoomCodes } = require('../game-hub-server/room-codes');
const { createRoomEntry } = require('../game-hub-server/room-entry');

test('question validation and short answer aliases', () => {
  const [q] = normalizeQuestions([{ kind: 'short', content: '무엇인가요?', answer: '한 글', aliases: ['다른 답'] }], { publish: true });
  assert.ok(matchesAnswer(q, { response: '한글.' }));
  assert.ok(matchesAnswer(q, { response: '다른답' }));
  assert.equal(matchesAnswer(q, { response: '엉뚱한 답' }), false);
  assert.throws(() => normalizeQuestions([{ kind: 'short', content: '문제', answer: '' }], { publish: true }));
});

test('teacher creates an exam; students join, answer and are graded after server deadline', async () => {
  const db = new PGlite();
  await db.exec('CREATE TABLE classroom_users(id BIGINT PRIMARY KEY); INSERT INTO classroom_users VALUES(1),(2),(3),(4);');
  let tail = Promise.resolve();
  async function lease() { const previous = tail; let release; tail = new Promise(resolve => { release = resolve; }); await previous; return release; }
  // pg 는 인자 없는 쿼리를 단순 프로토콜로 보내 여러 문장을 한 번에 실행한다. 같게 맞춘다.
  async function query(sql, args) { const result = !args && sql.trim().replace(/;\s*$/, '').includes(';') ? (await db.exec(sql)).at(-1) : await db.query(sql, args); return { ...result, rowCount: result.rows.length || result.affectedRows || 0 }; }
  const pool = { async query(sql, args) { const release = await lease(); try { return await query(sql, args); } finally { release(); } },
    async connect() { const release = await lease(); return { query, release }; } };
  class HttpError extends Error { constructor(status, code, message) { super(message); this.status = status; this.code = code; } }
  const sessionUser = async req => /teacher=1/.test(req.headers.cookie || '') ? { id: 1, role: 'teacher' } :
    /teacher=3/.test(req.headers.cookie || '') ? { id: 3, role: 'teacher' } :
    /teacher=4/.test(req.headers.cookie || '') ? { id: 4, role: 'teacher' } :
    /student=2/.test(req.headers.cookie || '') ? { id: 2, role: 'student', name: '학생' } : null;
  // 1·3번 교사는 같은 학교, 4번 교사는 다른 학교.
  const schools = { 1: { schoolId: 10, name: '김담임' }, 3: { schoolId: 10, name: '이담임' }, 4: { schoolId: 20, name: '박교사' } };
  const roomCodes = createRoomCodes({ pool, legacyTaken: async (code, client) => (await client.query('SELECT 1 FROM classroom_exams WHERE code=$1', [code])).rows.length > 0 });
  await roomCodes.initialize();
  const feature = createExams({ pool, sessionUser, requireTeacher: async req => { const user = await sessionUser(req); if (user?.role !== 'teacher') throw new HttpError(401, 'AUTH', '교사 로그인 필요'); return user; },
    requireDatabase() {}, HttpError, asyncRoute: fn => (req,res,next) => Promise.resolve(fn(req,res)).catch(next),
    allocateRoomCode: client => roomCodes.allocate('exam', client),
    joinIdentity: async (_req,user) => user?.role === 'student' ? { name: '학생', number: 7 } : null,
    teacherSchool: async user => schools[user.id] || null,
    failureLimiter: { enforce() {}, recordFailure() {} } });
  await feature.initialize(); await feature.initialize();
  const app = express(); app.use(express.json()); app.use('/api/room-entry', createRoomEntry({ roomCodes })); app.use('/api/exams', feature.router);
  app.use((error,_req,res,_next) => res.status(error.status || 500).json({ message: error.message, code: error.code }));
  const server = await new Promise(resolve => { const s = app.listen(0, '127.0.0.1', () => resolve(s)); });
  const base = `http://127.0.0.1:${server.address().port}`;
  const teacher = 'teacher=1', student = 'student=2';
  async function request(path, method = 'GET', body, cookie = teacher, status = 200) {
    const response = await fetch(base + '/api/exams' + path, { method, headers: { 'Content-Type': 'application/json', Cookie: cookie }, body: body === undefined ? undefined : JSON.stringify(body) });
    const data = await response.json(); assert.equal(response.status, status, `${method} ${path}: ${JSON.stringify(data)}`);
    return { ...data, cookie: response.headers.get('set-cookie')?.split(';')[0] };
  }
  try {
    const created = await request('/', 'POST', { title: '진단평가', durationMinutes: 1 }, teacher, 201);
    const path = '/' + created.id;
    assert.match(created.code, /^\d{4}$/);
    const entry = await (await fetch(base + '/api/room-entry/resolve/' + created.code)).json();
    assert.equal(entry.href, '/exams/?code=' + created.code);
    const questions = [
      { kind: 'choice', content: '2+3?', choices: ['4','5'], answer: 1 },
      { kind: 'short', content: '우리말 이름은?', answer: '한글', aliases: ['한 글'] }
    ];
    await request(path, 'PUT', { title: '진단평가', durationMinutes: 1, questions });
    const before = await request(path); assert.equal(before.questions.length, 2);
    const joined = await request('/join', 'POST', { code: created.code, number: 1, name: '사칭' }, student);
    assert.equal(joined.member.number, 7);
    const studentCookie = `${student}; ${joined.cookie}`;
    const waiting = await request(path, 'GET', undefined, studentCookie);
    assert.equal(waiting.exam.status, 'draft');
    assert.deepEqual(waiting.questions, []);
    assert.equal(waiting.score, null);
    await request(path + '/answers/' + before.questions[0].id, 'PUT', { choice: 1 }, studentCookie, 403);
    await request(path + '/submit', 'POST', {}, studentCookie, 403);
    await request(path + '/start', 'POST');
    const current = await request(path, 'GET', undefined, studentCookie);
    assert.equal(current.questions[0].answer, undefined);
    assert.equal(current.questions[1].aliases, undefined);
    assert.equal(current.score, null);
    await request(path + '/answers/' + before.questions[0].id, 'PUT', { choice: 1 }, studentCookie);
    await request(path + '/answers/' + before.questions[1].id, 'PUT', { response: '한 글.' }, studentCookie);
    await request(path + '/submit', 'POST', {}, studentCookie);
    await request(path + '/answers/' + before.questions[0].id, 'PUT', { choice: 0 }, studentCookie, 403);
    assert.equal((await request(path, 'GET', undefined, studentCookie)).score, 2);
    assert.equal((await request(path)).members[0].score, 2);
    const late = await request('/join', 'POST', { code: created.code, number: 2, name: '둘' }, '');
    const lateCookie = late.cookie;
    await db.query("UPDATE classroom_exams SET started_at=NOW()-INTERVAL '2 minutes' WHERE id=$1", [created.id]);
    await request(path + '/answers/' + before.questions[0].id, 'PUT', { choice: 1 }, lateCookie, 403);
    assert.equal((await request(path, 'GET', undefined, lateCookie)).score, 0);
    await request('/join', 'POST', { code: created.code, number: 7, name: '학생' }, studentCookie);

    // 같은 학교 교사는 목록에서 보고 운영할 수 있고, 삭제는 만든 교사만 한다. 다른 학교 교사는 보지 못한다.
    const shared = await request('/', 'POST', { title: '학교 공통 진단', durationMinutes: 40 }, teacher, 201);
    const colleague = 'teacher=3', outsider = 'teacher=4';
    const list = (await request('/mine', 'GET', undefined, colleague)).exams;
    assert.deepEqual(list.map(e => [e.title, e.mine, e.ownerName]), [['학교 공통 진단', false, '김담임'], ['진단평가', false, '김담임']]);
    assert.equal((await request('/mine', 'GET', undefined, outsider)).exams.length, 0);
    await request('/' + shared.id, 'PUT', { title: '학교 공통 진단', durationMinutes: 40, questions }, colleague);
    assert.equal((await request('/' + shared.id + '?mode=teacher', 'GET', undefined, colleague)).questions.length, 2);
    await request('/' + shared.id, 'PUT', { title: '가로채기', durationMinutes: 40, questions }, outsider, 403);
    await request('/' + shared.id, 'DELETE', undefined, colleague, 403);

    // 학교 전체가 들어오므로 반이 다르면 번호가 같아도 입장한다. 같은 반 같은 번호는 막는다.
    await request('/join', 'POST', { code: shared.code, grade: 3, classNumber: 1, number: 5, name: '가' }, '');
    await request('/join', 'POST', { code: shared.code, grade: 3, classNumber: 2, number: 5, name: '나' }, '');
    await request('/join', 'POST', { code: shared.code, grade: 3, classNumber: 2, number: 5, name: '다' }, '', 409);
    const seats = (await request('/' + shared.id + '?mode=teacher', 'GET', undefined, colleague)).members;
    assert.deepEqual(seats.map(m => [m.grade, m.classNumber, m.number]), [[3, 1, 5], [3, 2, 5]]);
    await request('/' + shared.id, 'DELETE');
  } finally { await new Promise(resolve => server.close(resolve)); await db.close(); }
});
