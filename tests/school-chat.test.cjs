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
  assert.deepEqual(events[0].event, { type: 'deleted', id: first.message.id });

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

  server.close();
  console.log('school-chat: 모든 검사 통과');
}

main().catch((error) => { console.error(error); process.exit(1); });
