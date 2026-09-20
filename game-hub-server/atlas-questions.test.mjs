import test from 'node:test';
import assert from 'node:assert/strict';
import {QUESTIONS,LESSONS} from '../learning/inquiry/globe/curriculum.mjs';
import {selectPracticeQuestions,questionDataHTML} from '../learning/inquiry/globe/question-session.mjs';
test('practice includes the unresolved subject scope, without a fixed question quota',()=>{
  const bank=QUESTIONS.filter(q=>q.lesson==='coordinates');
  assert.deepEqual(new Set(selectPracticeQuestions(bank,{}).map(q=>q.id)),new Set(bank.map(q=>q.id)));
  const p={[bank[0].id]:{lastCorrect:true},[bank[1].id]:{lastCorrect:false}};
  const pending=selectPracticeQuestions(bank,p);
  assert.equal(pending[0].id,bank[1].id);
  assert.ok(!pending.some(q=>q.id===bank[0].id));
  assert.deepEqual(selectPracticeQuestions(bank,p,{reviewOnly:true}).map(q=>q.id),[bank[1].id]);
  assert.equal(selectPracticeQuestions(bank,Object.fromEntries(bank.map(q=>[q.id,{lastCorrect:true}]))).length,bank.length);
});
test('authored subjects have different scope; table and map questions include complete readable data',()=>{
  const counts=LESSONS.map(l=>QUESTIONS.filter(q=>q.lesson===l.id).length);
  assert.ok(new Set(counts).size>1,'No equal per-subject quota');
  for(const q of QUESTIONS){
    if(q.table){assert.ok(q.table.caption);for(const row of q.table.rows)assert.equal(row.length,q.table.headers.length);assert.match(questionDataHTML(q),/<table/);}
    if(q.grid){for(const [name,lng,lat] of q.grid.points){assert.ok(name);assert.ok(Math.abs(lng)<=180&&Math.abs(lat)<=60);}assert.match(questionDataHTML(q),/role="img"/);}
  }
  const prompts=QUESTIONS.map(q=>q.prompt);assert.equal(new Set(prompts).size,prompts.length,'No identical stems');
});
test('data rendering escapes table content and does not reveal explanations',()=>{
  const html=questionDataHTML({table:{caption:'<script>',headers:['A'],rows:[['<img>']]},explanation:'ANSWER_ONLY_AFTER_CHOICE'});
  assert.ok(html.includes('&lt;script&gt;'));assert.ok(!html.includes('<img>'));assert.ok(!html.includes('ANSWER_ONLY_AFTER_CHOICE'));
});
