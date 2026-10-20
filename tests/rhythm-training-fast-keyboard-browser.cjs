const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const express = require('../game-hub-server/node_modules/express');
const {chromium} = require('../game-hub-server/node_modules/playwright');
const capture = require('./screenshot-webp.cjs');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'outputs/qa/rhythm-training-tempo');
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
        for (const bpm of [60, 90]) {
            const page = await browser.newPage({viewport: {width: 1366, height: 768}});
            const errors = []; let report;
            page.on('pageerror', error => errors.push(error.message));
            page.on('console', message => {
                if (message.text().startsWith('RHYTHM_TIMING_REPORT ')) report = JSON.parse(message.text().slice(21));
            });
            await page.addInitScript(() => {
                const Native = window.AudioContext;
                window.AudioContext = class extends Native {
                    constructor(options) { super(options); window.testAudio = this; }
                    async resume() { await super.resume(); this.resumedAt = this.currentTime; }
                };
                window.trustedSpaces = [];
                document.addEventListener('keydown', event => {
                    if (event.code === 'Space') trustedSpaces.push(event.isTrusted);
                });
            });
            await page.goto(`http://127.0.0.1:${server.address().port}/learning/arts/music-theory/rhythm-training/`);
            // Use the same dense written rhythm at both tempos, with the real app,
            // real output clock and trusted keydowns rather than synthetic events.
            await page.evaluate(() => {
                RhythmTrainer.chart = (input, seed) => RhythmTrainer.fromBars(input,
                    [Array.from({length: 16}, () => ({v: 's'}))], seed);
            });
            await page.selectOption('#level', '3');
            await page.locator('#bpm').fill(String(bpm));
            await page.locator('#bpm').dispatchEvent('input');
            await page.click('#start');
            await page.locator('#stop').waitFor({state: 'visible'});
            for (let note = 0; note < 16; note++) {
                await page.waitForFunction(({bpm, note}) => {
                    const context = testAudio, stamp = context.getOutputTimestamp();
                    const heard = stamp.contextTime > 0 && stamp.performanceTime > 0
                        ? stamp.contextTime + (performance.now() - stamp.performanceTime) / 1000
                        : context.currentTime - (context.outputLatency || 0);
                    return heard >= context.resumedAt + .18 + 4 * 60 / bpm + note * 60 / bpm / 4 + .082 - .008;
                }, {bpm, note}, {polling: 'raf'});
                await page.keyboard.press('Space', {delay: 55});
                assert.equal(await page.locator('#pad').getAttribute('data-judgment'), 'perfect', 'live feedback must agree with final scoring');
            }
            await page.locator('#result').waitFor({state: 'visible'});
            assert.equal(await page.locator('#accuracy').textContent(), '100%');
            assert.equal(report.targets, 16); assert.equal(report.taps, 16);
            assert.equal(report.input.keydowns, 16); assert.equal(report.input.keyups, 16);
            assert.equal(report.input.repeats, 0); assert.equal(report.input.ignoredFocus, 0); assert.equal(report.input.outside, 0);
            assert.equal(report.misses, 0); assert.equal(report.extras, 0); assert.equal(report.timingWrong, 0);
            assert.deepEqual(report.tapJudgments.map(input => input.target), Array.from({length: 16}, (_, index) => index + 1));
            assert.ok((await page.evaluate(() => trustedSpaces)).every(Boolean));
            assert.match(await page.locator('#hitRate').textContent(), /입력 16회 \/ 음표 16개/);
            await capture(page, {path: path.join(output, `${bpm}-bpm-native-keyboard.webp`), fullPage: true});
            if (bpm === 90) {
                await page.setViewportSize({width: 390, height: 844});
                assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
                await capture(page, {path: path.join(output, '90-bpm-mobile-result.webp'), fullPage: true});
            }
            assert.deepEqual(errors, []);
            console.log(JSON.stringify({bpm, accuracy: report.accuracy, taps: report.taps,
                keydowns: report.input.keydowns, errorsMs: report.tapJudgments.map(input => input.errorMs)}));
            await page.close();
        }
    } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => server.close());
