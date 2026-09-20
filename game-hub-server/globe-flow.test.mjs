import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { buildFlowModel, sampleTrack, flowFrame } from '../learning/inquiry/globe/flow-textures.mjs';

const context = { window: {} };
vm.runInNewContext(fs.readFileSync(new URL('../learning/inquiry/globe/data/globe-data.js', import.meta.url), 'utf8'), context);
const data = context.window.GLOBE_DATA;
const wind = buildFlowModel(data.winds, 'wind');
const current = buildFlowModel(data.currents, 'current');

test('rounded flow paths preserve endpoints and date-line splits', () => {
  for (const [source, model] of [[data.winds, wind], [data.currents, current]]) {
    model.collection.features.forEach((feature, index) => {
      const original = source.features[index].geometry.coordinates;
      assert.equal(feature.geometry.coordinates.length, original.length);
      feature.geometry.coordinates.forEach((points, part) => {
        assert.deepEqual([...points[0]], [...original[part][0]]);
        assert.deepEqual([...points.at(-1)], [...original[part].at(-1)]);
        for (let i = 1; i < points.length; i++) assert.ok(Math.abs(points[i][0] - points[i - 1][0]) < 90);
      });
    });
  }
});

test('motion follows the teaching directions in both hemispheres', () => {
  const synthetic = (name, points) => buildFlowModel({type:'FeatureCollection',features:[{
    type:'Feature',properties:{name,tier:1,season:'always'},geometry:{type:'MultiLineString',coordinates:[points]},
  }]}, 'wind').tracks[0];
  for (const [name, points, lngSign, latSign] of [
    ['북동 무역풍', [[-20,25],[-40,10]], -1,-1],
    ['남동 무역풍', [[-20,-25],[-40,-10]], -1,1],
    ['북반구 편서풍', [[-40,35],[-20,55]], 1,1],
  ]) {
    const track=synthetic(name, points);
    const a=sampleTrack(track,.2), b=sampleTrack(track,.3);
    assert.equal(Math.sign(b.coordinates[0]-a.coordinates[0]),lngSign);
    assert.equal(Math.sign(b.coordinates[1]-a.coordinates[1]),latSign);
    assert.equal(Math.sign(Math.sin(a.bearing*Math.PI/180)),lngSign);
    assert.equal(Math.sign(Math.cos(a.bearing*Math.PI/180)),latSign);
  }
});

test('every animation frame stays drawable, bounded and repeatable', () => {
  const tracks=[...wind.tracks,...current.tracks];
  let count;
  for (const seconds of [0, .05, 10, 3600]) {
    const frame=flowFrame(tracks,seconds);
    count ??= frame.features.length;
    assert.equal(frame.features.length,count);
    assert.ok(count < 700);
    assert.equal(new Set(frame.features.map(f=>f.id)).size,count);
    for(const f of frame.features) {
      const [lng,lat]=f.geometry.coordinates;
      assert.ok(Number.isFinite(lng)&&Number.isFinite(lat)&&Math.abs(lng)<=180&&Math.abs(lat)<=85);
      assert.ok(Number.isFinite(f.properties.bearing));
      assert.ok(f.properties.opacity>=.2&&f.properties.opacity<=.92);
      assert.ok(f.properties.name);
    }
  }
  assert.deepEqual(flowFrame(tracks,12),flowFrame(tracks,12), 'paused frames must be stable');
  assert.notDeepEqual(flowFrame(tracks,12),flowFrame(tracks,12.1), 'all enabled tracks must advance');
  assert.deepEqual(flowFrame([],0).features,[]);
});
