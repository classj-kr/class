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
  const studentRow = (id, number, name, nameSource, email, userId = null, googleName = null) => ({
    id, grade: 3, class_number: 1, student_number: String(number), roster_name: name, name_source: nameSource, gender: '남',
    student_email: email, guardian1_email: '', guardian2_email: '', custom_fields: {}, user_id: userId,
    google_name: googleName, name_mismatch: Boolean(googleName && googleName !== name),
    clubs: [], afterschool: [], shuttle: {}
  });
  app.get('/api/school/students', (_req, res) => res.json({ year: 2026, students: [
    studentRow(1, 1, 's3101', 'pending', 's3101@school.test'),
    studentRow(2, 2, '홍길동', 'google', 's3102@school.test', 5, '홍길동'),
    studentRow(3, 3, '김철수', null, 's3103@school.test', 7, 'Lee Minsu')
  ] }));
  app.put('/api/school/students', (req, res) => { savedStudents.push(req.body); res.json({ ok: true, saved: req.body.students.length }); });
  app.get('/api/school/teachers', (_req, res) => res.json({ isAdmin: true, teachers: [
    { id: 1, name: '학교관리자', nameSource: '', googleName: '김관리', nameMismatch: true, type: '관리자', email: 'admin@school.test', grade: null, classNumber: null, subjectName: null, roomName: null, teachingScope: [], linked: true },
    { id: 2, name: 'new@school.test', nameSource: 'pending', type: '담임', email: 'new@school.test', grade: 3, classNumber: 1, subjectName: null, roomName: null, teachingScope: [], linked: false },
    { id: 3, name: '이영희', nameSource: 'google', googleName: '이영희', nameMismatch: false, type: '담임', email: 'lee@school.test', grade: 3, classNumber: 2, subjectName: null, roomName: null, teachingScope: [], linked: true }
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
    // 확인 창은 내용을 기록하고, 시험 단계에 따라 받아들이거나 물린다.
    const dialogs = [];
    let dialogAction = 'accept';
    page.on('dialog', (d) => { dialogs.push(d.message()); if (dialogAction === 'dismiss') d.dismiss(); else d.accept(); });

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
    assert.equal(await studentRows.nth(2).locator('.name-chip.mismatch').count(), 1, '연동된 구글 이름이 다른 사람으로 보이면 표시한다');
    assert.match(await studentRows.nth(2).locator('.name-chip.mismatch').getAttribute('title'), /Lee Minsu/);
    assert.equal(await studentRows.nth(1).locator('.name-chip.mismatch').count(), 0, '구글 이름과 같으면 표시하지 않는다');

    await page.evaluate(() => window.saveRoster());
    await waitFor(page, savedStudents, 1);
    const sent = Object.fromEntries(savedStudents[0].students.map((s) => [s.studentNumber, s]));
    assert.deepEqual([sent['1'].rosterName, sent['1'].studentEmail], ['', 's3101@school.test'], '대기 줄은 성명을 비운 채로 간다');
    assert.equal(sent['2'].rosterName, '홍길동', '구글에서 채운 이름은 그대로 간다');
    assert.equal(sent['3'].rosterName, '김철수');
    // 저장 뒤에는 명단을 다시 불러와 그린다. 다 그려진 뒤에 고쳐야 고친 것이 남는다.
    const waitReloaded = () => page.locator('#rosterStatus').filter({ hasText: '총 3명' }).waitFor({ timeout: 5000 });
    await waitReloaded();

    // 칸에 글을 넣은 뒤에는 초점을 뺀다. 초점이 남은 채 명단이 다시 그려지면 브라우저가 뒤늦게 change를
    // 쏴서 다시 불러온 줄에 옛 값을 덮어쓴다(사람은 저장 단추를 누르며 초점을 빼므로 생기지 않는 일).
    // 관리자가 대기 줄에 이름을 적으면 그 이름이 간다.
    await nameInput(0).fill('박민수');
    await nameInput(0).dispatchEvent('change'); await nameInput(0).evaluate((el) => el.blur());
    await page.evaluate(() => window.saveRoster());
    await waitFor(page, savedStudents, 2);
    assert.equal(savedStudents[1].students.find((s) => s.studentNumber === '1').rosterName, '박민수');
    await waitReloaded();
    assert.equal(await nameInput(0).inputValue(), '', '다시 불러온 대기 줄은 다시 비어 보인다');

    // '+ 학생 추가'로 새 줄을 만들고 성명 없이 계정만 적어 저장하면, 그 줄이 그대로 서버로 간다(사라지지 않는다).
    await page.evaluate(() => window.addSingleStudent());
    const newRow = page.locator('#rosterBody tr').last();
    const fillCell = async (index, value) => { const input = newRow.locator('input').nth(index); await input.fill(value); await input.dispatchEvent('change'); await input.evaluate((el) => el.blur()); };
    await fillCell(0, '6'); await fillCell(1, '1'); await fillCell(2, '1'); await fillCell(4, '여'); await fillCell(5, 'ks266101@kyesang.sen.es.kr');
    await page.evaluate(() => window.saveRoster());
    await waitFor(page, savedStudents, 3);
    const added = savedStudents[2].students.find((s) => s.grade === 6 && s.classNumber === 1 && s.studentNumber === '1');
    assert.deepEqual([added.rosterName, added.gender, added.studentEmail], ['', '여', 'ks266101@kyesang.sen.es.kr'], '성명 없이 계정만 적은 새 줄이 저장된다');
    assert.equal(savedStudents[2].students.length, 4, '기존 세 줄에 새 줄이 더해진다');
    assert.equal(savedStudents[2].students.find((s) => s.studentNumber === '1' && s.grade === 3).rosterName, '', '다시 불러온 대기 줄은 비운 채로 간다');
    await waitReloaded();

    // 같은 학생구글계정을 두 줄에 적으면 두 칸이 붉어지고 저장이 막힌다. 보호자 계정은 겹쳐도 된다.
    const emailInput = (row) => studentRows.nth(row).locator('input').nth(5);
    await emailInput(1).fill('s3103@school.test');
    await emailInput(1).dispatchEvent('change'); await emailInput(1).evaluate((el) => el.blur());
    assert.equal(await page.locator('#rosterBody input[data-field="student_email"].invalid').count(), 2, '겹치는 두 칸이 붉어진다');
    await page.evaluate(() => window.saveRoster());
    await page.locator('#rosterStatus').filter({ hasText: '학생 구글계정 s3103@school.test이(가) 두 줄에 있습니다' }).waitFor({ timeout: 5000 });
    assert.equal(savedStudents.length, 3, '겹치는 계정은 서버로 가지 않는다');
    await emailInput(1).fill('s3102@school.test');
    await emailInput(1).dispatchEvent('change'); await emailInput(1).evaluate((el) => el.blur());
    assert.equal(await page.locator('#rosterBody input[data-field="student_email"].invalid').count(), 0, '고치면 붉은 표시가 사라진다');

    // 반·번호만 있고 성명도 계정도 없는 줄은 저장하지 않고 알려 주며, 명단을 다시 불러오지 않는다.
    await nameInput(2).fill('');
    await nameInput(2).dispatchEvent('change'); await nameInput(2).evaluate((el) => el.blur());
    await emailInput(2).fill('');
    await emailInput(2).dispatchEvent('change'); await emailInput(2).evaluate((el) => el.blur());
    await page.evaluate(() => window.saveRoster());
    await page.locator('#rosterStatus').filter({ hasText: '3학년 1반 3번: 성명이나 학생 구글계정 중 하나는 적어 주세요' }).waitFor({ timeout: 5000 });
    assert.equal(savedStudents.length, 3, '막힌 저장은 서버로 가지 않는다');
    await page.reload();

    // 붙여넣기는 더하거나 고칠 뿐 아무도 지우지 않는다. 6학년 1반 한 줄을 붙여넣어도 3학년 1반 세 명은 그대로 남아 같이 저장된다.
    await page.locator('#rosterBody tr').nth(2).waitFor();
    await page.evaluate(() => window.togglePasteSection());
    await page.locator('#pasteInput').fill('학년\t반\t번호\t성명\t성별\t학생구글계정\n6\t1\t1\t\t여\tks266101@kyesang.sen.es.kr');
    await page.evaluate(() => window.parsePaste());
    await page.locator('#pasteStatus').filter({ hasText: '1명 파싱 완료. 기존 명단에 새 학생 1명을 더하고. 기존 학생은 지워지지 않습니다.' }).waitFor({ timeout: 5000 });
    assert.equal(await page.locator('#rosterBody tr:not(.class-divider)').count(), 4, '기존 세 줄에 붙여넣은 한 줄이 더해진다');
    const dialogsBefore = dialogs.length;
    await page.evaluate(() => window.saveRoster());
    await waitFor(page, savedStudents, 4);
    assert.equal(dialogs.length, dialogsBefore, '아무도 빠지지 않으면 묻지 않는다');
    assert.equal(savedStudents[3].confirmRemoval, false);
    assert.deepEqual(savedStudents[3].students.map((s) => `${s.grade}-${s.classNumber}-${s.studentNumber}`), ['3-1-1', '3-1-2', '3-1-3', '6-1-1']);
    await waitReloaded();

    // 붙여넣기: 성명 열이 아예 없어도 학생구글계정 열이 있으면 받고, 그 줄은 대기로 미리 보인다.
    // 3학년 1반 두 명만 붙여넣어도 같은 번호의 두 줄만 고쳐지고 3번 김철수는 그대로 남는다.
    await page.evaluate(() => window.togglePasteSection());
    await page.locator('#pasteInput').fill('학년\t반\t번호\t성별\t학생구글계정\n3\t1\t1\t남\ts3101@school.test\n3\t1\t2\t여\ts3102@school.test');
    await page.evaluate(() => window.parsePaste());
    await page.locator('#pasteStatus').filter({ hasText: '2명 파싱 완료. 기존 명단에 새 학생 0명을 더하고 같은 학년·반·번호 2명은 붙여넣은 내용으로 고칩니다. 기존 학생은 지워지지 않습니다.' }).waitFor({ timeout: 5000 });
    assert.equal(await page.locator('#rosterBody .name-chip.pending').count(), 2, '성명 없는 줄은 대기로 보인다');
    assert.equal(await page.locator('#rosterBody tr:not(.class-divider)').count(), 3, '붙여넣기에 없던 3번은 남는다');
    const dialogsBeforeMerge = dialogs.length;
    await page.evaluate(() => window.saveRoster());
    await waitFor(page, savedStudents, 5);
    assert.equal(dialogs.length, dialogsBeforeMerge, '아무도 빠지지 않으니 묻지 않는다');
    assert.equal(savedStudents[4].confirmRemoval, false);
    assert.deepEqual(savedStudents[4].students.map((s) => [s.studentNumber, s.rosterName, s.studentEmail, s.gender]),
      [['1', '', 's3101@school.test', '남'], ['2', '', 's3102@school.test', '여'], ['3', '김철수', 's3103@school.test', '남']]);
    await waitReloaded();

    // 지우는 것은 줄의 🗑️뿐이다. 그때 저장하면 누가 빠지는지 이름을 보여 주며 묻고, 물리면 보내지 않는다.
    await page.evaluate(() => window.deleteStudentRow(2));
    dialogAction = 'dismiss';
    await page.evaluate(() => window.saveRoster());
    await page.locator('#rosterStatus').filter({ hasText: '저장을 취소했습니다' }).waitFor({ timeout: 5000 });
    assert.match(dialogs[dialogs.length - 1], /다음 1명이 2026년도 명단에서 빠집니다[\s\S]*3학년 1반 3번 김철수/);
    assert.equal(savedStudents.length, 5, '물리면 서버로 가지 않는다');
    dialogAction = 'accept';
    await page.evaluate(() => window.saveRoster());
    await waitFor(page, savedStudents, 6);
    assert.equal(savedStudents[5].confirmRemoval, true, '확인하고 저장하면 그 표시가 같이 간다');
    assert.deepEqual(savedStudents[5].students.map((s) => s.studentNumber), ['1', '2']);
    await waitReloaded();

    // 붙여넣기에 같은 학생구글계정이 두 줄 있으면 미리보기 단계에서 알려 준다.
    await page.locator('#rosterBody tr').nth(2).waitFor();
    await page.evaluate(() => window.togglePasteSection());
    await page.locator('#pasteInput').fill('학년\t반\t번호\t성명\t성별\t학생구글계정\n3\t1\t1\t김철수\t남\tdup@school.test\n3\t1\t2\t이영희\t여\tDup@school.test');
    await page.evaluate(() => window.parsePaste());
    await page.locator('#pasteStatus').filter({ hasText: '학생구글계정이 겹치는 줄이 있습니다(dup@school.test)' }).waitFor({ timeout: 5000 });
    // 다음 단계가 붙여넣기 칸을 다시 여니 여기서는 닫아 둔다.
    await page.evaluate(() => window.togglePasteSection());

    // 성명 열이 있고 일부만 비운 경우. 성명도 계정도 없는 줄은 버린다.
    await page.locator('#rosterBody tr').nth(2).waitFor();
    await page.evaluate(() => window.togglePasteSection());
    await page.locator('#pasteInput').fill('학년\t반\t번호\t성명\t성별\t학생구글계정\n3\t1\t1\t\t남\ts3101@school.test\n3\t1\t2\t김철수\t남\t\n3\t1\t3\t\t남\t');
    await page.evaluate(() => window.parsePaste());
    await page.locator('#pasteStatus').filter({ hasText: '2명 파싱 완료. 성명도 학생구글계정도 없는 1줄은 건너뛰었습니다' }).waitFor({ timeout: 5000 });

    // ── 교직원 명단 ──
    await page.locator('#tab-teachers').click();
    await page.locator('#teacherRosterBody tr').nth(2).waitFor();
    const teacherRows = page.locator('#teacherRosterBody tr');
    assert.equal(await teacherRows.nth(1).locator('input').nth(0).inputValue(), '', '대기 줄의 성명 칸은 비어 보인다');
    assert.equal(await teacherRows.nth(1).locator('input').nth(0).getAttribute('placeholder'), '로그인 때 채움');
    assert.equal(await teacherRows.nth(1).locator('.name-chip.pending').count(), 1);
    assert.equal(await teacherRows.nth(2).locator('input').nth(0).inputValue(), '이영희');
    assert.equal(await teacherRows.nth(2).locator('.name-chip.google').count(), 1);
    assert.equal(await teacherRows.nth(2).locator('.name-chip.mismatch').count(), 0);
    assert.equal(await teacherRows.nth(0).locator('.name-chip.mismatch').count(), 1, '관리자 줄도 구글 이름이 다르면 표시한다');
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
    await page.locator('#input-status').filter({ hasText: '1번: 성명이나 학생 구글계정 중 하나는 적어 주세요' }).waitFor({ timeout: 5000 });
    assert.equal(await page.locator('#save-button').isDisabled(), true);
    // 뒤쪽 학생의 성명이 비어 줄 수가 모자라도 같은 규칙이다: 계정이 없으면 막고, 있으면 통과한다.
    await page.locator('#student-emails').fill('s3101@school.test');
    await page.locator('#student-emails').dispatchEvent('input');
    await page.locator('#names').fill('박민수');
    await page.locator('#names').dispatchEvent('input');
    await page.locator('#input-status').filter({ hasText: '2번: 성명이나 학생 구글계정 중 하나는 적어 주세요' }).waitFor({ timeout: 5000 });
    await page.locator('#student-emails').fill('s3101@school.test\ns3102@school.test');
    await page.locator('#student-emails').dispatchEvent('input');
    await page.locator('#input-status').filter({ hasText: '2명의 학생 명단이 준비되었습니다' }).waitFor({ timeout: 5000 });
    assert.equal(await page.locator('#save-button').isDisabled(), false);
    // 같은 학생 구글계정을 두 줄에 적으면 막는다.
    await page.locator('#student-emails').fill('s3101@school.test\nS3101@school.test');
    await page.locator('#student-emails').dispatchEvent('input');
    await page.locator('#input-status').filter({ hasText: '학생 구글계정이 두 줄에 있습니다: s3101@school.test' }).waitFor({ timeout: 5000 });
    assert.equal(await page.locator('#save-button').isDisabled(), true);

    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ ok: true }));
  } finally {
    if (browser) await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
})().catch((error) => { console.error(error); process.exit(1); });
