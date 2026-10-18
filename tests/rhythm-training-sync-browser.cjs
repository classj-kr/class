const assert = require('node:assert/strict');
const path = require('node:path');
const express = require('../game-hub-server/node_modules/express');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const capture = require('./screenshot-webp.cjs');
const root = path.resolve(__dirname, '..'), app = express();
app.get('/api/rhythm-training/session', (_req, res) => res.json({ isTeacher: false }));
app.get('/learning/arts/music-theory/rhythm-training/notation.js', (_req, res) =>
    res.sendFile(path.join(root, 'learning/arts/music-theory/ear-training/notation.js')));
app.use(express.static(root));
const server = app.listen(0, '127.0.0.1');
(async () => {
    await new Promise(resolve => server.once('listening', resolve));
    const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
    try {
        const page = await browser.newPage(), errors = [], reports = [];
        page.on('pageerror', error => errors.push(error.message));
        page.on('console', message => { if (message.text().startsWith('RHYTHM_TIMING_REPORT ')) reports.push(JSON.parse(message.text().slice(21))); });
        await page.addInitScript(() => {
            window.sounds = [];
            window.AudioContext = class {
                constructor() { this.time = 1; this.state = 'running'; this.destination = {}; window.testAudio = this; }
                get currentTime() { return this.time; }
                getOutputTimestamp() { return { contextTime: this.time - .12, performanceTime: performance.now() }; }
                async resume() {}
                createOscillator() { return { frequency: { setValueAtTime() {} }, connect() {}, disconnect() {}, start(time) { sounds.push(time); }, stop() {} }; }
                createGain() { return { gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() {}, disconnect() {} }; }
            };
        });
        await page.goto(`http://127.0.0.1:${server.address().port}/learning/arts/music-theory/rhythm-training/?syncCheck=1`);
        assert.equal(await page.locator('#syncPanel').isVisible(), true);
        assert.equal(await page.locator('#configFields').isVisible(), false);
        await capture(page, { path: path.join(root, 'outputs/qa/rhythm-training-unified/sync-check-ready-v8.webp'), fullPage: true });
        for (const [mode, offset, expectedSounds] of [['sound', .08, 20], ['visual', .02, 0], ['subdivision', .08, 36]]) {
            const expected = mode === 'subdivision' ? 32 : 16, spacing = mode === 'subdivision' ? .25 : 1;
            await page.click(mode === 'sound' ? '#syncSound' : mode === 'visual' ? '#syncVisual' : '#syncSubdivide');
            assert.equal(await page.locator('#score').isVisible(), mode === 'visual');
            assert.equal(await page.locator('#beats').isVisible(), mode === 'visual');
            await page.evaluate(() => { if (window.testAudio) testAudio.time = 1; sounds.length = 0; });
            await page.click('#start');
            assert.equal(await page.evaluate(() => sounds.length), expectedSounds);
            if (mode === 'visual') for (const beat of [.9999, 3.9999]) {
                await page.evaluate(beat => { testAudio.time = 1 + .18 + 3 + beat * .75 + .12; }, beat);
                await page.waitForFunction(beat => {
                    const line = document.querySelector('.score-measure[data-bar="1"] .playhead');
                    const head = beat < 1 ? document.querySelectorAll('.score-measure[data-bar="1"] .rhythm-head')[1] : document.querySelector('.score-measure[data-bar="2"] .rhythm-head');
                    if (!head) return false;
                    const lineBox = line.getBoundingClientRect(), headBox = head.getBoundingClientRect();
                    return Math.abs(lineBox.left - headBox.left - headBox.width / 2) < .03;
                }, beat);
            }
            await page.evaluate(({ offset, expected, spacing }) => {
                for (let note = 0; note < expected; note++) {
                    testAudio.time = 1 + .18 + 3 + (note * spacing + offset) * .75 + .12;
                    document.getElementById('pad').dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', bubbles: true }));
                    document.getElementById('pad').dispatchEvent(new KeyboardEvent('keyup', { code: 'Space', bubbles: true }));
                }
                testAudio.time = 30;
            }, { offset, expected, spacing });
            await page.waitForFunction(() => !document.body.classList.contains('playing'));
            const report = reports.at(-1);
            assert.equal(report.syncMode, mode);
            assert.equal(report.targets, expected);
            assert.equal(report.taps, expected);
            assert.equal(report.syncTiming.measured, mode === 'subdivision' ? 16 : 12);
            assert.ok(Math.abs(report.syncTiming.medianBeats - offset) < .001);
            assert.ok(report.syncTiming.spreadBeats < .001);
            assert.equal(report.audioPlan.length, expectedSounds);
            assert.equal(await page.locator('#pad').getAttribute('data-judgment'), null);
            assert.equal(await page.locator('#score .hit, #score .missed').count(), 0);
            assert.equal(await page.locator('#result').isVisible(), false);
        }
        assert.equal(await page.locator('#syncResults p').count(), 3, 'all comparisons remain available in this page only');
        await page.setViewportSize({ width: 390, height: 844 });
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        assert.deepEqual(errors, []);
        console.log('Sync comparison: sixteen equal beats; sound-only and silent visual-only; shared output clock; offset/spread reports; no automatic correction or grading cues');
    } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => server.close());
