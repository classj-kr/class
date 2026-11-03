'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const Catalog=require('../lib/mission-catalog'),Learning=require('../lib/discovery-learning');
const Study=require('../lib/place-study'),Picker=require('../public/js/study-catalog');
const sites=require('../data/catalog/textbook-sites.json'),credits=require('../data/catalog/photo-credits.json');
const audit=require('../docs/textbook-level-audit-2026-11-02.json');
const all=[...Catalog.DISCOVERIES,...Catalog.CITY_LANDMARKS],byId=new Map(all.map(p=>[p.id,p]));
const choices=Picker.choices(Catalog.publicCatalog());
for(const {id} of audit.verifiedElementaryLevelOmissions){
  const p=byId.get(id);assert.ok(p.learning.levels.includes('elementary'),id);
  assert.ok(Picker.filter(choices,{tier:'all',level:'elementary'}).some(c=>c.key.endsWith(':'+id)),id+' appears in elementary all');
  assert.ok(Learning.data.entries[id].textbookEvidence[0].path,id+' has textbook evidence');
}
assert.deepEqual(Learning.learningFor('lm-giza-from-cairo').levels,Learning.learningFor('giza-pyramids').levels,'alias inherits the same grade coverage');
assert.ok(!Learning.learningFor('borobudur').levels.includes('elementary'),'a place override does not broaden an entire topic');
const added=[...sites.discoveries,...sites.cityLandmarks];
assert.equal(added.length,16);
assert.equal(new Set(all.map(p=>p.id)).size,all.length,'new sites preserve catalog uniqueness');
for(const p of added){
  assert.ok(byId.has(p.id));assert.equal(sites.questions[p.id].length,3);
  const q=Study.createQuestions({...p,text:p.text+'\n'+p.in1520},[]);
  assert.equal(q.length,3);assert.ok(q.every(q=>q.choices.length===4&&!q.answer.match(/^\d/)),p.id);
  assert.ok(p.sources[0].url.startsWith('https://'),p.id);
  const file=path.join(__dirname,'../public/assets/landmarks',p.id+'.webp');
  assert.equal(fs.readFileSync(file).toString('ascii',8,12),'WEBP');
  assert.match(credits[p.id].license,/^(CC BY|Public domain)/);
  assert.ok(credits[p.id].source&&credits[p.id].author&&credits[p.id].licenseUrl,p.id);
  if(Learning.learningFor(p.id).tier==='later'){
    assert.ok(parseInt(p.built)>1520,p.id);assert.equal(Learning.foundCount([p.id]),0);
    assert.ok(!Picker.filter(choices,{}).some(c=>c.key.endsWith(':'+p.id)),p.id+' excluded from default recommendations');
    assert.ok(Picker.filter(choices,{tier:'later'}).some(c=>c.key.endsWith(':'+p.id)),p.id+' deliberately selectable later');
  }
}
// Metadata-only changes preserve an issued question and every part of earned progress.
const key='discovery:giza-pyramids',p=byId.get('giza-pyramids');
const oldLearning={...p.learning,levels:['middle','high']};
const target={id:p.id,key,questionsVersion:Study.QUESTIONS_VERSION,reading:{text:p.text,learning:oldLearning},questions:[{answer:'saved'}]};
const mission={instructions:Study.INSTRUCTIONS,studyTargets:[target]};
const progress={status:'completed',finishRank:2,completedAt:12345,places:{[key]:{phase:'quiz',streak:2,token:'issued',order:[2,1,0,3]}}};
const before=structuredClone(progress),questions=target.questions;
assert.equal(Study.refreshMission(mission,()=>{throw Error('metadata must not refresh questions');},[],[progress]),false);
assert.equal(Study.refreshLearningMetadata(mission,()=>({reading:{learning:p.learning}})),true);
assert.equal(target.questions,questions);assert.deepEqual(progress,before);
assert.equal(Study.refreshLearningMetadata(mission,()=>({reading:{learning:p.learning}})),false);
// Only changed question sets retire an in-flight token. Streaks, completion and rank remain.
const revised=byId.get('longmen-grottoes'),revisedKey='discovery:'+revised.id;
mission.studyTargets.push({id:revised.id,key:revisedKey,questionsVersion:Study.QUESTIONS_VERSION});
progress.places[revisedKey]={phase:'quiz',streak:2,token:'old',order:[0,1,2,3]};
const done={status:'completed',finishRank:1,places:{[revisedKey]:{phase:'completed',streak:3,completedAt:42}}},doneBefore=structuredClone(done);
let calls=0;
assert.equal(Study.refreshMission(mission,k=>{calls++;assert.equal(k,revisedKey);return {...revised,key:k,text:revised.text+'\n'+revised.in1520};},[],[progress,done]),true);
assert.equal(calls,1);assert.deepEqual(progress.places[key],before.places[key]);
assert.deepEqual(progress.places[revisedKey],{phase:'reading',streak:2,token:null,order:null});
assert.deepEqual(done,doneBefore);assert.equal(progress.finishRank,before.finishRank);
assert.equal(mission.studyTargets[1].questionsVersion,Study.questionsVersionFor(revised));
assert.equal(Study.refreshMission(mission,()=>{throw Error('already current');},[],[progress,done]),false);
console.log(JSON.stringify({ok:true,elementaryOverrides:16,newSites:16,reviewedQuestions:66,laterDatesSafe:true,metadataKeepsIssuedQuiz:true,scopedQuestionMigration:true}));
