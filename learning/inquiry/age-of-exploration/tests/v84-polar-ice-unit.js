'use strict';
// 얼음 바다: 1520년의 나무배는 북극·남극 바다를 지나지 못했다.
// 북극을 가로지르는 지름길(북동·북서 항로)이 막히고, 실제로 다니던 바닷길은 열려 있어야 한다.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Terrain = require('../public/js/terrain.js');
const NavGrid = require('../lib/nav-grid.js');

const root = path.join(__dirname, '..');
const worldBuffer = fs.readFileSync(path.join(root, 'data', 'world', 'WORLD.CDS'));
const world = new Uint16Array(worldBuffer.buffer, worldBuffer.byteOffset, worldBuffer.length / 2);
const maskBuffer = fs.readFileSync(path.join(root, 'data', 'world', 'NATURAL_EARTH_LAND_MASK.bin'));
Terrain.setNaturalEarthLandMask(new Uint8Array(maskBuffer.buffer, maskBuffer.byteOffset, maskBuffer.length));

const cellOf = (lat, lon) => [Math.floor((lon + 180) / 360 * Terrain.WORLD_W), Math.floor((90 - lat) / 180 * Terrain.WORLD_H)];
const typeAt = (lat, lon) => Terrain.terrainAtCell(world, ...cellOf(lat, lon)).type;

// 얼음이어야 하는 곳
for (const [name, lat, lon] of [['바렌츠해 북쪽', 76, 40], ['척치해', 71.5, -165], ['보퍼트해', 71, -140], ['랍테프해', 76, 125], ['배핀만 북쪽', 74, -65], ['웨들해', -70, -40], ['북극점 둘레', 88, 0]]) {
  assert.equal(typeAt(lat, lon), 'ice', `${name}은 얼음 바다여야 함`);
}
// 열려 있어야 하는 곳(발견 지점·항로)
for (const [name, lat, lon] of [['노르카프 앞바다', 71.3, 25.8], ['로포텐 앞바다', 68.2, 12.5], ['베링 해협', 65.8, -169], ['드레이크 해협', -58, -65], ['혼곶 앞바다', -56.3, -67.3], ['덴마크 해협', 66, -26], ['백해', 65.5, 36]]) {
  assert.equal(typeAt(lat, lon), 'sea', `${name}은 배가 지나야 함`);
}
const ice = Terrain.terrainAtCell(world, ...cellOf(80, 0));
assert.equal(ice.passable, false, '얼음은 지나갈 수 없음');

const grid = NavGrid.buildNavGrid((cx, cy) => Terrain.terrainAtCell(world, cx, cy).type, Terrain.WORLD_W, Terrain.WORLD_H);
const route = (a, b) => {
  const cell = ([cx, cy]) => NavGrid.nearestPassable(grid, 'sea', cx, cy, 24, false);
  return NavGrid.findPath(grid, 'sea', cell(cellOf(...a)), cell(cellOf(...b)), false);
};
// 바렌츠해에서 베링 해협까지: 북동 항로가 막혔으면 아프리카·인도양·태평양을 돌아가야 한다.
const northeast = route([71, 40], [64, -172]);
assert.ok(northeast, '돌아가는 길은 있어야 함');
const maxLat = Math.max(...northeast.map((index) => 90 - (Math.floor(index / grid.width) + 0.5) / Terrain.WORLD_H * 180));
assert.ok(maxLat < 74.1, `북동 항로로 빠짐(가장 북쪽 ${maxLat.toFixed(1)}도)`);
const minLat = Math.min(...northeast.map((index) => 90 - (Math.floor(index / grid.width) + 0.5) / Terrain.WORLD_H * 180));
assert.ok(minLat < 0, '적도 남쪽으로 돌아가야 함');
// 허드슨만에서 알래스카 북쪽까지: 북서 항로도 막힌다.
const northwest = route([60, -85], [70.5, -150]);
assert.ok(!northwest || Math.min(...northwest.map((index) => 90 - (Math.floor(index / grid.width) + 0.5) / Terrain.WORLD_H * 180)) < 20, '북서 항로로 빠짐');

const server = fs.readFileSync(path.join(root, 'server.js'), 'utf8');
assert.match(server, /blockedTerrain\?\.type === 'ice'/, '얼음에 막히면 알려야 함');
assert.match(server, /function warnNearIce/, '얼음 앞에서 미리 알려야 함');
const page = fs.readFileSync(path.join(root, 'public', 'index.html'), 'utf8');
assert.match(page, /function drawIceLayer/, '학생 지도에 얼음을 그려야 함');
assert.match(page, /terrain\.js\?v=76/, '지형 파일 버전을 올려야 함');

console.log(`v84 polar ice unit ok · 북동 항로 우회 최북 ${maxLat.toFixed(1)}° · 최남 ${minLat.toFixed(1)}°`);
