const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),{spawn,fork}=require('node:child_process');
const root='E:/webprojects/class',project=path.join(root,'learning/inquiry/age-of-exploration'),out=path.join(root,'.tmp/voyage-region-ui');
const puppeteer=require(path.join(root,'node_modules/puppeteer-core'));
const delay=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 let browser,proxy;
 const child=fork(path.join(project,'tests/interaction-recovery-smoke.js'),['--fixture'],{cwd:project,env:{...process.env,PORT:'31487',DATA_DIR:path.join(out,'runtime')},windowsHide:true,stdio:['ignore','pipe','pipe','ipc']});
 let logs='';child.stdout.on('data',d=>logs+=d);child.stderr.on('data',d=>logs+=d);
 try{
  let ready=false;for(let i=0;i<100;i++){try{ready=(await fetch('http://127.0.0.1:31487/health')).ok}catch{}if(ready)break;await delay(150)}if(!ready)throw Error(logs);
  proxy=http.createServer((req,res)=>{
   if(req.url.startsWith('/learn/world-voyage/')){
    const p=http.request({hostname:'127.0.0.1',port:31487,path:req.url.replace('/learn/world-voyage',''),method:req.method,headers:req.headers},r=>{res.writeHead(r.statusCode,r.headers);r.pipe(res)});p.on('error',()=>{res.statusCode=502;res.end()});req.pipe(p);
   }else{
    const file=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));
    if(!file.startsWith(path.resolve(root)+path.sep)){res.statusCode=403;return res.end()}
    const types={'.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.json':'application/json','.pbf':'application/x-protobuf'};
    fs.readFile(file,(e,data)=>{if(e){res.statusCode=404;res.end();return}res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');res.end(data)});
   }
  });await new Promise(r=>proxy.listen(31488,'127.0.0.1',r));
  browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--disable-gpu'],defaultViewport:{width:1200,height:1000,deviceScaleFactor:1}});

  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.setViewport({width:1440,height:900,deviceScaleFactor:1});
  await page.goto('http://127.0.0.1:31488/learn/world-voyage/',{waitUntil:'domcontentloaded'});
  await page.waitForFunction('assetsReady && globeReady && socket.connected',{timeout:45000});


  const assert=(v,m)=>{if(!v)throw Error(m)};let seq=0;
  const place=async payload=>{const id=await page.evaluate(()=>socket.id);return new Promise((resolve,reject)=>{const request=++seq;const timer=setTimeout(()=>reject(Error('fixture timeout')),5000);function listener(m){if(m.request!==request)return;child.off('message',listener);clearTimeout(timer);m.error?reject(Error(m.error)):resolve(m)}child.on('message',listener);child.send({request,id,command:'place',...payload})})};

  const teacher=await browser.newPage();teacher.on('pageerror',e=>errors.push(e.message));
  await teacher.goto('http://127.0.0.1:31488/learn/world-voyage/teacher.html?create=race',{waitUntil:'domcontentloaded'});
  await teacher.bringToFront();await teacher.waitForFunction("catalog.discoveries?.length>0 && hostRoom && !$('dash').classList.contains('hidden')");
  const targets=['discovery:andes','discovery:alps','discovery:sahara'];
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
  for(const[id,lat,lon]of[['andes',-33,-70],['alps',47,13],['sahara',26,-5]]){
    await place({lat,lon});await page.waitForFunction(id=>discoveryInteraction?.id===id&&!discoveryActionBtn.disabled,{},id);
    if(id==='andes')await page.screenshot({path:path.join(out,'andes-region-map.jpg')});await page.click('#discoveryActionBtn');await status('설명을 읽고');
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
