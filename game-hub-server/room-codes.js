const crypto = require('node:crypto');

// A lease protects creation. After it expires, authoritative room existence
// (including persistent boards) must be checked before a number can be reused.
function createRoomCodes({ pool, legacyTaken = async () => false, isActive = async () => false, random = () => crypto.randomInt(1000, 10000) }) {
  const memory = new Map();
  async function initialize() {
    if (pool) await pool.query(`CREATE TABLE IF NOT EXISTS site_room_codes (
      code CHAR(4) PRIMARY KEY CHECK (code ~ '^[0-9]{4}$'),
      activity TEXT NOT NULL, lease_until TIMESTAMPTZ NOT NULL
    )`);
  }
  async function lookup(code, db = pool) {
    if (!/^\d{4}$/.test(code)) return null;
    if (!db) return memory.get(code) || null;
    return (await db.query('SELECT code, activity, lease_until FROM site_room_codes WHERE code=$1', [code])).rows[0] || null;
  }
  async function claim(activity, code, db = pool) {
    if (!/^\d{4}$/.test(code)) return false;
    const previous = await lookup(code, db);
    if (previous && (new Date(previous.lease_until).getTime() > Date.now() || await isActive(previous))) return false;
    if (await legacyTaken(code, db)) return false;
    if (!db) {
      if (memory.get(code) !== previous && memory.has(code)) return false;
      memory.set(code, { code, activity, lease_until: new Date(Date.now() + 300000) });
      return true;
    }
    const result = await db.query(`INSERT INTO site_room_codes(code,activity,lease_until)
      VALUES($1,$2,NOW()+INTERVAL '5 minutes') ON CONFLICT(code) DO UPDATE
      SET activity=EXCLUDED.activity, lease_until=EXCLUDED.lease_until
      WHERE site_room_codes.lease_until <= NOW() RETURNING code`, [code, activity]);
    return result.rows.length > 0;
  }
  async function allocate(activity, db = pool) {
    const first = random();
    for (let i = 0; i < 9000; i++) {
      const code = String(1000 + (first - 1000 + i) % 9000);
      if (await claim(activity, code, db)) return code;
    }
    throw Object.assign(new Error('사용할 수 있는 방번호가 없습니다. 종료된 방을 정리해 주세요.'), { status: 503 });
  }
  return { initialize, lookup, claim, allocate };
}
module.exports = { createRoomCodes };
