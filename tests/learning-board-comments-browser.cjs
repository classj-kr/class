const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const { createHarness } = require('./learning-boards-harness.cjs');

(async () => {
  const h = await createHarness(); let browser;
  try {
    browser = await chromium.launch({ headless: true, ...(process.platform === 'win32' ? { channel: 'msedge' } : {}) });
    const tc = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    const ac = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const bc = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await tc.addCookies([{ name: 'test_teacher', value: '1', url: h.base }]);
    const teacher = await tc.newPage(), alice = await ac.newPage(), bob = await bc.newPage();
    const errors = []; for (const p of [teacher, alice, bob]) p.on('pageerror', e => errors.push(e.message));
    async function api(ctx, route, data, method = 'post') {
      const res = await ctx.request[method](h.base + '/api/boards' + route, { data });
      assert.ok(res.ok(), await res.text()); return res.json();
    }
    const { board } = await api(tc, '/', { title: '생각 나누기', layout: 'wall' });
    const base = '/' + board.id;
    await api(ac, '/join', { code: board.code, name: '민서', number: 1 });
    await api(bc, '/join', { code: board.code, name: '윤서', number: 2 });
    const post = await api(tc, base + '/posts', { content: '오늘 수업에서 기억에 남는 내용을 나눠 보세요.' });
    const route = base + '/posts/' + post.id + '/comments';
    for (const p of [teacher, alice, bob]) {
      await p.goto(h.base + '/boards/?id=' + board.id);
      await p.getByRole('button', { name: '댓글 0', exact: true }).click();
      await p.getByText('댓글 없음', { exact: true }).waitFor();
    }
    await alice.getByRole('textbox', { name: '댓글 쓰기', exact: true }).fill('지구의 공전이 기억나요. <b>생각</b>');
    await alice.getByRole('button', { name: '등록', exact: true }).click();
    await alice.locator('.comment-content').filter({ hasText: '<b>생각</b>' }).waitFor();
    await bob.locator('.comment').waitFor();
    assert.equal(await bob.locator('.comment button').count(), 0);
    await teacher.locator('.comment').waitFor();
    assert.equal(await teacher.locator('.comment').getByRole('button', { name: '수정', exact: true }).count(), 0);
    assert.equal(await teacher.locator('.comment').getByRole('button', { name: '삭제', exact: true }).count(), 1);
    // Polling must preserve an unsent draft and the focused textarea.
    const draft = alice.getByRole('textbox', { name: '댓글 쓰기', exact: true });
    await draft.fill('작성 중인 댓글');
    await api(bc, route, { content: '저도 공전이 신기했어요.' });
    await alice.getByRole('button', { name: '댓글 2', exact: true }).waitFor();
    assert.equal(await draft.inputValue(), '작성 중인 댓글');
    assert.equal(await draft.evaluate(n => n === document.activeElement), true);
    await alice.locator('.comment').first().getByRole('button', { name: '수정', exact: true }).click();
    const edit = alice.getByRole('textbox', { name: '댓글 수정', exact: true });
    await edit.fill('지구와 달의 움직임이 기억나요.');
    await api(bc, route, { content: '달의 움직임도 재미있었어요.' });
    await alice.getByRole('button', { name: '댓글 3', exact: true }).waitFor();
    assert.equal(await edit.inputValue(), '지구와 달의 움직임이 기억나요.');
    assert.equal(await edit.evaluate(n => n === document.activeElement), true);
    await alice.getByRole('button', { name: '저장', exact: true }).click();
    await alice.getByText('수정됨', { exact: true }).waitFor();
    await bob.getByText('지구와 달의 움직임이 기억나요.', { exact: true }).waitFor();
    await draft.fill('  '); await alice.getByRole('button', { name: '등록', exact: true }).click();
    await alice.locator('.comment-form .error').filter({ hasText: '입력 내용을 확인' }).waitFor();
    assert.equal(await draft.inputValue(), '  ', 'failed submissions retain input');
    await draft.fill('');
    await teacher.locator('#settingsBoard').click(); await teacher.locator('#settingsNames').check();
    await teacher.locator('#settingsForm button[type=submit]').click();
    await bob.locator('.comment-meta').first().getByText('1번', { exact: true }).waitFor();
    const output = path.resolve('outputs/learning-board-comments'); fs.mkdirSync(output, { recursive: true });
    async function capture(page, name) {
      const bytes = await page.screenshot({ fullPage: true });
      const result = spawnSync('python', ['-c', 'import sys,io;from PIL import Image;Image.open(io.BytesIO(sys.stdin.buffer.read())).save(sys.argv[1],format="WEBP",lossless=True)', path.join(output, name + '.webp')], { input: bytes });
      assert.equal(result.status, 0, result.stderr?.toString());
    }
    await capture(teacher, 'teacher'); await capture(alice, 'student-mobile');
    alice.on('dialog', d => d.accept()); teacher.on('dialog', d => d.accept());
    await alice.locator('.comment').first().getByRole('button', { name: '삭제', exact: true }).click();
    await teacher.getByRole('button', { name: '댓글 2', exact: true }).waitFor();
    await teacher.locator('.comment').first().getByRole('button', { name: '삭제', exact: true }).click();
    await bob.getByRole('button', { name: '댓글 1', exact: true }).waitFor();
    await teacher.locator('#settingsBoard').click(); await teacher.locator('#settingsComments').uncheck();
    await teacher.locator('#settingsForm button[type=submit]').click();
    await alice.locator('.comments-toggle').waitFor({ state: 'detached' });
    await teacher.locator('#settingsBoard').click(); await teacher.locator('#settingsComments').check();
    await teacher.locator('#settingsForm button[type=submit]').click();
    await alice.getByRole('button', { name: '댓글 1', exact: true }).waitFor();
    await alice.reload(); await alice.getByRole('button', { name: '댓글 1', exact: true }).click();
    await alice.getByText('달의 움직임도 재미있었어요.', { exact: true }).waitFor();
    for (const layout of ['columns', 'roster']) {
      const result = await api(tc, '/', { title: layout, layout, columns: ['첫 모둠', '둘째 모둠'] });
      const p = await api(tc, '/' + result.board.id + '/posts', { content: '다른 유형의 글', column: 0 });
      await teacher.goto(h.base + '/boards/?id=' + result.board.id);
      await teacher.getByRole('button', { name: '댓글 0', exact: true }).click();
      await teacher.getByRole('textbox', { name: '댓글 쓰기', exact: true }).fill('선생님 댓글');
      await teacher.getByRole('button', { name: '등록', exact: true }).click();
      await teacher.locator('.comment-content').getByText('선생님 댓글', { exact: true }).waitFor();
      await teacher.locator('.comment').getByRole('button', { name: '수정', exact: true }).waitFor();
      assert.ok(p.id);
    }
    for (const p of [teacher, alice, bob]) assert.equal(await p.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    assert.deepEqual(errors, []);
    console.log('PASS: comments create/edit/delete, teacher moderation, draft and focus retention while polling, text escaping, name privacy, settings, reload and three layouts.');
  } finally { await browser?.close(); await h.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
