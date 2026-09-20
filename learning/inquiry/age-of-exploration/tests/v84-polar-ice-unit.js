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

// 한여름에도 얼어 있는 곳(지형에 박아 둔 얼음)
for (const [name, lat, lon] of [['랍테프해', 78, 125], ['타이미르반도 앞', 78, 100], ['척치해 북쪽', 72.5, -165], ['배핀만 북쪽', 74, -65], ['웨들해', -70, -40], ['북극점 둘레', 88, 0]]) {
  assert.equal(typeAt(lat, lon), 'ice', `${name}은 한여름에도 얼음이어야 함`);
}
// 여름이면 배가 갈 수 있는 곳(지형은 바다, 계절로만 막힌다)
for (const [name, lat, lon] of [['바렌츠해 76도', 76, 40], ['노르카프 앞바다', 71.3, 25.8], ['베링 해협', 65.8, -169], ['백해', 65.5, 36], ['드레이크 해협', -58, -65], ['혼곶 앞바다', -56.3, -67.3], ['덴마크 해협', 66, -26]]) {
  assert.equal(typeAt(lat, lon), 'sea', `${name}은 배가 지나야 함`);
}
const ice = Terrain.terrainAtCell(world, ...cellOf(82, 0));
assert.equal(ice.passable, false, '얼음은 지나갈 수 없음');
// 얼음 속도가 0이면 얼음에 닿은 배가 그 자리에 영영 갇힌다.
assert.ok(ice.multiplier > 0, '얼음 위에서도 빠져나올 속도는 있어야 함');

// 벽처럼 갑자기 멈추지 않고, 얼음 앞에서부터 천천히 느려진다.
const SUMMER_DAY = 256;
assert.equal(Terrain.iceSlowdownAt(25, 40, true, SUMMER_DAY), 1, '먼 바다에서는 느려지지 않아야 함');
const near = Terrain.iceSlowdownAt(25, Terrain.iceLimitNorthAt(25, SUMMER_DAY) - 2, true, SUMMER_DAY);
assert.ok(near > Terrain.ICE_SLOW.floor && near < 1, `얼음 2도 앞에서는 느려져야 함(${near.toFixed(2)})`);
assert.ok(Terrain.iceSlowdownAt(25, 89, true, SUMMER_DAY) >= Terrain.ICE_SLOW.floor, '얼음 안에서도 속도가 0이면 안 됨');
assert.ok(Terrain.iceSlowdownAt(25, Terrain.iceLimitNorthAt(25, SUMMER_DAY) - 1, true, SUMMER_DAY)
  < Terrain.iceSlowdownAt(25, Terrain.iceLimitNorthAt(25, SUMMER_DAY) - 4, true, SUMMER_DAY), '가까울수록 더 느려야 함');

