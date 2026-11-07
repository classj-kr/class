const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { PGlite } = require('../game-hub-server/node_modules/@electric-sql/pglite');
const { classboardItemReadSchema, createClassboardReadState } = require('../game-hub-server/classboard-read-state');
const { classboardAvatars } = require('../game-hub-server/classboard-avatars');
const platform = fs.readFileSync(path.join(__dirname, '../game-hub-server/classroom-platform.js'), 'utf8');
const noticeTargetSql = platform.match(/const NOTICE_TARGET_SQL = `([\s\S]+?)`;/)[1];

test('individual reads, legacy baseline, new posts and board boundaries use real SQL', async () => {
  const db = new PGlite();
  try {
    await db.exec(`
      CREATE TABLE classroom_users(id BIGINT PRIMARY KEY);
      INSERT INTO classroom_users VALUES(1),(2),(3);
      CREATE TABLE classroom_classboard_posts(id BIGINT PRIMARY KEY, class_id BIGINT, group_id BIGINT, author_user_id BIGINT, created_at TIMESTAMPTZ);
      CREATE TABLE classroom_classboard_reads(user_id BIGINT, board_key TEXT, last_read_at TIMESTAMPTZ);
      CREATE TABLE classroom_notices(id BIGINT PRIMARY KEY, school_id BIGINT, target_type TEXT, target_grade INTEGER, target_class_number INTEGER, target_student_numbers TEXT, created_at TIMESTAMPTZ);
      CREATE TABLE classroom_notice_recipients(notice_id BIGINT, grade INTEGER, class_number INTEGER, student_number TEXT);
      INSERT INTO classroom_classboard_posts VALUES
        (1,100,NULL,1,'2026-11-01'),(2,100,NULL,1,'2026-11-02'),(3,100,NULL,2,'2026-11-03'),
        (4,NULL,55,1,'2026-11-04'),(5,NULL,99,1,'2026-11-05');
      INSERT INTO classroom_classboard_reads VALUES(2,'class:100','2026-11-01 12:00Z');
      INSERT INTO classroom_notices VALUES
        (11,5,'all',NULL,NULL,NULL,'2026-11-01'),
        (12,5,'students',NULL,NULL,NULL,'2026-11-02'),
        (13,9,'all',NULL,NULL,NULL,'2026-11-03');
      INSERT INTO classroom_notice_recipients VALUES(12,6,2,'7');
    `);
    await db.exec(classboardItemReadSchema);
    await db.exec(classboardItemReadSchema); // repeat startup
    const state = createClassboardReadState({ pool: db, noticeTargetSql });
    const student = { id: 2 }, otherStudent = { id: 3 };
    const classroom = { key: 'class:100', kind: 'class', id: '100' };
    const group = { key: 'group:55', kind: 'group', id: '55' };
    const notice = { key: 'notice:6-2-7', kind: 'notice', child: { schoolId: 5, grade: 6, classNumber: 2, studentNumber: '7' } };
    const boards = [classroom, group, notice];
    assert.equal((await state.counts(student, boards)).get(classroom.key), 1, 'own posts and old reads are excluded');
    assert.deepEqual((await state.readIds(student, classroom)).sort(), ['1', '3']);
    assert.equal((await state.counts(student, boards)).get(classroom.key), 1, 'fetching read ids does not change state');
    assert.deepEqual(await state.markRead(student, classroom, ['2', '4', '5']), ['2'], 'only ids belonging to this board are acknowledged');
    assert.deepEqual(await state.markRead(student, classroom, ['2']), ['2'], 'repeat acknowledgement is idempotent');
    assert.equal((await state.counts(student, boards)).get(classroom.key) || 0, 0);
    assert.equal((await state.counts(student, boards)).get(group.key), 1, 'another group remains unread');
    assert.equal((await state.counts(otherStudent, boards)).get(classroom.key), 3, 'another account retains its own reads');
    await db.exec("INSERT INTO classroom_classboard_posts VALUES (6,100,NULL,1,'2026-11-06')");
    assert.equal((await state.counts(student, boards)).get(classroom.key), 1, 'a post arriving during a visit stays unread');
    assert.equal((await state.counts(student, boards)).get(notice.key), 2);
    assert.deepEqual(await state.markRead(student, notice, ['11', '13']), ['11'], 'foreign-school notices cannot be marked');
    assert.equal((await state.counts(student, boards)).get(notice.key), 1);
    assert.deepEqual(await state.readIds(student, notice), ['11']);
    const otherChild = { ...notice, key: 'notice:6-2-8', child: { ...notice.child, studentNumber: '8' } };
    assert.equal((await state.counts(student, [otherChild])).get(otherChild.key), 1, 'child-specific read state is separate');
    assert.deepEqual(await state.markRead(student, otherChild, ['12']), [], 'recipient restrictions apply to acknowledgements');
  } finally { await db.close(); }
});

