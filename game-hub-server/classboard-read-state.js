"use strict";

// The old board timestamp remains a read-only baseline for existing readers.
// New visits acknowledge individual items, never everything in a board.
const classboardItemReadSchema = `CREATE TABLE IF NOT EXISTS classroom_classboard_item_reads (
  user_id BIGINT NOT NULL REFERENCES classroom_users(id) ON DELETE CASCADE,
  board_key TEXT NOT NULL,
  item_kind TEXT NOT NULL CHECK (item_kind IN ('post', 'notice')),
  item_id BIGINT NOT NULL,
  read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, board_key, item_kind, item_id)
)`;

function createClassboardReadState({ pool, noticeTargetSql }) {
  function source(user, board) {
    if (board.kind === 'notice') {
      const c = board.child;
      return {
        kind: 'notice', table: 'classroom_notices n', alias: 'n',
        where: noticeTargetSql,
        params: [c.schoolId, c.grade, c.classNumber, c.studentNumber, user.id, board.key],
        userParam: '$5', boardParam: '$6', own: 'FALSE'
      };
    }
    return {
      kind: 'post', table: 'classroom_classboard_posts p', alias: 'p',
      where: 'p.class_id IS NOT DISTINCT FROM $1::BIGINT AND p.group_id IS NOT DISTINCT FROM $2::BIGINT',
      params: [board.kind === 'class' ? board.id : null, board.kind === 'group' ? board.id : null, user.id, board.key],
      userParam: '$3', boardParam: '$4', own: 'p.author_user_id = $3'
    };
  }

  function seen(s) {
    return `(${s.own} OR EXISTS (
      SELECT 1 FROM classroom_classboard_reads r
      WHERE r.user_id = ${s.userParam} AND r.board_key = ${s.boardParam}
        AND ${s.alias}.created_at <= r.last_read_at
    ) OR EXISTS (
      SELECT 1 FROM classroom_classboard_item_reads ir
      WHERE ir.user_id = ${s.userParam} AND ir.board_key = ${s.boardParam}
        AND ir.item_kind = '${s.kind}' AND ir.item_id = ${s.alias}.id
    ))`;
  }

  async function readIds(user, board) {
    const s = source(user, board);
    const result = await pool.query(`SELECT ${s.alias}.id FROM ${s.table} WHERE (${s.where}) AND ${seen(s)}`, s.params);
    return result.rows.map(row => String(row.id));
  }

  async function markRead(user, board, ids) {
    const s = source(user, board);
    const result = await pool.query(
      `INSERT INTO classroom_classboard_item_reads (user_id, board_key, item_kind, item_id)
       SELECT ${s.userParam}, ${s.boardParam}, '${s.kind}', ${s.alias}.id
       FROM ${s.table} WHERE (${s.where}) AND ${s.alias}.id = ANY($${s.params.length + 1}::BIGINT[])
       ON CONFLICT (user_id, board_key, item_kind, item_id)
       DO UPDATE SET read_at = classroom_classboard_item_reads.read_at
       RETURNING item_id`, [...s.params, ids]
    );
    return result.rows.map(row => String(row.item_id));
  }

  async function counts(user, boards) {
    if (!boards.length) return new Map();
    const result = await pool.query(
      `SELECT CASE WHEN p.group_id IS NULL THEN 'class:' || p.class_id
                   ELSE 'group:' || p.group_id END AS board_key, COUNT(*) AS unread
       FROM classroom_classboard_posts p
       LEFT JOIN classroom_classboard_reads r ON r.user_id = $1
         AND r.board_key = CASE WHEN p.group_id IS NULL THEN 'class:' || p.class_id ELSE 'group:' || p.group_id END
       WHERE (p.class_id = ANY($2::BIGINT[]) OR p.group_id = ANY($3::BIGINT[]))
         AND p.author_user_id <> $1
         AND (r.last_read_at IS NULL OR p.created_at > r.last_read_at)
         AND NOT EXISTS (
           SELECT 1 FROM classroom_classboard_item_reads ir
           WHERE ir.user_id = $1 AND ir.item_kind = 'post' AND ir.item_id = p.id
             AND ir.board_key = CASE WHEN p.group_id IS NULL THEN 'class:' || p.class_id ELSE 'group:' || p.group_id END
         )
       GROUP BY 1`,
      [user.id, boards.filter(b => b.kind === 'class').map(b => b.id), boards.filter(b => b.kind === 'group').map(b => b.id)]
    );
    const totals = new Map(result.rows.map(r => [r.board_key, Number(r.unread)]));
    for (const board of boards.filter(b => b.kind === 'notice')) {
      const s = source(user, board);
      const res = await pool.query(`SELECT COUNT(*)::INTEGER AS unread FROM ${s.table} WHERE (${s.where}) AND NOT ${seen(s)}`, s.params);
      totals.set(board.key, Number(res.rows[0]?.unread || 0));
    }
    return totals;
  }
  return { counts, readIds, markRead };
}

module.exports = { classboardItemReadSchema, createClassboardReadState };
