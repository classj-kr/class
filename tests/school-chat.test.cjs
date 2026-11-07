// 학교 공용 채팅 모듈 검사: 학교별 분리, 말한 그대로 저장, 도배 제한, 선생님 도구, 3일 정리.
// 실행: node tests/school-chat.test.cjs
const assert = require('node:assert/strict');
const express = require('../game-hub-server/node_modules/express');
const { PGlite } = require('../game-hub-server/node_modules/@electric-sql/pglite');
const { createSchoolChat } = require('../game-hub-server/school-chat');

class HttpError extends Error { constructor(status, code, message) { super(message); this.status = status; this.code = code; } }

const PEOPLE = {
  1: { user: { id: 1, role: 'student' }, membership: { name: '김하늘', schoolName: 'A학교', grade: 3, classNumber: 2 } },
  2: { user: { id: 2, role: 'student' }, membership: { name: '이바다', schoolName: 'A학교', grade: 4, classNumber: 1 } },
  3: { user: { id: 3, role: 'student' }, membership: { name: '박구름', schoolName: 'B학교', grade: 3, classNumber: 1 } },
  9: { user: { id: 9, role: 'teacher' }, registration: { teacher_name: '최선생', school_name: 'A학교', grade: 3, class_number: 2 } },
  8: { user: { id: 8, role: 'teacher' }, registration: { teacher_name: '정선생', school_name: 'B학교', grade: 1, class_number: 1 } }
};

