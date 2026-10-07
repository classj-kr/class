import assert from 'node:assert/strict';
import test from 'node:test';
import { createRequire } from 'node:module';
import { PGlite } from '@electric-sql/pglite';
import { readFile } from 'node:fs/promises';
const require = createRequire(import.meta.url);
const { createRoomCodes } = require('./room-codes');
const { createRoomEntry } = require('./room-entry');
const express = require('express');

test('retiring the shared quiz removes only its saved rooms and reservations', async t => {
  const db = new PGlite(); t.after(() => db.close());
  await db.exec(`CREATE TABLE multiplayer_room_snapshots(game_id TEXT, room_code TEXT);
    CREATE TABLE site_room_codes(activity TEXT, code TEXT);
    INSERT INTO multiplayer_room_snapshots VALUES ('quizrace','1234'), ('omok','2345');
    INSERT INTO site_room_codes VALUES ('game:quizrace','1234'), ('arithmetic','3456');`);
  const sql = await readFile(new URL('./migrations/retire-class-race.sql', import.meta.url), 'utf8');
  await db.exec(sql); await db.exec(sql);
  assert.deepEqual((await db.query('SELECT * FROM multiplayer_room_snapshots')).rows, [{game_id:'omok',room_code:'2345'}]);
  assert.deepEqual((await db.query('SELECT * FROM site_room_codes')).rows, [{activity:'arithmetic',code:'3456'}]);
});

test('one four-digit namespace survives concurrent allocations, rollback and restart', async t => {
  const db = new PGlite(); t.after(() => db.close());
  const live = new Set(), legacy = new Set(['4321']);
  const options = { pool: db, random: () => 4321, legacyTaken: async code => legacy.has(code), isActive: async row => live.has(row.code) };
  const codes = createRoomCodes(options); await codes.initialize();
  assert.equal(await codes.claim('voyage','4321'),false,'old rooms are protected');
  const attempts = await Promise.all(Array.from({length:30},(_,i)=>codes.claim(i%2?'voyage':'arithmetic','4322')));
  assert.equal(attempts.filter(Boolean).length,1,'one SQL unique constraint winner');
  const allocated = await Promise.all(['board','vote','school-election','seating','rhythm','arithmetic','voyage'].map(kind=>codes.allocate(kind)));
  assert.equal(new Set(allocated).size,7);
  assert.ok(allocated.every(code=>/^\d{4}$/.test(code)));
  const restarted = createRoomCodes(options);
  assert.equal((await restarted.lookup(allocated[0])).activity,'board','room ownership survives process restart');
  await db.query('BEGIN');
  const rolledBack = await codes.allocate('board',db);
  await db.query('ROLLBACK');
  assert.equal(await codes.lookup(rolledBack),null,'failed creation does not consume a code');
  live.add('4322');
  await db.query("UPDATE site_room_codes SET lease_until=NOW()-INTERVAL '1 second' WHERE code='4322'");
  assert.equal(await codes.claim('board','4322'),false,'live rooms survive lease expiration');
  live.delete('4322');
  assert.equal(await codes.claim('board','4322'),true,'expired, absent rooms can be reused');
  assert.equal((await codes.lookup('4322')).activity,'board');
  assert.equal(await codes.claim('board','123456'),false);
});

test('standalone memory reservations also reject simultaneous collisions', async () => {
  const codes = createRoomCodes({random:()=>1000});
  const results = await Promise.all(Array.from({length:30},()=>codes.claim('voyage','1111')));
  assert.equal(results.filter(Boolean).length,1);
});

test('main entrance resolves activities without leaking roster or credentials', async t => {
  const codes = createRoomCodes({});
  for(const [code,kind] of [['1234','arithmetic'],['2345','voyage'],['3456','board'],['4567','rhythm'],['5678','vote']]) await codes.claim(kind,code);
  let upstream=204;
  const app=express();
  app.use('/api/room-entry',createRoomEntry({roomCodes:codes,arithmeticPort:10001,voyagePort:10003,rhythmExists:()=>true,fetchImpl:async()=>({status:upstream,ok:upstream===204})}));
  const server=app.listen(0,'127.0.0.1');await new Promise(resolve=>server.once('listening',resolve));
  t.after(()=>new Promise(resolve=>server.close(resolve)));
  const resolve=code=>fetch(`http://127.0.0.1:${server.address().port}/api/room-entry/resolve/${code}`,{redirect:'manual'});
  for(const [code,type] of [['1234','arithmetic'],['2345','voyage'],['3456','board'],['4567','rhythm']]){
    const result=await resolve(code); assert.equal(result.status,200);
    const data=await result.json();assert.deepEqual(Object.keys(data).sort(),['href','type']);assert.equal(data.type,type);
    assert.ok(data.href.includes(code));
  }
  assert.equal((await resolve('5678')).headers.get('location'),'/api/vote/resolve/5678');
  assert.equal((await resolve('1234567')).status,400);
  upstream=404;assert.equal((await resolve('1234')).status,404);
  upstream=409;assert.equal((await resolve('2345')).status,409);
  upstream=500;assert.equal((await resolve('1234')).status,503,'outage is not mistaken for a missing room');
});
