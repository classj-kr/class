const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const express = require('../game-hub-server/node_modules/express');
const {chromium, webkit} = require('../game-hub-server/node_modules/playwright');
const capture = require('./screenshot-webp.cjs');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'outputs/qa/instrument-keyboard-motion');
const [engineFilter, profileFilter] = process.argv.slice(2);
const app = express();
app.use(express.static(root));
const server = app.listen(0, '127.0.0.1');

async function trace(page, actions) {
    return page.evaluate(async actions => {
        const viewport = document.querySelector('#keyboardViewport');
        const samples = [viewport.scrollLeft];
        let stable = 0;
        const started = performance.now();
        const settled = new Promise((resolve, reject) => {
            function sample() {
                const next = viewport.scrollLeft;
                stable = Math.abs(next - samples.at(-1)) < .1 ? stable + 1 : 0;
                samples.push(next);
                const elapsed = performance.now() - started;
                if (elapsed > 240 && stable >= 10) resolve();
                else if (elapsed > 2500) reject(new Error('Keyboard scroll did not settle'));
                else requestAnimationFrame(sample);
            }
            requestAnimationFrame(sample);
        });
        for (const [id, delay = 0] of actions) {
            if (delay) await new Promise(resolve => setTimeout(resolve, delay));
            document.getElementById(id).click();
        }
        await settled;
        const start = Number(document.querySelector('.key[data-shortcut="A"]').dataset.midi);
        const target = document.querySelector('.key[data-midi="' + (start + 9) + '"]');
        const expected = Math.max(0, Math.min(viewport.scrollWidth - viewport.clientWidth,
            target.offsetLeft + target.offsetWidth / 2 - viewport.clientWidth / 2));
        const keys = [...document.querySelectorAll('#keyboard .key')];
        return {samples, start, expected, end: viewport.scrollLeft,
            sameKeys: keys.every((key, index) => key === window.motionOriginalKeys[index]),
            range: document.querySelector('#keyboardRangeReadout').textContent};
    }, actions);
}

function checkMotion(result, smooth, label) {
    assert.ok(result.sameKeys, label + ': range movement must preserve all key elements');
    assert.ok(Math.abs(result.end - result.expected) < 2, label + ': final range must be centered');
    const first = result.samples[0];
    const distance = Math.abs(result.end - first);
    assert.ok(distance > 20, label + ': range should move');
    if (smooth) {
        const between = result.samples.filter(value => value > Math.min(first, result.end) + 1 && value < Math.max(first, result.end) - 1);
        assert.ok(new Set(between).size >= 3, label + ': must show intermediate positions: ' + JSON.stringify(result.samples));
        assert.ok(result.samples.every(value => value >= Math.min(first, result.end) - 1 && value <= Math.max(first, result.end) + 1), label + ': no jump to the keyboard origin');
        const largestStep = Math.max(...result.samples.slice(1).map((value, index) => Math.abs(value - result.samples[index])));
        assert.ok(largestStep < distance * .8, label + ': must not jump to the destination in one frame');
    } else {
        assert.ok(new Set(result.samples.map(Math.round)).size <= 2, label + ': reduced motion should move immediately');
    }
}

(async () => {
    if (!server.listening) await new Promise(resolve => server.once('listening', resolve));
    fs.mkdirSync(output, {recursive: true});
    const url = `http://127.0.0.1:${server.address().port}/learning/arts/instrument-room/`;
    for (const [name, launcher] of [['chromium', chromium], ['webkit', webkit]]) {
        if (engineFilter && engineFilter !== name) continue;
        const browser = await launcher.launch({headless: true, ...(name === 'chromium'
            ? {executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe'} : {})});
        try {
            for (const profile of [
                {name: 'desktop', width: 1366, height: 768},
                {name: 'touch', width: 768, height: 1024, touch: true},
                {name: 'phone', width: 390, height: 844, touch: true},
                {name: 'reduced-motion', width: 1366, height: 768, reduced: true}
            ]) {
                if (profileFilter && profileFilter !== profile.name) continue;
                const page = await browser.newPage({viewport: {width: profile.width, height: profile.height},
                    hasTouch: !!profile.touch, reducedMotion: profile.reduced ? 'reduce' : 'no-preference'});
                const errors = [];
                page.on('pageerror', error => errors.push(error.message));
                await page.goto(url, {waitUntil: 'networkidle'});
                const closeCalibration = page.locator('button.key-size-close');
                if (await closeCalibration.isVisible()) await closeCalibration.click();
                await page.evaluate(() => { window.motionOriginalKeys = [...document.querySelectorAll('#keyboard .key')]; });
                assert.equal(await page.locator('#keyboard .key').count(), 88);

                const octave = await trace(page, [['octaveUp']]);
                checkMotion(octave, !profile.reduced, name + ' ' + profile.name + ' octave up');
                assert.equal(octave.start, 72);
                assert.equal(octave.range, 'C5–F6');
                const fine = await trace(page, [['whiteKeyUp']]);
                checkMotion(fine, !profile.reduced, name + ' ' + profile.name + ' white key up');
                assert.equal(fine.start, 74);
                const down = await trace(page, [['whiteKeyDown']]);
                checkMotion(down, !profile.reduced, name + ' ' + profile.name + ' white key down');
                assert.equal(down.start, 72);
                const octaveDown = await trace(page, [['octaveDown']]);
                checkMotion(octaveDown, !profile.reduced, name + ' ' + profile.name + ' octave down');
                assert.equal(octaveDown.start, 60);

                const rapid = await trace(page, [['whiteKeyUp'], ['whiteKeyUp', 45], ['octaveUp', 45], ['whiteKeyDown', 45]]);
                assert.ok(rapid.sameKeys);
                assert.equal(rapid.start, 74);
                assert.ok(Math.abs(rapid.end - rapid.expected) < 2, 'rapid inputs must finish at the latest range');

                await page.keyboard.press('ArrowLeft');
                await page.waitForFunction(() => document.querySelector('.key[data-shortcut="A"]').dataset.midi === '72');
                await page.keyboard.press('Shift+ArrowLeft');
                await page.waitForFunction(() => document.querySelector('.key[data-shortcut="A"]').dataset.midi === '60');
                await trace(page, []);
                await capture(page.locator('.play-surface'), {path: path.join(output, `${name}-${profile.name}.webp`)});
                assert.deepEqual(errors, []);
                console.log(`${name} ${profile.name}: smooth octave/white-key movement, stable keys, rapid input and shortcuts passed`);
                await page.close();
            }
        } finally { await browser.close(); }
    }
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => server.close());
