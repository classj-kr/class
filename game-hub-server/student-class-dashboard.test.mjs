import assert from 'node:assert/strict';
import test from 'node:test';
import { createRequire } from 'node:module';
import { PGlite } from '@electric-sql/pglite';

const require = createRequire(import.meta.url);
const express = require('express');
const { createStudentClassDashboard } = require('./student-class-dashboard.js');
const GROUP_MEMBER_SQL = `(g.group_type = 'homeroom' AND g.grade = ss.grade AND g.class_number = ss.class_number)
  OR EXISTS (SELECT 1 FROM teacher_group_students gs WHERE gs.group_id = g.id AND gs.student_id = ss.id)`;

class HttpError extends Error {
  constructor(status, code, message) { super(message); this.status = status; this.code = code; }
}
const asyncRoute = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul' }).format(new Date());
const todayMmdd = today.slice(5, 7) + today.slice(8, 10);
const otherMmdd = todayMmdd === '0101' ? '0102' : '0101';
const month = today.slice(0, 7);

async function withApi(run) {
  const db = new PGlite();
  await db.exec(`
    CREATE TABLE classroom_schools (id BIGINT PRIMARY KEY, name TEXT, enabled BOOLEAN, school_code TEXT, office_code TEXT, location_name TEXT);
    CREATE TABLE classroom_users (id BIGINT PRIMARY KEY, email TEXT);
    CREATE TABLE classroom_classes (id BIGINT PRIMARY KEY, school_id BIGINT, academic_year INTEGER, grade INTEGER, class_number INTEGER, teacher_user_id BIGINT);
    CREATE TABLE classroom_teachers (id BIGSERIAL PRIMARY KEY, school_id BIGINT, user_id BIGINT, google_email TEXT, academic_year INTEGER, grade INTEGER, class_number INTEGER, active BOOLEAN);
    CREATE TABLE school_students (id BIGSERIAL PRIMARY KEY, school_id BIGINT, academic_year INTEGER, grade INTEGER, class_number INTEGER, student_number TEXT, roster_name TEXT, name_source TEXT, student_email TEXT, guardian1_email TEXT, user_id BIGINT, custom_fields JSONB DEFAULT '{}');
    CREATE TABLE classroom_students (id BIGSERIAL PRIMARY KEY, class_id BIGINT, student_number TEXT, roster_name TEXT, name_source TEXT, birthday_mmdd TEXT, birthday_visible BOOLEAN, roster_active BOOLEAN DEFAULT TRUE, student_email TEXT);
    CREATE TABLE classroom_teacher_dashboard_settings (user_id BIGINT PRIMARY KEY, timetable JSONB, card_order JSONB);
    CREATE TABLE user_storage (user_id BIGINT, app TEXT, item TEXT, value JSONB);
    CREATE TABLE classroom_absence_notices (school_id BIGINT, grade INTEGER, class_number INTEGER, student_number TEXT, notice_type TEXT, expected_date DATE, reason TEXT);
    CREATE TABLE classroom_absence_notes (school_id BIGINT, grade INTEGER, class_number INTEGER, student_number TEXT, reason_type TEXT, reason_detail TEXT, status TEXT, start_date DATE, end_date DATE);
    CREATE TABLE classroom_experiential_apps (school_id BIGINT, grade INTEGER, class_number INTEGER, student_number TEXT, status TEXT, start_date DATE, end_date DATE);
    CREATE TABLE school_general_events (id BIGSERIAL PRIMARY KEY, school_id BIGINT, event_date DATE, end_date DATE, title TEXT, location TEXT, event_time TEXT, period TEXT, target_scope TEXT, target_grades INTEGER[], organizer_name TEXT, created_by BIGINT);
    CREATE TABLE school_public_holidays_cache (school_id BIGINT, year INTEGER, holiday_date DATE, name TEXT, excluded BOOLEAN DEFAULT FALSE);
    CREATE TABLE school_vacation_settings (school_id BIGINT, academic_year INTEGER, is_integrated BOOLEAN, summer_start DATE, summer_end DATE, winter_start DATE, winter_end DATE, spring_start DATE, spring_end DATE, entrance_ceremony_date DATE, graduation_ceremony_date DATE);

    CREATE TABLE learning_boards (id TEXT PRIMARY KEY, owner_id BIGINT, code TEXT, title TEXT, layout TEXT, locked BOOLEAN DEFAULT FALSE, closed BOOLEAN DEFAULT FALSE, created_at TIMESTAMPTZ);
    CREATE TABLE learning_board_members (id TEXT PRIMARY KEY, board_id TEXT, user_id BIGINT);
    CREATE TABLE learning_board_audiences (board_id TEXT, group_id BIGINT);
    CREATE TABLE teacher_groups (id BIGINT PRIMARY KEY, school_id BIGINT, teacher_user_id BIGINT, academic_year INTEGER, group_name TEXT, group_type TEXT, grade INTEGER, class_number INTEGER, auto_homeroom BOOLEAN DEFAULT FALSE);
    CREATE TABLE teacher_group_students (group_id BIGINT, student_id BIGINT);

    INSERT INTO classroom_schools VALUES (1, '시험학교', TRUE, 'S1', 'B10', '시험시');
    INSERT INTO classroom_users VALUES (1, 'a@example.invalid'), (50, 'homeroom@example.invalid'), (51, 'other@example.invalid');
    INSERT INTO classroom_classes VALUES (100, 1, 2026, 6, 2, 51), (101, 1, 2026, 6, 3, 51);
    INSERT INTO classroom_teachers (school_id, user_id, google_email, academic_year, grade, class_number, active)
      VALUES (1, NULL, 'homeroom@example.invalid', 2026, 6, 2, TRUE), (1, 51, 'other@example.invalid', 2026, 6, 3, TRUE);
    INSERT INTO school_students (school_id, academic_year, grade, class_number, student_number, roster_name, name_source, student_email, guardian1_email) VALUES
      (1, 2026, 6, 2, '1', '가학생', NULL, 'a@example.invalid', 'parent@example.invalid'),
      (1, 2026, 6, 2, '2', 'pending-account@example.invalid', 'pending', 'b@example.invalid', NULL),
      (1, 2026, 6, 3, '1', '옆반학생', NULL, 'c@example.invalid', NULL);
    INSERT INTO classroom_students (class_id, student_number, roster_name, birthday_mmdd, birthday_visible, student_email) VALUES
      (100, '1', '겹친줄', '${todayMmdd}', TRUE, 'x@example.invalid'),
      (100, '3', '생일학생', '${todayMmdd}', TRUE, 'y@example.invalid'),
      (100, '4', '다른날학생', '${otherMmdd}', TRUE, NULL),
      (100, '5', '숨긴학생', '${todayMmdd}', FALSE, NULL);
    INSERT INTO classroom_teacher_dashboard_settings VALUES
      (50, '{"월":[{"p":1,"sub":"국어","place":"교실","s":"09:00","e":"09:40","note":"버릴 값"}],"일":[{"p":1,"sub":"안 씀"}]}', '["widget-info","<bad>","widget-timetable"]'),
      (51, '{"월":[{"p":1,"sub":"옆반 과목"}]}', '[]');
    INSERT INTO user_storage VALUES
      (50, 'dashboard', 'preps-mon', '{"1":"색연필","2":"  "}'),
      (50, 'dashboard', 'missing-students', '["1"]'),
      (50, 'blackboard', 'preps-tue', '{"1":"다른 앱"}'),
      (51, 'dashboard', 'preps-mon', '{"1":"옆반 준비물"}');
    INSERT INTO classroom_absence_notices VALUES
      (1, 6, 2, '1', '결석', '${today}', '비밀 사유'),
      (1, 6, 2, '1', '결석', '${today}', '같은 표시'),
      (1, 6, 2, '3', '기타', '${today}', '표시 안 함'),
      (1, 6, 3, '1', '지각', '${today}', '옆반');
    INSERT INTO classroom_absence_notes VALUES (1, 6, 2, '3', '질병 조퇴', '비밀 내용', 'approved', '${today}', '${today}'), (1, 6, 2, '4', '결석', '대기', 'pending', '${today}', '${today}');
    INSERT INTO classroom_experiential_apps VALUES (1, 6, 2, '5', 'approved', '${today}', '${today}');
    INSERT INTO school_general_events (school_id, event_date, title, target_scope, target_grades, organizer_name, created_by) VALUES
      (1, '${today}', '전교 행사', 'ALL', '{}', '담당자', 50),
      (1, '${today}', '6학년 행사', 'GRADE', '{6}', '담당자', 50),
      (1, '${today}', '3학년 행사', 'GRADE', '{3}', '담당자', 50),
      (1, '${today}', '한 반 행사', 'CLASS', '{}', '담당자', 50);
    INSERT INTO learning_boards (id, owner_id, code, title, layout, locked, closed, created_at) VALUES
      ('old', 50, '1111', '오래된 게시판', 'wall', FALSE, FALSE, '2026-01-01'),
      ('new', 50, '2222', '새 게시판', 'quiz', FALSE, FALSE, '2026-02-01'),
      ('cubes', 50, '3333', '쌓기 게시판', 'stacking', FALSE, FALSE, '2026-03-01'),
      ('locked', 50, '4444', '닫힌 게시판', 'wall', TRUE, FALSE, '2026-04-01'),
      ('ended', 50, '5555', '끝난 게시판', 'wall', FALSE, TRUE, '2026-05-01'),
      ('joined', 50, '6666', '참여한 닫힌 게시판', 'wall', TRUE, FALSE, '2026-06-01'),
      ('other', 51, '7777', '옆반 게시판', 'wall', FALSE, FALSE, '2026-07-01'),
      ('club', 51, '8888', '동아리 게시판', 'wall', FALSE, FALSE, '2026-08-01'),
      ('private', 50, '9999', '공개 안 한 게시판', 'wall', FALSE, FALSE, '2026-09-01'),
      ('gone', 50, '1212', '지운 카드의 게시판', 'wall', FALSE, FALSE, '2026-10-01');
    INSERT INTO learning_board_members VALUES ('m1', 'joined', 1), ('m2', 'locked', 2);
    INSERT INTO teacher_groups VALUES
      (1, 1, 50, 2026, '6-2', 'homeroom', 6, 2, TRUE),
      (2, 1, 51, 2026, '6-3', 'homeroom', 6, 3, TRUE),
      (3, 1, 51, 2026, '과학 동아리', 'club', NULL, NULL, FALSE),
      (4, 1, 51, 2026, '다른 동아리', 'club', NULL, NULL, FALSE),
      (5, 1, 51, 2026, '6-2', 'homeroom', 6, 2, FALSE);
    UPDATE school_students SET user_id = 1 WHERE student_number = '1' AND class_number = 2;
    INSERT INTO teacher_group_students SELECT 3, id FROM school_students WHERE student_number = '1' AND class_number = 2;
    INSERT INTO learning_board_audiences VALUES
      ('old', 1), ('new', 1), ('cubes', 1), ('locked', 1), ('ended', 1), ('joined', 1),
      ('other', 2), ('club', 3), ('club', 4), ('gone', 77);
    INSERT INTO school_vacation_settings (school_id, academic_year, is_integrated, summer_start) VALUES (1, 2026, TRUE, '2026-07-20');
  `);
  const pool = { query: async (sql, params) => { const r = await db.query(sql, params); return { rows: r.rows, rowCount: r.rows.length }; } };
  const members = {
    1: { schoolId: '1', academicYear: 2026, grade: 6, classNumber: 2, studentNumber: '1', studentName: '가학생' },
    2: { schoolId: '1', academicYear: 2026, grade: 6, classNumber: 9, studentNumber: '1', studentName: '새반학생' }
  };
  let holidayLoads = 0, holidayFailure = false;
  const { router } = createStudentClassDashboard({
    pool, HttpError, asyncRoute, requireDatabase() {}, groupMemberSql: () => GROUP_MEMBER_SQL,
    requireUser: async req => {
      if (!req.get('x-user')) throw new HttpError(401, 'LOGIN_REQUIRED', '로그인');
      return { id: Number(req.get('x-user')) };
    },
    studentMembership: async id => members[id] || null,
    ensurePublicHolidays: async (schoolId, year) => {
      holidayLoads += 1;
      if (holidayFailure) throw new Error('down');
      await pool.query('INSERT INTO school_public_holidays_cache VALUES ($1, $2, $3, $4, FALSE), ($1, $2, $5, $6, TRUE)', [schoolId, year, `${year}-01-01`, '새해', `${year}-02-02`, '뺀 날']);
    }
  });
  const app = express();
  app.use('/d', router);
  app.use((error, _req, res, _next) => res.status(error.status || 500).json({ code: error.code, message: error.message }));
  const server = await new Promise(resolve => { const s = app.listen(0, '127.0.0.1', () => resolve(s)); });
  const get = async (path, user = 1) => {
    const res = await fetch(`http://127.0.0.1:${server.address().port}/d${path}`, { headers: user ? { 'x-user': String(user) } : {} });
    return { status: res.status, body: await res.json() };
  };
  try {
    await run({ get, db, holidays: { count: () => holidayLoads, fail: value => { holidayFailure = value; } } });
  } finally {
    await new Promise(resolve => server.close(resolve));
    await db.close();
  }
}

