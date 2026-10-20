import assert from 'node:assert/strict';
import { readFile, mkdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { PGlite } from '@electric-sql/pglite';
import { chromium } from 'playwright';

const source = await readFile(new URL('./classroom-platform.js', import.meta.url), 'utf8');
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
class HttpError extends Error {
  constructor(status, code, message) { super(message); this.status = status; this.code = code; }
}
function handler(method, path, bindings) {
  const start = source.indexOf(`router.${method}("/school-admin/${path}"`);
  assert.ok(start >= 0, path);
  const body = source.slice(source.indexOf('=> {', start) + 4, source.indexOf('\n  }));', start));
  const fn = new AsyncFunction('req', 'res', ...Object.keys(bindings), body);
  return async (req = {}) => {
    let data;
    await fn({ query: {}, body: {}, ...req }, { json(value) { data = value; }, set() {} }, ...Object.values(bindings));
    return data;
  };
}
async function withSchool(run) {
  const db = new PGlite();
  try {
    await db.exec(`
      CREATE TABLE classroom_schools (id BIGINT PRIMARY KEY);
      CREATE TABLE classroom_users (id BIGINT PRIMARY KEY, email TEXT);
      CREATE TABLE classroom_teachers (
        school_id BIGINT, academic_year INTEGER, grade INTEGER, class_number INTEGER,
        user_id BIGINT, google_email TEXT, teacher_type TEXT, active BOOLEAN DEFAULT TRUE
      );
      CREATE TABLE school_students (school_id BIGINT, academic_year INTEGER, grade INTEGER, class_number INTEGER);
      CREATE TABLE classroom_classes (school_id BIGINT, academic_year INTEGER, grade INTEGER, class_number INTEGER);
      INSERT INTO classroom_schools VALUES (1), (2);
      INSERT INTO classroom_users VALUES (101, 'teacher@example.invalid');
      INSERT INTO classroom_teachers (school_id, academic_year, grade, class_number, user_id, teacher_type) VALUES
        (1, 2026, 1, 1, NULL, '담임'), (1, 2026, 1, 2, NULL, '담임'),
        (1, 2026, 4, 1, NULL, '담임'), (1, 2026, 5, 1, NULL, '담임'),
        (1, 2026, 6, 3, NULL, '담임'), (1, 2026, NULL, NULL, 101, '전담'),
        (2, 2026, 6, 30, NULL, '담임'), (1, 2025, 5, 20, NULL, '담임');
      INSERT INTO classroom_teachers (school_id, academic_year, grade, class_number, active) VALUES (1, 2026, 4, 20, FALSE);
      INSERT INTO school_students VALUES (1, 2026, 2, 1), (1, 2026, 2, 1), (2, 2026, 6, 29), (1, 2025, 5, 19);
      INSERT INTO classroom_classes VALUES (1, 2026, 2, 2), (1, 2026, 1, 1), (2, 2026, 6, 28), (1, 2025, 5, 18);
    `);
    for (const table of ['school_master_timetable', 'school_weekly_period_allocation']) {
      const start = source.indexOf(`CREATE TABLE IF NOT EXISTS ${table} (`);
      await db.exec(source.slice(start, source.indexOf('`', start)));
    }
    await db.exec(`
      ALTER TABLE school_master_timetable ADD COLUMN teacher_user_id BIGINT, ADD COLUMN room_name TEXT;
      INSERT INTO school_master_timetable
        (school_id, academic_year, grade, class_number, day_of_week, period, subject_name) VALUES
        (1, 2026, 1, 1, 1, 1, '국어'), (1, 2026, 3, 10, 2, 2, '음악'),
        (1, 2026, 6, 3, 1, 8, ''), (1, 2027, 4, 2, 1, 1, '다음학년도'),
        (2, 2026, 6, 30, 1, 1, '다른학교'), (1, 2026, 1, 0, 1, 1, '이전 공통양식');
      INSERT INTO school_weekly_period_allocation (school_id, academic_year, grade, day_of_week, period_count)
        SELECT 1, 2026, grade, day, CASE WHEN grade <= 2 THEN 4 WHEN day = 3 THEN 5 ELSE 6 END
        FROM generate_series(1, 6) grade CROSS JOIN generate_series(1, 5) day;
    `);
    const pool = { query: async (sql, params) => {
      const r = await db.query(sql, params);
      return { rows: r.rows, rowCount: r.affectedRows ?? r.rows.length };
    } };
    const bindings = { pool, HttpError,
      requireSchoolCurriculum: async () => ({ profile: { school_id: 1 } }),
      requireSchoolAdmin: async () => ({ profile: { school_id: 1 } })
    };
    const resolverStart = source.indexOf('  async function schoolTimetableTeacher(');
    bindings.schoolTimetableTeacher = new Function('pool', 'HttpError',
      `${source.slice(resolverStart, source.indexOf('\n  }', resolverStart) + 4)}; return schoolTimetableTeacher;`)(pool, HttpError);
    const overview = handler('get', 'school-timetable', bindings);
    const master = handler('get', 'master-timetable', bindings);
    const save = handler('post', 'master-timetable', bindings);
    const specialist = handler('put', 'specialist-timetable', bindings);
    const room = handler('put', 'room-timetable', bindings);
    await run({ db, overview, master, save, specialist, room });
  } finally { await db.close(); }
}

test('overview includes registered empty classes, sorts and deduplicates classes, and isolates school and year', () => withSchool(async ({ overview }) => {
  const data = await overview({ query: { academicYear: '2026', schoolId: '2' } });
  assert.deepEqual(data.classes.map(c => [c.grade, c.class_number]), [[1, 1], [1, 2], [2, 1], [2, 2], [3, 10], [4, 1], [5, 1], [6, 3]]);
  assert.equal(data.timetable.length, 3);
  assert.equal(data.allocations.length, 30);
  assert.ok(!JSON.stringify(data).includes('다른학교'));
    assert.ok(!JSON.stringify(data).includes('이전 공통양식'));
  const next = await overview({ query: { academicYear: '2027' } });
  assert.deepEqual(next.classes, [{ grade: 4, class_number: 2 }]);
  assert.equal(next.timetable[0].subject_name, '다음학년도');
  assert.deepEqual((await overview({ query: { academicYear: '2028' } })).classes, []);
  for (const academicYear of ['nope', '2026.5', '1900']) {
    await assert.rejects(overview({ query: { academicYear } }), { status: 400, code: 'INVALID_YEAR' });
  }
}));

test('existing class, specialist and room writes immediately appear in the overview, including clearing', () => withSchool(async ({ overview, save, specialist, room }) => {
  const cell = { grade: 3, classNumber: 10, dayOfWeek: 2, period: 2 };
  const read = async () => (await overview({ query: { academicYear: 2026 } })).timetable.find(c => c.grade === 3);
  await save({ body: { academicYear: 2026, grade: 3, classNumber: 10, cells: [{ ...cell, subjectName: '수학' }] } });
  assert.equal((await read()).subject_name, '수학');
  await specialist({ body: { academicYear: 2026, teacherUserId: 101, cells: [{ ...cell, subjectName: '과학' }] } });
  assert.equal(Number((await read()).teacher_user_id), 101);
  await room({ body: { academicYear: 2026, room: '과학실', cells: [cell] } });
  assert.equal((await read()).room_name, '과학실');
  assert.equal((await read()).subject_name, '과학');
  await save({ body: { academicYear: 2026, grade: 3, classNumber: 10, cells: [{ ...cell, clearSpecialist: true }] } });
  assert.equal((await read()).subject_name, '');
  assert.equal((await read()).teacher_user_id, null);
  assert.equal((await read()).room_name, null);
}));

async function captureWebp(page, filename) {
  const directory = new URL('../outputs/school-wide-timetable/', import.meta.url);
  await mkdir(directory, { recursive: true });
  execFileSync('python', ['-c', [
    'from PIL import Image',
    'import io, sys',
    'original = Image.open(io.BytesIO(sys.stdin.buffer.read())).convert("RGBA")',
    'original.save(sys.argv[1], "WEBP", lossless=True, exact=True)',
    'decoded = Image.open(sys.argv[1]).convert("RGBA")',
    'assert decoded.size == original.size and decoded.tobytes() == original.tobytes()'
  ].join('\n'), fileURLToPath(new URL(filename, directory))], { input: await page.screenshot({ fullPage: true }) });
}

test('browser: overview, filters, fresh data, class links, print, mobile, safe labels, failures and year races', () => withSchool(async ({ db, overview, master, save }) => {
  const browser = await chromium.launch({ headless: true, ...(process.platform === 'win32' ? { channel: 'msedge' } : {}) });
  let fail = false, hold = false, release, held;
  const errors = [], requests = [];
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await page.clock.install({ time: new Date('2026-10-21T03:00:00Z') });
    page.on('pageerror', e => errors.push(e.message));
    const base = 'http://school-wide.test';
    await page.route('**/*', async route => {
      const url = new URL(route.request().url());
      if (url.origin !== base) return route.abort();
      if (url.pathname.startsWith('/api/')) {
        requests.push({ path: url.pathname, method: route.request().method(), query: Object.fromEntries(url.searchParams) });
        let data = {};
        const req = { query: Object.fromEntries(url.searchParams) };
        if (url.pathname.endsWith('/school-timetable')) {
          if (fail) return route.fulfill({ status: 503, json: { message: '검증용 조회 실패' } });
          data = await overview(req);
          if (hold && req.query.academicYear === '2027') {
            held?.();
            await new Promise(resolve => { release = resolve; });
          }
        } else if (url.pathname.endsWith('/master-timetable')) data = await master(req);
        else if (url.pathname.endsWith('/curriculum-access')) data = { canEdit: false };
        else if (url.pathname.endsWith('/weekly-period-allocation')) data = { allocations: (await overview(req)).allocations };
        else if (url.pathname.endsWith('/curriculum-hours-summary')) data = { grades: [] };
        else if (url.pathname.endsWith('/bell-schedule')) data = { schedules: [] };
        else if (url.pathname.endsWith('/vacation-settings')) data = { settings: {} };
        else if (url.pathname.endsWith('/annual-schedules')) data = { schedules: [] };
        else if (url.pathname.endsWith('/public-holidays')) data = { holidays: [], all: [] };
        else throw new Error(`Unexpected API ${url.pathname}`);
        return route.fulfill({ json: data });
      }
      const file = url.pathname === '/schooladmin/' ? 'index.html' : url.pathname.split('/').pop();
      if (!['index.html', 'app.js', 'style.css', 'textbooks.js'].includes(file)) return route.fulfill({ status: 404 });
      return route.fulfill({ body: await readFile(new URL(`../apps/schooladmin/${file}`, import.meta.url)),
        contentType: file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : 'text/html' });
    });
    await page.goto(`${base}/schooladmin/`);
    await page.locator('[data-tab="schoolTimetable"]').click();
    await page.locator('#schoolTimetableBody .school-lesson').first().waitFor();
    assert.equal(await page.locator('#schoolTimetableBody tr').count(), 8);
    assert.equal(await page.locator('#schoolTimetableHead tr').nth(1).locator('th').count(), 29, 'empty saved period 8 does not widen the table');
    assert.equal(await page.locator('#schoolTimetableYearSelect').isEnabled(), true);
    assert.equal(await page.locator('#schoolTimetableGradeSelect').isEnabled(), true);
    await page.locator('#schoolTimetableGradeSelect').selectOption('1');
    assert.equal(await page.locator('#schoolTimetableBody tr').count(), 2);
    assert.equal(await page.locator('#schoolTimetableHead tr').nth(1).locator('th').count(), 20);
    await page.locator('#schoolTimetableGradeSelect').selectOption('');
    await page.getByRole('button', { name: '3학년 10반 시간표 열기', exact: true }).click();
    await page.locator('#timetableMatrixBody').getByText('음악', { exact: true }).waitFor();
    assert.equal(await page.locator('#timetableClassSelect').inputValue(), '10');
    await save({ body: { academicYear: 2026, grade: 3, classNumber: 10, cells: [{ dayOfWeek: 2, period: 2, subjectName: '과학' }] } });
    await page.locator('[data-tab="schoolTimetable"]').click();
    await page.getByRole('button', { name: '3학년 10반 · 화요일 2교시 · 과학', exact: true }).waitFor();

    // Fill a representative school to inspect the compact grid at desktop/mobile widths.
    const subjects = ['국어', '수학', '사회', '과학', '체육', '음악', '미술', '영어', '창체'];
    for (const c of (await overview({ query: { academicYear: 2026 } })).classes) {
      const cells = [];
      for (let d = 1; d <= 5; d++) for (let p = 1; p <= (c.grade <= 2 ? 4 : d === 3 ? 5 : 6); p++) {
        cells.push({ dayOfWeek: d, period: p, subjectName: subjects[(c.grade + c.class_number + d + p) % subjects.length] });
      }
      await save({ body: { academicYear: 2026, grade: c.grade, classNumber: c.class_number, cells } });
    }
    await page.locator('#refreshSchoolTimetableBtn').click();
    await page.waitForFunction(() => document.querySelectorAll('#schoolTimetableBody .school-lesson').length > 100);
    await captureWebp(page, 'desktop.webp');
    await page.evaluate(() => { window.print = () => { window.didPrint = true; }; });
    await page.locator('#printSchoolTimetableBtn').click();
    assert.equal(await page.evaluate(() => window.didPrint), true);
    await page.emulateMedia({ media: 'print' });
    assert.equal(await page.locator('#annualTab').isVisible(), false);
    assert.equal(await page.locator('.school-lesson').first().isVisible(), true);
    assert.equal(await page.locator('.school-timetable-scroll').evaluate(el => getComputedStyle(el).maxHeight), 'none');
    await captureWebp(page, 'print.webp');
    await page.emulateMedia({ media: 'screen' });
    await page.setViewportSize({ width: 390, height: 844 });
    assert.ok(await page.locator('.school-timetable-scroll').evaluate(el => el.scrollWidth > el.clientWidth));
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'horizontal overflow stays within the table');
    await page.locator('.school-timetable-scroll').evaluate(el => { el.scrollLeft = 400; });
    const classBox = await page.locator('#schoolTimetableBody .school-class').first().boundingBox();
    assert.ok(classBox.x >= 44 && classBox.x < 90, 'class labels stay visible while scrolling');
    await captureWebp(page, 'mobile.webp');
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.locator('.school-timetable-scroll').evaluate(el => { el.scrollLeft = 0; });

    await db.query("UPDATE school_master_timetable SET subject_name=$1, room_name=$2 WHERE school_id=1 AND academic_year=2026 AND grade=1 AND class_number=1 AND day_of_week=1 AND period=1",
      ['<img src=x onerror=alert(1)>', '특별실 "A"']);
    await page.locator('#refreshSchoolTimetableBtn').click();
    const unusual = page.locator('.school-lesson').filter({ hasText: '<img src=x onerror=alert(1)>' });
    await unusual.click();
    assert.ok((await page.locator('#schoolTimetableDetail').innerText()).includes('특별실 "A"'));
    assert.equal(await page.locator('#schoolTimetableContent img').count(), 0);
    await db.exec("UPDATE school_master_timetable SET subject_name='constructor' WHERE school_id=1 AND academic_year=2026 AND grade=1 AND class_number=1 AND day_of_week=1 AND period=1");
    await page.locator('#refreshSchoolTimetableBtn').click();
    await page.locator('.school-lesson').filter({ hasText: 'constructor' }).waitFor();
    fail = true;
    await page.locator('#refreshSchoolTimetableBtn').click();
    await page.getByText(/검증용 조회 실패/).waitFor();
    assert.equal(await page.locator('#schoolTimetableContent').isVisible(), false);
    assert.equal(await page.locator('#printSchoolTimetableBtn').isDisabled(), true);
    fail = false;
    await page.locator('#refreshSchoolTimetableBtn').click();
    await page.locator('#schoolTimetableContent').waitFor();
    hold = true;
    const started = new Promise(resolve => { held = resolve; });
    await page.locator('#schoolTimetableYearSelect').selectOption('2027');
    await started;
    await page.locator('#schoolTimetableYearSelect').selectOption('2026');
    await page.locator('#schoolTimetableContent').waitFor();
    const delayedResponse = page.waitForResponse(r => r.url().endsWith('/school-timetable?academicYear=2027'));
    release();
    await delayedResponse;
    assert.match(await page.locator('#schoolTimetableCaption').innerText(), /2026/);
    assert.equal(await page.locator('#schoolTimetableBody tr').count(), 8);
    hold = false;
    await db.exec('DELETE FROM school_master_timetable WHERE school_id=1 AND academic_year=2027');
    await page.locator('#schoolTimetableYearSelect').selectOption('2027');
    await page.getByText(/2027학년도에 등록된 학급이나 시간표가 없습니다/).waitFor();
    assert.equal(await page.locator('#schoolTimetableContent').isVisible(), false);
    assert.equal(await page.locator('#annualYearSelect').inputValue(), '2027');
    assert.deepEqual(requests.filter(r => r.method !== 'GET'), []);
    assert.deepEqual(errors, []);
  } finally { release?.(); await browser.close(); }
}));
