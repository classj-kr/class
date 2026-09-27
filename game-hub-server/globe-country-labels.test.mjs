import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { countryLabelPoint } from '../learning/inquiry/globe/tools/country-labels.mjs';

const root = new URL('../learning/inquiry/globe/', import.meta.url);
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(new URL('data/globe-data.js', root), 'utf8'), context);
const shapes = JSON.parse(fs.readFileSync(new URL('data/shapes.json', root), 'utf8'));
const countries = context.window.GLOBE_DATA.labels.features.filter(f => f.properties.kind === 'country');
// 생성기의 거리 함수를 재사용하지 않는 독립적인 영역 검사.
function inRing([x, y], ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const a = ring[i], b = ring[j];
    if ((a[1] > y) !== (b[1] > y) && x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]) inside = !inside;
  }
  return inside;
}
function contains(geometry, point) {
  const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
  return polygons.some(p => inRing(point, p[0]) && !p.slice(1).some(hole => inRing(point, hole)));
}
for (const f of countries) {
  const shape = shapes[f.properties.key], point = f.geometry.coordinates;
  assert.ok(shape, `${f.properties.name}: 도형 누락`);
  assert.ok(contains(shape, point), `${f.properties.name}: 이름표가 국토 밖에 있음 (${point})`);
  assert.deepEqual(countryLabelPoint(shape, point), point, `${f.properties.name}: 재생성 시 좌표가 달라짐`);
}
const vietnam = shapes['country:베트남'];
assert.equal(contains(vietnam, [106.3, 16.7]), false, '첨부 화면의 기존 베트남 좌표 오류를 재현');
assert.ok(contains(vietnam, countryLabelPoint(vietnam, [106.3, 16.7])));
const holed = {type:'Polygon', coordinates:[[[0,0],[10,0],[10,10],[0,10],[0,0]],[[4,4],[6,4],[6,6],[4,6],[4,4]]]};
assert.ok(contains(holed, countryLabelPoint(holed, [5,5])), '호수/구멍에 놓인 이름표도 육지로 이동');
const islands = {type:'MultiPolygon',coordinates:[[[[0,0],[2,0],[2,2],[0,2],[0,0]]],[[[8,0],[9,0],[9,1],[8,1],[8,0]]]]};
assert.ok(contains(islands, countryLabelPoint(islands,[5,1])), '섬 사이 바다에서 육지로 이동');
assert.ok(countryLabelPoint(islands, [7.9,0.5])[0] > 8, '군도의 기존 표시 지역 가까이에 유지');
console.log(`Country label placement passed: ${countries.length} country anchors inside their own geometry.`);
