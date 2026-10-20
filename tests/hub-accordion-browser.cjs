const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { chromium } = require('../game-hub-server/node_modules/playwright');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'outputs', 'hub-accordion-motion');
const origin = 'http://127.0.0.1:4173';
const fixtures = {
  '/api/site/access': { mode: 'open' },
  '/api/auth/me': { signedIn: true, user: { id: 2, name: '가교사', email: 'teacher@school.test', role: 'teacher' } },
  '/api/teacher/profile': { profiles: [{ name: '가교사', schoolName: '시험학교', teacherType: '담임', grade: 3, classNumber: 1 }] },
  '/api/schools': { schools: [] },
  '/api/home-content-access': {
    mode: 'open', enabledPaths: [], ownEnabledPaths: [], openedBySubjectTeachers: {},
    globallyDisabledPaths: [], hasClassAccess: false, canManage: true, manageScope: 'homeroom',
    managedClasses: ['3-1'], canManageGlobally: false,
  },
};

const settled = (page) => page.waitForFunction(
  () => !document.documentElement.classList.contains('hub-accordion-active'), null, { timeout: 3000 },
);

async function sampleClick(page, selector, watch) {
  return page.evaluate(({ selector, watch }) => new Promise((resolve) => {
    const trigger = document.querySelector(selector);
    const element = document.querySelector(watch);
    const samples = [];
    let started;
    function sample(now) {
      if (!started) started = now;
      samples.push({
        t: now - started,
        height: element.getBoundingClientRect().height,
        top: trigger.getBoundingClientRect().top,
        scroll: window.scrollY,
        opacity: Number(getComputedStyle(element).opacity),
        visibleHeight: element.closest('details:not([open])') ? 0 : element.getBoundingClientRect().height
          * (1 - (parseFloat(element.style.clipPath.split(' ')[2]) || 0) / 100),
      });
      if (samples.length === 1) trigger.click();
      if (now - started < 520) requestAnimationFrame(sample);
      else resolve(samples);
    }
    requestAnimationFrame(sample);
  }), { selector, watch });
}

function gradual(samples, property, label) {
  const values = samples.map((sample) => sample[property]);
  const range = Math.max(...values) - Math.min(...values);
  assert.ok(range > 0.3, `${label}: expected a visible transition`);
  assert.ok(new Set(values.map((value) => value.toFixed(2))).size >= 5, `${label}: missing intermediate frames`);
  for (let i = 1; i < samples.length; i++) {
    const delta = Math.abs(values[i] - values[i - 1]);
    const elapsed = samples[i].t - samples[i - 1].t;
    assert.ok(delta <= range * 2.2 * elapsed / 360 + 3, `${label}: ${delta.toFixed(1)}px jump in ${elapsed.toFixed(1)}ms`);
  }
}

async function lastButtonVisible(page, panelSelector) {
  const bounds = await page.locator(panelSelector).evaluate(panel => {
    const choices = [...panel.querySelectorAll(':scope > a, :scope > details > summary, :scope > .worksheet-item')];
    const last = choices.at(-1);
    const rect = last.getBoundingClientRect();
    return { top: rect.top, bottom: rect.bottom, viewport: innerHeight };
  });
  assert.ok(bounds.top >= 0 && bounds.bottom <= bounds.viewport - 6,
    `last button is clipped in ${panelSelector}: ${JSON.stringify(bounds)}`);
}

