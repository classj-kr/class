const fs = require('node:fs');
const path = require('node:path');
const express = require('../game-hub-server/node_modules/express');
const { PGlite } = require('../game-hub-server/node_modules/@electric-sql/pglite');
const { noticeManagementSchema, NOTICE_MANAGE_SQL, registerNoticeManagement } = require('../game-hub-server/notice-management');
const { classboardItemReadSchema } = require('../game-hub-server/classboard-read-state');

async function createHarness() {
    const db = new PGlite();
    const source = fs.readFileSync(path.join(__dirname, '../game-hub-server/classroom-platform.js'), 'utf8');
    await db.exec('CREATE TABLE classroom_users(id BIGINT PRIMARY KEY); INSERT INTO classroom_users VALUES(1),(2),(3),(4),(5); CREATE TABLE classroom_classes(id BIGINT, teacher_user_id BIGINT, grade INTEGER, class_number INTEGER); INSERT INTO classroom_classes VALUES(100,1,6,2);');
    for (const table of ['classroom_notices', 'classroom_notice_recipients', 'classroom_notice_replies', 'classroom_notice_questions', 'classroom_notice_answers']) {
        const sql = source.match(new RegExp('`(CREATE TABLE IF NOT EXISTS ' + table + ' \\([\\s\\S]*?\\n      \\))`'))[1];
        await db.exec(sql);
    }
    await db.exec('ALTER TABLE classroom_notices ADD COLUMN sender_user_id BIGINT REFERENCES classroom_users(id), ADD COLUMN reply_type TEXT DEFAULT \'none\'');
    for (let pass = 0; pass < 2; pass++) for (const sql of noticeManagementSchema) await db.exec(sql);
    await db.exec(classboardItemReadSchema);
    await db.exec(`
      INSERT INTO classroom_notices(id,school_id,sender_user_id,sender_teacher_name,title,content_type,content_body,target_type,reply_type) VALUES
        (101,5,1,'박화승','현장체험학습 안내','text','금요일 9시까지 교실로 모여 주세요.','all','agree'),
        (102,5,2,'김교사','다른 선생님 통신문','text','공통 안내입니다.','all','none'),
        (103,9,1,'박화승','다른 학교 안내','text','학교가 다릅니다.','all','none'),
        (104,5,NULL,'이전 교사','이전 통신문','text','작성자 계정 연결 전 글입니다.','all','none'),
        (105,5,1,'박화승','이전 첨부 문서','pdf','예전문서.pdf','all','none'),
        (106,5,1,'박화승','준비물 안내','text','색연필을 준비해 주세요.','all','none');
      INSERT INTO classroom_notice_recipients(notice_id,school_id,grade,class_number,student_number,student_name) VALUES(101,5,6,2,'7','김학생');
      INSERT INTO classroom_notice_questions(id,notice_id,position,question_text,question_type,options,is_required) VALUES(11,101,0,'참여 가능 시간을 골라 주세요.','single','["오전","오후"]',true);
      INSERT INTO classroom_notice_replies(id,notice_id,school_id,grade,class_number,student_number,student_name,responder_user_id,reply_choice) VALUES(41,101,5,6,2,'7','김학생',5,'agree');
      INSERT INTO classroom_notice_answers(reply_id,question_id,choice_indexes) VALUES(41,11,'{0}');
      INSERT INTO classroom_classboard_item_reads(user_id,board_key,item_kind,item_id) VALUES(5,'notice:6-2-7','notice',101),(5,'class:100','post',101);
    `);
    let tail = Promise.resolve();
    async function lease() { const before = tail; let release; tail = new Promise(resolve => { release = resolve; }); await before; return release; }
    const pool = {
        async query(sql, args) { const release = await lease(); try { return await db.query(sql, args); } finally { release(); } },
        async connect() { const release = await lease(); return { query: (sql, args) => db.query(sql, args), release }; }
    };
    class HttpError extends Error { constructor(status, code, message) { super(message); this.status = status; this.code = code; } }
    const scope = async req => {
        const id = Number(req.headers['x-test-user'] || /test_user=(\d+)/.exec(req.headers.cookie || '')?.[1]);
        if (!id) throw new HttpError(401, 'AUTH_REQUIRED', '로그인이 필요합니다.');
        if (![1, 2, 3, 4].includes(id)) throw new HttpError(403, 'TEACHER_REQUIRED', '교사만 사용할 수 있습니다.');
        return { teacher: { id }, ctx: { school_id: id === 4 ? 9 : 5 }, isAdmin: id === 3 || id === 4 };
    };
    const asyncRoute = fn => (req, res, next) => Promise.resolve(fn(req, res)).catch(next);
    const app = express(), router = express.Router();
    app.use(express.json());
    app.use('/api', router);
    const readScope = source.match(/const NOTICE_TEACHER_SCOPE_SQL = `([\s\S]*?)`;/)[1];
    const listSql = source.slice(source.indexOf('router.get("/teacher/notices",')).match(/pool.query\(\s*`([\s\S]*?)`/)[1]
        .replace('${NOTICE_MANAGE_SQL}', NOTICE_MANAGE_SQL).replace('${NOTICE_TEACHER_SCOPE_SQL}', readScope);
    router.get('/teacher/notices', asyncRoute(async (req, res) => {
        const { teacher, ctx, isAdmin } = await scope(req);
        const result = await pool.query(listSql, [ctx.school_id, isAdmin, teacher.id]);
        res.json({ notices: result.rows.map(n => ({ id: String(n.id), title: n.title, senderName: n.sender_teacher_name,
            canManage: n.can_manage, version: n.edit_version, updatedAt: n.updated_at, createdAt: n.created_at,
            replyType: n.reply_type, replyCount: Number(n.reply_count), agreeCount: Number(n.agree_count), disagreeCount: Number(n.disagree_count) })) });
    }));
    registerNoticeManagement({ router, pool, asyncRoute, HttpError, noticeReadScope: scope });
    app.use('/teacher', express.static(path.join(__dirname, '../apps/teacher')));
    app.use((error, _req, res, _next) => res.status(error.status || 500).json({ code: error.code, message: error.message }));
    const server = app.listen(0, '127.0.0.1');
    await new Promise(resolve => server.once('listening', resolve));
    return { db, pool, base: `http://127.0.0.1:${server.address().port}`, close: async () => { await new Promise(resolve => server.close(resolve)); await db.close(); } };
}

module.exports = { createHarness };
