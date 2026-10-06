// 계정별 서버 저장 공간(/api/me/storage)만 붙인 작은 서버. 화면을 실제 브라우저로 열어
// "브라우저에 남기지 않고 서버에 저장하는지"를 확인하는 검사들이 함께 쓴다.
// 쿠키 test_user=1 이면 로그인한 계정(id 1), 없으면 게스트로 본다(401 → 저장 안 함).
const path = require('node:path');
const express = require('../game-hub-server/node_modules/express');
const { PGlite } = require('../game-hub-server/node_modules/@electric-sql/pglite');
const { createUserStorage } = require('../game-hub-server/user-storage');

class HttpError extends Error { constructor(status, code, message) { super(message); this.status = status; this.code = code; } }

// me(user) 를 주면 /api/auth/me 응답을 바꿀 수 있다(교사 화면 검사용).
async function startHarness({ extraRoutes, me } = {}) {
  const db = new PGlite();
  await db.exec('CREATE TABLE classroom_users(id BIGINT PRIMARY KEY); INSERT INTO classroom_users VALUES(1),(2);');
  const pool = { query: (sql, args) => db.query(sql, args) };
  const userOf = (req) => { const m = /test_user=(1|2)/.exec(req.headers.cookie || ''); return m ? { id: Number(m[1]) } : null; };
  const requireUser = async (req) => { const user = userOf(req); if (!user) throw new HttpError(401, 'AUTH_REQUIRED', '로그인'); return user; };
  const feature = createUserStorage({ pool, requireUser, requireDatabase() {}, HttpError,
    asyncRoute: (fn) => (req, res, next) => Promise.resolve(fn(req, res)).catch(next) });
  await feature.initialize();
  const app = express();
  app.use(express.json({ limit: '1100kb' }));
  app.get('/api/auth/me', (req, res) => {
    const user = userOf(req);
    if (!user) return res.json({ signedIn: false });
    if (me) return res.json(me(user));
    res.json({ signedIn: true, user: { id: user.id, name: '검증 학생', role: 'student' }, membership: { studentName: '검증 학생', grade: 3, classNumber: 1, studentNumber: '7' } });
  });
  if (extraRoutes) extraRoutes(app, { db, pool, userOf });
  app.use('/api/me/storage', feature.router);
  app.use('/api', (_req, res) => res.status(404).json({ error: 'NOT_IN_HARNESS' }));
  app.use((error, _req, res, _next) => res.status(error.status || 500).json({ error: error.code, message: error.message }));
  // 서버가 쪽마다 박아 넣는 이름을 흉내 낸다.
  app.use((req, res, next) => {
    if (!/\.html$|\/$/.test(req.path)) return next();
    const file = path.resolve(__dirname, '..', '.' + (req.path.endsWith('/') ? req.path + 'index.html' : req.path));
    require('node:fs').readFile(file, 'utf8', (error, html) => {
      if (error) return next();
      const name = userOf(req) ? '검증 학생' : '';
      res.type('html').send(html.replace(/<head[^>]*>/i, (m) => `${m}<script>window.CLASS_PLAYER_NAME=${JSON.stringify(name)};window.CLASS_PLAYER_KIND=${JSON.stringify(name ? 'student' : '')}</script>`));
    });
  });
  app.use(express.static(path.resolve(__dirname, '..')));
  const server = await new Promise((resolve) => { const s = app.listen(0, '127.0.0.1', () => resolve(s)); });
  const base = `http://127.0.0.1:${server.address().port}`;
  return {
    db, pool, base,
    async items(app, userId = 1) {
      const rows = (await db.query('SELECT item, value FROM user_storage WHERE user_id = $1 AND app = $2', [userId, app])).rows;
      return Object.fromEntries(rows.map((row) => [row.item, row.value]));
    },
    async close() { await new Promise((resolve) => server.close(resolve)); await db.close(); }
  };
}

module.exports = { startHarness, HttpError };
