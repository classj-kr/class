'use strict';
// 실제로 배를 몰아 얼음까지 가 본다. 얼음 앞에서 천천히 느려지고, 그 자리에 갇히지 않고,
// 뱃머리를 돌리면 남쪽으로 빠져나올 수 있어야 한다.
const { io } = require('socket.io-client');
const assert = require('node:assert/strict');
const Terrain = require('../public/js/terrain.js');

const url = process.env.TEST_URL || 'http://127.0.0.1:10003';
const W = Terrain.WORLD_W * Terrain.TILE;
const H = Terrain.WORLD_H * Terrain.TILE;
const latOf = (y) => 90 - (y / H) * 180;
const lonOf = (x) => (x / W) * 360 - 180;
const pointOf = (lat, lon) => ({ x: ((lon + 180) / 360) * W, y: ((90 - lat) / 180) * H });

const connect = () => io(url, { transports: ['websocket'], forceNew: true, reconnection: false });
const once = (socket, event, timeout = 8000) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error(`timeout: ${event}`)), timeout);
  socket.once(event, (data) => { clearTimeout(timer); resolve(data); });
});
const emitAck = (socket, event, payload) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error(`ack timeout: ${event}`)), 8000);
  socket.emit(event, payload, (data) => { clearTimeout(timer); resolve(data); });
});
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const host = connect();
  const ship = connect();
  await Promise.all([once(host, 'connect'), once(ship, 'connect')]);
  const room = await emitAck(host, 'createRoom', { roomType: 'free' });
  assert.equal(room.ok, true, room.error);
  assert.equal((await emitAck(host, 'hostStartFree', {})).ok, true);
  assert.equal((await emitAck(ship, 'joinClass', { roomCode: room.roomCode, name: '얼음배' })).ok, true);

  let you = (await once(ship, 'snapshot')).you;
  ship.on('snapshot', (s) => { you = s.you; });

  // 노르웨이 앞바다 북위 74도로 길을 잡는다. 한여름이 아니면 이 위도가 곧 얼음 앞이다.
  const goal = pointOf(74, 15);
  ship.emit('setTarget', goal);
  const sailStart = Date.now();
  while (latOf(you.y) < 71 && Date.now() - sailStart < 120000) {
    await sleep(500);
    // 길이 끊기면 다시 잡아 준다(해안을 따라 돌다 지점을 버리는 일이 있다).
    if (!you.moving) ship.emit('setTarget', goal);
  }
  assert.ok(latOf(you.y) >= 71, `북위 71도까지는 가야 함(지금 ${latOf(you.y).toFixed(1)}도)`);

  // 이제 손으로 계속 북쪽을 누른다.
  ship.emit('stop');
  await sleep(300);
  ship.emit('input', { up: true, down: false, left: false, right: false });
  const samples = [];
  for (let i = 0; i < 24; i += 1) {
    await sleep(500);
    samples.push({ lat: latOf(you.y), lon: lonOf(you.x), speed: Number(you.speedKmh) || 0 });
  }
  const top = Math.max(...samples.map((s) => s.lat));
  const last = samples.slice(-8);
  const limit = Terrain.iceLimitNorthAt(lonOf(you.x), Terrain.dayOfYear(you.classGameMinutes ?? 0));

  // 얼음을 뚫고 들어가지 못한다.
  assert.ok(top <= 80.5, `얼음을 뚫고 올라가면 안 됨(가장 북쪽 ${top.toFixed(1)}도)`);
  // 얼음 앞에서는 제 속도가 나오지 않는다.
  const fastest = Math.max(...last.map((s) => s.speed));
  assert.ok(fastest < 9, `얼음 앞에서는 느려져야 함(마지막 구간 최고 ${fastest.toFixed(1)}km/h)`);

  // 갇히지 않는다: 뱃머리를 남쪽으로 돌리면 빠져나온다.
  const stuckLat = latOf(you.y);
  ship.emit('input', { up: false, down: true, left: false, right: false });
  const escapeStart = Date.now();
  let escaped = 0;
  while (Date.now() - escapeStart < 12000) {
    await sleep(500);
    escaped = stuckLat - latOf(you.y);
    if (escaped > 1) break;
  }
  assert.ok(escaped > 1, `남쪽으로 돌리면 빠져나와야 함(${escaped.toFixed(2)}도만 움직임)`);

  ship.emit('input', { up: false, down: false, left: false, right: false });
  console.log(JSON.stringify({
    ok: true,
    최북: +top.toFixed(2),
    얼음경계: +limit.toFixed(2),
    마지막속도: last.map((s) => +s.speed.toFixed(1)),
    남쪽으로: +escaped.toFixed(2)
  }, null, 0));
  ship.disconnect();
  host.disconnect();
  process.exit(0);
})().catch((error) => { console.error(error); process.exit(1); });
