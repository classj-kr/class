import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
assert.match(html, /<div id="hubContent" hidden\b/, 'The entire hub starts hidden.');
assert.match(html, /if \(state\.signedIn\) \{\s*await routeSignedIn\(state\);[\s\S]*?hubContent\.hidden = true;/);
assert.match(html, /await api\('\/api\/auth\/guest',[\s\S]*?await loadClassContentAccess\(\);\s*hubContent\.hidden = false;/);
assert.match(html, /const baseHref = link\.dataset\.baseHref\s*\|\| link\.getAttribute\('href'\);/);

const start = html.indexOf('function updatePlayerLearningLinks(');
const end = html.indexOf('async function api(', start);
const voyage = { id: 'cds95GameLink', dataset: { playerHandoff: 'query' },
    getAttribute: () => '/learn/world-voyage/' };
const update = new Function('playerLearningLinks', 'window', 'isValidPlayerName',
    html.slice(start, end) + '\nreturn updatePlayerLearningLinks;')(
    [voyage], { location: { href: 'https://classj.kr/' } }, value => /^[가-힣]{2,6}$/.test(value));
update('아아');
const url = new URL(voyage.href);
assert.equal(url.pathname, '/learn/world-voyage/');
assert.equal(url.searchParams.get('name'), '아아');
console.log('Index access gate contract passed.');
