'use strict';
const express = require('express');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const uuid = () => crypto.randomUUID();
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const MAX_AUDIO_BYTES = 40 * 1024 * 1024;
// ID3 태그로 시작하거나 MPEG 프레임 동기 비트로 시작하면 MP3로 본다.
const MAX_IMAGE_BYTES = 3 * 1024 * 1024;
const MAX_IMAGES_PER_EXAM = 120;
function imageType(data) {
  if (data.length > 12 && data.subarray(0, 4).toString('latin1') === 'RIFF' && data.subarray(8, 12).toString('latin1') === 'WEBP') return 'image/webp';
  if (data.length > 8 && data[0] === 0x89 && data.subarray(1, 4).toString('latin1') === 'PNG') return 'image/png';
  if (data.length > 3 && data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff) return 'image/jpeg';
  return null;
}
const isMp3 = data =>data.length > 4 && (data.subarray(0, 3).toString('latin1') === 'ID3' || (data[0] === 0xff && (data[1] & 0xe0) === 0xe0));

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
    const image = /^[a-f\d-]{36}$/i.test(raw.image || '') ? raw.image : null;
    // 시험지에 적힌 원래 문항 번호. 정답지와 번호로 맞출 때 쓴다.
    const number = Number.isInteger(Number(raw.number)) && Number(raw.number) >= 1 && Number(raw.number) <= 300 ? Number(raw.number) : null;
    return { id: questionId, kind, content, choices: choices.map(v => String(v).trim()), answer, aliases,
      explanation: String(raw.explanation || '').trim().slice(0, 1000), image, number };
  });
}

// AI가 알려 준 그림 위치. page는 1부터, box는 [ymin,xmin,ymax,xmax]를 0~1000으로 본 좌표.
function cleanFigure(figure) {
  const page = Number(figure?.page);
  const box = Array.isArray(figure?.box) ? figure.box.map(Number) : [];
  if (!Number.isInteger(page) || page < 1 || page > 500 || box.length !== 4 || box.some(v => !Number.isFinite(v))) return null;
  const [y0, x0, y1, x1] = box.map(v => Math.min(1000, Math.max(0, v)));
  if (y1 - y0 < 10 || x1 - x0 < 10) return null;
  return { page, box: [y0, x0, y1, x1] };
}

function matchesAnswer(question, answer) {
  if (question.kind !== 'short') return answer.choice === question.answer;
  const normalize = value => String(value ?? '').normalize('NFKC').toLocaleLowerCase('ko-KR').replace(/\s+/g, '').replace(/[.。]+$/g, '');
  const given = normalize(answer.response);
  return Boolean(given) && [question.answer, ...(question.aliases || [])].some(value => normalize(value) === given);
}

