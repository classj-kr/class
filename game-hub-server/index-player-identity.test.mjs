import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

assert.match(
  html,
  /function clearPlayerIdentity\(\)[\s\S]*localStorage\.removeItem\('classPlayerName'\);[\s\S]*updatePlayerLearningLinks\(''\);/,
  'Changing login roles must clear the previous player identity.',
);
assert.match(
  html,
  /function setPlayerIdentity\(value, membership = null\)[\s\S]*currentPlayerName = playerName;[\s\S]*updatePlayerLearningLinks\(playerName, membership\);/,
  'Every playable role must use the shared player identity handoff.',
);
assert.match(
  html,
  /if \(state\.user\?\.role === 'admin'\)[\s\S]*profileList\.appendChild\(btn\);\s*setPlayerIdentity\(state\.user\?\.name \|\| state\.user\?\.displayName\);/,
  'A site administrator must receive the signed-in account name before opening a game.',
);
assert.match(html, /setPlayerIdentity\(teacherProfileData\.name\);/, 'Teachers must use the shared identity path.');
assert.match(html, /setPlayerIdentity\(studentName, m\);/, 'Students must use the shared identity path.');
assert.match(html, /setPlayerIdentity\(guestName\);/, 'Guests must use the shared identity path.');

const helperStart = html.indexOf('function clearPlayerIdentity()');
const helperEnd = html.indexOf('function setHubLocked(locked)', helperStart);
assert.ok(helperStart >= 0 && helperEnd > helperStart, 'Player identity helpers must be extractable.');
const helperSource = html.slice(helperStart, helperEnd);
const writes = [];
const linkUpdates = [];
const runtime = new Function(
  'normalizePlayerName',
  'isValidPlayerName',
  'localStorage',
  'updatePlayerLearningLinks',
  `
    let currentPlayerName = '이전학생';
    ${helperSource}
    return { clearPlayerIdentity, setPlayerIdentity, getName: () => currentPlayerName };
  `,
)(
  value => String(value || '').replace(/\s/g, ''),
  value => /^[가-힣]{2,6}$/.test(value),
  {
    removeItem(key) { writes.push(['remove', key]); },
    setItem(key, value) { writes.push(['set', key, value]); },
  },
  (name, membership) => linkUpdates.push([name, membership]),
);

runtime.clearPlayerIdentity();
assert.equal(runtime.getName(), '');
assert.deepEqual(writes[0], ['remove', 'classPlayerName']);
assert.deepEqual(linkUpdates[0], ['', undefined]);

const adminName = runtime.setPlayerIdentity('사이트 관리자');
assert.equal(adminName, '사이트관리자');
assert.equal(runtime.getName(), '사이트관리자');
// 이름은 서버가 쪽마다 박아 넣으므로(2026-10-06) 브라우저에는 쓰지 않는다. 예전 값을 지우기만 한다.
assert.ok(writes.every(([action, key]) => action === 'remove' && key === 'classPlayerName'), '이름을 브라우저에 쓰면 안 된다');
assert.doesNotMatch(html, /localStorage\.setItem\('classPlayerName'/);
assert.deepEqual(linkUpdates.at(-1), ['사이트관리자', null]);

console.log('Index player identity contract passed.');
