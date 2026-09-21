import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {GROUPS,LESSONS,QUESTIONS,LEVELS,SOURCES} from '../learning/inquiry/globe/curriculum.mjs';
import {decodeClimate,CLIMATE_COLORS} from '../learning/inquiry/globe/atlas-layers.mjs';
import {readProgress,updateProgress} from '../learning/inquiry/globe/atlas-study.mjs';
const root=new URL('../',import.meta.url),read=p=>fs.readFileSync(new URL(p,root),'utf8');
const data=p=>JSON.parse(read('learning/inquiry/globe/data/'+p));
test('32 lessons are scoped, linked to existing standards and attached to real map locations',()=>{
  const standards=['07-social-studies','09-science'].map(n=>read('references/moe/2022-revised-curriculum/extracted/'+n+'.txt')).join('\n');
  assert.equal(GROUPS.length,8);assert.equal(LESSONS.length,32);assert.equal(new Set(LESSONS.map(l=>l.id)).size,32);
  const layers=new Set(['mountain','plateau','plain','basin','desert','river','lake','peninsula','island','other','peak','sea','current','wind','country','grid']);
  for(const g of GROUPS)assert.equal(LESSONS.filter(l=>l.group===g.id).length,4);
  for(const l of LESSONS){
    assert.ok(LEVELS[l.level]);assert.ok(l.core.length>=3&&typeof l.trap==='string'&&l.task);
    assert.ok(l.standards.length>0);for(const s of l.standards)assert.ok(standards.includes('['+s+']'),`${l.id}: ${s}`);
    for(const s of l.sources||[])assert.ok(SOURCES[s]);
    for(const id of l.layers)assert.ok(layers.has(id));
    for(const s of l.spots)assert.ok(s.name&&s.why&&Math.abs(s.at[0])<=180&&Math.abs(s.at[1])<=85);
  }
  assert.match(LESSONS.find(l=>l.id==='religion').trap,/비율/);
  assert.match(LESSONS.find(l=>l.id==='density').trap,/0인 지역과 구분/);
});
test('questions have unique stable ids, explanations and unambiguous option keys',()=>{
  assert.equal(new Set(QUESTIONS.map(q=>q.id)).size,QUESTIONS.length);
  for(const q of QUESTIONS){assert.ok(LESSONS.some(l=>l.id===q.lesson));assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4);assert.ok(q.explanation.length>12);}
  assert.ok(QUESTIONS.some(q=>q.visual==='climate'));assert.ok(QUESTIONS.some(q=>q.visual==='population'));
});
test('statistics keep missing data distinct from zero, with a fixed comparable year',()=>{
  const f=data('atlas-countries.json').features;
  assert.equal(f.length,177);assert.ok(f.some(f=>f.properties.density===null));
  for(const {properties:p} of f){assert.equal(p.year,2023);assert.ok(p.density===null||Number.isFinite(p.density)&&p.density>=0);assert.equal(p.pop,undefined);assert.equal(p.religion,undefined);}
  assert.ok(f.find(f=>f.properties.iso==='KR').properties.density>400);
  assert.ok(f.find(f=>f.properties.iso==='AU').properties.density<5);
});
test('climate raster is complete, sourced and correctly oriented at representative locations',()=>{
  const grid=data('atlas-climate.json'),cells=decodeClimate(grid);assert.equal(cells.length,3600*1800);assert.match(grid.source,/original 0.1 degree/);assert.equal(grid.sourceSha256.length,64);
  const at=(lng,lat)=>String.fromCharCode(cells[Math.floor((90-lat)/grid.step)*grid.width+Math.floor((lng+180)/grid.step)]);
  for(const [lng,lat,kind] of [[20,24,'B'],[100,60,'D'],[23,0,'A'],[15,42,'C'],[0,-80,'E']])assert.equal(at(lng,lat),kind,`${lng},${lat}`);
  for(const code of new Set(cells))assert.ok(code===95||CLIMATE_COLORS[String.fromCharCode(code)]);
});
test('USGS boundary pagination is complete and types are not inferred from missing labels',()=>{
  const features=data('atlas-plates.json').features;assert.equal(features.length,1175);
  const kinds=new Set(features.map(f=>f.properties.LABEL));assert.deepEqual([...kinds].sort(),['Convergent Boundary','Divergent Boundary','Other','Transform Boundary']);
  assert.ok(features.some(f=>f.properties.LABEL==='Other'));
});
test('progress tolerates blocked/corrupt storage and tracks retry results separately',()=>{
  assert.deepEqual(readProgress({getItem(){throw Error('blocked');}}),{});
  assert.deepEqual(readProgress({getItem:()=>'{not json'}),{});
  assert.deepEqual(readProgress({getItem:()=>'null'}),{});
  let p=updateProgress({},QUESTIONS[0].id,false);p=updateProgress(p,QUESTIONS[0].id,true);
  assert.deepEqual(p[QUESTIONS[0].id],{correct:1,wrong:1,lastCorrect:true});assert.equal(Object.keys(p).length,1);
});
test('old geography entry uses the shared app and the home menu has one atlas link',()=>{
  const old=read('learning/inquiry/world-geography/index.html');assert.match(old,/data-start-view="flat"/);assert.match(old,/\.\.\/globe\/app\.js/);assert.doesNotMatch(old,/leaflet|map-layers|climate-graph|src="data\.js/);
  const home=read('index.html');assert.match(home,/<strong>세계 지도<\/strong>/);assert.doesNotMatch(home,/href="learning\/inquiry\/world-geography\/"/);
  assert.match(read('learning/inquiry/globe/app.js'),/new URL\("\.", import\.meta\.url\)/);
});
