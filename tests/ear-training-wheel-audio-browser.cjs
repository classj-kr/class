const assert = require('node:assert/strict');
const path = require('node:path');
const express = require('../game-hub-server/node_modules/express');
const {chromium, webkit} = require('../game-hub-server/node_modules/playwright');
const app = express();
app.use(express.json());
app.get('/api/me/storage/ear-training', (_req, res) => res.json({items: {}}));
app.put('/api/me/storage/ear-training/saved', (_req, res) => res.json({ok: true}));
app.use(express.static(path.resolve(__dirname, '..')));
const server = app.listen(0, '127.0.0.1');

async function expectChord(page, action, notes) {
    await page.evaluate(() => { window.wheelAudioCalls.length = 0; });
    await action();
    const calls = await page.evaluate(() => window.wheelAudioCalls);
    assert.deepEqual(calls.map(call => [call.kind, call.midi]), notes.map(midi => ['midi', midi]));
}

async function expectMode(page, action, notes) {
    await page.evaluate(() => { window.wheelAudioCalls.length = 0; });
    await action();
    const calls = await page.evaluate(() => window.wheelAudioCalls);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].kind, 'sequence');
    assert.deepEqual(calls[0].groups, notes.map(midi => [midi]));
    assert.equal(calls[0].beat, .42);
}

