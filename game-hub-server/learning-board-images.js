const express = require('express');
const { randomUUID } = require('node:crypto');

const MAX_IMAGE_BYTES = 3 * 1024 * 1024;
const MAX_BOARD_IMAGE_BYTES = 100 * 1024 * 1024;
const IMAGE_ID = /^[a-f\d-]{36}$/i;

function imageType(data) {
  if (data.length > 12 && data.subarray(0, 4).toString('latin1') === 'RIFF' && data.subarray(8, 12).toString('latin1') === 'WEBP') return 'image/webp';
  if (data.length > 8 && data[0] === 0x89 && data.subarray(1, 4).toString('latin1') === 'PNG') return 'image/png';
  if (data.length > 3 && data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff) return 'image/jpeg';
  if (data.length > 6 && /^GIF8[79]a$/.test(data.subarray(0, 6).toString('latin1'))) return 'image/gif';
  return null;
}

function installBoardImages({ router, asyncRoute, transaction, fail, pool, board, actor }) {
  const parseRaw = express.raw({ type: () => true, limit: MAX_IMAGE_BYTES });
  // The platform error handler answers non-HttpErrors with a generic 500.
  const rawImage = (req, res, next) => parseRaw(req, res, error => {
    if (!error) return next();
    try { fail(error.type === 'entity.too.large' ? 413 : 400, 'INVALID_IMAGE', error.type === 'entity.too.large' ? '그림은 3MB까지 올릴 수 있어요.' : '그림을 받지 못했어요. 다시 올려 주세요.'); }
    catch (converted) { next(converted); }
  });
  // Upload first, then attach with POST /posts { image }. Unattached uploads expire.
  router.post('/:id/images', rawImage, asyncRoute(async (req, res) => {
    const result = await transaction(req, async (db, b, who) => {
      if (b.closed && !who.teacher) fail(403, 'BOARD_CLOSED', '글쓰기가 마감되었어요.');
      if (['quiz', 'stacking'].includes(b.layout)) fail(400, 'IMAGES_NOT_ALLOWED', '이 게시판에는 그림을 올릴 수 없어요.');
      const data = Buffer.isBuffer(req.body) ? req.body : null;
      const mime = data && data.length ? imageType(data) : null;
      if (!mime) fail(400, 'INVALID_IMAGE', 'PNG·JPG·WebP·GIF 그림만 올릴 수 있어요.');
      await db.query("DELETE FROM learning_board_images WHERE board_id=$1 AND post_id IS NULL AND created_at < NOW() - INTERVAL '1 hour'", [b.id]);
      const used = (await db.query('SELECT COALESCE(SUM(size),0)::bigint AS total FROM learning_board_images WHERE board_id=$1', [b.id])).rows[0].total;
      if (Number(used) + data.length > MAX_BOARD_IMAGE_BYTES) fail(409, 'IMAGE_STORAGE_FULL', '게시판 그림 저장 공간이 가득 찼어요. 선생님께 알려 주세요.');
      const id = randomUUID();
      await db.query('INSERT INTO learning_board_images(id, board_id, member_id, mime, size, data) VALUES($1,$2,$3,$4,$5,$6)',
        [id, b.id, who.teacher ? null : who.id, mime, data.length, data]);
      return { id };
    });
    res.status(201).json(result);
  }));

  router.get('/:id/images/:imageId', asyncRoute(async (req, res) => {
    if (!IMAGE_ID.test(req.params.imageId)) fail(404, 'IMAGE_NOT_FOUND', '그림을 찾을 수 없어요.');
    // A whole class loads every picture at once: read without the board row lock.
    const b = await board(pool, req.params.id);
    const who = await actor(req, b, pool);
    const row = (await pool.query(`SELECT i.mime, i.data, i.member_id, i.post_id, p.hidden FROM learning_board_images i
      LEFT JOIN learning_board_posts p ON p.board_id=i.board_id AND p.id=i.post_id
      WHERE i.board_id=$1 AND i.id=$2`, [b.id, req.params.imageId])).rows[0];
    const uploader = who.teacher ? row?.member_id === null : row?.member_id === who.id;
    if (!row || !(who.teacher || (row.post_id ? !row.hidden : uploader))) fail(404, 'IMAGE_NOT_FOUND', '그림을 찾을 수 없어요.');
    // The id never points at different bytes, so the browser may keep it.
    res.set('Cache-Control', 'private, max-age=31536000, immutable');
    res.set('X-Content-Type-Options', 'nosniff');
    res.type(row.mime).send(Buffer.from(row.data));
  }));
}

// Bind an uploaded image to a freshly inserted post (inside its transaction).
async function attachBoardImage(db, b, who, postId, imageId, fail) {
  if (imageId === undefined || imageId === null || imageId === '') return;
  if (typeof imageId !== 'string' || !IMAGE_ID.test(imageId)) fail(400, 'INVALID_IMAGE', '그림을 다시 올려 주세요.');
  const attached = await db.query(`UPDATE learning_board_images SET post_id=$3
    WHERE board_id=$1 AND id=$2 AND post_id IS NULL AND member_id IS NOT DISTINCT FROM $4 RETURNING id`,
  [b.id, imageId, postId, who.teacher ? null : who.id]);
  if (!attached.rowCount) fail(409, 'IMAGE_EXPIRED', '그림을 찾지 못했어요. 다시 올려 주세요.');
}

module.exports = { installBoardImages, attachBoardImage, imageType, MAX_IMAGE_BYTES };
