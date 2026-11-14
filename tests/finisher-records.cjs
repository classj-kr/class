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
      CREATE TABLE school_students(school_id BIGINT, academic_year INTEGER, grade INTEGER, class_number INTEGER, student_number TEXT, roster_name TEXT);
      CREATE TABLE classroom_classes(id BIGINT, school_id BIGINT, academic_year INTEGER, grade INTEGER, class_number INTEGER);
      CREATE TABLE classroom_students(class_id BIGINT, student_number TEXT, roster_name TEXT, roster_active BOOLEAN);
      INSERT INTO classroom_schools VALUES(1,TRUE),(2,TRUE);
      INSERT INTO school_students VALUES
        (1,2026,6,2,'1','송화박'),(1,2026,6,1,'2','동명이'),(1,2026,6,2,'3','동명이'),
        (2,2026,5,1,'1','타학교');
      INSERT INTO classroom_classes VALUES(10,1,2026,6,2);
      INSERT INTO classroom_students VALUES(10,'1','송화박',TRUE);
      INSERT INTO game_finisher_records(record_date,game_id,player_name,difficulty,rank,finished_time) VALUES
        ('2026-11-14','minesweeper','송화박','8×8',1,'13:24'),
        ('2026-11-14','minesweeper','동명이','8×8',1,'13:25'),
        ('2026-11-14','minesweeper','학교관리자','8×8',1,'13:26');`);
    await initializeFinisherIdentity(pool);
    await initializeFinisherIdentity(pool);
    let records = await listFinisherRecords(pool, '2026-11-14', 'minesweeper');
    assert.equal(records.length, 3, 'migration preserves every old result');
    assert.deepEqual([records[0].grade, records[0].classNumber], [6, 2], 'duplicate roster systems describe one student');
    assert.equal(records[1].grade, null, 'ambiguous old names are not assigned a guessed class');
    assert.equal(records[2].grade, null, 'administrator stays unprefixed');
    records = await saveFinisherRecord(pool, { date:'2026-11-14',gameId:'minesweeper',name:'송화박',userId:'12',grade:6,classNumber:2,difficulty:'8×8',rank:1,time:'14:30' });
    assert.equal(records.length, 3, 'a known old result is adopted without a duplicate');
    assert.equal(records.find(r => r.name==='송화박').time, '13:24', 'original completion time survives adoption');
    const base = { date:'2026-11-14', gameId:'nonogram', name:'동명이', difficulty:'쉬움', rank:1, time:'14:00', grade:6 };
    await saveFinisherRecord(pool, { ...base, userId:'10', classNumber:1 });
    await saveFinisherRecord(pool, { ...base, userId:'11', classNumber:2 });
    records = await listFinisherRecords(pool, base.date, base.gameId);
    assert.equal(records.length, 2, 'same-name students keep separate records');
    assert.deepEqual(records.map(r => r.classNumber).sort(), [1,2]);
    assert.ok(records.every(r => !('player_key' in r)), 'internal account keys never reach the public board');
    await saveFinisherRecord(pool, { ...base, userId:'10', classNumber:1, difficulty:'어려움', rank:3, time:'14:10' });
    await saveFinisherRecord(pool, { ...base, userId:'10', classNumber:1, time:'14:20' });
    records = await listFinisherRecords(pool, base.date, base.gameId);
    assert.equal(records.find(r => r.classNumber===1).rank, 3);
    assert.equal(records.find(r => r.classNumber===1).time, '14:10');
    const target = { innerHTML:'' }, window = {};
    vm.runInNewContext(fs.readFileSync('assets/network/finisher-board.js','utf8'), {
      window, document:{currentScript:null,querySelector:()=>true,getElementById:()=>target}
    });
    const board = window.ClassroomFinisherBoard.create({gameId:'minesweeper'});
    board.render('list',[{name:'송화박',grade:6,classNumber:2},{name:'학교관리자'},{name:'<script>',grade:6,classNumber:2}]);
    assert.match(target.innerHTML,/6-2 송화박/);
    assert.match(target.innerHTML,/>학교관리자</);
    assert.ok(!target.innerHTML.includes('<script>'));
    console.log('finisher-records: migration, legacy names, same-name students, best results and escaped labels pass');
  } finally { await db.close(); }
})().catch(error => { console.error(error); process.exitCode=1; });