// 계절: 한여름(9월 중순)에는 열리고 한겨울(3월 중순)에는 언다.
const SUMMER = 256;
const WINTER = 74;
const frozen = (lat, lon, day) => Terrain.isIceAtDay(lon, lat, true, day);
// 백해처럼 안쪽으로 파고든 만은 실제로 겨울에 얼지만, 위도 띠로 가르는 지금 방식으로는 담지 못한다.
for (const [name, lat, lon] of [['바렌츠해 76도', 76, 40], ['베링 해협', 65.8, -169]]) {
  assert.equal(frozen(lat, lon, SUMMER), false, `${name}은 한여름에는 열려야 함`);
  assert.equal(frozen(lat, lon, WINTER), true, `${name}은 한겨울에는 얼어야 함`);
}
for (const [name, lat, lon] of [['노르카프 앞바다', 71.3, 25.8], ['드레이크 해협', -58, -65], ['리스본 앞바다', 38.7, -9.5]]) {
  assert.equal(frozen(lat, lon, SUMMER), false, `${name}은 한여름에 열려 있어야 함`);
  assert.equal(frozen(lat, lon, WINTER), false, `${name}은 한겨울에도 열려 있어야 함`);
}
// 해류가 얼음 경계를 정한다. 위도 하나로 그으면 노르웨이 앞바다가 한겨울에 얼어붙는 잘못이 생긴다.
// 따뜻한 물이 올라오는 곳: 한겨울에도 열려 있어야 한다(함메르페스트는 얼지 않는 항구다).
for (const [name, lat, lon] of [['함메르페스트 앞바다', 70.7, 23.7], ['로포텐 앞바다', 71.5, 15.3], ['노르웨이해 74도', 74, 5]]) {
  assert.equal(frozen(lat, lon, WINTER), false, `${name}은 한겨울에도 얼지 않아야 함`);
}
// 찬 물이 얼음을 실어 내리는 곳: 같은 위도라도 한겨울에는 얼어야 한다.
for (const [name, lat, lon] of [['동그린란드 앞바다', 68, -25], ['래브라도 앞바다', 55, -55], ['배핀만 남쪽', 62, -60]]) {
  assert.equal(frozen(lat, lon, WINTER), true, `${name}은 한겨울에 얼어야 함`);
  assert.equal(frozen(lat, lon, SUMMER), false, `${name}은 한여름에는 열려야 함`);
}
// 같은 위도 71도인데 노르웨이 앞은 열리고 동그린란드 앞은 언다.
assert.ok(Terrain.iceLimitNorthAt(15, WINTER) - Terrain.iceLimitNorthAt(-25, WINTER) > 8, '해류에 따라 경계가 크게 달라야 함');

// 스발바르 앞바다는 한여름에만 갈 수 있다(바렌츠가 1596년에 여름에 80도까지 갔다).
assert.equal(frozen(79, 15, SUMMER), false, '스발바르 앞바다는 한여름에는 열려야 함');
assert.equal(frozen(79, 15, WINTER), true, '스발바르 앞바다는 한겨울에는 얼어야 함');
// 여름 경계가 겨울 경계보다 북쪽이어야 한다(봄가을은 그 사이).
for (const lon of [-160, -60, 0, 30, 90, 150]) {
  assert.ok(Terrain.iceLimitNorthAt(lon, SUMMER) > Terrain.iceLimitNorthAt(lon, WINTER) + 3, `경도 ${lon}: 여름이 겨울보다 많이 녹아야 함`);
  assert.ok(Terrain.iceLimitSouthAt(lon, 51) < Terrain.iceLimitSouthAt(lon, 263) - 3, `경도 ${lon}: 남극도 여름에 더 녹아야 함`);
}
assert.equal(Math.round(Terrain.dayOfYear(0)), 1, '1520년 1월 1일은 1일째');
assert.equal(Math.round(Terrain.dayOfYear(366 * 24 * 60)), 1, '한 해 뒤도 1일째(1520년은 윤년)');

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
assert.match(server, /function seasonalIceAt/, '계절 얼음을 서버가 막아야 함');
assert.match(server, /const trapped = p\.mode === 'sea'/, '얼음에 갇히면 빠져나갈 길을 열어야 함');
// 빠져나가는 규칙 자체는 lib/ship-motion.js에 있고 v85 시험이 본다.
assert.match(server, /ShipMotion\.canEnter\(/, '적도 쪽으로는 언제나 나아갈 수 있어야 함');
assert.match(server, /function iceSlowdownFor/, '얼음 앞에서 서서히 느려져야 함');
assert.match(server, /얼음 바다 - 항해가 어려움/, '얼음 안내는 짧게 표시해야 함');
assert.doesNotMatch(server, /1520년의 나무배로는 얼음을 뚫고|얼음이 녹는 여름을 기다리세요/, '긴 얼음 안내를 되살리면 안 됨');
const page = fs.readFileSync(path.join(root, 'public', 'index.html'), 'utf8');
assert.match(page, /function drawIceLayer/, '학생 지도에 얼음을 그려야 함');
assert.match(page, /isIceAtDay/, '학생 화면도 계절 얼음을 그려야 함');
assert.match(page, /terrain\.js\?v=81/, '지형 파일 버전을 올려야 함');

console.log(`v84 polar ice unit ok · 북동 항로 우회 최북 ${maxLat.toFixed(1)}° · 최남 ${minLat.toFixed(1)}°`);
