const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawn, execFileSync } = require('node:child_process');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const { io } = require('../learning/inquiry/age-of-exploration/node_modules/socket.io-client');
const { WebSocket } = require('../game-hub-server/node_modules/ws');
const root = path.resolve(__dirname, '..');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'class-unified-entry-'));
const port = 18875, base = `http://127.0.0.1:${port}`;
const hub = spawn(process.execPath, ['server.js'], { cwd: path.join(root, 'game-hub-server'), windowsHide: true,
  env: { ...process.env, PORT: String(port), ARITHMETIC_PORT: String(port+1), WORLD_VOYAGE_PORT: String(port+2),
    DATABASE_URL: '', NODE_ENV: 'test', RENDER_GIT_COMMIT: 'deployment-check-fixture', WORLD_VOYAGE_DATA_DIR: temp, ROOM_RECONNECT_GRACE_MS: '30000' }, stdio: ['ignore','pipe','pipe'] });
let logs=''; hub.stdout.on('data', b=>{logs+=b;});hub.stderr.on('data',b=>{logs+=b;});
async function waitForServer(url) {
  for(let i=0;i<100;i++) { try { const r=await fetch(url);if(r.ok)return; } catch {} await new Promise(r=>setTimeout(r,200)); }
  throw new Error('Server unavailable: '+url+'\n'+logs.slice(-5000));
}
async function post(payload) {
  const r=await fetch(base+'/api/arithmetic-race',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});
  const data=await r.json();assert.ok(r.ok,JSON.stringify(data)+'\n'+logs.slice(-3000));return data;
}
function ack(socket,event,payload) {return new Promise((resolve,reject)=>{
  const timer=setTimeout(()=>reject(new Error('socket timeout: '+event)),10000);
  socket.emit(event,payload,result=>{clearTimeout(timer);resolve(result);});
});}
(async()=>{
 let browser, socket;
 const gameSockets=[];
 async function gameClient() {
  const client=new WebSocket(`ws://127.0.0.1:${port}`); gameSockets.push(client);
  await new Promise((resolve,reject)=>{client.once('open',resolve);client.once('error',reject);});
  return client;
 }
 function exchange(client,payload,wanted) {
  return new Promise((resolve,reject)=>{
   const timer=setTimeout(()=>{client.off('message',onMessage);reject(new Error('No '+wanted));},5000);
   function onMessage(raw){const data=JSON.parse(raw);if(data.type===wanted){clearTimeout(timer);client.off('message',onMessage);resolve(data);}}
   client.on('message',onMessage);client.send(JSON.stringify(payload));
  });
 }
 try {
  await waitForServer(base+'/health');
  assert.equal((await (await fetch(base+'/health')).json()).commit, 'deployment-check-fixture');
  await waitForServer(base+'/arithmetic/race');
  await waitForServer(base+'/learn/world-voyage/api/mission-catalog');
  for(const path of ['/learning/class-race/','/learning/class-race/teacher.html','/learning/class-race/apps.js']) {
   const response=await fetch(base+path,{redirect:'manual'});
   assert.equal(response.status,410);assert.equal(response.headers.get('location'),null);
  }
  const gameHost=await gameClient();
  for(const type of ['CREATE_ROOM','JOIN_ROOM']) {
   const retired=await exchange(gameHost,{type,gameId:'quizrace',roomCode:'6193'},'ERROR');
   assert.equal(retired.code,'ACTIVITY_RETIRED');
  }
  await exchange(gameHost,{type:'CREATE_ROOM',gameId:'omok',roomCode:'6193'},'ROOM_CREATED');
  gameHost.close(1000); // Closing a tab also expires an empty game after reconnect grace.
  const emptyRoomCheck=(async()=>{
   await new Promise(resolve=>setTimeout(resolve,31500));
   const guest=await gameClient();
   await exchange(guest,{type:'JOIN_ROOM',gameId:'omok',roomCode:'6193'},'ROOM_NOT_FOUND');
  })();
  assert.equal((await fetch(base+'/internal/room-codes',{method:'POST',headers:{'Content-Type':'application/json'},body:'{"activity":"arithmetic"}'})).status,404);
  const arithmetic=await post({action:'create',worksheetRoute:'/arithmetic/add-subtract-1',name:'선생님'});
  assert.match(arithmetic.roomCode,/^\d{4}$/);
  socket=io(base,{path:'/learn/world-voyage/socket.io',transports:['polling'],forceNew:true,reconnection:false});
  await new Promise((resolve,reject)=>{socket.once('connect',resolve);socket.once('connect_error',reject);});
  const voyage=await ack(socket,'createRoom',{roomType:'free'});
  assert.equal(voyage.ok,true,voyage.error);assert.match(voyage.roomCode,/^\d{4}$/);
  assert.notEqual(voyage.roomCode,arithmetic.roomCode);
  browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
  const context=await browser.newContext({viewport:{width:1024,height:768}});
  await context.route('**/api/auth/me',r=>r.fulfill({json:{guestName:'학생가'}}));
  await context.route('**/api/learning-records/context',r=>r.fulfill({json:{student:{name:'학생가'}}}));
  const student=await context.newPage(), errors=[];
  student.on('pageerror',e=>errors.push(e.message));
  await student.goto(base+'/room/');
  assert.equal(await student.locator('#roomCode').getAttribute('maxlength'),'4');
  await student.fill('#roomCode',arithmetic.roomCode);
  await student.click('button[type=submit]');
  await student.waitForURL('**/arithmetic/race?**');
  await student.getByText('방장이 시작하면 문제지로 바로 이동합니다.').waitFor();
  assert.equal(await student.locator('.race-room-code').textContent(),arithmetic.roomCode);
  await post({action:'start',roomCode:arithmetic.roomCode,hostToken:arithmetic.hostToken});
  await student.waitForURL('**/arithmetic/add-subtract-1?**');
  assert.ok(new URL(student.url()).searchParams.get('participantToken'),'actual student credentials carried to worksheet');
  await student.goto(base+'/room/');
  await student.fill('#roomCode',arithmetic.roomCode);await student.click('button[type=submit]');
  await student.getByText('이미 시작했거나 입장이 닫힌 방입니다.').waitFor();
  assert.ok(student.url().endsWith('/room/'));
  await student.fill('#roomCode',voyage.roomCode);await student.click('button[type=submit]');
  await student.waitForURL('**/learn/world-voyage/?**');
  assert.equal(new URL(student.url()).searchParams.get('name'),'학생가');
  await student.waitForFunction(()=>document.querySelector('#join')?.style.display==='none',null,{timeout:45000});
  assert.equal(await student.locator('#hostBar').isVisible(),false,'student does not acquire host privileges');
  await student.goto(base+'/arithmetic/race');
  await student.getByRole('heading',{name:'순위전 열기'}).waitFor();
  assert.equal(await student.getByRole('heading',{name:'방 참가',exact:true}).count(),0);
  // Ignore existing third-party/renderer failures only if explicitly known; new page errors fail the test.
  assert.deepEqual(errors,[]);
  await emptyRoomCheck;
  console.log('PASS: retired common quiz cannot open or restore; board games still create rooms and empty rooms expire');
  console.log('PASS: real hub + arithmetic + voyage; four-digit allocation, main entry once, student auto-join, host start, worksheet handoff, closed room, private allocation auth');
 } catch(error) {console.error(logs.slice(-5000));throw error;}
 finally {
  gameSockets.forEach(client=>client.close());socket?.close();if(browser)await browser.close();
  if(process.platform==='win32'){try{execFileSync('taskkill',['/pid',String(hub.pid),'/T','/F'],{stdio:'ignore',windowsHide:true});}catch{}}
  else hub.kill('SIGTERM');
 }
})().catch(error=>{console.error(error);process.exitCode=1;});
