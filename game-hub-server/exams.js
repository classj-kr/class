'use strict';
const express = require('express');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const uuid = () => crypto.randomUUID();
const hash = value => crypto.createHash('sha256').update(value).digest('hex');

function normalizeQuestions(input, { publish = false } = {}) {
  if (!Array.isArray(input) || input.length > 50 || (publish && !input.length)) throw new Error('문항은 1~50개여야 합니다.');
  const ids = new Set();
  return input.map((raw, index) => {
    const kind = raw?.kind;
    if (!['ox', 'choice', 'short'].includes(kind)) throw new Error(`${index + 1}번 문항 유형을 확인해 주세요.`);
    const content = String(raw.content || '').trim();
    if (!content || content.length > 2000) throw new Error(`${index + 1}번 문제 내용을 확인해 주세요.`);
    const choices = kind === 'short' ? [] : kind === 'ox' ? ['O', 'X'] : raw.choices;
    if (!Array.isArray(choices) || (kind !== 'short' && (choices.length < 2 || choices.length > 5)) || choices.some(v => !String(v || '').trim() || String(v).length > 300)) throw new Error(`${index + 1}번 보기를 확인해 주세요.`);
    const answer = kind === 'short'
      ? String(raw.answer ?? '').trim().slice(0, 200)
      : raw.answer === null || raw.answer === '' || raw.answer === undefined ? null : Number(raw.answer);
    if ((publish && (answer === null || answer === '')) || (kind !== 'short' && answer !== null && (!Number.isInteger(answer) || answer < 0 || answer >= choices.length))) throw new Error(`${index + 1}번 정답을 확인해 주세요.`);
    const aliases = kind === 'short' && Array.isArray(raw.aliases) ? raw.aliases.map(v => String(v || '').trim().slice(0, 200)).filter(Boolean).slice(0, 10) : [];
    const questionId = /^[a-f\d-]{36}$/i.test(raw.id || '') ? raw.id : uuid();
    if (ids.has(questionId)) throw new Error('문항 ID가 중복되었습니다.');
    ids.add(questionId);
    return { id: questionId, kind, content, choices: choices.map(v => String(v).trim()), answer, aliases,
      explanation: String(raw.explanation || '').trim().slice(0, 1000) };
  });
}

function matchesAnswer(question, answer) {
  if (question.kind !== 'short') return answer.choice === question.answer;
  const normalize = value => String(value ?? '').normalize('NFKC').toLocaleLowerCase('ko-KR').replace(/\s+/g, '').replace(/[.。]+$/g, '');
  const given = normalize(answer.response);
  return Boolean(given) && [question.answer, ...(question.aliases || [])].some(value => normalize(value) === given);
}

