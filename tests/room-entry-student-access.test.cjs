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
  assert.deepEqual(await check(ticket, { isLiveRaceRequest: async url => url === ticket }), { status: 200 });
  assert.deepEqual(await check(ticket, { isLiveRaceRequest: async () => false }), { status: 302, location: '/?content=locked' });
  assert.deepEqual(await check('/arithmetic/counting-1'), { status: 302, location: '/?content=locked' });
});

test('the entry exception preserves login, membership and actual lesson access checks', async () => {
  assert.deepEqual(await check('/api/room-entry/resolve/6820', { role: null }), { status: 302, location: '/?access=required' });
  assert.deepEqual(await check('/api/room-entry/resolve/6820', { member: false }), { status: 302, location: '/?access=required' });
  for (const url of ['/learning/lesson/', '/api/room-entry/admin', '/api/room-entry/resolve/6820/private']) {
    assert.deepEqual(await check(url), { status: 302, location: '/?content=locked' });
  }
  assert.deepEqual(await check('/api/room-entry/resolve/6820', { disabled: ['/api/room-entry'] }), { status: 302, location: '/?content=globally-disabled' });
});

test('a student can open and join a typing race even when the typing menu is closed', async () => {
  const root = '/learning/inquiry/information-computing/typing';
  for (const url of [root + '/race/?room=6820', root + '/race/race.js', root + '/race/music/race-1.ogg', '/api/typing-race/rooms', '/api/typing-race/rooms/6820/join']) {
    assert.deepEqual(await check(url), { status: 200 }, url);
    assert.deepEqual(await check(url, { role: null }), { status: 302, location: '/?access=required' });
  }
  assert.deepEqual(await check(root + '/'), { status: 302, location: '/?content=locked' }, 'the practice menu stays curated');
});

test('a student can open and join a Korean race even when the language menus are closed', async () => {
  const root = '/learning/literacy-numeracy/korean-race';
  for (const url of [root + '/?room=6820', root + '/race.js', root + '/korean-race-core.js', root + '/music/race-1.ogg', '/api/korean-race/rooms', '/api/korean-race/rooms/6820/answer']) {
    assert.deepEqual(await check(url), { status: 200 }, url);
    assert.deepEqual(await check(url, { role: null }), { status: 302, location: '/?access=required' });
  }
  assert.deepEqual(await check('/learning/literacy-numeracy/spelling/'), { status: 302, location: '/?content=locked' }, 'the spelling menu stays curated');
});

test('stacking cooperation opens from the main room entrance while retaining site access checks', async () => {
  const root = '/learning/inquiry/math/stacking-cubes';
  for (const url of [root + '/coop/?code=6820', root + '/coop/app.js', root + '/coop/coop.js', root + '/coop/coop.css']) {
    assert.deepEqual(await check(url), { status: 200 });
    assert.deepEqual(await check(url, { role: null }), { status: 302, location: '/?access=required' });
    assert.deepEqual(await check(url, { disabled: [root] }), { status: 302, location: '/?content=globally-disabled' });
  }
});
