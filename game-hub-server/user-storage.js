'use strict';
// 계정별 작은 저장 공간. 화면들이 브라우저(localStorage)에 두던 것을 로그인한 계정에 묶어
// 서버에 둔다. 기기가 바뀌어도 따라가고, 공용 컴퓨터에 남지 않는다. 게스트(로그인 없음)는
// 저장하지 않는다 -- 2026-10-06 사용자 결정.
const express = require('express');
const fs = require('node:fs');
const path = require('node:path');

// 항목 이름에는 화면이 쓰던 열쇠 그대로(한글·쌍점 포함)를 허용한다. 빗금과 공백만 막는다.
const NAME = /^[\p{L}\p{N}_.:@-]{1,128}$/u;
const MAX_VALUE_BYTES = 1024 * 1024;   // 칠판 획처럼 큰 것도 들어간다
const MAX_ITEMS_PER_APP = 500;

function createUserStorage({ pool, requireUser, requireDatabase, HttpError, asyncRoute }) {
  const router = express.Router();
  const fail = (code, message, status = 400) => { throw new HttpError(status, code, message); };

  async function initialize() {
    if (pool) await pool.query(fs.readFileSync(path.join(__dirname, 'migrations/009-user-storage.sql'), 'utf8'));
  }

  function names(req) {
    const app = String(req.params.app || '');
    const item = req.params.item === undefined ? null : String(req.params.item);
    if (!NAME.test(app)) fail('STORAGE_APP_INVALID', '저장 공간 이름이 올바르지 않습니다.');
    if (item !== null && !NAME.test(item)) fail('STORAGE_ITEM_INVALID', '항목 이름이 올바르지 않습니다.');
    return { app, item };
  }

  // 한 공간의 항목을 모두 준다. 화면이 열릴 때 한 번 받아 두고 쓴다.
  router.get('/:app', asyncRoute(async (req, res) => {
    requireDatabase();
    const user = await requireUser(req);
    const { app } = names(req);
    const rows = (await pool.query('SELECT item, value FROM user_storage WHERE user_id = $1 AND app = $2 ORDER BY item', [user.id, app])).rows;
    res.setHeader('Cache-Control', 'no-store');
    res.json({ items: Object.fromEntries(rows.map((row) => [row.item, row.value])) });
  }));

  router.put('/:app/:item', asyncRoute(async (req, res) => {
    requireDatabase();
    const user = await requireUser(req);
    const { app, item } = names(req);
    if (!req.body || !('value' in req.body)) fail('STORAGE_VALUE_REQUIRED', '저장할 값이 없습니다.');
    const value = req.body.value;
    if (value === undefined || typeof value === 'function') fail('STORAGE_VALUE_INVALID', '저장할 수 없는 값입니다.');
    const encoded = JSON.stringify(value === undefined ? null : value);
    if (Buffer.byteLength(encoded, 'utf8') > MAX_VALUE_BYTES) fail('STORAGE_VALUE_TOO_LARGE', '저장할 값이 너무 큽니다(1MB까지).', 413);
    const count = (await pool.query('SELECT COUNT(*)::int AS n FROM user_storage WHERE user_id = $1 AND app = $2 AND item <> $3', [user.id, app, item])).rows[0].n;
    if (count >= MAX_ITEMS_PER_APP) fail('STORAGE_TOO_MANY_ITEMS', '이 공간에 둘 수 있는 항목 수를 넘었습니다.', 409);
    await pool.query(
      `INSERT INTO user_storage (user_id, app, item, value, updated_at) VALUES ($1, $2, $3, $4::jsonb, NOW())
       ON CONFLICT (user_id, app, item) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
      [user.id, app, item, encoded]
    );
    res.json({ ok: true });
  }));

  router.delete('/:app/:item', asyncRoute(async (req, res) => {
    requireDatabase();
    const user = await requireUser(req);
    const { app, item } = names(req);
    await pool.query('DELETE FROM user_storage WHERE user_id = $1 AND app = $2 AND item = $3', [user.id, app, item]);
    res.json({ ok: true });
  }));

  // 공간째 비우기(화면의 "모두 지우기" 단추용).
  router.delete('/:app', asyncRoute(async (req, res) => {
    requireDatabase();
    const user = await requireUser(req);
    const { app } = names(req);
    await pool.query('DELETE FROM user_storage WHERE user_id = $1 AND app = $2', [user.id, app]);
    res.json({ ok: true });
  }));

  return { router, initialize };
}

module.exports = { createUserStorage, NAME, MAX_VALUE_BYTES, MAX_ITEMS_PER_APP };
