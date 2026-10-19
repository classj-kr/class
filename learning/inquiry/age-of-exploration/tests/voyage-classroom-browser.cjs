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
      const victoriaOnly=process.argv.includes('--victoria');
      const port = await new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(Error(logs || 'server timeout')), 15000);
        server.on('message', m => { if (m.port) { clearTimeout(timer); resolve(m.port); } });
      });
      const base = 'http://127.0.0.1:' + port;
      browser = await chromium.launch({ channel: 'msedge', headless: true });
      const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
      const teacher = await context.newPage(), student = await context.newPage();
      const errors = []; teacher.on('pageerror', e => errors.push('teacher: ' + e.message)); student.on('pageerror', e => errors.push('student: ' + e.message));
      async function checkVictoriaMarker(completed){
        const labels=await student.evaluate(()=>{
          const previousZoom=zoom,fill=ctx.fillText,labels=[];
          ctx.fillText=function(text,...args){labels.push(text);return fill.call(this,text,...args)};
          try{zoom=minimumMapZoom();drawStudyTargetMarkers(innerWidth,innerHeight);}
          finally{zoom=previousZoom;ctx.fillText=fill;}
          return labels;
        });
        assert.ok(labels.includes((completed?'완료 · ':'미션 · ')+'빅토리아호'),'mission name must remain visible at minimum zoom');
        assert.ok(labels.includes(completed?'✓':'★'),'completion must change the symbol as well as the colour');
        assert.ok(!labels.some(t=>t.includes('폭포')),'the lake mission must not mark Victoria Falls');
        if(process.env.VOYAGE_MARKER_CAPTURE){
          fs.mkdirSync(process.env.VOYAGE_MARKER_CAPTURE,{recursive:true});
          const file=path.resolve(process.env.VOYAGE_MARKER_CAPTURE,completed?'completed.webp':'mission.webp');
          require('node:child_process').execFileSync('python',['-c','import sys,io; from PIL import Image; Image.open(io.BytesIO(sys.stdin.buffer.read())).save(sys.argv[1], "WEBP", lossless=True)',file],{input:await student.screenshot(),windowsHide:true});
        }
      }
      await teacher.goto(base + '/teacher.html?create=race');
      await teacher.waitForFunction(() => typeof hostRoom !== 'undefined' && /^\d{4}$/.test(hostRoom));
      const room = await teacher.evaluate(() => hostRoom);
      await teacher.waitForFunction(() => catalog.places.length > 0);
      const mission = await teacher.evaluate(async victoriaOnly => {
        const starts=catalog.places.filter(p=>p.isOriginalCity&&p.canEnterFromSea&&p.id!=='lisbon').slice(0,4).map(p=>p.id);
        const r = await ack('teacherPublishArrivalRace', { startPlaceIds: starts, studyTargets: victoriaOnly?['discovery:lake-victoria']:['city:lisbon','discovery:batur-caldera'] });
        if (!r.ok) throw Error(r.error); return r.mission;
      },victoriaOnly);
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
        await place(target.key === 'city:lisbon' ? {city:'lisbon'} : target.key==='discovery:lake-victoria'?{lat:.216,lon:33.048}:{lat:-8.24,lon:115.38});
        await student.waitForTimeout(250);
        if(victoriaOnly){
          await student.waitForFunction(()=>discoveryInteraction?.id==='lake-victoria'&&discoveryInteraction.canUse,null,{timeout:5000});
          await checkVictoriaMarker(false);
          await student.locator('#discoveryActionBtn').click();
          assert.equal(await student.locator('#discoveryView').evaluate(el=>el.classList.contains('show')),false,'assigned discovery must open its mission, not the unrelated exploration popup');
        }else await student.evaluate(key => VoyageStudyUI.request(key), target.key);
        await student.locator('#placeStudySubmit').filter({hasText:'문제 시작'}).click();
        for (let i = 0; i < 3; i++) {
          const answer = target.questions[i].answer;
          await student.locator('#placeStudyQuestion label').filter({hasText:answer}).getByRole('radio').check();
          await student.locator('#placeStudySubmit').click();
          await student.waitForFunction(n => document.querySelector('#placeStudyStatus').textContent.includes(n === 3 ? '완료' : '정답!'), i + 1);
        }
        await student.locator('#placeStudySubmit').filter({hasText:'계속 탐험하기'}).click();
        if(victoriaOnly)await checkVictoriaMarker(true);
      }
      await student.waitForFunction(() => missionProgress?.status === 'completed');
      await teacher.waitForFunction(() => document.querySelector('#rankList').textContent.includes('검증학생'));
      assert.ok((await teacher.locator('#rankList').innerText()).includes(`${mission.studyTargets.length}/${mission.studyTargets.length} 완료`));
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
      assert.equal(Object.values(restored.placeStudy.places).filter(p=>p.phase==='completed').length,mission.studyTargets.length);
      assert.deepEqual(errors, []);
      console.log(JSON.stringify({ok:true,browser:'Edge',targets:mission.studyTargets.map(t=>t.key),portBoarding:true,landCityReturn:true,completionVisible:true,teacherRank:true,reloadKeepsCompletion:true,persistedCompletion:true}));
    } finally { await browser?.close(); server.kill(); }
  })().catch(e => { console.error(e); console.error(logs); process.exitCode = 1; });
}
