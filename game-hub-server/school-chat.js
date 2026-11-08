'use strict';
// 학교 공용 채팅. 같은 학교 학생·교사만 들어온다(게스트 제외).
// 채널: 'school' = 학교 전체방, 'room:<번호>' = 학생들이 만든 방. 사이트 전체 채널 같은 새 채널은
// 채널 이름표에 값 하나를 더하는 것으로 붙일 수 있다.
// 말한 그대로 저장하고(욕설 걸러 내기 없음) 보존한 줄 말고는 3일 뒤 지운다.
// 학교 이름은 방을 가르는 열쇠로만 쓰고 화면에는 내보내지 않는다.
const express = require('express');
const fs = require('node:fs');
const path = require('node:path');

const MAX_BODY = 200;
const KEEP_DAYS = 3;
const MAX_PER_CHANNEL = 5000;
const RECENT_FOR_NEWCOMER = 50;
const TEACHER_VIEW_LIMIT = 300;
const MIN_GAP_MS = 1500;          // 한 사람이 연달아 보낼 때 최소 간격
const BURST_WINDOW_MS = 10000;
const BURST_MAX = 5;              // 10초에 다섯 번까지
const MAX_ROOMS_JOINED = 1;       // 한 학생이 한 번에 들어가 있을 수 있는 방(만든 방 포함, 학교 전체방은 따로)
const SCHOOL = 'school';
const CHANNEL_PATTERN = /^(school|room:\d{4})$/;
const MAX_CALL = 6;               // 방 통화(음성) 인원
const MAX_CAMS = 4;               // 동시에 카메라를 켤 수 있는 사람 수
const SIGNAL_MAX = 20000;         // 연결 신호 한 개의 최대 크기(글자 수)

