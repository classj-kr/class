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
    ALTER TABLE classroom_students ADD COLUMN student_email TEXT;
    ALTER TABLE classroom_students ADD COLUMN roster_active BOOLEAN NOT NULL DEFAULT TRUE;
  `);
  // A PGlite instance is one connection; serialize transactions for this harness.
  let queue = Promise.resolve();
  const query = async (sql, params) => { if (!params && sql.includes('CREATE TABLE')) { await db.exec(sql); return { rows: [], rowCount: 0 }; } const r = await db.query(sql, params); return { ...r, rowCount: r.affectedRows ?? r.rows.length }; };
  const pool = { query, async connect() { const previous = queue; let release; queue = new Promise(r => release = r); await previous; return { query, release }; } };
  class HttpError extends Error { constructor(status, code, message) { super(message); Object.assign(this, { status, code }); } }
  const requireUser = async req => { const id = Number(req.headers['x-test-user']); const user = (await query('SELECT * FROM classroom_users WHERE id=$1', [id || 0])).rows[0]; if (!user) throw new HttpError(401, 'LOGIN_REQUIRED', '로그인 필요'); return user; };
  const teacherRegistrations = async user => [3, 4, 10].includes(Number(user.id)) ? [{ school_id: Number(user.id) === 4 ? 20 : 10, school_name: '테스트학교', teacher_type: '담임', academic_year: 2026, grade: Number(user.id) === 10 ? 3 : 4, class_number: 1 }] : [];
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
    const oldActive = (await request('/sessions', start)).data.session;
    await h.pool.query('UPDATE school_students SET class_number=2 WHERE id=1');
    const newClass = (await request('/sessions', start)).data.session;
    assert.notEqual(newClass.id, oldActive.id, 'new class starts its own activity');
    assert.equal((await request(`/sessions/${oldActive.id}/changes`, { ...change, revision: oldActive.revision, mutationId: crypto.randomUUID() })).status, 409, 'previous class cannot receive new answers');
    assert.equal((await request(`/teacher/sessions/${newClass.id}`, null, 3)).status, 404, 'previous teacher cannot see new class activity');
    assert.equal((await request('/word-progress?activity=vocabulary', null, 0)).status, 401);
    // Existing logins may have only an email on a newly imported legacy roster.
    // Old roster copies must neither override the current class nor revive removed students.
    await h.db.exec(`
      INSERT INTO classroom_users VALUES (6,'emailonly@school.kr'),(7,'removed@school.kr'),(8,'current@school.kr');
      INSERT INTO classroom_classes VALUES (90,10,2026,3,1);
      INSERT INTO school_students VALUES (8,10,2026,4,1,8,'현재학생',8,'current@school.kr');
      INSERT INTO classroom_students(id,class_id,student_number,roster_name,user_id,student_email,roster_active) VALUES
        (60,100,6,'이메일학생',NULL,'EMAILONLY@school.kr',TRUE),
        (61,100,7,'제외학생',7,'removed@school.kr',FALSE),
        (62,90,8,'옛학급학생',8,'current@school.kr',FALSE);
    `);
    assert.equal((await request('/context', null, 6)).data.mode, 'student', 'email-linked legacy roster can save');
    assert.equal((await request('/context', null, 7)).data.mode, 'preview', 'inactive roster is not a student membership');
    assert.equal((await request('/sessions', start, 7)).status, 403, 'inactive roster cannot create records');
    const mathStart = { ...start, activity: 'math-ox', contentKey: '초3', title: '수학 기초 OX · 초3', href: '/learning/literacy-numeracy/math-ox/', checkpoint: { answered: {} } };
    const emailSession = (await request('/sessions', mathStart, 6)).data.session;
    const currentSession = (await request('/sessions', mathStart, 8)).data.session;
    assert.equal((await h.pool.query('SELECT grade FROM learning_record_sessions WHERE id=$1', [currentSession.id])).rows[0].grade, 4, 'inactive older class never receives the record');
    await h.pool.query('UPDATE classroom_students SET roster_active=TRUE WHERE id=62');
    assert.equal((await request('/sessions', mathStart, 8)).data.session.id, currentSession.id, 'current school roster wins even if an old copy is still active');
    const mathContext = { window: {} };
    require('node:vm').runInNewContext(require('node:fs').readFileSync(require('node:path').join(__dirname, '../learning/literacy-numeracy/math-ox/data.js'), 'utf8'), mathContext);
    const question = mathContext.window.MATH_OX_DATA.find(q => q.subject === '초3');
    result = await request(`/sessions/${emailSession.id}/changes`, { revision: 0, mutationId: crypto.randomUUID(), checkpoint: {}, progress: { current: 1, total: 10 },
      events: [{ kind: 'answer', questionKey: String(question.id), response: question.answer, snapshot: { prompt: question.prompt } }] }, 6);
    assert.equal(result.status, 200);
    result = await request('/teacher/report?classId=10:2026:4:1', null, 3);
    assert.equal(result.status, 200);
    assert.equal(result.data.sessions.find(s => s.id === emailSession.id).summary.firstCorrect, 1, 'OX answer appears in the current teacher report');
    assert.ok(result.data.sessions.some(s => s.id === currentSession.id));
    assert.ok(result.data.roster.some(s => s.user_id === '6'), 'email-only student appears once with the account identity');
    assert.equal(result.data.roster.some(s => s.user_id === '7'), false, 'removed student is excluded from the current roster');
    assert.equal((await request(`/teacher/sessions/${emailSession.id}`, null, 4)).status, 404, 'email matching does not cross school permissions');
    // Every activity shares the same student identity and report query. Check
    // reading and self-assessment events too, without requiring completion.
    const activitySessions = [];
    for (const activity of require('../assets/learning-record-catalog')) {
      const opened = await request('/sessions', { ...start, activity: activity.id,
        contentKey: `report-check-${activity.id}`, title: activity.label, href: activity.href, checkpoint: {} }, 8);
      assert.equal(opened.status, 200, activity.id);
      const kind = activity.domain === '읽기' ? 'read' : activity.domain === '자기점검' ? 'self-assessment' : 'answer';
      const event = { kind, questionKey: activity.id === 'math-ox' ? String(question.id) : 'item-1',
        response: activity.id === 'math-ox' ? question.answer : '응답', correct: true, snapshot: { title: activity.label } };
      const saved = await request(`/sessions/${opened.data.session.id}/changes`, { revision: 0, mutationId: crypto.randomUUID(),
        checkpoint: {}, progress: { current: 1, total: 2 }, events: [event] }, 8);
      assert.equal(saved.status, 200, activity.id);
      activitySessions.push({ id: saved.data.session.id, activity: activity.id, kind });
    }
    result = await request('/teacher/report?classId=10:2026:4:1', null, 3);
    assert.equal(result.status, 200);
    for (const expected of activitySessions) {
      const recorded = result.data.sessions.find(s => s.id === expected.id);
      assert.ok(recorded, `${expected.activity} appears in the common teacher report`);
      assert.equal(recorded.status, 'active');
      const metric = expected.kind === 'read' ? 'readCount' : expected.kind === 'self-assessment' ? 'selfAssessments' : 'firstScored';
      assert.equal(recorded.summary[metric], 1, expected.activity);
      assert.equal((await request(`/teacher/sessions/${expected.id}`, null, 4)).status, 404);
    }
    // Existing records saved under an old class remain visible to the current
    // teacher, without changing their events or rewriting their original scope.
    const oldClassRecord = activitySessions.find(s => s.activity === 'world-tales');
    await h.pool.query('UPDATE learning_record_sessions SET grade=3 WHERE id=$1', [oldClassRecord.id]);
    result = await request('/teacher/report?classId=10:2026:4:1', null, 3);
    assert.equal(result.data.sessions.find(s => s.id === oldClassRecord.id)?.summary.readCount, 1);
    assert.equal((await request(`/teacher/sessions/${oldClassRecord.id}`, null, 3)).data.session.events.length, 1);
    assert.equal((await h.pool.query('SELECT grade FROM learning_record_sessions WHERE id=$1', [oldClassRecord.id])).rows[0].grade, 3, 'reading does not rewrite saved records');
    await h.db.exec(`INSERT INTO classroom_users VALUES (9,'otherclass@school.kr'),(10,'oldteacher@school.kr');
      INSERT INTO school_students VALUES (9,10,2026,3,1,9,'다른반학생',9,'otherclass@school.kr');`);
    const unrelated = (await request('/sessions', mathStart, 9)).data.session;
    result = await request('/teacher/report?classId=10:2026:4:1', null, 3);
    assert.equal(result.data.sessions.some(s => s.id === unrelated.id), false);
    assert.equal((await request(`/teacher/sessions/${unrelated.id}`, null, 3)).status, 404, 'other pupils in the same school remain private');
    const previousTeacher = await request('/teacher/report?classId=10:2026:3:1', null, 10);
    assert.equal(previousTeacher.data.sessions.some(s => s.id === currentSession.id), false, 'stale active legacy membership grants no access to current-class work');
    assert.equal((await request(`/teacher/sessions/${currentSession.id}`, null, 10)).status, 404);
    for (const [activityId, column, value] of [['world-novels','school_id',20],['poetry','academic_year',2025]]) {
      const outside = activitySessions.find(s => s.activity === activityId);
      await h.pool.query(`UPDATE learning_record_sessions SET ${column}=$2 WHERE id=$1`, [outside.id, value]);
      result = await request('/teacher/report?classId=10:2026:4:1', null, 3);
      assert.equal(result.data.sessions.some(s => s.id === outside.id), false);
      assert.equal((await request(`/teacher/sessions/${outside.id}`, null, 3)).status, 404, 'current membership cannot bypass school/year boundaries');
    }
    console.log('PASS common records: all 17 activities, existing old-class records, unfinished reading/answers/self-assessment, current/legacy/email-only rosters, strict account/class/school/year isolation, resume, idempotency, KST dates, no-store.');
  } finally { await h.close(); }
}
module.exports = { harness };
if (require.main === module) main().catch(error => { console.error(error); process.exitCode = 1; });
