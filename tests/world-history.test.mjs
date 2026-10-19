import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {SCENES,FIGURES,ERAS} from '../learning/inquiry/globe/history/content.mjs';
import {figurePoint,figureCorners,createAttempt,answerAttempt,revealAttempt,shouldShowSolution,recordAttempt} from '../learning/inquiry/globe/history/session.mjs';
import {placeLabels} from '../learning/inquiry/globe/history/labels.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const sources=JSON.parse(fs.readFileSync(path.join(root,'docs/world-history-map-sources.json')));
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');

test('every topic and answer matches its textbook and atlas audit record',()=>{
 const audit=JSON.parse(fs.readFileSync(path.join(root,'docs/world-history-content-audit.json')));
 assert.equal(audit.topics.length,SCENES.length);
 for(const scene of SCENES){
  const row=audit.topics.find(t=>t.id===scene.id);assert.ok(row,scene.id);assert.equal(row.period,scene.date);assert.equal(row.quizPeriod,scene.quizDate);assert.ok(row.boundaryNote);
  assert.ok(row.textbookPages.length>=2);
  for(const ref of row.textbookPages){const source=audit.sources.find(s=>s.id===ref.source);assert.ok(source);assert.ok(ref.pdfPages.length);for(const p of ref.pdfPages)assert.ok(Number.isInteger(p)&&p>=1&&p<=source.pdfPages);}
  assert.equal(row.questions.length,scene.questions.length);
  for(const q of scene.questions){const record=row.questions.find(r=>r.id===q.id);assert.ok(record);assert.equal(record.answer,q.choices[q.answer]);assert.equal(record.rationale,q.explanation);assert.equal(record.figure,q.figure||scene.figure);assert.deepEqual(record.requiredMapEvidence,q.marks.map(([point,label])=>({label,sourcePlace:point})));}
 }
});

