import test from 'node:test';
import assert from 'node:assert/strict';
import {LESSONS,QUESTIONS,WORLD_LESSONS,WORLD_QUESTIONS} from '../learning/inquiry/globe/curriculum.mjs';
test('world geography excludes domestic-only topics and their practice questions',()=>{
  for(const id of ['korea-location','korea-terrain']){
    assert.ok(LESSONS.some(l=>l.id===id&&l.scope==='korea'));
    assert.ok(QUESTIONS.some(q=>q.lesson===id));
    assert.ok(!WORLD_LESSONS.some(l=>l.id===id));
    assert.ok(!WORLD_QUESTIONS.some(q=>q.lesson===id));
  }
  for(const q of WORLD_QUESTIONS)assert.ok(WORLD_LESSONS.some(l=>l.id===q.lesson));
  assert.ok(WORLD_LESSONS.some(l=>l.id==='monsoon'));
  assert.ok(WORLD_LESSONS.find(l=>l.id==='seasons').spots.some(s=>s.name==='서울'));
});
