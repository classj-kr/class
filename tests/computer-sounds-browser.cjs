const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const puppeteer = require('puppeteer-core');
const root = path.resolve(__dirname, '..');
const course = '/learning/inquiry/information-computing/computer-fundamentals/';
const report = [];
const server = http.createServer((req, res) => {
    let file = path.resolve(root, '.' + new URL(req.url, 'http://localhost').pathname);
    if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    fs.readFile(file, (error, data) => {
        if (error) { res.writeHead(404).end(); return; }
        const type = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
            '.css': 'text/css', '.webp': 'image/webp', '.woff2': 'font/woff2', '.ogg': 'audio/ogg' }[path.extname(file)];
        res.writeHead(200, { 'Content-Type': type || 'application/octet-stream' }).end(data);
    });
});
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
(async () => {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    let browser;
    try {
        browser = await puppeteer.launch({
            executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
            headless: true, args: ['--no-first-run']
        });
        const page = await browser.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        page.on('response', response => { if (response.status() >= 400) errors.push(response.status() + ' ' + response.url()); });
        await page.evaluateOnNewDocument(() => {
            window.soundAudit = { files: [], oscillators: 0 };
            const play = HTMLMediaElement.prototype.play;
            HTMLMediaElement.prototype.play = function () {
                const entry = { name: new URL(this.src).pathname.split('/').pop(), volume: this.volume, played: false };
                window.soundAudit.files.push(entry);
                // Keep native playback: confirm the real OGG reaches the playing state.
                return play.call(this).then(() => { entry.played = true; }, error => {
                    entry.error = error.name;
                    throw error;
                });
            };
            const create = AudioContext.prototype.createOscillator;
            AudioContext.prototype.createOscillator = function () {
                window.soundAudit.oscillators++;
                return create.call(this);
            };
        });
        const origin = 'http://127.0.0.1:' + server.address().port;
        async function open(url) {
            await page.goto(origin + course + url, { waitUntil: 'networkidle0' });
            await page.waitForFunction(() => Boolean(window.ClassGameSfx));
            assert.equal(await page.$$eval('script[src*="/assets/sound/game-sfx.js"]', nodes => nodes.length), 1);
        }
        async function expectSound(label, expected, action, silentClick = true) {
            await page.evaluate(() => { window.soundAudit = { files: [], oscillators: 0 }; });
            await action();
            await pause(230); // Allow automatic feedback observers to reveal any duplicate/wrong sound.
            await page.waitForFunction(() => soundAudit.files.every(file => file.played || file.error), { timeout: 5000 });
            const audit = await page.evaluate(() => window.soundAudit);
            assert.deepEqual(audit.files.map(file => file.name), expected.map(name => name + '.ogg'), label);
            assert.ok(audit.files.every(file => file.played && !file.error), label + ': real media playback');
            if (silentClick) assert.equal(audit.oscillators, 0, label + ': no generic click or fallback tone');
            report.push({ label, ...audit });
        }
        const choice = (index, value) => page.click('[data-question="' + index + '"] input[value="' + value + '"]');
        const submit = index => page.click('[data-question="' + index + '"] .edition-submit');
        await open('lessons/?lesson=h05#apply');
        await expectSound('H05: no answer has no grade sound', [], () => submit(1));
        await expectSound('H05: selecting an answer does not grade', [], () => choice(2, 1));
        await expectSound('H05: screenshot wrong answer plays error, not summary success', ['error'], () => submit(2));
        assert.equal(await page.$eval('[data-question="2"] .edition-feedback', el => el.dataset.correct), 'false');
        await expectSound('H05: identical wrong retry still plays once', ['error'], () => submit(2));
        await choice(2, 0);
        await expectSound('H05: correction plays success', ['success'], () => submit(2));
        await expectSound('H05: solved question selection is silent', [], () => choice(2, 1));
        await expectSound('H05: wrong retry after solving plays error', ['error'], () => submit(2));
        assert.equal(await page.$eval('[data-question="2"]', el => el.dataset.solved), 'true');
        await page.reload({ waitUntil: 'networkidle0' });
        assert.deepEqual(await page.evaluate(() => soundAudit.files), [], 'Restoring completed questions must be silent');
        await expectSound('H05: restored solved record cannot turn a wrong answer into success audio', ['error'], () => submit(2));
        await choice(2, 0);
        await expectSound('H05: Enter submits the current correct answer once', ['success'], async () => {
            await page.focus('[data-question="2"] .edition-submit');
            await page.keyboard.press('Enter');
        });
        await choice(1, 0);
        await expectSound('H05: adjacent application question correct', ['success'], () => submit(1));
        await choice(2, 2);
        await expectSound('H05: adjacent application question wrong', ['error'], () => submit(2));
        await expectSound('H05: navigation and retained summary do not grade', [], () => page.click('[data-page="lab"]'), false);
        await choice(0, 0);
        await expectSound('H05: unmet lab prerequisite has no grade sound', [], () => submit(0));
        const labButton = await page.$('#editionLab button');
        assert.ok(labButton, 'H05 lab has an interactive control');
        await labButton.click();
        await expectSound('H05: lab answer uses the same grading sound', ['success'], () => submit(0));
        await page.click('[data-page="check"]');
        await choice(3, 1);
        await expectSound('H05: final check wrong', ['error'], () => submit(3));
        await choice(3, 0);
        await expectSound('H05: final check correct', ['success'], () => submit(3));
        await page.evaluate(() => { ClassGameSfx.setVolume(0.2); });
        await choice(4, 1);
        await expectSound('H05: site effect volume is respected', ['error'], () => submit(4));
        assert.equal(report.at(-1).files[0].volume, 0.2);
        await page.evaluate(() => {
            localStorage.setItem('classSfxMuted', '1');
            ClassGameSfx.setMuted(true);
        });
        await choice(4, 0);
        await expectSound('H05: muted correct submission stays silent', [], () => submit(4));
        assert.equal(await page.$eval('[data-question="4"] .edition-feedback', el => el.dataset.correct), 'true');
        await page.reload({ waitUntil: 'networkidle0' });
        await choice(4, 1);
        await expectSound('H05: stored mute also silences wrong submissions', [], () => submit(4));
        await page.evaluate(() => {
            localStorage.removeItem('classSfxMuted');
            ClassGameSfx.setMuted(false);
        });
        await open('textbook/a01.html#check');
        await page.waitForFunction(() => !document.getElementById('runPhoto').disabled);
        const aSubmit = index => page.click('[data-question="' + index + '"] .answer-check');
        await expectSound('A01: no answer has no grade sound', [], () => aSubmit(0));
        for (const [index, correct] of [1, 0, 2, 1].entries()) {
            await expectSound('A01: question ' + (index + 1) + ' selection is silent', [], () => choice(index, (correct + 1) % 3));
            await expectSound('A01: question ' + (index + 1) + ' wrong', ['error'], () => aSubmit(index));
            await choice(index, correct);
            await expectSound('A01: question ' + (index + 1) + ' correct', ['success'], async () => {
                await page.focus('[data-question="' + index + '"] .answer-check');
                await page.keyboard.press('Enter');
            });
        }
        await page.click('[data-page="transfer"]');
        await expectSound('A01: incomplete independent task plays error', ['error'], () => page.click('#submitNumber'));
        await page.$eval('#numberInput', el => { el.value = '6'; el.dispatchEvent(new Event('input', { bubbles: true })); });
        await page.select('#numberRule', 'times3');
        for (const selector of ['#runNumber', '#saveNumber', '#closeNumber', '#openNumber']) {
            await expectSound('A01: ' + selector + ' does not grade from descriptive text', [], () => page.click(selector), false);
        }
        await expectSound('A01: completed independent task plays success', ['success'], () => page.click('#submitNumber'));
        await page.reload({ waitUntil: 'networkidle0' });
        assert.deepEqual(await page.evaluate(() => soundAudit.files), [], 'A01 restored progress must be silent');
        assert.deepEqual(errors, []);
        const dir = path.join(root, 'docs/computer-edition');
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, 'verification-sounds.json'), JSON.stringify({ passed: report.length, report, errors }, null, 2));
        console.log(JSON.stringify({ passed: report.length, actualOggPlayback: true, errors }, null, 2));
    } finally {
        await browser?.close();
        await new Promise(resolve => server.close(resolve));
    }
})().catch(error => { console.error(error); process.exitCode = 1; });
