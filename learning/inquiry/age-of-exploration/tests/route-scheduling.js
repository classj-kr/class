'use strict';
const assert = require('node:assert/strict');
const N = require('../lib/nav-grid');
(async () => {
  const grid = N.buildNavGrid((x,y) => x === 160 && y < 210 ? 'land' : 'sea', 320, 240);
  const start = N.indexOf(grid, 120, 20), goal = N.indexOf(grid, 200, 30);
  const expected = N.findPath(grid, 'sea', start, goal);
  let callbacks = 0, run = true;
  function heartbeat() { if (run) { callbacks++; setImmediate(heartbeat); } }
  setImmediate(heartbeat);
  const actual = await N.findPathAsync(grid, 'sea', start, goal);
  run = false;
  assert.deepEqual(actual, expected, 'slicing must preserve the exact route');
  assert(callbacks > 5, 'other work must run during path search');
  let cancel = false;
  const first = N.findPathAsync(grid, 'sea', start, goal, false, { key:'active', cancelled:()=>cancel });
  const old = N.findPathAsync(grid, 'sea', start, goal, false, { key:'student' });
  const newest = N.findPathAsync(grid, 'sea', goal, start, false, { key:'student' });
  cancel = true;
  assert.equal(await first, null, 'manual steering/stop cancels an active route request');
  assert.equal(await old, null, 'a new click replaces the same student’s queued destination');
  assert.deepEqual(await newest, N.findPath(grid, 'sea', goal, start));
  console.log(JSON.stringify({ ok:true, timerCallbacks:callbacks, sameRoute:true, cancelled:true, latestClickWins:true }));
})().catch(error=>{console.error(error);process.exitCode=1});
