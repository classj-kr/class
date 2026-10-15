const test = require('node:test');
const assert = require('node:assert/strict');
const { createModel, SIZE, MAX_HEIGHT } = require('../learning/inquiry/math/stacking-cubes/model.js');

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
