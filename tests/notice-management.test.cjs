const test = require('node:test');
const assert = require('node:assert/strict');
const { createHarness } = require('./notice-management-harness.cjs');

test('sent notices enforce ownership and immutable structure while preserving existing responses', async () => {
    const h = await createHarness();
    const api = async (id, method = 'GET', body, user = 1) => {
        const response = await fetch(h.base + `/api/teacher/notices${id == null ? '' : '/' + id}`, {
            method, headers: { 'Content-Type': 'application/json', ...(user ? { 'x-test-user': String(user) } : {}) },
            ...(body === undefined ? {} : { body: JSON.stringify(body) })
        });
        return { status: response.status, body: await response.json() };
    };
    try {
        assert.equal((await api(101, 'GET', undefined, null)).status, 401);
        assert.equal((await api(101, 'GET', undefined, 5)).status, 403);
        assert.equal((await api(101, 'GET', undefined, 2)).status, 404);
        assert.equal((await api(101, 'DELETE', { version: 0 }, 2)).status, 404);
        assert.equal((await api(101, 'GET', undefined, 4)).status, 404, 'other-school admins have no access');
        assert.equal((await api(103)).status, 404, 'author identity does not bypass school isolation');
        assert.equal((await api(104)).status, 404, 'legacy sender names do not establish ownership');
        const listed = (await api(null)).body.notices;
        assert.equal(listed.find(n => n.id === '101').canManage, true);
        assert.equal(listed.find(n => n.id === '102').canManage, false, 'homeroom reply viewers cannot manage someone else\'s notice');
        assert.equal(listed.some(n => n.id === '103'), false);
        assert.equal((await api(null, 'GET', undefined, 3)).body.notices.every(n => n.canManage), true);

        const before = {};
        for (const table of ['classroom_notice_questions', 'classroom_notice_replies', 'classroom_notice_answers', 'classroom_notice_recipients']) {
            before[table] = (await h.db.query(`SELECT * FROM ${table}`)).rows;
        }
        const change = { title: '현장체험학습 안내 (시간 정정)', contentBody: '금요일 8시 50분까지 교실로 모여 주세요.', version: 0 };
        const updated = await api(101, 'PATCH', change);
        assert.equal(updated.status, 200);
        assert.equal(updated.body.notice.version, 1);
        assert.equal(updated.body.notice.contentBody, change.contentBody);
        assert.ok(updated.body.notice.updatedAt);
        for (const table of Object.keys(before)) {
            assert.deepEqual((await h.db.query(`SELECT * FROM ${table}`)).rows, before[table], `${table} is unchanged by an edit`);
        }
        assert.equal((await h.db.query('SELECT reply_type,target_type FROM classroom_notices WHERE id=101')).rows[0].reply_type, 'agree');
        for (const [key, value] of Object.entries({ questions: [], questionType: 'text', questionText: '바뀐 질문', options: ['다른 보기'], replyType: 'none', targetType: 'class', studentIds: [99], contentType: 'pdf', sender_user_id: 2 })) {
            const result = await api(101, 'PATCH', { ...change, version: 1, [key]: value });
            assert.equal(result.status, 400, `${key} must be rejected, not silently applied`);
            assert.equal(result.body.code, 'NOTICE_STRUCTURE_LOCKED');
        }
        assert.equal((await api(101, 'PATCH', change)).status, 409, 'stale editors cannot overwrite a newer revision');
        assert.equal((await api(101, 'DELETE', { version: 0 })).status, 409, 'a stale list cannot delete a revised notice');
        assert.equal((await api(101, 'PATCH', { ...change, title: ' ', version: 1 })).status, 400);
        assert.equal((await api(101, 'PATCH', { ...change, contentBody: '', version: 1 })).status, 400);
        assert.equal((await api('invalid')).status, 400);
        assert.equal((await api(105, 'PATCH', { title: '첨부 제목 수정', contentBody: '새본문', version: 0 })).status, 400);
        assert.equal((await api(105, 'PATCH', { title: '첨부 제목 수정', contentBody: '예전문서.pdf', version: 0 })).status, 200);
        assert.equal((await api(104, 'DELETE', { version: 0 }, 3)).status, 200, 'school admins can remove legacy notices');
        assert.equal((await api(101, 'DELETE', { version: 1 })).status, 200);
        assert.equal((await api(101)).status, 404);
        for (const table of Object.keys(before)) assert.equal((await h.db.query(`SELECT * FROM ${table}`)).rows.length, 0, `${table} cascades on deletion`);
        assert.deepEqual((await h.db.query('SELECT item_kind FROM classroom_classboard_item_reads')).rows, [{ item_kind: 'post' }]);
        assert.equal((await h.db.query('SELECT id FROM classroom_notices WHERE id=102')).rows.length, 1, 'other notices are preserved');
    } finally { await h.close(); }
});
