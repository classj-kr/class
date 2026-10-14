const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const express = require('../game-hub-server/node_modules/express');
const { hideUnpublishedLessons } = require('../game-hub-server/unpublished-lessons');
const root = path.resolve(__dirname, '..');

test('withdrawn art pages and assets cannot be served, while neighboring courses stay available', async () => {
  const app = express();
  app.use(hideUnpublishedLessons);
  app.use((_req, res) => res.send('available'));
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    for (const route of [
      '/learning/arts/art-theory', '/learning/arts/art-theory/',
      '/learning/arts/art-theory/index.html', '/learning/arts/art-theory/design-principles/',
      '/learning/arts/art-theory/obangsaek/', '/learning/arts/art-theory/experience.js?v=1',
      '/learning//arts/art-theory/', '/learning/arts/%61rt-theory/',
      '/LEARNING/ARTS/ART-THEORY/', '/learning/arts/art-theory%2fobangsaek/',
      '/learning/arts/art-theory/obangsaek/assets/dragon.webp',
    ]) {
      const response = await fetch(base + route);
      assert.equal(response.status, 404, route);
      assert.equal(response.headers.get('cache-control'), 'no-store', route);
      assert.equal(response.headers.get('x-robots-tag'), 'noindex', route);
      assert.match(await response.text(), /현재 제공하지 않는 수업/);
    }
    const head = await fetch(base + '/learning/arts/art-theory/', { method: 'HEAD' });
    assert.equal(head.status, 404);
    assert.equal(await head.text(), '');
    for (const route of ['/', '/health', '/learning/arts/music-theory/ear-training/',
      '/learning/arts/music-theory/rhythm-training/', '/learning/arts/art-studio/',
      '/learning/arts/art-theory-other/']) {
      const response = await fetch(base + route);
      assert.equal(response.status, 200, route);
      assert.equal(await response.text(), 'available', route);
    }
    assert.equal((await fetch(base + '/learning/%zz')).status, 400);
  } finally {
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
});

test('portal removes art links without removing the remaining theory courses', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  assert.doesNotMatch(html, /learning\/arts\/art-theory\//);
  assert.match(html, /href="learning\/arts\/music-theory\/rhythm-training\/"/);
  assert.match(html, /href="learning\/arts\/music-theory\/ear-training\/"/);
  const source = fs.readFileSync(path.join(root, 'game-hub-server/server.js'), 'utf8');
  const guard = source.indexOf('app.use(hideUnpublishedLessons);');
  assert.ok(guard > 0 && guard < source.indexOf('classroomPlatform.requireSiteAccess'));
  assert.ok(guard < source.indexOf('express.static('));
});