(async () => {
    if (!server.listening) await new Promise(resolve => server.once('listening', resolve));
    const url = `http://127.0.0.1:${server.address().port}/learning/arts/music-theory/ear-training/`;
    for (const [engine, launcher] of [['chromium', chromium], ['webkit', webkit]]) {
        if (process.argv[2] && process.argv[2] !== engine) continue;
        const browser = await launcher.launch({headless: true, ...(engine === 'chromium'
            ? {executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe'} : {})});
        try {
            for (const touch of [false, true]) {
                const page = await browser.newPage({viewport: touch ? {width: 390, height: 844} : {width: 1366, height: 768},
                    hasTouch: touch, reducedMotion: 'reduce'});
                const errors = [];
                page.on('pageerror', error => errors.push(error.message));
                await page.addInitScript(() => {
                    // Observe the real mixer without replacing sample or synthesis playback.
                    if (!window.AudioNode) return;
                    const connect = AudioNode.prototype.connect;
                    AudioNode.prototype.connect = function (...args) {
                        const result = connect.apply(this, args);
                        if (args[0] === this.context.destination) {
                            const analyser = this.context.createAnalyser();
                            analyser.fftSize = 2048;
                            connect.call(this, analyser);
                            window.wheelAudioAnalyser = analyser;
                        }
                        return result;
                    };
                });
                await page.goto(url, {waitUntil: 'networkidle'});
                await page.evaluate(() => {
                    window.wheelAudioCalls = [];
                    const midi = PianoEngine.playMidi;
                    const sequence = PianoEngine.playSequence;
                    PianoEngine.playMidi = function (note, options) {
                        window.wheelAudioCalls.push({kind: 'midi', midi: note});
                        return midi(note, options);
                    };
                    PianoEngine.playSequence = function (groups, beat) {
                        window.wheelAudioCalls.push({kind: 'sequence', groups, beat});
                        return sequence(groups, beat);
                    };
                });
                const press = locator => touch ? locator.tap() : locator.click();
                await press(page.getByRole('button', {name: 'Circle of Fifths (5도권 활용)', exact: true}));
                await press(page.locator('.row-act.is-text').first());
                assert.deepEqual(await page.evaluate(() => window.wheelAudioCalls), [], 'opening a lesson must stay silent');
                const board = page.locator('#wheelBoard');
                const major = position => board.locator(`.wheel-cell-major[data-position="${position}"]`);
                const minor = position => board.locator(`.wheel-cell-minor[data-position="${position}"]`);
                await expectChord(page, () => press(major(0)), [60, 64, 67]);
                const audioStatus = await page.evaluate(() => {
                    try {
                        PianoEngine.now();
                        return {available: !!window.wheelAudioAnalyser, hasContext: !!(window.AudioContext || window.webkitAudioContext),
                            state: window.wheelAudioAnalyser?.context.state};
                    } catch (error) { return {available: false, error: error.message}; }
                });
                if (!audioStatus.available) {
                    assert.ok(engine === 'webkit' && (audioStatus.error || !audioStatus.hasContext), JSON.stringify(audioStatus));
                    console.log('WebKit audio output unavailable: ' + (audioStatus.error || 'AudioContext is not exposed') + '; checking input and note mapping');
                } else await page.waitForFunction(() => {
                    const analyser = window.wheelAudioAnalyser;
                    if (!analyser) return false;
                    const data = new Float32Array(analyser.fftSize);
                    analyser.getFloatTimeDomainData(data);
                    return data.some(value => Math.abs(value) > .002);
                }, null, {timeout: 3000});
                await expectChord(page, () => press(major(0)), [60, 64, 67]);
                await expectChord(page, () => press(minor(0)), [69, 72, 76]);
                await expectChord(page, () => press(major(1)), [67, 71, 74]);
                await expectChord(page, () => press(board.locator('.wheel-func-cell[data-degree="4"]')), [62, 66, 69]);
                await expectMode(page, () => press(board.locator('.wheel-mode-cell[data-mode="Dorian"]')),
                    [69, 71, 72, 74, 76, 78, 79, 81]);
                await expectChord(page, () => press(board.locator('.wheel-key-preview[data-quality="maj"]')), [67, 71, 74]);
                await expectChord(page, () => press(board.locator('.wheel-key-preview[data-quality="min"]')), [64, 67, 71]);
                await expectChord(page, () => press(page.locator('#wheelPrev')), [60, 64, 67]);
                await expectChord(page, () => press(page.locator('#wheelNext')), [67, 71, 74]);
                await expectChord(page, () => press(major(6)), [66, 70, 73]);
                await expectChord(page, () => press(page.locator('#wheelFlat')), [66, 70, 73]);
                assert.match(await major(6).getAttribute('aria-label'), /^G♭/);
                await expectChord(page, async () => { await major(11).focus(); await page.keyboard.press('Enter'); }, [65, 69, 72]);
                await expectChord(page, () => page.keyboard.press('Space'), [65, 69, 72]);
                await expectChord(page, () => press(page.locator('#wheelChords button').first()), [65, 69, 72]);
                await expectChord(page, async () => {
                    await board.locator('.wheel').scrollIntoViewIfNeeded();
                    const box = await board.locator('.wheel').boundingBox();
                    const x = box.x + box.width / 2, y = box.y + box.height / 2;
                    const radius = box.width * 120 / 432;
                    await page.mouse.move(x, y - radius);
                    await page.mouse.down();
                    await page.mouse.move(x + radius * .5, y - radius * Math.sqrt(3) / 2, {steps: 8});
                    await page.mouse.up();
                }, [58, 62, 65]);

                await press(page.locator('.page-back'));
                await press(page.locator('.row-act.is-practice').last());
                await page.evaluate(() => { window.wheelAudioCalls.length = 0; });
                await press(page.locator('#wheelHint summary'));
                const hint = page.locator('#wheelHintBoard');
                await hint.locator('.wheel').waitFor();
                assert.deepEqual(await page.evaluate(() => window.wheelAudioCalls), [], 'opening a hint must stay silent');
                await expectChord(page, () => press(hint.locator('.wheel-cell-major[data-position="0"]')), [60, 64, 67]);
                await expectChord(page, () => press(hint.locator('.wheel-cell-minor[data-position="0"]')), [69, 72, 76]);
                await expectChord(page, () => press(hint.locator('.wheel-func-cell[data-degree="3"]')), [65, 69, 72]);
                await expectMode(page, () => press(hint.locator('.wheel-mode-cell[data-mode="Ionian"]')),
                    [60, 62, 64, 65, 67, 69, 71, 72]);
                assert.deepEqual(errors, []);
                console.log(`${engine} ${touch ? 'touch' : 'desktop'}: key/chord/mode mapping, repeat, keyboard and quiz hint passed${audioStatus.available ? ', audible mixer verified' : ''}`);
                await page.close();
            }
        } finally { await browser.close(); }
    }
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => server.close());
