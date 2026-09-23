'use strict';
const assert=require('node:assert/strict');
const {createQuestions}=require('../lib/study-question-builder');
const bank=require('../lib/study-question-bank'),Catalog=require('../lib/mission-catalog');
const stories=require('../data/catalog/city-stories.json');
const pool=[...Catalog.DISCOVERIES,...Catalog.CITY_LANDMARKS,...Catalog.PLACES.filter(p=>p.isOriginalCity).map(p=>({...p,text:(stories.find(s=>s.cityId===p.id)?.sections||Catalog.ADDITIONAL_SETTLEMENTS.find(s=>s.id===p.id)?.story.sections||[]).map(s=>s.text).join(' ')}))];
const poison={id:'unrelated',name:'관련 없는 장소',text:'절대 섞이면 안 되는 딴 도시의 오답 문장입니다.'};
for(const item of pool){
  // No other place is needed to create questions: distractors share the answer's topic.
  const questions=createQuestions(item,[poison]);assert.equal(questions.length,3,item.name);
  for(const q of questions){
    assert.ok(item.text.includes(q.explanation),item.name+' has supporting reading');
    assert.notEqual(q.answer,item.name,'modal title cannot be the answer');
    assert.equal(q.choices.length,4);assert.equal(new Set(q.choices).size,4);
    assert.ok(q.choices.includes(q.answer));assert.ok(!JSON.stringify(q).includes('딴 도시'));
    if(q.prompt.includes('빈칸')){
      assert.ok(item.text.includes(q.answer),'cloze answer comes from reading');
      assert.ok(q.passage.includes('(          )'));assert.ok(!q.passage.includes(q.answer),item.name+' '+q.answer+' '+q.passage);
      assert.ok(!item.name.includes(q.answer),'part of title cannot reveal cloze answer');
    }
  }
}
for(const id of Object.keys(bank))assert.ok(pool.some(p=>p.id===id),'curated bank matches an existing place');
const short=createQuestions(pool.find(p=>p.id==='original_city_188'),[]);
assert.equal(short.length,3);assert.ok(short.every(q=>q.answer!=='팔레르모'),'short readings still ask about content');
const milford=createQuestions(pool.find(p=>p.id==='milford-sound'),[]);
assert.ok(milford.some(q=>q.answer.includes('빙하')));assert.ok(milford.some(q=>q.answer==='비가 올 때'));
assert.ok(!milford.some(q=>q.choices.some(choice=>/영녕사|대구 건조/.test(choice))));
const fictional={id:'test',name:'검사 지형',text:'인도네시아에 있는 현무암 절벽입니다. 빙하가 아니라 강물이 골짜기를 깎았습니다. 분지는 화산재가 쌓여 생겼습니다.'};
assert.ok(!createQuestions(fictional,[]).some(q=>q.answer==='인도'),'a country name cannot be split out of another name');
console.log(JSON.stringify({ok:true,readings:pool.length,curatedPlaces:Object.keys(bank).length,noUnrelatedSentenceFallback:true,noTitleAnswer:true}));
