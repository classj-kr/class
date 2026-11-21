const test = require('node:test');
const assert = require('node:assert/strict');
const { createAccessGate } = require('./classroom-site-access-harness.cjs');

// 정적 파일은 같은 세션이면 출입 확인을 한 번만 한다(2026-11-21). 쪽과 API 는 매번 확인하고, 막힌 결과는 기억하지 않는다.
function request(url, cookie = 'class_session=abc') {
  return { originalUrl: url, method: 'GET', headers: { cookie },
    get: name => name === 'sec-fetch-dest' ? 'script' : undefined,
    accepts: type => type === 'html' ? false : type };
}

async function run(gate, req) {
  let result;
  await gate(req, { redirect: (status, location) => { result = { status, location }; } },
    error => { if (error) throw error; result = { status: 200 }; });
  return result;
}

test('twenty unit files from one session ask for the session once', async () => {
  let lookups = 0;
  const gate = createAccessGate({ onSessionQuery: () => lookups++ });
  const files = Array.from({ length: 20 }, (_, i) => `/learning/literacy-numeracy/math-bank/units/2-2-${i}a.js?v=1`);
  const results = await Promise.all(files.map(url => run(gate, request(url))));
  assert.ok(results.every(result => result.status === 200));
  assert.equal(lookups, 1);
  await run(gate, request('/learning/literacy-numeracy/math-bank/styles.css?v=1'));
  assert.equal(lookups, 1);
});

test('pages, other sessions and signed-out requests are still checked each time', async () => {
  let lookups = 0;
  const gate = createAccessGate({ onSessionQuery: () => lookups++ });
  await run(gate, request('/learning/literacy-numeracy/math-bank/units/1-1-1a.js'));
  await run(gate, request('/learning/literacy-numeracy/math-bank/'));
  await run(gate, request('/learning/literacy-numeracy/math-bank/'));
  assert.equal(lookups, 3, 'the page itself is checked every time');
  await run(gate, request('/learning/literacy-numeracy/math-bank/units/1-1-1a.js', 'class_session=other'));
  assert.equal(lookups, 4, 'another session has its own check');
  await run(gate, request('/learning/literacy-numeracy/math-bank/units/1-1-1a.js', ''));
  await run(gate, request('/learning/literacy-numeracy/math-bank/units/1-1-1a.js', ''));
  assert.equal(lookups, 6, 'no session cookie means no shared result');
});

test('a refused session is not remembered', async () => {
  let lookups = 0;
  const gate = createAccessGate({ role: null, onSessionQuery: () => lookups++ });
  const url = '/learning/literacy-numeracy/math-bank/units/1-1-1a.js';
  assert.deepEqual(await run(gate, request(url)), { status: 302, location: '/?access=required' });
  assert.deepEqual(await run(gate, request(url)), { status: 302, location: '/?access=required' });
  assert.equal(lookups, 2);
});

test('globally closed content stays closed for remembered sessions', async () => {
  const gate = createAccessGate({ disabled: ['/learning/literacy-numeracy/math-bank'] });
  const url = '/learning/literacy-numeracy/math-bank/units/1-1-1a.js';
  assert.equal((await run(gate, request(url))).location, '/?content=globally-disabled');
  assert.equal((await run(gate, request(url))).location, '/?content=globally-disabled');
});