test('only a signed-in student on a roster can open any part of the dashboard', () => withApi(async ({ get }) => {
  for (const path of ['/', '/attendance', `/events?month=${month}`, '/holidays?year=2026', '/vacation?academicYear=2026']) {
    assert.equal((await get(path, 0)).status, 401, path);
    const teacher = await get(path, 50);
    assert.equal(teacher.status, 403, path);
    assert.equal(teacher.body.code, 'STUDENT_CLASS_REQUIRED');
  }
}));

test('the class bundle carries the homeroom timetable, cleaned preps and card order, not another teacher\'s', () => withApi(async ({ get }) => {
  const { status, body } = await get('/');
  assert.equal(status, 200);
  assert.equal(body.classroom.id, '100');
  assert.equal(body.classroom.isReadOnly, true);
  assert.deepEqual(body.timetable, { 월: [{ p: 1, sub: '국어', place: '교실', s: '09:00', e: '09:40' }] });
  assert.deepEqual(body.preps, { 'preps-mon': { 1: '색연필' } });
  assert.deepEqual(body.cardOrder, ['widget-info', 'widget-timetable']);
}));

test('the roster exposes only numbers, names and today\'s shared birthday', () => withApi(async ({ get }) => {
  const { body } = await get('/');
  const students = body.classroom.students;
  assert.deepEqual(students.map(s => s.number), ['1', '2', '3', '4', '5']);
  for (const student of students) assert.deepEqual(Object.keys(student).sort(), ['birthdayMmdd', 'birthdayVisible', 'name', 'number']);
  assert.equal(students[0].name, '가학생', 'the school roster line wins over the class copy');
  assert.equal(students[1].name, '', 'a placeholder built from an account address is not sent');
  assert.deepEqual(students.filter(s => s.birthdayVisible).map(s => [s.number, s.birthdayMmdd]), [['3', todayMmdd]]);
  assert.equal(students.find(s => s.number === '4').birthdayMmdd, '');
  assert.doesNotMatch(JSON.stringify(body), /example\.invalid|옆반/);
}));

