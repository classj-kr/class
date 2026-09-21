'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { fork } = require('node:child_process');
const { io } = require('socket.io-client');
const Terrain = require('../public/js/terrain.js');
const project = path.resolve(__dirname, '..');
const worldBuffer = fs.readFileSync(path.join(project, 'data/world/WORLD.CDS'));
const world = new Uint16Array(worldBuffer.buffer, worldBuffer.byteOffset, worldBuffer.length / 2);
Terrain.setNaturalEarthLandMask(fs.readFileSync(path.join(project, 'data/world/NATURAL_EARTH_LAND_MASK.bin')));
const port = Number(process.env.TEST_PORT || 31539);
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
    for (const id of ['saru_ainu_settlement', 'buenos_aires', 'original_city_123', 'original_city_000']) {
      assert.ok(!catalog.places.some(city => city.id === id), id + ' must not be a playable 1520 city');
    }
    for (const collection of [catalog.places, catalog.discoveries]) {
      const ids = collection.map(item => item.id);
      assert.equal(new Set(ids).size, ids.length, 'unique IDs within each catalog');
    }
    socket = io(base, { autoConnect: false, transports: ['websocket'], reconnection: false });
    const connected = once('connect'); socket.connect(); await connected;
    const room = await ack('createRoom', { roomType: 'free' });
    assert.equal((await ack('joinClass', { roomCode: room.roomCode, name: '북방거점검사', hostToken: room.hostToken })).ok, true);
    assert.equal((await ack('hostStartFree')).ok, true);

    const ids=['batur-caldera','milford-sound','chocolate-hills','palawan-underground-river','lm-table-mountain'];
    assert.equal(new Set(catalog.discoveries.map(d => d.id)).size, catalog.discoveries.length);
    assert.ok(!require('../data/catalog/city-landmarks.json').some(d=>d.id==='lm-table-mountain'));
    const checked=[];
    for(const id of ids){
      const d=catalog.discoveries.find(d=>d.id===id);assert.ok(d);
      const modes=d.reach==='any'?['land','sea']:['land'];
      let firstCount;
      for(const mode of modes){
        let spot=null;
        for(let ring=0;ring<=15&&!spot;ring++)for(let a=0;a<24&&!spot;a++){
          const lat=d.lat+ring*.02*Math.cos(a*Math.PI/12),lon=d.lon+ring*.02*Math.sin(a*Math.PI/12);
          const x=(lon+180)/360*Terrain.WORLD_PIXEL_W,y=(90-lat)/180*Terrain.WORLD_PIXEL_H;
          const sea=Terrain.terrainAtPixel(world,x,y).type==='sea';
          if(sea===(mode==='sea'))spot={lat,lon,mode};
        }
        assert.ok(spot,id+' reachable '+mode);await place(spot);
        const result=await ack('inspectDiscovery',{id});assert.equal(result.ok,true,id+': '+result.error);
        if(firstCount===undefined){assert.equal(result.first,true);firstCount=result.found;}
        const again=await ack('inspectDiscovery',{id});assert.equal(again.first,false);assert.equal(again.found,firstCount);
        assert.ok(result.discovery.imageCredit.includes('사진'));
        assert.ok(result.discovery.imageSource.startsWith('https://commons.wikimedia.org/'));assert.ok(result.discovery.imageLicenseUrl);
        const image=await fetch(base+result.discovery.image.replace('/learn/world-voyage',''));assert.equal(image.status,200);
        assert.equal(Buffer.from(await image.arrayBuffer()).toString('ascii',8,12),'WEBP');
        checked.push({id,...spot});
      }
      if(d.reach==='land'){await place({lat:d.lat,lon:d.lon,mode:'sea'});assert.equal((await ack('inspectDiscovery',{id})).ok,false);}
      await place({lat:0,lon:0,mode:'sea'});assert.equal((await ack('inspectDiscovery',{id})).ok,false);
    }
    console.log(JSON.stringify({ok:true,checked,duplicateSafe:true,remoteRejected:true}));
  } finally { socket?.disconnect(); server.kill(); }
})().catch(error => { console.error(error); console.error(logs); process.exitCode = 1; });
