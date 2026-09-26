const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const puppeteer = require('puppeteer-core');
const root = path.resolve(__dirname, '..');
const artifactDir = path.join(root, 'docs/computer-a01-pilot');
const prefix = '/learning/inquiry/information-computing/computer-fundamentals/textbook/';
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.webp': 'image/webp', '.ico': 'image/x-icon' };
const server = http.createServer((req, res) => {
    let target;
    try { target = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname)); }
    catch { res.writeHead(400).end(); return; }
    if (!target.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
    if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
    fs.readFile(target, (error, data) => {
        if (error) { res.writeHead(404).end(); return; }
        res.writeHead(200, { 'Content-Type': mime[path.extname(target)] || 'application/octet-stream' }); res.end(data);
    });
});
const KEY = 'classj:textbook:a01:v1';
(async () => {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const url = 'http://127.0.0.1:' + server.address().port + prefix + 'a01.html';
    let browser;
    try {
        browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--no-first-run', '--no-default-browser-check'] });
        const page = await browser.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        page.on('response', response => { if (response.status() >= 400) errors.push(response.status() + ' ' + response.url()); });
        await page.setViewport({ width: 1440, height: 1000 });
        await page.goto(url, { waitUntil: 'networkidle0' });
        await page.waitForFunction(() => !document.getElementById('runPhoto').disabled);
        assert.equal(await page.title(), '1차시. 컴퓨터의 역할');
        const goto = async name => {
            await page.click('[data-page="' + name + '"]');
            assert.equal(await page.$eval('#page-' + name, el => el.hidden), false);
        };
        const txt = id => page.$eval('#' + id, el => el.textContent);
        await goto('photo');
        await page.click('#runPhoto');
        const colorImage = await page.$eval('#photoOutput img', el => el.src);
        await page.click('[data-rule="gray"]');
        await page.focus('#runPhoto'); await page.keyboard.press('Enter');
        const grayImage = await page.$eval('#photoOutput img', el => el.src);
        assert.notEqual(colorImage, grayImage, 'Image bytes must actually change');
        const gray = await page.$eval('#photoOutput img', img => {
            const c = document.createElement('canvas'); c.width = 224; c.height = 224;
            const ctx = c.getContext('2d'); ctx.drawImage(img, 0, 0);
            const data = ctx.getImageData(0, 0, 224, 224).data;
            for (let i = 0; i < data.length; i += 4) if (data[i] !== data[i + 1] || data[i] !== data[i + 2]) return false;
            return true;
        });
        assert.equal(gray, true, 'Grayscale output must have equal RGB channels');
        await page.click('#closePhoto');
        assert.equal(await page.$('#photoOutput img'), null);
        assert.equal(await page.$eval('#openPhoto', el => el.disabled), true);
        assert.match(await txt('photoFeedback'), /저장된 그림도 없습니다/);
        assert.equal(await page.$eval('#comparison', el => el.hidden), true);
        await page.click('#runPhoto'); await page.click('#savePhoto');
        await page.click('[data-rule="bright"]'); await page.click('#runPhoto');
        const savedImage = await page.$eval('#savedPhoto img', el => el.src);
        assert.equal(savedImage, grayImage, 'Processing does not overwrite the saved photo');
        await page.click('#closePhoto'); await page.click('#openPhoto');
        assert.equal(await page.$eval('#photoOutput img', el => el.src), grayImage);
        assert.match(await txt('photoComplete'), /마쳤습니다/);

        await goto('transfer');
        await page.click('#submitNumber');
        assert.match(await txt('numberFeedback'), /저장된 결과가 없습니다/);
        await page.click('#runNumber'); await page.click('#saveNumber');
        const setNumber = async value => {
            await page.$eval('#numberInput', (el, text) => { el.value = text; el.dispatchEvent(new Event('input', { bubbles: true })); }, value);
        };
        await setNumber('6'); await page.select('#numberRule', 'times3'); await page.click('#runNumber');
        assert.equal(await txt('numberOutput'), '18');
        assert.equal(await txt('savedNumber'), '7');
        await page.click('#submitNumber');
        assert.match(await txt('numberFeedback'), /저장된 기록의 입력값/);
        await page.click('#saveNumber'); await page.click('#submitNumber');
        assert.match(await txt('numberFeedback'), /작업을 닫은 다음/);
        await page.click('#closeNumber'); await page.click('#openNumber'); await page.click('#submitNumber');
        assert.equal(await page.$eval('#numberFeedback', el => el.dataset.kind), 'success');

        await goto('check');
        await page.click('[data-question="0"] input[value="0"]');
        await page.click('[data-question="0"] .answer-check');
        assert.match(await txt('feedback-q0'), /입력입니다/);
        assert.equal(await page.$eval('[data-question="0"] input[value="0"]', el => el.disabled), false, 'Wrong answers stay available');
        const answers = [1, 0, 2, 1];
        for (let i = 0; i < answers.length; i += 1) {
            await page.click('[data-question="' + i + '"] input[value="' + answers[i] + '"]');
            await page.click('[data-question="' + i + '"] .answer-check');
        }
        assert.match(await txt('completionMessage'), /4개 중 3개/);
        assert.equal(await txt('progressText'), '3 / 3 완료');
        await page.evaluate(() => localStorage.setItem('computer-literacy:a01', 'legacy-preserved'));
        await page.reload({ waitUntil: 'networkidle0' });
        assert.equal(await txt('progressText'), '3 / 3 완료');
        assert.equal(await page.$eval('[data-question="0"] input[value="1"]', el => el.checked), true);
        await page.click('#resetProgress'); await page.keyboard.press('Escape');
        assert.equal(await txt('progressText'), '3 / 3 완료', 'Cancel preserves progress');

        fs.mkdirSync(artifactDir, { recursive: true });
        const viewportReports = [];
        for (const width of [1440, 1024, 768, 390, 320]) {
            await page.setViewport({ width, height: width < 600 ? 844 : 1000 });
            for (const name of ['read', 'photo', 'transfer', 'check']) {
                await goto(name);
                const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
                assert.equal(overflow, false, width + 'px ' + name + ' horizontal overflow');
                const smallTargets = await page.evaluate(() => [...document.querySelectorAll('button')].filter(b => {
                    const r = b.getBoundingClientRect();
                    return r.width > 0 && r.height > 0 && r.height < 43;
                }).map(b => b.textContent));
                assert.deepEqual(smallTargets, [], width + 'px ' + name + ' small buttons');
                if (width === 1440 || width === 390) await page.screenshot({ path: path.join(artifactDir, name + '-' + width + '.png'), fullPage: true });
            }
            viewportReports.push({ width, pages: 4, horizontalOverflow: false });
        }
        await goto('check');
        await page.click('#resetProgress'); await page.click('#resetDialog button[value="confirm"]');
        await page.waitForFunction(() => document.getElementById('progressText').textContent === '0 / 3 완료');
        assert.equal(await page.evaluate(() => localStorage.getItem('computer-literacy:a01')), 'legacy-preserved');
        await page.evaluate(key => localStorage.setItem(key, '{bad JSON'), KEY);
        await page.reload({ waitUntil: 'networkidle0' });
        await page.waitForFunction(() => document.getElementById('progressText').textContent === '0 / 3 완료');
        assert.deepEqual(errors, []);

        const blocked = await browser.newPage();
        await blocked.evaluateOnNewDocument(() => {
            Storage.prototype.setItem = function () { throw new DOMException('Blocked', 'SecurityError'); };
        });
        await blocked.goto(url, { waitUntil: 'networkidle0' });
        assert.match(await blocked.$eval('#storageNotice', el => el.textContent), /허용하지 않아/);
        await blocked.close();
        fs.writeFileSync(path.join(artifactDir, 'verification.json'), JSON.stringify({
            passed: true, checks: ['actual grayscale pixels', 'unsaved close', 'immutable saved photo', 'keyboard execution', 'independent task rejects stale save', 'close and reopen required', 'specific wrong-answer feedback', 'progress reload', 'cancel and reset isolation', 'malformed storage', 'blocked storage'],
            viewports: viewportReports, consoleErrors: errors
        }, null, 2));
        console.log('Browser checks passed: photo processing, storage, independent task, feedback, progress; 5 widths × 4 pages.');
    } finally {
        if (browser) await browser.close();
        await new Promise(resolve => server.close(resolve));
    }
})().catch(error => { console.error(error); process.exitCode = 1; });



