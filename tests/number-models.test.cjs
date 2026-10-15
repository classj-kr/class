const test = require('node:test');
const assert = require('node:assert/strict');
const C = require('../learning/inquiry/math/number-models/core.js');

test('every legal regrouping preserves quantity and its inverse restores all blocks', () => {
  for (const mode of ['whole', 'decimal']) for (const places of [2, 3, 4]) {
    const indexes = C.visible(mode, places);
    for (const i of indexes.slice(0, -1)) for (let n = 1; n <= 9; n++) {
      const counts = [0, 0, 0, 0]; counts[i] = n; counts[i+1] = 2;
      const scene = { counts, places, example: null, done: false };
      const split = C.exchange(scene, i, 'split', mode);
      assert.equal(C.total(split.counts), C.total(counts));
      assert.deepEqual(C.exchange(split, i+1, 'bundle', mode), scene);
      assert.deepEqual(scene.counts, counts);
    }
  }
});

test('decimal parsing and all representable decimal values round trip without rounding', () => {
  for (let units = 0; units <= 9999; units++) {
    const value = C.format(units, 'decimal');
    assert.equal(C.parse(value, 'decimal'), units);
    assert.equal(C.total(C.fromNumber(C.initial().scenes.decimal, value, 'decimal').counts), units);
  }
  for (const value of ['0.0001', '9.9999', '10', '-1', '1e-3', '', 'Infinity', 'NaN', '<svg>']) assert.throws(() => C.parse(value, 'decimal'));
  for (const value of ['1.5', '-1', '10000', '', '1e3']) assert.throws(() => C.parse(value, 'whole'));
});

test('examples need a real regroup before subtraction and give the exact result', () => {
  for (const [key, index, result] of [['whole-subtract', 2, '25'], ['decimal-subtract', 0, '0.7']]) {
    const scene = C.exampleScene(key), mode = C.EXAMPLES[key].mode;
    assert.throws(() => C.subtract(scene, mode));
    const regrouped = C.exchange(scene, index, 'split', mode);
    const answer = C.subtract(regrouped, mode);
    assert.equal(C.format(C.total(answer.counts), mode), result);
    assert.equal(answer.done, true);
    assert.throws(() => C.subtract(answer, mode));
  }
  for (const [key, index, result] of [['whole-add', 3, '35'], ['decimal-add', 1, '1.3']]) {
    const mode = C.EXAMPLES[key].mode, scene = C.exchange(C.exampleScene(key), index, 'bundle', mode);
    assert.equal(C.format(C.total(scene.counts), mode), result);
    assert.ok(scene.counts.every(n => n < 10));
  }
});

test('scope, count, highest place and smallest place limits never discard blocks', () => {
  const s = C.initial().scenes.whole;
  assert.throws(() => C.validateScene({ ...s, places: 2 }, 'whole'));
  const twoPlaces = { ...s, places: 2, counts: [0, 0, 2, 3] };
  assert.throws(() => C.exchange(twoPlaces, 2, 'bundle', 'whole'));
  assert.throws(() => C.exchange(twoPlaces, 3, 'split', 'whole'));
  assert.throws(() => C.fromNumber(twoPlaces, '100', 'whole'));
  const full = C.fromNumber(s, '9999', 'whole');
  assert.throws(() => C.add(full, 3, 1, 'whole'));
  assert.throws(() => C.exchange({ ...s, counts: [0, 0, 1, 25] }, 2, 'split', 'whole'));
  assert.throws(() => C.add({ ...s, counts: [0, 0, 0, 30] }, 3, 1, 'whole'));
  assert.throws(() => C.add({ ...s, counts: [0, 0, 0, 0] }, 3, -1, 'whole'));
  assert.deepEqual(s.counts, [0, 1, 2, 3]);
});

test('saved states are bounded and modes have independent scenes', () => {
  const state = C.initial(); assert.deepEqual(C.validate(state), state);
  state.scenes.whole = C.fromNumber(state.scenes.whole, '42', 'whole');
  assert.deepEqual(state.scenes.decimal.counts, [1, 2, 3, 0]);
  for (const delta of [{ counts: [1, 2, 3] }, { counts: [0, 0, 0, 1.1] }, { counts: [0, 0, 0, 31] }, { counts: [0, 0, 0, -1] }, { places: 5 }, { example: '__proto__' }, { example: 'decimal-add' }, { done: 'yes' }]) {
    assert.throws(() => C.validate({ ...state, scenes: { ...state.scenes, whole: { ...state.scenes.whole, ...delta } } }));
  }
  for (const delta of [{ mode: '__proto__' }, { version: 2 }, { showTotal: 'false' }]) assert.throws(() => C.validate({ ...state, ...delta }));
});
