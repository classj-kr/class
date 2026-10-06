// 성명을 비워 두고 구글 계정만 적은 명단 줄을 두 명단 화면에서 실제 브라우저로 돌린다.
// 첫 로그인을 기다리는 줄(pending)은 칸이 비어 보이고 '대기' 표시가 붙으며, 저장할 때 성명을
// 비운 채로 보내 서버가 둔 자리표시 이름이 실명으로 굳지 않는다. 구글에서 채운 줄(google)은
// '구글' 표시가 붙고 이름은 그대로 돌아간다.
const assert = require('node:assert/strict');
const path = require('node:path');
const express = require('../game-hub-server/node_modules/express');
const { chromium } = require('../game-hub-server/node_modules/playwright');

(async () => {
  const savedStudents = [];
  const savedTeachers = [];
  const savedClass = [];
  const app = express();
  app.use(express.json());
  app.get('/api/auth/me', (_req, res) => res.json({ signedIn: true, isTeacher: true, user: { id: 1, name: '학교 관리자', email: 'admin@school.test', role: 'teacher' } }));
  app.get('/api/school/settings', (_req, res) => res.json({ isAdmin: true, columns: [], specialRooms: [], approvalLines: {} }));
  const studentRow = (id, number, name, nameSource, email, userId = null) => ({
    id, grade: 3, class_number: 1, student_number: String(number), roster_name: name, name_source: nameSource, gender: '남',
    student_email: email, guardian1_email: '', guardian2_email: '', custom_fields: {}, user_id: userId, clubs: [], afterschool: [], shuttle: {}
  });
  app.get('/api/school/students', (_req, res) => res.json({ year: 2026, students: [
    studentRow(1, 1, 's3101', 'pending', 's3101@school.test'),
    studentRow(2, 2, '홍길동', 'google', 's3102@school.test', 5),
    studentRow(3, 3, '김철수', null, 's3103@school.test')
  ] }));
  app.put('/api/school/students', (req, res) => { savedStudents.push(req.body); res.json({ ok: true, saved: req.body.students.length }); });
  app.get('/api/school/teachers', (_req, res) => res.json({ isAdmin: true, teachers: [
    { id: 1, name: '학교관리자', nameSource: '', type: '관리자', email: 'admin@school.test', grade: null, classNumber: null, subjectName: null, roomName: null, teachingScope: [], linked: true },
    { id: 2, name: 'new@school.test', nameSource: 'pending', type: '담임', email: 'new@school.test', grade: 3, classNumber: 1, subjectName: null, roomName: null, teachingScope: [], linked: false },
    { id: 3, name: '이영희', nameSource: 'google', type: '담임', email: 'lee@school.test', grade: 3, classNumber: 2, subjectName: null, roomName: null, teachingScope: [], linked: true }
  ] }));
  app.put('/api/school/teachers', (req, res) => { savedTeachers.push(req.body); res.json({ saved: req.body.teachers.length }); });
  // 담임의 학급 명단 화면(roster.html)
  app.get('/api/teacher/profile', (_req, res) => res.json({ registered: true, profile: { schoolName: '시험학교', academicYear: 2026, grade: 3, classNumber: 1, name: '가교사' } }));
  const classStudent = (number, name, nameSource, email) => ({
    number: String(number), name, nameSource, gender: '남', birthdayMmdd: '', birthdayVisible: false, avatarKey: '', avatarUrl: '',
    studentEmail: email, guardian1Email: '', guardian2Email: '', studentLinked: false, guardian1Linked: false, guardian2Linked: false
  });
  app.get('/api/teacher/class', (_req, res) => res.json({ classroom: {
    id: 10, schoolName: '시험학교', schoolCode: 'SCH1', officeCode: '', locationName: '', academicYear: 2026, grade: 3, classNumber: 1,
    teacherName: '가교사', teacherType: '담임', subjectName: '', roomName: '', isReadOnly: false,
    students: [classStudent(1, 's3101', 'pending', 's3101@school.test'), classStudent(2, '홍길동', 'google', 's3102@school.test')]
  } }));
  app.put('/api/teacher/class', (req, res) => { savedClass.push(req.body); res.json({ ok: true, schoolCode: 'SCH1', studentCount: req.body.students.length }); });
  app.use('/api', (_req, res) => res.status(404).json({ error: 'NOT_IN_TEST' }));
  app.use(express.static(path.resolve(__dirname, '..')));
  const server = await new Promise((resolve) => { const s = app.listen(0, '127.0.0.1', () => resolve(s)); });
  const base = `http://127.0.0.1:${server.address().port}`;
  const waitFor = async (page, list, count) => { for (let i = 0; i < 25 && list.length < count; i += 1) await page.waitForTimeout(200); assert.equal(list.length, count); };
  let browser;
  try {
    browser = await chromium.launch({ headless: true, ...(process.platform === 'win32' ? { channel: 'msedge' } : {}) });
    const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
    const errors = []; page.on('pageerror', (e) => errors.push(e.message));
    page.on('dialog', (d) => d.accept());

    // ── 전교생 명단: 대기 줄은 비어 보이고, 저장할 때 성명을 비운 채로 보낸다 ──
    await page.goto(base + '/classtools/school-roster.html');
    await page.locator('#rosterBody tr').nth(2).waitFor();
    const studentRows = page.locator('#rosterBody tr');
    const nameInput = (row) => studentRows.nth(row).locator('input').nth(3);
    assert.equal(await nameInput(0).inputValue(), '', '대기 줄의 성명 칸은 비어 보인다');
    assert.equal(await nameInput(0).getAttribute('placeholder'), '로그인 때 채움');
    assert.equal(await studentRows.nth(0).locator('.name-chip.pending').count(), 1, '대기 표시가 붙는다');
    assert.equal(await nameInput(1).inputValue(), '홍길동', '구글에서 채운 이름은 그대로 보인다');
    assert.equal(await studentRows.nth(1).locator('.name-chip.google').count(), 1, '구글 표시가 붙는다');
    assert.equal(await studentRows.nth(2).locator('.name-chip').count(), 0, '직접 적은 이름에는 표시가 없다');

    await page.evaluate(() => window.saveRoster());
    await waitFor(page, savedStudents, 1);
    const sent = Object.fromEntries(savedStudents[0].students.map((s) => [s.studentNumber, s]));
    assert.deepEqual([sent['1'].rosterName, sent['1'].studentEmail], ['', 's3101@school.test'], '대기 줄은 성명을 비운 채로 간다');
    assert.equal(sent['2'].rosterName, '홍길동', '구글에서 채운 이름은 그대로 간다');
    assert.equal(sent['3'].rosterName, '김철수');

    // 관리자가 대기 줄에 이름을 적으면 그 이름이 간다.
    await page.locator('#rosterBody tr').nth(2).waitFor();
    await nameInput(0).fill('박민수');
    await nameInput(0).dispatchEvent('change');
    await page.evaluate(() => window.saveRoster());
    await waitFor(page, savedStudents, 2);
    assert.equal(savedStudents[1].students.find((s) => s.studentNumber === '1').rosterName, '박민수');

    // 붙여넣기: 성명 열이 아예 없어도 학생구글계정 열이 있으면 받고, 그 줄은 대기로 미리 보인다.
    await page.locator('#rosterBody tr').nth(2).waitFor();
    await page.evaluate(() => window.togglePasteSection());
    await page.locator('#pasteInput').fill('학년\t반\t번호\t성별\t학생구글계정\n3\t1\t1\t남\ts3101@school.test\n3\t1\t2\t여\ts3102@school.test');
    await page.evaluate(() => window.parsePaste());
    await page.locator('#pasteStatus').filter({ hasText: '2명 파싱 완료' }).waitFor({ timeout: 5000 });
    assert.equal(await page.locator('#rosterBody .name-chip.pending').count(), 2, '성명 없는 줄은 대기로 보인다');
    await page.evaluate(() => window.saveRoster());
    await waitFor(page, savedStudents, 3);
    assert.deepEqual(savedStudents[2].students.map((s) => [s.studentNumber, s.rosterName, s.studentEmail, s.gender]),
      [['1', '', 's3101@school.test', '남'], ['2', '', 's3102@school.test', '여']]);

    // 성명 열이 있고 일부만 비운 경우. 성명도 계정도 없는 줄은 버린다.
    await page.locator('#rosterBody tr').nth(2).waitFor();
    await page.evaluate(() => window.togglePasteSection());
    await page.locator('#pasteInput').fill('학년\t반\t번호\t성명\t성별\t학생구글계정\n3\t1\t1\t\t남\ts3101@school.test\n3\t1\t2\t김철수\t남\t\n3\t1\t3\t\t남\t');
    await page.evaluate(() => window.parsePaste());
    await page.locator('#pasteStatus').filter({ hasText: '2명 파싱 완료' }).waitFor({ timeout: 5000 });

    // ── 교직원 명단 ──
    await page.locator('#tab-teachers').click();
    await page.locator('#teacherRosterBody tr').nth(2).waitFor();
    const teacherRows = page.locator('#teacherRosterBody tr');
    assert.equal(await teacherRows.nth(1).locator('input').nth(0).inputValue(), '', '대기 줄의 성명 칸은 비어 보인다');
    assert.equal(await teacherRows.nth(1).locator('input').nth(0).getAttribute('placeholder'), '로그인 때 채움');
    assert.equal(await teacherRows.nth(1).locator('.name-chip.pending').count(), 1);
    assert.equal(await teacherRows.nth(2).locator('input').nth(0).inputValue(), '이영희');
    assert.equal(await teacherRows.nth(2).locator('.name-chip.google').count(), 1);
    await page.locator('#saveTeacherRosterBtn').click();
    await waitFor(page, savedTeachers, 1);
    const sentTeachers = Object.fromEntries(savedTeachers[0].teachers.map((t) => [t.email, t]));
    assert.deepEqual([sentTeachers['new@school.test'].name, sentTeachers['new@school.test'].grade, sentTeachers['new@school.test'].classNumber], ['', 3, 1], '대기 줄은 성명을 비운 채로 간다');
    assert.equal(sentTeachers['lee@school.test'].name, '이영희');
    await page.locator('#teacherRosterStatus').filter({ hasText: '총 3명' }).waitFor({ timeout: 5000 });

    // 붙여넣기: 계정부터 적은 줄과 성명 칸을 비운 줄 모두 성명 없는 한 사람으로 받는다.
    await page.evaluate(() => window.toggleTeacherPasteSection());
    await page.locator('#teacherPasteInput').fill('홍길동\thong@school.test\t1\t1\n\tblank@school.test\t4\t2\nfirst@school.test\t5\t1\n김전담\tkim@school.test');
    await page.evaluate(() => window.parseTeacherPaste());
    await page.locator('#teacherRosterStatus').filter({ hasText: '4명의 교직원' }).waitFor({ timeout: 5000 });
    assert.equal(await page.locator('#teacherRosterBody .name-chip.pending').count(), 2);
    await page.locator('#saveTeacherRosterBtn').click();
    await waitFor(page, savedTeachers, 2);
    assert.deepEqual(savedTeachers[1].teachers.map((t) => [t.name, t.email, t.grade, t.classNumber]), [
      ['홍길동', 'hong@school.test', 1, 1],
      ['', 'blank@school.test', 4, 2],
      ['', 'first@school.test', 5, 1],
      ['김전담', 'kim@school.test', null, null]
    ]);

    // ── 담임의 학급 명단(roster.html): 대기 줄은 빈 줄로 보이고, 계정이 있으면 빈 성명으로 저장된다 ──
    await page.goto(base + '/classtools/roster.html');
    await page.locator('#roster-card:not([hidden])').waitFor();
    await page.locator('#input-status').filter({ hasText: '2명의 학생 명단이 준비되었습니다' }).waitFor({ timeout: 5000 });
    assert.equal(await page.locator('#names').inputValue(), '\n홍길동', '대기 줄의 성명은 빈 줄로 보인다');
    await page.locator('#save-button').click();
    await waitFor(page, savedClass, 1);
    assert.deepEqual(savedClass[0].students.map((s) => [s.number, s.name, s.studentEmail]), [['1', '', 's3101@school.test'], ['2', '홍길동', 's3102@school.test']]);

    // 계정 없이 성명만 비우면 막는다.
    await page.locator('#student-emails').fill('');
    await page.locator('#student-emails').dispatchEvent('input');
    await page.locator('#input-status').filter({ hasText: '1번의 성명이 비어 있습니다' }).waitFor({ timeout: 5000 });
    assert.equal(await page.locator('#save-button').isDisabled(), true);
    // 뒤쪽 학생의 성명이 비어 줄 수가 모자라도 같은 규칙이다: 계정이 없으면 막고, 있으면 통과한다.
    await page.locator('#student-emails').fill('s3101@school.test');
    await page.locator('#student-emails').dispatchEvent('input');
    await page.locator('#names').fill('박민수');
    await page.locator('#names').dispatchEvent('input');
    await page.locator('#input-status').filter({ hasText: '2번의 성명이 비어 있습니다' }).waitFor({ timeout: 5000 });
    await page.locator('#student-emails').fill('s3101@school.test\ns3102@school.test');
    await page.locator('#student-emails').dispatchEvent('input');
    await page.locator('#input-status').filter({ hasText: '2명의 학생 명단이 준비되었습니다' }).waitFor({ timeout: 5000 });
    assert.equal(await page.locator('#save-button').isDisabled(), false);

    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ ok: true }));
  } finally {
    if (browser) await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
})().catch((error) => { console.error(error); process.exit(1); });
