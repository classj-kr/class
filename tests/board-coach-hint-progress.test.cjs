'use strict';
const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('node:fs'), vm = require('node:vm');
function harness() {
  const workers = [], shown = [], failures = [];
  class Worker {
    constructor() { workers.push(this); }
    postMessage(message) { this.request = message; }
    terminate() { this.stopped = true; }
    emit(result, partial = false) { this.onmessage({ data: { result, partial } }); }
  }
  const context = { window: {}, document: { querySelector: () => null }, Worker };
  vm.runInNewContext(fs.readFileSync(require.resolve('../learning/games/board-coach/coach-ui.js'), 'utf8'), context);
  const hints = context.window.BoardCoachUI.prepareTurnHint('test-worker', (result, progress) => shown.push({ result, ...progress }), () => failures.push(true));
  return { hints, workers, shown, failures };
}
test('clicking before the preview arrives still receives every deeper result and the final move', () => {
  const { hints, workers, shown } = harness(), state = {};
  hints.prepare(state);
  assert.equal(hints.request(state), false);
  workers[0].emit({ index: 4, depth: 0 }, true);
  workers[0].emit({ index: 8, depth: 3 }, true);
  workers[0].emit({ index: 9, depth: 5 });
  assert.deepEqual(shown, [
    { result: { index: 4, depth: 0 }, pending: true, first: true },
    { result: { index: 8, depth: 3 }, pending: true, first: false },
    { result: { index: 9, depth: 5 }, pending: false, first: false }
  ]);
  assert.equal(workers[0].stopped, true);
});
test('completed precomputation is immediately available and old turns cannot overwrite a new hint', () => {
  const { hints, workers, shown } = harness(), first = {}, next = {};
  hints.prepare(first); workers[0].emit({ index: 3, depth: 6 });
  assert.equal(shown.length, 0);
  assert.equal(hints.request(first), true);
  assert.equal(shown[0].pending, false);
  hints.prepare(next);
  workers[0].emit({ index: 99 });
  assert.equal(shown.length, 1);
  hints.request(next); workers[1].emit({ index: 12, depth: 1 }, true);
  hints.clear(); workers[1].emit({ index: 18, depth: 5 });
  assert.equal(shown.length, 2);
  assert.equal(workers[1].stopped, true);
});
test('worker failure ends the pending request and permits retry', () => {
  const { hints, workers, failures } = harness(), state = {};
  hints.request(state); workers[0].onerror();
  assert.equal(failures.length, 1);
  hints.request(state);
  assert.equal(workers.length, 2);
});
