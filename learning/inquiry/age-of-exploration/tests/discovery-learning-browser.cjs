'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {fork,execFileSync}=require('node:child_process');
const {chromium}=require('../../../../game-hub-server/node_modules/playwright');
const runtime=fs.mkdtempSync(path.join(os.tmpdir(),'voyage-learning-browser-'));
const server=fork(path.join(__dirname,'voyage-classroom-browser.cjs'),['--fixture'],{env:{...process.env,PORT:'0',DATA_DIR:runtime},silent:true,windowsHide:true});
let logs='',browser,seq=0;
server.stdout.on('data',d=>logs+=d);server.stderr.on('data',d=>logs+=d);
const place=payload=>new Promise((resolve,reject)=>{
  const request=++seq,timer=setTimeout(()=>reject(Error('fixture timeout')),7000);
  const listener=m=>{if(m.request!==request)return;clearTimeout(timer);server.off('message',listener);m.error?reject(Error(m.error)):resolve(m);};
  server.on('message',listener);server.send({request,name:'검증학생',...payload});
});
async function capture(page,name){
  const target=process.env.VOYAGE_LEARNING_CAPTURE||(process.argv.includes('--capture')?path.resolve(__dirname,'../../../../output/discovery-learning-browser'):null);
  if(!target)return;
  const dir=path.resolve(target);fs.mkdirSync(dir,{recursive:true});
  execFileSync('python',['-c','import sys,io; from PIL import Image; im=Image.open(io.BytesIO(sys.stdin.buffer.read())); im.save(sys.argv[1], "WEBP", lossless=True); check=Image.open(sys.argv[1]); check.load(); assert check.size==im.size and check.convert("RGBA").tobytes()==im.convert("RGBA").tobytes()',path.join(dir,name+'.webp')],{input:await page.screenshot({fullPage:true}),windowsHide:true});
}
(async()=>{try{
  const port=await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error(logs||'server timeout')),20000);server.on('message',m=>{if(m.port){clearTimeout(timer);resolve(m.port);}});});
  const base='http://127.0.0.1:'+port;
  browser=await chromium.launch({channel:'msedge',headless:true});
  const context=await browser.newContext({viewport:{width:1366,height:900}}),teacher=await context.newPage(),student=await context.newPage();
  const errors=[];for(const [name,page] of [['teacher',teacher],['student',student]])page.on('pageerror',e=>errors.push(name+': '+e.message));
  await teacher.goto(base+'/teacher.html?create=race');
  await teacher.waitForFunction(()=>typeof catalog!=='undefined'&&catalog?.discoveries?.length&&/^\d{4}$/.test(hostRoom));
  const room=await teacher.evaluate(()=>hostRoom);
  await teacher.selectOption('#studyKind','discovery');
  assert.equal(await teacher.locator('#studyChoice option').count(),105,'core and exceptional map discoveries are recommended');
  await teacher.fill('#studySearch','스톤헨지');
  assert.equal(await teacher.locator('#studyChoice option').count(),1);
  assert.match(await teacher.locator('#studyPreview').innerText(),/문화·과학 가치/);
  await teacher.locator('#studyAdd').click();
  await teacher.fill('#studySearch','');await teacher.selectOption('#studyLevel','elementary');
  assert.ok(await teacher.locator('#studyChoice option').count()>0);
  await teacher.selectOption('#studyTopic','기후');
  assert.match(await teacher.locator('#studyPreview').innerText(),/학습 목표/);
  assert.match(await teacher.locator('#studySelected').innerText(),/스톤헨지/,'changing filters retains the selection');
  await capture(teacher,'teacher-filters-desktop');
  await teacher.setViewportSize({width:390,height:844});
  assert.equal(await teacher.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,'mobile filters fit the viewport');
  await capture(teacher,'teacher-filters-mobile');
  await teacher.setViewportSize({width:1366,height:900});
  await teacher.selectOption('#studyLevel','all');await teacher.selectOption('#studyTopic','all');await teacher.selectOption('#studyKind','all');await teacher.selectOption('#studyTier','later');
  assert.equal(await teacher.locator('#studyChoice option').count(),5);
  await teacher.fill('#studySearch','베르사유');
  assert.match(await teacher.locator('#studyPreview').innerText(),/현장 발견 수에 포함하지 않습니다/);
  const privateMission=await teacher.evaluate(async()=>{
    const starts=catalog.places.filter(p=>p.isOriginalCity&&p.canEnterFromSea&&p.id!=='lisbon').slice(0,4).map(p=>p.id);
    const duplicate=await ack('teacherPublishArrivalRace',{startPlaceIds:starts,studyTargets:['discovery:giza-pyramids','landmark:lm-giza-from-cairo']});
    if(duplicate.ok)throw Error('duplicate place accepted');
    const r=await ack('teacherPublishArrivalRace',{startPlaceIds:starts,studyTargets:['landmark:lm-giza-from-cairo','landmark:lm-versailles-later']});
    if(!r.ok)throw Error(r.error);return r.mission;
  });
  assert.equal(privateMission.studyTargets[0].key,'discovery:giza-pyramids','new aliases resolve to one target');
  await student.goto(base+'/?room='+room+'&name='+encodeURIComponent('검증학생'));
  await student.waitForFunction(()=>typeof joined!=='undefined'&&joined,null,{timeout:60000});
  await student.locator('.missionChoiceCard').first().click();
  await student.waitForFunction(()=>missionProgress?.selectedStartPlaceId);
  assert.equal((await teacher.evaluate(()=>ack('teacherStartArrivalRace'))).ok,true);
  await student.waitForFunction(()=>activeMission?.phase==='running');
  await place({city:'original_city_145'});
  await student.waitForFunction(()=>mode==='city'&&serverSelf.currentCityId==='original_city_145');
  const opened=await student.evaluate(()=>new Promise(resolve=>socket.emit('inspectLandmark',{id:'lm-giza-from-cairo'},r=>{if(r.ok)VoyageStudyUI.show(r);resolve(r);} )));
  assert.equal(opened.ok,true,opened.error);assert.equal(opened.study.key,'discovery:giza-pyramids');
  assert.equal(opened.study.question,null,'reading comes first');
  assert.match(await student.locator('#placeStudyReading').innerText(),/살펴볼 점/);
  await capture(student,'student-reading');
  await student.setViewportSize({width:390,height:844});
  assert.equal(await student.evaluate(()=>document.querySelector('#placeStudyCard').scrollWidth<=document.querySelector('#placeStudyCard').clientWidth+1),true,'mobile reading fits the card');
  await capture(student,'student-reading-mobile');
  await student.setViewportSize({width:1366,height:900});
  async function solve(target){
    await student.locator('#placeStudySubmit').filter({hasText:'문제 시작'}).click();
    for(let i=0;i<3;i++){
      await student.locator('#placeStudyQuestion label').filter({hasText:target.questions[i].answer}).getByRole('radio').check();
      await student.locator('#placeStudySubmit').click();
      await student.waitForFunction(n=>document.querySelector('#placeStudyStatus').textContent.includes(n===3?'완료':'정답!'),i+1);
    }
  }
  await solve(privateMission.studyTargets[0]);
  await student.locator('#placeStudySubmit').filter({hasText:'계속 탐험하기'}).click();
  await student.waitForFunction(()=>serverSelf.discoveryFound===1);
  const repeated=await student.evaluate(()=>new Promise(resolve=>socket.emit('inspectLandmark',{id:'lm-giza-from-cairo'},resolve)));
  assert.equal(repeated.study.phase,'completed');assert.equal(repeated.self.discoveryFound,1);
  assert.deepEqual(repeated.self.discoveryIds,['giza-pyramids']);
  // Reaching the same target from the world map gives the completed session too.
  await place({lat:29.9792,lon:31.1342});
  const mapVisit=await student.evaluate(key=>new Promise(resolve=>socket.emit('readStudyPlace',{key},resolve)),'discovery:giza-pyramids');
  assert.equal(mapVisit.ok,true,mapVisit.error);assert.equal(mapVisit.study.phase,'completed');
  await place({city:'original_city_210'});
  await student.waitForFunction(()=>mode==='city'&&serverSelf.currentCityId==='original_city_210');
  assert.equal(await student.locator('#laterLandmarkBtn').isVisible(),true);
  await student.locator('#laterLandmarkBtn').click();
  await student.locator('#placeStudyView').waitFor({state:'visible'});
  assert.match(await student.locator('.studyGoal').innerText(),/1520년 이후/);
  await solve(privateMission.studyTargets[1]);
  assert.match(await student.locator('#placeStudyTitle').innerText(),/학습 완료/);
  await capture(student,'student-later-completed');
  await student.locator('#placeStudySubmit').filter({hasText:'계속 탐험하기'}).click();
  await student.waitForFunction(()=>missionProgress?.status==='completed');
  const after=await student.evaluate(()=>({ids:serverSelf.discoveryIds,count:serverSelf.discoveryFound,total:serverSelf.discoveryTotal}));
  assert.equal(after.count,1);assert.equal(after.total,259);assert.ok(after.ids.includes('lm-versailles-later'),'later learning remains in the record');
  await teacher.waitForFunction(()=>document.querySelector('#rankList').textContent.includes('검증학생'));
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({ok:true,recommended:133,filters:true,mobile:true,aliases:true,twoAccessRoutes:true,laterLearning:true,recordsPreserved:true}));
}finally{await browser?.close();server.kill();}})().catch(e=>{console.error(e);if(logs)console.error(logs.slice(-2000));process.exitCode=1;});
