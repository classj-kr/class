// Real PostgreSQL queries in isolated PGlite; no production accounts or Google calls.
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const Module = require('node:module');
const { PGlite } = require('../game-hub-server/node_modules/@electric-sql/pglite');
const express = require('../game-hub-server/node_modules/express');

async function main() {
    const db = new PGlite();
    let initialized = false;
    const ddl = [];
    class Pool {
        on() {}
        async query(sql, params) {
            if (!initialized) { ddl.push(String(sql)); return { rows: [], rowCount: 0 }; }
            const result = await db.query(sql, params);
            return { ...result, rowCount: result.affectedRows ?? result.rows.length };
        }
        async connect() { return { query: this.query.bind(this), release() {} }; }
    }
    const originalLoad = Module._load;
    Module._load = function (name, ...args) { return name === 'pg' ? { Pool } : originalLoad.call(this, name, ...args); };
    let platform;
    try {
        const { createClassroomPlatform } = require('../game-hub-server/classroom-platform');
        platform = createClassroomPlatform({ databaseUrl: 'postgres://isolated/test', googleClientId: 'test' });
    } finally { Module._load = originalLoad; }
    await platform.initialize();
    await db.exec(`
        CREATE TABLE classroom_users (id BIGINT PRIMARY KEY, email TEXT, display_name TEXT, role TEXT, picture_url TEXT, google_domain TEXT);
        CREATE TABLE classroom_sessions (token_hash TEXT, user_id BIGINT, expires_at TIMESTAMPTZ);
        CREATE TABLE classroom_schools (id BIGINT PRIMARY KEY, name TEXT, enabled BOOLEAN);
        CREATE TABLE classroom_teachers (id BIGINT PRIMARY KEY, school_id BIGINT, teacher_name TEXT, teacher_type TEXT,
            academic_year INTEGER, grade INTEGER, class_number INTEGER, user_id BIGINT, google_email TEXT, active BOOLEAN);
        CREATE TABLE classroom_classes (id BIGINT PRIMARY KEY, school_id BIGINT, academic_year INTEGER, grade INTEGER, class_number INTEGER,
            teacher_user_id BIGINT, updated_at TIMESTAMPTZ DEFAULT NOW());
        CREATE TABLE classroom_students (id BIGINT, class_id BIGINT, user_id BIGINT, roster_name TEXT, birthday_mmdd TEXT, birthday_visible BOOLEAN);
        CREATE TABLE school_students (id BIGINT, school_id BIGINT, grade INTEGER, class_number INTEGER, user_id BIGINT, student_email TEXT);
        CREATE TABLE classroom_schedules (id BIGINT, class_id BIGINT, event_date DATE, title TEXT, details TEXT);
        CREATE TABLE school_annual_schedules (id BIGINT, school_id BIGINT, event_date DATE, title TEXT, details TEXT,
            category TEXT, target_scope TEXT, target_grades INTEGER[], event_type TEXT);
        INSERT INTO classroom_users VALUES
            (1, 'teacher@example.kr', '김교사', 'teacher', NULL, 'example.kr'),
            (2, 'other@example.kr', '이교사', 'teacher', NULL, 'example.kr'),
            (3, 'child@example.kr', '학생', 'student', NULL, 'example.kr');
        INSERT INTO classroom_schools VALUES (10, '테스트학교', TRUE), (20, '다른학교', TRUE);
        INSERT INTO classroom_teachers VALUES
            (11, 10, '김교사', '담임', 2026, 4, 1, NULL, 'teacher@example.kr', TRUE),
            (12, 20, '이교사', '담임', 2026, 4, 1, 2, 'other@example.kr', TRUE);
        INSERT INTO classroom_classes VALUES (100, 10, 2026, 4, 1, 1, NOW()), (200, 20, 2026, 4, 1, 2, NOW());
        INSERT INTO classroom_students VALUES (30, 100, 3, '학생', '1001', TRUE);
    `);
    const migration = ddl.find(sql => sql.includes('CREATE TABLE IF NOT EXISTS classroom_teacher_settings'));
    assert.ok(migration);
    await db.exec(migration); await db.exec(migration);
    for (const id of [1, 2, 3]) await db.query('INSERT INTO classroom_sessions VALUES ($1, $2, NOW() + INTERVAL \'1 day\')',
        [crypto.createHash('sha256').update(`test-${id}`).digest('hex'), id]);
    initialized = true;
    const app = express();
    app.use(express.json()); app.use('/api', platform.router);
    app.use((err, _req, res, _next) => res.status(err.status || 500).json({ code: err.code, message: err.message }));
    const server = await new Promise(resolve => { const instance = app.listen(0, '127.0.0.1', () => resolve(instance)); });
    const base = `http://127.0.0.1:${server.address().port}/api`;
    const request = async (route, id = 1, body) => {
        const response = await fetch(base + route, { method: body ? 'PATCH' : 'GET',
            headers: { Cookie: `class_session=test-${id}`, 'Content-Type': 'application/json' },
            ...(body ? { body: JSON.stringify(body) } : {}) });
        return { status: response.status, data: await response.json() };
    };
    try {
        let result = await request('/teacher/settings');
        assert.equal(result.status, 200); assert.equal(result.data.profile.birthdayVisible, false);
        assert.ok(result.data.profile.avatar.options.length > 100);
        const key = result.data.profile.avatar.options[0].key;
        for (const body of [{ birthdayMmdd: '0230', birthdayVisible: true }, { birthdayMmdd: '', birthdayVisible: true },
            { birthdayMmdd: '19901001', birthdayVisible: true }, { birthdayMmdd: '1001', birthdayVisible: 'true' }]) {
            assert.equal((await request('/teacher/settings', 1, body)).status, 400);
        }
        assert.equal((await request('/teacher/settings', 3)).status, 403);
        assert.equal((await request('/teacher/settings', 3, { birthdayMmdd: '1001', birthdayVisible: true })).status, 403);
        assert.equal((await request('/teacher/avatar', 1, { avatarKey: '../../bad.svg' })).status, 400);
        assert.equal((await request('/teacher/avatar', 1, { avatarKey: key })).status, 200);
        result = await request('/teacher/settings', 1, { userId: 2, birthdayMmdd: '1001', birthdayVisible: true });
        assert.equal(result.data.profile.avatar.key, key, 'birthday change preserves avatar');
        assert.equal((await request('/teacher/settings', 2)).data.profile.birthdayVisible, false, 'cannot write another account');
        let schedules = await request('/class/schedules?classId=100&month=2026-10');
        assert.equal(schedules.status, 200, JSON.stringify(schedules.data));
        const birthday = schedules.data.schedules.find(row => row.id === 'birthday-teacher-1-2026');
        assert.equal(birthday.title, '김교사 선생님 생일 🎂'); assert.equal(birthday.date, '2026-10-01');
        assert.equal(schedules.data.schedules.some(row => row.title === '학생 생일 🎂'), true);
        schedules = await request('/class/schedules?month=2026-10', 3);
        assert.equal(schedules.status, 200, JSON.stringify(schedules.data));
        assert.ok(schedules.data.schedules.some(row => row.id === birthday.id), 'student sees opted-in teacher birthday');
        assert.equal((await request('/class/schedules?classId=200', 1)).status, 403, 'cannot read another school');
        await request('/teacher/settings', 2, { birthdayMmdd: '1002', birthdayVisible: true });
        schedules = await request('/class/schedules?classId=100&month=2026-10');
        assert.equal(schedules.data.schedules.some(row => row.id.startsWith('birthday-teacher-2-')), false);
        await request('/teacher/settings', 1, { birthdayMmdd: '1001', birthdayVisible: false });
        schedules = await request('/class/schedules?month=2026-10', 3);
        assert.equal(schedules.data.schedules.some(row => row.id === birthday.id), false, 'opting out removes public birthday');
        assert.equal((await request('/teacher/settings')).data.profile.birthdayMmdd, '1001', 'private birthday retained');
        await request('/teacher/settings', 1, { birthdayMmdd: '0229', birthdayVisible: true });
        schedules = await request('/class/schedules?classId=100&month=2028-02');
        assert.ok(schedules.data.schedules.some(row => row.date === '2028-02-29'), 'selected leap year works');
        await db.exec('UPDATE classroom_teachers SET active = FALSE WHERE id = 11');
        assert.equal((await request('/teacher/settings')).status, 403);
        schedules = await request('/class/schedules?month=2028-02', 3);
        assert.equal(schedules.data.schedules.some(row => row.id.startsWith('birthday-teacher-1-')), false);
        console.log('PASS teacher settings: real SQL, role authorization, avatar validation, per-account writes, birthday publication, opt-out, class isolation, leap year');
    } finally { await new Promise(resolve => server.close(resolve)); await db.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
