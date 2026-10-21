const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

// Execute the production access middleware, replacing only database/session inputs.
// No real account cookies or classroom data are used by this test harness.
function createAccessGate({ role = 'student', member = true, disabled = [], onContentQuery = () => {}, isLiveRaceRequest } = {}) {
  const source = fs.readFileSync(path.join(__dirname, '../game-hub-server/classroom-platform.js'), 'utf8');
  const start = source.indexOf('  function normalizeContentPath(value)');
  const end = source.indexOf('  function signMuseumPresence', start);
  assert.ok(start >= 0 && end > start);
  const deps = {
    asyncRoute: fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next),
    getGloballyDisabledContentPaths: async () => disabled,
    getSiteAccessMode: async () => 'restricted',
    sessionUser: async () => role ? { id: 1, role } : null,
    studentMembership: async () => member ? { classId: 10 } : null,
    guestAccess: () => null,
    userClassId: async () => 10,
    pool: { async query() { onContentQuery(); return { rows: [] }; } },
    CLASS_CONTENT_OPEN_SQL: 'class content grant query',
    options: { isLiveRaceRequest },
    HttpError: class extends Error {
      constructor(status, code, message) { super(message); this.status = status; this.code = code; }
    }
  };
  return new Function(...Object.keys(deps), source.slice(start, end) + '\nreturn requireSiteAccess;')(...Object.values(deps));
}
module.exports = { createAccessGate };
