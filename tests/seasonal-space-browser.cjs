const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const puppeteer = require('puppeteer-core');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'outputs/qa/seasonal-space-review');
fs.mkdirSync(output, { recursive: true });
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css', '.webp': 'image/webp' };
// Observe real camera/scene state without adding a debug API to production.
const probe = `
const OriginalControls = THREE.OrbitControls;
THREE.OrbitControls = function(camera, canvas) {
    const controls = new OriginalControls(camera, canvas);
    if (canvas.id === 'emOrbitSeasonCanvas') window.seasonCameraProbe = { camera, controls };
    return controls;
};
const OriginalRenderer = THREE.WebGLRenderer;
THREE.WebGLRenderer = function(options) {
    const renderer = new OriginalRenderer(options);
    if (options.canvas.id === 'emOrbitSeasonCanvas') {
        const render = renderer.render.bind(renderer);
        renderer.render = function(scene, camera) { window.seasonCameraProbe.scene = scene; return render(scene, camera); };
    }
    return renderer;
};
`;
const server = http.createServer((req, res) => {
    let file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
    if (!file.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
    try {
        if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
        let data = fs.readFileSync(file);
        if (file.endsWith('seasonal-space-view.js')) data = probe + data;
        res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
        res.end(data);
    } catch { res.writeHead(404); res.end(); }
});
const settle = () => new Promise(resolve => setTimeout(resolve, 900));
(async () => {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    let browser;
    try {
        browser = await puppeteer.launch({ executablePath: process.env.SCIENCE_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe', userDataDir: fs.mkdtempSync(path.join(output, 'chrome-')), headless: true, args: ['--no-sandbox', '--enable-unsafe-swiftshader'] });
        const page = await browser.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.setRequestInterception(true);
        page.on('request', request => request.url().startsWith('http://127.0.0.1:') || request.url().startsWith('data:') ? request.continue() : request.abort());
        await page.setViewport({ width: 1500, height: 900 });
        await page.goto(`http://127.0.0.1:${server.address().port}/learning/inquiry/space/earth-moon/?topic=sun-path#observe`, { waitUntil: 'networkidle0' });
        await page.waitForSelector('#emSunPathSimulator:not([hidden])');
        await page.click('#emSunPathPlayBtn');
        await settle();
        assert.equal(await page.$('.em-sunpath-heading'), null);
        const snapshot = () => page.evaluate(() => {
            const { camera, controls, scene } = window.seasonCameraProbe;
            const earth = scene.children.find(child => child.type === 'Group' && child.children.some(item => item.type === 'Group'));
            const spin = earth.children[0].children[0];
            const observer = spin.children.find(child => child.type === 'Group');
            return { position: camera.position.toArray(), target: controls.target.toArray(), distance: camera.position.distanceTo(controls.target), offset: camera.position.clone().sub(controls.target).normalize().toArray(), earth: earth.position.toArray(), observer: observer.getWorldPosition(new THREE.Vector3()).toArray(), aspect: camera.aspect };
        });
        const initial = await snapshot();
        const bounds = await page.$eval('#emOrbitSeasonCanvas', canvas => canvas.getBoundingClientRect().toJSON());
        const drag = async (dx, dy) => {
            const x = bounds.x + bounds.width * 0.55;
            const y = bounds.y + bounds.height * 0.8;
            await page.mouse.move(x, y);
            await page.mouse.down();
            await page.mouse.move(x + dx, y + dy, { steps: 15 });
            await page.mouse.up();
            await settle();
        };
        await drag(100, 0);
        const horizontal = await snapshot();
        await page.screenshot({ path: path.join(output, 'rotation.png') });
        assert(Math.abs(horizontal.offset[0] - initial.offset[0]) > 0.2, 'horizontal drag orbits camera');
        await drag(0, 110);
        const vertical = await snapshot();
        assert(Math.abs(vertical.offset[1] - horizontal.offset[1]) > 0.2, 'vertical drag changes elevation');
        await page.click('.em-season-space-reset');
        await settle();
        await drag(0, -240);
        assert((await snapshot()).offset[1] < 0, 'camera can orbit below the orbital plane');
        await page.click('.em-season-space-reset');
        await settle();
        const reset = await snapshot();
        assert(Math.abs(reset.distance - initial.distance) < 0.01, 'reset restores zoom');
        await page.screenshot({ path: path.join(output, 'overview.png') });
        const dayBefore = await page.$eval('#emSunPathDaySlider', e => e.value);
        await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
        for (let i = 0; i < 55; i++) await page.mouse.wheel({ deltaY: -100 });
        await settle();
        const zoomed = await snapshot();
        const distance = (a, b) => Math.hypot(...a.map((value, i) => value - b[i]));
        assert(zoomed.distance < 45, 'wheel reaches observer close-up');
        assert(distance(zoomed.target, zoomed.observer) < 1, 'close zoom pivots onto surface observer');
        assert(distance(zoomed.offset, reset.offset) < 0.001, 'focus shift preserves viewing angle');
        assert.equal(await page.$eval('#emSunPathDaySlider', e => e.value), dayBefore, 'camera gestures preserve date');
        await page.screenshot({ path: path.join(output, 'observer-close-up.png') });
        for (let i = 0; i < 55; i++) await page.mouse.wheel({ deltaY: 100 });
        await settle();
        assert(distance((await snapshot()).target, initial.target) < 0.01, 'zooming out restores Sun-centred overview');
        for (let i = 0; i < 55; i++) await page.mouse.wheel({ deltaY: -100 });
        await settle();
        await page.$eval('#emSunPathDaySlider', e => { e.value = '172'; e.dispatchEvent(new Event('input', { bubbles: true })); });
        await page.click('[data-sunpath-place="호주"]');
        await settle();
        const moved = await snapshot();
        assert(distance(moved.target, moved.observer) < 1, 'focus follows date and latitude changes');
        assert(distance(moved.earth, zoomed.earth) > 100, 'date moves Earth around orbit');
        await page.click('#emSunPathOrbitToggle');
        await page.click('#emSunPathRayToggle');
        assert(await page.evaluate(() => {
            const scene = seasonCameraProbe.scene;
            return !scene.children.find(e => e.type === 'Line').visible && !scene.children.find(e => e.type === 'Group' && e.children[0]?.type === 'Line').visible;
        }), 'orbit and rays switches still work');
        await page.click('.em-season-space-reset');
        await settle();
        await page.click('.em-season-space-label[aria-label^="동지"]');
        assert.equal(await page.$eval('#emSunPathDaySlider', e => e.value), '356', 'season labels select date');
        for (const [width, height] of [[900, 700], [390, 844]]) {
            await page.setViewport({ width, height, isMobile: width === 390, hasTouch: width === 390 });
            await settle();
            await page.click('.em-season-space-reset');
            await settle();
            assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `no horizontal overflow at ${width}`);
            await page.screenshot({ path: path.join(output, `overview-${width}.png`), fullPage: true });
        }
        const mobile = await page.$eval('#emOrbitSeasonCanvas', e => e.getBoundingClientRect().toJSON());
        const client = await page.createCDPSession();
        const x = mobile.x + mobile.width / 2, y = mobile.y + mobile.height / 2;
        const beforePinch = await snapshot();
        const points = gap => [{ x: x - gap, y, id: 1 }, { x: x + gap, y, id: 2 }];
        await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: points(25) });
        for (let gap = 30; gap <= 85; gap += 5) await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: points(gap) });
        await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
        await settle();
        assert((await snapshot()).distance < beforePinch.distance * 0.6, 'two-finger pinch zooms on mobile');
        assert.deepEqual(errors, []);
        console.log('PASS: 3D rotation, observer zoom/tracking, reset, seasonal selection, toggles, responsive layout and touch pinch.');
    } finally {
        if (browser) await browser.close();
        await new Promise(resolve => server.close(resolve));
    }
})().catch(error => { console.error(error); process.exitCode = 1; });
