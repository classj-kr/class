const fs=require('node:fs'),path=require('node:path');
const dir=path.join(__dirname,'voyage-study-recovery');fs.mkdirSync(dir,{recursive:true});
const original=fs.readFileSync(path.join(__dirname,'voyage-mission-audit/check.cjs'),'utf8').replace(/\r\n/g,'\n');
const prefix=original.slice(0,original.indexOf('  const status=needle=>')).replace("out=path.join(root,'.tmp/voyage-mission-audit')","out=path.join(root,'.tmp/voyage-study-recovery')");
const body=String.raw`
  const status=needle=>page.waitForFunction(needle=>document.getElementById('placeStudyStatus').textContent.includes(needle),{},needle);
  const question=number=>page.waitForFunction(number=>document.querySelector('#placeStudyQuestion h3')?.textContent.startsWith(number+'번')&&!document.getElementById('placeStudySubmit').disabled,{},number);
  await page.evaluate(()=>{
    window.auditFaults=[];window.auditHeld=[];window.auditRequests=[];
    const original=socket.emit;
    socket.emit=function(event,...args){
      if(['answerStudyQuestion','readStudyPlace','startStudyQuiz','resumeVoyager'].includes(event))window.auditRequests.push({event,ready:connectionReady});
      const index=window.auditFaults.findIndex(f=>f.event===event);
      if(index<0)return original.call(this,event,...args);
      const fault=window.auditFaults.splice(index,1)[0],callback=args.pop();
      if(fault.kind==='undelivered'){this.flags={};callback(Error('simulated request not delivered'));return this;}
      return original.call(this,event,...args,(error,result)=>{
        window.auditAccepted=result;
        if(fault.kind==='hold'){window.auditHeld.push({callback,error,result});return;}
        if(fault.kind==='disconnect')socket.disconnect();
        callback(Error('simulated lost acknowledgement'));
      });
    };
  });
  const fault=(event,kind='lost')=>page.evaluate(f=>window.auditFaults.push(f),{event,kind});
  const release=()=>page.evaluate(()=>{const h=window.auditHeld.shift();h.callback(h.error,h.result);});
  const openDiscovery=async id=>{await page.waitForFunction(id=>discoveryInteraction?.id===id&&!discoveryActionBtn.disabled,{},id);await page.click('#discoveryActionBtn');await page.waitForFunction(()=>!document.getElementById('placeStudyView').hidden);};
  const cases=[];
  await place({lat:-8.24,lon:115.38});await openDiscovery('batur-caldera');await status('설명을 읽고');
  await fault('startStudyQuiz');await page.click('#placeStudySubmit');await question(1);await status('0/3');cases.push('lost quiz-start acknowledgement');
  await fault('answerStudyQuestion','undelivered');await solve(false);await question(1);await status('0/3');
  assert(await page.evaluate(()=>missionProgress.studyPlaces.find(p=>p.key==='discovery:batur-caldera').streak===0),'undelivered answer not counted');cases.push('undelivered answer retains question');
  await solve(false);await question(2);await solve(false);await question(3);
  await fault('answerStudyQuestion');await solve(true);await status('0/3');assert(await page.$eval('#placeStudySubmit',n=>n.textContent.includes('문제 시작')),'lost wrong answer restores reading');cases.push('lost wrong third answer resets streak');
  await page.click('#placeStudySubmit');await question(1);
  await fault('answerStudyQuestion');await solve(false);await question(2);await status('1/3');cases.push('accepted answer resumes next question');
  await fault('answerStudyQuestion','disconnect');await solve(false);
  await page.waitForFunction(()=>!socket.connected&&document.getElementById('placeStudySubmit').disabled);await status('연결되면');
  await page.screenshot({path:path.join(out,'waiting-for-reconnect.jpg')});
  await page.evaluate(()=>socket.connect());await page.waitForFunction(()=>connectionReady&&!resumePending);await question(3);await status('2/3');
  assert(await page.evaluate(()=>{const log=window.auditRequests;const at=log.map(e=>e.event).lastIndexOf('resumeVoyager');return at>=0&&log.slice(at+1).some(e=>e.event==='readStudyPlace'&&e.ready);}), 'restore happens after player resume');cases.push('real socket disconnect and resume');
  await fault('answerStudyQuestion');await fault('readStudyPlace');await solve(false);await status('応答'.replace('応答','응답'));
  assert(await page.$eval('#placeStudySubmit',n=>!n.disabled&&n.formNoValidate&&n.textContent==='진행 다시 불러오기'),'failed recovery allows explicit read retry');
  assert(await page.$$eval('#placeStudyQuestion input',inputs=>inputs.every(n=>n.disabled)),'stale answer input disabled');
  await page.click('#placeStudySubmit');await status('연속 정답 · 완료');await page.waitForFunction(()=>document.getElementById('placeStudyTitle').textContent.includes('발견 성공'));
  await page.screenshot({path:path.join(out,'recovered-completion.jpg')});cases.push('lost final answer and failed recovery retry');await page.click('#placeStudySubmit');

  await place({lat:-44.62,lon:167.75,mode:'sea'});await openDiscovery('milford-sound');await status('설명을 읽고');await page.click('#placeStudySubmit');await question(1);
  await fault('answerStudyQuestion','hold');await solve(false);await page.waitForFunction(()=>window.auditHeld.length===1);await page.click('#placeStudyClose');await release();await delay(150);
  assert(await page.$eval('#placeStudyView',n=>n.hidden),'late answer did not reopen closed UI');cases.push('closed window ignores late answer');
  await openDiscovery('milford-sound');await question(2);await fault('answerStudyQuestion');await fault('readStudyPlace','hold');await solve(false);await page.waitForFunction(()=>window.auditHeld.length===1);await page.click('#placeStudyClose');await release();await delay(150);
  assert(await page.$eval('#placeStudyView',n=>n.hidden),'late recovery did not reopen closed UI');cases.push('closed window ignores late recovery');
  await openDiscovery('milford-sound');await question(3);await solve(false);await status('연속 정답 · 완료');await page.click('#placeStudySubmit');

  await place({city:'리스본'});await page.waitForFunction(()=>cityInteraction?.placeName==='리스본'&&!cityActionBtn.disabled);await page.click('#cityActionBtn');await page.waitForFunction(()=>mode==='city');await page.click('#storyBtn');await status('설명을 읽고');await page.click('#placeStudySubmit');await question(1);
  await solve(false);await question(2);await solve(false);await question(3);await fault('answerStudyQuestion');await solve(false);await status('연속 정답 · 완료');
  await page.waitForFunction(()=>missionProgress.status==='completed');
  const completion=await page.evaluate(()=>({status:missionProgress.status,rank:missionProgress.finishRank,places:missionProgress.studyPlaces}));
  assert(completion.rank===1&&completion.places.every(p=>p.streak===3&&p.phase==='completed'),'all three places complete once');
  cases.push('lost class-final acknowledgement preserves completion and rank');
  await teacher.bringToFront();await teacher.waitForFunction(()=>progress[0]?.status==='completed');await teacher.screenshot({path:path.join(out,'teacher-completed.jpg')});
  assert(errors.length===0,JSON.stringify(errors));
  const requests=await page.evaluate(()=>window.auditRequests);
  const result={ok:true,actualBrowserFlow:true,cases,completion,requests,errors};
  fs.writeFileSync(path.join(out,'result.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));
 }finally{child.kill();if(proxy)proxy.closeAllConnections();if(browser)await browser.close();if(proxy)await new Promise(r=>proxy.close(r));child.kill()}
})().catch(e=>{console.error(e);process.exitCode=1});
`;
fs.writeFileSync(path.join(dir,'check.cjs'),prefix+body);
console.log(path.join(dir,'check.cjs'));
