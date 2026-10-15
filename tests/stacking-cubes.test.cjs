const test = require('node:test');
const assert = require('node:assert/strict');
const { createModel, SIZE, MAX_HEIGHT } = require('../learning/inquiry/math/stacking-cubes/model.js');
const activities = require('../learning/inquiry/math/stacking-cubes/activities.js');

test('front and right silhouettes preserve orientation and hide rear columns', () => {
  const board = createModel();
  for (const [x, z, height] of [[0, 0, 1], [0, 4, 3], [1, 1, 2], [4, 0, 5], [2, 3, 4]]) {
    for (let y = 0; y < height; y++) board.edit(x, z, 1);
  }
  assert.equal(board.count(), 15);
  assert.deepEqual(board.projection('front'), [3, 2, 4, 0, 5]);
  assert.deepEqual(board.projection('right'), [3, 4, 0, 2, 5]);
  const footprint = Array(25).fill(0);
  for (const index of [0, 4, 6, 17, 20]) footprint[index] = 1;
  assert.deepEqual(board.projection('top'), footprint);
  // A rear block can change the total without changing either silhouette.
  board.edit(0, 0, 1);
  assert.equal(board.count(), 16);
  assert.deepEqual(board.projection('front'), [3, 2, 4, 0, 5]);
  assert.deepEqual(board.projection('right'), [3, 4, 0, 2, 5]);
});

test('erase, clear and undo restore the exact construction without floating cubes', () => {
  const board = createModel();
  board.edit(2, 2, 1);
  board.edit(2, 2, 1);
  board.edit(3, 2, 1);
  const original = board.snapshot();
  board.edit(2, 2, -1);
  assert.equal(board.height(2, 2), 1);
  board.undo();
  assert.deepEqual(board.snapshot(), original);
  board.clear();
  assert.equal(board.count(), 0);
  assert.equal(board.clear(), false);
  board.undo();
  assert.deepEqual(board.snapshot(), original);
  const detached = board.snapshot();
  detached[12] = 99;
  assert.equal(board.height(2, 2), 2);
});

test('empty cells, board boundaries and height limits do not create undo entries', () => {
  const board = createModel();
  assert.equal(board.edit(0, 0, -1), false);
  for (const [x, z, delta] of [[-1, 0, 1], [SIZE, 0, 1], [0, SIZE, 1], [.5, 0, 1], [0, 0, 2]]) {
    assert.equal(board.edit(x, z, delta), false);
  }
  assert.equal(board.canUndo(), false);
  for (let y = 0; y < MAX_HEIGHT; y++) board.edit(0, 0, 1);
  assert.equal(board.edit(0, 0, 1), false);
  board.undo();
  assert.equal(board.height(0, 0), MAX_HEIGHT - 1);
});

test('loading validates the whole board and preserves the previous board for undo', () => {
  const board = createModel();
  board.edit(0, 0, 1);
  const original = board.snapshot();
  for (const invalid of [null, {}, [], Array(25), Array(25).fill('1'), Array(25).fill(-1), Array(25).fill(7), Array(25).fill(.5)]) {
    assert.equal(board.replace(invalid), false);
    assert.deepEqual(board.snapshot(), original);
  }
  const loaded = activities.questions('copy')[0];
  assert.equal(board.replace(loaded), true);
  loaded[0] = 6;
  assert.equal(board.height(0, 0), 0, 'loaded boards are detached');
  board.undo();
  assert.deepEqual(board.snapshot(), original);
});

test('shared links and files round-trip and reject malformed or unsupported data', () => {
  const board = activities.questions('copy')[2];
  for (const mode of ['free', 'copy', 'views']) assert.deepEqual(activities.decode(activities.encode(board, mode)), { mode, heights: board });
  assert.deepEqual(activities.parseFile(activities.file(board)), board);
  for (const hash of ['', '#cubes1/many/' + '1'.repeat(25), '#cubes1/copy/' + '0'.repeat(25), '#cubes1/free/' + '7'.repeat(25), '#cubes1/free/' + '1'.repeat(24), '#cubes1/free/' + '1'.repeat(25) + 'x']) assert.equal(activities.decode(hash), null);
  for (const value of ['{}', 'not json', JSON.stringify({ type: 'classj-stacking-cubes', version: 2, heights: board }), ' '.repeat(16385)]) assert.equal(activities.parseFile(value), null);
  assert.throws(() => activities.encode(board, 'many'));
});

test('every many-answer activity has distinct solutions with identical three projections', () => {
  for (const target of activities.questions('many')) {
    let alternative;
    for (let i = 0; i < target.length && !alternative; i++) for (let h = 1; h <= MAX_HEIGHT && !alternative; h++) {
      if (!target[i] || h === target[i]) continue;
      const next = target.slice(); next[i] = h;
      if (activities.check(next, target, 'many').correct) alternative = next;
    }
    assert.ok(alternative, 'at least two valid constructions exist');
    assert.equal(activities.check(alternative, target, 'copy').correct, false);
    assert.equal(activities.check(alternative, target, 'views').correct, true, 'projection tasks accept valid alternatives');
  }
  const target = activities.questions('copy')[0];
  assert.deepEqual(activities.check(Array(25).fill(0), target, 'views').mismatches, ['top', 'front', 'right']);
});
