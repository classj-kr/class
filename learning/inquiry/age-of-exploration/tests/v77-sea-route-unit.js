'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const Terrain = require('../public/js/terrain.js');
const NavGrid = require('../lib/nav-grid.js');

const root = path.join(__dirname, '..');
const worldBuffer = fs.readFileSync(path.join(root, 'data', 'world', 'WORLD.CDS'));
const world = new Uint16Array(worldBuffer.buffer, worldBuffer.byteOffset, worldBuffer.length / 2);
const maskBuffer = fs.readFileSync(path.join(root, 'data', 'world', 'NATURAL_EARTH_LAND_MASK.bin'));
Terrain.setNaturalEarthLandMask(new Uint8Array(maskBuffer.buffer, maskBuffer.byteOffset, maskBuffer.length));
const cities = JSON.parse(fs.readFileSync(path.join(root, 'data', 'catalog', 'original-cities.json'), 'utf8'));
const server = fs.readFileSync(path.join(root, 'server.js'), 'utf8');

const grid = NavGrid.buildNavGrid((cx, cy) => Terrain.terrainAtCell(world, cx, cy).type, Terrain.WORLD_W, Terrain.WORLD_H);
const TILE = Terrain.TILE;
const pixelOf = (name) => {
  const city = cities.find((c) => c.name === name);
  assert.ok(city, `${name} 도시를 찾지 못했다`);
  return { x: (city.cellX + 1) * TILE, y: (city.cellY + 1) * TILE };
};
const routeBetween = (from, to) => {
  const a = pixelOf(from);
  const b = pixelOf(to);
  const cell = (p, lenient) => NavGrid.nearestPassable(grid, 'sea', Math.floor(p.x / TILE / grid.block), Math.floor(p.y / TILE / grid.block), 24, lenient);
  return NavGrid.findPath(grid, 'sea', cell(a, false), cell(b, false), false)
    || NavGrid.findPath(grid, 'sea', cell(a, true), cell(b, true), true);
};

// 온전히 열린 물길
for (const [from, to] of [['리스본', '카디스'], ['베네치아', '알렉산드리아'], ['말라카', '광저우'], ['리스본', '멕시코시티']]) {
  assert.ok(routeBetween(from, to), `${from}→${to} 항로를 찾지 못했다`);
}
// 좁은 해협도 지날 수 있어야 한다
for (const [from, to] of [['세비야', '이스탄불'], ['런던', '스톡홀름'], ['이스탄불', '아조우']]) {
  assert.ok(routeBetween(from, to), `${from}→${to} 좁은 해협 항로를 찾지 못했다`);
}
const started = Date.now();
const longRoute = routeBetween('리스본', '서울');
const elapsed = Date.now() - started;
assert.ok(longRoute && longRoute.length > 200, '리스본→서울 먼 항로를 찾지 못했다');
assert.ok(elapsed < 2000, `먼 항로 찾기가 너무 느리다: ${elapsed}ms`);

// 육로도 같은 방식으로 찾는다
const landCell = (name) => {
  const p = pixelOf(name);
  return NavGrid.nearestPassable(grid, 'land', Math.floor(p.x / TILE / grid.block), Math.floor(p.y / TILE / grid.block), 24, true);
};
assert.ok(NavGrid.findPath(grid, 'land', landCell('서울'), landCell('베이징'), true), '서울→베이징 육로를 찾지 못했다');

assert.match(server, /function planRoute/);
assert.match(server, /navGridReady\(\)/);
assert.match(server, /p\.route = waypoints/);
console.log(JSON.stringify({ ok: true, grid: `${grid.width}x${grid.height}`, longRouteCells: longRoute.length, longRouteMs: elapsed }));