test('every study view, alternate era and question has an in-bounds source point',()=>{
 const ids=new Set(),qids=new Set(),used=new Set();
 const points=(id,keys)=>{const f=FIGURES[id];assert.ok(f,id);used.add(id);const [x0,y0,x1,y1]=f.crop;for(const key of keys){const p=f.points[key];assert.ok(p,`${id}: ${key}`);assert.ok(p[0]>=x0&&p[0]<=x1&&p[1]>=y0&&p[1]<=y1,`${id}: ${key} outside map`);}};
 for(const s of SCENES){assert.ok(!ids.has(s.id));ids.add(s.id);assert.ok(ERAS.some(e=>e.id===s.era));points(s.figure,s.places.map(p=>p.point));for(const step of s.steps||[])points(step.figure,(step.places||s.places).map(p=>p.point));
  for(const q of s.questions){assert.ok(!qids.has(q.id));qids.add(q.id);assert.equal(q.choices.length,5);assert.equal(new Set(q.choices).size,5);assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<5);assert.ok(q.hint&&q.explanation);assert.ok(q.marks.length>=2);assert.equal(new Set(q.marks.map(m=>m[1])).size,q.marks.length);points(q.figure||s.figure,q.marks.map(m=>m[0]));}
 }
 assert.equal(ids.size,36);assert.equal(qids.size,72);assert.equal(used.size,39);assert.deepEqual([...used].sort(),Object.keys(FIGURES).sort());
});
test('published WebP images are the exact audited lossless output',()=>{
 assert.equal(sources.length,39);
 for(const s of sources){const bytes=fs.readFileSync(path.join(root,`learning/inquiry/globe/history/figures/${s.id}.webp`));assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.toString('ascii',8,12),'WEBP');assert.equal(bytes.toString('ascii',12,16),'VP8L');assert.equal(hash(bytes),s.imageSha256,s.id);assert.equal(s.losslessDecodedEqual,true);assert.deepEqual(FIGURES[s.id].crop,s.crop);assert.ok(s.pixels[0]>=600&&s.pixels[1]>=600);}
 const names=fs.readdirSync(path.join(root,'learning/inquiry/globe/history/figures'));
 assert.deepEqual(names.sort(),sources.map(s=>s.id+'.webp').sort());
});
test('original atlas files remain unchanged when available locally',()=>{
 const checked=new Set();for(const s of sources){if(checked.has(s.source))continue;checked.add(s.source);const p=path.join(root,s.source);if(fs.existsSync(p))assert.equal(hash(fs.readFileSync(p)),s.sourceSha256,s.source);}
});
test('wrong answers never reveal the correct answer or count as first-time mastery',()=>{
 const q=SCENES[2].questions[0];const saved={};let a=createAttempt(q,()=>.25);
 assert.equal(shouldShowSolution(a),false);
 a=answerAttempt(a,q,1);assert.equal(a.solved,false);assert.equal(shouldShowSolution(a),false);
 assert.equal(answerAttempt(a,q,1),a);assert.equal(answerAttempt(a,q,-1),a);
 a=answerAttempt(a,q,q.answer);assert.equal(shouldShowSolution(a),true);assert.equal(a.firstCorrect,false);
 const persisted=recordAttempt(saved,a);assert.equal(persisted[q.id].mastered,false);assert.equal(persisted[q.id].attempts,1);
 const next=answerAttempt(createAttempt(q),q,q.answer);assert.equal(recordAttempt(persisted,next)[q.id].mastered,true);
});
test('explicit reveal counts as review and shuffled positions retain answer identity',()=>{
 for(const s of SCENES)for(const q of s.questions){const a=createAttempt(q,()=>0);assert.notEqual(a.choices[0].index,0);assert.equal(a.choices.find(c=>c.index===q.answer).text,q.choices[q.answer]);const r=revealAttempt(a);assert.equal(shouldShowSolution(r),true);assert.equal(recordAttempt({},r)[q.id].mastered,false);assert.equal(answerAttempt(r,q,q.answer),r);}
});
test('atlas layout preserves aspect ratio and does not reinterpret source coordinates',()=>{
 for(const f of Object.values(FIGURES)){const [x0,y0,x1,y1]=f.crop,c=figureCorners(f.crop);assert.equal(c[0][0],-50);assert.equal(c[1][0],50);assert.deepEqual(figurePoint(f.crop,[(x0+x1)/2,(y0+y1)/2]),[0,0]);const mercator=lat=>Math.log(Math.tan(Math.PI/4+lat*Math.PI/360))*180/Math.PI;assert.ok(Math.abs((mercator(c[0][1])-mercator(c[2][1]))/100-(y1-y0)/(x1-x0))<1e-8);}
});
test('close city labels separate without changing source anchors',()=>{
 const items=[{x:200,y:180,w:70,h:32},{x:209,y:195,w:70,h:32},{x:212,y:188,w:70,h:32}];const before=JSON.stringify(items),out=placeLabels(items,390,360,[{x:0,y:0,w:250,h:50}]);
 assert.equal(JSON.stringify(items),before);
 const r=out.map((p,i)=>({x:items[i].x+p.dx,y:items[i].y+p.dy,w:items[i].w,h:items[i].h}));
 for(let i=0;i<r.length;i++){assert.ok(r[i].x>=0&&r[i].x+r[i].w<=390);assert.ok(r[i].y>=0&&r[i].y+r[i].h<=360);for(let j=i+1;j<r.length;j++)assert.ok(r[i].x+r[i].w<=r[j].x||r[j].x+r[j].w<=r[i].x||r[i].y+r[i].h<=r[j].y||r[j].y+r[j].h<=r[i].y);}
});

test('a tall explanation card cannot cover a map label even when nearby positions are blocked',()=>{
 for(const [width,height,card] of [[1366,768,{x:1000,y:260,w:350,h:490}],[390,768,{x:90,y:280,w:290,h:476}]]){
  const items=[{x:width-120,y:height-120,w:78,h:32},{x:width-150,y:height-160,w:82,h:32}];
  const placed=placeLabels(items,width,height,[card]);
  placed.forEach((p,i)=>{const r={x:items[i].x+p.dx,y:items[i].y+p.dy,w:items[i].w,h:items[i].h};assert.ok(r.x+r.w<=card.x||r.x>=card.x+card.w||r.y+r.h<=card.y||r.y>=card.y+card.h);});
 }
});
