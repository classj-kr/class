'use strict';
const express = require('express');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const catalog = require('../assets/learning-record-catalog');
const activities = new Map(catalog.map(row => [row.id, row]));
const uuid = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
const object = value => value && typeof value === 'object' && !Array.isArray(value);
const text = (value, max = 160) => typeof value === 'string' && value.trim().length > 0 && value.length <= max;

// One authenticated account, regardless of which roster table the school uses.
const STUDENT_SQL = `SELECT school_id, academic_year, grade, class_number, student_number, student_name
  FROM (SELECT s.school_id, s.academic_year, s.grade, s.class_number,
  s.student_number::TEXT, s.roster_name AS student_name, 0 AS roster_priority
  FROM school_students s JOIN classroom_schools sc ON sc.id = s.school_id AND sc.enabled = TRUE
  WHERE s.user_id = $1 OR (s.user_id IS NULL AND LOWER(s.student_email) = LOWER($2))
  UNION ALL SELECT c.school_id, c.academic_year, c.grade, c.class_number,
  s.student_number::TEXT, s.roster_name AS student_name, 1 AS roster_priority
  FROM classroom_students s JOIN classroom_classes c ON c.id = s.class_id
  JOIN classroom_schools sc ON sc.id = c.school_id AND sc.enabled = TRUE
  WHERE s.roster_active = TRUE AND (s.user_id = $1 OR (s.user_id IS NULL AND LOWER(s.student_email) = LOWER($2)))) memberships
  ORDER BY academic_year DESC, roster_priority, school_id, grade, class_number LIMIT 1`;

function summarize(events) {
  const answers = events.filter(e => e.kind === 'answer');
  const first = answers.filter(e => e.attempt_number === 1);
  const scored = first.filter(e => e.correct !== null);
  return {
    answered: new Set(answers.map(e => e.question_key)).size,
    firstCorrect: scored.filter(e => e.correct === true).length,
    firstScored: scored.length,
    retryCount: answers.filter(e => e.attempt_number > 1).length,
    solvedAfterRetry: new Set(answers.filter(e => e.attempt_number > 1 && e.correct === true).map(e => e.question_key)).size,
    hints: events.filter(e => e.kind === 'hint').length,
    readCount: new Set(events.filter(e => e.kind === 'read').map(e => e.question_key)).size,
    selfAssessments: events.filter(e => e.kind === 'self-assessment').length
  };
}

