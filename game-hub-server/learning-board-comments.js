const { randomUUID } = require('node:crypto');

function installBoardComments({ router, asyncRoute, transaction, fail, text, integer }) {
  async function accessible(db, b, postId) {
    if (!b.comments_enabled) fail(403, 'COMMENTS_DISABLED', '댓글 기능이 꺼져 있어요.');
    const post = (await db.query("SELECT id FROM learning_board_posts WHERE board_id=$1 AND id=$2 AND NOT hidden AND kind='note'", [b.id, postId])).rows[0];
    if (!post) fail(404, 'POST_NOT_FOUND', '댓글을 달 글을 찾을 수 없어요.');
  }
  function writable(b, who) {
    if (b.closed && !who.teacher) fail(403, 'BOARD_CLOSED', '글쓰기가 마감되었어요.');
  }
  const mine = (c, who) => who.teacher ? c.member_id === null : c.member_id === who.id;
  const route = '/:id/posts/:postId/comments';
  router.get(route, asyncRoute(async (req, res) => {
    const result = await transaction(req, async (db, b, who) => {
      await accessible(db, b, req.params.postId);
      const rows = (await db.query(`SELECT c.*, m.number, m.name FROM learning_board_comments c
        LEFT JOIN learning_board_members m ON m.board_id=c.board_id AND m.id=c.member_id
        WHERE c.board_id=$1 AND c.post_id=$2 ORDER BY c.created_at, c.id`, [b.id, req.params.postId])).rows;
      return { comments: rows.map(c => ({ id: c.id, content: c.content, revision: c.revision, edited: c.revision > 1,
        createdAt: c.created_at, author: c.member_id === null ? '선생님' : b.hide_names && !who.teacher ? `${c.number}번` : `${c.number}번 ${c.name}`,
        canEdit: mine(c, who) && (!b.closed || who.teacher), canDelete: who.teacher || mine(c, who) })) };
    });
    res.json(result);
  }));
  router.post(route, asyncRoute(async (req, res) => {
    const result = await transaction(req, async (db, b, who) => {
      await accessible(db, b, req.params.postId); writable(b, who);
      const content = text(req.body?.content, 500, true);
      const count = (await db.query('SELECT COUNT(*)::int AS count FROM learning_board_comments WHERE board_id=$1 AND post_id=$2', [b.id, req.params.postId])).rows[0].count;
      if (count >= 100) fail(409, 'COMMENT_LIMIT', '한 글에 댓글을 100개까지 달 수 있어요.');
      const id = randomUUID();
      await db.query('INSERT INTO learning_board_comments(id,board_id,post_id,member_id,content) VALUES($1,$2,$3,$4,$5)',
        [id, b.id, req.params.postId, who.teacher ? null : who.id, content]);
      return { id };
    });
    res.status(201).json(result);
  }));
  router.patch(route + '/:commentId', asyncRoute(async (req, res) => {
    await transaction(req, async (db, b, who) => {
      await accessible(db, b, req.params.postId); writable(b, who);
      const c = (await db.query('SELECT * FROM learning_board_comments WHERE board_id=$1 AND post_id=$2 AND id=$3', [b.id, req.params.postId, req.params.commentId])).rows[0];
      if (!c) fail(404, 'COMMENT_NOT_FOUND', '댓글을 찾을 수 없어요.');
      if (!mine(c, who)) fail(403, 'NOT_YOUR_COMMENT', '내가 쓴 댓글만 수정할 수 있어요.');
      const revision = integer(req.body?.revision, 1, 2147483647);
      if (c.revision !== revision) fail(409, 'STALE_COMMENT', '다른 기기에서 수정된 댓글이에요. 취소한 뒤 다시 수정해 주세요.');
      await db.query('UPDATE learning_board_comments SET content=$4, revision=revision+1 WHERE board_id=$1 AND post_id=$2 AND id=$3',
        [b.id, req.params.postId, c.id, text(req.body?.content, 500, true)]);
    });
    res.json({ ok: true });
  }));
  router.delete(route + '/:commentId', asyncRoute(async (req, res) => {
    await transaction(req, async (db, b, who) => {
      await accessible(db, b, req.params.postId);
      const c = (await db.query('SELECT * FROM learning_board_comments WHERE board_id=$1 AND post_id=$2 AND id=$3', [b.id, req.params.postId, req.params.commentId])).rows[0];
      if (!c) fail(404, 'COMMENT_NOT_FOUND', '댓글을 찾을 수 없어요.');
      if (!who.teacher && !mine(c, who)) fail(403, 'NOT_YOUR_COMMENT', '내가 쓴 댓글만 삭제할 수 있어요.');
      await db.query('DELETE FROM learning_board_comments WHERE board_id=$1 AND post_id=$2 AND id=$3', [b.id, req.params.postId, c.id]);
    });
    res.json({ ok: true });
  }));
}
module.exports = { installBoardComments };
