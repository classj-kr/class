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
    window.testSoundStarts = 0;
    class AudioContext {
        constructor() { this.time = 1; this.state = 'running'; this.outputLatency = 0; this.destination = {}; window.testAudio = this; }
        get currentTime() { return this.time; }
        async resume() { this.state = 'running'; }
        createOscillator() { return { frequency: { setValueAtTime() {} }, connect() {}, disconnect() {}, start() { window.testSoundStarts++; }, stop() {} }; }
        createGain() { return { gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() {}, disconnect() {} }; }
    }
    window.AudioContext = AudioContext;
}
(async () => {
    await new Promise(resolve => server.once('listening', resolve));
    const origin = `http://127.0.0.1:${server.address().port}`, url = origin + '/learning/arts/music-theory/rhythm-training/';
    const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
    try {
        for (const [width, height] of [[1366, 620], [1024, 768], [768, 1024], [390, 844]]) {
            const page = await browser.newPage({ viewport: { width, height }, hasTouch: true });
            page.on('pageerror', error => errors.push(error.message));
            await page.goto(url); await page.locator('.rhythm-head').first().waitFor();
            assert.equal(await page.locator('.score-measure').count(), 8, 'all eight measures are available before playback');
            assert.equal(await page.locator('#score .rhythm-meter').count(), 2, 'one 4/4 signature for the whole score');
            const connected = await page.locator('.score-system').evaluateAll(systems => systems.every(system => {
                const measures = [...system.querySelectorAll('.score-measure')];
                return measures.every((measure, index) => {
                    if (!index) return true;
                    const previous = measures[index - 1].querySelector('.rhythm-line').getBoundingClientRect();
                    const current = measure.querySelector('.rhythm-line').getBoundingClientRect();
                    return Math.abs(previous.right - current.left) < 2 && Math.abs(previous.top - current.top) < 1;
                });
            }));
            assert.ok(connected, 'staff lines join across each measure without card gaps');
            assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
            if (width >= 768) assert.ok(await page.locator('#pad').evaluate(node => node.getBoundingClientRect().bottom <= innerHeight), 'pad fits school device');
            await page.screenshot({ path: path.join(output, `chromium-${width}.png`), fullPage: true });
            // Exercise real Web Audio unlock on a user gesture, then stop.
            await page.click('#start'); await page.locator('#stop').waitFor({ state: 'visible' });
            assert.ok(await page.locator('#score').evaluate(node => { const rect = node.getBoundingClientRect(); return rect.top >= 0 && rect.bottom <= innerHeight; }), 'all eight measures fit during play');
            assert.ok(await page.locator('#pad').evaluate(node => node.getBoundingClientRect().bottom <= innerHeight), 'tap pad stays on screen during play');
            await page.locator('#pad').tap(); await page.click('#stop'); await page.close();
        }
        const solo = await browser.newPage(); await solo.addInitScript(mockAudio); await solo.goto(url);
        await solo.selectOption('#level', '0'); await solo.click('#start');
        await solo.evaluate(() => { testAudio.time = 1 + .18 + 2.4; window.originalFifth = document.querySelector('.score-measure[data-bar="5"]'); });
        await solo.keyboard.down('Space');
        for (let i = 0; i < 10; i++) await solo.keyboard.down('Space');
        await solo.keyboard.up('Space');
        await solo.evaluate(() => { testAudio.time = 1 + .18 + 2.4 + 16 * .6 + .01; });
        await solo.locator('.score-measure[data-bar="5"].active').waitFor({ state: 'attached' });
        assert.equal(await solo.locator('#score .rhythm-meter').count(), 2, 'the same first time signature remains throughout playback');
        assert.ok(await solo.evaluate(() => originalFifth.isConnected && originalFifth === document.querySelector('.score-measure[data-bar="5"]')), 'crossing into bar five never replaces the score');
        assert.equal(await solo.locator('#score .rhythm-bar.is-end').count(), 1, 'final barline only at the end of bar eight');
        assert.equal(await solo.locator('.score-measure[data-bar="5"].active .playhead').evaluate(line =>
            getComputedStyle(line).display !== 'none' && Number(line.getAttribute('x1')) > Number(line.dataset.onset)), true,
        'the fifth measure playhead advances in its own coordinate system');
        await solo.evaluate(() => { testAudio.time = 30; });
        await solo.locator('#result').waitFor({ state: 'visible' });
        assert.equal(await solo.locator('#perfect').textContent(), '1', 'a held space triggers once');
        assert.equal(await solo.locator('#extras').textContent(), '0');
        await solo.close();
        // Same-dispatch visual feedback: no audio voice, network response, key release or RAF is needed.
        const feedbackPage = await browser.newPage({ viewport: { width: 1366, height: 768 } });
        await feedbackPage.addInitScript(mockAudio);
        await feedbackPage.addInitScript(() => { crypto.getRandomValues = values => { values.fill(123); return values; }; });
        await feedbackPage.goto(url); await feedbackPage.selectOption('#level', '0'); await feedbackPage.click('#start');
        const targets = await feedbackPage.evaluate(() => RhythmTrainer.chart({ level: 0, bpm: 100 }, 123).targets);
        async function contact(index, error, expected) {
            const state = await feedbackPage.evaluate(({ target, error }) => {
                testAudio.time = 1 + .18 + 2.4 + target + error;
                const before = testSoundStarts, pad = document.getElementById('pad'), box = pad.getBoundingClientRect(), began = performance.now();
                pad.dispatchEvent(new PointerEvent('pointerdown', { isPrimary: true, button: 0, clientX: box.x + box.width / 2, clientY: box.y + box.height / 2, bubbles: true }));
                return { kind: pad.dataset.judgment, combo: document.getElementById('combo').textContent,
                    sounds: testSoundStarts - before, elapsed: performance.now() - began,
                    animations: document.getElementById('tapEffects').getAnimations({ subtree: true }).length };
            }, { target: targets[index], error });
            assert.equal(state.kind, expected); assert.equal(state.sounds, 0, 'tapping never schedules a delayed input sound');
            assert.ok(state.elapsed < 50, 'feedback commits within input dispatch: ' + state.elapsed);
            return state;
        }
        await contact(0, 0, 'perfect');
        assert.equal((await contact(1, -.18, 'wrong')).combo, '');
        assert.equal((await contact(2, .18, 'wrong')).combo, '');
        assert.equal(await feedbackPage.locator('#timing').count(), 0);
        assert.equal(await feedbackPage.locator('#feedback').textContent(), '틀렸어요');
        await feedbackPage.evaluate(target => { testAudio.time = 1 + .18 + 2.4 + target + .145; }, targets[3]);
        await feedbackPage.waitForFunction(() => document.getElementById('pad').dataset.judgment === 'miss');
        assert.equal(await feedbackPage.locator('#combo').textContent(), '');
        assert.ok((await contact(4, 0, 'perfect')).animations > 0);
        await contact(4, .01, 'wrong');
        await contact(5, 0, 'perfect');
        assert.equal((await contact(6, 0, 'perfect')).combo, '2 COMBO');
        await feedbackPage.screenshot({ path: path.join(output, 'live-perfect.png') });
        assert.ok(await feedbackPage.evaluate(() => testSoundStarts > 0), 'metronome still plays');
        await feedbackPage.click('#stop');
        await feedbackPage.emulateMedia({ reducedMotion: 'reduce' });
        await feedbackPage.click('#start');
        // A restarted round is relative to the current mock audio time.
        await feedbackPage.evaluate(() => {
            testAudio.time += .18 + 2.4;
            document.getElementById('pad').dispatchEvent(new PointerEvent('pointerdown', { isPrimary: true, button: 0, bubbles: true }));
        });
        assert.equal(await feedbackPage.locator('#pad').getAttribute('data-judgment'), 'perfect');
        assert.equal(await feedbackPage.locator('#tapEffects').evaluate(node => node.getAnimations({ subtree: true }).length), 0);
        await feedbackPage.close();
        const fair = await browser.newPage(); await fair.addInitScript(mockAudio);
        await fair.addInitScript(() => { crypto.getRandomValues = values => { values.fill(123); return values; }; });
        await fair.goto(url); await fair.selectOption('#level', '3'); await fair.click('#start');
        await fair.waitForTimeout(220); // Ensure a simulated queued event still has a positive performance timestamp.
        await fair.evaluate(() => {
            const start = 1 + .18 + 2.4;
            // The device's output clock trails the render clock by 120 ms.
            testAudio.getOutputTimestamp = () => ({ contextTime: testAudio.time - .12, performanceTime: performance.now() });
            RhythmTrainer.chart({ level: 3, bpm: 100 }, 123).targets.forEach((target, index) => {
                const queueDelay = index === 0 ? .2 : 0;
                testAudio.time = start + target + .12 + (index === 0 ? 0 : .08) + queueDelay;
                const event = new PointerEvent('pointerdown', { isPrimary: true, button: 0, bubbles: true });
                if (queueDelay) Object.defineProperty(event, 'timeStamp', { value: performance.now() - queueDelay * 1000 });
                document.getElementById('pad').dispatchEvent(event);
            });
            testAudio.time = 40;
        });
        await fair.locator('#result').waitFor({ state: 'visible' });
        assert.equal(await fair.locator('#accuracy').textContent(), '100%', 'output-clock compensation, queued input, and accepted 16th-note variation earn full credit');
        assert.equal(await fair.locator('#misses').textContent(), '0');
        assert.equal(await fair.locator('#extras').textContent(), '0');
        await fair.close();
        console.log('Live feedback: correct/wrong/missed and combo update synchronously; no timing-direction gauge, taps silent, metronome preserved, reduced motion respected.');
        const teacherContext = await browser.newContext();
        await teacherContext.addCookies([{ name: 'testTeacher', value: '1', url: origin }]);
        const teacher = await teacherContext.newPage(); await teacher.goto(url); await teacher.click('#classTab'); await teacher.click('#create');
        await teacher.locator('#roomCode').filter({ hasText: /^\d{4}$/ }).waitFor();
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
