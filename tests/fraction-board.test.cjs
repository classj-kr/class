const test = require('node:test');
const assert = require('node:assert/strict');
const C = require('../learning/inquiry/math/fraction-board/core.js');

test('equivalent fractions preserve exact quantities, including improper fractions', () => {
  let card = C.makeCard('a', 'bar', 1, 2);
  for (const d of [4, 8, 24, 2]) {
    card = C.setDenominator(card, d, true);
    assert.equal(C.count(card) / card.denominator, .5);
  }
  card = C.setFraction(card, 7, 4);
  assert.equal(card.units, 2);
  assert.equal(C.mixed(card), '1과 3/4');
  card = C.setDenominator(card, 8, true);
  assert.equal(C.count(card), 14);
  assert.equal(card.units, 2);
  assert.throws(() => C.setDenominator(card, 3, true), /온전한 칸/);
  assert.equal(C.count(card), 14);
});

test('scattered pieces toggle independently, while number lines mark a position from zero', () => {
  let card = C.makeCard('a', 'grid', 0, 8);
  card = C.paint(C.paint(card, 7), 2);
  assert.deepEqual(card.cells, [2, 7]);
  assert.deepEqual(C.paint(card, 2).cells, [7]);
  const line = C.changeShape(card, 'line');
  assert.deepEqual(line.cells, [0, 1]);
  assert.equal(C.count(C.paint(line, 8)), 8);
  assert.equal(C.count(C.paint(line, 0)), 0);
  assert.deepEqual(C.paint(card, 8), card);
});

test('shrinking cannot discard colored pieces and all input boundaries are enforced', () => {
  const card = C.makeCard('a', 'circle', 7, 4);
  assert.throws(() => C.setUnits(card, 1), /색칠한 부분/);
  assert.equal(C.setUnits({ ...card, cells: [0, 3] }, 1).units, 1);
  for (const d of [0, -1, 25, 2.5, NaN, Infinity]) assert.throws(() => C.setDenominator(card, d, false));
  for (const n of [-1, 97, .5, NaN, Infinity]) assert.throws(() => C.setFraction(card, n, 24));
  assert.equal(C.count(C.setFraction(card, 96, 24)), 96);
  assert.equal(C.rowsFor(12), 3);
  assert.equal(C.rowsFor(13), 1);
});

test('saved scenes validate bounds, IDs, colors and duplicate cells before rendering', () => {
  const valid = { version: 1, cards: [C.makeCard('a')], selectedId: 'a' };
  assert.deepEqual(C.validate(valid), valid);
  ['#287f71', '#d98343', '#5e78b4', '#ac5d7b', '#8068a8'].forEach((color, i) => {
    const restored = C.validate({ ...valid, cards: [{ ...valid.cards[0], color }] });
    assert.deepEqual(restored.cards[0], { ...valid.cards[0], color: C.COLORS[i] });
  });
  for (const delta of [{ id: '\"><img>' }, { denominator: 0 }, { units: 8 }, { rows: 3 }, { cells: [0, 0] }, { cells: [-1] }, { color: 'url(x)' }, { labels: 'false' }]) {
    assert.throws(() => C.validate({ ...valid, cards: [{ ...valid.cards[0], ...delta }] }));
  }
  assert.throws(() => C.validate({ ...valid, cards: [valid.cards[0], valid.cards[0]] }));
  assert.throws(() => C.validate({ ...valid, cards: [] }));
});

test('circle edge cases render complete wholes and comparison units keep the same scale', () => {
  for (const d of [1, 2, 3, 24]) {
    const svg = C.drawing(C.makeCard('a', 'circle', d, d), 2);
    assert.equal((svg.match(/data-cell=/g) || []).length, d);
    assert.doesNotMatch(svg, /NaN|Infinity/);
  }
  const a = C.drawing(C.makeCard('a', 'bar', 1, 2), 2);
  const b = C.drawing(C.makeCard('b', 'bar', 7, 4), 2);
  assert.equal(a.match(/viewBox="([^"]+)"/)[1], b.match(/viewBox="([^"]+)"/)[1]);
});

test('export follows visibility and transparent background without interactive UI', () => {
  const card = { ...C.makeCard('a', 'grid'), labels: false, shading: false, lines: false };
  const svg = C.exportSVG([card]);
  assert.doesNotMatch(svg, /<text|data-cell|tabindex|fill="#ffffff"/);
  assert.ok(!svg.includes(`fill="${card.color}"`));
  assert.match(C.exportSVG([card], false), /fill="#ffffff"/);
  assert.match(C.exportSVG([card]), /width="1600" height="402"/);
});
