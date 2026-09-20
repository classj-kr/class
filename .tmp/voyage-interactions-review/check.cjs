const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),{spawn,fork}=require('node:child_process');
const root='E:/webprojects/class',project=path.join(root,'learning/inquiry/age-of-exploration'),out=path.join(root,'.tmp/voyage-interactions-review');
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
  await page.evaluate(async()=>{const ack=(event,payload={})=>new Promise(r=>socket.emit(event,payload,r));const room=await ack('createRoom',{roomType:'free'});const result=await ack('joinClass',{roomCode:room.roomCode,name:'상호작용검사',hostToken:room.hostToken});finishJoin(result);await ack('hostStartFree');});
  await page.waitForFunction('joined && classSettings.started && connectionReady');
  await place({lat:-0.83,lon:-49.03});await page.waitForFunction("discoveryInteraction?.id==='amazon_mouth'&&!discoveryActionBtn.disabled");await delay(450);
  await page.screenshot({path:path.join(out,'amazon.jpg')});
  const point=await page.evaluate(()=>{const item=discoveryPoints.find(d=>d.id==='amazon_mouth');return screenPoint(item.x,item.y,innerWidth,innerHeight)});await page.mouse.click(point.x,point.y);await page.waitForFunction("discoveryView.classList.contains('show')&&discoveryName.textContent.includes('아마존')");await page.click('#discoveryClose');
  await place({lat:-1.64,lon:-48.99,anchor:true});await page.waitForFunction("portInteraction?.kind==='shore'&&!missionActionBtn.disabled");
  const before=await page.evaluate(()=>({id:socket.id,x:serverSelf.x,y:serverSelf.y,anchor:serverSelf.shipAnchorX,token:resumeToken}));
  await page.evaluate(()=>socket.io.engine.close());await page.waitForFunction(id=>socket.id!==id&&connectionReady&&performance.now()-lastSnapshotAt<1000,{},before.id);
  const after=await page.evaluate(()=>({x:serverSelf.x,y:serverSelf.y,anchor:serverSelf.shipAnchorX,host:isHost,net:net.textContent,port:portInteraction?.kind}));assert(after.x===before.x&&after.y===before.y&&after.anchor===before.anchor&&after.host&&after.port==='shore','client restores authoritative player');
  await delay(400);await page.screenshot({path:path.join(out,'reboard.jpg')});const boat=await page.evaluate(()=>screenPoint(serverSelf.shipAnchorX,serverSelf.shipAnchorY,innerWidth,innerHeight));await page.mouse.click(boat.x,boat.y);await page.waitForFunction("mode==='sea'&&!serverSelf.transition");
  await place({city:'찬찬'});await page.waitForFunction("cityInteraction?.placeName==='찬찬'&&!cityActionBtn.disabled");await delay(400);await page.screenshot({path:path.join(out,'chanchan.jpg')});const city=await page.evaluate(()=>{const p=cityCatalogById.get(cityInteraction.placeId).cityPoint;return screenPoint(p.x,p.y,innerWidth,innerHeight)});await page.mouse.click(city.x,city.y);await page.waitForFunction("mode==='city'&&cityView.classList.contains('show')");
  await page.setViewport({width:390,height:844,deviceScaleFactor:1});await page.screenshot({path:path.join(out,'city-mobile.jpg')});await page.click('#leaveCityBtn');await page.waitForFunction("mode==='land'&&!serverSelf.transition");
  await page.evaluate(()=>{connectionReady=false;keys.right=true;window.offlineX=self.x;movePrediction(0.2);keys.right=false});assert(await page.evaluate(()=>self.x===window.offlineX),'no phantom movement while connection unavailable');
  assert(errors.length===0,JSON.stringify(errors));console.log(JSON.stringify({ok:true,discoveryMapClick:true,boatMapClick:true,cityMapClick:true,automaticReconnect:after,offlineMovementBlocked:true,errors}));
 }finally{if(browser)await browser.close();if(proxy)await new Promise(r=>proxy.close(r));child.kill()}
})().catch(e=>{console.error(e);process.exitCode=1});
