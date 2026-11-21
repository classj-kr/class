import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { SETS, POINTS } from '../learning/inquiry/blank-map/content.mjs';
import { AREA_PATHS, eligible, newSession, selectPoint, checkAnswer, nextQuestion, retryQuestions, validateSets } from '../learning/inquiry/blank-map/session.mjs';
import menuPaths from '../game-hub-server/home-content-paths.js';

test('all activities have valid map-dependent content and unique keys',()=>{
  assert.deepEqual(validateSets(SETS,POINTS),[]);
  for(const level of ['elementary','middle','high'])for(const area of ['korea','world'])assert.ok(eligible(SETS,level,area).length);
  assert.equal(eligible(SETS,'elementary','history').length,0);
  for(const p of Object.values(POINTS)){assert.ok(p[1]>=-180&&p[1]<=180);assert.ok(p[2]>=-90&&p[2]<=90);}
  for(const s of SETS)if(s.bounds)for(const q of s.questions)for(const id of q.points){const [,lon,lat]=POINTS[id];assert.ok(lat>=s.bounds[0][0]&&lat<=s.bounds[1][0]&&lon>=s.bounds[0][1]&&lon<=s.bounds[1][1],`${s.id}:${id} outside bounds`);}
});
test('each question accepts its keyed answer; incomplete responses do not count',()=>{
  for(const set of SETS){
    let state=newSession(set);
    assert.equal(checkAnswer(state).status,'incomplete');
    assert.equal(state.attempts,0);
    for(const q of set.questions){
      for(const id of q.answer)state=selectPoint(state,id);
      const checked=checkAnswer(state);assert.equal(checked.status,'correct',q.id);state=checked.state;
      assert.equal(checkAnswer(state).state.results.length,state.at+1,'no duplicate scoring');
      state=nextQuestion(state);
    }
    assert.equal(state.results.length,set.questions.length);assert.equal(retryQuestions(state).length,0);
  }
});
test('wrong responses stay on the question; retry queue preserves the first attempt',()=>{
  const set=SETS[0];let state=newSession(set),q=set.questions[0];
  state=selectPoint(state,q.points.find(id=>!q.answer.includes(id)));
  let checked=checkAnswer(state);assert.equal(checked.status,'wrong');state=checked.state;
  assert.equal(nextQuestion(state).at,0);assert.equal(state.solved,false);assert.equal(state.results.length,0);
  state=selectPoint(state,q.answer[0]);state=checkAnswer(state).state;
  assert.equal(state.results[0].firstTry,false);assert.equal(state.results[0].attempts,2);
  assert.deepEqual(retryQuestions(state),[q]);
  const retry=newSession(set,retryQuestions(state));assert.equal(retry.attempts,0);assert.deepEqual(retry.results,[]);
});
test('route tasks reject reversed sequences and ignore points not on the map',()=>{
  for(const set of SETS)for(const q of set.questions.filter(q=>q.mode==='order')){
    let state=newSession(set,[q]);
    assert.deepEqual(selectPoint(state,'not-a-place'),state);
    for(const id of [...q.answer].reverse())state=selectPoint(state,id);
    assert.equal(checkAnswer(state).status,'wrong',q.id);
    state=newSession(set,[q]);for(const id of q.answer)state=selectPoint(state,id);
    assert.equal(checkAnswer(state).status,'correct');
  }
});
test('map layers contain every required river and mountain',()=>{
  const data=JSON.parse(fs.readFileSync(new URL('../learning/inquiry/blank-map/map-data.json',import.meta.url)));
  const names=new Set(data.rivers.features.map(f=>f.properties.name));
  for(const name of ['황허강','장강','나일강','인더스강','티그리스강','유프라테스강','한강','낙동강','금강','영산강'])assert.ok(names.has(name),name);
  assert.equal(data.korea.features.length,2);assert.equal(data.mountains.features.length,4);
});
test('activities belong to their existing map menu and respect its content lock',()=>{
  const owners={korea:'/learning/inquiry/korea-map',world:'/learning/inquiry/globe',history:'/learning/inquiry/globe/history'};
  for(const [area,url] of Object.entries(AREA_PATHS)){
    assert.equal(menuPaths.homeMenuForRequest(url),owners[area]);
    assert.equal(menuPaths.isMenuDisabled(url,[owners[area]]),true);
    const html=fs.readFileSync(new URL('../'+url.slice(1)+'index.html',import.meta.url),'utf8');
    assert.ok(html.includes('/learning/inquiry/blank-map/app.mjs'));
  }
});
test('every activity has a traceable reviewed source',()=>{
  const audit=JSON.parse(fs.readFileSync(new URL('../docs/blank-map-review-2026-11-22.json',import.meta.url)));
  for(const set of SETS)assert.ok(audit.sources[set.source]?.path,`${set.id}: missing source`);
});
