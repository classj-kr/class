import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {WORLD_LESSONS,WORLD_QUESTIONS} from '../learning/inquiry/globe/curriculum.mjs';
test('Han animation data contains two connected upstream channels and one downstream channel',()=>{
 const c={window:{}};vm.runInNewContext(fs.readFileSync(new URL('../learning/inquiry/globe/data/globe-data.js',import.meta.url),'utf8'),c);
 const river=c.window.GLOBE_DATA.rivers.features.find(f=>f.properties.name==='한강');
 const [south,north,lower]=JSON.parse(JSON.stringify(river.geometry.coordinates));
 assert.equal(river.geometry.coordinates.length,3);
 assert.deepEqual(south.at(-1),north.at(-1));assert.deepEqual(north.at(-1),lower[0]);
 assert.ok(north[0][1]>38.5,'Bukhan reaches the northern headwater region');
 assert.ok(south[0][0]>128.8,'Existing southern headwater reach is retained');
 assert.ok(lower.at(-1)[0]<126.5,'Downstream flows west past Seoul');
 assert.ok(Math.abs(lower[0][0]-127.31)<.005&&Math.abs(lower[0][1]-37.525)<.005);
 for(const line of [south,north,lower])for(let i=1;i<line.length;i++)assert.ok(Math.hypot(line[i][0]-line[i-1][0],line[i][1]-line[i-1][1])<.3,'No long artificial connecting segment');
});
test('removed development-and-conservation card does not appear in world geography or its quizzes',()=>{
 assert.ok(!WORLD_LESSONS.some(l=>l.id==='terrain-conflict'));
 assert.ok(!WORLD_QUESTIONS.some(q=>q.lesson==='terrain-conflict'));
});
