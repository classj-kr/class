'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { chromium } = require('../game-hub-server/node_modules/playwright');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'outputs', 'nim-strategy-guide');
const origin = 'http://127.0.0.1:4173';

async function capture(page, name) {
    const png = await page.screenshot({ animations: 'disabled' });
    execFileSync('python', ['-c',
        'import io,sys; from PIL import Image; im=Image.open(io.BytesIO(sys.stdin.buffer.read())); im.save(sys.argv[1],"WEBP",lossless=True); check=Image.open(sys.argv[1]); assert check.format=="WEBP" and check.size==im.size; check.load()',
        path.join(output, name + '.webp')], { input: png });
}

async function fits(page) {
    const metrics = await page.locator('.nim-guide').evaluate(guide => {
        const box = guide.closest('.modal-box');
        const rect = box.getBoundingClientRect();
        const close = box.querySelector('.modal-actions button').getBoundingClientRect();
        return { overflow: guide.scrollWidth - guide.clientWidth, modalOverflow: box.scrollWidth - box.clientWidth, top: rect.top, bottom: rect.bottom, viewport: innerHeight, closeTop: close.top, closeBottom: close.bottom, width: innerWidth };
    });
    assert.ok(metrics.overflow <= 1 && metrics.modalOverflow <= 1 && metrics.top >= -1 && metrics.bottom <= metrics.viewport + 1, JSON.stringify(metrics));
    assert.ok(metrics.closeTop >= 0 && metrics.closeBottom <= metrics.viewport, 'The close action must stay on screen: ' + JSON.stringify(metrics));
    if (metrics.width <= 480) assert.ok(metrics.top >= 60, 'Keep the lesson below the floating page controls.');
}

async function feedback(page, result) {
    assert.equal(await page.locator('.guide-feedback').getAttribute('data-result'), result);
    assert.ok(await page.locator('#guide-practice .guide-board .is-taken').count() > 0, 'A selected move must show the objects being taken.');
}

async function choose(page, count, result) {
    await page.locator(`[data-guide-take="${count}"]`).click();
    await feedback(page, result);
    await fits(page);
}

