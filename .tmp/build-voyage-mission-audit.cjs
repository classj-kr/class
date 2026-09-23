const fs=require('node:fs');
let source=fs.readFileSync('.tmp/voyage-cloud-review/check.cjs','utf8').replace(/\r\n/g,'\n').replace('.tmp/voyage-cloud-review','.tmp/voyage-mission-audit');
const cut=source.indexOf("  await page.evaluate(async()=>{const ack=");
if(cut<0)throw Error('Browser fixture prefix missing');
fs.mkdirSync('.tmp/voyage-mission-audit',{recursive:true});
source=source.slice(0,cut)+String.raw`
  const teacher=await browser.newPage();teacher.on('pageerror',e=>errors.push(e.message));
  await teacher.goto('http://127.0.0.1:31488/learn/world-voyage/teacher.html?create=race',{waitUntil:'domcontentloaded'});
  await teacher.bringToFront();await teacher.waitForFunction("catalog.discoveries?.length>0 && hostRoom && !$('dash').classList.contains('hidden')");
  const targets=['city:lisbon','discovery:batur-caldera','discovery:milford-sound'];
  for(const key of targets){await teacher.select('#studyChoice',key);await teacher.click('#studyAdd');}
  const starts=await teacher.evaluate(()=>catalog.places.filter(p=>p.isOriginalCity&&p.canEnterFromSea&&p.id!=='lisbon').slice(0,4).map(p=>p.id));
  for(let i=0;i<4;i++)await teacher.select('#start'+(i+1),starts[i]);
  await teacher.click('#publish');await teacher.waitForFunction('activeMission?.studyTargets?.length===3');
  const room=await teacher.evaluate(()=>hostRoom);
  await page.bringToFront();await page.evaluate(async room=>{const r=await new Promise((resolve,reject)=>socket.timeout(5000).emit('joinClass',{roomCode:room,name:'미션검사학생'},(e,r)=>e?reject(e):resolve(r)));if(!r.ok)throw Error(r.error);finishJoin(r);},room);
  await page.waitForFunction('joined && activeMission?.studyTargets?.length===3');
  await page.click('.missionChoiceCard[data-option-id="'+starts[0]+'"]');
  await teacher.bringToFront();await teacher.waitForFunction("!$('startRace').disabled");await teacher.click('#startRace');
  await page.bringToFront();await page.waitForFunction("activeMission.phase==='running'");
  if(await page.$eval('#missionPanel',e=>e.classList.contains('show')))await page.click('#missionClose');
  const solve=async wrong=>{
    const passage=await page.$eval('#placeStudyQuestion>p',p=>p.textContent);
    const expected=await teacher.evaluate(p=>activeMission.studyTargets.flatMap(t=>t.questions).find(q=>q.passage===p).answer,passage);
    const choices=await page.$$eval('#placeStudyQuestion label',nodes=>nodes.map(n=>n.textContent));
    let index=choices.indexOf(expected);assert(index>=0,'correct answer is in options');if(wrong)index=(index+1)%4;
    await page.click('#placeStudyQuestion input[value="'+index+'"]');await page.click('#placeStudySubmit');
  };
  const status=needle=>page.waitForFunction(needle=>document.getElementById('placeStudyStatus').textContent.includes(needle),{},needle);
  await place({lat:-8.24,lon:115.38});await page.waitForFunction("discoveryInteraction?.id==='batur-caldera'&&!discoveryActionBtn.disabled");
  await page.click('#discoveryActionBtn');await page.waitForFunction("!document.getElementById('placeStudyView').hidden");
  await page.click('#placeStudySubmit');await page.waitForSelector('#placeStudyQuestion input');
  await solve(false);await status('2문제 더');await solve(false);await status('1문제 더');await solve(true);await status('0/3');
  await page.click('#placeStudySubmit');await page.waitForSelector('#placeStudyQuestion input');
  // Server accepts the answer, but its acknowledgement fails to reach the UI.
  await page.evaluate(()=>{
    const original=socket.emit;
    socket.emit=function(event,...args){
      if(event!=='answerStudyQuestion')return original.call(this,event,...args);
      socket.emit=original;const callback=args.pop();
      return original.call(this,event,...args,(error,result)=>{window.auditAccepted=result;callback(new Error('simulated lost acknowledgement'));});
    };
  });
  await solve(false);await status('연결을 확인');
  await page.waitForFunction("missionProgress.studyPlaces.find(p=>p.key==='discovery:batur-caldera').streak===1");
  await solve(false);await status('현재 문제의 답');
  const lostAck=await page.evaluate(()=>({serverStreak:missionProgress.studyPlaces.find(p=>p.key==='discovery:batur-caldera').streak,shownQuestion:document.querySelector('#placeStudyQuestion h3').textContent,error:document.getElementById('placeStudyStatus').textContent}));
  await page.screenshot({path:path.join(out,'lost-ack-stale-question.jpg')});
  await page.click('#placeStudyClose');await page.click('#discoveryActionBtn');await status('1/3');
  await solve(false);await status('1문제 더');await solve(false);await page.waitForFunction("document.getElementById('placeStudyTitle').textContent.includes('발견 성공')");await page.click('#placeStudySubmit');
  await place({lat:-44.62,lon:167.75,mode:'sea'});await page.waitForFunction("discoveryInteraction?.id==='milford-sound'&&!discoveryActionBtn.disabled");
  await page.click('#discoveryActionBtn');await status('설명을 읽고');await page.click('#placeStudySubmit');await page.waitForSelector('#placeStudyQuestion input');
  await page.setViewport({width:390,height:844});await page.screenshot({path:path.join(out,'quiz-mobile.jpg')});
  await solve(false);await status('2문제 더');await solve(false);await status('1문제 더');await solve(false);await page.waitForFunction("document.getElementById('placeStudyTitle').textContent.includes('발견 성공')");await page.click('#placeStudySubmit');
  await page.setViewport({width:1440,height:900});await place({city:'리스본'});await page.waitForFunction("cityInteraction?.placeName==='리스본'&&!cityActionBtn.disabled");await page.click('#cityActionBtn');
  await page.waitForFunction("mode==='city'");await page.click('#storyBtn');await status('설명을 읽고');await page.click('#placeStudySubmit');await page.waitForSelector('#placeStudyQuestion input');
  await solve(false);await status('2문제 더');await solve(false);await status('1문제 더');await solve(false);await page.waitForFunction("missionProgress.status==='completed'");
  const completion=await page.evaluate(()=>({status:missionProgress.status,rank:missionProgress.finishRank,places:missionProgress.studyPlaces}));
  await teacher.bringToFront();await teacher.waitForFunction("progress[0]?.status==='completed'");await teacher.screenshot({path:path.join(out,'teacher-completed.jpg')});
  assert(errors.length===0,JSON.stringify(errors));
  const result={ok:true,actualBrowserFlow:true,wrongThirdResets:true,manualRecoveryWorks:true,lostAck,completion,errors};
  fs.writeFileSync(path.join(out,'result.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));
 }finally{child.kill();if(proxy)proxy.closeAllConnections();if(browser)await browser.close();if(proxy)await new Promise(r=>proxy.close(r));child.kill()}
})().catch(e=>{console.error(e);process.exitCode=1});
`;
fs.writeFileSync('.tmp/voyage-mission-audit/check.cjs',source);
