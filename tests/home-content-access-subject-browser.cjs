const assert = require('node:assert/strict');
const path = require('node:path');
const express = require('../game-hub-server/node_modules/express');
const { chromium } = require('../game-hub-server/node_modules/playwright');

(async () => {
  const writes = [];
  const classLocks = new Set();
  const globalLocks = new Set();
  let role = 'anonymous';
  let mode = 'open';
  const root = path.resolve(__dirname, '..');
  const app = express();
  app.use(express.json());
  app.get('/api/site/access', (_req, res) => res.json({ mode }));
  app.get('/api/auth/config', (_req, res) => res.json({ enabled: false, missing: [] }));
  app.get('/api/auth/me', (_req, res) => res.json(role === 'anonymous'
    ? { signedIn: false }
    : { signedIn: true, user: { id: 1, name: '검증계정', role: ['homeroom', 'subject'].includes(role) ? 'teacher' : role } }));
  app.get('/api/teacher/profile', (_req, res) => res.json({
    profiles: ['homeroom', 'subject'].includes(role) ? [{ name: '검증교사', schoolName: '시험학교' }] : []
  }));
  app.get('/api/home-content-access', (req, res) => res.json(req.query.path ? {} : {
    classDisabledPaths: ['homeroom', 'student'].includes(role) ? [...classLocks] : [],
    globallyDisabledPaths: [...globalLocks], hasClassAccess: role === 'student',
    canManage: role === 'homeroom', canManageGlobally: role === 'admin'
  }));
  for (const [scope, permittedRole, locks] of [['admin', 'admin', globalLocks], ['teacher', 'homeroom', classLocks]]) {
    app.put('/api/' + scope + '/home-content-access', (req, res) => {
      assert.equal(role, permittedRole);
      const { path, disabled } = req.body;
      writes.push({ scope, path, disabled });
      if (disabled) locks.add(path);
      else locks.delete(path);
      res.json({ ok: true, ...req.body });
    });
  }
  app.use(express.static(root));
  const server = await new Promise(resolve => { const listener = app.listen(0, '127.0.0.1', () => resolve(listener)); });
  const base = 'http://127.0.0.1:' + server.address().port;
  let browser;
  try {
    browser = await chromium.launch({ headless: true, ...(process.platform === 'win32' ? { channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome' } : {}) });
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
    await page.route('https://**', route => route.abort());
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const go = async () => page.goto(base + '/');
    const visible = target => target.waitFor({ state: 'visible', timeout: 5000 });
    const toggle = id => page.locator(id).click();
    const locked = (target, kind) => target.and(page.locator('[data-' + kind + '-locked="true"]')).waitFor({ state: 'attached' });
    const game = page.locator('a[href="learning/games/beantrading/beantrading"]');
    const sibling = page.locator('a[href="learning/games/gemguild/gemguild"]');
    const economyGroup = page.locator('[data-game-category="resource-economy"]');
    const games = page.locator('#category-boardgame-panel');
    const enterGameGroup = async () => { await toggle('#category-boardgame-toggle'); await economyGroup.locator('summary').click(); };
    for (const accessMode of ['open', 'restricted']) {
      mode = accessMode;
      await Promise.all([page.waitForResponse(response => response.url().endsWith('/api/auth/config')), go()]);
      assert.equal(await page.locator('#hubContent').isVisible(), false);
      assert.equal(await page.locator('.category-toggle:visible').count(), 0);
    }

    role = 'subject';
    await go();
    await visible(page.locator('#hubContent'));
    assert.equal(await page.locator('#contentAccessButton').isVisible(), false);
    assert.equal(await page.locator('#globalContentAccessButton').isVisible(), false);
    await enterGameGroup();
    await visible(game);
    assert.equal(await game.getAttribute('aria-disabled'), null);

    role = 'student';
    await go();
    await enterGameGroup();
    await visible(game);
    assert.equal(await game.getAttribute('aria-disabled'), null, 'a new class can use every game');

    for (const [editor, button, scope, state] of [
      ['admin', '#globalContentAccessButton', 'admin', 'global-disabled'],
      ['homeroom', '#contentAccessButton', 'teacher', 'class-locked']
    ]) {
      role = editor;
      await go();
      await toggle(button);
      await toggle('#category-boardgame-toggle');
      const groups = await games.locator('[data-game-category]').all();
      assert.equal(groups.length, 7);
      const startingWrites = writes.length;
      for (const group of groups) {
        await group.locator('summary').click();
        await visible(group.locator('a').last());
        assert.equal(writes.length, startingWrites, 'a category click does not save locks');
      }
      await economyGroup.locator('summary').click();
      await game.click();
      await game.and(page.locator('[data-' + state + '="true"]')).waitFor();
      assert.deepEqual(writes.at(-1), { scope, path: '/learning/games/beantrading/beantrading', disabled: true });
      assert.equal(await sibling.getAttribute('data-' + state), 'false');

      role = 'student';
      await go();
      await enterGameGroup();
      await locked(game, editor === 'admin' ? 'global' : 'class');
      await game.press('Enter');
      assert.equal(page.url(), base + '/');
      assert.equal(await sibling.getAttribute('aria-disabled'), null);

      role = editor;
      await go();
      await toggle(button);
      await enterGameGroup();
      await game.click();
      await game.and(page.locator('[data-' + state + '="false"]')).waitFor();
      assert.deepEqual(writes.at(-1), { scope, path: '/learning/games/beantrading/beantrading', disabled: false });
    }

    role = 'homeroom';
    await go();
    await toggle('#contentAccessButton');
    await toggle('#category-exploration-toggle');
    const science = page.locator('[data-access-group="science"]');
    await science.locator('summary').click();
    const lab = science.locator('a[href="learning/inquiry/science-lab/"]');
    await lab.click();
    await locked(lab, 'class');
    assert.deepEqual(writes.at(-1), { scope: 'teacher', path: '/learning/inquiry/science-lab', disabled: true });
    assert.equal(await science.locator('a[href="learning/inquiry/human-body/"]').getAttribute('data-class-locked'), 'false');

    await toggle('#category-literacy-toggle');
    await page.locator('[data-access-group="numeracy"] > summary').click();
    const math = '/learning/literacy-numeracy/math-tools/';
    await page.locator('a[data-access-catalog]').click();
    await page.waitForURL(base + math + '?settings=class');
    await visible(page.locator('#tool-settings'));
    const fractions = page.locator('a.tool[href="' + math + 'fraction-board/"]');
    await fractions.click();
    await visible(fractions.locator('.tool-state'));
    assert.deepEqual(writes.at(-1), { scope: 'teacher', path: math + 'fraction-board', disabled: true });

    role = 'student';
    await page.goto(base + math + '?settings=class');
    await fractions.and(page.locator('[aria-disabled="true"]')).waitFor();
    assert.equal(await page.locator('#tool-settings').isVisible(), false);
    assert.equal(await page.locator('a.tool[href="' + math + 'number-models/"]').getAttribute('aria-disabled'), null);
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ ok: true, gameGroups: 7, testedRoles: ['anonymous', 'student', 'subject', 'homeroom', 'admin'] }));
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
