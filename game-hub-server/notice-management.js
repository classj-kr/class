"use strict";

const noticeManagementSchema = [
  'ALTER TABLE classroom_notices ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ',
  'ALTER TABLE classroom_notices ADD COLUMN IF NOT EXISTS edit_version INTEGER NOT NULL DEFAULT 0'
];

// Being allowed to collect replies for one's class does not confer ownership
// of a notice sent by someone else. Legacy notices without an author need a
// school administrator; matching a display name is not proof of ownership.
const NOTICE_MANAGE_SQL = 'n.school_id = $1 AND ($2::BOOLEAN OR n.sender_user_id = $3)';

function registerNoticeManagement({ router, pool, asyncRoute, HttpError, noticeReadScope }) {
  function noticeId(req) {
    const id = String(req.params.id || '');
    if (!/^[1-9]\d{0,18}$/.test(id) || BigInt(id) > 9223372036854775807n) {
      throw new HttpError(400, 'INVALID_NOTICE', '잘못된 가정통신문입니다.');
    }
    return id;
  }
  function version(body) {
    if (!Number.isSafeInteger(body?.version) || body.version < 0) {
      throw new HttpError(400, 'NOTICE_VERSION_REQUIRED', '목록을 새로고침한 뒤 다시 시도해 주세요.');
    }
    return body.version;
  }
  function publicNotice(row) {
    return { id: String(row.id), title: row.title, contentType: row.content_type,
      contentBody: row.content_body, version: row.edit_version, updatedAt: row.updated_at };
  }
  async function editable(client, scope, id, lock = false) {
    const result = await client.query(
      `SELECT n.id, n.title, n.content_type, n.content_body, n.edit_version, n.updated_at
       FROM classroom_notices n WHERE ${NOTICE_MANAGE_SQL} AND n.id = $4${lock ? ' FOR UPDATE' : ''}`,
      [scope.ctx.school_id, scope.isAdmin, scope.teacher.id, id]
    );
    if (!result.rows[0]) throw new HttpError(404, 'NOTICE_NOT_FOUND', '수정·삭제할 수 있는 가정통신문을 찾지 못했습니다.');
    return result.rows[0];
  }
  function checkVersion(row, expected) {
    if (row.edit_version !== expected) {
      throw new HttpError(409, 'NOTICE_CHANGED', '다른 곳에서 수정된 통신문입니다. 목록을 새로고침한 뒤 다시 열어 주세요.');
    }
  }

  router.get('/teacher/notices/:id', asyncRoute(async (req, res) => {
    const scope = await noticeReadScope(req);
    const row = await editable(pool, scope, noticeId(req));
    res.set('Cache-Control', 'no-store').json({ notice: publicNotice(row) });
  }));

  router.patch('/teacher/notices/:id', asyncRoute(async (req, res) => {
    const scope = await noticeReadScope(req);
    const id = noticeId(req);
    const allowed = new Set(['title', 'contentBody', 'version']);
    if (!req.body || Array.isArray(req.body) || Object.keys(req.body).some(key => !allowed.has(key))) {
      throw new HttpError(400, 'NOTICE_STRUCTURE_LOCKED', '발송 후에는 제목과 본문만 수정할 수 있습니다. 문항·선택지·회신 방식·수신 대상은 변경할 수 없습니다.');
    }
    const expected = version(req.body);
    if (typeof req.body.title !== 'string' || typeof req.body.contentBody !== 'string' ||
        !req.body.title.trim() || !req.body.contentBody.trim()) {
      throw new HttpError(400, 'TITLE_AND_CONTENT_REQUIRED', '제목과 내용을 입력하세요.');
    }
    const title = req.body.title.trim(), contentBody = req.body.contentBody.trim();
    const client = await pool.connect();
    let row;
    try {
      await client.query('BEGIN');
      row = await editable(client, scope, id, true);
      checkVersion(row, expected);
      if (row.content_type !== 'text' && row.content_body !== contentBody) {
        throw new HttpError(400, 'NOTICE_CONTENT_TYPE_LOCKED', '기존 첨부 문서의 내용은 변경할 수 없습니다.');
      }
      if (row.title !== title || row.content_body !== contentBody) {
        row = (await client.query(
          `UPDATE classroom_notices SET title = $2, content_body = $3,
           updated_at = NOW(), edit_version = edit_version + 1 WHERE id = $1
           RETURNING id, title, content_type, content_body, edit_version, updated_at`,
          [id, title, contentBody]
        )).rows[0];
      }
      await client.query('COMMIT');
    } catch (error) { await client.query('ROLLBACK'); throw error; }
    finally { client.release(); }
    res.json({ ok: true, notice: publicNotice(row) });
  }));

  router.delete('/teacher/notices/:id', asyncRoute(async (req, res) => {
    const scope = await noticeReadScope(req);
    const id = noticeId(req);
    const expected = version(req.body);
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const row = await editable(client, scope, id, true);
      checkVersion(row, expected);
      // Recipients, questions, replies and answers cascade with the notice.
      await client.query('DELETE FROM classroom_notices WHERE id = $1', [id]);
      await client.query("DELETE FROM classroom_classboard_item_reads WHERE item_kind = 'notice' AND item_id = $1", [id]);
      await client.query('COMMIT');
    } catch (error) { await client.query('ROLLBACK'); throw error; }
    finally { client.release(); }
    res.json({ ok: true, noticeId: id });
  }));
}

module.exports = { noticeManagementSchema, NOTICE_MANAGE_SQL, registerNoticeManagement };
