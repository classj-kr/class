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
