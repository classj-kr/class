const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const express = require('../game-hub-server/node_modules/express');
const { chromium, webkit } = require('../game-hub-server/node_modules/playwright');
const capture = require('./screenshot-webp.cjs');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'outputs/qa/rhythm-training-unified');
fs.mkdirSync(output, { recursive: true });
const app = express(); app.use(express.json());
let cleaned = null;
app.get('/api/rhythm-training/session', (_req, res) => res.json({ isTeacher: false }));
app.get('/api/me/storage/ear-training', (_req, res) => res.json({ items: { saved: {
    progress: { rhythm: { sixteenths: { right: 8, total: 10 } }, interval: { perfect: { read: true } } },
    stats: { rhythmRead: { t16: { right: 4, total: 5 } }, interval: { P5: { right: 2, total: 3 } } },
    presets: { rhythmWrite: { pick: { right: 2 } } }, setup: { rhythmRead: { level: 'hard' } }
} } }));
app.put('/api/me/storage/ear-training/saved', (req, res) => { cleaned = req.body.value; res.json({ ok: true }); });
app.get('/learning/arts/music-theory/rhythm-training/notation.js', (_req, res) =>
    res.sendFile(path.join(root, 'learning/arts/music-theory/ear-training/notation.js')));
app.use(express.static(root));
const server = app.listen(0, '127.0.0.1');
function mockAudio() {
    crypto.getRandomValues = values => { values.fill(123); return values; };
    window.answerSounds = [];
    window.Audio = class {
        constructor(src) { this.src = src; }
        cloneNode() { return new Audio(this.src); }
        addEventListener() {}
        play() { answerSounds.push(this.src); return Promise.resolve(); }
        pause() {}
    };
    class AudioContext {
        constructor() { this.time = 1; this.state = 'running'; this.destination = {}; window.testAudio = this; }
        get currentTime() { return this.time; }
        async resume() {}
        createOscillator() { return { frequency: { setValueAtTime() {} }, connect() {}, disconnect() {}, start() {}, stop() {} }; }
        createGain() { return { gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() {}, disconnect() {} }; }
    }
    window.AudioContext = AudioContext;
}
(async () => {
    await new Promise(resolve => server.once('listening', resolve));
    const origin = `http://127.0.0.1:${server.address().port}`;
    for (const [name, engine, viewport] of [
        ['desktop', chromium, { width: 1366, height: 768 }],
        ['phone', chromium, { width: 390, height: 844 }],
        ['webkit', webkit, { width: 1024, height: 768 }]
    ]) {
        const browser = await engine.launch({ headless: true, ...(engine === chromium ? { executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' } : {}) });
        try {
            const page = await browser.newPage({ viewport, hasTouch: true });
            const errors = [], reports = []; page.on('pageerror', error => errors.push(error.message));
            page.on('console', message => { if (message.text().startsWith('RHYTHM_TIMING_REPORT ')) reports.push(JSON.parse(message.text().slice(21))); });
            await page.addInitScript(mockAudio);
            await page.goto(origin + '/learning/arts/music-theory/rhythm-training/');
            await page.locator('#score .rhythm-head').first().waitFor();
            assert.equal(await page.locator('.lesson-card').count(), 7);
            await page.evaluate(() => {
                const make = RhythmQuestions.make;
                RhythmQuestions.make = (...args) => { const question = make(...args); window.lastQuestion = question; return question; };
            });
            await page.selectOption('#activity', 'grid');
            for (const level of ['0', '2', '1', '4', '5', '3', '6', '7']) {
                await page.selectOption('#level', level);
                assert.equal(await page.locator('#score').isVisible(), false, 'answer score stays hidden');
                const question = await page.evaluate(() => ({ grid: lastQuestion.grid, bars: lastQuestion.bars,
                    counts: lastQuestion.bars?.list.map(bar => RhythmNotation.onsets(bar).length) }));
                if (question.grid) {
                    assert.equal(await page.locator('#beatGrid button').count(), question.grid.cells);
                    if (level === '0') {
                        await page.click('#start');
                        assert.equal(await page.locator('#listeningAnswer').isVisible(), false);
                        assert.equal(await page.locator('#beatGrid .right, #beatGrid .missed').count(), 0);
                        assert.equal(await page.locator('#beatGrid button:disabled').count(), 0);
                        assert.match(await page.locator('#listeningFeedback').textContent(), /다시 듣고/);
                        assert.ok((await page.evaluate(() => answerSounds.at(-1))).endsWith('/error.ogg'));
                    }
                    for (const cell of question.grid.answer) await page.locator(`#beatGrid [data-cell="${cell}"]`).click();
                    await page.click('#listen'); await page.locator('#stop').waitFor({ state: 'visible' });
                    assert.equal(await page.locator('#beatGrid button').first().isDisabled(), true, 'answers disabled during playback');
                    await page.click('#stop');
                    assert.equal(await page.locator('#beatGrid [aria-pressed=true]').count(), question.grid.answer.length, 'replaying preserves selected cells');
                    await page.click('#start');
                } else {
                    assert.equal(await page.locator('#barChoices button').count(), 4);
                    assert.equal(new Set(question.counts).size, 1, 'all options have the same attack count');
                    await page.locator(`#barChoices [data-index="${question.bars.answer}"]`).click();
                }
                assert.equal(await page.locator('#listeningFeedback').textContent(), '맞았어요!');
                assert.equal(await page.locator('#listeningAnswer').isVisible(), true);
                assert.equal(await page.locator('#start').textContent(), '다음 문제');
                await page.click('#start');
                assert.equal(await page.locator('#listeningAnswer').isVisible(), false, 'new question clears the answer');
                assert.equal(await page.locator('#listeningFeedback').textContent(), '');
            }
            await page.selectOption('#activity', 'choice'); await page.selectOption('#level', '3');
            const correct = await page.evaluate(() => lastQuestion.bars.answer), wrong = (correct + 1) % 4;
            const soundCount = await page.evaluate(() => answerSounds.length);
            await page.locator(`#barChoices [data-index="${wrong}"]`).click();
            assert.equal(await page.locator('#barChoices .right').count(), 0);
            assert.equal(await page.locator('#barChoices .wrong').count(), 1);
            assert.equal(await page.locator('#barChoices button:disabled').count(), 0);
            assert.equal(await page.locator('#listeningAnswer').isVisible(), false);
            assert.match(await page.locator('#listeningFeedback').textContent(), /다시 듣고/);
            await page.locator(`#barChoices [data-index="${wrong}"]`).click();
            assert.deepEqual(await page.evaluate(start => answerSounds.slice(start).map(url => url.split('/').at(-1)), soundCount), ['error.ogg', 'error.ogg']);
            await page.click('#listen'); await page.locator('#stop').waitFor({ state: 'visible' }); await page.click('#stop');
            assert.equal(await page.locator('#listeningAnswer').isVisible(), false, 'replaying after a wrong answer does not reveal it');
            assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
            await capture(page, { path: path.join(output, `${name}-choice-retry.webp`), fullPage: true });
            await page.locator(`#barChoices [data-index="${correct}"]`).click();
            assert.equal(await page.locator('#barChoices .right').count(), 1);
            assert.equal(await page.locator('#barChoices .wrong').count(), 0);
            assert.equal(await page.locator('#barChoices button:disabled').count(), 4);
            assert.equal(await page.locator('#listeningAnswer').isVisible(), true);
            assert.deepEqual(await page.evaluate(start => answerSounds.slice(start).map(url => url.split('/').at(-1)), soundCount), ['error.ogg', 'error.ogg', 'success.ogg']);
            await page.click('#start');
            const beforeReveal = await page.evaluate(() => answerSounds.length);
            await page.click('#showAnswer');
            assert.equal(await page.locator('#listeningAnswer').isVisible(), true);
            assert.equal(await page.locator('#showAnswer').isVisible(), false);
            assert.equal(await page.locator('#start').textContent(), '다음 문제');
            assert.equal(await page.evaluate(() => answerSounds.length), beforeReveal, 'manual answer reveal has no grading cue');
            await page.selectOption('#activity', 'tap'); await page.selectOption('#level', '4'); await page.selectOption('#length', '1');
            await page.locator('#bpm').fill('100'); await page.locator('#bpm').dispatchEvent('input');
            assert.equal(await page.locator('.score-measure').count(), 1);
            assert.ok(await page.locator('.rhythm-tie').count() > 0, 'syncopation retains visible ties');
            await page.click('#start');
            await page.evaluate(() => {
                const chart = RhythmTrainer.chart({ level: 4, bpm: 100 }, 123, 1), start = 1 + .18 + 2.4;
                for (const target of chart.targets) {
                    testAudio.time = start + target;
                    document.getElementById('pad').dispatchEvent(new PointerEvent('pointerdown', { isPrimary: true, button: 0, bubbles: true }));
                }
                testAudio.time = 50;
            });
            await page.locator('#result').waitFor({ state: 'visible' });
            assert.equal(await page.locator('#accuracy').textContent(), '100%');
            assert.equal(await page.locator('#misses').textContent(), '0');
            assert.equal(await page.locator('#extras').textContent(), '0');
            assert.equal(await page.locator('#score .rhythm-head:not(.hit)').count(), 0, 'tied heads share their attack judgment');
            await page.locator('#lessonDetails > summary').click();
            await page.locator('.lesson-card').nth(5).locator('summary').click();
            await page.locator('.lesson-card').nth(5).locator('.lesson-examples button').first().click();
            await page.locator('#stop').waitFor({ state: 'visible' }); await page.click('#stop');
            assert.equal(await page.locator('.score-measure').count(), 1, 'example playback restores the current exercise');
            assert.ok(await page.locator('#score .rhythm-tie').count() > 0);
            await capture(page, { path: path.join(output, `${name}-lesson.webp`), fullPage: true });
            await page.locator('.lesson-card').nth(5).getByRole('button', { name: '듣고 맞히기', exact: true }).click();
            assert.equal(await page.locator('#activity').inputValue(), 'grid');
            assert.equal(await page.locator('#level').inputValue(), '3');
            assert.equal(await page.locator('#lessonDetails').getAttribute('open'), null);
            await page.click('#classTab');
            assert.equal(await page.locator('.score-measure').count(), 8);
            assert.equal(await page.locator('#listeningPanel').isVisible(), false);
            await page.click('#soloTab');
            assert.equal(await page.locator('#listeningPanel').isVisible(), true);
            assert.equal(await page.locator('#score').isVisible(), false);
            if (name === 'desktop') {
                const fixture = require('./fixtures/rhythm-mixed-input.json');
                await page.evaluate(seed => { crypto.getRandomValues = values => { values.fill(seed); return values; }; testAudio.time = 1; }, fixture.seed);
                await page.selectOption('#activity', 'tap'); await page.selectOption('#level', '7'); await page.selectOption('#length', '8');
                await page.locator('#bpm').fill('80'); await page.locator('#bpm').dispatchEvent('input');
                await page.click('#start');
                await page.evaluate(beats => {
                    for (const beat of beats) {
                        testAudio.time = 1 + .18 + 3 + beat * .75;
                    document.getElementById('pad').dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', bubbles: true }));
                    document.getElementById('pad').dispatchEvent(new KeyboardEvent('keyup', { code: 'Space', bubbles: true }));
                    }
                    testAudio.time = 50;
                }, fixture.tapBeats);
                await page.locator('#result').waitFor({ state: 'visible' });
                assert.equal(await page.locator('#perfect').textContent(), '63');
                assert.equal(await page.locator('#hitRate').textContent(), '음표 적중률 90.0%');
                assert.equal(reports.at(-1).misses, 1, 'only the unconnected note is a miss');
                assert.equal(reports.at(-1).taps, 70);
                assert.equal(reports.at(-1).tapJudgments[16].target, 17);
                assert.equal(reports.at(-1).tapJudgments[16].reason, 'timing');
                assert.equal(reports.at(-1).tapJudgments.filter(input => !input.accepted).length, 7);
                assert.equal(await page.locator('#timingDetails, #inputCount').count(), 0);
                await capture(page, { path: path.join(output, 'mixed-input-assignments-v6.webp'), fullPage: true });
                const complete = require('./fixtures/rhythm-mixed-complete-input.json');
                await page.goto(origin + '/learning/arts/music-theory/rhythm-training/?seed=' + complete.seed);
                await page.selectOption('#level', '7'); await page.locator('#bpm').fill('80'); await page.locator('#bpm').dispatchEvent('input');
                await page.click('#start');
                await page.evaluate(beats => {
                    for (const beat of beats) {
                        testAudio.time = 1 + .18 + 3 + beat * .75;
                        document.getElementById('pad').dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', bubbles: true }));
                        document.getElementById('pad').dispatchEvent(new KeyboardEvent('keyup', { code: 'Space', bubbles: true }));
                    }
                    testAudio.time = 50;
                }, complete.tapBeats);
                await page.locator('#result').waitFor({ state: 'visible' });
                assert.equal(await page.locator('#perfect').textContent(), '57');
                assert.equal(await page.locator('#misses').textContent(), '0');
                assert.equal(await page.locator('#extras').textContent(), '0');
                assert.equal(await page.locator('#timingWrong').textContent(), '11');
                assert.equal(reports.at(-1).taps, 68);
                assert.equal(reports.at(-1).input.keydowns, 68);
                assert.equal(reports.at(-1).tapJudgments[36].target, 37);
                assert.equal(reports.at(-1).tapJudgments[37].target, 38);
                await capture(page, { path: path.join(output, 'actual-68-sequence-judge-v12.webp'), fullPage: true });
            }
            assert.deepEqual(errors, []);
            await page.close();
            console.log(`${name}: lessons, grid/choice answers, replay, activity switches, tied-note scoring and layout passed`);
        } finally { await browser.close(); }
    }
    const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
    try {
        const page = await browser.newPage(), errors = [];
        page.on('pageerror', error => errors.push(error.message));
        const purged = page.waitForResponse(response => response.request().method() === 'PUT' && response.url().endsWith('/saved'));
        await page.goto(origin + '/learning/arts/music-theory/ear-training/');
        await page.locator('#courseList button').first().waitFor();
        assert.equal(await page.locator('#courseList button').count(), 5);
        assert.equal(await page.getByRole('button', { name: /리듬/ }).count(), 0);
        assert.equal(await page.getByRole('link', { name: 'Rhythm (리듬)', exact: true }).getAttribute('href'), '../rhythm-training/');
        assert.equal(await page.locator('#tapWrap, #gridWrap, #barsWrap').count(), 0);
        await purged;
        assert.equal(cleaned.progress.rhythm, undefined); assert.equal(cleaned.stats.rhythmRead, undefined);
        assert.equal(cleaned.setup.rhythmRead, undefined); assert.equal(cleaned.presets.rhythmWrite, undefined);
        assert.deepEqual(cleaned.progress.interval, { perfect: { read: true } });
        assert.deepEqual(cleaned.stats.interval, { P5: { right: 2, total: 3 } });
        await page.locator('#courseList button').first().click();
        await page.locator('.row-act.is-read').first().click();
        await page.locator('#staff svg').waitFor();
        assert.deepEqual(errors, []);
        console.log('Ear training: unified rhythm menu linked, obsolete rhythm records discarded, interval course still works');
    } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => server.close());