function createLearningRecords({ pool, requireUser, requireTeacher, requireDatabase, teacherRegistrations, HttpError, asyncRoute }) {
  const router = express.Router();
  const fail = (code, message, status = 400) => { throw new HttpError(status, code, message); };
  let mathAnswers;
  function grade(activity, event) {
    if (event.kind !== 'answer') return { correct: null, source: 'none' };
    if (activity === 'math-ox') {
      if (!mathAnswers) {
        const context = { window: {} };
        vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../learning/literacy-numeracy/math-ox/data.js'), 'utf8'), context, { timeout: 2000 });
        mathAnswers = new Map(context.window.MATH_OX_DATA.map(q => [String(q.id), q.answer]));
      }
      if (!mathAnswers.has(event.questionKey) || !['O', 'X'].includes(event.response)) fail('INVALID_ANSWER', '문항과 답을 확인해 주세요.');
      return { correct: mathAnswers.get(event.questionKey) === event.response, source: 'server' };
    }
    // Activity grading is retained as such; it is not a standardized diagnostic score.
    return { correct: typeof event.correct === 'boolean' ? event.correct : null,
      source: typeof event.correct === 'boolean' ? 'activity' : 'none' };
  }
  async function initialize() {
    if (pool) await pool.query(fs.readFileSync(path.join(__dirname, 'migrations/007-learning-records.sql'), 'utf8'));
  }
  async function student(req) {
    requireDatabase();
    const user = await requireUser(req);
    const membership = (await pool.query(STUDENT_SQL, [user.id, user.email])).rows[0];
    if (!membership) fail('STUDENT_REQUIRED', '학생 계정으로 로그인하면 학습 기록을 저장할 수 있어요.', 403);
    return { user, membership };
  }
  async function serialize(db, row, detail = false, range = null, providedEvents = null) {
    const args = [row.id];
    let filter = '';
    // Cast calendar dates to timestamp BEFORE AT TIME ZONE. A bare date takes
    // PostgreSQL's timestamptz overload and shifts the day in UTC DB sessions.
    if (range) { args.push(range.from, range.to); filter = " AND recorded_at >= $2::date::timestamp AT TIME ZONE 'Asia/Seoul' AND recorded_at < ($3::date + 1)::timestamp AT TIME ZONE 'Asia/Seoul'"; }
    const events = providedEvents || (await db.query('SELECT * FROM learning_record_events WHERE session_id = $1' + filter + ' ORDER BY id', args)).rows;
    return {
      id: row.id, activity: row.activity, domain: activities.get(row.activity)?.domain,
      contentKey: row.content_key, contentVersion: row.content_version, title: row.title, href: row.href,
      status: row.status, revision: row.revision,
      progress: { current: row.progress_current, total: row.progress_total },
      startedAt: row.started_at, updatedAt: row.updated_at, completedAt: row.completed_at,
      summary: summarize(events),
      ...(detail ? { checkpoint: row.checkpoint, events: events.map(e => ({
        id: String(e.id), kind: e.kind, questionKey: e.question_key, response: e.response, snapshot: e.snapshot,
        correct: e.correct, scoringSource: e.scoring_source, attemptNumber: e.attempt_number,
        durationMs: e.duration_ms, recordedAt: e.recorded_at
      })) } : {})
    };
  }
  function dateRange(query) {
    const today = new Date(Date.now() + 9 * 3600000).toISOString().slice(0, 10);
    const from = query.from || today, to = query.to || today;
    const valid = s => /^\d{4}-\d{2}-\d{2}$/.test(s) && Number.isFinite(Date.parse(s)) && new Date(s).toISOString().slice(0, 10) === s;
    if (!valid(from) || !valid(to) || from > to || (Date.parse(to) - Date.parse(from)) / 86400000 > 366) fail('INVALID_DATES', '조회 기간은 1년 이내로 선택해 주세요.');
    return { from, to };
  }
  router.use((_req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
  router.get('/context', asyncRoute(async (req, res) => {
    requireDatabase();
    const user = await requireUser(req);
    const membership = (await pool.query(STUDENT_SQL, [user.id, user.email])).rows[0];
    res.json({ catalog, mode: membership ? 'student' : 'preview', student: membership ? { name: membership.student_name } : null });
  }));
  router.get('/word-progress', asyncRoute(async (req, res) => {
    const { user } = await student(req);
    const activity = req.query.activity;
    if (!['vocabulary', 'classical-chinese-idioms'].includes(activity)) fail('INVALID_ACTIVITY', '활동을 확인해 주세요.');
    const rows = (await pool.query(`SELECT DISTINCT ON (e.question_key, e.kind) e.question_key, e.kind, e.response, e.correct, e.recorded_at
      FROM learning_record_events e JOIN learning_record_sessions s ON s.id=e.session_id
      WHERE s.user_id=$1 AND s.activity=$2 AND e.kind IN ('answer','self-assessment')
      ORDER BY e.question_key, e.kind, e.recorded_at DESC, e.id DESC`, [user.id, activity])).rows;
    res.json({ entries: rows.sort((a,b) => new Date(a.recorded_at)-new Date(b.recorded_at)) });
  }));
  router.post('/sessions', asyncRoute(async (req, res) => {
    const { user, membership: m } = await student(req);
    const b = req.body || {}, activity = activities.get(b.activity);
    if (!activity || !text(b.contentKey, 512) || !text(b.contentVersion, 80) || !text(b.title) || !text(b.href, 512)) fail('INVALID_SESSION', '학습 정보를 확인해 주세요.');
    const url = new URL(b.href, 'https://class.invalid');
    if (url.origin !== 'https://class.invalid' || !url.pathname.startsWith(activity.href) || /[\\\r\n]/.test(b.href)) fail('INVALID_LINK', '학습 주소가 올바르지 않습니다.');
    if (!object(b.checkpoint || {}) || JSON.stringify(b.checkpoint || {}).length > 256000) fail('INVALID_CHECKPOINT', '학습 진도 자료가 너무 큽니다.');
    const db = await pool.connect();
    try {
      await db.query('BEGIN');
      await db.query('SELECT id FROM classroom_users WHERE id = $1 FOR UPDATE', [user.id]);
      const existing = await db.query("SELECT * FROM learning_record_sessions WHERE user_id = $1 AND activity = $2 AND content_key = $3 AND content_version = $4 AND school_id=$5 AND academic_year=$6 AND grade=$7 AND class_number=$8 AND status = 'active'", [user.id, b.activity, b.contentKey, b.contentVersion, m.school_id, m.academic_year, m.grade, m.class_number]);
      let row = existing.rows[0];
      if (!row) row = (await db.query(`INSERT INTO learning_record_sessions
        (id, user_id, school_id, academic_year, grade, class_number, student_number, student_name, activity, content_key, content_version, title, href, checkpoint)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14::jsonb) RETURNING *`,
      [crypto.randomUUID(), user.id, m.school_id, m.academic_year, m.grade, m.class_number, m.student_number, m.student_name,
        b.activity, b.contentKey, b.contentVersion, b.title, b.href, JSON.stringify(b.checkpoint || {})])).rows[0];
      const session = await serialize(db, row, true);
      await db.query('COMMIT'); res.json({ session });
    } catch (error) { await db.query('ROLLBACK'); throw error; } finally { db.release(); }
  }));
  router.get('/sessions', asyncRoute(async (req, res) => {
    const { user } = await student(req);
    if (req.query.activity && !activities.has(req.query.activity)) fail('INVALID_ACTIVITY', '활동을 확인해 주세요.');
    const offset = Number(req.query.offset || 0);
    if (!Number.isInteger(offset) || offset < 0 || offset > 100000) fail('INVALID_PAGE', '조회 위치를 확인해 주세요.');
    const range = req.query.from || req.query.to ? dateRange(req.query) : null;
    const rows = (await pool.query(`SELECT * FROM learning_record_sessions WHERE user_id = $1
      AND ($2::text IS NULL OR activity = $2)
      AND ($3::date IS NULL OR updated_at >= $3::date::timestamp AT TIME ZONE 'Asia/Seoul')
      AND ($4::date IS NULL OR started_at < ($4::date + 1)::timestamp AT TIME ZONE 'Asia/Seoul')
      ORDER BY updated_at DESC, id LIMIT 51 OFFSET $5`, [user.id, req.query.activity || null, range?.from || null, range?.to || null, offset])).rows;
    const sessions = [];
    for (const row of rows.slice(0, 50)) sessions.push(await serialize(pool, row));
    res.json({ sessions, nextOffset: rows.length > 50 ? offset + 50 : null });
  }));
  router.get('/sessions/:id', asyncRoute(async (req, res) => {
    const { user } = await student(req);
    if (!uuid.test(req.params.id)) fail('NOT_FOUND', '학습 기록을 찾을 수 없어요.', 404);
    const row = (await pool.query('SELECT * FROM learning_record_sessions WHERE id = $1 AND user_id = $2', [req.params.id, user.id])).rows[0];
    if (!row) fail('NOT_FOUND', '학습 기록을 찾을 수 없어요.', 404);
    res.json({ session: await serialize(pool, row, true) });
  }));
  router.post('/sessions/:id/changes', asyncRoute(async (req, res) => {
    const { user, membership } = await student(req), b = req.body || {};
    if (!uuid.test(req.params.id) || !uuid.test(b.mutationId || '') || !Number.isInteger(b.revision) || b.revision < 0) fail('INVALID_CHANGE', '저장 요청을 확인해 주세요.');
    if (!object(b.checkpoint) || JSON.stringify(b.checkpoint).length > 256000 || !Array.isArray(b.events) || b.events.length > 100) fail('INVALID_CHANGE', '진도와 응답을 확인해 주세요.');
    if (b.complete !== undefined && typeof b.complete !== 'boolean') fail('INVALID_COMPLETE', '완료 상태를 확인해 주세요.');
    const p = b.progress;
    if (!object(p) || !Number.isInteger(p.current) || p.current < 0 || p.current > 100000 ||
      (p.total !== null && (!Number.isInteger(p.total) || p.total < p.current || p.total > 100000))) fail('INVALID_PROGRESS', '진행 수를 확인해 주세요.');
    for (const e of b.events) {
      if (!object(e) || !['answer', 'read', 'self-assessment', 'hint'].includes(e.kind) || !text(e.questionKey) || !object(e.snapshot || {}) ||
        JSON.stringify(e).length > 32000 || (e.durationMs != null && (!Number.isInteger(e.durationMs) || e.durationMs < 0 || e.durationMs > 1800000))) fail('INVALID_EVENT', '문항 응답을 확인해 주세요.');
    }
    const hash = crypto.createHash('sha256').update(JSON.stringify(b)).digest('hex');
    const db = await pool.connect();
    try {
      await db.query('BEGIN');
      const row = (await db.query('SELECT * FROM learning_record_sessions WHERE id = $1 AND user_id = $2 FOR UPDATE', [req.params.id, user.id])).rows[0];
      if (!row) fail('NOT_FOUND', '학습 기록을 찾을 수 없어요.', 404);
      if (['school_id','academic_year','grade','class_number'].some(k => String(row[k]) !== String(membership[k]))) fail('ROSTER_CHANGED', '학급이 변경되었어요. 현재 학급에서 새 학습을 시작해 주세요.', 409);
      const previous = (await db.query('SELECT payload_hash FROM learning_record_mutations WHERE session_id = $1 AND mutation_id = $2', [row.id, b.mutationId])).rows[0];
      if (previous) {
        if (previous.payload_hash !== hash) fail('MUTATION_REUSED', '이미 사용한 저장 요청입니다.', 409);
        const session = await serialize(db, row, true); await db.query('COMMIT'); return res.json({ session });
      }
      const reviewingBook = row.status === 'completed' && b.complete === true && ['korea-tales', 'world-tales', 'world-novels', 'poetry'].includes(row.activity);
      if (row.revision !== b.revision || (row.status !== 'active' && !reviewingBook)) fail('RECORD_CONFLICT', '다른 화면에서 진도가 바뀌었어요. 저장된 기록을 다시 불러와 주세요.', 409);
      for (const e of b.events) {
        const score = grade(row.activity, e);
        const attempt = (await db.query('SELECT COUNT(*)::int AS count FROM learning_record_events WHERE session_id = $1 AND question_key = $2 AND kind = $3', [row.id, e.questionKey, e.kind])).rows[0].count + 1;
        await db.query(`INSERT INTO learning_record_events(session_id, kind, question_key, response, snapshot, correct, scoring_source, attempt_number, duration_ms)
          VALUES ($1,$2,$3,$4::jsonb,$5::jsonb,$6,$7,$8,$9)`, [row.id, e.kind, e.questionKey, JSON.stringify(e.response ?? null), JSON.stringify(e.snapshot || {}), score.correct, score.source, attempt, e.durationMs ?? null]);
      }
      const updated = (await db.query(`UPDATE learning_record_sessions SET checkpoint = $2::jsonb, progress_current = $3,
        progress_total = $4, status = CASE WHEN $5 THEN 'completed' ELSE 'active' END,
        completed_at = CASE WHEN $5 THEN COALESCE(completed_at, NOW()) ELSE NULL END, revision = revision + 1, updated_at = NOW()
        WHERE id = $1 RETURNING *`, [row.id, JSON.stringify(b.checkpoint), p.current, p.total, Boolean(b.complete)])).rows[0];
      await db.query('INSERT INTO learning_record_mutations VALUES ($1,$2,$3)', [row.id, b.mutationId, hash]);
      const session = await serialize(db, updated, true); await db.query('COMMIT'); res.json({ session });
    } catch (error) { await db.query('ROLLBACK'); throw error; } finally { db.release(); }
  }));

  async function scopes(req) {
    requireDatabase();
    const user = await requireTeacher(req), registrations = await teacherRegistrations(user);
    const result = [];
    for (const t of registrations) {
      const schoolwide = ['관리자', '교장', '교감'].includes(t.teacher_type);
      const rows = (await pool.query(`SELECT DISTINCT school_id, academic_year, grade, class_number FROM (
        SELECT school_id, academic_year, grade, class_number FROM school_students
        UNION SELECT school_id, academic_year, grade, class_number FROM classroom_classes) c
        WHERE school_id = $1 AND ($2::int IS NULL OR academic_year = $2)
          AND ($3::int IS NULL OR grade = $3) AND ($4::int IS NULL OR class_number = $4)
        ORDER BY academic_year DESC, grade, class_number`, [t.school_id, t.academic_year || null, schoolwide ? null : t.grade || -1, schoolwide ? null : t.class_number || -1])).rows;
      for (const row of rows) {
        const id = [row.school_id, row.academic_year, row.grade, row.class_number].join(':');
        if (!result.some(x => x.id === id)) result.push({ id, label: `${t.school_name} ${row.academic_year} · ${row.grade}학년 ${row.class_number}반`, ...row });
      }
    }
    return result;
  }
  async function rosterForScope(scope) {
    return (await pool.query(`SELECT DISTINCT u.id::text AS user_id, s.student_number::text, s.roster_name AS student_name
      FROM school_students s LEFT JOIN classroom_users u ON u.id = s.user_id OR (s.user_id IS NULL AND LOWER(u.email) = LOWER(s.student_email))
      WHERE s.school_id = $1 AND s.academic_year = $2 AND s.grade = $3 AND s.class_number = $4
      UNION SELECT u.id::text, s.student_number::text, s.roster_name
      FROM classroom_students s JOIN classroom_classes c ON c.id = s.class_id
      LEFT JOIN classroom_users u ON u.id = s.user_id OR (s.user_id IS NULL AND LOWER(u.email) = LOWER(s.student_email))
      WHERE c.school_id = $1 AND c.academic_year = $2 AND c.grade = $3 AND c.class_number = $4 AND s.roster_active = TRUE`,
    [scope.school_id, scope.academic_year, scope.grade, scope.class_number])).rows;
  }
  async function currentStudentIds(scope, roster) {
    const candidates = [...new Set((roster || await rosterForScope(scope)).map(row => row.user_id).filter(Boolean))];
    if (!candidates.length) return [];
    // Use the very same membership choice as saving. An active but stale legacy
    // copy must not give a former teacher access to the pupil's new class work.
    const membership = STUDENT_SQL.replace(/\$1\b/g, 'u.id').replace(/\$2\b/g, 'u.email');
    return (await pool.query(`SELECT u.id::text AS user_id FROM classroom_users u
      CROSS JOIN LATERAL (${membership}) m
      WHERE u.id=ANY($5::bigint[]) AND m.school_id=$1 AND m.academic_year=$2 AND m.grade=$3 AND m.class_number=$4`,
    [scope.school_id, scope.academic_year, scope.grade, scope.class_number, candidates])).rows.map(row => row.user_id);
  }
  router.get('/teacher/classes', asyncRoute(async (req, res) => res.json({ classes: await scopes(req), catalog })));
  router.get('/teacher/report', asyncRoute(async (req, res) => {
    const scope = (await scopes(req)).find(s => s.id === req.query.classId);
    if (!scope) fail('CLASS_FORBIDDEN', '담당 학급의 기록만 볼 수 있어요.', 403);
    const range = dateRange(req.query);
    if (req.query.activity && !activities.has(req.query.activity)) fail('INVALID_ACTIVITY', '활동을 확인해 주세요.');
    const args = [scope.school_id, scope.academic_year, scope.grade, scope.class_number];
    const roster = await rosterForScope(scope);
    const studentIds = await currentStudentIds(scope, roster);
    // Current pupils' records remain readable when an old roster copy supplied
    // the stored class. The school and academic-year boundaries still apply.
    const rows = (await pool.query(`SELECT * FROM learning_record_sessions s WHERE school_id = $1 AND academic_year = $2
      AND ((grade = $3 AND class_number = $4) OR user_id = ANY($8::bigint[]))
      AND ($7::text IS NULL OR activity = $7)
      AND (EXISTS (SELECT 1 FROM learning_record_events e WHERE e.session_id = s.id
        AND e.recorded_at >= $5::date::timestamp AT TIME ZONE 'Asia/Seoul' AND e.recorded_at < ($6::date + 1)::timestamp AT TIME ZONE 'Asia/Seoul')
        OR s.updated_at >= $5::date::timestamp AT TIME ZONE 'Asia/Seoul' AND s.updated_at < ($6::date + 1)::timestamp AT TIME ZONE 'Asia/Seoul')
      ORDER BY updated_at DESC, id LIMIT 1001`, [...args, range.from, range.to, req.query.activity || null, studentIds])).rows;
    if (rows.length > 1000) fail('REPORT_TOO_LARGE', '기록이 많아요. 조회 기간이나 영역을 좁혀 주세요.');
    const eventGroups = new Map(rows.map(row => [row.id, []]));
    if (rows.length) {
      const events = (await pool.query(`SELECT session_id, kind, question_key, correct, attempt_number FROM learning_record_events
        WHERE session_id=ANY($1::uuid[]) AND recorded_at >= $2::date::timestamp AT TIME ZONE 'Asia/Seoul'
        AND recorded_at < ($3::date + 1)::timestamp AT TIME ZONE 'Asia/Seoul' ORDER BY id`, [rows.map(row => row.id), range.from, range.to])).rows;
      for (const event of events) eventGroups.get(event.session_id).push(event);
    }
    const sessions = [];
    for (const row of rows) sessions.push({ ...(await serialize(pool, row, false, range, eventGroups.get(row.id))), userId: String(row.user_id), studentNumber: row.student_number, studentName: row.student_name });
    res.json({ range, roster, sessions });
  }));
  router.get('/teacher/sessions/:id', asyncRoute(async (req, res) => {
    const allowed = await scopes(req);
    if (!uuid.test(req.params.id)) fail('NOT_FOUND', '학습 기록을 찾을 수 없어요.', 404);
    const row = (await pool.query('SELECT * FROM learning_record_sessions WHERE id = $1', [req.params.id])).rows[0];
    if (!row) fail('NOT_FOUND', '학습 기록을 찾을 수 없어요.', 404);
    let readable = allowed.some(s => s.id === [row.school_id, row.academic_year, row.grade, row.class_number].join(':'));
    if (!readable) {
      for (const scope of allowed.filter(s => String(s.school_id) === String(row.school_id) && s.academic_year === row.academic_year)) {
        if ((await currentStudentIds(scope)).includes(String(row.user_id))) {
          readable = true; break;
        }
      }
    }
    if (!readable) fail('NOT_FOUND', '학습 기록을 찾을 수 없어요.', 404);
    res.json({ session: await serialize(pool, row, true) });
  }));
  return { router, initialize };
}
module.exports = { createLearningRecords, summarize, STUDENT_SQL };
