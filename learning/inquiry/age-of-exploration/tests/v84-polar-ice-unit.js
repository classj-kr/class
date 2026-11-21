'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Terrain = require('../public/js/terrain.js');
const ShipMotion = require('../lib/ship-motion.js');
const NavGrid = require('../lib/nav-grid.js');

const root = path.join(__dirname, '..');
const bytes = fs.readFileSync(path.join(root, 'data/world/WORLD.CDS'));
const world = new Uint16Array(bytes.buffer, bytes.byteOffset, bytes.length / 2);
const mask = fs.readFileSync(path.join(root, 'data/world/NATURAL_EARTH_LAND_MASK.bin'));
Terrain.setNaturalEarthLandMask(mask);
const cellOf = (lat, lon) => [Math.floor((lon + 180) / 360 * Terrain.WORLD_W), Math.floor((90 - lat) / 180 * Terrain.WORLD_H)];
const at = (lat, lon) => Terrain.terrainAtCell(world, ...cellOf(lat, lon));
const concentration = (lat, lon, day) => Terrain.seaIceConcentrationAt(lon, lat, day);
const WINTER = 74, SUMMER = 256;

// 해안에 유빙이 있어도 일반 항로는 열린다. 모든 계절의 지형과 충돌 판정을 함께 검사한다.
const openRoutes = [
  ['화면의 동그린란드 앞바다',66.04,-29.41], ['동해안 유빙',66,-33], ['누크 앞바다',64,-53],
  ['그린란드 남단',59,-45], ['덴마크 해협',66,-26], ['아이슬란드 서쪽',64.5,-25],
  ['노르카프 앞바다',71.3,25.8], ['베링 해협',65.8,-169], ['배핀만',72,-65],
  ['래브라도 앞바다',56,-58], ['랍테프해',78,125], ['드레이크 해협',-58,-65], ['웨들해',-68,-40]
];
for (const [name, lat, lon] of openRoutes) {
  assert.equal(at(lat, lon).type, 'sea', `${name}: navigable terrain`);
  for (const day of [1, 32, 60, 74, 105, 135, 166, 196, 227, 256, 288, 319, 350]) {
    const frozenAhead = Terrain.isIceAtDay(lon, lat, true, day);
    assert.equal(frozenAhead, false, `${name}: day ${day} must stay open`);
    assert.equal(ShipMotion.canEnter({mode:'sea',nextType:'sea',nextPassable:true,frozenAhead,trapped:false,hereLat:lat,nextLat:lat+.1}), true);
    assert.ok(Terrain.iceSlowdownAt(lon, lat, true, day) >= .72, `${name}: mild slowdown`);
  }
}
for (const [lat, lon] of [[86,0],[86,-160],[-79,-40]]) {
  assert.equal(at(lat, lon).type, 'ice', 'only the polar interior has permanent blocking sea ice');
  assert.equal(at(lat, lon).passable, false);
  for (const day of [WINTER,SUMMER]) assert.equal(Terrain.isIceAtDay(lon, lat, true, day), true);
}

// 같은 위도의 해안과 먼바다를 구별하고, 서해안의 열린 바다에 동해안 유빙이 번지지 않는다.
assert.ok(concentration(66,-33,105) > .5, 'April drift ice hugs the east coast');
assert.equal(concentration(66,-26,105), 0, 'Denmark Strait offshore remains clear');
assert.equal(concentration(64,-53,WINTER), 0, 'southwest Greenland remains clear in winter');
assert.equal(Terrain.iceSlowdownAt(-26,66,true,105), 1, 'no broad five-degree slowdown belt');
assert.ok(concentration(66,-33,SUMMER) < .05, 'southeast coastal ice retreats in summer');
for (const [lat,lon] of [[72,-65],[56,-58],[65.8,-169],[76,40]]) {
  assert.ok(concentration(lat,lon,WINTER) > concentration(lat,lon,SUMMER) + .4, 'northern seasonal ice melts');
}
assert.ok(concentration(-68,-40,256) > concentration(-68,-40,51) + .5, 'Antarctic seasons run opposite to Arctic seasons');
assert.equal(concentration(-58,-65,256), 0, 'Drake Passage remains outside the ice belt');
assert.equal(Terrain.iceSlowdownAt(25,40,true,WINTER), 1);
assert.ok(Terrain.iceSlowdownAt(-33,66,true,105) < 1, 'visible coastal ice gently slows the ship');
assert.equal(Terrain.dayOfYear(0), 1);
assert.equal(Terrain.dayOfYear(366*24*60), 1, 'leap year wraps correctly');
assert.equal(Terrain.seasonOpenness(51,263,51),1,'Antarctic ice reaches its minimum in February');
assert.equal(Terrain.seasonOpenness(263,263,51),0,'Antarctic ice reaches its maximum in September');

// 날짜 변경선에서 분포가 이어지고, 계절 변화가 하루 사이 크게 튀지 않는다.
for (const day of [1,WINTER,105,SUMMER,365]) {
  for (const lat of [60,70,80,-65,-75]) {
    assert.ok(Math.abs(concentration(lat,179.999,day)-concentration(lat,-179.999,day)) < .01);
  }
}
for (const lat of [50,60,66,75,85,-65,-75]) for (let lon=-180;lon<180;lon+=15) {
  for (let day=1;day<365;day+=7) {
    const value=concentration(lat,lon,day);
    assert.ok(Number.isFinite(value) && value>=0 && value<=1);
    assert.ok(Math.abs(value-concentration(lat,lon,day+1))<.08, 'daily melting/freezing stays smooth');
  }
}

const grid=NavGrid.buildNavGrid((cx,cy)=>Terrain.terrainAtCell(world,cx,cy).type,Terrain.WORLD_W,Terrain.WORLD_H);
const routeCell=([lat,lon])=>NavGrid.nearestPassable(grid,'sea',...cellOf(lat,lon),24,false);
const route=NavGrid.findPath(grid,'sea',routeCell([64.5,-25]),routeCell([64,-53]),false);
assert.ok(route?.length, 'Iceland to southwest Greenland has a route');
console.log(JSON.stringify({ok:true,openRoutes:openRoutes.length,allSeasons:true,coastalDrift:true,polarCore:true,greenlandRoute:route.length}));
