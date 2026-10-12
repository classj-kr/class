import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {WORLD_LESSONS} from '../learning/inquiry/globe/curriculum.mjs';
import {WORLD_EXAM} from '../learning/inquiry/globe/world-exam.mjs';
import {CLIMATE_MODELS,WORLD_ADDITIONS} from '../learning/inquiry/globe/world-study.mjs';
import {climateFigure,mapFigure,diagramFigure} from '../learning/inquiry/globe/study-figures.mjs';
const context={window:{}};vm.createContext(context);
vm.runInContext(fs.readFileSync('learning/inquiry/curriculum/map-advanced.js','utf8'),context);
vm.runInContext(fs.readFileSync('learning/inquiry/curriculum/map-content.js','utf8'),context);
test('Every high-school world lesson has valid questions; no missing new lesson or duplicate record ID',()=>{
 const ids=new Set();
 for(const l of WORLD_LESSONS){
  const qs=WORLD_EXAM[l.id]||context.window.MapAdvanced.pool('world',l.id);
  assert(qs.length>=2,l.id);
  for(const q of qs){assert(!ids.has(q.id),q.id);ids.add(q.id);assert.equal(q.lesson,l.id);assert(q.answer>=0&&q.answer<q.options.length);assert.equal(new Set(q.options).size,q.options.length);assert(q.explanation.length>30);}
 }
 assert.equal(WORLD_LESSONS.length,35);assert.equal(ids.size,70);
});
test('New exam units stay out of elementary and middle curricula',()=>{
 for(const l of WORLD_ADDITIONS){assert.equal(l.level,'high');assert.equal(context.window.SchoolMaps.available('world',l.id,'elementary'),false);}
 for(const id of ['landforms','climate-graph','food-trade']){const base=WORLD_LESSONS.find(l=>l.id===id);assert(base.highStudy);assert(!base.sections);}
});
test('All question evidence is renderable and geographically valid',()=>{
 let maps=0;
 for(const q of Object.values(WORLD_EXAM).flat()){
  assert(q.stimulus.points?.length||q.stimulus.climates?.length||q.stimulus.diagram||q.table,q.id);
  if(q.stimulus.points){maps++;const bounds=q.stimulus.bounds||[-180,-60,180,85];for(const [name,lng,lat] of q.stimulus.points){assert(name);assert(lng>=bounds[0]&&lng<=bounds[2],q.id);assert(lat>=bounds[1]&&lat<=bounds[3],q.id);}assert(mapFigure(q.stimulus.points,bounds).includes('<path'));}
  for(const [id,label] of q.stimulus.climates||[])assert(climateFigure(id,label).includes(label));
  if(q.stimulus.diagram)assert(diagramFigure(q.stimulus.diagram));
 }
 assert(maps>=20);
});
test('Graph arithmetic, hemispheres and climate limits agree with the answers',()=>{
 for(const d of Object.values(CLIMATE_MODELS)){assert.equal(d.t.length,12);assert.equal(d.p.length,12);assert(d.p.every(v=>v>=0&&v<=500));assert(d.t.every(v=>v>=-30&&v<=40));}
 const d=CLIMATE_MODELS.mediterranean;
 assert.equal(d.p.slice(5,8).reduce((a,b)=>a+b),30);assert.equal(Math.max(...d.t)-Math.min(...d.t),17);
 assert(Math.min(...CLIMATE_MODELS.rainforest.t)>=18);assert(CLIMATE_MODELS.rainforest.p.every(p=>p>=60));
 assert(Math.max(...CLIMATE_MODELS.tundra.t)>0&&Math.max(...CLIMATE_MODELS.tundra.t)<10);
 const s=CLIMATE_MODELS.savanna;assert(s.p[0]+s.p[1]+s.p[11]>s.p[5]+s.p[6]+s.p[7]);
});
test('Study photo references resolve to WebP assets',()=>{
 const info=JSON.parse(fs.readFileSync('learning/inquiry/globe/data/info.json','utf8'));
 for(const l of WORLD_ADDITIONS)for(const s of l.spots.filter(s=>s.photo)){
  const p=info[s.photo].photo;assert(p.src.endsWith('.webp'));assert(fs.existsSync('learning/inquiry/globe/'+p.src),s.photo);assert(p.license);assert(p.author);
 }
});
