const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
test('동명이군인 강원·경남 고성군은 각 도 안에 따로 표시된다', () => {
    const context = {window: {}};
    vm.runInNewContext(fs.readFileSync('learning/inquiry/korea-map/data/regions.js', 'utf8'), context);
    const points = context.window.KOREA_REGIONS.counties.filter(row => row[0] === '고성군');
    assert.equal(points.length, 2);
    assert.ok(points.some(([, lat, lng]) => lat > 38.2 && lat < 38.5 && lng > 128.2 && lng < 128.6));
    assert.ok(points.some(([, lat, lng]) => lat > 34.9 && lat < 35.2 && lng > 128.1 && lng < 128.5));
    assert.ok(!points.some(([, lat]) => lat > 36 && lat < 37), '두 군의 좌표 평균을 경북에 표시하면 안 된다');
});
