'use strict';
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { PGlite } = require('../game-hub-server/node_modules/@electric-sql/pglite');
const express = require('../game-hub-server/node_modules/express');
const { createLearningRecords } = require('../game-hub-server/learning-records');

async function harness() {
  const db = new PGlite();
  await db.exec(`
    CREATE TABLE classroom_users(id BIGINT PRIMARY KEY, email TEXT);
    CREATE TABLE classroom_schools(id BIGINT PRIMARY KEY, enabled BOOLEAN);
    CREATE TABLE school_students(id BIGINT, school_id BIGINT, academic_year INTEGER, grade INTEGER, class_number INTEGER, student_number INTEGER, roster_name TEXT, user_id BIGINT, student_email TEXT);
    CREATE TABLE classroom_classes(id BIGINT PRIMARY KEY, school_id BIGINT, academic_year INTEGER, grade INTEGER, class_number INTEGER);
    CREATE TABLE classroom_students(id BIGINT, class_id BIGINT, student_number INTEGER, roster_name TEXT, user_id BIGINT);
    INSERT INTO classroom_users VALUES (1,'a@school.kr'),(2,'b@school.kr'),(3,'teacher@school.kr'),(4,'other@school.kr'),(5,'old@school.kr');
    INSERT INTO classroom_schools VALUES (10,TRUE),(20,TRUE);
    INSERT INTO school_students VALUES (1,10,2026,4,1,1,'가학생',NULL,'a@school.kr'),(2,20,2026,4,1,2,'나학생',2,'b@school.kr');
    INSERT INTO classroom_classes VALUES (100,10,2026,4,1),(200,20,2026,4,1);
    INSERT INTO classroom_students VALUES (50,100,3,'다학생',5);
  `);
  // A PGlite instance is one connection; serialize transactions for this harness.
  let queue = Promise.resolve();
  const query = async (sql, params) => { if (!params && sql.includes('CREATE TABLE')) { await db.exec(sql); return { rows: [], rowCount: 0 }; } const r = await db.query(sql, params); return { ...r, rowCount: r.affectedRows ?? r.rows.length }; };
  const pool = { query, async connect() { const previous = queue; let release; queue = new Promise(r => release = r); await previous; return { query, release }; } };
  class HttpError extends Error { constructor(status, code, message) { super(message); Object.assign(this, { status, code }); } }
  const requireUser = async req => { const id = Number(req.headers['x-test-user']); const user = (await query('SELECT * FROM classroom_users WHERE id=$1', [id || 0])).rows[0]; if (!user) throw new HttpError(401, 'LOGIN_REQUIRED', '로그인 필요'); return user; };
  const teacherRegistrations = async user => [3, 4].includes(Number(user.id)) ? [{ school_id: Number(user.id) === 3 ? 10 : 20, school_name: '테스트학교', teacher_type: '담임', academic_year: 2026, grade: 4, class_number: 1 }] : [];
  const feature = createLearningRecords({ pool, requireUser, requireTeacher: async req => { const u = await requireUser(req); if (!(await teacherRegistrations(u)).length) throw new HttpError(403, 'TEACHER_REQUIRED', '교사만 조회'); return u; },
    teacherRegistrations, requireDatabase() {}, HttpError, asyncRoute: fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next) });
  await feature.initialize(); await feature.initialize();
  const app = express(); app.use(express.json({ limit: '512kb' })); app.use('/api/learning-records', feature.router);
  app.use(express.static(require('node:path').resolve(__dirname, '..')));
  app.use((err, req, res, next) => { if (!err.status) console.error(err); res.status(err.status || 500).json({ code: err.code, message: err.message }); });
  const server = await new Promise(resolve => { const s = app.listen(0, '127.0.0.1', () => resolve(s)); });
  return { db, pool, base: `http://127.0.0.1:${server.address().port}`, close: async () => { await new Promise(resolve => server.close(resolve)); await db.close(); } };
}
async function main() {
  const h = await harness();
  const request = async (route, body, user = 1) => {
    const response = await fetch(h.base + '/api/learning-records' + route, { headers: { 'Content-Type': 'application/json', 'x-test-user': String(user) }, ...(body ? { method: 'POST', body: JSON.stringify(body) } : {}) });
    assert.equal(response.headers.get('cache-control'), 'no-store');
    return { status: response.status, data: await response.json() };
  };
  try {
    assert.equal((await request('/context', null, 0)).status, 401);
    assert.equal((await request('/context')).data.mode, 'student');
    assert.equal((await request('/context', null, 3)).data.mode, 'preview');
    const start = { activity: 'proverbs', contentKey: 'ko:0', contentVersion: 'v1', title: '속담 · 말의 힘', href: '/learning/literacy-numeracy/proverbs/', checkpoint: { order: [2, 1, 0] }, userId: 2 };
    assert.equal((await request('/sessions', { ...start, href: '//evil.test/' })).status, 400);
    let result = await request('/sessions', start);
    assert.equal(result.status, 200); const id = result.data.session.id;
    const reopened = await request('/sessions', start); assert.equal(reopened.data.session.id, id);
    const change = { revision: 0, mutationId: crypto.randomUUID(), checkpoint: { order: [2, 1, 0], index: 0 }, progress: { current: 0, total: 3 },
      events: [{ kind: 'answer', questionKey: 'q1', response: '틀린 답', correct: false, snapshot: { prompt: '문제' } }] };
    result = await request(`/sessions/${id}/changes`, change); assert.equal(result.status, 200, JSON.stringify(result));
    assert.equal(result.data.session.summary.firstCorrect, 0);
    assert.equal((await request(`/sessions/${id}/changes`, change)).data.session.events.length, 1, 'lost ACK retry is idempotent');
    assert.equal((await request(`/sessions/${id}/changes`, { ...change, checkpoint: {} })).status, 409);
    assert.equal((await request(`/sessions/${id}/changes`, { ...change, mutationId: crypto.randomUUID() })).status, 409, 'stale tab does not overwrite');
    assert.equal((await request(`/sessions/${id}`, null, 2)).status, 404);
    assert.equal((await request(`/sessions/${id}/changes`, change, 2)).status, 404);
    result = await request(`/sessions/${id}/changes`, { ...change, revision: 1, mutationId: crypto.randomUUID(), progress: { current: 1, total: 3 }, events: [{ ...change.events[0], response: '정답', correct: true }] });
    assert.equal(result.data.session.summary.firstCorrect, 0); assert.equal(result.data.session.summary.retryCount, 1); assert.equal(result.data.session.summary.solvedAfterRetry, 1);
    const restore = (await request(`/sessions/${id}`)).data.session;
    assert.deepEqual(restore.checkpoint.order, [2, 1, 0]); assert.equal(restore.events[1].attemptNumber, 2);
    result = await request(`/sessions/${id}/changes`, { ...change, revision: 2, mutationId: crypto.randomUUID(), complete: true, events: [{ kind: 'self-assessment', questionKey: 'q2', response: 'known', correct: true }] });
    assert.equal(result.data.session.status, 'completed'); assert.equal(result.data.session.events[2].correct, null);
    assert.notEqual((await request('/sessions', start)).data.session.id, id, 'a replay has its own record');
    assert.equal((await request('/sessions', start, 5)).status, 200, 'legacy roster identity also works');
    assert.equal((await request('/sessions', start, 3)).status, 403);
    assert.equal((await request('/teacher/classes', null, 1)).status, 403);
    assert.equal((await request('/teacher/classes', null, 3)).data.classes[0].id, '10:2026:4:1');
    result = await request('/teacher/report?classId=10:2026:4:1', null, 3);
    assert.equal(result.status, 200, JSON.stringify(result)); assert.ok(result.data.sessions.some(s => s.id === id)); assert.ok(result.data.roster.some(s => s.user_id === '1'));
    assert.equal((await request('/teacher/report?classId=10:2026:4:1', null, 4)).status, 403);
    assert.equal((await request(`/teacher/sessions/${id}`, null, 4)).status, 404);
    assert.equal((await request(`/teacher/sessions/${id}`, null, 3)).data.session.events.length, 3);
    assert.equal((await request('/teacher/report?classId=10:2026:4:1&from=2026-02-30', null, 3)).status, 400);
    // Only events inside the Korean calendar day contribute to its summary.
    await h.pool.query("UPDATE learning_record_events SET recorded_at = '2026-09-30 14:59:59+00' WHERE session_id=$1 AND attempt_number=1", [id]);
    await h.pool.query("UPDATE learning_record_events SET recorded_at = '2026-09-30 15:00:01+00' WHERE session_id=$1 AND attempt_number=2", [id]);
    result = await request('/teacher/report?classId=10:2026:4:1&from=2026-10-01&to=2026-10-01', null, 3);
    assert.equal(result.data.sessions.find(s => s.id === id).summary.firstScored, 0); assert.equal(result.data.sessions.find(s => s.id === id).summary.retryCount, 1);
    console.log('PASS common records: SQL, both rosters, account/class isolation, resume, idempotency, conflicts, retry semantics, KST dates, no-store.');
  } finally { await h.close(); }
}
module.exports = { harness };
if (require.main === module) main().catch(error => { console.error(error); process.exitCode = 1; });