async function main() {
  const db = new PGlite();
  // 진짜 pg 는 인자 없는 여러 문장을 한꺼번에 받는다(마이그레이션). PGlite 는 그럴 때 exec 가 필요하다.
  const pool = {
    query: async (sql, args) => {
      if (!args || !args.length) {
        if (sql.includes(';\n') || /;\s*\S/.test(sql.trim().replace(/;$/, ''))) { await db.exec(sql); return { rows: [], rowCount: 0 }; }
      }
      const r = await db.query(sql, args);
      // pg 는 SELECT 에는 읽은 줄 수, UPDATE·DELETE 에는 바뀐 줄 수를 rowCount 로 준다.
      return { rows: r.rows, rowCount: Math.max(r.rows.length, r.affectedRows || 0) };
    }
  };
  const personOf = (req) => { const m = /u=(\d+)/.exec(req.headers.cookie || ''); return m ? PEOPLE[m[1]] : null; };
  const requireUser = async (req) => { const p = personOf(req); if (!p) throw new HttpError(401, 'AUTH_REQUIRED', '로그인'); return p.user; };
  const chat = createSchoolChat({
    pool, requireUser,
    requireTeacher: async (req) => { const p = personOf(req); if (!p || p.user.role !== 'teacher') throw new HttpError(403, 'TEACHER_REGISTRATION_REQUIRED', '교사만'); return p.user; },
    requireDatabase: () => {},
    studentMembership: async (id) => PEOPLE[id]?.membership || null,
    teacherRegistration: async (user) => PEOPLE[user.id]?.registration || null,
    signTicket: (payload) => Buffer.from(JSON.stringify(payload)).toString('base64url'),
    HttpError,
    asyncRoute: (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
  });
  await chat.initialize();

  const app = express();
  app.use(express.json());
  app.use('/api/school-chat', chat.router);
  app.use((error, _req, res, _next) => res.status(error.status || 500).json({ error: error.code || 'ERROR' }));
  const server = await new Promise((resolve) => { const s = app.listen(0, () => resolve(s)); });
  const base = `http://127.0.0.1:${server.address().port}/api/school-chat`;
  const call = (path, { as, method = 'GET', body } = {}) => fetch(base + path, {
    method, headers: { 'Content-Type': 'application/json', ...(as ? { cookie: `u=${as}` } : {}) }, body: body ? JSON.stringify(body) : undefined
  });
  const identityOf = async (id) => JSON.parse(Buffer.from((await (await call('/ticket', { as: id })).json()).ticket, 'base64url').toString());
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const events = [];
  chat.onEvent((schoolKey, event) => events.push({ schoolKey, event }));

  // 1. 입장권: 학생·교사는 받고 게스트는 못 받는다. 방은 입장권 안의 학교로 정해진다.
  assert.equal((await call('/ticket')).status, 401, '게스트는 입장권을 못 받는다');
  const kim = await identityOf(1);
  assert.equal(kim.kind, 'school-chat');
  assert.equal(kim.schoolKey, 'A학교');
  assert.equal(kim.role, 'student');
  const teacher = await identityOf(9);
  assert.equal(teacher.role, 'teacher');
  assert.equal(teacher.schoolKey, 'A학교');
  const park = await identityOf(3);

  // 2. 말한 그대로 저장한다(걸러 내지 않는다).
  const raw = '씨발 진짜 짜증나   ㅋㅋ';
  const first = await chat.post(kim, raw);
  assert.equal(first.ok, true);
  assert.equal(first.message.text, '씨발 진짜 짜증나 ㅋㅋ', '공백만 정리하고 낱말은 그대로');
  assert.equal(first.message.name, '김하늘');
  assert.equal((await db.query('SELECT user_id FROM school_chat_messages WHERE id = $1', [first.message.id])).rows[0].user_id, '1', '보낸 계정이 서버에 남는다');

  // 3. 빈 글·긴 글
  await wait(1600);
  assert.equal((await chat.post(kim, '   ')).reason, 'EMPTY');
  const long = await chat.post(kim, 'ㄱ'.repeat(500));
  assert.equal(long.message.text.length, 200);

  // 4. 도배 제한: 바로 이어 보내면 막힌다.
  assert.equal((await chat.post(kim, '또 보냄')).reason, 'TOO_FAST');

  // 5. 학교 분리
  await chat.post(park, 'B학교 글');
  const recentA = (await chat.recent('A학교')).map((m) => m.text);
  const recentB = (await chat.recent('B학교')).map((m) => m.text);
  assert.ok(recentA.includes('씨발 진짜 짜증나 ㅋㅋ') && !recentA.includes('B학교 글'));
  assert.deepEqual(recentB, ['B학교 글']);
  assert.ok(events.every((e) => e.schoolKey === 'A학교' || e.event.message.text === 'B학교 글'));

  // 6. 선생님 도구는 선생님만, 자기 학교 것만
  assert.equal((await call('/teacher/messages', { as: 1 })).status, 403, '학생은 기록을 못 본다');
  const teacherList = (await (await call('/teacher/messages', { as: 9 })).json()).messages;
  assert.ok(teacherList.some((m) => m.text === '씨발 진짜 짜증나 ㅋㅋ'));
  assert.ok(!teacherList.some((m) => m.text === 'B학교 글'), '다른 학교 글은 안 보인다');
  assert.equal((await call(`/teacher/messages/${first.message.id}/delete`, { as: 8, method: 'POST' })).status, 404, '다른 학교 선생님은 못 지운다');

  // 7. 삭제: 학생 쪽에서만 사라지고 선생님 기록에는 남는다.
  events.length = 0;
  assert.equal((await call(`/teacher/messages/${first.message.id}/delete`, { as: 9, method: 'POST' })).status, 200);
  assert.ok(!(await chat.recent('A학교')).some((m) => m.id === first.message.id));
  const afterDelete = (await (await call('/teacher/messages', { as: 9 })).json()).messages.find((m) => m.id === first.message.id);
  assert.equal(afterDelete.deleted, true);
  assert.deepEqual(events[0].event, { type: 'deleted', channel: 'school', id: first.message.id });

  // 8. 막기: 막힌 학생은 못 보내고, 교사는 영향 없고, 풀면 다시 보낸다.
  assert.equal((await call('/teacher/mute', { as: 9, method: 'POST', body: { userId: '1', minutes: 10 } })).status, 200);
  await wait(1600);
  assert.equal((await chat.post(kim, '막힌 뒤')).reason, 'MUTED');
  assert.equal((await chat.post(teacher, '교사는 가능')).ok, true);
  await call('/teacher/unmute', { as: 9, method: 'POST', body: { userId: '1' } });
  await wait(1600);
  assert.equal((await chat.post(kim, '푼 뒤')).ok, true);

  // 9. 3일 정리: 보존한 줄만 남는다.
  const keep = (await chat.post(await identityOf(2), '증거 글')).message;
  await call(`/teacher/messages/${keep.id}/preserve`, { as: 9, method: 'POST', body: { preserved: true } });
  await db.query("UPDATE school_chat_messages SET created_at = NOW() - INTERVAL '4 days' WHERE school_key = 'A학교'");
  await chat.initialize();
  const left = (await db.query("SELECT body, preserved FROM school_chat_messages WHERE school_key = 'A학교'")).rows;
  assert.deepEqual(left, [{ body: '증거 글', preserved: true }], '3일 지난 것은 지우고 보존한 줄은 남긴다');

  // 10. 도배로 밀어내기 방지: 상한(5000)을 넘으면 오래된 것부터 지우되 보존한 줄은 안 지운다.
  await db.query(`INSERT INTO school_chat_messages (school_key, user_id, sender_name, body)
                  SELECT 'A학교', '2', '도배', 'x' || g FROM generate_series(1, 5100) g`);
  await chat.initialize();
  const counts = (await db.query("SELECT preserved, COUNT(*)::int AS n FROM school_chat_messages WHERE school_key = 'A학교' GROUP BY preserved ORDER BY preserved")).rows;
  assert.deepEqual(counts, [{ preserved: false, n: 5000 }, { preserved: true, n: 1 }]);

  // ---- 채널: 학생이 만드는 방 ----
  const lee = await identityOf(2);
  const asJson = async (response) => ({ status: response.status, body: await response.json().catch(() => ({})) });

  // 11. 방 만들기: 번호가 생기고 만든 사람이 들어간다.
  const made = await asJson(await call('/rooms', { as: 1, method: 'POST', body: { name: '무시되는 이름' } }));
  assert.equal(made.status, 200);
  assert.equal(made.body.channel.name, '김하늘의 방', '방 이름은 입력이 아니라 만든 학생 이름으로 붙는다');
  assert.match(made.body.channel.code, /^\d{4}$/);
  const roomId = made.body.channel.id;
  const code = made.body.channel.code;
  assert.deepEqual((await (await call('/rooms', { as: 1 })).json()).channels.map((c) => c.id), ['school', roomId]);

  // 12. 들어가지 않은 사람은 방에 못 쓰고, 학교 전체방 글은 방으로 안 섞인다.
  await wait(1600);
  assert.equal((await chat.post(lee, '몰래 쓰기', roomId)).reason, 'NOT_MEMBER');
  assert.equal((await chat.post(kim, '방 글', roomId)).ok, true);
  assert.deepEqual((await chat.recent('A학교', roomId)).map((m) => m.text), ['방 글']);
  assert.ok(!(await chat.recent('A학교', 'school')).some((m) => m.text === '방 글'), '방 글이 학교 전체방에 안 보인다');

  // 13. 번호로 들어가기: 같은 학교만, 없는 번호는 404, 다른 학교는 같은 번호로도 못 들어간다.
  assert.equal((await asJson(await call('/rooms/join', { as: 2, method: 'POST', body: { code: '0000' === code ? '1111' : '0000' } }))).status, 404);
  assert.equal((await asJson(await call('/rooms/join', { as: 3, method: 'POST', body: { code } }))).status, 404, '다른 학교 학생은 못 들어간다');
  const joined = await asJson(await call('/rooms/join', { as: 2, method: 'POST', body: { code } }));
  assert.equal(joined.status, 200);
  await wait(1600);
  assert.equal((await chat.post(lee, '들어간 뒤', roomId)).ok, true);

  // 14. 이름은 같고 학교만 다른 방은 서로 별개다.
  await db.query(`INSERT INTO school_chat_rooms (school_key, code, name, owner_user_id) VALUES ('B학교', $1, '다른학교방', '3')`, [code]);
  await db.query(`INSERT INTO school_chat_members (school_key, code, user_id) VALUES ('B학교', $1, '3')`, [code]);
  await chat.post(await identityOf(3), 'B 방 글', roomId);
  assert.ok(!(await chat.recent('A학교', roomId)).some((m) => m.text === 'B 방 글'));

  // 15. 선생님: 우리 학교 방 목록과 방 대화를 들어가지 않고도 본다. 다른 학교 방은 안 보인다.
  const teacherRooms = (await (await call('/teacher/rooms', { as: 9 })).json()).rooms;
  assert.deepEqual(teacherRooms.map((r) => [r.id, r.members]), [[roomId, 2]]);
  const roomLog = (await (await call(`/teacher/messages?channel=${encodeURIComponent(roomId)}`, { as: 9 })).json()).messages.map((m) => m.text);
  assert.deepEqual(roomLog, ['방 글', '들어간 뒤']);
  assert.equal((await call('/teacher/rooms', { as: 1 })).status, 403);

  // 16. 막힘은 학교 전체방과 방 모두에 적용된다.
  await call('/teacher/mute', { as: 9, method: 'POST', body: { userId: '2', minutes: 10 } });
  await wait(1600);
  assert.equal((await chat.post(lee, '막힌 뒤 방', roomId)).reason, 'MUTED');
  await call('/teacher/unmute', { as: 9, method: 'POST', body: { userId: '2' } });

  // 17. 방 도배가 학교 전체방 기록을 밀어내지 못한다(방마다 상한이 따로).
  await db.query(`INSERT INTO school_chat_messages (school_key, channel, user_id, sender_name, body)
                  SELECT 'A학교', $1, '2', '도배', 'r' || g FROM generate_series(1, 5100) g`, [roomId]);
  const schoolBefore = (await db.query("SELECT COUNT(*)::int AS n FROM school_chat_messages WHERE school_key='A학교' AND channel='school'")).rows[0].n;
  await chat.initialize();
  assert.equal((await db.query("SELECT COUNT(*)::int AS n FROM school_chat_messages WHERE school_key='A학교' AND channel=$1", [roomId])).rows[0].n, 5000);
  assert.equal((await db.query("SELECT COUNT(*)::int AS n FROM school_chat_messages WHERE school_key='A학교' AND channel='school'")).rows[0].n, schoolBefore, '학교 전체방 기록은 그대로');

  // 18. 배틀넷처럼 한 번에 방 하나: 이미 방에 있으면 새로 만들 수도, 다른 방에 들어갈 수도 없다.
  assert.equal((await asJson(await call('/rooms', { as: 1, method: 'POST' }))).body.error, 'ALREADY_IN_ROOM');
  await db.query(`INSERT INTO school_chat_rooms (school_key, code, name, owner_user_id) VALUES ('A학교', '9998', '다른방', '301')`);
  await db.query(`INSERT INTO school_chat_members (school_key, code, user_id) VALUES ('A학교', '9998', '301')`);
  assert.equal((await asJson(await call('/rooms/join', { as: 2, method: 'POST', body: { code: '9998' } }))).body.error, 'ALREADY_IN_ROOM');
  assert.equal((await call('/rooms/join', { as: 2, method: 'POST', body: { code } })).status, 200, '지금 있는 방 번호를 또 눌러도 괜찮다');

  // 19. 나가기: 나가면 다른 방에 갈 수 있고, 아무도 안 남으면 방이 사라진다.
  assert.equal((await call(`/rooms/${code}/leave`, { as: 2, method: 'POST' })).status, 200);
  assert.equal((await db.query("SELECT 1 FROM school_chat_rooms WHERE school_key='A학교' AND code=$1", [code])).rowCount, 1, '한 명이라도 남은 방은 유지');
  const second = await asJson(await call('/rooms', { as: 2, method: 'POST' }));
  assert.equal(second.status, 200, '나간 뒤에는 자기 방을 만들 수 있다');
  assert.equal(second.body.channel.name, '이바다의 방');
  assert.equal((await call(`/rooms/${code}/leave`, { as: 1, method: 'POST' })).status, 200);
  assert.equal((await db.query("SELECT 1 FROM school_chat_rooms WHERE school_key='A학교' AND code=$1", [code])).rowCount, 0, '마지막 사람이 나가면 빈 방은 지운다');

  // ---- 방 통화: 음성 6명, 카메라 동시에 4명, 연결 신호는 같은 통화 안에서만 ----
  await db.query(`INSERT INTO school_chat_rooms (school_key, code, name, owner_user_id) VALUES ('A학교', '7777', '통화방', '201')`);
  for (let id = 201; id <= 207; id += 1) await db.query(`INSERT INTO school_chat_members (school_key, code, user_id) VALUES ('A학교', '7777', $1)`, [String(id)]);
  await db.query(`INSERT INTO school_chat_members (school_key, code, user_id) VALUES ('A학교', '8888', '201')`); // 방 없는 번호(무시되어야 함)
  const CALL = 'room:7777';
  const people = {};
  const verifyTicket = (ticket) => people[ticket] || null;
  const fake = () => { const socket = { readyState: 1, meta: {}, sent: [], send(raw) { this.sent.push(JSON.parse(raw)); } }; return socket; };
  const last = (socket, type) => [...socket.sent].reverse().find((packet) => packet.type === type);
  const sockets = {};
  for (let id = 201; id <= 207; id += 1) {
    const socket = fake();
    people[`t${id}`] = { userId: String(id), name: `학생${id}`, role: 'student', grade: 3, classNumber: 1, schoolKey: 'A학교' };
    await chat.handleSocketMessage(socket, { type: 'SCHOOLCHAT_JOIN', ticket: `t${id}` }, verifyTicket);
    sockets[id] = socket;
  }
  const say = (id, message) => chat.handleSocketMessage(sockets[id], message, verifyTicket);

  // 20. 음성은 6명까지, 일곱째는 가득 참 안내.
  for (let id = 201; id <= 206; id += 1) await say(id, { type: 'SCHOOLCHAT_CALL_JOIN', channel: CALL });
  await say(207, { type: 'SCHOOLCHAT_CALL_JOIN', channel: CALL });
  assert.equal(last(sockets[201], 'SCHOOLCHAT_CALL_STATE').members.length, 6);
  assert.ok(last(sockets[207], 'SCHOOLCHAT_CALL_FULL'), '일곱째는 거절');
  assert.equal(last(sockets[207], 'SCHOOLCHAT_CALL_STATE'), undefined, '거절된 사람은 통화 상태를 못 받는다');

  // 21. 학교 전체방과 들어가지 않은 방에서는 통화가 안 열린다.
  const outsider = fake();
  people.tx = { userId: '299', name: '바깥', role: 'student', grade: 3, classNumber: 1, schoolKey: 'A학교' };
  await chat.handleSocketMessage(outsider, { type: 'SCHOOLCHAT_JOIN', ticket: 'tx' }, verifyTicket);
  await chat.handleSocketMessage(outsider, { type: 'SCHOOLCHAT_CALL_JOIN', channel: CALL }, verifyTicket);
  await chat.handleSocketMessage(sockets[201], { type: 'SCHOOLCHAT_CALL_JOIN', channel: 'school' }, verifyTicket);
  assert.equal(last(outsider, 'SCHOOLCHAT_CALL_STATE'), undefined, '방에 안 들어간 사람은 통화에 못 들어간다');
  assert.equal(last(sockets[201], 'SCHOOLCHAT_CALL_STATE').channel, CALL, '학교 전체방에는 통화가 없다');

  // 22. 카메라는 동시에 4명까지. 다섯째는 거절, 누가 끄면 켤 수 있다.
  for (let id = 201; id <= 204; id += 1) await say(id, { type: 'SCHOOLCHAT_CAM', channel: CALL, on: true });
  assert.deepEqual(last(sockets[206], 'SCHOOLCHAT_CALL_STATE').cams, ['201', '202', '203', '204']);
  await say(205, { type: 'SCHOOLCHAT_CAM', channel: CALL, on: true });
  assert.ok(last(sockets[205], 'SCHOOLCHAT_CAM_DENIED'), '다섯째 카메라는 거절');
  assert.ok(!last(sockets[206], 'SCHOOLCHAT_CALL_STATE').cams.includes('205'));
  await say(201, { type: 'SCHOOLCHAT_CAM', channel: CALL, on: false });
  await say(205, { type: 'SCHOOLCHAT_CAM', channel: CALL, on: true });
  assert.ok(last(sockets[206], 'SCHOOLCHAT_CALL_STATE').cams.includes('205'), '빈자리가 나면 켤 수 있다');
  await say(204, { type: 'SCHOOLCHAT_CAM', channel: CALL, on: true });   // 이미 켠 사람이 또 켜도 자리를 더 쓰지 않는다
  assert.equal(last(sockets[206], 'SCHOOLCHAT_CALL_STATE').cams.length, 4);

  // 23. 연결 신호는 같은 통화에 들어온 사람에게만, 보낸 사람 표시와 함께 간다.
  await say(201, { type: 'SCHOOLCHAT_SIGNAL', channel: CALL, to: '202', data: { kind: 'offer', sdp: 'x' } });
  assert.deepEqual(last(sockets[202], 'SCHOOLCHAT_SIGNAL'), { type: 'SCHOOLCHAT_SIGNAL', channel: CALL, from: '201', data: { kind: 'offer', sdp: 'x' } });
  await say(201, { type: 'SCHOOLCHAT_SIGNAL', channel: CALL, to: '299', data: { kind: 'offer' } });
  assert.equal(last(outsider, 'SCHOOLCHAT_SIGNAL'), undefined, '통화에 없는 사람에게는 안 간다');
  await say(201, { type: 'SCHOOLCHAT_SIGNAL', channel: CALL, to: '201', data: {} });
  assert.equal(last(sockets[201], 'SCHOOLCHAT_SIGNAL'), undefined, '자기에게는 안 간다');
  await say(207, { type: 'SCHOOLCHAT_SIGNAL', channel: CALL, to: '202', data: { kind: 'ice' } });
  assert.notEqual(last(sockets[202], 'SCHOOLCHAT_SIGNAL').data.kind, 'ice', '통화에 못 들어온 사람의 신호는 안 간다');
  const sentBefore = sockets[203].sent.length;
  await say(201, { type: 'SCHOOLCHAT_SIGNAL', channel: CALL, to: '203', data: { big: 'x'.repeat(30000) } });
  assert.equal(sockets[203].sent.length, sentBefore, '너무 큰 신호는 버린다');

  // 24. 나가면 통화와 카메라 자리에서 빠지고 남은 사람이 알게 된다. 접속이 끊겨도 같다.
  await say(205, { type: 'SCHOOLCHAT_CALL_LEAVE', channel: CALL });
  const afterLeave = last(sockets[206], 'SCHOOLCHAT_CALL_STATE');
  assert.ok(!afterLeave.members.some((m) => m.userId === '205') && !afterLeave.cams.includes('205'));
  chat.leave(sockets[204]);
  const afterDrop = last(sockets[206], 'SCHOOLCHAT_CALL_STATE');
  assert.ok(!afterDrop.members.some((m) => m.userId === '204') && !afterDrop.cams.includes('204'));
  await say(207, { type: 'SCHOOLCHAT_CALL_JOIN', channel: CALL });   // 자리가 났으니 일곱째가 들어온다
  assert.ok(last(sockets[207], 'SCHOOLCHAT_CALL_STATE'));

  // 25. 방을 나가면(구독 해제) 통화에서도 빠진다.
  await say(206, { type: 'SCHOOLCHAT_UNSUBSCRIBE', channel: CALL });
  assert.ok(!last(sockets[201], 'SCHOOLCHAT_CALL_STATE').members.some((m) => m.userId === '206'));

  // 26. 접속자 목록: 새로 들어온 사람은 전체 목록, 이미 있던 사람은 들고 나는 소식만 받는다.
  const deltas = (socket, channel) => socket.sent.filter((p) => p.type === 'SCHOOLCHAT_PRESENCE_DELTA' && p.channel === channel);
  const joinedPacket = (socket) => socket.sent.find((p) => p.type === 'SCHOOLCHAT_JOINED');
  assert.deepEqual(joinedPacket(sockets[207]).presence.school.map((u) => u.userId).sort(), ['201', '202', '203', '204', '205', '206', '207'], '새로 들어온 사람은 전체 접속자 목록을 받는다');
  assert.ok(joinedPacket(sockets[207]).presence.school.every((u) => u.name && u.role), '접속자에는 이름과 역할이 있다');
  const sawJoin = new Set(deltas(sockets[201], 'school').filter((p) => p.joined).map((p) => p.joined.userId));
  for (const id of ['202', '203', '204', '205', '206', '207']) assert.ok(sawJoin.has(id), `이미 있던 사람이 ${id}의 입장 소식을 받는다`);
  assert.ok(deltas(sockets[202], 'school').some((p) => p.left === '204'), '나간 사람은 나갔다는 소식이 온다');

  const windowB = fake();
  const beforeDeltas = deltas(sockets[202], 'school').length;
  await chat.handleSocketMessage(windowB, { type: 'SCHOOLCHAT_JOIN', ticket: 't201' }, verifyTicket);
  assert.equal(deltas(sockets[202], 'school').length, beforeDeltas, '같은 계정의 두 번째 창은 접속자를 늘리지 않는다');
  assert.equal(joinedPacket(windowB).presence.school.filter((u) => u.userId === '201').length, 1, '한 사람은 한 번만 보인다');
  chat.leave(sockets[201]);
  assert.equal(deltas(sockets[202], 'school').length, beforeDeltas, '한 창이 닫혀도 다른 창이 있으면 나간 것이 아니다');
  chat.leave(windowB);
  assert.ok(deltas(sockets[202], 'school').slice(beforeDeltas).some((p) => p.left === '201'), '마지막 창이 닫히면 나갔다고 알린다');

  server.close();
  console.log('school-chat: 모든 검사 통과');
}

main().catch((error) => { console.error(error); process.exit(1); });
