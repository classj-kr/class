const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const { createHarness } = require('./learning-boards-harness.cjs');

(async () => {
  const h = await createHarness();
  const output = path.resolve(__dirname, '../output/learning-boards-review'); fs.mkdirSync(output, { recursive: true });
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
    await student.screenshot({ path: path.join(output, 'entry-mobile.png'), fullPage: true });
    await teacher.goto(h.base + '/boards/?mode=teacher'); await teacher.locator('#newBoard').click();
    await teacher.locator('input[name=layout][value=quiz]').check();
    await teacher.locator('#createTitle').fill('문제 출제');
    await teacher.screenshot({ path: path.join(output, 'create-quiz.png'), fullPage: true });
    await teacher.locator('#createForm button[type=submit]').click();
    await teacher.locator('#boardView').waitFor({ state: 'visible' });
    const boardUrl = teacher.url(); const code = await teacher.locator('#boardCode').innerText();
    await student.locator('#joinCode').fill(code); await student.locator('#joinNumber').fill('1'); await student.locator('#joinName').fill('민서');
    await student.locator('#joinForm button[type=submit]').click(); await student.locator('#boardView').waitFor({ state: 'visible' });
    await student.locator('#writePost').click(); await student.locator('#postContent').fill('지구는 태양 주위를 돈다.'); await student.locator('#postExplanation').fill('지구는 태양 주위를 공전해요.');
    await student.screenshot({ path: path.join(output, 'student-author-mobile.png'), fullPage: true });
    await student.locator('#submitPost').click(); await student.locator('.post').waitFor();
    await teacher.getByRole('button', { name: '수정 요청', exact: true }).waitFor();
    await teacher.getByRole('button', { name: '수정 요청', exact: true }).click(); await teacher.locator('#reviewFeedback').fill('공전의 뜻을 덧붙여 주세요.');
    await teacher.locator('#reviewForm button[type=submit]').click();
    await student.locator('.feedback').waitFor(); assert.match(await student.locator('.feedback').innerText(), /공전의 뜻/);
    await student.getByRole('button', { name: '수정·재제출' }).click(); await student.locator('#postExplanation').fill('공전은 한 천체가 다른 천체 주위를 도는 운동이에요.'); await student.locator('#submitPost').click();
    await teacher.locator('.badge.pending').waitFor(); await teacher.getByRole('button', { name: '승인', exact: true }).click(); await teacher.locator('.badge.approved').waitFor();
    await teacher.screenshot({ path: path.join(output, 'teacher-approved.png'), fullPage: true });
    await student.locator('#writePost').click(); await student.locator('#postKind').selectOption('choice'); await student.locator('#postContent').fill('2 + 3은 얼마일까요?');
    for (const [i, value] of ['4', '5', '6', '7'].entries()) await student.locator('.choice-input').nth(i).fill(value);
    await student.locator('#postAnswer').selectOption('1'); await student.locator('#submitPost').click();
    await teacher.getByRole('button', { name: '승인', exact: true }).waitFor(); await teacher.getByRole('button', { name: '승인', exact: true }).click();
    await teacher.waitForFunction(() => document.querySelectorAll('.badge.approved').length === 2);
    await teacher.locator('#buildSet').click(); assert.equal(await teacher.locator('#approvedChoices input:checked').count(), 2);
    await teacher.locator('#setName').fill('과학·수학'); await teacher.locator('#buildForm button[type=submit]').click();
    await teacher.locator('#setView').waitFor({ state: 'visible' }); await teacher.getByRole('button', { name: '풀이 시작', exact: true }).click();
    await student.locator('#setDetails summary').click();
    await student.getByRole('button', { name: '문제 풀기' }).waitFor(); await student.getByRole('button', { name: '문제 풀기' }).click();
    await student.locator('.question-card').first().waitFor();
    assert.equal(await student.locator('.question-result').count(), 0);
    await student.locator('.question-card').nth(0).getByRole('button').nth(0).click();
    await student.locator('.question-card').nth(0).locator('.hint').waitFor();
    await student.locator('.question-card').nth(1).getByRole('button').nth(1).click();
    await student.locator('.question-card').nth(1).locator('.hint').waitFor();
    await overflow(student); await student.screenshot({ path: path.join(output, 'student-quiz-mobile.png'), fullPage: true });
    await teacher.waitForFunction(() => [...document.querySelectorAll('.results')].every(n => n.textContent.includes('응답 1명')));
    await teacher.getByRole('button', { name: '답안 마감', exact: true }).click();
    teacher.once('dialog', dialog => dialog.accept()); await teacher.getByRole('button', { name: '정답·해설 공개', exact: true }).click();
    await student.waitForFunction(() => document.querySelectorAll('.question-result').length === 2);
    assert.match(await student.locator('#setProgress').innerText(), /정답 2 \/ 2/);
    await teacher.screenshot({ path: path.join(output, 'teacher-results.png'), fullPage: true });
    await student.reload(); await student.locator('#setView').waitFor({ state: 'visible' }); assert.match(await student.locator('#setProgress').innerText(), /정답 2 \/ 2/);
    await teacher.goto(boardUrl); await teacher.locator('#shareBoard').click();
    await teacher.locator('#shareQr').waitFor(); await teacher.waitForFunction(() => document.getElementById('shareQr').naturalWidth > 0);
    await teacher.screenshot({ path: path.join(output, 'share-qr.png'), fullPage: true });
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
      await overflow(student); await student.screenshot({ path: path.join(output, `${layout}-mobile.png`), fullPage: true });
      await teacher.goto(h.base + '/boards/?id=' + board.id); await teacher.locator('.post').waitFor(); await overflow(teacher);
      await teacher.screenshot({ path: path.join(output, `${layout}-desktop.png`), fullPage: true });
    }
    assert.deepEqual(errors, []);
    console.log('PASS: desktop teacher + mobile student, OX/choice authoring, changes/review, approved set, answering, reveal, reload, QR and no horizontal overflow.');
  } finally { await browser?.close(); await h.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