function createSchoolChat({ pool, requireUser, requireTeacher, requireDatabase, studentMembership, teacherRegistration, signTicket, HttpError, asyncRoute }) {
  const router = express.Router();
  const fail = (status, code, message) => { throw new HttpError(status, code, message); };
  const listeners = new Set();
  const recentSends = new Map();   // userId -> 보낸 시각 목록
  let postsSinceCleanup = 0;
  let cleanupTimer = null;

  const emit = (schoolKey, event) => { for (const listener of listeners) listener(schoolKey, event); };
  const roomChannel = (code) => `room:${code}`;
  const codeOf = (channel) => channel.slice('room:'.length);

  async function initialize() {
    if (!pool) return;
    for (const file of ['024-school-chat.sql', '025-school-chat-channels.sql']) {
      await pool.query(fs.readFileSync(path.join(__dirname, 'migrations', file), 'utf8'));
    }
    await cleanup();
    // 글이 거의 안 오가는 때에도 3일 지난 글·방이 남지 않게 한 시간마다 정리한다.
    if (!cleanupTimer) {
      cleanupTimer = setInterval(() => { cleanup().catch(() => {}); }, 60 * 60 * 1000);
      cleanupTimer.unref?.();
    }
  }

  async function cleanup() {
    if (!pool) return;
    await pool.query(
      `DELETE FROM school_chat_messages WHERE preserved = FALSE AND created_at < NOW() - INTERVAL '${KEEP_DAYS} days'`
    );
    // 방마다 상한을 넘으면 오래된 것부터(보존 제외) 지운다. 한 방의 도배가 다른 방 기록을 밀어내지 못한다.
    await pool.query(
      `DELETE FROM school_chat_messages m USING (
         SELECT id FROM (
           SELECT id, ROW_NUMBER() OVER (PARTITION BY school_key, channel ORDER BY id DESC) AS n
           FROM school_chat_messages WHERE preserved = FALSE
         ) ranked WHERE n > $1
       ) old WHERE m.id = old.id`,
      [MAX_PER_CHANNEL]
    );
    await pool.query(`DELETE FROM school_chat_rooms WHERE last_active_at < NOW() - INTERVAL '${KEEP_DAYS} days'`);
    await pool.query(
      `DELETE FROM school_chat_members m WHERE NOT EXISTS (
         SELECT 1 FROM school_chat_rooms r WHERE r.school_key = m.school_key AND r.code = m.code)`
    );
    await pool.query(
      `DELETE FROM school_chat_rooms r WHERE NOT EXISTS (
         SELECT 1 FROM school_chat_members m WHERE m.school_key = r.school_key AND m.code = r.code)`
    );
  }

  function publicMessage(row) {
    return {
      id: String(row.id),
      channel: row.channel || SCHOOL,
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

  // 학교 전체방은 누구나, 학생이 만든 방은 들어간 사람만.
  async function isMember(schoolKey, userId, channel) {
    if (channel === SCHOOL) return true;
    const result = await pool.query(
      'SELECT 1 FROM school_chat_members WHERE school_key = $1 AND code = $2 AND user_id = $3',
      [schoolKey, codeOf(channel), userId]
    );
    return result.rowCount > 0;
  }

  // 내가 들어간 채널 목록(학교 전체방 먼저).
  async function myChannels(schoolKey, userId) {
    const result = await pool.query(
      `SELECT r.code, r.name FROM school_chat_members m
       JOIN school_chat_rooms r ON r.school_key = m.school_key AND r.code = m.code
       WHERE m.school_key = $1 AND m.user_id = $2 ORDER BY m.joined_at, r.code`,
      [schoolKey, userId]
    );
    return [{ id: SCHOOL, name: '학교' }, ...result.rows.map((row) => ({ id: roomChannel(row.code), name: row.name, code: row.code }))];
  }

  // 말한 그대로 저장한다. 걸러 내거나 바꾸지 않는다.
  async function post(identity, rawText, channel = SCHOOL) {
    if (!pool) return { ok: false, reason: 'NO_DATABASE' };
    if (!CHANNEL_PATTERN.test(channel)) return { ok: false, reason: 'NO_CHANNEL' };
    const text = normalizeText(rawText);
    if (!text) return { ok: false, reason: 'EMPTY' };
    if (!await isMember(identity.schoolKey, identity.userId, channel)) return { ok: false, reason: 'NOT_MEMBER' };
    if (!allowedNow(identity.userId)) return { ok: false, reason: 'TOO_FAST' };
    const result = await pool.query(
      `INSERT INTO school_chat_messages (school_key, channel, user_id, sender_name, sender_role, grade, class_number, body)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [identity.schoolKey, channel, identity.userId, identity.name, identity.role, identity.grade, identity.classNumber, text]
    );
    if (channel !== SCHOOL) {
      await pool.query('UPDATE school_chat_rooms SET last_active_at = NOW() WHERE school_key = $1 AND code = $2', [identity.schoolKey, codeOf(channel)]);
    }
    postsSinceCleanup += 1;
    if (postsSinceCleanup >= 100) { postsSinceCleanup = 0; cleanup().catch(() => {}); }
    const message = publicMessage(result.rows[0]);
    emit(identity.schoolKey, { type: 'message', channel, message });
    return { ok: true, message };
  }

  async function recent(schoolKey, channel = SCHOOL, limit = RECENT_FOR_NEWCOMER) {
    if (!pool) return [];
    const result = await pool.query(
      `SELECT * FROM (
         SELECT * FROM school_chat_messages WHERE school_key = $1 AND channel = $2 AND deleted_at IS NULL ORDER BY id DESC LIMIT $3
       ) latest ORDER BY id ASC`,
      [schoolKey, channel, limit]
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

  // ---- 학생이 만드는 방 ----
  // 방 이름은 입력받지 않고 만든 사람 이름으로 붙인다("○○의 방"). 자유 글이 끼어들 틈이 없고,
  // 선생님 목록에서도 누구 방인지 바로 보인다.
  router.get('/rooms', asyncRoute(async (req, res) => {
    requireDatabase();
    const identity = await identityFor(req);
    res.setHeader('Cache-Control', 'no-store');
    res.json({ channels: await myChannels(identity.schoolKey, identity.userId) });
  }));

  // 배틀넷처럼 한 번에 방 하나. 다른 방에 가려면 지금 방을 먼저 나간다.
  async function requireNoOtherRoom(identity) {
    const joined = (await pool.query('SELECT COUNT(*)::int AS n FROM school_chat_members WHERE school_key = $1 AND user_id = $2', [identity.schoolKey, identity.userId])).rows[0].n;
    if (joined >= MAX_ROOMS_JOINED) fail(409, 'ALREADY_IN_ROOM', '이미 다른 방에 있어요. 먼저 그 방에서 나가세요.');
  }

  router.post('/rooms', asyncRoute(async (req, res) => {
    requireDatabase();
    const identity = await identityFor(req);
    await requireNoOtherRoom(identity);
    const name = `${identity.name}의 방`;
    for (let attempt = 0; attempt < 30; attempt += 1) {
      const code = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
      const inserted = await pool.query(
        `INSERT INTO school_chat_rooms (school_key, code, name, owner_user_id) VALUES ($1, $2, $3, $4)
         ON CONFLICT (school_key, code) DO NOTHING RETURNING code`,
        [identity.schoolKey, code, name, identity.userId]
      );
      if (!inserted.rowCount) continue;
      await pool.query('INSERT INTO school_chat_members (school_key, code, user_id) VALUES ($1, $2, $3)', [identity.schoolKey, code, identity.userId]);
      return res.json({ ok: true, channel: { id: roomChannel(code), name, code } });
    }
    fail(503, 'NO_FREE_ROOM_CODE', '지금은 새 방을 만들 수 없어요. 잠시 뒤에 다시 해 보세요.');
  }));

  router.post('/rooms/join', asyncRoute(async (req, res) => {
    requireDatabase();
    const identity = await identityFor(req);
    const code = String(req.body?.code || '').replace(/\D/g, '').slice(0, 4);
    if (code.length !== 4) fail(400, 'CODE_REQUIRED', '4자리 방 번호를 입력하세요.');
    const room = (await pool.query('SELECT name FROM school_chat_rooms WHERE school_key = $1 AND code = $2', [identity.schoolKey, code])).rows[0];
    if (!room) fail(404, 'ROOM_NOT_FOUND', '방을 찾지 못했어요. 번호를 확인하세요.');
    const already = await isMember(identity.schoolKey, identity.userId, roomChannel(code));
    if (!already) {
      await requireNoOtherRoom(identity);
      await pool.query('INSERT INTO school_chat_members (school_key, code, user_id) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING', [identity.schoolKey, code, identity.userId]);
      await pool.query('UPDATE school_chat_rooms SET last_active_at = NOW() WHERE school_key = $1 AND code = $2', [identity.schoolKey, code]);
    }
    res.json({ ok: true, channel: { id: roomChannel(code), name: room.name, code } });
  }));

  router.post('/rooms/:code/leave', asyncRoute(async (req, res) => {
    requireDatabase();
    const identity = await identityFor(req);
    const code = String(req.params.code || '').replace(/\D/g, '').slice(0, 4);
    await pool.query('DELETE FROM school_chat_members WHERE school_key = $1 AND code = $2 AND user_id = $3', [identity.schoolKey, code, identity.userId]);
    dropMember(identity.schoolKey, roomChannel(code), identity.userId);
    // 아무도 안 남은 방은 지운다(말은 3일 동안 선생님 기록에 남는다).
    await pool.query(
      `DELETE FROM school_chat_rooms r WHERE r.school_key = $1 AND r.code = $2
       AND NOT EXISTS (SELECT 1 FROM school_chat_members m WHERE m.school_key = r.school_key AND m.code = r.code)`,
      [identity.schoolKey, code]
    );
    res.json({ ok: true });
  }));

  // ---- 선생님 ----
  async function teacherSchool(req) {
    const user = await requireTeacher(req);
    const registration = await teacherRegistration(user);
    return { user, schoolKey: String(registration.school_name) };
  }

  // 우리 학교에 있는 방 목록(들어가지 않아도 대화를 볼 수 있다)
  router.get('/teacher/rooms', asyncRoute(async (req, res) => {
    requireDatabase();
    const { schoolKey } = await teacherSchool(req);
    const result = await pool.query(
      `SELECT r.code, r.name, r.last_active_at,
              (SELECT COUNT(*)::int FROM school_chat_members m WHERE m.school_key = r.school_key AND m.code = r.code) AS members
       FROM school_chat_rooms r WHERE r.school_key = $1 ORDER BY r.last_active_at DESC`,
      [schoolKey]
    );
    res.setHeader('Cache-Control', 'no-store');
    res.json({ rooms: result.rows.map((row) => ({ id: roomChannel(row.code), code: row.code, name: row.name, members: row.members })) });
  }));

  // 최근 대화(지운 줄도 보인다). ?channel= 로 학교 전체방이나 학생이 만든 방을 고른다.
  router.get('/teacher/messages', asyncRoute(async (req, res) => {
    requireDatabase();
    const { schoolKey } = await teacherSchool(req);
    const channel = CHANNEL_PATTERN.test(String(req.query?.channel || '')) ? String(req.query.channel) : SCHOOL;
    const result = await pool.query(
      `SELECT * FROM (
         SELECT * FROM school_chat_messages WHERE school_key = $1 AND channel = $2 ORDER BY id DESC LIMIT $3
       ) latest ORDER BY id ASC`,
      [schoolKey, channel, TEACHER_VIEW_LIMIT]
    );
    res.setHeader('Cache-Control', 'no-store');
    res.json({
      channel,
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
      'UPDATE school_chat_messages SET deleted_at = NOW() WHERE id = $1 AND school_key = $2 AND deleted_at IS NULL RETURNING channel',
      [req.params.id, schoolKey]
    );
    if (!result.rows[0]) fail(404, 'MESSAGE_NOT_FOUND', '메시지를 찾지 못했습니다.');
    emit(schoolKey, { type: 'deleted', channel: result.rows[0].channel, id: String(req.params.id) });
    res.json({ ok: true });
  }));

  // ---- 실시간 연결: (학교, 채널)마다 접속한 소켓 묶음 하나 ----
  const rooms = new Map();   // `${schoolKey}\0${channel}` -> Set<socket>
  const OPEN = 1;            // WebSocket.OPEN
  const send = (socket, payload) => { if (socket && socket.readyState === OPEN) socket.send(JSON.stringify(payload)); };
  const roomKey = (schoolKey, channel) => `${schoolKey}\u0000${channel}`;

  // ---- 접속자 목록(배틀넷처럼 그 채널에 지금 누가 있는지) ----
  // 같은 계정이 여러 창을 열어도 한 사람으로 센다. 들고 나는 것만 알려서(전체 목록은 새로 들어온 사람에게만)
  // 사람이 많아도 소식이 사람 수만큼만 오간다.
  const presenceUser = (member) => ({ userId: member.userId, name: member.name, role: member.role, grade: member.grade, classNumber: member.classNumber });

  function presenceUsers(schoolKey, channel) {
    const users = new Map();
    for (const socket of rooms.get(roomKey(schoolKey, channel)) || []) {
      const member = socket.meta?.schoolChat;
      if (member && !users.has(member.userId)) users.set(member.userId, presenceUser(member));
    }
    return [...users.values()];
  }

  function otherSocketsOfUser(sockets, member, except) {
    for (const socket of sockets || []) if (socket !== except && socket.meta?.schoolChat?.userId === member.userId) return true;
    return false;
  }

  function announcePresence(socket, channel, delta) {
    const member = socket.meta.schoolChat;
    for (const other of rooms.get(roomKey(member.schoolKey, channel)) || []) {
      if (other !== socket && other.meta?.schoolChat?.userId !== member.userId) send(other, { type: 'SCHOOLCHAT_PRESENCE_DELTA', channel, ...delta });
    }
  }

  function subscribe(socket, channel) {
    const member = socket.meta.schoolChat;
    const key = roomKey(member.schoolKey, channel);
    const sockets = rooms.get(key) || new Set();
    rooms.set(key, sockets);
    const firstWindow = !otherSocketsOfUser(sockets, member, socket);
    sockets.add(socket);
    member.channels.add(channel);
    if (firstWindow) announcePresence(socket, channel, { joined: presenceUser(member) });
  }

  function unsubscribe(socket, channel) {
    const member = socket.meta?.schoolChat;
    if (!member) return;
    callLeave(socket, channel);
    const key = roomKey(member.schoolKey, channel);
    const sockets = rooms.get(key);
    const wasMember = member.channels.has(channel);
    if (sockets) {
      sockets.delete(socket);
      if (!sockets.size) rooms.delete(key);
    }
    member.channels.delete(channel);
    // 이 계정의 마지막 창이 나갔을 때만 "나갔다"고 알린다.
    if (wasMember && sockets && sockets.size && !otherSocketsOfUser(sockets, member, socket)) {
      for (const other of sockets) send(other, { type: 'SCHOOLCHAT_PRESENCE_DELTA', channel, left: member.userId });
    }
  }

  function leave(socket) {
    const member = socket.meta?.schoolChat;
    if (!member) return;
    for (const channel of [...member.channels]) unsubscribe(socket, channel);
    socket.meta.schoolChat = null;
  }

  // 방을 나간 사람의 접속에서 그 방을 뺀다(나간 뒤에도 새 글이 오지 않게).
  function dropMember(schoolKey, channel, userId) {
    for (const socket of [...(rooms.get(roomKey(schoolKey, channel)) || [])]) {
      if (socket.meta?.schoolChat?.userId === userId) unsubscribe(socket, channel);
    }
  }

  listeners.add((schoolKey, event) => {
    for (const socket of rooms.get(roomKey(schoolKey, event.channel || SCHOOL)) || []) send(socket, { type: 'SCHOOLCHAT_EVENT', event });
  });

  // ---- 방 통화: 학생이 만든 방에서만. 음성은 6명, 카메라는 동시에 4명까지 ----
  // 영상·음성은 학생 기기끼리 직접 오가고 서버는 인원을 세고 연결 신호만 전달한다.
  const calls = new Map();   // roomKey -> { members: Map<userId, socket>, cams: Set<userId> }

  function broadcastCall(key, channel) {
    const call = calls.get(key);
    if (!call) return;
    const payload = {
      type: 'SCHOOLCHAT_CALL_STATE', channel,
      members: [...call.members.entries()].map(([userId, socket]) => ({ userId, name: socket.meta.schoolChat.name })),
      cams: [...call.cams], limits: { call: MAX_CALL, cams: MAX_CAMS }
    };
    for (const socket of call.members.values()) send(socket, payload);
  }

  function callLeave(socket, channel) {
    const member = socket.meta?.schoolChat;
    if (!member) return;
    const key = roomKey(member.schoolKey, channel);
    const call = calls.get(key);
    if (!call || call.members.get(member.userId) !== socket) return;
    call.members.delete(member.userId);
    call.cams.delete(member.userId);
    if (!call.members.size) calls.delete(key);
    else broadcastCall(key, channel);
  }

  function handleCallMessage(socket, member, type, message) {
    const channel = String(message.channel || '');
    if (!/^room:\d{4}$/.test(channel) || !member.channels.has(channel)) return;   // 들어간 방에서만
    const key = roomKey(member.schoolKey, channel);
    if (type === 'SCHOOLCHAT_CALL_JOIN') {
      const call = calls.get(key) || { members: new Map(), cams: new Set() };
      if (!call.members.has(member.userId) && call.members.size >= MAX_CALL) {
        send(socket, { type: 'SCHOOLCHAT_CALL_FULL', channel });
        return;
      }
      calls.set(key, call);
      call.members.set(member.userId, socket);   // 같은 계정이 다른 창에서 들어오면 새 창이 이어받는다
      broadcastCall(key, channel);
      return;
    }
    const call = calls.get(key);
    if (!call || call.members.get(member.userId) !== socket) return;   // 통화에 들어와 있어야 한다
    if (type === 'SCHOOLCHAT_CALL_LEAVE') {
      callLeave(socket, channel);
    } else if (type === 'SCHOOLCHAT_CAM') {
      if (message.on) {
        if (!call.cams.has(member.userId) && call.cams.size >= MAX_CAMS) {
          send(socket, { type: 'SCHOOLCHAT_CAM_DENIED', channel });
          return;
        }
        call.cams.add(member.userId);
      } else call.cams.delete(member.userId);
      broadcastCall(key, channel);
    } else if (type === 'SCHOOLCHAT_SIGNAL') {
      const target = call.members.get(String(message.to || ''));
      if (!target || target === socket || JSON.stringify(message.data ?? null).length > SIGNAL_MAX) return;
      send(target, { type: 'SCHOOLCHAT_SIGNAL', channel, from: member.userId, data: message.data });
    }
  }

  // 소켓 메시지가 채팅 것이면 처리하고 true 를 돌려준다. verifyTicket(ticket, kind)는 서명 검사.
  async function handleSocketMessage(socket, message, verifyTicket) {
    const type = String(message?.type || '');
    if (type === 'SCHOOLCHAT_JOIN') {
      const identity = verifyTicket(String(message.ticket || '').slice(0, 2048), 'school-chat');
      if (!identity) { send(socket, { type: 'SCHOOLCHAT_AUTH_REQUIRED' }); return true; }
      leave(socket);
      socket.meta.schoolChat = {
        userId: identity.userId, name: identity.name, role: identity.role,
        grade: identity.grade, classNumber: identity.classNumber, schoolKey: identity.schoolKey, channels: new Set()
      };
      const channels = await myChannels(identity.schoolKey, identity.userId).catch(() => [{ id: SCHOOL, name: '학교' }]);
      const history = {};
      for (const channel of channels) {
        subscribe(socket, channel.id);
        history[channel.id] = await recent(identity.schoolKey, channel.id).catch(() => []);
      }
      const presence = {};
      for (const channel of channels) presence[channel.id] = presenceUsers(identity.schoolKey, channel.id);
      send(socket, { type: 'SCHOOLCHAT_JOINED', userId: identity.userId, channels, history, presence });
      return true;
    }
    const member = socket.meta?.schoolChat;
    if (type === 'SCHOOLCHAT_SUBSCRIBE') {
      const channel = String(message.channel || '');
      if (!member || !CHANNEL_PATTERN.test(channel) || !await isMember(member.schoolKey, member.userId, channel)) return true;
      subscribe(socket, channel);
      send(socket, { type: 'SCHOOLCHAT_HISTORY', channel, messages: await recent(member.schoolKey, channel).catch(() => []) });
      send(socket, { type: 'SCHOOLCHAT_PRESENCE', channel, users: presenceUsers(member.schoolKey, channel) });
      return true;
    }
    if (type === 'SCHOOLCHAT_UNSUBSCRIBE') {
      const channel = String(message.channel || '');
      if (member && channel !== SCHOOL) unsubscribe(socket, channel);
      return true;
    }
    if (type === 'SCHOOLCHAT_CALL_JOIN' || type === 'SCHOOLCHAT_CALL_LEAVE' || type === 'SCHOOLCHAT_CAM' || type === 'SCHOOLCHAT_SIGNAL') {
      if (member) handleCallMessage(socket, member, type, message);
      return true;
    }
    if (type === 'SCHOOLCHAT_SEND') {
      if (!member) return true;
      const channel = String(message.channel || SCHOOL);
      const result = await post(member, message.text, channel).catch(() => ({ ok: false, reason: 'ERROR' }));
      if (!result.ok) send(socket, { type: 'SCHOOLCHAT_REJECTED', reason: result.reason, channel });
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
