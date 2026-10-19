'use strict';

// Exercise real sockets, mission completion and movement against an isolated
// server. Test-only relocation uses the child process IPC channel, never HTTP.
const fs = require('node:fs');
const path = require('node:path');
const { fork } = require('node:child_process');
const assert = require('node:assert/strict');
const { io } = require('socket.io-client');
const Terrain = require('../public/js/terrain.js');
const { WORLD_PIXEL_W: W, WORLD_PIXEL_H: H, TILE } = Terrain;
const point = (lat, lon = 0) => ({ x: (lon + 180) / 360 * W, y: (90 - lat) / 180 * H });

if (process.argv.includes('--server')) {
  const Module = require('node:module');
  const file = path.resolve(__dirname, '../server.js');
  const childModule = new Module(file, module);
  childModule.filename = file;
  childModule.paths = Module._nodeModulePaths(path.dirname(file));
  childModule._compile(fs.readFileSync(file, 'utf8') + `
    server.on('listening', () => process.send({ready: server.address().port}));
    process.on('message', request => {
      try {
        const p = [...rooms.values()].flatMap(room => [...room.values()]).find(p => p.name === request.name);
        if (!p) throw new Error('test player missing');
        if (request.point) {
          setModeAt(p, request.mode || 'sea', request.point);
          p.fatigue = 0; p.noticeText = ''; p.noticeSeq++;
        }
        process.send({id: request.id, you: publicPlayer(p), target: p.target, route: p.route});
      } catch (error) { process.send({id: request.id, error: error.message}); }
    });
  `, file);
} else {
  main().catch(error => { console.error(error); process.exitCode = 1; });
}

