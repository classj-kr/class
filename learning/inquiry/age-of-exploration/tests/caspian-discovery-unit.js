'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Terrain = require('../public/js/terrain.js');
const { createDiscoveryAccess } = require('../lib/discovery-access.js');
const project = path.resolve(__dirname, '..');
const buffer = fs.readFileSync(path.join(project, 'data/world/WORLD.CDS'));
const world = new Uint16Array(buffer.buffer, buffer.byteOffset, buffer.length / 2);
Terrain.setNaturalEarthLandMask(fs.readFileSync(path.join(project, 'data/world/NATURAL_EARTH_LAND_MASK.bin')));
const point = (lat, lon) => ({ x: (lon + 180) / 360 * Terrain.WORLD_PIXEL_W, y: (90 - lat) / 180 * Terrain.WORLD_PIXEL_H });
const caspian = require('../data/catalog/discoveries.json').find(item => item.id === 'caspian-sea');
const item = { ...caspian, ...point(caspian.lat, caspian.lon) };
const nearby = createDiscoveryAccess([item], (x, y) => Terrain.terrainAtCell(world, x, y), Terrain, 3.2);
const allowed = (lat, lon, mode = 'land', transition = null) => {
  const result = nearby({ ...point(lat, lon), mode, transition }, item);
  return result.canUse && result.distance <= Terrain.TILE * 3.2;
};
for (const [name, lat, lon] of [
  ['reported east shore', 40.90, 52.87], ['west shore near Baku', 40.4, 49.8],
  ['north shore', 46.3, 49.0], ['south shore', 37.0, 50.2]
]) assert.ok(allowed(lat, lon), name + ' must be inspectable on foot');
for (const [name, lat, lon] of [
  ['lake centre on foot', 41.5, 51], ['inland desert', 40.9, 57.0],
  ['Black Sea', 43, 35], ['Aral Sea', 45, 59]
]) assert.equal(allowed(lat, lon), false, name + ' must not discover Caspian');
assert.ok(allowed(41.5, 51, 'sea'), 'local boat can inspect lake');
assert.equal(allowed(40.9, 52.87, 'city'), false, 'city mode must not inspect from stale coordinates');
assert.equal(allowed(40.9, 52.87, 'land', {}), false, 'transition must finish first');
const hint = nearby({ ...point(40.9, 52.87), mode: 'land' }, item);
assert.ok(hint.markerPoint && hint.markerPoint.x !== item.x, 'marker follows the reachable shore');
assert.equal(Terrain.terrainAtPixel(world, item.x, item.y).type, 'sea', 'discovery must not turn lake into walkable land');

// An unrelated lake in the same bounding box must not count as this waterbody.
const synthetic = { WORLD_W: 40, WORLD_H: 20, TILE: 1, WORLD_PIXEL_W: 40, WORLD_PIXEL_H: 20 };
const pixels = new Set([10 * 40 + 10, 10 * 40 + 28]);
const tiny = { id: 'tiny', reach: 'any', x: 10.5, y: 10.5, discoveryArea: {
  type: 'waterbody', seed: [-4.5, -85.5], bounds: { west: -180, east: 179, south: -89, north: 89 }
}};
const access = createDiscoveryAccess([tiny], (x, y) => ({ type: pixels.has(y * 40 + x) ? 'sea' : 'plain' }), synthetic, 1);
assert.ok(access({ x: 28.5, y: 10.5, mode: 'sea' }, tiny).distance > 1, 'separate lake excluded');
console.log(JSON.stringify({ ok: true, shores: 4, rejectsRemoteAndInland: true, sharedMarker: true }));
