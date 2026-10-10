const express = require('../game-hub-server/node_modules/express');
const { PGlite } = require('../game-hub-server/node_modules/@electric-sql/pglite');
const { createLearningBoards } = require('../game-hub-server/learning-boards');
const { createRoomCodes } = require('../game-hub-server/room-codes');
const { createRoomEntry } = require('../game-hub-server/room-entry');
const path = require('node:path');

class HttpError extends Error {
  constructor(status, code, message) { super(message); this.status = status; this.code = code; }
}

async function createHarness() {
  const db = new PGlite();
  await db.exec('CREATE TABLE classroom_users(id BIGINT PRIMARY KEY); INSERT INTO classroom_users VALUES(1),(2);');
  // PGlite has one connection: lease it for a whole transaction, as pg.Pool does.
  let tail = Promise.resolve();
  async function lease() {
    const previous = tail; let release;
    tail = new Promise(resolve => { release = resolve; });
    await previous;
    return release;
  }
  async function rawQuery(sql, args) {
    const result = !args && sql.includes('CREATE TABLE') ? (await db.exec(sql)).at(-1) : await db.query(sql, args);
    return { ...result, rowCount: result.rows.length || result.affectedRows || 0 };
  }
  const pool = {
    async query(sql, args) { const release = await lease(); try { return await rawQuery(sql, args); } finally { release(); } },
    async connect() { const release = await lease(); return { query: rawQuery, release }; }
  };
  const sessionUser = async req => {
    const match = /(?:^|;\s*)test_teacher=(1|2)(?:;|$)/.exec(req.headers.cookie || '');
    return match ? { id: Number(match[1]), role: 'teacher' } : null;
  };
  const failures = new Map();
  const roomCodes = createRoomCodes({ pool, legacyTaken: async (code, client) =>
    (await client.query('SELECT 1 FROM learning_boards WHERE code=$1', [code])).rows.length > 0 });
  await roomCodes.initialize();
  const feature = createLearningBoards({ pool, sessionUser,
    allocateRoomCode: client => roomCodes.allocate('board', client),
    requireTeacher: async req => { const user = await sessionUser(req); if (!user) throw new HttpError(401, 'AUTH_REQUIRED', '선생님 로그인이 필요해요.'); return user; },
    requireDatabase() {}, HttpError, asyncRoute: fn => (req, res, next) => Promise.resolve(fn(req, res)).catch(next),
    failureLimiter: { enforce(req) { if ((failures.get(req.ip) || 0) >= 30) throw new HttpError(429, 'RATE_LIMIT', '잠시 후 다시 시도해 주세요.'); }, recordFailure(req) { failures.set(req.ip, (failures.get(req.ip) || 0) + 1); } }
  });
  await feature.initialize();
  await feature.initialize(); // repeat boot is safe
  const app = express(); app.use(express.json({ limit: '32kb' }));
  app.use('/api/room-entry', createRoomEntry({ roomCodes }));
  app.use('/api/boards', feature.router);
  app.use((error, _req, res, _next) => res.status(error.status || 500).json({ error: error.code, message: error.message }));
  app.use(express.static(path.resolve(__dirname, '..', 'apps')));
  app.use(express.static(path.resolve(__dirname, '..')));
  const server = await new Promise(resolve => { const instance = app.listen(0, '127.0.0.1', () => resolve(instance)); });
  return { db, pool, roomCodes, initialize: feature.initialize, base: `http://127.0.0.1:${server.address().port}`, async close() { await new Promise(resolve => server.close(resolve)); await db.close(); } };
}
module.exports = { createHarness };

if (require.main === module) createHarness().then(h => console.log(`Local test preview: ${h.base}/boards/ (test data only)`));
