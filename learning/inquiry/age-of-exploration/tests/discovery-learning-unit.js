'use strict';
const assert=require('node:assert/strict');
const Catalog=require('../lib/mission-catalog'),Learning=require('../lib/discovery-learning');
const Study=require('../lib/place-study'),bank=require('../lib/study-question-bank');
const Picker=require('../public/js/study-catalog');
const all=[...Catalog.DISCOVERIES,...Catalog.CITY_LANDMARKS];
assert.equal(all.length,346);
assert.deepEqual(Object.keys(Learning.data.entries).sort(),all.map(p=>p.id).sort(),'every reviewed place has a classification');
const unique=all.filter(p=>!p.learning.alias),recommended=unique.filter(p=>p.learning.recommended);
assert.equal(unique.length,344);assert.equal(recommended.length,133);
assert.equal(unique.filter(p=>p.learning.counted).length,259);
assert.equal(Learning.collectionTotal(all),259);
assert.equal(unique.filter(p=>p.learning.tier==='later').length,5);
for(const p of unique.filter(p=>p.learning.tier==='later'))assert.equal(bank[p.id]?.length,3,'later culture also uses comprehension questions');
assert.equal(Learning.canonicalKey('landmark:lm-giza-from-cairo:extra'),'landmark:lm-giza-from-cairo:extra','invalid keys are not silently repaired');
for(const p of all){
  const l=p.learning;assert.ok(l.objective&&l.standards.length&&l.levels.length,p.id);
  assert.ok(l.levels.every(v=>['elementary','middle','high'].includes(v)),p.id);
  assert.equal(l.counted,['core','support'].includes(l.tier),p.id);
}
for(const p of recommended){
  assert.equal(bank[p.id]?.length,3,p.id+' has three reviewed questions');
  const text=[p.text,'1520년에는 '+p.in1520].join('\n\n');
  const questions=Study.createQuestions({...p,text},[]);
  assert.ok(questions.every(q=>q.prompt==='읽은 설명에 맞는 것은?'),p.id+' uses reviewed comprehension questions');
  assert.ok(questions.every(q=>!/^\d/.test(q.answer)),p.id+' does not ask for a bare quantity');
}
for(const [alias,id] of [['lm-giza-from-cairo','giza-pyramids'],['lm-halong-from-haiphong','halong-bay']]){
  const old=[alias,id,'taj-mahal-later','stonehenge'],snapshot=[...old];
  assert.equal(Learning.canonicalKey('landmark:'+alias),'discovery:'+id);
  assert.equal(Learning.hasFound([alias],id),true);
  assert.equal(Learning.hasFound([id],alias),true);
  assert.equal(Learning.foundCount(old),2);
  assert.deepEqual(Learning.uniqueIds(old),[id,'taj-mahal-later','stonehenge']);
  assert.deepEqual(old,snapshot,'legacy raw records remain intact');
}
const choices=Picker.choices(Catalog.publicCatalog());
assert.equal(choices.filter(p=>p.learning).length,344);
assert.equal(Picker.filter(choices,{kind:'discovery'}).length+Picker.filter(choices,{kind:'landmark'}).length,133);
assert.equal(Picker.filter(choices,{tier:'explore'}).filter(p=>p.learning).length,259);
assert.equal(Picker.filter(choices,{tier:'later'}).length,5);
assert.equal(Picker.filter(choices,{tier:'all'}).filter(p=>p.learning).length,344);
assert.ok(Picker.filter(choices,{level:'elementary'}).every(p=>p.learning?.levels.includes('elementary')));
assert.ok(Picker.filter(choices,{tier:'all',topic:'교류'}).every(p=>p.learning?.topic==='교류'));
assert.ok(Picker.filter(choices,{query:'스톤헨지'}).some(p=>p.key==='discovery:stonehenge'),'valuable material stays recommended outside the core curriculum');
assert.equal(Picker.filter(choices,{query:'베르사유'}).length,0,'later material requires a deliberate choice');
assert.equal(Picker.filter(choices,{tier:'later',query:'베르사유'}).length,1);
// Updating the bank invalidates a pending question, while earned answers and completion survive.
const id='giza-pyramids',aliasKey='landmark:lm-giza-from-cairo',source=all.find(p=>p.id===id);
const fresh={...source,key:aliasKey,type:'landmark',reading:{text:source.text,learning:source.learning},text:[source.text,source.in1520].join('\n')};
const mission={id:'old-mission',studyTargets:[{key:aliasKey,questions:[{answer:'만'}]}]};
const inProgress={places:{[aliasKey]:{phase:'quiz',streak:2,token:'old-token',order:[0,1,2,3],completedAt:null}}};
const completed={places:{[aliasKey]:{phase:'completed',streak:3,token:null,order:null,completedAt:12345}}};
const completedSnapshot=structuredClone(completed);
assert.equal(Study.refreshMission(mission,key=>{assert.equal(key,aliasKey);return fresh;},[],[inProgress,completed]),true);
assert.equal(mission.studyTargets[0].key,aliasKey,'saved progress keys do not change');
assert.equal(mission.studyTargets[0].questionsVersion,Study.QUESTIONS_VERSION);
assert.equal(mission.studyTargets[0].questions.length,3);
assert.deepEqual(inProgress.places[aliasKey],{phase:'reading',streak:2,token:null,order:null,completedAt:null});
assert.deepEqual(completed,completedSnapshot);
assert.equal(Study.refreshMission(mission,()=>{throw Error('should not resolve twice');},[],[inProgress,completed]),false);
console.log(JSON.stringify({ok:true,reviewed:all.length,recommended:recommended.length,collection:259,legacyRecordsPreserved:true,questionsRefreshed:true}));
