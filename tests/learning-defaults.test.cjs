const test = require('node:test');
const assert = require('node:assert/strict');
const {term, highestGrade, mathTerm} = require('../assets/learning-defaults');
const {schoolDefaults} = require('../game-hub-server/school-affiliation');

test('semester and preparation year switch at midnight in Korea on February 15 and August 15', () => {
  for (const [instant, expected] of [
    ['2026-01-01T00:00:00+09:00', {year:2025, semester:2}],
    ['2026-02-14T23:59:59+09:00', {year:2025, semester:2}],
    ['2026-02-15T00:00:00+09:00', {year:2026, semester:1}],
    ['2026-08-14T23:59:59+09:00', {year:2026, semester:1}],
    ['2026-08-15T00:00:00+09:00', {year:2026, semester:2}],
    ['2026-12-31T23:59:59+09:00', {year:2026, semester:2}]
  ]) assert.deepEqual(term(new Date(instant)), expected, instant);
});

test('teacher defaults combine current assignments, excluding old years and other schools', () => {
  const teacher = {school_id:1, school_name:'가초등학교', academic_year:2026, grade:3,
    teaching_scope:JSON.stringify([{grade:4, subject:'음악'},{grade:5,subject:'음악'}])};
  assert.equal(schoolDefaults(teacher).schoolGrade,5);
  assert.equal(schoolDefaults(teacher,[{...teacher, grade:6}]).schoolGrade,6);
  assert.equal(schoolDefaults(teacher,[{...teacher, academic_year:2025, grade:6},
    {...teacher, school_id:2, grade:6}]).schoolGrade,5);
  assert.equal(schoolDefaults({schoolName:'가초등학교',grade:2}).schoolGrade,2);
  assert.equal(schoolDefaults({schoolName:'가중학교',grade:1,
    teaching_scope:[{grade:3,subject:'음악'},{grade:6,subject:'음악'}]}).schoolGrade,3);
  assert.equal(highestGrade([null, 0, 3, '6', NaN, 12]),6);
});

test('math grade encoding respects school level and the chosen semester', () => {
  const available=Array.from({length:10},(_,i)=>[`${i+1}-1`,`${i+1}-2`]).flat();
  assert.equal(mathTerm('elementary',6,available,new Date('2026-08-15T00:00:00+09:00')),'6-2');
  assert.equal(mathTerm('middle',2,available,new Date('2026-08-14T23:59:59+09:00')),'8-1');
  assert.equal(mathTerm('high',1,available,new Date('2026-02-14T10:00:00+09:00')),'10-2');
  assert.equal(mathTerm('high',3,available,new Date('2026-08-20')),'10-2');
  assert.equal(mathTerm('',1,available),null);
});

test('new code-words rooms use the host grade without changing an existing room on join', () => {
  const game = require('../game-hub-server/codenames');
  const room = game.createGame('host','교사',6);
  assert.equal(room.grade,6);
  game.addPlayer(room,'student','학생');
  assert.equal(room.grade,6);
  for(const invalid of [0,12,3.5,undefined]) assert.equal(game.createGame('host','교사',invalid).grade,4);
});
