'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { PGlite } = require('../game-hub-server/node_modules/@electric-sql/pglite');
const { initializeFinisherIdentity, listFinisherRecords, saveFinisherRecord } = require('../game-hub-server/finisher-records');

(async () => {
  const db = new PGlite();
  const pool = { query: (sql, values) => db.query(sql, values), connect: async () => ({ query: (sql, values) => db.query(sql, values), release() {} }) };
  try {
    await db.exec(`CREATE TABLE game_finisher_records (
      record_date DATE, game_id TEXT, player_name TEXT, difficulty TEXT, rank INTEGER,
      finished_time CHAR(5), updated_at TIMESTAMPTZ DEFAULT NOW(),
      PRIMARY KEY(record_date, game_id, player_name));
      CREATE TABLE classroom_schools(id BIGINT, enabled BOOLEAN);
      CREATE TABLE school_students(user_id BIGINT, school_id BIGINT, academic_year INTEGER, grade INTEGER, class_number INTEGER, student_number TEXT, roster_name TEXT);
      CREATE TABLE classroom_classes(id BIGINT, school_id BIGINT, academic_year INTEGER, grade INTEGER, class_number INTEGER);
      CREATE TABLE classroom_students(user_id BIGINT, class_id BIGINT, student_number TEXT, roster_name TEXT, roster_active BOOLEAN);
      INSERT INTO classroom_schools VALUES(1,TRUE),(2,TRUE);
      INSERT INTO school_students(school_id,academic_year,grade,class_number,student_number,roster_name) VALUES
        (1,2026,6,2,'1','송화박'),(1,2026,6,1,'2','동명이'),(1,2026,6,2,'3','동명이'),
        (2,2026,5,1,'1','타학교');
      INSERT INTO classroom_classes VALUES(10,1,2026,6,2);
      INSERT INTO classroom_students(class_id,student_number,roster_name,roster_active) VALUES(10,'1','송화박',TRUE);
      INSERT INTO game_finisher_records(record_date,game_id,player_name,difficulty,rank,finished_time) VALUES
        ('2026-11-14','minesweeper','송화박','8×8',1,'13:24'),
        ('2026-11-14','minesweeper','동명이','8×8',1,'13:25'),
        ('2026-11-14','minesweeper','학교관리자','8×8',1,'13:26');`);
    await initializeFinisherIdentity(pool);
    await initializeFinisherIdentity(pool);
    // 옛 기록: 하나뿐인 이름은 그 학교 명단으로, 겹치는 이름·관리자는 학교 없는 기록으로 남는다.
    let records = await listFinisherRecords(pool, '2026-11-14', 'minesweeper', '1');
    assert.equal(records.length, 1, 'only this school sees its unambiguous old result');
    assert.deepEqual([records[0].name, records[0].grade, records[0].classNumber], ['송화박', 6, 2], 'duplicate roster systems describe one student');
    records = await listFinisherRecords(pool, '2026-11-14', 'minesweeper');
    assert.equal(records.length, 2, 'migration preserves every old result');
    assert.equal(records[0].grade, null, 'ambiguous old names are not assigned a guessed class');
    assert.equal(records[1].grade, null, 'administrator stays unprefixed');
    assert.equal((await listFinisherRecords(pool, '2026-11-14', 'minesweeper', '2')).length, 0, 'another school sees none of them');
    records = await saveFinisherRecord(pool, { date:'2026-11-14',gameId:'minesweeper',name:'송화박',userId:'12',grade:6,classNumber:2,schoolId:'1',difficulty:'8×8',rank:1,time:'14:30' });
    assert.equal(records.length, 1, 'a known old result is adopted without a duplicate');
    assert.equal(records.find(r => r.name==='송화박').time, '13:24', 'original completion time survives adoption');
    await saveFinisherRecord(pool, { date:'2026-11-14',gameId:'minesweeper',name:'타학교',userId:'20',grade:5,classNumber:1,schoolId:'2',difficulty:'8×8',rank:1,time:'14:31' });
    assert.deepEqual((await listFinisherRecords(pool, '2026-11-14', 'minesweeper', '1')).map(r => r.name), ['송화박'], 'other schools stay off the board');
    assert.deepEqual((await listFinisherRecords(pool, '2026-11-14', 'minesweeper', '2')).map(r => r.name), ['타학교']);
    const base = { date:'2026-11-14', gameId:'nonogram', name:'동명이', difficulty:'쉬움', rank:1, time:'14:00', grade:6, schoolId:'1' };
    await saveFinisherRecord(pool, { ...base, userId:'10', classNumber:1 });
    await saveFinisherRecord(pool, { ...base, userId:'11', classNumber:2 });
    records = await listFinisherRecords(pool, base.date, base.gameId, '1');
    assert.equal(records.length, 2, 'same-name students keep separate records');
    assert.deepEqual(records.map(r => r.classNumber).sort(), [1,2]);
    assert.ok(records.every(r => !('player_key' in r)), 'internal account keys never reach the public board');
    await saveFinisherRecord(pool, { ...base, userId:'10', classNumber:1, difficulty:'어려움', rank:3, time:'14:10' });
    await saveFinisherRecord(pool, { ...base, userId:'10', classNumber:1, time:'14:20' });
    records = await listFinisherRecords(pool, base.date, base.gameId, '1');
    assert.equal(records.find(r => r.classNumber===1).rank, 3);
    assert.equal(records.find(r => r.classNumber===1).time, '14:10');

    // 학년도 누적 및 1인 1 최고기록 테스트:
    // 다른 날짜에 더 낮은 점수로 클리어해도 이전 최고 점수(3)가 보존된다.
    await saveFinisherRecord(pool, { ...base, date:'2026-11-20', userId:'10', classNumber:1, difficulty:'쉬움', rank:1, time:'09:00' });
    records = await listFinisherRecords(pool, '2026-11-20', base.gameId, '1');
    const student10 = records.filter(r => r.classNumber === 1);
    assert.equal(student10.length, 1, '1인당 최고 기록 1건만 유지된다');
    assert.equal(student10[0].rank, 3, '더 낮은 점수는 최고 기록을 덮어쓰지 않는다');

    // 다른 날짜에 더 높은 점수로 클리어하면 최고 기록이 갱신된다.
    await saveFinisherRecord(pool, { ...base, date:'2026-11-21', userId:'10', classNumber:1, difficulty:'극악', rank:5, time:'15:00' });
    records = await listFinisherRecords(pool, '2026-11-21', base.gameId, '1');
    assert.equal(records.find(r => r.classNumber === 1).rank, 5, '더 높은 점수로 최고 기록이 갱신된다');
    assert.equal(records.length, 2, '여전히 학생당 1건씩만 조회된다');

    // 학급 오름차순 정렬 확인 (6-1 이 6-2 보다 앞에 위치)
    assert.equal(records[0].classNumber, 1);
    assert.equal(records[1].classNumber, 2);

    const target = { innerHTML:'' }, window = {};
    vm.runInNewContext(fs.readFileSync('assets/network/finisher-board.js','utf8'), {
      window, document:{currentScript:null,querySelector:()=>true,getElementById:()=>target}
    });
    const board = window.ClassroomFinisherBoard.create({gameId:'minesweeper'});
    board.render('list',[{name:'송화박',grade:6,classNumber:2,date:'2026-03-03'},{name:'학교관리자',date:'2026-11-14'},{name:'<script>',grade:6,classNumber:2}]);
    assert.match(target.innerHTML,/6-2 송화박/);
    assert.match(target.innerHTML,/2026\. 3\. 3\./);
    assert.match(target.innerHTML,/>학교관리자</);
    assert.ok(!target.innerHTML.includes('<script>'));
    console.log('finisher-records: migration, academic year accumulation, 1-per-player best score, class ordering, and escaped labels pass');
  } finally { await db.close(); }
})().catch(error => { console.error(error); process.exitCode=1; });