async function main() {
  const runtime = fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'voyage-ufo-'));
  const child = fork(__filename, ['--server'], {
    cwd: path.resolve(__dirname, '..'), env: { ...process.env, PORT: '0', DATA_DIR: runtime },
    stdio: ['ignore', 'pipe', 'pipe', 'ipc'], windowsHide: true
  });
  let logs = '', requestId = 0;
  child.stdout.on('data', data => { logs += data; });
  child.stderr.on('data', data => { logs += data; });
  const sockets = [];
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
  function wait(emitter, event, predicate = () => true, timeout = 15000) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => { emitter.off(event, on); reject(new Error(`timeout ${event}\n${logs}`)); }, timeout);
      function on(data) { if (predicate(data)) { clearTimeout(timer); emitter.off(event, on); resolve(data); } }
      emitter.on(event, on);
    });
  }
  const ack = (socket, event, payload = {}) => new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`ack ${event}`)), 10000);
    socket.emit(event, payload, result => { clearTimeout(timer); result?.ok ? resolve(result) : reject(new Error(result?.error)); });
  });
  async function inspect(name, extra = {}) {
    const id = ++requestId, pending = wait(child, 'message', response => response.id === id);
    child.send({ id, name, ...extra });
    const response = await pending;
    assert.equal(response.error, undefined);
    return response;
  }
  async function steer(socket, input, duration = 300) {
    socket.emit('input', input); await delay(duration); socket.emit('stop'); await delay(100);
  }
  try {
    const { ready: port } = await wait(child, 'message', response => response.ready);
    async function connect() {
      const socket = io(`http://127.0.0.1:${port}`, { transports: ['websocket'], reconnection: false, forceNew: true });
      sockets.push(socket); await wait(socket, 'connect'); return socket;
    }
    const host = await connect(), ufo = await connect(), ship = await connect();
    const room = await ack(host, 'createRoom', { roomType: 'race' });
    await ack(ufo, 'joinClass', { roomCode: room.roomCode, name: '완료자' });
    await ack(ship, 'joinClass', { roomCode: room.roomCode, name: '미완료' });
    const payload = { targetPlaceId: 'bosporus', startPlaceIds: ['istanbul'] };
    const race = await ack(host, 'teacherPublishArrivalRace', payload);
    await ack(ufo, 'chooseStartCity', { optionId: 'istanbul' });
    await ack(ship, 'chooseStartCity', { optionId: 'istanbul' });
    await ack(host, 'teacherStartArrivalRace');
    ufo.emit('setTarget', race.mission.targetPlace.point);
    await wait(ufo, 'snapshot', s => s.progress?.finalQuizStatus === 'answering', 25000);
    await ack(ufo, 'submitFinalQuiz', { answers: race.mission.finalQuiz.questions.map(q => q.answerIndex) });
    assert.equal((await inspect('완료자')).you.missionCompleted, true);

    for (const lat of [83, -83]) {
      const origin = point(lat);
      await inspect('완료자', { point: origin });
      await inspect('미완료', { point: origin });
      const input = lat > 0 ? { up: true } : { down: true };
      await steer(ufo, input);
      await steer(ship, { ...input, missionCompleted: true, finishRank: 1 });
      const flown = (await inspect('완료자')).you, blocked = (await inspect('미완료')).you;
      const sign = lat > 0 ? -1 : 1;
      assert.ok((flown.y - origin.y) * sign > 100, `UFO must cross polar ice at ${lat}`);
      assert.ok((blocked.y - origin.y) * sign < 1, 'ordinary ship cannot acquire flight from input flags');
      assert.doesNotMatch(flown.noticeText, /얼음.*어려움/);
      assert.equal(flown.currentStrength, 0);
      assert.equal(flown.windStrength, 0);
    }

    // Ice and impassable terrain must not reduce UFO speed, in either old mode.
    const speeds = [];
    for (const [lat, mode] of [[0, 'sea'], [84, 'sea'], [-84, 'land']]) {
      const origin = point(lat, -30);
      await inspect('완료자', { point: origin, mode });
      await steer(ufo, { right: true }, 350);
      const state = (await inspect('완료자')).you;
      const dx = (state.x - origin.x + W) % W;
      speeds.push(dx * require('../public/js/geo-motion.js').longitudeScaleAtY(origin.y, H));
    }
    assert.ok(Math.max(...speeds) / Math.min(...speeds) < 1.4, 'ice or land must not slow down flight');

    for (const north of [true, false]) {
      const y = north ? TILE : H - TILE, origin = { x: W / 2, y };
      await inspect('완료자', { point: origin });
      await steer(ufo, north ? { up: true } : { down: true });
      const edge = (await inspect('완료자')).you;
      assert.equal(edge.x, origin.x, 'holding pole direction cannot flip longitude');
      assert.equal(edge.y, y);
      assert.equal(edge.speedKmh, 0);
      const target = { x: 0, y };
      ufo.emit('setTarget', target);
      await wait(ufo, 'snapshot', s => Math.min(s.you.x, W - s.you.x) < 200 && !s.you.moving, 7000);
      const arrived = await inspect('완료자');
      assert.equal(arrived.you.y, y);
      assert.equal(arrived.route, null);
      await steer(ufo, north ? { down: true } : { up: true });
      assert.ok(Math.abs((await inspect('완료자')).you.y - y) > 100, 'can leave polar boundary');
    }

    await ack(host, 'teacherPublishArrivalRace', payload);
    await ack(ufo, 'chooseStartCity', { optionId: 'istanbul' });
    await ack(ship, 'chooseStartCity', { optionId: 'istanbul' });
    await ack(host, 'teacherStartArrivalRace');
    const resetOrigin = point(83);
    await inspect('완료자', { point: resetOrigin });
    await steer(ufo, { up: true });
    const reset = (await inspect('완료자')).you;
    assert.equal(reset.missionCompleted, false);
    assert.ok(reset.y >= resetOrigin.y - 1, 'new mission must revoke flight');
    console.log(JSON.stringify({ ok: true, realCompletion: true, polarIce: ['north', 'south'], normalShipsBlocked: true, noIceSlowdown: true, polarClicksArrive: true, noPoleFlip: true, missionResetRevokesFlight: true }));
  } finally {
    sockets.forEach(socket => socket.disconnect());
    child.kill();
  }
}
