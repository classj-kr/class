import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { PGlite } from '@electric-sql/pglite';
const require = createRequire(import.meta.url);
const { schoolDefaults } = require('./school-affiliation');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const platform = fs.readFileSync(path.join(root, 'game-hub-server/classroom-platform.js'), 'utf8');
const server = fs.readFileSync(path.join(root, 'game-hub-server/server.js'), 'utf8');
const declaration = name => {
  const start = platform.indexOf(`  async function ${name}(`);
  return platform.slice(start, platform.indexOf('\n  }', start) + 4);
};
test('startup migration changes stored default names across schools, is repeatable and preserves real teacher names', async () => {
  const sql = platform.match(/`(UPDATE classroom_teachers AS legacy[\s\S]*?)`/)[1];
  const db = new PGlite();
  try {
    await db.exec(`CREATE TABLE classroom_teachers(id int, school_id int, teacher_name text, updated_at timestamp, UNIQUE(school_id,teacher_name));
      INSERT INTO classroom_teachers VALUES (1,1,'학교 관리자',NULL),(2,2,'학교 관리자',NULL),(3,3,'김교사',NULL),(4,4,'학교관리자',NULL);`);
    await db.exec(sql); await db.exec(sql);
    assert.deepEqual((await db.query('SELECT teacher_name FROM classroom_teachers ORDER BY id')).rows.map(row => row.teacher_name),
      ['학교관리자','학교관리자','김교사','학교관리자']);
    await db.exec("INSERT INTO classroom_teachers VALUES (5,4,'학교 관리자',NULL)");
    await db.exec(sql);
    assert.equal((await db.query('SELECT COUNT(*)::int AS count FROM classroom_teachers')).rows[0].count, 5, 'distinct accounts are never deleted or merged');
  } finally { await db.close(); }
});
function resolveName({ user = { id: 1, role: 'teacher' }, registration = null, student = null, guest = null, offlineTimetable = false } = {}) {
  return new Function('sessionUser', 'guestAccess', 'pool', 'databaseReady', 'studentMembership', 'teacherRegistrations', 'schoolDefaults',
    `${declaration('displayNameFor')}; return displayNameFor;`)(async () => user, () => guest,
    { query: async () => { if (offlineTimetable) throw Error('unavailable timetable'); return { rows: [] }; } }, true,
    async () => student, async () => registration ? [registration] : [], schoolDefaults)({});
}
test('school administrator name is playable even with spaces, Unicode spacing or a failed timetable lookup', async () => {
  for (const name of ['학교 관리자', '학교\u00a0관리자', ' 학교\t관리자 ']) {
    for (const offlineTimetable of [false, true]) {
      const identity = await resolveName({ registration: { teacher_name: name, school_name: '가초등학교', school_id: 1 }, offlineTimetable });
      assert.equal(identity.name, '학교관리자');
      assert.match(identity.name, /^[가-힣]{2,6}$/);
      assert.equal(identity.schoolLevel, 'elementary');
    }
  }
});
test('all roles use normalized registered names; missing names stay missing', async () => {
  assert.equal((await resolveName({ user: { display_name: '사이트 관리자', role: 'admin' } })).name, '사이트관리자');
  assert.equal((await resolveName({ student: { studentName: '김 하늘' } })).name, '김하늘');
  assert.equal((await resolveName({ user: null, guest: { name: '이 바다' } })).name, '이바다');
  assert.equal((await resolveName({ user: { name: '', role: 'teacher' } })).name, '');
});
function render(file, identity) {
  const start = server.indexOf('function siteIdentityTag('), end = server.indexOf('\nregisterSiteIcons', start);
  return new Promise((resolve, reject) => {
    const handler = new Function('fs', 'path', 'SITE_ROOT', 'classroomPlatform', 'wantsSchoolChat',
      'SITE_MUSIC_VERSION', 'SITE_SFX_VERSION', 'SITE_BACK_SCRIPT_TAG', 'SITE_SFX_SCRIPT_TAG', 'SITE_MUSIC_CONTROL_TAG', 'SITE_EXAM_TYPOGRAPHY_TAG', 'SITE_SCHOOL_CHAT_TAG',
      `${server.slice(start, end)}; return sendSiteHtml;`)(fs, path, root, { displayNameFor: async () => identity }, () => false, 'test', 'test', '', '', '', '', '');
    const res = { setHeader() {}, type() {}, redirect: (status, location) => resolve({ status, location }), send: html => resolve({ status: 200, html }) };
    handler({ method: 'GET' }, res, path.join(root, file), reject);
  });
}
test('real game HTML receives the normalized name before scripts; missing identities never receive the game page', async () => {
  const identity = await resolveName({ registration: { teacher_name: '학교 관리자' } });
  for (const file of ['learning/games/lastcard/lastcard.html', 'learning/games/chess/chess.html', 'learning/games/board-coach/coach.html', 'learning/games/board-coach/baduk.html']) {
    const response = await render(file, identity);
    assert.equal(response.status, 200);
    assert.ok(response.html.indexOf('CLASS_PLAYER_NAME="학교관리자"') < response.html.indexOf('<script src='));
    for (const name of ['', ' ', 'A', '가']) assert.deepEqual(await render(file, { name, kind: 'teacher' }), { status: 302, location: '/?access=name-required' });
  }
  assert.equal((await render('index.html', { name: '', kind: 'teacher' })).status, 200, 'account recovery remains accessible');
});
test('multiplayer room entry rejects a nameless authenticated account before room creation', async () => {
  const access = name => new Function('siteAccessIdentity', 'guestAccess', 'displayNameFor', 'isContentGloballyDisabled', 'normalizeContentPath', 'isStudentContentLocked',
    `${declaration('gameAccessError')}; return gameAccessError;`)(async () => ({ user: { role: 'teacher' }, allowed: true }), () => null,
    async () => ({ name }), async () => false, value => value, async () => false)({}, '/learning/games/lastcard/lastcard');
  assert.equal(await access('학교관리자'), '');
  assert.equal(await access(''), 'PLAYER_NAME_REQUIRED');
});
