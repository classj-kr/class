'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { fork } = require('node:child_process');
const { io } = require('socket.io-client');
const Terrain = require('../public/js/terrain.js');
const Icons = require('../public/js/city-icons.js');
const Ships = require('../public/js/ship-designs.js');
const sites = require('../data/catalog/regional-sites.json');
const project = path.resolve(__dirname, '..');
const worldBuffer = fs.readFileSync(path.join(project, 'data/world/WORLD.CDS'));
const world = new Uint16Array(worldBuffer.buffer, worldBuffer.byteOffset, worldBuffer.length / 2);
Terrain.setNaturalEarthLandMask(fs.readFileSync(path.join(project, 'data/world/NATURAL_EARTH_LAND_MASK.bin')));
const port = Number(process.env.TEST_PORT || 31509);
const base = 'http://127.0.0.1:' + port;
const runtime = fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'voyage-sites-'));
const server = fork(path.join(__dirname, 'interaction-recovery-smoke.js'), ['--fixture'], {
  env: { ...process.env, PORT: String(port), DATA_DIR: runtime }, silent: true, windowsHide: true
});
let logs = '', socket, sequence = 0;
server.stdout.on('data', data => logs += data);
server.stderr.on('data', data => logs += data);
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const ack = (event, payload = {}) => new Promise((resolve, reject) =>
  socket.timeout(7000).emit(event, payload, (error, result) => error ? reject(error) : resolve(result)));
const once = (event, predicate = () => true) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => { socket.off(event, listener); reject(Error('timeout ' + event)); }, 10000);
  function listener(value) { if (predicate(value)) { clearTimeout(timer); socket.off(event, listener); resolve(value); } }
  socket.on(event, listener);
});
const place = payload => new Promise((resolve, reject) => {
  const request = ++sequence;
  const timer = setTimeout(() => { server.off('message', listener); reject(Error('fixture timeout')); }, 5000);
  function listener(message) {
    if (message.request !== request) return;
    clearTimeout(timer); server.off('message', listener);
    message.error ? reject(Error(message.error)) : resolve(message);
  }
  server.on('message', listener); server.send({ command: 'place', request, id: socket.id, ...payload });
});
(async () => {
  try {
    let ready = false;
    for (let attempt = 0; attempt < 100; attempt++) {
      try { ready = (await fetch(base + '/health')).ok; } catch {}
      if (ready) break;
      await delay(100);
    }
    assert.ok(ready, logs);
    const catalog = await (await fetch(base + '/api/mission-catalog')).json();
    for (const collection of [catalog.places, catalog.discoveries]) {
      const ids = collection.map(item => item.id);
      assert.equal(new Set(ids).size, ids.length, 'unique IDs within each catalog');
    }
    socket = io(base, { autoConnect: false, transports: ['websocket'], reconnection: false });
    const connected = once('connect'); socket.connect(); await connected;
    const room = await ack('createRoom', { roomType: 'free' });
    assert.equal((await ack('joinClass', { roomCode: room.roomCode, name: '북방거점검사', hostToken: room.hostToken })).ok, true);
    assert.equal((await ack('hostStartFree')).ok, true);
    const checked = [];
    for (const site of sites.settlements) {
      const city = catalog.places.find(item => item.id === site.id);
      assert.ok(city?.displayOnMap && city.isOriginalCity, site.name + ' map visibility');
      assert.ok(city.story.sections.length && city.story.sources.length, site.name + ' sourced description');
      assert.equal(Icons.appearance(city).culture, site.iconCulture);
      assert.equal(Icons.appearance(city).port, site.canEnterFromSea);
      assert.equal(Ships.forPort(city), site.shipType);
      assert.notEqual(Terrain.terrainAtPixel(world, city.landPoint.x, city.landPoint.y).type, 'sea', site.name + ' land gate');
      await place({ city: city.name });
      const entered = await ack('enterCity', { placeId: city.id });
      assert.equal(entered.ok, true, site.name + ': ' + entered.error);
      assert.equal(entered.self.currentCityId, city.id);
      assert.equal((await ack('leaveCity')).ok, true);
      await once('snapshot', snap => snap.you.mode === 'land' && !snap.you.transition);
      if (site.canEnterFromSea) {
        assert.equal(Terrain.terrainAtPixel(world, city.seaPoint.x, city.seaPoint.y).type, 'sea', site.name + ' sea entrance');
        await place({ city: city.name, mode: 'sea' });
        assert.equal((await ack('useCatalogPort', { placeId: city.id })).ok, true, site.name + ' arrival');
        await once('snapshot', snap => snap.you.currentCityId === city.id && !snap.you.transition);
        assert.equal((await ack('departCity')).ok, true, site.name + ' departure');
        await once('snapshot', snap => snap.you.mode === 'sea' && !snap.you.transition);
      } else {
        await place({ city: city.name, mode: 'sea' });
        assert.equal((await ack('useCatalogPort', { placeId: city.id })).ok, false, site.name + ' must not become a sea port');
      }
      checked.push({ name: city.name, landEntry: true, seaEntry: site.canEnterFromSea });
    }
    const tyr = catalog.discoveries.find(item => item.id === 'tyr_yongning_temple');
    assert.ok(tyr && tyr.kind === '유적');
    await place({ lat: tyr.lat, lon: tyr.lon });
    assert.equal((await ack('inspectDiscovery', { id: tyr.id })).ok, true, 'Tyr inspection');
    console.log(JSON.stringify({ ok: true, settlements: checked, tyrDiscovery: true }));
  } finally { socket?.disconnect(); server.kill(); }
})().catch(error => { console.error(error); console.error(logs); process.exitCode = 1; });
