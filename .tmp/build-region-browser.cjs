const fs=require('node:fs'),path=require('node:path');const out=path.join(__dirname,'voyage-region-ui');fs.mkdirSync(out,{recursive:true});
let prefix=fs.readFileSync(path.join(__dirname,'voyage-mission-audit/check.cjs'),'utf8').replace(/\r\n/g,'\n');
prefix=prefix.slice(0,prefix.indexOf('  const status=needle=>')).replace("out=path.join(root,'.tmp/voyage-mission-audit')","out=path.join(root,'.tmp/voyage-region-ui')").replace("targets=['city:lisbon','discovery:batur-caldera','discovery:milford-sound']","targets=['discovery:andes','discovery:alps','discovery:sahara']");
const body=String.raw`
  const status=needle=>page.waitForFunction(needle=>document.getElementById('placeStudyStatus').textContent.includes(needle),{},needle);
  for(const[id,lat,lon]of[['andes',-33,-70],['alps',47,13],['sahara',26,-5]]){
    await place({lat,lon});await page.waitForFunction(id=>discoveryInteraction?.id===id&&!discoveryActionBtn.disabled,{},id);
    await page.click('#discoveryActionBtn');await status('설명을 읽고');
    if(id==='andes')await page.screenshot({path:path.join(out,'andes-region-reading.jpg')});
    await page.click('#placeStudySubmit');await page.waitForSelector('#placeStudyQuestion input');
    if(id==='sahara'){await page.setViewport({width:390,height:844});await page.screenshot({path:path.join(out,'sahara-question-mobile.jpg')});}
    await solve(false);await status('2문제 더');await solve(false);await status('1문제 더');await solve(false);await status('연속 정답 · 완료');await page.click('#placeStudySubmit');
  }
  await page.waitForFunction(()=>missionProgress.status==='completed');
  const completion=await page.evaluate(()=>({status:missionProgress.status,rank:missionProgress.finishRank,places:missionProgress.studyPlaces}));
  await teacher.bringToFront();await teacher.waitForFunction(()=>progress[0]?.status==='completed');
  assert(completion.rank===1&&completion.places.every(p=>p.streak===3),'three distant regions complete');assert(errors.length===0,JSON.stringify(errors));
  const result={ok:true,actualBrowserFlow:true,regions:3,desktopAndMobile:true,completion,errors};fs.writeFileSync(path.join(out,'result.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));
 }finally{child.kill();if(proxy)proxy.closeAllConnections();if(browser)await browser.close();if(proxy)await new Promise(r=>proxy.close(r));child.kill()}
})().catch(e=>{console.error(e);process.exitCode=1});
`;
fs.writeFileSync(path.join(out,'check.cjs'),prefix+body);
