import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {SCENES} from '../learning/inquiry/globe/history/content.mjs';
import {PHOTOS,photosForScene,photosForPlace,photoPresentation} from '../learning/inquiry/globe/history/photo-learning.mjs';

const report=JSON.parse(fs.readFileSync(new URL('../docs/world-history-photo-sources.json',import.meta.url)));

test('every photo has an audited WebP and links to an actual scene or mapped place',()=>{
 assert.equal(PHOTOS.length,16);assert.equal(new Set(PHOTOS.map(p=>p.id)).size,16);
 for(const photo of PHOTOS){
  const record=report.find(r=>r.id===photo.id);assert.ok(record,photo.id);
  const bytes=fs.readFileSync(new URL(`../learning/inquiry/globe/history/${photo.src}`,import.meta.url));
  assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.toString('ascii',8,12),'WEBP');
  assert.equal(createHash('sha256').update(bytes).digest('hex'),record.imageSha256);
  assert.deepEqual([photo.width,photo.height],record.pixels);assert.equal(record.losslessDecodedEqual,true);
  assert.ok(photo.title&&photo.alt&&photo.observe&&photo.connection&&photo.credit);
  for(const [sceneId,points] of Object.entries(photo.bindings)){
   const scene=SCENES.find(s=>s.id===sceneId);assert.ok(scene,`${photo.id}: ${sceneId}`);
   const available=[...scene.places,...(scene.steps||[]).flatMap(s=>s.places||[])].map(p=>p.point);
   for(const point of points){assert.ok(available.includes(point),`${photo.id}: ${point}`);assert.ok(photosForPlace(sceneId,point).includes(photo));}
   assert.ok(photosForScene(sceneId).includes(photo));
  }
 }
 assert.deepEqual(photosForScene('unknown'),[]);assert.deepEqual(photosForPlace('india','unknown'),[]);
});

test('unsolved photo questions hide identification and interpretation until explicitly revealed or solved',()=>{
 const questions=SCENES.flatMap(s=>s.questions).filter(q=>q.photo);assert.equal(questions.length,3);
 for(const question of questions){
  const photo=PHOTOS.find(p=>p.id===question.photo);assert.ok(photo);
  const hidden=photoPresentation(photo,true),revealed=photoPresentation(photo,false);
  assert.equal(hidden.title,'문제 사진');assert.ok(hidden.alt);
  assert.doesNotMatch(hidden.alt,/간다라|쿠샨|성 소피아|비잔티움|타지마할|무굴|유스티니아누스|샤자한/);
  for(const key of ['period','observe','connection','credit'])assert.equal(hidden[key],'');
  assert.equal(revealed.title,photo.title);assert.equal(revealed.connection,photo.connection);
 }
});
