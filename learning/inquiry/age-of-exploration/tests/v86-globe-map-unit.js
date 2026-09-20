'use strict';
// 지도를 지구본으로 바꾼 뒤에도 땅 크기가 위도에 따라 달라지면 안 된다.
// 평면 지도에서는 북위 64.5도 아이슬란드가 북위 37.5도 한국보다 1.84배 크게 그려졌다.
// 실제 넓이는 10만 3천과 10만 제곱킬로미터로 거의 같다.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Terrain = require('../public/js/terrain.js');

const TILE_SIZE = 512;
// 지도 라이브러리가 그리는 크기: 배율 z에서 경도 1도가 몇 픽셀인가(위도와 상관없이 같다).
const pixelsPerLonDegree = (zoom) => TILE_SIZE * Math.pow(2, zoom) / 360;
// 경도 1도의 실제 거리(킬로미터)는 위도가 높을수록 짧다.
const kmPerLonDegree = (lat) => 111.32 * Math.cos(lat * Math.PI / 180);
const kmPerPixel = (gameZoom, lat) => kmPerLonDegree(lat) / pixelsPerLonDegree(Terrain.globeMapZoom(gameZoom, lat, TILE_SIZE));

// 화면 1픽셀이 어디서나 같은 거리여야 한다.
const equator = kmPerPixel(1, 0);
for (const [name, lat] of [['한국', 37.5], ['아이슬란드', 64.5], ['리스본', 38.7], ['희망봉', -34.4], ['북위 70도', 70]]) {
  const here = kmPerPixel(1, lat);
  assert.ok(Math.abs(here / equator - 1) < 0.01, `${name}의 1픽셀이 적도와 달라짐(${(here / equator).toFixed(3)}배)`);
}
// 평면 지도였다면 아이슬란드가 한국보다 1.8배 넘게 컸다는 것도 함께 적어 둔다.
const flatRatio = Math.cos(37.5 * Math.PI / 180) / Math.cos(64.5 * Math.PI / 180);
assert.ok(flatRatio > 1.8, '평면 지도의 왜곡 값이 바뀌었는지 확인할 것');

// 배율을 두 배로 하면 1픽셀이 절반 거리여야 한다(지금 배율 범위를 그대로 쓴다).
assert.ok(Math.abs(kmPerPixel(2, 40) / kmPerPixel(1, 40) - 0.5) < 0.001, '배율이 두 배면 1픽셀은 절반 거리');
// 극점 가까이에서 배율이 무한히 커지지 않게 막아 둔다.
assert.ok(Number.isFinite(Terrain.globeMapZoom(1, 90, TILE_SIZE)), '북극에서도 배율이 정해져야 함');
assert.ok(Terrain.globeMapZoom(1, 89.9, TILE_SIZE) === Terrain.globeMapZoom(1, 90, TILE_SIZE), '극점 가까이는 같은 값으로 묶어야 함');

// 학생 화면이 지구본 지도를 쓰고 있는가.
const page = fs.readFileSync(path.join(__dirname, '..', 'public', 'index.html'), 'utf8');
assert.match(page, /projection:\{type:'globe'\}/, '지구본 도법으로 그려야 함');
assert.match(page, /learning\/inquiry\/globe\//, '지구본 앱의 지도 조각을 그대로 써야 함(저장소가 늘지 않는다)');
assert.match(page, /UW3Terrain\.globeMapZoom\(zoom,lat,512\)/, '위도에 맞춰 배율을 깎아야 함');
assert.match(page, /if\(globeReady\)return globeScreenPoint/, '배·도시도 지구본 자리에 그려야 함');
assert.match(page, /js\/terrain\.js\?v=81/, '지형 파일 버전을 올려야 함');
// 지구본 지도를 못 불러와도 게임은 돌아가야 한다.
assert.match(page, /if\(!globeReady\)drawNaturalEarthLayer/, '지구본을 못 쓰면 평면 지도로 그려야 함');

console.log(JSON.stringify({
  ok: true,
  적도1픽셀km: +equator.toFixed(3),
  아이슬란드1픽셀km: +kmPerPixel(1, 64.5).toFixed(3),
  한국1픽셀km: +kmPerPixel(1, 37.5).toFixed(3),
  평면지도였다면_아이슬란드배: +flatRatio.toFixed(2)
}));
