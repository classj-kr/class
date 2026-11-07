'use strict';
// 학교 공용 채팅. 학교마다 방 하나, 같은 학교 학생·교사만 들어온다(게스트 제외).
// 말한 그대로 저장하고(욕설 걸러 내기 없음) 보존한 줄 말고는 3일 뒤 지운다.
// 학교 이름은 방을 가르는 열쇠로만 쓰고 화면에는 내보내지 않는다.
const express = require('express');
const fs = require('node:fs');
const path = require('node:path');

const MAX_BODY = 200;
const KEEP_DAYS = 3;
const MAX_PER_SCHOOL = 5000;
const RECENT_FOR_NEWCOMER = 50;
const TEACHER_VIEW_LIMIT = 300;
const MIN_GAP_MS = 1500;          // 한 사람이 연달아 보낼 때 최소 간격
const BURST_WINDOW_MS = 10000;
const BURST_MAX = 5;              // 10초에 다섯 번까지

function createSchoolChat({ pool, requireUser, requireTeacher, requireDatabase, studentMembership, teacherRegistration, signTicket, HttpError, asyncRoute }) {
  const router = express.Router();
  const fail = (status, code, message) => { throw new HttpError(status, code, message); };
  const listeners = new Set();
  const recentSends = new Map();   // userId -> 보낸 시각 목록
  let postsSinceCleanup = 0;

  function emit(schoolKey, event) { for (const listener of listeners) listener(schoolKey, event); }

  async function initialize() {
    if (!pool) return;
    await pool.query(fs.readFileSync(path.join(__dirname, 'migrations/024-school-chat.sql'), 'utf8'));
    await cleanup();
  }

  async function cleanup() {
    if (!pool) return;
    await pool.query(
      `DELETE FROM school_chat_messages WHERE preserved = FALSE AND created_at < NOW() - INTERVAL '${KEEP_DAYS} days'`
    );
    // 학교마다 상한을 넘으면 오래된 것부터(보존 제외) 지운다.
    await pool.query(
      `DELETE FROM school_chat_messages m USING (
         SELECT id FROM (
           SELECT id, ROW_NUMBER() OVER (PARTITION BY school_key ORDER BY id DESC) AS n
           FROM school_chat_messages WHERE preserved = FALSE
         ) ranked WHERE n > $1
       ) old WHERE m.id = old.id`,
      [MAX_PER_SCHOOL]
    );
    await pool.query('DELETE FROM school_chat_mutes WHERE until < NOW()');
  }

  function publicMessage(row) {
    return {
      id: String(row.id),
      userId: row.user_id,
      name: row.sender_name,
      role: row.sender_role,
      grade: row.grade,
      classNumber: row.class_number,
      text: row.body,
      at: row.created_at instanceof Date ? row.created_at.getTime() : new Date(row.created_at).getTime()
    };
  }

  // 로그인한 학생·교사의 학교와 이름. 게스트는 학교가 없어 들어올 수 없다.
  async function identityFor(req) {
    const user = await requireUser(req);
    if (user.role === 'student') {
      const membership = await studentMembership(user.id);
      if (!membership) fail(403, 'CLASS_MEMBERSHIP_REQUIRED', '학급에 먼저 가입해야 채팅에 들어갈 수 있습니다.');
      return {
        userId: String(user.id), name: membership.name, role: 'student',
        schoolKey: String(membership.schoolName), grade: membership.grade || null, classNumber: membership.classNumber || null
      };
    }
    const registration = await teacherRegistration(user);
    if (!registration) fail(403, 'SCHOOL_MEMBER_REQUIRED', '이 채팅은 학교 학생과 교사만 쓸 수 있습니다.');
    return {
      userId: String(user.id), name: registration.teacher_name, role: 'teacher',
      schoolKey: String(registration.school_name), grade: registration.grade || null, classNumber: registration.class_number || null
    };
  }

  function normalizeText(value) {
    return String(value || '').replace(/[\r\n\t]+/g, ' ').replace(/\s{2,}/g, ' ').trim().slice(0, MAX_BODY);
  }

  function allowedNow(userId) {
    const now = Date.now();
    const times = (recentSends.get(userId) || []).filter((time) => now - time < BURST_WINDOW_MS);
    if (times.length && now - times[times.length - 1] < MIN_GAP_MS) return false;
    if (times.length >= BURST_MAX) return false;
    times.push(now);
    recentSends.set(userId, times);
    return true;
  }

  async function isMuted(schoolKey, userId) {
    const result = await pool.query(
      'SELECT 1 FROM school_chat_mutes WHERE school_key = $1 AND user_id = $2 AND until > NOW()',
      [schoolKey, userId]
    );
    return result.rowCount > 0;
  }

  // 말한 그대로 저장한다. 걸러 내거나 바꾸지 않는다.
  async function post(identity, rawText) {
    if (!pool) return { ok: false, reason: 'NO_DATABASE' };
    const text = normalizeText(rawText);
    if (!text) return { ok: false, reason: 'EMPTY' };
    if (identity.role !== 'teacher' && await isMuted(identity.schoolKey, identity.userId)) return { ok: false, reason: 'MUTED' };
    if (!allowedNow(identity.userId)) return { ok: false, reason: 'TOO_FAST' };
    const result = await pool.query(
      `INSERT INTO school_chat_messages (school_key, user_id, sender_name, sender_role, grade, class_number, body)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [identity.schoolKey, identity.userId, identity.name, identity.role, identity.grade, identity.classNumber, text]
    );
    postsSinceCleanup += 1;
    if (postsSinceCleanup >= 100) { postsSinceCleanup = 0; cleanup().catch(() => {}); }
    const message = publicMessage(result.rows[0]);
    emit(identity.schoolKey, { type: 'message', message });
    return { ok: true, message };
  }

  async function recent(schoolKey, limit = RECENT_FOR_NEWCOMER) {
    if (!pool) return [];
    const result = await pool.query(
      `SELECT * FROM (
         SELECT * FROM school_chat_messages WHERE school_key = $1 AND deleted_at IS NULL ORDER BY id DESC LIMIT $2
       ) latest ORDER BY id ASC`,
      [schoolKey, limit]
    );
    return result.rows.map(publicMessage);
  }

  // 서버가 서명한 입장권. 방은 입장권 안의 학교로 정해져서 다른 학교 방에는 못 들어간다.
  router.get('/ticket', asyncRoute(async (req, res) => {
    requireDatabase();
    const identity = await identityFor(req);
    const expiresAt = Date.now() + 10 * 60 * 1000;
    const ticket = signTicket({ kind: 'school-chat', exp: expiresAt, ...identity });
    res.setHeader('Cache-Control', 'no-store');
    res.json({ ticket, expiresAt, me: { userId: identity.userId, name: identity.name, role: identity.role } });
  }));

  async function teacherSchool(req) {
    const user = await requireTeacher(req);
    const registration = await teacherRegistration(user);
    return { user, schoolKey: String(registration.school_name) };
  }

  // 선생님: 최근 대화(지운 줄도 보인다)
  router.get('/teacher/messages', asyncRoute(async (req, res) => {
    requireDatabase();
    const { schoolKey } = await teacherSchool(req);
    const result = await pool.query(
      `SELECT * FROM (
         SELECT * FROM school_chat_messages WHERE school_key = $1 ORDER BY id DESC LIMIT $2
       ) latest ORDER BY id ASC`,
      [schoolKey, TEACHER_VIEW_LIMIT]
    );
    res.setHeader('Cache-Control', 'no-store');
    res.json({
      messages: result.rows.map((row) => ({ ...publicMessage(row), preserved: row.preserved, deleted: Boolean(row.deleted_at) }))
    });
  }));

  router.post('/teacher/messages/:id/preserve', asyncRoute(async (req, res) => {
    requireDatabase();
    const { schoolKey } = await teacherSchool(req);
    const keep = req.body?.preserved !== false;
    const result = await pool.query(
      'UPDATE school_chat_messages SET preserved = $3 WHERE id = $1 AND school_key = $2',
      [req.params.id, schoolKey, keep]
    );
    if (!result.rowCount) fail(404, 'MESSAGE_NOT_FOUND', '메시지를 찾지 못했습니다.');
    res.json({ ok: true });
  }));

  // 지워도 줄은 남는다(선생님 화면에는 계속 보인다). 학생 화면에서만 사라진다.
  router.post('/teacher/messages/:id/delete', asyncRoute(async (req, res) => {
    requireDatabase();
    const { schoolKey } = await teacherSchool(req);
    const result = await pool.query(
      'UPDATE school_chat_messages SET deleted_at = NOW() WHERE id = $1 AND school_key = $2 AND deleted_at IS NULL',
      [req.params.id, schoolKey]
    );
    if (!result.rowCount) fail(404, 'MESSAGE_NOT_FOUND', '메시지를 찾지 못했습니다.');
    emit(schoolKey, { type: 'deleted', id: String(req.params.id) });
    res.json({ ok: true });
  }));

  router.post('/teacher/mute', asyncRoute(async (req, res) => {
    requireDatabase();
    const { user, schoolKey } = await teacherSchool(req);
    const targetId = String(req.body?.userId || '');
    const minutes = Math.max(1, Math.min(60 * 24 * 7, Number(req.body?.minutes) || 10));
    if (!targetId) fail(400, 'USER_REQUIRED', '막을 학생을 고르세요.');
    await pool.query(
      `INSERT INTO school_chat_mutes (school_key, user_id, until, muted_by)
       VALUES ($1, $2, NOW() + make_interval(mins => $3::int), $4)
       ON CONFLICT (school_key, user_id) DO UPDATE SET until = EXCLUDED.until, muted_by = EXCLUDED.muted_by`,
      [schoolKey, targetId, Math.round(minutes), String(user.id)]
    );
    res.json({ ok: true, minutes });
  }));

  router.post('/teacher/unmute', asyncRoute(async (req, res) => {
    requireDatabase();
    const { schoolKey } = await teacherSchool(req);
    await pool.query('DELETE FROM school_chat_mutes WHERE school_key = $1 AND user_id = $2', [schoolKey, String(req.body?.userId || '')]);
    res.json({ ok: true });
  }));

  // ---- 실시간 연결: 학교마다 접속한 소켓 묶음 하나 ----
  const rooms = new Map();   // schoolKey -> Set<socket>
  const OPEN = 1;            // WebSocket.OPEN
  const send = (socket, payload) => { if (socket && socket.readyState === OPEN) socket.send(JSON.stringify(payload)); };

  function leave(socket) {
    const member = socket.meta?.schoolChat;
    if (!member) return;
    const sockets = rooms.get(member.schoolKey);
    if (sockets) {
      sockets.delete(socket);
      if (!sockets.size) rooms.delete(member.schoolKey);
    }
    socket.meta.schoolChat = null;
  }

  listeners.add((schoolKey, event) => {
    for (const socket of rooms.get(schoolKey) || []) send(socket, { type: 'SCHOOLCHAT_EVENT', event });
  });

  // 소켓 메시지가 채팅 것이면 처리하고 true 를 돌려준다. verifyTicket(ticket, kind)는 서명 검사.
  async function handleSocketMessage(socket, message, verifyTicket) {
    const type = String(message?.type || '');
    if (type === 'SCHOOLCHAT_JOIN') {
      const identity = verifyTicket(String(message.ticket || '').slice(0, 2048), 'school-chat');
      if (!identity) { send(socket, { type: 'SCHOOLCHAT_AUTH_REQUIRED' }); return true; }
      leave(socket);
      const sockets = rooms.get(identity.schoolKey) || new Set();
      rooms.set(identity.schoolKey, sockets);
      sockets.add(socket);
      socket.meta.schoolChat = {
        userId: identity.userId, name: identity.name, role: identity.role,
        grade: identity.grade, classNumber: identity.classNumber, schoolKey: identity.schoolKey
      };
      const history = await recent(identity.schoolKey).catch(() => []);
      send(socket, { type: 'SCHOOLCHAT_JOINED', userId: identity.userId, history });
      return true;
    }
    if (type === 'SCHOOLCHAT_SEND') {
      const member = socket.meta?.schoolChat;
      if (!member) return true;
      const result = await post(member, message.text).catch(() => ({ ok: false, reason: 'ERROR' }));
      if (!result.ok) send(socket, { type: 'SCHOOLCHAT_REJECTED', reason: result.reason });
      return true;
    }
    return false;
  }

  return {
    router,
    initialize,
    post,
    recent,
    leave,
    handleSocketMessage,
    onEvent(listener) { listeners.add(listener); return () => listeners.delete(listener); }
  };
}

module.exports = { createSchoolChat };