test('attendance lists today\'s types for this class without reasons or sources', () => withApi(async ({ get }) => {
  const { body } = await get('/attendance');
  assert.equal(body.date, today);
  assert.equal(body.classId, '100');
  assert.deepEqual(body.alerts, [
    { studentNumber: '1', noticeType: '결석' },
    { studentNumber: '3', noticeType: '조퇴' },
    { studentNumber: '5', noticeType: '체험학습' }
  ]);
  assert.doesNotMatch(JSON.stringify(body), /사유|내용|source/);
}));

test('school events are limited to the whole school and the student\'s grade', () => withApi(async ({ get }) => {
  const { body } = await get(`/events?month=${month}`);
  assert.deepEqual(body.events.map(e => e.title), ['전교 행사', '6학년 행사']);
  assert.ok(body.events.every(e => !('organizer_name' in e) && !('created_by' in e)));
  assert.equal((await get('/events?month=nope')).status, 400);
}));

test('holidays are cached once, skip excluded days and report an outage; vacation settings are read-only', () => withApi(async ({ get, holidays }) => {
  assert.deepEqual((await get('/holidays?year=2026')).body.holidays, [{ date: '2026-01-01', name: '새해' }]);
  await get('/holidays?year=2026');
  assert.equal(holidays.count(), 1);
  holidays.fail(true);
  assert.equal((await get('/holidays?year=2030')).status, 502);
  assert.equal((await get('/holidays?year=1')).status, 400);
  assert.equal((await get('/vacation?academicYear=2026')).body.settings.summer_start, '2026-07-20');
  assert.equal((await get('/vacation?academicYear=2027')).body.settings, null);
}));

