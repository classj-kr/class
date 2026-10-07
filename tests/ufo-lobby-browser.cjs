// Real browser host and 40 WebSocket guests exercise the server's capacity boundary.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawn, execFileSync } = require('node:child_process');
const puppeteer = require('puppeteer-core');
const { WebSocket } = require('../game-hub-server/node_modules/ws');
const root = path.resolve(__dirname, '..');
const port = 24000 + Math.floor(Math.random() * 5000);
const base = `http://127.0.0.1:${port}`;
const out = path.join(root, 'tmp/ufo-lobby-check');
fs.mkdirSync(out, {recursive:true});
const hub = spawn(process.execPath, ['server.js'], {
  cwd:path.join(root,'game-hub-server'), windowsHide:true,
  env:{...process.env, PORT:String(port), ARITHMETIC_PORT:String(port+1), WORLD_VOYAGE_PORT:String(port+2), DATABASE_URL:'', NODE_ENV:'test', WORLD_VOYAGE_DATA_DIR:path.join(out,'voyage')},
  stdio:['ignore','pipe','pipe']
});
let logs=''; hub.stdout.on('data',b=>logs+=b); hub.stderr.on('data',b=>logs+=b);
const guests=[];
async function connect() {
  const socket=new WebSocket(`ws://127.0.0.1:${port}`), messages=[];
  socket.on('message',raw=>messages.push(JSON.parse(raw)));
  guests.push(socket);
  await new Promise((resolve,reject)=>{socket.once('open',resolve);socket.once('error',reject);});
  return {socket,messages};
}
async function waitFor(test,label) {
  const until=Date.now()+15000;
  while(Date.now()<until) { if(await test()) return; await new Promise(r=>setTimeout(r,100)); }
  throw new Error(label+'\n'+logs.slice(-1500));
}
(async()=>{
 let browser;
 try {
  await waitFor(async()=>{try{return (await fetch(base+'/health')).ok;}catch{return false;}},'server startup');
  browser=await puppeteer.launch({executablePath:process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--enable-unsafe-swiftshader']});
  const page=await browser.newPage(), errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.evaluateOnNewDocument(()=>{
    Object.defineProperty(window,'CLASS_PLAYER_NAME',{configurable:true,get:()=> '검증교사',set:()=>{}});
    let api;
    Object.defineProperty(window,'ClassroomMultiplayerLobby',{configurable:true,get:()=>api,set:value=>{
      api={...value,create:options=>{const lobby=value.create(options);window.__ufoLobby=lobby;return lobby;}};
    }});
  });
  await page.setRequestInterception(true);
  page.on('request',request=>request.url().startsWith(base) || request.url().startsWith('data:') ? request.continue():request.abort());
  await page.setViewport({width:820,height:1180});
  await page.goto(base+'/learning/inquiry/space/solar-system/',{waitUntil:'networkidle0'});
  await page.waitForFunction(()=>window.__ufoLobby?.mounted);
  await page.click('#ufoModeBtn'); await page.click('#ufoHostTab');
  await page.waitForFunction(()=>window.__ufoLobby.connected);
  assert.equal(await page.$eval('#ufoLobbyScreen .mp-ui-title',e=>getComputedStyle(e).display),'none');
  assert.match(await page.$eval('#ufoLobbyScreen .mp-ui-meta',e=>e.textContent),/1~40명/);
  assert.equal(await page.$eval('#ufoRoomTitle',e=>e.textContent),'🛸 UFO Flight');
  const roomCode=await page.evaluate(()=>window.__ufoLobby.roomCode);
  await page.screenshot({path:path.join(out,'lobby-1.png'),fullPage:true});
  for(let index=1;index<=39;index++) {
    const client=await connect();
    client.socket.send(JSON.stringify({type:'JOIN_ROOM',gameId:'solar-system-ufo-flight',roomCode,name:'학생'+index}));
    await waitFor(()=>client.messages.some(m=>m.type==='ROOM_JOINED'),'guest '+index+' joins');
  }
  await page.waitForFunction(()=>Object.keys(window.__ufoLobby.players).length===40);
  assert.equal(await page.$eval('#ufoStartBtn',e=>e.disabled),false);
  const rejected=await connect();
  rejected.socket.send(JSON.stringify({type:'JOIN_ROOM',gameId:'solar-system-ufo-flight',roomCode,name:'초과학생'}));
  await waitFor(()=>rejected.messages.some(m=>m.type==='ROOM_FULL'),'41st participant rejected');
  assert.equal(await page.evaluate(()=>Object.keys(window.__ufoLobby.players).length),40);
  await page.screenshot({path:path.join(out,'lobby-40.png'),fullPage:true});
  await page.setViewport({width:390,height:844});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'phone has no horizontal overflow');
  await page.screenshot({path:path.join(out,'lobby-40-phone.png'),fullPage:true});
  const first=guests[0];
  let startPacket;
  const started=new Promise(resolve=>first.on('message',raw=>{const m=JSON.parse(raw);if(m.payload?.type==='CLASSROOM_LOBBY_START'){startPacket=m;resolve();}}));
  await page.click('#ufoStartBtn');
  await Promise.race([started,new Promise((_,reject)=>{const timer=setTimeout(()=>reject(new Error('start packet timeout')),5000);timer.unref();})]);
  assert.ok(startPacket.payload);
  await page.waitForFunction(()=>window.__ufoLobby.started && document.querySelector('#ufoRoomOverlay').classList.contains('hidden'));
  assert.deepEqual(errors,[]);
  console.log('PASS: duplicate heading hidden; 1~40 display; host + 39 guests join; 41st rejected; 40-player start delivered; tablet/phone screenshots; no page errors.');
 } finally {
  for(const socket of guests) socket.close(4000,'TEST_COMPLETE');
  if(browser) await browser.close();
  if(process.platform==='win32') {try{execFileSync('taskkill',['/PID',String(hub.pid),'/T','/F'],{windowsHide:true,stdio:'ignore'});}catch{}}
  else hub.kill();
 }
})().catch(e=>{console.error(e);process.exitCode=1;});
