const assert = require('node:assert/strict');
const path = require('node:path');
const express = require('../game-hub-server/node_modules/express');
const { chromium } = require('../game-hub-server/node_modules/playwright');
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
        const page = await browser.newPage();
        const errors = []; page.on('pageerror', error => errors.push(error.message));
        let report = null;
        page.on('console', message => { if (message.text().startsWith('RHYTHM_TIMING_REPORT ')) report = JSON.parse(message.text().slice(21)); });
        await page.addInitScript(() => {
            crypto.getRandomValues = values => { values.fill(123); return values; };
            const Native = window.AudioContext;
            window.AudioContext = class extends Native {
                constructor(options) { super(options); window.testAudio = this; }
                async resume() { await super.resume(); this.resumedAt = this.currentTime; }
            };
            window.trustedKeys = [];
            document.addEventListener('keydown', event => { if (event.code === 'Space') trustedKeys.push(event.isTrusted); });
            window.mediaResults = [];
            const playMedia = HTMLMediaElement.prototype.play;
            HTMLMediaElement.prototype.play = function (...args) {
                const entry = { src: this.src, volume: this.volume, muted: this.muted, played: false };
                mediaResults.push(entry);
                return playMedia.apply(this, args).then(() => { entry.played = true; }, error => {
                    entry.error = error.message; throw error;
                });
            };
        });
        await page.goto(`http://127.0.0.1:${server.address().port}/learning/arts/music-theory/rhythm-training/`);
        await page.selectOption('#level', '3'); await page.selectOption('#length', '1');
        const targets = await page.evaluate(() => {
            const chart = RhythmTrainer.chart({ level: 3, bpm: 100 }, 123, 1), beat = .6;
            return chart.targets.map((time, index, list) => {
                const previous = index ? (time - list[index - 1]) / beat : Infinity;
                const next = index + 1 < list.length ? (list[index + 1] - time) / beat : Infinity;
                const offset = previous < .26 && next > .5 ? .17 * beat : previous > .5 && next < .26 ? -.17 * beat : 0;
                return time + offset;
            });
        });
        await page.click('#start'); await page.locator('#stop').waitFor({ state: 'visible' });
        for (const target of targets) {
            await page.waitForFunction(target => {
                const context = testAudio, stamp = context.getOutputTimestamp();
                const heard = stamp.contextTime > 0 && stamp.performanceTime > 0
                    ? stamp.contextTime + (performance.now() - stamp.performanceTime) / 1000
                    : context.currentTime - (context.outputLatency || 0);
                return heard >= context.resumedAt + .18 + 2.4 + target - .008;
            }, target, { polling: 'raf' });
            await page.keyboard.press('Space', { delay: 20 });
        }
        await page.locator('#result').waitFor({ state: 'visible' });
        assert.equal(await page.locator('#accuracy').textContent(), '100%');
        assert.equal(report.taps, targets.length);
        assert.equal(report.input.keydowns, targets.length);
        assert.equal(report.input.keyups, targets.length);
        assert.equal(report.input.repeats, 0);
        assert.ok((await page.evaluate(() => trustedKeys)).every(Boolean));
        assert.ok(report.clocks.length >= 4);
        console.log(JSON.stringify({ accuracy: report.accuracy, actualKeydowns: report.input.keydowns, taps: report.taps,
            errorsInBeats: report.nearestErrors.map(entry => entry[1]), audioClock: report.clocks }));
        await page.evaluate(() => {
            const make = RhythmQuestions.make;
            RhythmQuestions.make = (...args) => { const question = make(...args); window.lastQuestion = question; return question; };
        });
        await page.selectOption('#activity', 'choice');
        const answer = await page.evaluate(() => lastQuestion.bars.answer);
        await page.locator(`#barChoices [data-index="${(answer + 1) % 4}"]`).click();
        await page.waitForFunction(() => mediaResults.some(result => result.src.endsWith('/error.ogg') && result.played));
        assert.equal(await page.locator('#listeningAnswer').isVisible(), false);
        await page.locator(`#barChoices [data-index="${answer}"]`).click();
        await page.waitForFunction(() => mediaResults.some(result => result.src.endsWith('/success.ogg') && result.played));
        await page.waitForTimeout(250); // Let the semantic observer run; explicit cues must not be doubled.
        const media = await page.evaluate(() => mediaResults);
        assert.deepEqual(media.map(result => result.src.split('/').at(-1)), ['error.ogg', 'success.ogg']);
        assert.ok(media.every(result => result.played && !result.muted && result.volume > 0 && !result.error));
        assert.deepEqual(errors, []);
        console.log('Native Chrome: error/success Ogg playback succeeded once each; wrong answers remain open for retry');
    } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => server.close());
