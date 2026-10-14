const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { APP_DIRECTORIES, SITE_PAGES, resolveSitePath } = require('../game-hub-server/site-paths');
const root = path.resolve(__dirname, '..');

test('legacy app URLs resolve every relocated application file', () => {
  for (const directory of APP_DIRECTORIES) {
    assert.equal(fs.existsSync(path.join(root, directory)), false);
    const base = path.join(root, 'apps', directory);
    assert.equal(resolveSitePath(root, `/${directory}`), base);
    assert.equal(fs.existsSync(resolveSitePath(root, `/${directory}/index.html`)), true);
    for (const file of fs.readdirSync(base, { recursive: true })) {
      const url = `/${directory}/${file.split(path.sep).join('/')}`;
      assert.equal(resolveSitePath(root, url), path.join(base, file));
    }
  }
});

test('shared content stays rooted at the repository', () => {
  for (const url of ['/index.html', '/assets/icons/favicon.webp', '/learning/games/citychase/realtime.html']) {
    assert.equal(resolveSitePath(root, url), path.join(root, url));
  }
});

test('site policy and guidance pages live together under apps/site', () => {
  for (const file of SITE_PAGES) {
    assert.equal(fs.existsSync(path.join(root, file)), false);
    const expected = path.join(root, 'apps', 'site', file);
    assert.equal(resolveSitePath(root, `/${file}`), expected);
    assert.equal(fs.existsSync(expected), true);
  }
});

test('app URL resolution rejects directory traversal and Windows separators', () => {
  for (const url of ['/classtools/../../.git/config', '/../admin/index.html', '/room/../vote/index.html', '/classtools\\..\\admin']) {
    assert.equal(resolveSitePath(root, url), null);
  }
});