(async () => {
    fs.mkdirSync(output, { recursive: true });
    const browser = await chromium.launchPersistentContext(path.join(output, 'browser-' + process.pid), {
        channel: 'chrome', headless: true, args: ['--disable-crash-reporter', '--disable-breakpad'],
    });
    try {
        const page = await browser.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.addInitScript(() => { window.CLASS_PLAYER_NAME = '가교사'; });
        await page.route('**/*', route => {
            const url = new URL(route.request().url());
            if (url.origin !== origin) return route.abort();
            if (url.pathname === '/health') return route.fulfill({ json: { ok: true } });
            if (url.pathname.startsWith('/api/')) return route.fulfill({ json: {} });
            const file = path.resolve(root, '.' + decodeURIComponent(url.pathname));
            if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) return route.fulfill({ status: 404, body: '' });
            const types = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.ogg': 'audio/ogg' };
            return route.fulfill({ path: file, contentType: types[path.extname(file)] || 'application/octet-stream' });
        });
        await page.routeWebSocket('**/*', socket => {
            socket.send(JSON.stringify({ type: 'CONNECTED', playerId: 'host-1' }));
            socket.onMessage(raw => {
                const message = JSON.parse(String(raw));
                if (message.type === 'CREATE_ROOM') socket.send(JSON.stringify({ type: 'ROOM_CREATED', playerId: 'host-1', roomCode: message.roomCode }));
            });
        });

        const results = [];
        for (const width of [1366, 390, 320]) {
            await page.setViewportSize({ width, height: 844 });
            await page.goto(origin + '/learning/games/nimgame/nimgame.html', { waitUntil: 'networkidle' });
            await page.locator('#host-tab').click();
            await page.locator('#mode-nim').waitFor({ state: 'visible' });
            let variants = 0;
            for (const mode of ['nim', 'coin']) {
                await page.locator('#mode-' + mode).click();
                for (const rule of ['misere', 'normal']) {
                    await page.locator('#rule-' + rule).click();
                    for (const limit of mode === 'coin' ? [2, 3, 4] : [3]) {
                        if (mode === 'coin') await page.locator('#limit-' + limit).click();
                        const before = await page.evaluate(() => JSON.stringify(state));
                        await page.locator('#rules-btn-lobby').click();
                        await fits(page);
                        const next = page.locator('[data-guide-action="next"]');
                        const steps = mode === 'nim' ? rule === 'misere' ? 15 : 11 : rule === 'misere' ? 7 : 6;
                        assert.equal(await page.locator('.guide-step-count').innerText(), `1 / ${steps}`);
                        await page.locator('#guide-demo-tab').focus();
                        await page.keyboard.press('End');
                        assert.equal(await page.locator('#guide-practice-tab').getAttribute('aria-selected'), 'true');
                        await page.keyboard.press('Home');
                        assert.equal(await page.locator('#guide-demo-tab').getAttribute('aria-selected'), 'true');
                        await next.click();
                        await page.locator('[data-guide-action="previous"]').click();
                        assert.equal(await page.locator('.guide-step-count').innerText(), `1 / ${steps}`);

                        for (let step = 1; step < steps; step++) {
                            await next.click();
                            assert.equal(await page.locator('.guide-step-count').innerText(), `${step + 1} / ${steps}`);
                            await fits(page);
                            if (mode === 'nim' && [3, 7].includes(step)) {
                                assert.equal(await page.locator('#guide-demo .guide-unpaired').count(), 0);
                                assert.equal(await page.locator('#guide-demo .guide-paired').count(), 3);
                            }
                            if (width === 390 && mode === 'nim' && rule === 'misere' && step === 3) {
                                await page.locator('#guide-demo .guide-scene h4').scrollIntoViewIfNeeded();
                                await capture(page, 'nim-pairs-mobile');
                            }
                        }
                        await next.click();
                        assert.equal(await page.locator('#guide-practice-tab').getAttribute('aria-selected'), 'true');
                        if (mode === 'nim') {
                            await choose(page, 2, 'retry');
                            assert.ok(await page.locator('#guide-practice .guide-unpaired').count() > 0);
                            await choose(page, 1, 'correct');
                            assert.equal(await page.locator('#guide-practice .guide-unpaired').count(), 0);
                            await page.locator('[data-guide-action="continue"]').click();
                            await choose(page, 2, 'retry');
                            await choose(page, 1, 'correct');
                            await page.locator('[data-guide-action="continue"]').click();
                            await choose(page, rule === 'misere' ? 3 : 1, 'retry');
                            await choose(page, 2, 'correct');
                            if (rule === 'misere') {
                                await page.locator('[data-guide-action="continue"]').click();
                                await choose(page, 2, 'retry');
                                await choose(page, 3, 'correct');
                            }
                        } else {
                            await choose(page, 1, 'retry');
                            await choose(page, limit, 'correct');
                            await page.locator('[data-guide-action="continue"]').click();
                            const answer = limit - 1;
                            await choose(page, answer === 1 ? 2 : 1, 'retry');
                            if (width === 390 && rule === 'misere' && limit === 3) await capture(page, 'coin-practice-mobile');
                            await choose(page, answer, 'correct');
                        }
                        await page.locator('[data-guide-action="continue"]').click();
                        assert.equal(await page.locator('.guide-practice-content h4').innerText(), '연습을 끝냈어요!');
                        await page.locator('[data-guide-action="restart"]').click();
                        assert.ok((await page.locator('.guide-practice-content h4').innerText()).startsWith('연습 1.'));
                        assert.equal(await page.evaluate(() => JSON.stringify(state)), before, 'Tutorial moves must not change the game or its settings.');
                        await page.locator('#modal-actions button').click();
                        await page.locator('#rules-btn-lobby').click();
                        assert.equal(await page.locator('.guide-step-count').innerText(), `1 / ${steps}`);
                        assert.equal(await page.locator('#guide-demo-tab').getAttribute('aria-selected'), 'true');
                        await page.locator('#modal-actions button').click();
                        variants++;
                    }
                }
            }
            results.push({ width, variants, walkthroughs: true, retryFeedback: true, keyboard: true, independentPractice: true });
        }
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.locator('#rules-btn-lobby').click();
        await page.locator('[data-guide-action="next"]').click();
        assert.equal(await page.locator('#guide-demo .guide-token.is-taken').first().evaluate(el => getComputedStyle(el).animationName), 'none');
        assert.deepEqual(errors, []);
        fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify(results, null, 2));
        console.log(JSON.stringify({ ok: true, results, reducedMotion: true }));
    } finally { await browser.close(); }
})().catch(error => { console.error(error.stack); process.exitCode = 1; });
