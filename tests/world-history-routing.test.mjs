import assert from 'node:assert/strict';
import fs from 'node:fs';
import {once} from 'node:events';
import test from 'node:test';
import {createCleanHtmlApp} from './clean-html-harness.cjs';

test('world history opens through production clean URLs, including cached legacy redirects', async t => {
  const server = createCleanHtmlApp().listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => new Promise(resolve => server.close(resolve)));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const canonical = '/learning/inquiry/globe/history/';
  const query = '?school=high&topic=ming';

  for (const entry of [canonical, canonical.slice(0, -1), `${canonical.slice(0, -1)}.html`, `${canonical}index.html`]) {
    await t.test(entry, async () => {
      for (const method of ['GET', 'HEAD']) {
        const response = await fetch(`${origin}${entry}${query}`, {method});
        assert.equal(response.status, 200, `${method} ${entry}`);
        assert.equal(response.url, `${origin}${canonical}${query}`);
        assert.match(response.headers.get('content-type'), /text\/html/);
        if (method === 'GET') assert.match(await response.text(), /id="historyMap"/);
      }
    });
  }

  await t.test('entry assets resolve from the canonical directory and include the map module', async () => {
    const response = await fetch(`${origin}${canonical}`);
    const html = await response.text();
    const assets = [...html.matchAll(/<(?:link|script)\b[^>]*(?:href|src)="([^"]+)"/g)].map(match => match[1]);
    assert.ok(assets.includes('app.mjs?v=20261019-3'));
    assert.ok(assets.includes('../vendor/maplibre-gl-6.10.0/maplibre-gl.css'));
    for (const asset of assets) {
      const result = await fetch(new URL(asset, response.url));
      assert.equal(result.status, 200, asset);
      assert.match(result.headers.get('content-type'), /css|javascript/, asset);
    }
    const module = await (await fetch(`${origin}${canonical}app.mjs`)).text();
    const imports = [...module.matchAll(/\bfrom\s*['"]([^'"]+)['"]/g)].map(match => match[1]);
    assert.ok(imports.some(specifier => specifier.includes('maplibre')));
    for (const specifier of imports) {
      assert.equal((await fetch(new URL(specifier, `${origin}${canonical}app.mjs`))).status, 200, specifier);
    }
  });

  await t.test('the home menu links directly to the canonical route', () => {
    const home = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
    assert.match(home, /href="learning\/inquiry\/globe\/history\/\?school=high"/);
    assert.doesNotMatch(home, /href="learning\/inquiry\/globe\/history\.html/);
  });
});
