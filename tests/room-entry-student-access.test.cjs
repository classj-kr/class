const test = require('node:test');
const assert = require('node:assert/strict');
const { createAccessGate } = require('./classroom-site-access-harness.cjs');

async function check(url, options, accept = '*/*') {
  let result;
  const req = { originalUrl: url, method: 'GET',
    get: name => name === 'sec-fetch-dest' ? 'empty' : undefined,
    accepts: type => accept === '*/*' || accept.includes(type) ? type : false };
  await createAccessGate(options)(req, { redirect: (status, location) => { result = { status, location }; } },
    error => { if (error) throw error; result = { status: 200 }; });
  return result;
}

test('a registered student can resolve a four-digit room with the default fetch Accept header', async () => {
  let contentQueries = 0;
  const options = { onContentQuery: () => contentQueries++ };
  assert.deepEqual(await check('/room/', options), { status: 200 });
  assert.deepEqual(await check('/api/room-entry/resolve/6820', options), { status: 200 });
  assert.deepEqual(await check('/api/room-entry/resolve/6820?check=1', options), { status: 200 });
  assert.equal(contentQueries, 0, 'the entry API is not a teacher-curated content item');
});

test('a student can enter an arithmetic race room even when the arithmetic menu is closed', async () => {
  for (const url of ['/arithmetic/race?room=6820&entry=main', '/api/arithmetic-race?room=6820', '/api/arithmetic-race/entry?room=6820']) {
    assert.deepEqual(await check(url), { status: 200 }, url);
  }
  const ticket = '/arithmetic/counting-1?race=6820&participant=a&participantToken=b';
  const classDisabled = ['/arithmetic'];
  assert.deepEqual(await check(ticket, { classDisabled, isLiveRaceRequest: async url => url === ticket }), { status: 200 });
  assert.deepEqual(await check(ticket, { classDisabled, isLiveRaceRequest: async () => false }), { status: 302, location: '/?content=locked' });
  assert.deepEqual(await check('/arithmetic/counting-1', { classDisabled }), { status: 302, location: '/?content=locked' });
});

test('the entry exception preserves login and membership, while lessons are open by default', async () => {
  assert.deepEqual(await check('/api/room-entry/resolve/6820', { role: null }), { status: 302, location: '/?access=required' });
  assert.deepEqual(await check('/api/room-entry/resolve/6820', { member: false }), { status: 302, location: '/?access=required' });
  for (const url of ['/learning/lesson/', '/api/room-entry/admin', '/api/room-entry/resolve/6820/private']) {
    assert.deepEqual(await check(url), { status: 200 });
    assert.deepEqual(await check(url, { role: null, mode: 'open' }), { status: 302, location: '/?access=required' });
  }
  assert.deepEqual(await check('/api/room-entry/resolve/6820', { disabled: ['/api/room-entry'] }), { status: 302, location: '/?content=globally-disabled' });
});

test('a student can open and join a typing race even when the typing menu is closed', async () => {
  const root = '/learning/inquiry/information-computing/typing';
  for (const url of [root + '/race/?room=6820', root + '/race/race.js', '/api/typing-race/rooms', '/api/typing-race/rooms/6820/join']) {
    assert.deepEqual(await check(url), { status: 200 }, url);
    assert.deepEqual(await check(url, { role: null }), { status: 302, location: '/?access=required' });
  }
  assert.deepEqual(await check(root + '/', { classDisabled: [root] }), { status: 302, location: '/?content=locked' });
});

test('a student can open and join a Korean race even when the language menus are closed', async () => {
  const root = '/learning/literacy-numeracy/korean-race';
  for (const url of [root + '/?room=6820', root + '/race.js', root + '/korean-race-core.js', '/api/korean-race/rooms', '/api/korean-race/rooms/6820/answer']) {
    assert.deepEqual(await check(url), { status: 200 }, url);
    assert.deepEqual(await check(url, { role: null }), { status: 302, location: '/?access=required' });
  }
  const spelling = '/learning/literacy-numeracy/spelling';
  assert.deepEqual(await check(spelling + '/', { classDisabled: [spelling] }), { status: 302, location: '/?content=locked' });
});

test('stacking cooperation opens from the main room entrance while retaining site access checks', async () => {
  const root = '/learning/literacy-numeracy/math-tools/stacking-cubes';
  for (const url of [root + '/coop/?code=6820', root + '/coop/app.js', root + '/coop/coop.js', root + '/coop/coop.css']) {
    assert.deepEqual(await check(url), { status: 200 });
    assert.deepEqual(await check(url, { role: null }), { status: 302, location: '/?access=required' });
    assert.deepEqual(await check(url, { disabled: [root] }), { status: 302, location: '/?content=globally-disabled' });
  }
});

test('old stacking room links use the new access rules before redirecting', async () => {
  const current = '/learning/literacy-numeracy/math-tools/stacking-cubes';
  for (const suffix of ['/race/?room=6820', '/race/app.js', '/coop/?code=6820', '/coop/coop.css']) {
    const url = '/learning/inquiry/math/stacking-cubes' + suffix;
    assert.deepEqual(await check(url), { status: 200 });
    assert.deepEqual(await check(url, { role: null }), { status: 302, location: '/?access=required' });
    assert.deepEqual(await check(url, { disabled: [current] }), { status: 302, location: '/?content=globally-disabled' });
  }
  const numberModels = '/learning/literacy-numeracy/math-tools/number-models';
  assert.deepEqual(await check('/learning/inquiry/math/number-models/', { classDisabled: [numberModels] }), { status: 302, location: '/?content=locked' });
});

test('an individual lock covers legacy game links and direct pages without locking sibling menus', async () => {
  const game = '/learning/games/spot-match';
  const globe = '/learning/inquiry/globe';
  for (const path of [game, '/learning/games/./dobble/dobble.html', '/learning/games/%73pot-match', globe + '/index.html']) {
    assert.deepEqual(await check(path), { status: 200 });
    assert.deepEqual(await check(path, { classDisabled: [game, globe] }), { status: 302, location: '/?content=locked' });
    assert.deepEqual(await check(path, { disabled: [game, globe] }), { status: 302, location: '/?content=globally-disabled' });
  }
  for (const path of ['/learning/games/shape-crossing', globe + '/history/', globe + '/vendor/library.js']) {
    assert.deepEqual(await check(path, { disabled: [game, globe], classDisabled: [game, globe] }), { status: 200 });
  }
  assert.deepEqual(await check(game, { role: 'teacher', classDisabled: [game] }), { status: 200 });
  assert.deepEqual(await check(game, { role: 'admin', disabled: [game] }), { status: 200 });
});
