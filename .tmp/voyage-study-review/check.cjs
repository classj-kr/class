const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),{spawn,fork}=require('node:child_process');
const root='E:/webprojects/class',project=path.join(root,'learning/inquiry/age-of-exploration'),out=path.join(root,'.tmp/voyage-study-review');
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
  await teacher.setViewport({width:1440,height:1000});
  await teacher.goto('http://127.0.0.1:31488/learn/world-voyage/teacher.html?create=race',{waitUntil:'domcontentloaded'});
  await teacher.bringToFront();await teacher.waitForFunction("catalog.discoveries?.length>0 && hostRoom && !$('dash').classList.contains('hidden')");
  const targets=['city:lisbon','discovery:batur-caldera','discovery:milford-sound','discovery:chocolate-hills','discovery:palawan-underground-river'];
  for(const key of targets){await teacher.select('#studyChoice',key);await teacher.click('#studyAdd');}
  assert(await teacher.$eval('#studyAdd',b=>b.disabled),'five target cap');
  const starts=await teacher.evaluate(()=>catalog.places.filter(p=>p.isOriginalCity&&p.canEnterFromSea&&p.id!=='lisbon').slice(0,4).map(p=>p.id));
  for(let i=0;i<4;i++)await teacher.select('#start'+(i+1),starts[i]);
  await teacher.click('#publish');await teacher.bringToFront();await teacher.waitForFunction('activeMission?.studyTargets?.length===5');
  await teacher.screenshot({path:path.join(out,'teacher-desktop.jpg')});
  const room=await teacher.evaluate(()=>hostRoom);console.log('teacher ready',room);
  await page.evaluate(async room=>{const result=await new Promise((resolve,reject)=>socket.timeout(5000).emit('joinClass',{roomCode:room,name:'화면학습검사'},(e,r)=>e?reject(e):resolve(r)));if(!result.ok)throw Error(result.error);finishJoin(result);},room);
  console.log('student join returned');await page.waitForFunction('joined && activeMission?.studyTargets?.length===5');console.log('student joined');await page.bringToFront();await page.screenshot({path:path.join(out,'student-before-start.jpg')});
  await page.click('.missionChoiceCard[data-option-id="'+starts[0]+'"]');
  console.log('start selected');await teacher.bringToFront();await teacher.waitForFunction("!$('startRace').disabled");await teacher.click('#startRace');await page.bringToFront();await page.waitForFunction("activeMission.phase==='running'");
  await page.bringToFront();if(await page.$eval('#missionPanel',e=>e.classList.contains('show')))await page.click('#missionClose');
  await place({lat:-8.24,lon:115.38});await page.waitForFunction("discoveryInteraction?.id==='batur-caldera'&&!discoveryActionBtn.disabled");
  await page.click('#discoveryActionBtn');await page.waitForFunction("!document.getElementById('placeStudyView').hidden");
  await page.waitForFunction(()=>[...document.querySelectorAll('#placeStudyReading img')].every(i=>i.complete&&i.naturalWidth));
  await page.screenshot({path:path.join(out,'reading-desktop.jpg')});  assert(await page.$eval('#placeStudyReading .photoInfo',e=>!e.open),'photo info is closed by default');
  await page.click('#placeStudyReading .photoInfo>summary');
  assert(await page.$eval('#placeStudyReading .photoInfo',e=>e.open&&e.textContent.includes('CC BY-SA')),'photo attribution remains available on request');
  await page.screenshot({path:path.join(out,'photo-info-open.jpg')});
  await page.click('#placeStudyReading .photoInfo>summary');
  await page.click('#placeStudySubmit');await page.waitForSelector('#placeStudyQuestion input');
  await page.setViewport({width:390,height:844,deviceScaleFactor:1});
  await page.screenshot({path:path.join(out,'question-mobile.jpg')});
  const solve=async wrong=>{
    const passage=await page.$eval('#placeStudyQuestion>p',p=>p.textContent);
    const expected=await teacher.evaluate(p=>activeMission.studyTargets.flatMap(t=>t.questions).find(q=>q.passage===p).answer,passage);
    const choices=await page.$$eval('#placeStudyQuestion label',nodes=>nodes.map(n=>n.textContent));
    let index=choices.indexOf(expected);assert(index>=0,'answer present');
    if(wrong)index=(index+1)%4;
    await page.click('#placeStudyQuestion input[value="'+index+'"]');await page.click('#placeStudySubmit');
  };
  await solve(false);await page.waitForFunction("document.getElementById('placeStudyStatus').textContent.includes('한 문제 더')");
  await solve(true);await page.waitForFunction("document.getElementById('placeStudyStatus').textContent.includes('0/2')");
  assert(await page.$$eval('#placeStudyQuestion input',n=>n.length===0),'wrong answer returns to reading');
  await page.click('#placeStudySubmit');await page.waitForSelector('#placeStudyQuestion input');await solve(false);
  await page.waitForFunction("document.getElementById('placeStudyStatus').textContent.includes('한 문제 더')");
  await solve(false);await page.waitForFunction("document.getElementById('placeStudyTitle').textContent.includes('발견 성공')");
  await page.click('#placeStudySubmit');
  await page.setViewport({width:1440,height:900,deviceScaleFactor:1});
  await place({city:'리스본'});await page.waitForFunction("cityInteraction?.placeName==='리스본'&&!cityActionBtn.disabled");await page.click('#cityActionBtn');
  await page.waitForFunction("mode==='city'");await page.click('#storyBtn');
  await page.waitForFunction("!document.getElementById('placeStudyView').hidden&&document.getElementById('placeStudyTitle').textContent.includes('리스본')");
  await page.screenshot({path:path.join(out,'city-reading.jpg')});
  assert(errors.length===0,JSON.stringify(errors));
  console.log(JSON.stringify({ok:true,teacherSelectFive:true,readingGate:true,consecutiveResetUI:true,discoverySuccessUI:true,cityStoryLaunch:true,mobile:true,errors}));
 }catch(e){console.error('BROWSER FAILURE',e);throw e;}finally{child.kill();if(proxy)proxy.closeAllConnections();if(browser)await browser.close();if(proxy)await new Promise(r=>proxy.close(r));child.kill()}
})().catch(e=>{console.error(e);process.exitCode=1});
