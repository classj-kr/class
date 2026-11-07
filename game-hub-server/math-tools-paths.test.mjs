import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { PGlite } from '@electric-sql/pglite';
import grants from './subject-content-grants.js';

const migration = readFileSync(new URL('./migrations/026-math-tools-paths.sql', import.meta.url), 'utf8');
const source = readFileSync(new URL('./classroom-platform.js', import.meta.url), 'utf8');
const start = source.indexOf('  function normalizeContentPath(value)');
const normalize = new Function(source.slice(start, source.indexOf('  function contentRootForStaticAsset', start)) + '\nreturn normalizeContentPath;')();
const oldRoot = '/learning/inquiry/math', root = '/learning/literacy-numeracy/math-tools';

test('old settings submissions and URLs map to the new math paths only at folder boundaries', () => {
  for (const suffix of ['', '/', '/number-models/', '/stacking-cubes/coop/?code=6820', '/graph-studio/app.js?v=1']) {
    assert.equal(normalize(oldRoot + suffix), normalize(root + suffix));
  }
  assert.equal(normalize('/learning/literacy-numeracy/graph-studio/vendor/katex.min.js'), root + '/graph-studio/vendor/katex.min.js');
  assert.equal(normalize(oldRoot + '-other'), oldRoot + '-other');
  assert.equal(normalize(oldRoot + '/../private'), '');
  assert.equal(normalize('https://example.com' + oldRoot), '');
});

test('migration preserves classroom, subject and global settings without restoring closed grants on restart', async () => {
  const db = new PGlite();
  try {
    await db.exec(`
      CREATE TABLE classroom_classes (id BIGINT PRIMARY KEY, school_id BIGINT, academic_year INTEGER, grade INTEGER, class_number INTEGER);
      CREATE TABLE classroom_content_enabled (class_id BIGINT, content_path TEXT, updated_by BIGINT, updated_at TIMESTAMPTZ, PRIMARY KEY(class_id, content_path));
      CREATE TABLE classroom_content_subject_grants (school_id BIGINT, academic_year INTEGER, grade INTEGER, class_number INTEGER, content_path TEXT, teacher_user_id BIGINT, expires_at TIMESTAMPTZ, updated_at TIMESTAMPTZ, PRIMARY KEY(school_id,academic_year,grade,class_number,content_path,teacher_user_id));
      CREATE TABLE site_content_disabled (content_path TEXT PRIMARY KEY, updated_by BIGINT, updated_at TIMESTAMPTZ);
      CREATE TABLE user_storage (app TEXT PRIMARY KEY, value JSONB);
      CREATE TABLE learning_board_stacking (id TEXT PRIMARY KEY, value JSONB);
      INSERT INTO classroom_classes VALUES (1,10,2026,3,1), (2,10,2026,3,2);
      INSERT INTO classroom_content_enabled VALUES
        (1,'${oldRoot}/number-models',7,'2026-10-01Z'),
        (1,'${oldRoot}/graph-studio',7,'2026-10-01Z'),
        (1,'/learning/literacy-numeracy/graph-studio',6,'2026-09-01Z'),
        (1,'${root}/graph-studio',8,'2026-11-01Z'),
        (2,'${oldRoot}-other',9,'2026-10-01Z');
      INSERT INTO classroom_content_subject_grants VALUES
        (10,2026,3,2,'${oldRoot}/fraction-board',8,NOW()+INTERVAL '2 hour','2026-10-02Z'),
        (10,2026,3,2,'${oldRoot}/graph-studio',8,NOW()-INTERVAL '1 hour','2026-10-02Z');
      INSERT INTO site_content_disabled VALUES ('${oldRoot}/stacking-cubes',9,'2026-10-03Z'),('/learning/arts',9,'2026-10-03Z');
      INSERT INTO user_storage VALUES ('number-models','{"board":[1,2,3]}'),('fraction-board','{"denominator":4}'),('graph-studio','{"scenes":["saved lesson"]}');
      INSERT INTO learning_board_stacking VALUES ('existing-bank','{"code":"6820","questions":[{"heights":[1,2]}]}');
    `);
    const query = (sql, args) => db.query(sql, args);
    const rows = async table => (await query(`SELECT * FROM ${table}`)).rows;
    const storage = await rows('user_storage'), banks = await rows('learning_board_stacking');
    const subjectBefore = (await query('SELECT * FROM classroom_content_subject_grants WHERE content_path=$1', [oldRoot + '/fraction-board'])).rows[0];
    await db.exec(migration);
    assert.match(source, /fs\.readFileSync\(path\.join\(__dirname, 'migrations', '026-math-tools-paths\.sql'\), 'utf8'\)/, 'migration runs during database initialization');
    assert.equal((await query('SELECT updated_by FROM classroom_content_enabled WHERE class_id=1 AND content_path=$1', [root + '/number-models'])).rows[0].updated_by, 7);
    assert.equal((await query('SELECT updated_by FROM classroom_content_enabled WHERE class_id=1 AND content_path=$1', [root + '/graph-studio'])).rows[0].updated_by, 8, 'canonical settings win collisions');
    const subjectAfter = (await query('SELECT * FROM classroom_content_subject_grants WHERE content_path=$1', [root + '/fraction-board'])).rows[0];
    assert.deepEqual(subjectAfter, { ...subjectBefore, content_path: root + '/fraction-board' }, 'preserve teacher, timestamp and expiry');
    const isOpen = async (id, url, asset = '') => (await query(grants.CLASS_CONTENT_OPEN_SQL, [id, url, asset])).rows.length > 0;
    assert.equal(await isOpen(1, root), true, 'existing grant opens the new catalog');
    assert.equal(await isOpen(1, root + '/number-models/app.js', root + '/number-models'), true);
    assert.equal(await isOpen(1, root + '/fraction-board'), false, 'sibling remains locked');
    assert.equal(await isOpen(2, root + '/fraction-board'), true, 'active subject grant is preserved');
    assert.equal(await isOpen(2, root + '/graph-studio'), false, 'expired grant stays expired');
    assert.deepEqual((await rows('site_content_disabled')).map(r => r.content_path).sort(), ['/learning/arts', root + '/stacking-cubes']);
    assert.deepEqual(await rows('user_storage'), storage);
    assert.deepEqual(await rows('learning_board_stacking'), banks);
    for (const table of ['classroom_content_enabled','classroom_content_subject_grants','site_content_disabled']) {
      const migrated = await rows(table);
      await db.exec(migration);
      assert.deepEqual(await rows(table), migrated, 'idempotent startup: ' + table);
      await query(`DELETE FROM ${table} WHERE content_path LIKE $1`, [root + '/%']);
    }
    await db.exec(migration);
    assert.equal(await isOpen(1, root + '/number-models'), false, 'a later teacher closure stays closed');
    assert.equal(await isOpen(2, root + '/fraction-board'), false);
    assert.equal((await query('SELECT * FROM site_content_disabled WHERE content_path=$1', [root + '/stacking-cubes'])).rows.length, 0, 'an admin can reopen moved content');
    assert.equal((await query('SELECT * FROM classroom_content_enabled WHERE content_path=$1', [oldRoot + '-other'])).rows.length, 1);
  } finally { await db.close(); }
});
