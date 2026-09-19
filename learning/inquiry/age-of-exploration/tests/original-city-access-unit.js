'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const cities = require('../data/catalog/original-cities.json');
const worldBuffer = fs.readFileSync(path.join(__dirname, '..', 'data', 'world', 'WORLD.CDS'));
const world = new Uint16Array(worldBuffer.buffer, worldBuffer.byteOffset, worldBuffer.length / 2);
const W = 2500;
function isLand(x, y) { return ((world[y * W + x] >> 14) & 1) === 1; }
// 원작 225곳 + 2026-09-19 새로 넣은 1520년 도시 4곳(음반자콩고·베냉시티·하라르·센나르, 모두 내륙).
assert.equal(cities.length, 229);
assert.equal(cities.filter((c) => c.addedCity).length, 4);
assert.equal(cities.filter((c) => c.canEnterFromSea).length, 134);
assert.equal(cities.filter((c) => !c.canEnterFromSea).length, 95);
for (const city of cities) {
  assert.ok(city.originalMarkerCells.length > 0, `${city.name}: marker missing`);
  assert.ok(city.originalLandEntryCells.length > 0, `${city.name}: land entry missing`);
  assert.equal(city.canEnterFromSea, city.originalSeaEntryCells.length > 0, `${city.name}: sea flag mismatch`);
  assert.equal(city.access, city.canEnterFromSea ? 'port' : 'land', `${city.name}: access mismatch`);
  for (const [x, y] of city.originalSeaEntryCells) assert.equal(isLand(x, y), false, `${city.name}: sea entry is land`);
  for (const [x, y] of city.originalLandEntryCells) assert.equal(isLand(x, y), true, `${city.name}: land entry is sea`);
}
const byName = new Map(cities.map((c) => [c.name, c]));
assert.equal(byName.get('서울').canEnterFromSea, true);
assert.equal(byName.get('베이징').canEnterFromSea, false);
assert.equal(byName.get('카이로').canEnterFromSea, false);
assert.equal(byName.get('리스본').canEnterFromSea, true);
assert.equal(byName.get('런던').canEnterFromSea, true);
assert.equal(byName.get('포토시').canEnterFromSea, false);
console.log(JSON.stringify({ok:true,cities:229,seaAccessible:134,landOnly:95,seoul:'sea+land',beijing:'land-only'}));
