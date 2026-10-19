import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {SCENES} from '../learning/inquiry/globe/history/content.mjs';
import {PHOTOS,photosForScene,photosForPlace,photoPresentation} from '../learning/inquiry/globe/history/photo-learning.mjs';

const report=JSON.parse(fs.readFileSync(new URL('../docs/world-history-photo-sources.json',import.meta.url)));

test('every learning material has a verified image or exact source excerpt and real map bindings',()=>{
 assert.equal(PHOTOS.length,52);assert.equal(new Set(PHOTOS.map(p=>p.id)).size,52);
 for(const photo of PHOTOS){
  const record=report.find(r=>r.id===photo.id);assert.ok(record,photo.id);
  if(photo.type==='document'){
   assert.equal(record.exactNormalizedExcerptMatch,true);assert.deepEqual(photo.excerpts,record.excerpts);
   assert.ok(photo.excerpts.length);for(const quote of photo.excerpts)assert.ok(quote.text&&quote.attribution);
   assert.equal(photo.src,undefined);
  }else{
   const bytes=fs.readFileSync(new URL(`../learning/inquiry/globe/history/${photo.src}`,import.meta.url));
   assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.toString('ascii',8,12),'WEBP');
   assert.equal(createHash('sha256').update(bytes).digest('hex'),record.imageSha256);
   assert.deepEqual([photo.width,photo.height],record.pixels);assert.equal(record.losslessDecodedEqual,true);
  }
  assert.ok(photo.title&&photo.alt&&photo.observe&&photo.connection&&photo.credit&&photo.kind);
  for(const related of photo.compareWith||[])assert.ok(PHOTOS.some(p=>p.id===related)&&related!==photo.id);
  for(const [sceneId,points] of Object.entries(photo.bindings)){
   const scene=SCENES.find(s=>s.id===sceneId);assert.ok(scene,`${photo.id}: ${sceneId}`);
   const available=[...scene.places,...(scene.steps||[]).flatMap(s=>s.places||[])].map(p=>p.point);
   for(const point of points){assert.ok(available.includes(point),`${photo.id}: ${point}`);assert.ok(photosForPlace(sceneId,point).includes(photo));}
   assert.ok(photosForScene(sceneId).includes(photo));
  }
 }
 assert.deepEqual(photosForScene('unknown'),[]);assert.deepEqual(photosForPlace('india','unknown'),[]);
});

test('unsolved material questions hide identification and interpretation until explicitly revealed or solved',()=>{
 const questions=SCENES.flatMap(s=>s.questions).filter(q=>q.photo);assert.equal(questions.length,14);
 for(const question of questions){
  const photo=PHOTOS.find(p=>p.id===question.photo);assert.ok(photo);
  const hidden=photoPresentation(photo,true),revealed=photoPresentation(photo,false);
  assert.equal(hidden.title,'문제 자료');assert.ok(hidden.alt);
  assert.doesNotMatch(hidden.alt,/간다라|쿠샨|성 소피아|비잔티움|타지마할|무굴|유스티니아누스|샤자한/);
  for(const key of ['period','observe','connection','credit'])assert.equal(hidden[key],'');
  assert.equal(revealed.title,photo.title);assert.equal(revealed.connection,photo.connection);
 }
});

test('coverage records a learning purpose, atlas and supplemental source for every current scene',()=>{
 const coverage=JSON.parse(fs.readFileSync(new URL('../docs/world-history-material-coverage.json',import.meta.url)));
 assert.equal(coverage.topics.length,SCENES.length);
 for(const scene of SCENES){
  const row=coverage.topics.find(t=>t.id===scene.id);assert.ok(row,scene.id);
  assert.ok(row.learningPurpose&&row.atlasFigures.includes(scene.figure));
  assert.deepEqual(row.materialIds,photosForScene(scene.id).map(p=>p.id));
  assert.ok(row.materialIds.length,scene.id);
  assert.deepEqual(row.sourceQuestions,scene.questions.filter(q=>q.photo).map(q=>q.id));
 }
 assert.equal(PHOTOS.filter(p=>p.type==='document').length,6);
 assert.equal(PHOTOS.filter(p=>p.type!=='document').length,46);
 const names=fs.readdirSync(new URL('../learning/inquiry/globe/history/photos/',import.meta.url));
 assert.deepEqual(names.sort(),PHOTOS.filter(p=>p.src).map(p=>p.src.split('/').at(-1)).sort());
});
