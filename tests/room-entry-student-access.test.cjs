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
