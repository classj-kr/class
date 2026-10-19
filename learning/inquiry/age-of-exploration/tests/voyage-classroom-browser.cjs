'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { fork } = require('node:child_process');
const project = path.resolve(__dirname, '..');
if (process.argv.includes('--fixture')) {
  const Module = require('node:module'), file = path.join(project, 'server.js');
  const mod = new Module(file, module); mod.filename = file; mod.paths = Module._nodeModulePaths(project);
  let source = fs.readFileSync(file, 'utf8');
  source = source.replace('const app = express();', `const app = express();
    app.use('/learning',express.static(${JSON.stringify(path.resolve(project, '../..'))}));
    app.use('/assets',express.static(${JSON.stringify(path.resolve(project, '../../../assets'))}));
    app.use((req,res,next)=>{req.url=req.url.replace(/^\\/learn\\/world-voyage/,'')||'/';next()});`);
  source = source.replace('serveClient: true,', "serveClient: true, path:'/learn/world-voyage/socket.io',");
  mod._compile(source + `
    server.on('listening',()=>process.send({port:server.address().port}));
    process.on('message',m=>{try{
      const p=[...rooms.values()].flatMap(r=>[...r.values()]).find(p=>p.name===m.name);
      if(!p)throw Error('missing player');
      stopPlayer(p);p.transition=null;
      if(m.city){const city=RESOLVED_PLACES.get(m.city);setModeAt(p,'city',city.landPoint);p.currentCityId=city.id;p.lastCityId=city.id;p.shipPortId=city.id;}
      else setModeAt(p,m.mode||'land',{x:(m.lon+180)/360*WORLD_PIXEL_W,y:(90-m.lat)/180*WORLD_PIXEL_H});
      process.send({request:m.request,player:publicPlayer(p)});
    }catch(e){process.send({request:m.request,error:e.message})}});
  `, file);
} else {
  const { chromium } = require('../../../../game-hub-server/node_modules/playwright');
  const runtime = fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'voyage-browser-'));
  const server = fork(__filename, ['--fixture'], { env: { ...process.env, PORT: '0', DATA_DIR: runtime }, silent: true, windowsHide: true });
  let logs = '', browser, seq = 0;
  server.stdout.on('data', d => logs += d); server.stderr.on('data', d => logs += d);
  const place = payload => new Promise((resolve, reject) => {
    const request = ++seq, timer = setTimeout(() => reject(Error('fixture timeout')), 5000);
    const listener = m => { if (m.request !== request) return; clearTimeout(timer); server.off('message', listener); m.error ? reject(Error(m.error)) : resolve(m); };
    server.on('message', listener); server.send({ request, name: '검증학생', ...payload });
  });
  (async () => {
    try {
      const port = await new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(Error(logs || 'server timeout')), 15000);
        server.on('message', m => { if (m.port) { clearTimeout(timer); resolve(m.port); } });
      });
      const base = 'http://127.0.0.1:' + port;
      browser = await chromium.launch({ channel: 'msedge', headless: true });
      const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
      const teacher = await context.newPage(), student = await context.newPage();
      const errors = []; teacher.on('pageerror', e => errors.push('teacher: ' + e.message)); student.on('pageerror', e => errors.push('student: ' + e.message));
      await teacher.goto(base + '/teacher.html?create=race');
      await teacher.waitForFunction(() => typeof hostRoom !== 'undefined' && /^\d{4}$/.test(hostRoom));
      const room = await teacher.evaluate(() => hostRoom);
      await teacher.waitForFunction(() => catalog.places.length > 0);
      const mission = await teacher.evaluate(async () => {
        const starts=catalog.places.filter(p=>p.isOriginalCity&&p.canEnterFromSea&&p.id!=='lisbon').slice(0,4).map(p=>p.id);
        const r = await ack('teacherPublishArrivalRace', { startPlaceIds: starts, studyTargets: ['city:lisbon','discovery:batur-caldera'] });
        if (!r.ok) throw Error(r.error); return r.mission;
      });
      await student.goto(base + '/?room=' + room + '&name=' + encodeURIComponent('검증학생'));
      await student.waitForFunction(() => typeof joined !== 'undefined' && joined, null, { timeout: 60000 });
      await student.locator('.missionChoiceCard').first().click();
      await student.waitForFunction(() => missionProgress?.selectedStartPlaceId);
      assert.equal((await teacher.evaluate(() => ack('teacherStartArrivalRace'))).ok, true);
      await student.waitForFunction(() => activeMission?.phase === 'running');
      // A held key at a real coastline must not produce a second, divergent voyage
      // on the client, repeatedly dragged back by authoritative snapshots.
      await place({lat:38.5,lon:-9.5,mode:'sea'});
      await student.waitForTimeout(250);
      await student.evaluate(() => {
        window.motionSamples=[];
        const handler=socket.listeners('snapshot')[0];socket.off('snapshot',handler);
        socket.on('snapshot',s=>{
          const before={x:self.x,y:self.y},old={x:serverSelf.x,y:serverSelf.y},subject=self;
          handler(s);
          window.motionSamples.push({stableSubject:self===subject,correction:Math.hypot(self.x-before.x,self.y-before.y),authoritative:Math.hypot(s.you.x-old.x,s.you.y-old.y)});
        });
      });
      await student.locator('#plus').click();
      await student.keyboard.down('ArrowRight');
      await student.waitForTimeout(5000);
      await student.keyboard.up('ArrowRight');
      const movement=await student.evaluate(()=>motionSamples);
      assert.ok(movement.some(s=>s.authoritative>0),'directional input must move the ship after clicking zoom');
      assert.ok(movement.every(s=>Math.abs(s.correction-s.authoritative)<.001),'client must not move independently and get pulled back at the coast');
      assert.ok(movement.every(s=>s.stableSubject),'snapshot updates must preserve the visual follower, not snap it every 100 ms');
      console.log(JSON.stringify({coastalSamples:movement.length,maxCorrection:Math.max(...movement.map(s=>s.correction)),maxAuthoritative:Math.max(...movement.map(s=>s.authoritative))}));
      for (const target of mission.studyTargets) {
        await place(target.kind === 'city' || target.key === 'city:lisbon' ? {city:'lisbon'} : {lat:-8.24,lon:115.38});
        await student.waitForTimeout(250);
        await student.evaluate(key => VoyageStudyUI.request(key), target.key);
        await student.locator('#placeStudySubmit').filter({hasText:'문제 시작'}).click();
        for (let i = 0; i < 3; i++) {
          const answer = target.questions[i].answer;
          await student.locator('#placeStudyQuestion label').filter({hasText:answer}).getByRole('radio').check();
          await student.locator('#placeStudySubmit').click();
          await student.waitForFunction(n => document.querySelector('#placeStudyStatus').textContent.includes(n === 3 ? '완료' : '정답!'), i + 1);
        }
        await student.locator('#placeStudySubmit').filter({hasText:'계속 탐험하기'}).click();
      }
      await student.waitForFunction(() => missionProgress?.status === 'completed');
      await teacher.waitForFunction(() => document.querySelector('#rankList').textContent.includes('검증학생'));
      assert.match(await teacher.locator('#rankList').innerText(), /2\/2 완료/);
      await place({city:'lisbon'});
      await student.waitForFunction(()=>mode==='city'&&!serverSelf.transition);
      await student.locator('#departCityBtn').click();
      await student.waitForFunction(()=>mode==='sea'&&!serverSelf.transition);
      await student.locator('#missionActionBtn').click();
      await student.waitForFunction(()=>mode==='city'&&!serverSelf.transition);
      await student.locator('#leaveCityBtn').click();
      await student.waitForFunction(()=>mode==='land'&&!serverSelf.transition);
      await student.locator('#cityActionBtn').click();
      await student.waitForFunction(()=>mode==='city'&&!serverSelf.transition);
      await student.locator('#departCityBtn').click();
      await student.waitForFunction(()=>mode==='sea'&&!serverSelf.transition);
      await student.reload();
      await student.waitForFunction(() => joined && missionProgress?.status === 'completed', null, {timeout:60000});
      assert.equal(await student.evaluate(() => missionProgress.finishRank), 1);
      await teacher.reload();
      await teacher.waitForFunction(() => document.querySelector('#rankList').textContent.includes('검증학생'));
      let stored;
      for(let attempt=0;attempt<20;attempt++){
        try{stored=JSON.parse(fs.readFileSync(path.join(runtime,'classroom-state.json'),'utf8')).rooms[room]?.progress?.['검증학생']?.[mission.id];}catch{}
        if(stored?.status==='completed')break;
        await new Promise(resolve=>setTimeout(resolve,100));
      }
      assert.equal(stored?.status,'completed','completion must reach disk');
      const Store=require('../lib/classroom-store');
      const restored=new Store({dataDir:runtime}).studentProgress(room,'검증학생',mission.id,false);
      assert.equal(restored?.status,'completed');assert.equal(restored.finishRank,1);
      assert.equal(Object.values(restored.placeStudy.places).filter(p=>p.phase==='completed').length,2);
      assert.deepEqual(errors, []);
      console.log(JSON.stringify({ok:true,browser:'Edge',portBoarding:true,landCityReturn:true,completionVisible:true,teacherRank:true,reloadKeepsCompletion:true,persistedCompletion:true}));
    } finally { await browser?.close(); server.kill(); }
  })().catch(e => { console.error(e); console.error(logs); process.exitCode = 1; });
}
