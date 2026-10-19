'use strict';

const assert = require('node:assert/strict');
const Flight = require('../lib/ufo-motion.js');
const Geo = require('../public/js/geo-motion.js');
const { WORLD_PIXEL_W: W, WORLD_PIXEL_H: H, TILE } = require('../public/js/terrain.js');

for (const y of [TILE, H - TILE]) {
  const position = { x: W / 3, y };
  const beyond = Flight.advance(position, 0, y === TILE ? -1000 : 1000);
  assert.deepEqual(beyond, { ...position, moved: false }, 'polar edge must stop, not wrap or reflect');
  assert.equal(Flight.advance(position, 0, y === TILE ? 10 : -10).moved, true, 'can leave both edges');
  assert.equal(Flight.advance(position, 10, 0).y, y, 'can move along the polar edge');
  const target = { x: position.x + W / 2, y };
  let cursor = { ...position };
  for (let i = 0; i < 1000; i++) {
    const direction = Flight.direction(cursor, target);
    if (direction.distancePixels < .001) break;
    const step = Math.min(20, direction.distancePixels);
    const delta = Geo.localDeltaToMap(direction.x * step, direction.y * step, cursor.y, H);
    cursor = Flight.advance(cursor, delta.x, delta.y);
    assert.equal(cursor.y, y, 'opposite-longitude target must not route over the pole');
  }
  assert.ok(Flight.direction(cursor, target).distancePixels < .001, 'polar click must arrive');
}
assert.equal(Flight.advance({ x: W - 5, y: H / 2 }, 10, 0).x, 5, 'longitude still wraps at date line');
assert.equal(Flight.direction({ x: W - 5, y: H / 2 }, { x: 5, y: H / 2 }).x, 1);
const { globeMapZoom } = require('../public/js/terrain.js');
const polarScale = 2 ** globeMapZoom(1, 89.856, 512) / Math.cos(89.856 * Math.PI / 180);
assert.ok(Math.abs(polarScale - 2 ** globeMapZoom(1, 0, 512)) < 1e-8, 'polar camera must keep the same ground scale');
assert.equal(globeMapZoom(1, -89.856, 512), globeMapZoom(1, 89.856, 512));
console.log('UFO polar bounds, escape, date line and polar click arrival: passed');