async function captureWebp(page, name) {
  execFileSync('python', ['-c', [
    'from PIL import Image',
    'import io, sys',
    'source = Image.open(io.BytesIO(sys.stdin.buffer.read())).convert("RGBA")',
    'source.save(sys.argv[1], "WEBP", lossless=True, exact=True)',
    'saved = Image.open(sys.argv[1]).convert("RGBA")',
    'assert saved.size == source.size and saved.tobytes() == source.tobytes()',
  ].join('\n'), path.join(output, name)], { input: await page.screenshot() });
}

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launchPersistentContext(path.join(output, `browser-${process.pid}`), {
    headless: true,
    channel: 'chrome',
    args: ['--disable-crash-reporter', '--disable-breakpad'],
  });
  const results = [];
  try {
    const page = await browser.newPage();
    const errors = [];
    const writes = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.route('**/*', async (route) => {
      const url = new URL(route.request().url());
      if (url.origin !== origin) return route.abort();
      if (url.pathname === '/api/teacher/home-content-access' && route.request().method() === 'PUT') {
        const body = route.request().postDataJSON();
        writes.push(body);
        return route.fulfill({ json: { ok: true, ...body } });
      }
      if (fixtures[url.pathname]) return route.fulfill({ json: fixtures[url.pathname] });
      if (url.pathname.startsWith('/api/')) return route.fulfill({ status: 404, json: { error: 'NOT_IN_TEST' } });
      const file = path.resolve(root, '.' + (url.pathname === '/' ? '/index.html' : decodeURIComponent(url.pathname)));
      if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) return route.fulfill({ status: 404, body: '' });
      const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'application/javascript', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ogg': 'audio/ogg' };
      return route.fulfill({ path: file, contentType: types[path.extname(file)] || 'application/octet-stream' });
    });

    const widths = process.argv.length > 2 ? process.argv.slice(2).map(Number) : [1366, 768, 390];
    for (const width of widths) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(origin, { waitUntil: 'networkidle' });
      await page.locator('#signedInArea').waitFor({ state: 'visible' });
      const games = '#category-boardgame-toggle';
      await page.locator(games).scrollIntoViewIfNeeded();
      const opening = await sampleClick(page, games, '.boardgame-section');
      gradual(opening, 'height', `category opening at ${width}`);
      assert.equal(await page.locator('#category-boardgame-panel').isVisible(), true);
      await lastButtonVisible(page, '#category-boardgame-panel');

      const first = '[data-game-category="visual-response"] > summary';
      await page.locator(first).scrollIntoViewIfNeeded();
      const nested = await sampleClick(page, first, width <= 600 ? '[data-game-category="visual-response"]' : '[data-game-category="visual-response"] > .worksheet-group-options');
      fs.writeFileSync(path.join(output, `submenu-${width}.json`), JSON.stringify(nested, null, 2));
      gradual(nested, width <= 600 ? 'height' : 'visibleHeight', `submenu opening at ${width}`);
      await lastButtonVisible(page, '[data-game-category="visual-response"] > .worksheet-group-options');

      if (width <= 600) {
        const last = '[data-game-category="solo-puzzles"] > summary';
        await page.locator(last).scrollIntoViewIfNeeded();
        const switching = await sampleClick(page, last, '[data-game-category="visual-response"]');
        fs.writeFileSync(path.join(output, 'mobile-switch.json'), JSON.stringify(switching, null, 2));
        gradual(switching, 'height', 'closing an earlier mobile submenu');
        gradual(switching, 'scroll', 'anchored mobile submenu switch');
        await lastButtonVisible(page, '[data-game-category="solo-puzzles"] > .worksheet-group-options');
        await captureWebp(page, `expanded-${width}.webp`);
        results.push({ width, mobileSwitchRevealsLastButton: true });
      } else {
        // Different-length menus each reveal their final button smoothly.
        await page.locator(first).click();
        await settled(page);
        const pair = ['visual-response', 'logic-deduction', 'math-operations'];
        const positions = [];
        for (const key of pair) {
          const selector = `[data-game-category="${key}"] > summary`;
          await page.locator(selector).scrollIntoViewIfNeeded();
          const before = await page.evaluate(() => window.scrollY);
          const reveal = await sampleClick(page, selector, `[data-game-category="${key}"] > .worksheet-group-options`);
          fs.writeFileSync(path.join(output, `reveal-${key}-${width}.json`), JSON.stringify(reveal, null, 2));
          await lastButtonVisible(page, `[data-game-category="${key}"] > .worksheet-group-options`);
          const distance = (await page.evaluate(() => window.scrollY)) - before;
          if (distance > 3) gradual(reveal, 'scroll', `reveal final ${key} button at ${width}`);
          positions.push(distance);
          if (key === 'math-operations') await captureWebp(page, `expanded-${width}.webp`);
          await page.locator(selector).click();
          await settled(page);
        }
        results.push({ width, popoverScroll: positions });
      }

      await page.locator(games).scrollIntoViewIfNeeded();
      const closing = await sampleClick(page, games, '.boardgame-section');
      gradual(closing, 'height', `category closing at ${width}`);
      assert.equal(await page.locator('#category-boardgame-panel').isVisible(), false);
      assert.equal(await page.locator('#category-boardgame-panel details[open]').count(), 0);

      // Retarget interrupted parent and child transitions, including a child
      // opened before the parent has reached its original target height.
      await page.evaluate(async () => {
        const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        const click = (selector) => document.querySelector(selector).click();
        click('#category-boardgame-toggle');
        await wait(65);
        click('[data-game-category="spatial-placement"] > summary');
        await wait(65);
        click('[data-game-category="spatial-placement"] > summary');
        await wait(55);
        click('[data-game-category="math-operations"] > summary');
        await wait(55);
        click('#category-literacy-toggle');
        await wait(60);
        click('#category-boardgame-toggle');
      });
      await settled(page);
      assert.equal(await page.locator('.category-toggle[aria-expanded="true"]').count(), 1);
      assert.equal(await page.locator(games).getAttribute('aria-expanded'), 'true');
      assert.equal(await page.locator('.hub-accordion-clipping').count(), 0);
      assert.equal(await page.locator('[data-category-section][style*="height"], .worksheet-group[style*="height"]').count(), 0);

      const keyboard = page.locator('[data-game-category="resource-economy"] > summary');
      await keyboard.focus();
      await keyboard.press('Enter');
      await settled(page);
      assert.equal(await keyboard.getAttribute('aria-expanded'), 'true');
      await keyboard.press('Space');
      await settled(page);
      assert.equal(await keyboard.getAttribute('aria-expanded'), 'false');
    }

    // Existing permission-edit clicks must be handled by the access gate,
    // rather than also opening the submenu through the new motion controller.
    await page.locator('#contentAccessButton').click();
    await settled(page);
    await page.locator('#category-literacy-toggle').click();
    await settled(page);
    const story = '[data-access-group="story-books"] > summary';
    await page.locator(story).click();
    await page.waitForFunction(() => document.body.innerText.includes('공개했습니다'), null, { timeout: 3000 });
    assert.equal(writes.length, 2);
    assert.equal(await page.locator('[data-access-group="story-books"]').getAttribute('open'), null);
    await page.locator('#contentAccessButton').click();

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.locator('#category-boardgame-toggle').click();
    await settled(page);
    assert.equal(await page.locator('#category-boardgame-toggle').getAttribute('aria-expanded'), 'true');
    await page.locator('[data-game-category="math-operations"] > summary').click();
    await settled(page);
    await lastButtonVisible(page, '[data-game-category="math-operations"] > .worksheet-group-options');
    await page.locator('#category-boardgame-toggle').click();
    await settled(page);
    assert.equal(await page.locator('#category-boardgame-panel').isVisible(), false);
    assert.equal(await page.locator('.hub-accordion-clipping').count(), 0);
    assert.deepEqual(errors, []);
    fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify(results, null, 2));
    console.log(JSON.stringify({ ok: true, viewports: results, rapidToggle: true, keyboard: true, accessEditing: true, reducedMotion: true }));
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error.stack); process.exitCode = 1; });
