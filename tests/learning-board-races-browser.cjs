const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const { createHarness } = require('./learning-boards-harness.cjs');

(async () => {
  const h = await createHarness();
  let browser;
  try {
    browser = await chromium.launch({ headless: true, ...(process.platform === 'win32' ? { channel: 'msedge' } : {}) });
    const teacherContext = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    await teacherContext.addCookies([{ name: 'test_teacher', value: '1', url: h.base }]);
    const aliceContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const bobContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const teacher = await teacherContext.newPage(), alice = await aliceContext.newPage(), bob = await bobContext.newPage();
    const errors = []; for (const p of [teacher, alice, bob]) p.on('pageerror', e => errors.push(e.message));
    async function post(context, route, data) {
      const res = await context.request.post(h.base + '/api/boards' + route, { data });
      assert.ok(res.ok(), await res.text()); return res.json();
    }
    const { board } = await post(teacherContext, '/', { title: '순위전 확인', layout: 'quiz', slots: 30 });
    const base = '/' + board.id;
    await post(aliceContext, '/join', { code: board.code, number: 1, name: '민서' });
    await post(bobContext, '/join', { code: board.code, number: 2, name: '윤서' });
    const q = await post(aliceContext, base + '/posts', { kind: 'ox', content: '지구는 태양 주위를 돈다.', answer: 0, explanation: '지구는 태양 주위를 공전합니다.' });
    await post(teacherContext, base + '/posts/' + q.id + '/review', { revision: 1, status: 'approved' });
    const q2 = await post(teacherContext, base + '/posts', { kind: 'choice', content: '2 + 3은?', choices: ['4', '5'], answer: 1 });
    await post(teacherContext, base + '/posts/' + q2.id + '/review', { revision: 1, status: 'approved' });
    const set = await post(teacherContext, base + '/sets', { title: '연습', posts: [{ id: q.id, revision: 2 }, { id: q2.id, revision: 2 }] });
    await alice.goto(h.base + '/boards/?id=' + board.id);
    await bob.goto(h.base + '/boards/?id=' + board.id);
    await bob.locator('#boardView').waitFor(); assert.equal(await bob.locator('.post').count(), 0);
    await teacher.goto(h.base + '/boards/?id=' + board.id + '&set=' + set.id);
    const settings = teacher.getByRole('dialog', { name: '순위전 설정' });
    const seconds = settings.getByRole('spinbutton', { name: /문제당 제한 시간/ });
    await teacher.locator('#setControls').getByRole('button', { name: '순위전 시작', exact: true }).click();
    assert.equal(await seconds.inputValue(), '20');
    await settings.getByRole('button', { name: '닫기' }).click();
    await teacher.locator('#backToBoard').click();
    await teacher.locator('#setDetails summary').click();
    await teacher.locator('#setList').getByRole('button', { name: '순위전 시작', exact: true }).click();
    await seconds.fill('37');
    await settings.getByLabel('전체 경기 시간').selectOption('90');
    await settings.getByLabel('경기 방식').selectOption('2');
    await settings.getByRole('button', { name: '대기실 열기' }).click();
    await teacher.locator('#teacher').waitFor({ state: 'visible' });
    await alice.locator('#student').waitFor({ state: 'visible' });
    await bob.locator('#student').waitFor({ state: 'visible' });
    assert.match(await teacher.locator('#roundLabel').innerText(), /문제당 37초/);
    assert.match(await bob.locator('#roundLabel').innerText(), /문제당 37초/);
    await teacher.waitForFunction(() => document.getElementById('participation').textContent === '입장 2명');
    assert.equal(await alice.locator('#studentName').innerText(), '민서');
    await alice.getByRole('button', { name: /빨강팀/ }).click();
    await bob.getByRole('button', { name: /파랑팀/ }).click();
    await teacher.locator('#ranking').getByText('윤서', { exact: true }).waitFor();
    await teacher.locator('#advance').click();
    await teacher.locator('#advance').waitFor({ state: 'hidden' });
    await teacher.locator('#automatic').waitFor({ state: 'hidden' });
    await teacher.locator('#raceCue[data-kind=countdown]').waitFor({ state: 'visible' });
    await bob.locator('#choices button').first().waitFor();
    const route = h.base + '/api/boards' + base + '/races/' + new URL(teacher.url()).searchParams.get('game');
    const raceState = await (await bobContext.request.get(route)).json();
    assert.equal(raceState.endsAt - raceState.startsAt, 37000);
    assert.equal(raceState.raceEndsAt - raceState.startsAt, 90000);
    await alice.locator('#choices button').first().click();
    await alice.waitForFunction(() => document.getElementById('feedback').textContent.includes('정답 · +'));
    await alice.waitForFunction(() => document.getElementById('question').textContent === '2 + 3은?');
    await alice.locator('#choices button').nth(1).click();
    await alice.waitForFunction(() => document.getElementById('roundLabel').textContent === '3번째 문제');
    assert.equal(await alice.locator('#question').innerText(), '지구는 태양 주위를 돈다.');
    assert.equal(await bob.locator('#roundLabel').innerText(), '1번째 문제');
    assert.equal(await bob.locator('#feedback').innerText(), '');
    await bob.reload();
    await bob.locator('#choices button').first().waitFor();
    assert.equal(await bob.locator('#roundLabel').innerText(), '1번째 문제');
    await bob.locator('#choices button').first().click();
    await bob.waitForFunction(() => document.getElementById('feedback').textContent.includes('정답 · +'));
    await teacher.waitForFunction(() => document.getElementById('participation').textContent === '참여 2명 · 풀이 3회');
    const output = path.resolve('outputs/learning-board-races'); fs.mkdirSync(output, { recursive: true });
    async function capture(page, name) {
      const bytes = await page.screenshot({ fullPage: true });
      const target = path.join(output, name + '.webp');
      const result = spawnSync('python', ['-c', 'import sys,io; from PIL import Image; Image.open(io.BytesIO(sys.stdin.buffer.read())).save(sys.argv[1],format="WEBP",lossless=True)', target], { input: bytes });
      assert.equal(result.status, 0, result.stderr?.toString());
    }
    await capture(teacher, 'teacher-race'); await capture(bob, 'student-answer');
    teacher.once('dialog', dialog => dialog.accept());
    await teacher.locator('#finish').click();
    await bob.waitForFunction(() => document.getElementById('studentStatus').textContent.includes('순위전 종료'));
    await teacher.getByRole('button', { name: '게시판으로', exact: true }).waitFor();
    assert.equal(await teacher.locator('#raceCueValue').innerText(), '빨강팀');
    for (const page of [teacher, alice, bob]) assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    assert.equal(await bob.locator('#teacher').isVisible(), false);

    const { board: art } = await post(teacherContext, '/', { title: '작품 순위전 확인', layout: 'wall' });
    await post(aliceContext, '/join', { code: art.code, number: 1, name: '민서' });
    const upload = await aliceContext.request.post(h.base + '/api/boards/' + art.id + '/images', {
      headers: { 'Content-Type': 'image/webp' },
      data: fs.readFileSync(path.join(__dirname, '../assets/icons/favicon-32x32.webp'))
    });
    assert.ok(upload.ok(), await upload.text());
    const artwork = await post(aliceContext, '/' + art.id + '/posts', { content: '별이 빛나는 밤', image: (await upload.json()).id });
    const decoys = await teacherContext.request.put(h.base + '/api/boards/' + art.id + '/posts/' + artwork.id + '/decoys', {
      data: { decoys: ['바다', '봄 소풍', '오후의 숲'] }
    });
    assert.ok(decoys.ok(), await decoys.text());
    await teacher.goto(h.base + '/boards/?id=' + art.id);
    await teacher.locator('#artQuiz').click();
    await seconds.fill('62');
    await settings.getByRole('button', { name: '대기실 열기' }).click();
    await teacher.locator('#teacher').waitFor({ state: 'visible' });
    assert.match(await teacher.locator('#roundLabel').innerText(), /문제당 62초/);
    const artRaceUrl = teacher.url();
    await teacher.goto(h.base + '/boards/?id=' + art.id);
    await teacher.getByRole('button', { name: /진행 중인 순위전으로/ }).click();
    await teacher.waitForURL(artRaceUrl);
    await teacher.locator('#teacher').waitFor({ state: 'visible' });
    assert.match(await teacher.locator('#roundLabel').innerText(), /문제당 62초/);
    await alice.goto(h.base + '/boards/?id=' + art.id);
    await alice.locator('#student').waitFor({ state: 'visible' });
    await teacher.locator('#advance').click();
    await alice.locator('#textAnswer').fill('민서');
    await alice.locator('#textAnswer').press('Enter');
    await alice.waitForFunction(() => document.getElementById('feedback').textContent.includes('정답 · +'));
    await alice.locator('#choices button').first().waitFor();
    assert.equal(await alice.locator('#studentArt').isVisible(), false);
    assert.match(await alice.locator('#question').innerText(), /민서 학생이 올린 작품의 제목/);
    await alice.getByRole('button', { name: /별이 빛나는 밤/ }).click();
    await alice.waitForFunction(() => document.getElementById('feedback').textContent.includes('정답 · +'));
    assert.deepEqual(errors, []);
    console.log('PASS: custom timers, teams, independent repeat play, reload, results, typed artist name and title question without image.');
  } finally { await browser?.close(); await h.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