test('a class that no teacher has opened yet still answers with an empty dashboard', () => withApi(async ({ get }) => {
  const { status, body } = await get('/', 2);
  assert.equal(status, 200);
  assert.equal(body.classroom.id, null);
  assert.deepEqual(body.timetable, {});
  assert.deepEqual(body.preps, {});
  assert.deepEqual((await get('/attendance', 2)).body.alerts, []);
}));

test('only boards opened to the student\'s class or group appear; closed ones stay visible to students already inside', () => withApi(async ({ get, db }) => {
  assert.equal((await get('/boards', 0)).status, 401);
  assert.equal((await get('/boards', 50)).status, 403);
  assert.deepEqual((await get('/boards')).body.boards, [
    { title: '동아리 게시판', href: '/boards/?code=8888' },
    { title: '참여한 닫힌 게시판', href: '/boards/?code=6666' },
    { title: '쌓기 게시판', href: '/learning/literacy-numeracy/math-tools/stacking-cubes/coop/?code=3333' },
    { title: '새 게시판', href: '/boards/?code=2222' },
    { title: '오래된 게시판', href: '/boards/?code=1111' }
  ]);
  assert.deepEqual((await get('/boards', 2)).body.boards, [], 'another class sees none of them');
  await db.exec("INSERT INTO learning_board_audiences VALUES ('other', 5)");
  assert.equal((await get('/boards')).body.boards[0].title, '동아리 게시판');
  assert.ok((await get('/boards')).body.boards.some(b => b.title === '옆반 게시판'), 'a teacher can open a board to a class card imported from the roster');
}));