test('feed avatars follow teacher settings and the current student roster, including email linkage', async () => {
  const db = new PGlite();
  try {
    await db.exec(`
      CREATE TABLE classroom_users(id BIGINT, email TEXT);
      CREATE TABLE classroom_teacher_settings(user_id BIGINT, avatar_key TEXT);
      CREATE TABLE school_students(id BIGINT, user_id BIGINT, student_email TEXT, avatar_key TEXT, academic_year INTEGER);
      CREATE TABLE classroom_students(id BIGINT, user_id BIGINT, student_email TEXT, avatar_key TEXT, class_id BIGINT);
      CREATE TABLE classroom_classes(id BIGINT, academic_year INTEGER);
      INSERT INTO classroom_users VALUES(1,'teacher@school.kr'),(2,'kid@school.kr'),(3,'unset@school.kr');
      INSERT INTO classroom_teacher_settings VALUES(1,'animal-bear.webp');
      INSERT INTO classroom_classes VALUES(100,2025);
      INSERT INTO classroom_students VALUES(1,2,NULL,'animal-bee.webp',100);
      INSERT INTO school_students VALUES(2,NULL,'KID@school.kr','animal-cat.webp',2026);
    `);
    const avatars = await classboardAvatars(db, [1, 2, 2, 3], key => key ? `/assets/avatars/${key}` : '');
    assert.equal(avatars.get('1'), '/assets/avatars/animal-bear.webp');
    assert.equal(avatars.get('2'), '/assets/avatars/animal-cat.webp');
    assert.equal(avatars.get('3'), '', 'unset avatars use the same UI fallback, never a Google photo');
  } finally { await db.close(); }
});

test('group card member totals deduplicate roster sources and exclude retired or unrelated students', async () => {
  const db = new PGlite();
  try {
    await db.exec(`
      CREATE TABLE classroom_classes(id BIGINT, school_id BIGINT, academic_year INTEGER, grade INTEGER, class_number INTEGER, teacher_user_id BIGINT);
      CREATE TABLE school_master_timetable(school_id BIGINT, academic_year INTEGER, teacher_user_id BIGINT, grade INTEGER, class_number INTEGER);
      CREATE TABLE classroom_students(class_id BIGINT, student_number TEXT, roster_active BOOLEAN);
      CREATE TABLE school_students(id BIGINT, school_id BIGINT, academic_year INTEGER, grade INTEGER, class_number INTEGER, student_number TEXT, custom_fields JSONB);
      CREATE TABLE teacher_groups(id BIGINT, school_id BIGINT, academic_year INTEGER, group_type TEXT, group_name TEXT, grade INTEGER, class_number INTEGER);
      CREATE TABLE teacher_group_students(group_id BIGINT, student_id BIGINT);
      INSERT INTO classroom_classes VALUES(100,5,2026,6,2,1),(101,5,2026,4,1,4),(102,5,2026,5,1,4),(103,5,2025,6,2,1),(104,5,2026,3,1,NULL);
      INSERT INTO school_master_timetable VALUES(5,2026,1,5,1);
      INSERT INTO classroom_students VALUES(100,'1',true),(100,'2',true),(100,'3',false);
      INSERT INTO school_students VALUES
        (1,5,2026,6,2,'1','{"동아리":"오케스트라"}'),
        (2,5,2026,4,1,'1','{}'),
        (3,9,2026,6,2,'1','{"동아리":"오케스트라"}');
      INSERT INTO teacher_groups VALUES(55,5,2026,'club','오케스트라',NULL,NULL),(99,9,2026,'club','오케스트라',NULL,NULL);
      INSERT INTO teacher_group_students VALUES(55,2);
    `);
    const memberPredicate = platform.match(/const GROUP_MEMBER_SQL = `([\s\S]+?)`;/)[1];
    const query = platform.match(/async function classboardMemberCounts\(boards\)[\s\S]+?`([\s\S]+?)`/)[1]
      .replace('${GROUP_MEMBER_SQL}', memberPredicate);
    const result = await db.query(query, [['100'], ['55']]);
    assert.deepEqual(new Map(result.rows.map(r => [r.board_key, r.member_count])), new Map([['class:100', 2], ['group:55', 2]]));
    const scopeSource = platform.slice(platform.indexOf('async function classboardScope'));
    const scopeQuery = scopeSource.match(/const listRes = await pool.query\(\s*`([\s\S]+?)`/)[1];
    const scoped = await db.query(scopeQuery, [5, 1, [4], 2026]);
    assert.deepEqual(scoped.rows.filter(r => r.teaching).map(r => String(r.id)).sort(), ['100', '101', '102'],
      'owned classes, assigned grades and timetable classes appear; archived and unrelated classes do not');
  } finally { await db.close(); }
});
