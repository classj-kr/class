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
    const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', args: ['--mute-audio'] });
    try {
        const page = await browser.newPage(), errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.addInitScript(() => {
            const Native = window.AudioContext;
            window.audioStarts = [];
            window.AudioContext = class extends Native {
                constructor(options) {
                    super(options); window.testAudio = this;
                    this.capture = this.createMediaStreamDestination();
                    this.chunks = [];
                    this.recorder = new MediaRecorder(this.capture.stream);
                    this.recorder.ondataavailable = event => this.chunks.push(event.data);
                    this.recorder.start();
                }
                createGain() {
                    const gain = super.createGain(), connect = gain.connect.bind(gain);
                    gain.connect = destination => { if (destination === this.destination) connect(this.capture); return connect(destination); };
                    return gain;
                }
                createOscillator() {
                    const oscillator = super.createOscillator(), start = oscillator.start.bind(oscillator);
                    oscillator.start = time => { audioStarts.push({ time, frequency: oscillator.frequency.value }); start(time); };
                    return oscillator;
                }
            };
            // Stop drawing completely: audio must keep its own timing and complete beat count.
            window.requestAnimationFrame = () => 1;
        });
        await page.goto(`http://127.0.0.1:${server.address().port}/learning/arts/music-theory/rhythm-training/`);
        await page.selectOption('#length', '1'); await page.locator('#bpm').fill('80'); await page.locator('#bpm').dispatchEvent('input');
        await page.click('#start');
        const scheduled = await page.evaluate(() => audioStarts);
        assert.equal(scheduled.length, 8, 'four preparation beats and four exercise beats are scheduled even when animation frames stop');
        for (let i = 1; i < scheduled.length; i++) assert.ok(Math.abs(scheduled[i].time - scheduled[i - 1].time - .75) < 1e-9);
        await page.waitForTimeout(6300);
        const readRecording = () => page.evaluate(async () => {
            const context = testAudio;
            await new Promise(resolve => { context.recorder.onstop = resolve; context.recorder.stop(); });
            const bytes = await new Blob(context.chunks).arrayBuffer();
            const buffer = await context.decodeAudioData(bytes), pcm = buffer.getChannelData(0);
            const onsets = [], windowSize = Math.round(buffer.sampleRate * .002);
            let active = false;
            for (let start = 0; start + windowSize < pcm.length; start += windowSize) {
                let power = 0;
                for (let i = start; i < start + windowSize; i++) power += pcm[i] ** 2;
                const audible = Math.sqrt(power / windowSize) > .01;
                if (audible && !active) onsets.push(start / buffer.sampleRate);
                active = audible;
            }
            return { onsets, sampleRate: buffer.sampleRate };
        });
        const rendered = await readRecording();
        assert.equal(rendered.onsets.length, 8, 'the recorded PCM contains all eight audible clicks');
        const intervals = rendered.onsets.slice(1).map((time, index) => time - rendered.onsets[index]);
        assert.ok(intervals.every(interval => Math.abs(interval - .75) <= .004), JSON.stringify(intervals));
        await page.click('#stop');
        await page.evaluate(() => {
            const context = testAudio;
            context.chunks = [];
            context.recorder = new MediaRecorder(context.capture.stream);
            context.recorder.ondataavailable = event => context.chunks.push(event.data);
            context.recorder.start();
        });
        await page.click('#start'); await page.waitForTimeout(1100); await page.click('#stop');
        await page.waitForTimeout(1800);
        const stopped = await readRecording();
        assert.equal(stopped.onsets.length, 2, 'stop cancels every future scheduled click; only two preparation clicks have sounded');
        await page.goto(`http://127.0.0.1:${server.address().port}/learning/arts/music-theory/rhythm-training/?syncCheck=1`);
        await page.click('#syncSubdivide'); await page.click('#start');
        assert.equal(await page.evaluate(() => audioStarts.length), 36, 'four preparation clicks and thirty-two sixteenth clicks are scheduled');
        await page.waitForTimeout(9300);
        const subdivided = await readRecording();
        assert.equal(subdivided.onsets.length, 36, 'every sixteenth click is audible in the rendered PCM');
        const shortIntervals = subdivided.onsets.slice(5).map((time, index) => time - subdivided.onsets[index + 4]);
        assert.equal(shortIntervals.length, 31);
        assert.ok(shortIntervals.every(interval => Math.abs(interval - .1875) <= .004), JSON.stringify(shortIntervals));
        await page.click('#stop');
        assert.deepEqual(errors, []);
        console.log(JSON.stringify({ bpm: 80, animationFrames: 0, scheduledClicks: scheduled.length, recordedClicks: rendered.onsets.length,
            sampleRate: rendered.sampleRate, intervalsMs: intervals.map(interval => Math.round(interval * 1000)), clicksAfterEarlyStop: stopped.onsets.length,
            sixteenthClicks: subdivided.onsets.length - 4, sixteenthIntervalsMs: shortIntervals.map(interval => Math.round(interval * 1000)) }));
    } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => server.close());
