const test = require('node:test');
const assert = require('node:assert/strict');
const C = require('../learning/literacy-numeracy/math-tools/geoboard/core.js');
const points = values => values.map(([x, y]) => ({ x, y }));
test('square, concave polygon, half-unit triangle and line use correct area and Euclidean length', () => {
  const square = points([[1, 1], [3, 1], [3, 3], [1, 3]]);
  assert.deepEqual(C.metrics(square), { area: 4, length: 8, exact: true, closed: true });
  const concave = points([[0, 0], [3, 0], [3, 1], [1, 1], [1, 3], [0, 3]]);
  assert.equal(C.validPoints(concave, 5), true);
  assert.deepEqual(C.metrics(concave), { area: 5, length: 12, exact: true, closed: true });
  assert.equal(C.area([...concave].reverse()), 5);
  const triangle = C.metrics(points([[0, 0], [1, 0], [0, 1]]));
  assert.equal(triangle.area, .5); assert.equal(triangle.length, 2 + Math.sqrt(2)); assert.equal(triangle.exact, false);
  assert.deepEqual(C.metrics(points([[0, 0], [3, 4]])), { area: 0, length: 5, exact: true, closed: false });
});
test('crossed, overlapping, repeated, degenerate and off-board bands cannot be committed', () => {
  for (const values of [ [[0,0],[3,3],[3,0],[0,3]], [[0,0],[3,0],[1,0],[1,3]], [[0,0],[2,0],[2,2],[0,0]], [[0,0],[1,1],[2,2]], [[0,0],[5,0]], [[0,0],[1.5,1]] ]) assert.equal(C.validPoints(points(values), 5), false, JSON.stringify(values));
  assert.equal(C.validPoints(points([[0,0],[1,0],[3,0],[3,3],[0,3]]), 5), true);
  assert.equal(C.validPoints(points([[0,0],[3,0],[3,3],[1,0],[0,3]]), 5), false);
});
test('translation stops at board edges without distorting shapes and neighbor merge removes one vertex', () => {
  const square = points([[1,1],[3,1],[3,3],[1,3]]);
  const moved = C.move(square, 10, -10, 5);
  assert.deepEqual(moved, points([[2,0],[4,0],[4,2],[2,2]]));
  assert.deepEqual(C.metrics(moved), C.metrics(square));
  const triangle = C.moveVertex(square, 0, {x:3,y:1});
  assert.equal(triangle.length, 3); assert.equal(C.validPoints(triangle, 5), true);
  assert.equal(square.length, 4);
});
test('persisted boards round-trip independently and reject malformed stored geometry', () => {
  const state = C.initial();
  state.scenes[5].push({id:'b-1', color:C.COLORS[0], fill:true, points:points([[0,0],[4,0],[4,4]])});
  state.scenes[9].push({id:'b-2', color:C.COLORS[1], fill:false, points:points([[0,0],[8,8]])});
  assert.deepEqual(C.validate(state), state);
  const broken = C.copy(state); broken.scenes[9][0].id = 'b-1'; assert.throws(() => C.validate(broken));
  const invalid = C.copy(state); invalid.scenes[5][0].points[0].x = 6; assert.throws(() => C.validate(invalid));
  const tooMany = C.initial(); tooMany.scenes[5] = Array.from({length:25}, (_, i) => ({...state.scenes[5][0], id:`b-${i}`})); assert.throws(() => C.validate(tooMany));
});