// teacherSchool(user) → { schoolId, name } | null. 같은 학교 교사는 서로의 시험을 보고 운영한다.
function createExams({ pool, sessionUser, requireTeacher, requireDatabase, HttpError, asyncRoute, allocateRoomCode, joinIdentity = async () => null, teacherSchool = async () => null, failureLimiter }) {
  const router = express.Router();
  const fail = (status, code, message) => { throw new HttpError(status, code, message); };
  const clean = (value, max, required = false) => {
    const s = String(value ?? '').trim();
    if (s.length > max || (required && !s)) fail(400, 'INVALID_INPUT', `최대 ${max}자까지 입력해 주세요.`);
    return s;
  };
  async function initialize() {
    if (!pool) return;
    for (const file of ['014-exams.sql', '015-exam-school.sql', '016-exam-audio.sql', '017-exam-images.sql', '018-exam-member-start.sql', '019-exam-member-number.sql']) await pool.query(fs.readFileSync(path.join(__dirname, 'migrations', file), 'utf8'));
  }
  async function exam(id, lock = false, db = pool) {
    const row = (await db.query(`SELECT * FROM classroom_exams WHERE id=$1${lock ? ' FOR UPDATE' : ''}`, [id])).rows[0];
    if (!row) fail(404, 'EXAM_NOT_FOUND', '시험을 찾을 수 없습니다.');
    return row;
  }
  const sameSchool = (school, e) => Boolean(school?.schoolId && e.school_id && String(school.schoolId) === String(e.school_id));
  // 만든 교사와 같은 학교 교사 모두 운영할 수 있다. 삭제는 만든 교사만 한다.
  async function manager(req, e, { ownerOnly = false } = {}) {
    const user = await requireTeacher(req);
    const isOwner = String(user.id) === String(e.owner_id);
    if (ownerOnly && !isOwner) fail(403, 'OWNER_REQUIRED', '시험을 만든 선생님만 삭제할 수 있습니다.');
    if (!isOwner && !sameSchool(await teacherSchool(user), e)) fail(403, 'SCHOOL_REQUIRED', '같은 학교 선생님만 관리할 수 있습니다.');
    return user;
  }
  async function member(req, e, db = pool) {
    const user = await sessionUser(req);
    const row = user ? (await db.query('SELECT * FROM classroom_exam_members WHERE exam_id=$1 AND user_id=$2', [e.id, user.id])).rows[0] : null;
    if (!row) fail(401, 'JOIN_REQUIRED', '방번호로 시험에 입장해 주세요.');
    return row;
  }
  // 교사가 시작 버튼을 누르지 않는다. 모든 문항에 정답이 있으면 응시할 수 있고(ready),
  // 학생이 처음 시작하면 시험이 open이 되어 문항이 잠긴다. 제한시간은 학생마다 자기가 시작한 때부터 잰다.
  const ready = e => { try { normalizeQuestions(e.questions, { publish: true }); return true; } catch (_) { return false; } };
  const publicExam = e => ({ id: e.id, code: e.code.trim(), title: e.title, durationMinutes: e.duration_minutes,
    status: e.status, ready: e.status !== 'closed' && ready(e), startedAt: e.started_at, ownerName: e.owner_name || '',
    hasAudio: Boolean(e.audio_bytes), audioVersion: e.audio_bytes || 0 });
  const deadlineOf = (e, m) => m.started_at ? new Date(new Date(m.started_at).getTime() + e.duration_minutes * 60000) : null;
  const active = (e, m) => e.status === 'open' && Boolean(m.started_at) && !m.submitted_at && Date.now() < deadlineOf(e, m).getTime();
  const publicMember = (e, m) => ({ number: m.number, name: m.name, grade: m.grade, classNumber: m.class_number,
    startedAt: m.started_at, submittedAt: m.submitted_at, deadline: deadlineOf(e, m)?.toISOString() || null });
  const studentQuestions = questions => questions.map(({ answer, aliases, explanation, ...q }) => q);
  router.use((_req, res, next) => { requireDatabase(); res.set('Cache-Control', 'no-store'); next(); });

  router.get('/mine', asyncRoute(async (req, res) => {
    const user = await requireTeacher(req);
    const school = await teacherSchool(user);
    const rows = (await pool.query(`SELECT * FROM classroom_exams WHERE owner_id=$1 OR (school_id IS NOT NULL AND school_id=$2)
      ORDER BY created_at DESC LIMIT 500`, [user.id, school?.schoolId || null])).rows;
    res.json({ exams: rows.map(e => ({ ...publicExam(e), mine: String(e.owner_id) === String(user.id),
      questionCount: Array.isArray(e.questions) ? e.questions.length : 0 })) });
  }));
  router.post('/', asyncRoute(async (req, res) => {
    const user = await requireTeacher(req);
    const school = await teacherSchool(user);
    const title = clean(req.body?.title, 80, true);
    const duration = Number(req.body?.durationMinutes);
    if (!Number.isInteger(duration) || duration < 1 || duration > 180) fail(400, 'INVALID_DURATION', '제한시간은 1~180분으로 정해 주세요.');
    const db = await pool.connect();
    try {
      await db.query('BEGIN');
      const count = (await db.query('SELECT COUNT(*)::int AS count FROM classroom_exams WHERE owner_id=$1', [user.id])).rows[0].count;
      if (count >= 100) fail(409, 'EXAM_LIMIT', '시험은 100개까지 만들 수 있습니다. 끝난 시험을 정리해 주세요.');
      const code = await allocateRoomCode(db);
      const id = uuid();
      await db.query('INSERT INTO classroom_exams(id,owner_id,code,title,duration_minutes,school_id,owner_name) VALUES($1,$2,$3,$4,$5,$6,$7)',
        [id, user.id, code, title, duration, school?.schoolId || null, school?.name || user.name || null]);
      await db.query('COMMIT');
      res.status(201).json({ id, code });
    } catch (error) { await db.query('ROLLBACK'); throw error; } finally { db.release(); }
  }));
  router.post('/join', asyncRoute(async (req, res) => {
    failureLimiter?.enforce(req, 'exam-join');
    const code = clean(req.body?.code, 4, true);
    if (!/^\d{4}$/.test(code)) fail(400, 'INVALID_CODE', '방번호 4자리를 입력해 주세요.');
    const user = await sessionUser(req);
    // 같은 학교 교사가 방번호를 넣으면 응시하지 않고 관리 화면으로 보낸다.
    if (user) {
      const school = await teacherSchool(user);
      const found = school ? (await pool.query('SELECT * FROM classroom_exams WHERE code=$1', [code])).rows[0] : null;
      if (found && (String(found.owner_id) === String(user.id) || sameSchool(school, found))) return res.json({ exam: publicExam(found), teacher: true });
    }
    // 사이트는 로그인해야 들어온다. 학생은 등록된 이름·학년·반·번호로 입장한다.
    if (!user) fail(401, 'AUTH_REQUIRED', '로그인해 주세요.');
    const identity = await joinIdentity(req, user);
    const number = Number(identity?.number);
    if (!Number.isInteger(number) || number < 1 || number > 999) fail(403, 'STUDENT_REGISTRATION_REQUIRED', '학생 등록 정보가 없어 입장할 수 없습니다. 담임 선생님께 알려 주세요.');
    const name = clean(identity.name, 80, true);
    const seat = (value, max) => { const n = Number(value); return Number.isInteger(n) && n >= 1 && n <= max ? n : null; };
    const grade = seat(identity.grade, 12);
    const classNumber = seat(identity.classNumber, 30);
    const db = await pool.connect();
    try {
      await db.query('BEGIN');
      const e = (await db.query('SELECT * FROM classroom_exams WHERE code=$1 FOR UPDATE', [code])).rows[0];
      if (!e) { failureLimiter?.recordFailure(req, 'exam-join'); fail(404, 'EXAM_NOT_FOUND', '방번호를 확인해 주세요.'); }
      let m = (await db.query('SELECT * FROM classroom_exam_members WHERE exam_id=$1 AND user_id=$2', [e.id, user.id])).rows[0];
      if (!m) {
        if (e.status === 'closed') fail(403, 'EXAM_CLOSED', '응시가 마감된 시험입니다.');
        const result = await db.query(`INSERT INTO classroom_exam_members(id,exam_id,number,name,user_id,token_hash,grade,class_number)
          VALUES($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT DO NOTHING RETURNING *`,
          [uuid(), e.id, number, name, user.id, hash(crypto.randomBytes(32).toString('hex')), grade, classNumber]);
        if (!result.rowCount) fail(409, 'NUMBER_TAKEN', '같은 학년·반·번호로 이미 입장한 학생이 있습니다. 담임 선생님께 알려 주세요.');
        m = result.rows[0];
      }
      await db.query('COMMIT');
      res.json({ exam: publicExam(e), member: publicMember(e, m) });
    } catch (error) { await db.query('ROLLBACK'); throw error; } finally { db.release(); }
  }));
  router.get('/:id', asyncRoute(async (req, res) => {
    const e = await exam(req.params.id);
    const user = await sessionUser(req);
    const isOwner = user && String(user.id) === String(e.owner_id);
    const teacher = isOwner || (user && req.query.mode === 'teacher' && sameSchool(await teacherSchool(user), e));
    if (teacher) {
      await requireTeacher(req);
      const members = (await pool.query(`SELECT * FROM classroom_exam_members WHERE exam_id=$1
        ORDER BY grade NULLS FIRST, class_number NULLS FIRST, number`, [e.id])).rows;
      const answers = (await pool.query('SELECT member_id,question_id,choice,response FROM classroom_exam_answers WHERE exam_id=$1', [e.id])).rows;
      // 학생마다 문항별로 무엇을 답했고 맞았는지 함께 보낸다(학생을 눌러 틀린 문항을 본다).
      return res.json({ exam: { ...publicExam(e), mine: Boolean(isOwner) }, questions: e.questions, members: members.map(m => {
        const mine = answers.filter(a => a.member_id === m.id);
        const marked = e.questions.map(q => { const a = mine.find(x => x.question_id === q.id); return { questionId: q.id, choice: a?.choice ?? null, response: a?.response ?? null, correct: Boolean(a && matchesAnswer(q, a)) }; });
        return { ...publicMember(e, m), score: marked.filter(a => a.correct).length, answered: mine.length, answers: marked };
      }) });
    }
    const m = await member(req, e);
    const answers = (await pool.query('SELECT question_id,choice,response FROM classroom_exam_answers WHERE member_id=$1', [m.id])).rows;
    // 문항과 점수는 자기가 시작한 뒤에만 보인다. 점수는 제출했거나 시간이 끝났거나 마감된 뒤에 보인다.
    const started = Boolean(m.started_at) && e.status !== 'draft';
    const score = started && !active(e, m) ? e.questions.filter(q => answers.some(a => a.question_id === q.id && matchesAnswer(q, a))).length : null;
    res.json({ exam: publicExam(e), member: publicMember(e, m), score,
      questions: started ? studentQuestions(e.questions) : [], questionCount: e.questions.length, answers });
  }));
  router.put('/:id', asyncRoute(async (req, res) => {
    const e = await exam(req.params.id); await manager(req, e);
    let questions;
    try { questions = normalizeQuestions(req.body?.questions || []); } catch (error) { fail(400, 'INVALID_QUESTIONS', error.message); }
    const title = clean(req.body?.title, 80, true);
    const duration = Number(req.body?.durationMinutes);
    if (!Number.isInteger(duration) || duration < 1 || duration > 180) fail(400, 'INVALID_DURATION', '제한시간은 1~180분으로 정해 주세요.');
    const result = await pool.query(`UPDATE classroom_exams SET title=$2,duration_minutes=$3,questions=$4::jsonb WHERE id=$1 AND status='draft' RETURNING id`,
      [e.id, title, duration, JSON.stringify(questions)]);
    if (!result.rowCount) fail(409, 'EXAM_STARTED', '학생이 이미 시작한 시험은 수정할 수 없습니다.');
    // 어느 문항에서도 쓰지 않는 그림은 지운다.
    const used = questions.map(q => q.image).filter(Boolean);
    await pool.query('DELETE FROM classroom_exam_images WHERE exam_id=$1 AND NOT (id = ANY($2::text[]))', [e.id, used]);
    res.json({ questions });
  }));
  // 학생이 "시작"을 누른다. 그때부터 그 학생의 제한시간이 흐르고, 처음 시작한 학생이 있으면 문항이 잠긴다.
  router.post('/:id/begin', asyncRoute(async (req, res) => {
    const before = await exam(req.params.id);
    const authenticated = await member(req, before);
    const db = await pool.connect();
    try {
      await db.query('BEGIN');
      const e = await exam(req.params.id, true, db);
      if (e.status === 'closed') fail(403, 'EXAM_CLOSED', '응시가 마감된 시험입니다.');
      if (e.status === 'draft') {
        if (!ready(e)) fail(409, 'EXAM_NOT_READY', '아직 준비 중인 시험입니다. 잠시 뒤에 다시 시도해 주세요.');
        await db.query(`UPDATE classroom_exams SET status='open',started_at=NOW() WHERE id=$1`, [e.id]);
        e.status = 'open';
      }
      const m = (await db.query('UPDATE classroom_exam_members SET started_at=COALESCE(started_at,NOW()) WHERE id=$1 RETURNING *', [authenticated.id])).rows[0];
      await db.query('COMMIT');
      res.json({ member: publicMember(e, m) });
    } catch (error) { await db.query('ROLLBACK'); throw error; } finally { db.release(); }
  }));
  // 더 받지 않을 때 마감한다. 시작하지 않은 학생은 들어올 수 없고, 응시 중인 학생도 더 답할 수 없다.
  router.post('/:id/close', asyncRoute(async (req, res) => {
    const e = await exam(req.params.id); await manager(req, e);
    await pool.query(`UPDATE classroom_exams SET status='closed' WHERE id=$1`, [e.id]);
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
      if (!active(e, m)) fail(403, 'TIME_OVER', m.started_at ? '응시 시간이 끝났거나 제출했습니다.' : '먼저 시작을 눌러 주세요.');
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
    if (m.submitted_at) return res.json({ ok: true });
    if (!active(e, m)) fail(403, 'TIME_OVER', m.started_at ? '응시 시간이 끝났습니다.' : '먼저 시작을 눌러 주세요.');
    await pool.query('UPDATE classroom_exam_members SET submitted_at=COALESCE(submitted_at,NOW()) WHERE id=$1', [m.id]);
    res.json({ ok: true });
  }));
  // 음원·그림은 같은 학교 교사가 언제나, 학생은 자기가 시작한 뒤에 본다.
  async function viewer(req, e) {
    const user = await sessionUser(req);
    if (user && (String(user.id) === String(e.owner_id) || sameSchool(await teacherSchool(user), e))) return;
    const m = await member(req, e);
    if (e.status === 'draft' || !m.started_at) fail(403, 'EXAM_NOT_STARTED', '시작을 누르면 볼 수 있습니다.');
  }
  // 문항 그림. 올리면 id를 돌려주고, 문항의 image 칸에 그 id를 넣어 저장한다.
  router.post('/:id/images', express.raw({ type: () => true, limit: MAX_IMAGE_BYTES }), asyncRoute(async (req, res) => {
    const e = await exam(req.params.id); await manager(req, e);
    if (e.status !== 'draft') fail(409, 'EXAM_STARTED', '시작한 시험은 수정할 수 없습니다.');
    const mime = Buffer.isBuffer(req.body) ? imageType(req.body) : null;
    if (!mime) fail(400, 'INVALID_IMAGE', 'WebP·PNG·JPG 그림만 올릴 수 있습니다.');
    const count = (await pool.query('SELECT COUNT(*)::int AS count FROM classroom_exam_images WHERE exam_id=$1', [e.id])).rows[0].count;
    if (count >= MAX_IMAGES_PER_EXAM) fail(409, 'IMAGE_LIMIT', `그림은 시험당 ${MAX_IMAGES_PER_EXAM}개까지 넣을 수 있습니다.`);
    const id = uuid();
    await pool.query('INSERT INTO classroom_exam_images(id,exam_id,mime,data) VALUES($1,$2,$3,$4)', [id, e.id, mime, req.body]);
    res.status(201).json({ id });
  }));
  router.get('/:id/images/:imageId', asyncRoute(async (req, res) => {
    const e = await exam(req.params.id);
    await viewer(req, e);
    const row = (await pool.query('SELECT mime,data FROM classroom_exam_images WHERE id=$1 AND exam_id=$2', [req.params.imageId, e.id])).rows[0];
    if (!row) fail(404, 'IMAGE_NOT_FOUND', '그림을 찾을 수 없습니다.');
    // id마다 내용이 바뀌지 않으므로 기기에 저장해 두고 다시 받지 않는다.
    res.set({ 'Content-Type': row.mime, 'Cache-Control': 'private, max-age=86400, immutable' }).end(Buffer.from(row.data));
  }));
  // 듣기 음원. 시험당 MP3 하나를 준비 중에만 바꾼다. 학생은 시험이 열린 뒤 자유롭게 듣는다.
  router.put('/:id/audio', express.raw({ type: () => true, limit: MAX_AUDIO_BYTES }), asyncRoute(async (req, res) => {
    const e = await exam(req.params.id); await manager(req, e);
    const data = req.body;
    if (!Buffer.isBuffer(data) || !isMp3(data)) fail(400, 'INVALID_AUDIO', 'MP3 파일만 올릴 수 있습니다.');
    let fileName = 'audio.mp3';
    try { fileName = decodeURIComponent(String(req.headers['x-file-name'] || fileName)).slice(0, 120) || fileName; } catch (_) {}
    const db = await pool.connect();
    try {
      await db.query('BEGIN');
      const locked = await exam(e.id, true, db);
      if (locked.status !== 'draft') fail(409, 'EXAM_STARTED', '시작한 시험은 음원을 바꿀 수 없습니다.');
      await db.query(`INSERT INTO classroom_exam_audio(exam_id,file_name,data) VALUES($1,$2,$3)
        ON CONFLICT(exam_id) DO UPDATE SET file_name=EXCLUDED.file_name,data=EXCLUDED.data,updated_at=NOW()`, [e.id, fileName, data]);
      await db.query('UPDATE classroom_exams SET audio_bytes=$2 WHERE id=$1', [e.id, data.length]);
      await db.query('COMMIT');
      res.json({ ok: true, bytes: data.length });
    } catch (error) { await db.query('ROLLBACK'); throw error; } finally { db.release(); }
  }));
  router.delete('/:id/audio', asyncRoute(async (req, res) => {
    const e = await exam(req.params.id); await manager(req, e);
    if (e.status !== 'draft') fail(409, 'EXAM_STARTED', '시작한 시험은 음원을 바꿀 수 없습니다.');
    await pool.query('DELETE FROM classroom_exam_audio WHERE exam_id=$1', [e.id]);
    await pool.query('UPDATE classroom_exams SET audio_bytes=NULL WHERE id=$1', [e.id]);
    res.json({ ok: true });
  }));
  // 재생 위치 이동이 되도록 Range 요청에 필요한 부분만 읽어 보낸다.
  router.get('/:id/audio', asyncRoute(async (req, res) => {
    const e = await exam(req.params.id);
    await viewer(req, e);
    const size = Number(e.audio_bytes) || 0;
    if (!size) fail(404, 'AUDIO_NOT_FOUND', '듣기 음원이 없습니다.');
    let start = 0, end = size - 1;
    const range = /^bytes=(\d*)-(\d*)$/.exec(String(req.headers.range || ''));
    if (range && (range[1] || range[2])) {
      if (range[1]) { start = Number(range[1]); if (range[2]) end = Math.min(Number(range[2]), size - 1); }
      else start = Math.max(0, size - Number(range[2]));
      if (start > end || start >= size) { res.set('Content-Range', `bytes */${size}`); return res.status(416).end(); }
    }
    const row = (await pool.query('SELECT substring(data FROM $2 FOR $3) AS part FROM classroom_exam_audio WHERE exam_id=$1', [e.id, start + 1, end - start + 1])).rows[0];
    if (!row) fail(404, 'AUDIO_NOT_FOUND', '듣기 음원이 없습니다.');
    res.set({ 'Content-Type': 'audio/mpeg', 'Accept-Ranges': 'bytes', 'Content-Length': String(row.part.length) });
    if (range && (range[1] || range[2])) res.status(206).set('Content-Range', `bytes ${start}-${end}/${size}`);
    res.end(row.part);
  }));
  router.delete('/:id', asyncRoute(async (req, res) => {
    const e = await exam(req.params.id); await manager(req, e, { ownerOnly: true });
    await pool.query('DELETE FROM classroom_exams WHERE id=$1', [e.id]);
    res.json({ ok: true });
  }));
  return { router, initialize };
}

module.exports = { createExams, normalizeQuestions, matchesAnswer, cleanFigure };
