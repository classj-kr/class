const fs=require('node:fs');
const file='.tmp/voyage-study-review/check.cjs';
let source=fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n');
const cut=source.indexOf('  const page=await browser.newPage()');
if(cut<0)throw Error('Browser fixture setup missing');
source=source.slice(0,cut)+`
  const assert=require('node:assert/strict'),errors=[];
  const teacher=await browser.newPage();teacher.on('pageerror',e=>errors.push(e.message));
  await teacher.setViewport({width:1440,height:1000});
  await teacher.goto('http://127.0.0.1:31488/learn/world-voyage/teacher.html?create=race',{waitUntil:'domcontentloaded'});
  await teacher.bringToFront();await teacher.waitForFunction("catalog.discoveries?.length>0 && hostRoom && !$('dash').classList.contains('hidden')");
  assert.equal(await teacher.$('#missionKind'),null);
  assert.equal(await teacher.$('#huntNote'),null);
  assert.ok(!(await teacher.$eval('body',e=>e.textContent)).includes('게임이 알아서'));
  await teacher.click('#publish');
  assert.match(await teacher.$eval('#missionError',e=>e.textContent),/1~3곳/);
  assert.equal(await teacher.evaluate(()=>activeMission),null);
  const targets=['city:lisbon','discovery:batur-caldera','discovery:milford-sound'];
  for(const key of targets){await teacher.select('#studyChoice',key);await teacher.click('#studyAdd');}
  assert.equal(await teacher.$eval('#studyCount',e=>e.textContent),'3/3곳');
  assert.equal(await teacher.$eval('#studyAdd',e=>e.disabled),true);
  await teacher.click('#studySelected li:last-child button');
  assert.equal(await teacher.$eval('#studyAdd',e=>e.disabled),false);
  await teacher.select('#studyChoice',targets[2]);await teacher.click('#studyAdd');
  const starts=await teacher.evaluate(()=>catalog.places.filter(p=>p.isOriginalCity&&p.canEnterFromSea&&p.id!=='lisbon').slice(0,4).map(p=>p.id));
  for(let i=0;i<4;i++)await teacher.select('#start'+(i+1),starts[i]);
  await teacher.click('#publish');await teacher.waitForFunction('activeMission?.studyTargets?.length===3');
  const published=await teacher.evaluate(()=>({keys:activeMission.studyTargets.map(t=>t.key),hunt:activeMission.hunt}));
  assert.deepEqual(published.keys,targets);assert.ok(!published.hunt);
  await teacher.screenshot({path:path.join(out,'teacher-three-places.jpg')});
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({ok:true,noModeSelector:true,noAutomaticAnimalText:true,emptySelectionRejected:true,threePlaceLimit:true,removeAndReadd:true,exactTeacherTargets:true,errors}));
 }finally{child.kill();if(proxy)proxy.closeAllConnections();if(browser)await browser.close();if(proxy)await new Promise(r=>proxy.close(r));child.kill()}
})().catch(e=>{console.error(e);process.exitCode=1});
`;
fs.writeFileSync('.tmp/voyage-study-review/teacher-three.cjs',source);
