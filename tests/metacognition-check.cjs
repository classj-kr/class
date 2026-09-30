// Targeted checks for the self-check activity; no live services or student data.
const { spawnSync, execFileSync } = require('node:child_process');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const dir = 'learning/literacy-numeracy/metacognition/';
function run(args) {
  const out = spawnSync(process.execPath, args, { cwd: root, encoding: 'utf8', windowsHide: true });
  if (out.status !== 0) { process.stdout.write(out.stdout); process.stderr.write(out.stderr); process.exit(out.status || 1); }
  console.log('PASS ' + args.join(' ') + ': ' + out.stdout.trim().split('\n').pop());
}
run([dir + 'test-metrics.js']);
for (let grade = 3; grade <= 9; grade++) run([dir + 'test-grade' + grade + '-items.js']);
run(['--test', 'game-hub-server/metacognition-contract.test.mjs', 'tests/student-tablet-entry-contract.test.mjs']);
for (const file of ['app.js', 'metrics.js', ...Array.from({length: 7}, (_, i) => 'items-grade' + (i + 3) + '.js')]) {
  new vm.Script(fs.readFileSync(path.join(root, dir, file), 'utf8'), { filename: file });
}
// Old version aliases are safe only while response identities/answer keys/kinds remain identical.
for (const file of ['items.js', ...Array.from({length: 7}, (_, i) => 'items-grade' + (i + 3) + '.js')]) {
  const old = { module: { exports: {} } };
  const source = execFileSync('git', ['show', 'HEAD:' + dir + file], { cwd: root, encoding: 'utf8', windowsHide: true });
  vm.runInNewContext(source, old);
  const before = Object.values(old.module.exports).find(value => Array.isArray(value) && value[0]?.id);
  const after = Object.values(require(path.join(root, dir, file))).find(value => Array.isArray(value) && value[0]?.id);
  const keys = rows => JSON.stringify(rows.map(({ id, answer, kind, lure }) => ({ id, answer, kind, lure })));
  assert.equal(keys(before), keys(after), file + ': legacy answer key changed');
}
console.log('PASS all syntax checks and historical answer-key compatibility');

// Exercise the real router with an isolated in-memory query stub, never the classroom database.
async function checkServer() {
  const express = require('../game-hub-server/node_modules/express');
  const { createMetacognition } = require('../game-hub-server/metacognition');
  const inserted = [];
  const statements = [];
  class HttpError extends Error {
    constructor(status, code, message) { super(message); this.status = status; this.code = code; }
  }
  const activity = createMetacognition({
    pool: { query: async (sql, values) => {
      if (sql.includes('SELECT s.id AS student_id')) return { rows: [] };
      if (sql.includes('INSERT INTO metacognition_attempts')) {
        inserted.push(values);
        statements.push({ sql, values });
        return { rows: [{ id: inserted.length, created_at: new Date(0) }] };
      }
      throw new Error('Unexpected query');
    } },
    requireUser: async () => ({ id: 1, role: 'student' }),
    requireDatabase: () => {}, requireTeacher: async () => ({ id: 1 }), HttpError,
    asyncRoute: fn => (req, res, next) => Promise.resolve(fn(req, res)).catch(next)
  });
  assert.equal(activity.available, true);
  const app = express();
  app.use(express.json()); app.use(activity.router);
  app.use((error, _req, res, _next) => res.status(error.status || 500).json({ error: error.code || error.message }));
  const server = await new Promise(resolve => { const instance = app.listen(0, '127.0.0.1', () => resolve(instance)); });
  try {
    const url = 'http://127.0.0.1:' + server.address().port + '/attempts';
    for (let grade = 2; grade <= 9; grade++) {
      const file = grade === 2 ? 'items.js' : 'items-grade' + grade + '.js';
      const items = Object.values(require(path.join(root, dir, file))).find(value => Array.isArray(value) && value[0]?.id);
      const versions = grade === 2 ? ['metacog-v2', 'metacog-v3'] : ['metacog-g' + grade + '-v1', 'metacog-g' + grade + '-v2'];
      for (const itemSetVersion of versions) {
        const responses = items.map(item => ({ id: item.id, choice: item.answer, confidence: 100, ms: 1234 }));
        const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ itemSetVersion, responses, summary: { accuracy: 0, profileKey: 'unchecked' } }) });
        assert.equal(res.status, 201, itemSetVersion);
        const result = await res.json();
        assert.equal(result.summary.accuracy, 1, 'server recomputes scores');
        assert.equal(result.summary.profileKey, 'reflection-v1', 'server does not store a learner type');
        assert.equal(inserted.at(-1)[15], 'reflection-v1');
        assert.equal(inserted.at(-1)[18], 0);
      }
      const unknownRows = items.map(item => ({ id: item.id, choice: -1, confidence: null, ms: 1234 }));
      const unknownRes = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ itemSetVersion: versions[1], responses: unknownRows }) });
      assert.equal(unknownRes.status, 201, versions[1] + ' all unknown');
      const unknownResult = await unknownRes.json();
      assert.equal(unknownResult.summary.unknownCount, items.length);
      assert.equal(unknownResult.summary.wrongCount, 0);
      assert.equal(unknownResult.summary.confidence, null);
      assert.equal(inserted.at(-1)[18], items.length);
      assert.throws(() => activity.normalizeResponses(items, unknownRows.map(row => ({ ...row, confidence: 25 }))), error => error.code === 'INCOMPLETE_ATTEMPT');
      assert.throws(() => activity.normalizeResponses(items, unknownRows.map(row => ({ ...row, choice: null, confidence: 100 }))), error => error.code === 'INCOMPLETE_ATTEMPT');
    }
    const unknown = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ itemSetVersion: 'unknown', responses: [] }) });
    assert.equal(unknown.status, 400);
    assert.equal((await unknown.json()).error, 'UNKNOWN_ITEM_SET');
    console.log('PASS router saves all 16 old/new version combinations with recomputed results');
    const { PGlite } = require('../game-hub-server/node_modules/@electric-sql/pglite');
    const db = new PGlite();
    try {
      await db.exec('CREATE TABLE classroom_users (id BIGINT PRIMARY KEY); CREATE TABLE classroom_students (id BIGINT PRIMARY KEY); CREATE TABLE classroom_classes (id BIGINT PRIMARY KEY); INSERT INTO classroom_users VALUES (1);');
      await db.exec(fs.readFileSync(path.join(root, 'game-hub-server/migrations/004-metacognition.sql'), 'utf8'));
      const migration = fs.readFileSync(path.join(root, 'game-hub-server/migrations/005-metacognition-unknown.sql'), 'utf8');
      await db.exec(migration);
      await db.exec(migration);
      for (const entry of statements) await db.query(entry.sql, entry.values);
      const result = await db.query('SELECT COUNT(*)::int AS total FROM metacognition_attempts WHERE unknown_count = item_count AND mean_confidence IS NULL AND bias IS NULL AND brier IS NULL');
      assert.equal(result.rows[0].total, 8);
      await assert.rejects(db.exec('UPDATE metacognition_attempts SET unknown_count = item_count + 1'));
      console.log('PASS PostgreSQL migrations and real inserts, including all-unknown results');
    } finally { await db.close(); }
  } finally { await new Promise(resolve => server.close(resolve)); }
}
checkServer().catch(error => { console.error(error); process.exitCode = 1; });