function createExams({ pool, sessionUser, requireTeacher, requireDatabase, HttpError, asyncRoute, allocateRoomCode, joinIdentity = async () => null, failureLimiter }) {
  const router = express.Router();
  const fail = (status, code, message) => { throw new HttpError(status, code, message); };
  const clean = (value, max, required = false) => {
    const s = String(value ?? '').trim();
    if (s.length > max || (required && !s)) fail(400, 'INVALID_INPUT', `최대 ${max}자까지 입력해 주세요.`);
    return s;
  };
  async function initialize() {
    if (pool) await pool.query(fs.readFileSync(path.join(__dirname, 'migrations/014-exams.sql'), 'utf8'));
  }
  async function exam(id, lock = false, db = pool) {
    const row = (await db.query(`SELECT * FROM classroom_exams WHERE id=$1${lock ? ' FOR UPDATE' : ''}`, [id])).rows[0];
    if (!row) fail(404, 'EXAM_NOT_FOUND', '시험을 찾을 수 없습니다.');
    return row;
  }
  async function owner(req, e) {
    const user = await requireTeacher(req);
    if (String(user.id) !== String(e.owner_id)) fail(403, 'OWNER_REQUIRED', '시험을 만든 선생님만 관리할 수 있습니다.');
    return user;
  }
  async function member(req, e, db = pool) {
    const user = await sessionUser(req);
    const token = String(req.headers.cookie || '').split(';').map(s => s.trim()).find(s => s.startsWith(`exam_${e.id}=`))?.split('=')[1] || '';
    const row = (await db.query(`SELECT * FROM classroom_exam_members WHERE exam_id=$1 AND
      ((user_id IS NOT NULL AND user_id=$2) OR (token_hash=$3 AND $3<>'')) LIMIT 1`,
      [e.id, user?.id || null, token ? hash(token) : ''])).rows[0];
    if (!row) fail(401, 'JOIN_REQUIRED', '방번호로 시험에 입장해 주세요.');
    return row;
  }
  const publicExam = e => ({ id: e.id, code: e.code.trim(), title: e.title, durationMinutes: e.duration_minutes,
    status: e.status, startedAt: e.started_at, deadline: e.started_at ? new Date(new Date(e.started_at).getTime() + e.duration_minutes * 60000).toISOString() : null });
  const active = e => e.status === 'open' && e.started_at && Date.now() < new Date(e.started_at).getTime() + e.duration_minutes * 60000;
  const studentQuestions = questions => questions.map(({ answer, aliases, explanation, ...q }) => q);
  router.use((_req, res, next) => { requireDatabase(); res.set('Cache-Control', 'no-store'); next(); });

  router.get('/mine', asyncRoute(async (req, res) => {
    const user = await requireTeacher(req);
    const rows = (await pool.query('SELECT * FROM classroom_exams WHERE owner_id=$1 ORDER BY created_at DESC', [user.id])).rows;
    res.json({ exams: rows.map(publicExam) });
  }));
  router.post('/', asyncRoute(async (req, res) => {
    const user = await requireTeacher(req);
    const title = clean(req.body?.title, 80, true);
    const duration = Number(req.body?.durationMinutes);
    if (!Number.isInteger(duration) || duration < 1 || duration > 180) fail(400, 'INVALID_DURATION', '제한시간은 1~180분으로 정해 주세요.');
    const db = await pool.connect();
    try {
      await db.query('BEGIN');
      const count = (await db.query('SELECT COUNT(*)::int AS count FROM classroom_exams WHERE owner_id=$1', [user.id])).rows[0].count;
      if (count >= 50) fail(409, 'EXAM_LIMIT', '시험은 50개까지 만들 수 있습니다.');
      const code = await allocateRoomCode(db);
      const id = uuid();
      await db.query('INSERT INTO classroom_exams(id,owner_id,code,title,duration_minutes) VALUES($1,$2,$3,$4,$5)', [id, user.id, code, title, duration]);
      await db.query('COMMIT');
      res.status(201).json({ id, code });
    } catch (error) { await db.query('ROLLBACK'); throw error; } finally { db.release(); }
  }));
  router.post('/join', asyncRoute(async (req, res) => {
    failureLimiter?.enforce(req, 'exam-join');
    const code = clean(req.body?.code, 4, true);
    if (!/^\d{4}$/.test(code)) fail(400, 'INVALID_CODE', '방번호 4자리를 입력해 주세요.');
    const user = await sessionUser(req);
    const identity = await joinIdentity(req, user);
    const name = clean(identity?.name || req.body?.name, 80, true);
    const number = Number(identity?.number || req.body?.number);
    if (!Number.isInteger(number) || number < 1 || number > 60) fail(400, 'INVALID_NUMBER', '학생 번호를 1~60 사이로 입력해 주세요.');
    const db = await pool.connect();
    try {
      await db.query('BEGIN');
      const e = (await db.query('SELECT * FROM classroom_exams WHERE code=$1 FOR UPDATE', [code])).rows[0];
      if (!e) { failureLimiter?.recordFailure(req, 'exam-join'); fail(404, 'EXAM_NOT_FOUND', '방번호를 확인해 주세요.'); }
      let m = user ? (await db.query('SELECT * FROM classroom_exam_members WHERE exam_id=$1 AND user_id=$2', [e.id, user.id])).rows[0] : null;
      const token = String(req.headers.cookie || '').split(';').map(s => s.trim()).find(s => s.startsWith(`exam_${e.id}=`))?.split('=')[1] || '';
      if (!m && token) m = (await db.query('SELECT * FROM classroom_exam_members WHERE exam_id=$1 AND token_hash=$2', [e.id, hash(token)])).rows[0];
      if (!m) {
        if (e.status === 'closed' || (e.status === 'open' && !active(e))) fail(403, 'EXAM_CLOSED', '시험이 종료되었습니다.');
        const fresh = crypto.randomBytes(32).toString('hex');
        const result = await db.query(`INSERT INTO classroom_exam_members(id,exam_id,number,name,user_id,token_hash)
          VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT(exam_id,number) DO NOTHING RETURNING *`,
          [uuid(), e.id, number, name, user?.id || null, hash(fresh)]);
        if (!result.rowCount) fail(409, 'NUMBER_TAKEN', '이미 참여한 번호입니다. 원래 기기로 접속해 주세요.');
        m = result.rows[0];
        res.cookie(`exam_${e.id}`, fresh, { httpOnly: true, sameSite: 'strict', secure: req.secure, path: '/api/exams', maxAge: 86400000 });
      }
      await db.query('COMMIT');
      res.json({ exam: publicExam(e), member: { number: m.number, name: m.name } });
    } catch (error) { await db.query('ROLLBACK'); throw error; } finally { db.release(); }
  }));
  router.get('/:id', asyncRoute(async (req, res) => {
    const e = await exam(req.params.id);
    const user = await sessionUser(req);
    const teacher = user && String(user.id) === String(e.owner_id);
    if (teacher) {
      await requireTeacher(req);
      const members = (await pool.query('SELECT id,number,name,submitted_at FROM classroom_exam_members WHERE exam_id=$1 ORDER BY number', [e.id])).rows;
      const answers = (await pool.query('SELECT member_id,question_id,choice,response FROM classroom_exam_answers WHERE exam_id=$1', [e.id])).rows;
      return res.json({ exam: publicExam(e), questions: e.questions, members: members.map(m => ({ number: m.number, name: m.name,
        submittedAt: m.submitted_at, score: e.questions.filter(q => answers.some(a => a.member_id === m.id && a.question_id === q.id && matchesAnswer(q, a))).length,
        answered: answers.filter(a => a.member_id === m.id).length })) });
    }
    const m = await member(req, e);
    const answers = (await pool.query('SELECT question_id,choice,response FROM classroom_exam_answers WHERE member_id=$1', [m.id])).rows;
    const scoreVisible = e.status !== 'draft' && (Boolean(m.submitted_at) || !active(e));
    const score = scoreVisible ? e.questions.filter(q => answers.some(a => a.question_id === q.id && matchesAnswer(q, a))).length : null;
    res.json({ exam: publicExam(e), member: { number: m.number, name: m.name, submittedAt: m.submitted_at }, score,
      questions: e.status === 'draft' ? [] : studentQuestions(e.questions), answers });
  }));
  router.put('/:id', asyncRoute(async (req, res) => {
    const e = await exam(req.params.id); await owner(req, e);
    let questions;
    try { questions = normalizeQuestions(req.body?.questions || []); } catch (error) { fail(400, 'INVALID_QUESTIONS', error.message); }
    const title = clean(req.body?.title, 80, true);
    const duration = Number(req.body?.durationMinutes);
    if (!Number.isInteger(duration) || duration < 1 || duration > 180) fail(400, 'INVALID_DURATION', '제한시간은 1~180분으로 정해 주세요.');
    const result = await pool.query(`UPDATE classroom_exams SET title=$2,duration_minutes=$3,questions=$4::jsonb WHERE id=$1 AND status='draft' RETURNING id`,
      [e.id, title, duration, JSON.stringify(questions)]);
    if (!result.rowCount) fail(409, 'EXAM_STARTED', '시작한 시험은 수정할 수 없습니다.');
    res.json({ questions });
  }));
  router.post('/:id/start', asyncRoute(async (req, res) => {
    const e = await exam(req.params.id); await owner(req, e);
    try { normalizeQuestions(e.questions, { publish: true }); } catch (error) { fail(400, 'INVALID_QUESTIONS', error.message); }
    const result = await pool.query(`UPDATE classroom_exams SET status='open',started_at=NOW() WHERE id=$1 AND status='draft' RETURNING *`, [e.id]);
    if (!result.rowCount) fail(409, 'EXAM_STARTED', '이미 시작한 시험입니다.');
    res.json({ exam: publicExam(result.rows[0]) });
  }));
  router.post('/:id/close', asyncRoute(async (req, res) => {
    const e = await exam(req.params.id); await owner(req, e);
    await pool.query(`UPDATE classroom_exams SET status='closed' WHERE id=$1 AND status='open'`, [e.id]);
    res.json({ ok: true });
  }));
  router.put('/:id/answers/:questionId', asyncRoute(async (req, res) => {
    const before = await exam(req.params.id);
    const authenticated = await member(req, before);
    const db = await pool.connect();
    try {
      await db.query('BEGIN');
      const e = await exam(req.params.id, true, db);
      const m = (await db.query('SELECT * FROM classroom_exam_members WHERE id=$1 AND exam_id=$2', [authenticated.id, e.id])).rows[0];
      if (!m) fail(401, 'JOIN_REQUIRED', '다시 입장해 주세요.');
      if (!active(e) || m.submitted_at) fail(403, 'TIME_OVER', '응시 시간이 끝났거나 제출했습니다.');
      const q = e.questions.find(q => q.id === req.params.questionId);
      if (!q) fail(404, 'QUESTION_NOT_FOUND', '문항을 찾을 수 없습니다.');
      const choice = q.kind === 'short' ? null : Number(req.body?.choice);
      const response = q.kind === 'short' ? clean(req.body?.response, 200) : null;
      if (q.kind !== 'short' && (!Number.isInteger(choice) || choice < 0 || choice >= q.choices.length)) fail(400, 'INVALID_ANSWER', '답안을 확인해 주세요.');
      if (q.kind === 'short' && !response) await db.query('DELETE FROM classroom_exam_answers WHERE member_id=$1 AND question_id=$2', [m.id, q.id]);
      else await db.query(`INSERT INTO classroom_exam_answers(exam_id,member_id,question_id,choice,response) VALUES($1,$2,$3,$4,$5)
        ON CONFLICT(member_id,question_id) DO UPDATE SET choice=EXCLUDED.choice,response=EXCLUDED.response,updated_at=NOW()`, [e.id, m.id, q.id, choice, response]);
      await db.query('COMMIT'); res.json({ ok: true });
    } catch (error) { await db.query('ROLLBACK'); throw error; } finally { db.release(); }
  }));
  router.post('/:id/submit', asyncRoute(async (req, res) => {
    const e = await exam(req.params.id); const m = await member(req, e);
    if (!active(e)) fail(403, 'TIME_OVER', e.status === 'draft' ? '아직 시험이 시작되지 않았습니다.' : '응시 시간이 끝났습니다.');
    await pool.query('UPDATE classroom_exam_members SET submitted_at=COALESCE(submitted_at,NOW()) WHERE id=$1', [m.id]);
    res.json({ ok: true });
  }));
  router.delete('/:id', asyncRoute(async (req, res) => {
    const e = await exam(req.params.id); await owner(req, e);
    await pool.query('DELETE FROM classroom_exams WHERE id=$1', [e.id]);
    res.json({ ok: true });
  }));
  return { router, initialize };
}

module.exports = { createExams, normalizeQuestions, matchesAnswer };
