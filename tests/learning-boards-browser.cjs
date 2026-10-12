const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const { createHarness } = require('./learning-boards-harness.cjs');

(async () => {
  const h = await createHarness();
  const output = path.resolve(__dirname, '../outputs/learning-boards-review'); fs.mkdirSync(output, { recursive: true });
  async function capture(page, name) {
    const bytes = await page.screenshot({ fullPage: true });
    const converted = spawnSync('python', ['-c', 'import sys,io; from PIL import Image; Image.open(io.BytesIO(sys.stdin.buffer.read())).save(sys.argv[1],format="WEBP",lossless=True)', path.join(output, name)], { input: bytes });
    assert.equal(converted.status, 0, converted.stderr?.toString());
  }
  let browser;
  try {
    browser = await chromium.launch({ headless: true, ...(process.platform === 'win32' ? { channel: 'msedge' } : {}) });
    const teacherContext = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    await teacherContext.addCookies([{ name: 'test_teacher', value: '1', url: h.base }]);
    const studentContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const teacher = await teacherContext.newPage(), student = await studentContext.newPage();
    const errors = []; for (const page of [teacher, student]) page.on('pageerror', e => errors.push(e.message));
    async function overflow(page) { assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'no page-wide horizontal overflow'); }
    await student.goto(h.base + '/boards/'); await overflow(student);
    await capture(student, 'entry-mobile.webp');
    await teacher.goto(h.base + '/boards/?mode=teacher'); await teacher.locator('#newBoard').click();
    await teacher.locator('input[name=layout][value=quiz]').check();
    await teacher.locator('#createTitle').fill('문제 출제');
    await capture(teacher, 'create-quiz.webp');
    await teacher.locator('#createForm button[type=submit]').click();
    await teacher.locator('#boardView').waitFor({ state: 'visible' });
    const boardUrl = teacher.url(); const code = await teacher.locator('#boardCode').innerText();
    await student.locator('#joinCode').fill(code); await student.locator('#joinNumber').fill('1'); await student.locator('#joinName').fill('민서');
    await student.locator('#joinForm button[type=submit]').click(); await student.locator('#boardView').waitFor({ state: 'visible' });
    await student.locator('#writePost').click(); await student.locator('#postContent').fill('지구는 태양 주위를 돈다.'); await student.locator('#postExplanation').fill('지구는 태양 주위를 공전해요.');
    await capture(student, 'student-author-mobile.webp');
    await student.locator('#submitPost').click(); await student.locator('.post').waitFor();
    await teacher.getByRole('button', { name: '수정 요청', exact: true }).waitFor();
    await teacher.getByRole('button', { name: '수정 요청', exact: true }).click(); await teacher.locator('#reviewFeedback').fill('공전의 뜻을 덧붙여 주세요.');
    await teacher.locator('#reviewForm button[type=submit]').click();
    await student.locator('.feedback').waitFor(); assert.match(await student.locator('.feedback').innerText(), /공전의 뜻/);
    await student.getByRole('button', { name: '수정·재제출' }).click(); await student.locator('#postExplanation').fill('공전은 한 천체가 다른 천체 주위를 도는 운동이에요.'); await student.locator('#submitPost').click();
    await teacher.locator('.badge.pending').waitFor(); await teacher.getByRole('button', { name: '승인', exact: true }).click(); await teacher.locator('.badge.approved').waitFor();
    await capture(teacher, 'teacher-approved.webp');
    await student.locator('#writePost').click(); await student.locator('#postKind').selectOption('choice'); await student.locator('#postContent').fill('2 + 3은 얼마일까요?');
    for (const [i, value] of ['4', '5', '6', '7'].entries()) await student.locator('.choice-input').nth(i).fill(value);
    await student.locator('#postAnswer').selectOption('1'); await student.locator('#submitPost').click();
    await teacher.getByRole('button', { name: '승인', exact: true }).waitFor(); await teacher.getByRole('button', { name: '승인', exact: true }).click();
    await teacher.waitForFunction(() => document.querySelectorAll('.badge.approved').length === 2);
    await teacher.locator('#buildSet').click(); assert.equal(await teacher.locator('#approvedChoices input:checked').count(), 2);
    await teacher.locator('#setName').fill('과학·수학'); await teacher.locator('#buildForm button[type=submit]').click();
    await teacher.locator('#setView').waitFor({ state: 'visible' });
    await teacher.getByRole('button', { name: '경주 시작', exact: true }).last().waitFor();
    assert.equal(await teacher.locator('.question-card').count(), 2);
    assert.equal(await student.locator('#setDetails').isVisible(), false, 'student cannot open the question set');
    await teacher.goto(boardUrl); await teacher.locator('#shareBoard').click();
    await teacher.locator('#shareQr').waitFor(); await teacher.waitForFunction(() => document.getElementById('shareQr').naturalWidth > 0);
    await capture(teacher, 'share-qr.webp');
    // The same public entry and composer must also work for all three discussion layouts.
    for (const layout of ['wall', 'columns', 'roster']) {
      const response = await teacherContext.request.post(h.base + '/api/boards/', { data: { title: `${layout} 게시판`, layout, slots: 3, columns: ['예상', '관찰', '결론'] } });
      assert.equal(response.status(), 201); const { board } = await response.json();
      await student.goto(h.base + '/room/'); await student.locator('#roomCode').fill(board.code); await student.locator('#roomForm button').click();
      await student.locator('#joinNumber').fill('1'); await student.locator('#joinName').fill('민서'); await student.locator('#joinForm button').click();
      await student.locator('#boardView').waitFor({ state: 'visible' });
      await student.locator('#writePost').click(); await student.locator('#postContent').fill('우리의 첫 생각 <script>alert(1)</script>');
      await student.locator('#postLink').fill('https://example.org/');
      if (layout === 'columns') await student.locator('#postColumn').selectOption('1');
      await student.locator('#submitPost').click(); await student.locator('.post').waitFor();
      assert.match(await student.locator('.post-content').innerText(), /<script>/, 'student text is displayed literally');
      await overflow(student); await capture(student, `${layout}-mobile.webp`);
      await teacher.goto(h.base + '/boards/?id=' + board.id); await teacher.locator('.post').waitFor(); await overflow(teacher);
      await capture(teacher, `${layout}-desktop.webp`);
    }
    assert.deepEqual(errors, []);
    console.log('PASS: desktop teacher + mobile student, OX/choice authoring, changes/review, private approved set, race entry, QR and no horizontal overflow.');
  } finally { await browser?.close(); await h.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
