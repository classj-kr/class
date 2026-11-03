const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const { createHarness } = require('./learning-boards-harness.cjs');
const { drawing } = require('../game-hub-server/stacking-boards');
const output = path.resolve('outputs/stacking-boards');
const convert = "import io,sys;from PIL import Image;im=Image.open(io.BytesIO(sys.stdin.buffer.read())).convert('RGBA');im.save(sys.argv[1],format='WEBP',lossless=True);out=Image.open(sys.argv[1]).convert('RGBA');assert im.size==out.size and im.tobytes()==out.tobytes()";
(async () => {
  const h = await createHarness(); let browser;
  try {
    browser = await chromium.launch({ headless: true, ...(process.platform === 'win32' ? { channel: 'msedge' } : {}) });
    const errors = [], contexts = [];
    async function context(width = 1366) {
      const c = await browser.newContext({ viewport: { width, height: 900 } }); contexts.push(c);
      // Prove other browsers update from server events, without the periodic fallback.
      await c.addInitScript(() => { const interval = window.setInterval; window.setInterval = (fn, delay, ...args) => delay === 5000 ? 0 : interval(fn, delay, ...args); });
      return c;
    }
    async function page(c) { const p = await c.newPage(); p.on('pageerror', e => errors.push(e.message)); return p; }
    async function snap(p, name) {
      fs.mkdirSync(output, { recursive: true }); await p.evaluate(() => document.fonts.ready);
      const r = spawnSync('python', ['-c', convert, path.join(output, name + '.webp')], { input: await p.screenshot() }); assert.equal(r.status, 0, String(r.stderr));
    }
    const teacherContext = await context(); await teacherContext.addCookies([{ name: 'test_teacher', value: '1', url: h.base }]);
    const teacher = await page(teacherContext);
    await teacher.goto(h.base + '/learning/inquiry/math/stacking-cubes/coop/');
    await teacher.locator('#coop-bank-title').fill('함께 만든 입체');
    await teacher.locator('#coop-create button').click();
    await teacher.locator('#coop-board').waitFor();
    await teacher.getByRole('spinbutton', { name: '모둠 수' }).fill('1'); await teacher.getByRole('button', { name: '적용', exact: true }).click();
    await teacher.waitForFunction(() => document.querySelectorAll('.coop-team').length === 1);
    const boardId = new URL(teacher.url()).searchParams.get('id');
    const code = (await teacher.locator('#coop-title').textContent()).match(/방 (\d{4})/)[1];
    await teacher.getByRole('button', { name: '자동 출제로 팀전 시작' }).click();
    await teacher.getByRole('button', { name: '팀전 마치기' }).waitFor();
    const students = [];
    for (let i = 0; i < 4; i++) {
      const c = await context(i === 3 ? 390 : 1280);
      await c.addCookies([{ name: i < 3 ? 'test_student' : 'test_guest', value: i < 3 ? String(i + 3) : '1', url: h.base }]);
      const joined = await c.request.post(h.base + '/api/boards/join', { data: { code, name: '학생' + (i + 1), number: i + 1 } }); assert.equal(joined.status(), 200);
      const p = await page(c); students.push(p);
      await p.goto(h.base + '/room/'); await p.locator('#roomCode').fill(code); await p.locator('#roomForm button').click();
      // Recognized guests reuse their member cookie even though this fixture omits platform identity.
      await p.waitForURL(/\/coop\//); await p.locator('#coop-board').waitFor();
      await p.getByRole('button', { name: '이 모둠 참여' }).click();
      await p.locator('#coop-panel').waitFor({ state: 'hidden' });
    }
    const [builder, front, side, top] = students;
    await top.getByRole('button', { name: '확인하기', exact: true }).waitFor();
    await teacher.getByRole('button', { name: '팀전 마치기' }).click();
    await teacher.getByRole('button', { name: '출제로 돌아가기' }).click();
    for (const p of students) await p.getByRole('button', { name: '입체 완성' }).waitFor();
    await builder.evaluate(() => { window.playedSounds = []; const play = StackingSounds.play; StackingSounds.play = (...args) => { window.playedSounds.push(args[0]); return play(...args); }; });
    await Promise.all([builder, side].map(async p => { await p.locator('#scene').focus(); await p.keyboard.press('Enter'); }));
    for (const p of students) await p.waitForFunction(() => document.getElementById('total').textContent === '전체 2개');
    await builder.waitForFunction(() => window.playedSounds.filter(kind => kind === 'add').length === 1);
    await front.getByRole('button', { name: '입체 완성', exact: true }).click();
    const target = Array(25).fill(0); target[12] = 2;
    for (const [p, view] of [[front, 'front'], [side, 'right'], [top, 'top']]) {
      await p.locator('.coop-view-tabs').getByRole('button', { name: {front:'앞',right:'오른쪽 옆',top:'위'}[view], exact:true }).click();
      await p.getByRole('button', { name: '그림 확인', exact: true }).waitFor();
      await p.locator(`#scene .direction-marker.is-assigned[data-direction="${view}"]`).waitFor();
      assert.equal(await p.locator('#coop-dock').getAttribute('data-direction'), view, 'drawing and 3D direction share the assigned role');
      const cells = drawing(target, view);
      for (let i = 0; i < cells.length; i++) if (cells[i]) await p.locator(`.coop-draw-grid [data-cell="${i}"]`).click();
      await p.getByRole('button', { name: '그림 확인', exact: true }).click();
      await p.getByRole('button', { name: '확인 완료', exact: true }).waitFor();
    }
    await snap(front, 'front-author');
    await snap(top, 'phone-author');
    await builder.locator('#coop-question-title').fill('두 층 탑');
    await top.waitForFunction(() => document.getElementById('coop-question-title').value === '두 층 탑');
    await top.getByRole('button', { name: '문제 등록', exact: true }).click();
    await teacher.getByText('두 층 탑', { exact: true }).waitFor();
    await snap(teacher, 'teacher-bank');
    await side.getByRole('button', { name: '다음 문제', exact: true }).click();
    for (const p of students) {
      await p.waitForFunction(() => document.getElementById('total').textContent === '전체 0개');
      assert.equal(await p.locator('#tools').isVisible(), true);
    }
    await teacher.locator('.coop-question input[type=checkbox]').check();
    await teacher.getByRole('button', { name: '선택한 1문제로 팀전 시작', exact: true }).click();
    for (const p of students) {
      await p.waitForFunction(() => document.getElementById('total').textContent === '전체 0개');
      await p.getByRole('button', { name: '확인하기', exact: true }).waitFor();
      assert.equal(await p.locator('#scene .direction-marker.is-assigned').count(), 0, 'team solving clears the authoring role highlight');
    }
    await Promise.all(students.slice(0, 2).map(async p => { await p.locator('#scene').focus(); await p.keyboard.press('Enter'); }));
    for (const p of students) await p.waitForFunction(() => document.getElementById('total').textContent === '전체 2개', null, { timeout: 3000 });
    await snap(front, 'shared-board-desktop'); await snap(top, 'shared-board-phone');
    await top.setViewportSize({ width: 844, height: 390 });
    await snap(top, 'shared-board-landscape');
    const dock = await top.locator('#coop-dock').boundingBox(), tools = await top.locator('#tools').boundingBox();
    assert.ok(dock.x + dock.width <= tools.x, 'landscape targets do not cover the stacking tools');
    await top.setViewportSize({ width: 390, height: 900 });
    await top.context().setOffline(true);
    await front.locator('#scene').focus(); await front.keyboard.press('ArrowLeft'); await front.keyboard.press('Enter');
    await front.waitForFunction(() => document.getElementById('total').textContent === '전체 3개');
    await top.context().setOffline(false);
    await top.waitForFunction(() => document.getElementById('total').textContent === '전체 3개', null, { timeout: 15000 });
    await front.keyboard.press('Control+z');
    await top.waitForFunction(() => document.getElementById('total').textContent === '전체 2개');
    // A teammate reconnects to the authoritative model without resetting the group.
    await top.reload(); await top.waitForFunction(() => document.getElementById('total').textContent === '전체 2개');
    await front.getByRole('button', { name: '확인하기', exact: true }).click();
    await teacher.getByText(/1\/1문제.*완료/).waitFor();
    for (const p of students) await p.locator('#coop-panel').waitFor();
    await teacher.goto(h.base + '/boards/?id=' + boardId);
    await teacher.waitForURL(/\/stacking-cubes\/coop\/\?id=/);
    await teacher.getByText('두 층 탑', { exact: true }).waitFor();
    assert.equal(new URL(teacher.url()).searchParams.get('id'), boardId);
    await teacher.locator('.coop-question input[type=checkbox]').check();
    await teacher.getByRole('button', { name: '선택한 1문제로 팀전 시작', exact: true }).click();
    await builder.getByRole('button', { name: '확인하기', exact: true }).waitFor();
    assert.equal(await builder.locator('#total').textContent(), '전체 0개');
    // Default six slots are optional; two students can author and play immediately.
    await teacher.goto(h.base + '/learning/inquiry/math/stacking-cubes/coop/');
    await teacher.locator('#coop-bank-title').fill('두 명도 바로'); await teacher.locator('#coop-create button').click();
    await teacher.locator('#coop-board').waitFor();
    const smallCode = (await teacher.locator('#coop-title').textContent()).match(/방 (\d{4})/)[1];
    for (const [i, p] of [builder, front].entries()) {
      await p.goto(h.base + '/learning/inquiry/math/stacking-cubes/coop/?code=' + smallCode);
      await p.getByRole('button', { name: '이 모둠 참여' }).first().click();
      await p.locator('#coop-panel').waitFor({ state: 'hidden' });
      if (!i) {
        await p.locator('#scene').focus(); await p.keyboard.press('Enter'); await p.waitForFunction(() => document.getElementById('total').textContent === '전체 1개');
        await p.getByRole('button', { name: '입체 완성', exact: true }).click();
        const soloShape = Array(25).fill(0); soloShape[12] = 1;
        for (const [view, name] of [['front', '앞'], ['right', '오른쪽 옆'], ['top', '위']]) {
          await p.locator('.coop-view-tabs').getByRole('button', { name, exact: true }).click();
          for (const [j, cell] of drawing(soloShape, view).entries()) if (cell) await p.locator(`.coop-draw-grid [data-cell="${j}"]`).click();
          await p.getByRole('button', { name: '그림 확인', exact: true }).click();
          await p.getByRole('button', { name: '확인 완료', exact: true }).waitFor();
        }
        await p.setViewportSize({ width: 390, height: 900 }); await snap(p, 'solo-author-phone');
        await p.getByRole('button', { name: '문제 등록', exact: true }).click();
        await p.getByRole('button', { name: '다음 문제', exact: true }).click();
        await p.waitForFunction(() => document.getElementById('total').textContent === '전체 0개');
        await p.getByRole('button', { name: '입체 완성', exact: true }).waitFor();
        await p.setViewportSize({ width: 1280, height: 900 });
        await p.locator('#scene').focus(); await p.keyboard.press('Enter'); await p.waitForFunction(() => document.getElementById('total').textContent === '전체 1개');
      }
    }
    await front.waitForFunction(() => document.getElementById('total').textContent === '전체 1개');
    await builder.getByRole('button', { name: '입체 완성', exact: true }).click();
    const smallShape = Array(25).fill(0); smallShape[12] = 1;
    for (const [view, name] of [['front', '앞'], ['right', '오른쪽 옆'], ['top', '위']]) {
      await front.locator('.coop-view-tabs').getByRole('button', { name, exact: true }).click();
      for (const [i, cell] of drawing(smallShape, view).entries()) if (cell) await front.locator(`.coop-draw-grid [data-cell="${i}"]`).click();
      await front.getByRole('button', { name: '그림 확인', exact: true }).click();
      await front.getByRole('button', { name: '확인 완료', exact: true }).waitFor();
    }
    await snap(front, 'two-person-author');
    await builder.getByRole('button', { name: '문제 등록', exact: true }).click();
    await teacher.locator('.coop-question input[type=checkbox]').last().check();
    await teacher.getByRole('button', { name: '선택한 1문제로 팀전 시작', exact: true }).click();
    await front.getByRole('button', { name: '확인하기', exact: true }).waitFor();
    await teacher.waitForFunction(() => document.querySelectorAll('.coop-team').length === 1);
    assert.equal(await teacher.locator('.coop-team').count(), 1, 'only the occupied group enters, with five slots still empty');
    await teacher.getByRole('button', {name:'팀전 마치기', exact:true}).click();
    await teacher.getByRole('button', {name:'개인전 방 만들기', exact:true}).click();
    await teacher.waitForURL(/\/race\/\?room=\d{4}/);
    await teacher.locator('#race-start').waitFor();
    assert.equal(await teacher.locator('#race-next-count').inputValue(), '1');
    const codeForIndividual = await teacher.locator('#race-code-label').textContent();
    await front.goto(h.base + '/room/');
    await front.locator('#roomCode').fill(codeForIndividual); await front.locator('#roomForm button').click();
    await front.locator('#race-room').waitFor();
    await teacher.locator('#race-start').click();
    await front.locator('#target-panel').waitFor();
    await front.locator('#scene').focus(); await front.keyboard.press('Enter');
    await front.locator('#check-shape').click();
    await teacher.locator('.race-tower-card.is-complete').waitFor();
    for (const p of [teacher, ...students]) assert.equal(await p.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    assert.deepEqual(errors, []);
    await Promise.all(contexts.map(c => c.close()));
    console.log('PASS: teacher + four students, main room entry, three drawings, publish gate, persistent bank, SSE shared edits, reload and replay; desktop + phone.');
  } finally { await browser?.close(); await h.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
