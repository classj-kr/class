const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const express = require('../game-hub-server/node_modules/express');
const { chromium, webkit } = require('../game-hub-server/node_modules/playwright');
const { createRhythmTraining } = require('../game-hub-server/rhythm-training');
const root = path.resolve(__dirname, '..'), output = path.join(root, 'tmp', 'rhythm-training');
fs.mkdirSync(output, { recursive: true });
let serverClock = Date.now();
const app = express(); app.use(express.json());
for (const [alias, source] of [['notation.js', 'notation.js'], ['rhythm-notation.js', 'rhythm.js']]) {
    app.get(`/learning/arts/music-theory/rhythm-training/${alias}`, (_req, res) => res.sendFile(path.join(root, 'learning/arts/music-theory/ear-training', source)));
}
app.use('/api/rhythm-training', createRhythmTraining({ now: () => serverClock, platform: {
    isTeacherRequest: async req => (req.headers.cookie || '').includes('testTeacher=1'),
    isContentGloballyDisabled: async () => false, canBypassGlobalContentLock: async () => false
} }).router);
app.use(express.static(root));
const server = app.listen(0, '127.0.0.1');
const errors = [];
function mockAudio() {
    class AudioContext {
        constructor() { this.time = 1; this.state = 'running'; this.outputLatency = 0; this.destination = {}; window.testAudio = this; }
        get currentTime() { return this.time; }
        async resume() { this.state = 'running'; }
        createOscillator() { return { frequency: { setValueAtTime() {} }, connect() {}, disconnect() {}, start() {}, stop() {} }; }
        createGain() { return { gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() {}, disconnect() {} }; }
    }
    window.AudioContext = AudioContext;
}
(async () => {
    await new Promise(resolve => server.once('listening', resolve));
    const origin = `http://127.0.0.1:${server.address().port}`, url = origin + '/learning/arts/music-theory/rhythm-training/';
    const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
    try {
        for (const [width, height] of [[1366, 768], [1024, 768], [768, 1024], [390, 844]]) {
            const page = await browser.newPage({ viewport: { width, height }, hasTouch: true });
            page.on('pageerror', error => errors.push(error.message));
            await page.goto(url); await page.locator('.rhythm-head').first().waitFor();
            assert.equal(await page.locator('.bar').count(), 4);
            assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
            if (width >= 768) assert.ok(await page.locator('#pad').evaluate(node => node.getBoundingClientRect().bottom <= innerHeight), 'pad fits school device');
            await page.screenshot({ path: path.join(output, `chromium-${width}.png`), fullPage: true });
            // Exercise real Web Audio unlock on a user gesture, then stop.
            await page.click('#start'); await page.locator('#stop').waitFor({ state: 'visible' });
            await page.locator('#pad').tap(); await page.click('#stop'); await page.close();
        }
        const solo = await browser.newPage(); await solo.addInitScript(mockAudio); await solo.goto(url);
        await solo.selectOption('#level', '0'); await solo.click('#start');
        await solo.evaluate(() => { testAudio.time = 1 + .18 + 2.4; });
        await solo.keyboard.down('Space');
        for (let i = 0; i < 10; i++) await solo.keyboard.down('Space');
        await solo.keyboard.up('Space');
        await solo.evaluate(() => { testAudio.time = 30; });
        await solo.locator('#result').waitFor({ state: 'visible' });
        assert.equal(await solo.locator('#perfect').textContent(), '1', 'a held space triggers once');
        assert.equal(await solo.locator('#extras').textContent(), '0');
        await solo.close();
        const teacherContext = await browser.newContext();
        await teacherContext.addCookies([{ name: 'testTeacher', value: '1', url: origin }]);
        const teacher = await teacherContext.newPage(); await teacher.goto(url); await teacher.click('#classTab'); await teacher.click('#create');
        await teacher.locator('#roomCode').filter({ hasText: /\d{6}/ }).waitFor();
        const code = await teacher.locator('#roomCode').textContent();
        const student = await browser.newPage(); await student.addInitScript(mockAudio);
        student.on('pageerror', error => errors.push(error.message));
        await student.goto(url + '?room=' + code);
        await student.fill('#name', '리듬학생'); await student.click('#join'); await student.click('#ready');
        await teacher.waitForFunction(() => !document.getElementById('roomStart').disabled);
        const begin = student.waitForResponse(response => response.url().endsWith('/begin') && response.ok());
        await teacher.click('#roomStart'); const data = await (await begin).json();
        await student.locator('#stop').waitFor({ state: 'visible' });
        await student.waitForTimeout(100);
        for (const target of data.chart.targets) {
            await student.evaluate(({ target, bpm }) => {
                testAudio.time = 1 + .18 + 4 * 60 / bpm + target;
                document.getElementById('pad').dispatchEvent(new PointerEvent('pointerdown', { isPrimary: true, button: 0, bubbles: true }));
            }, { target, bpm: data.chart.bpm });
        }
        serverClock += 60000;
        await student.evaluate(() => { testAudio.time = 90; });
        await student.locator('#result').waitFor({ state: 'visible' });
        assert.equal(await student.locator('#accuracy').textContent(), '100%');
        await teacher.waitForFunction(() => document.getElementById('players').textContent.includes('100%'));
        await teacher.screenshot({ path: path.join(output, 'teacher-ranking.png'), fullPage: true });
        await student.reload(); await student.locator('#roomCode').filter({ hasText: code }).waitFor();
        assert.ok((await student.locator('#players').textContent()).includes('100%'), 'result survives tab refresh');
        await teacher.click('#leave');
        await student.waitForFunction(() => !document.getElementById('roomEntry').hidden);
        await teacherContext.close(); await student.close();
        assert.deepEqual(errors, []);
        console.log('Chromium: school-device layouts, real audio unlock, touch, key repeat, teacher/student round, server ranking and refresh passed.');
    } finally { await browser.close(); }
    let safari;
    try { safari = await webkit.launch({ headless: true }); }
    catch (error) { console.log('WebKit unavailable: ' + error.message.split('\n')[0]); }
    if (safari) {
        try {
            const page = await safari.newPage({ viewport: { width: 1024, height: 768 }, hasTouch: true });
            const webkitErrors = []; page.on('pageerror', error => webkitErrors.push(error.message));
            await page.goto(url); await page.locator('.rhythm-head').first().waitFor();
            await page.click('#start'); await page.locator('#stop').waitFor({ state: 'visible' }); await page.locator('#pad').tap();
            await page.screenshot({ path: path.join(output, 'webkit-1024.png'), fullPage: true });
            await page.click('#stop'); assert.deepEqual(webkitErrors, []);
            console.log('WebKit: iPad viewport, audio unlock and touch passed.');
        } finally { await safari.close(); }
    }
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => server.close());
