const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const express = require('../game-hub-server/node_modules/express');
const {chromium} = require('../game-hub-server/node_modules/playwright');
const capture = require('./screenshot-webp.cjs');
const input = require('./fixtures/rhythm-90-space-input.json');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'outputs/qa/rhythm-training-input');
const app = express();
app.get('/api/rhythm-training/session', (_req, res) => res.json({isTeacher: false}));
app.get('/learning/arts/music-theory/rhythm-training/notation.js', (_req, res) =>
    res.sendFile(path.join(root, 'learning/arts/music-theory/ear-training/notation.js')));
app.use(express.static(root));
const server = app.listen(0, '127.0.0.1');

(async () => {
    if (!server.listening) await new Promise(resolve => server.once('listening', resolve));
    fs.mkdirSync(output, {recursive: true});
    const browser = await chromium.launch({headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe'});
    try {
        const page = await browser.newPage({viewport: {width: 1366, height: 900}});
        const errors = []; let report;
        page.on('pageerror', error => errors.push(error.message));
        page.on('console', message => {
            if (message.text().startsWith('RHYTHM_TIMING_REPORT ')) report = JSON.parse(message.text().slice(21));
        });
        await page.addInitScript(() => {
            let eventTime = 0;
            for (const type of ['keydown', 'keyup']) window.addEventListener(type, event => {
                if (event.code === 'Space') eventTime = event.timeStamp;
            }, true);
            window.AudioContext = class {
                constructor() { this.time = 1; this.state = 'running'; this.destination = {}; window.testAudio = this; }
                get currentTime() { return this.time; }
                getOutputTimestamp() { return {contextTime: this.time, performanceTime: eventTime || performance.now()}; }
                async resume() {}
                createOscillator() { return {frequency: {setValueAtTime() {}}, connect() {}, disconnect() {}, start() {}, stop() {}}; }
                createGain() { return {gain: {setValueAtTime() {}, exponentialRampToValueAtTime() {}}, connect() {}, disconnect() {}}; }
            };
        });
        const url = `http://127.0.0.1:${server.address().port}/learning/arts/music-theory/rhythm-training/?seed=${input.seed}`;
        await page.goto(url);
        await page.selectOption('#level', '3');
        assert.equal(await page.locator('#bpm').getAttribute('max'), '90');
        await page.locator('#bpm').fill('90'); await page.locator('#bpm').dispatchEvent('input');
        await page.click('#start');
        // A focused child stopping bubbling must not swallow either half of a
        // Space press. Browser-native events are used with a controlled clock.
        await page.evaluate(() => {
            for (const type of ['keydown', 'keyup']) document.getElementById('pad').addEventListener(type, event => event.stopPropagation());
        });
        const start = 1 + .18 + 4 * 60 / input.bpm;
        for (const beat of input.tapBeats) {
            await page.evaluate(time => { testAudio.time = time; }, start + beat * 60 / input.bpm);
            await page.keyboard.press('Space');
        }
        await page.evaluate(time => { testAudio.time = time; }, start + 33 * 60 / input.bpm);
        await page.locator('#result').waitFor({state: 'visible'});
        assert.equal(await page.locator('#accuracy').textContent(), '88.1%', 'the captured performance is not relabeled perfect');
        assert.equal(report.taps, 75); assert.deepEqual(report.input, input.input);
        assert.equal(report.keyEvents.length, 150);
        assert.equal(report.keyEvents.filter(event => event.disposition === 'recorded').length, 75);
        assert.equal(report.keyEvents.filter(event => event.disposition === 'release').length, 75);
        assert.ok(report.keyEvents.every(event => Number.isFinite(event.time) && event.queueMs >= 0));
        assert.deepEqual(await page.evaluate(() => JSON.parse(sessionStorage.getItem('rhythm-training-last-run-v1'))), report);
        assert.equal(await page.locator('#judgmentRows tr').count(), 84);
        for (const [reason, count] of [['hit', 74], ['missing', 9], ['timing', 1], ['extra', 0]]) {
            assert.equal(await page.locator(`#judgmentRows tr[data-reason=${reason}]`).count(), count);
        }
        assert.match(await page.locator('#inputCaptureSummary').textContent(), /누름 75회 · 뗌 75회 · 전체 연주 입력 75회/);
        assert.match(await page.locator('#judgmentRows tr[data-reason=timing]').textContent(), /\+100\.7ms.*허용 −167~\+100ms/);
        assert.equal(await page.locator('#score .rhythm-head title').count(), 84);
        await page.locator('#judgmentDetails summary').press('Space');
        assert.equal(await page.locator('#judgmentDetails').getAttribute('open'), '', 'the result disclosure works with the keyboard');
        await capture(page, {path: path.join(output, '90-bpm-input-review.webp'), fullPage: true});
        await page.setViewportSize({width: 390, height: 844});
        await page.waitForFunction(() => document.querySelectorAll('#score .rhythm-head.missed').length === 10);
        assert.equal(await page.locator('#score .rhythm-head.hit').count(), 74, 'resizing preserves the completed judgments');
        assert.equal(await page.locator('#score .rhythm-head title').count(), 84);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        await capture(page, {path: path.join(output, '90-bpm-input-review-mobile.webp'), fullPage: true});

        await page.setViewportSize({width: 1366, height: 900});
        await page.click('#retry');
        await page.evaluate(() => { testAudio.time += .18 + 4 * 60 / 90; });
        // Holding remains one attack; autorepeat is preserved as excluded evidence.
        await page.keyboard.down('Space'); await page.keyboard.down('Space'); await page.keyboard.up('Space');
        await page.keyboard.press('KeyA');
        await page.click('#stop');
        assert.equal(report.taps, 1); assert.equal(report.input.keydowns, 2); assert.equal(report.input.repeats, 1);
        assert.equal(report.keyEvents.length, 3, 'no unrelated keys are recorded');
        assert.deepEqual(report.keyEvents.map(event => event.disposition), ['recorded', 'repeat', 'release']);
        await page.reload();
        assert.equal(await page.evaluate(() => JSON.parse(sessionStorage.getItem('rhythm-training-last-run-v1')).taps), 1, 'the latest run remains inspectable after reload');
        assert.deepEqual(errors, []);
        console.log('90 BPM captured trace: 84 written attacks, 75 received presses, 74 hits, 9 unpaired targets, 1 timing error. Window capture, repeat exclusion, local evidence, note review and mobile resize passed.');
    } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => server.close());
