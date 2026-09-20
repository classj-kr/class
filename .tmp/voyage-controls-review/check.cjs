const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),{spawn}=require('node:child_process');
const root='E:/webprojects/class',project=path.join(root,'learning/inquiry/age-of-exploration'),out=path.join(root,'.tmp/voyage-controls-review');
const puppeteer=require(path.join(root,'node_modules/puppeteer-core'));
const delay=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 let browser,proxy;
 const child=spawn(process.execPath,['server.js'],{cwd:project,env:{...process.env,PORT:'31487',DATA_DIR:path.join(out,'runtime')},windowsHide:true,stdio:['ignore','pipe','pipe']});
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


  await page.waitForSelector('site-back-navigation');await page.waitForSelector('.unified-audio-menu-toggle');
  const assert=(yes,label)=>{if(!yes)throw Error(label)};
  assert(await page.$$eval('.unified-music-control',n=>n.length)===1,'exactly one sound control');
  assert(await page.$eval('.unified-audio-panel',e=>e.hidden),'panel starts collapsed');
  await page.evaluate(async()=>{const ack=(event,payload={})=>new Promise(r=>socket.emit(event,payload,r));const room=await ack('createRoom',{roomType:'free'});const join=await ack('joinClass',{roomCode:room.roomCode,name:'UI 검사',hostToken:room.hostToken});finishJoin(join);await ack('hostStartFree');});
  await page.waitForFunction('joined && classSettings.started');await delay(1000);
  const states=[];
  for(const [width,height] of [[1440,900],[820,600],[390,844],[320,740]]){
    await page.setViewport({width,height,deviceScaleFactor:1});await delay(200);
    const layout=await page.evaluate(()=>{const box=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom}};return {hud:box(document.querySelector('#hud')),back:box(document.querySelector('site-back-navigation')),sound:box(document.querySelector('.unified-music-control')),items:[...document.querySelectorAll('.statusItem')].map(box),banner:getComputedStyle(missionBanner).display}});
    assert(layout.hud.right<=width && layout.hud.height<=58,'compact hud fits '+width);
    assert(layout.banner==='none','no free sailing banner');
    for(const r of layout.items)assert(r.right<=layout.hud.right,'item fits '+width);
    await page.screenshot({path:path.join(out,'controls-'+width+'.jpg')});states.push({width,...layout});
  }
  await page.click('#voyageInfo summary');assert(await page.$eval('#voyageInfo',e=>e.open),'details open');await page.screenshot({path:path.join(out,'info-mobile.jpg')});await page.keyboard.press('Escape');assert(await page.$eval('#voyageInfo',e=>!e.open),'details close');
  await page.click('.unified-audio-menu-toggle');assert(await page.$eval('.unified-audio-panel',e=>!e.hidden),'sound menu open');
  await page.$eval('#musicVolumeSlider',e=>{e.value='0.41';e.dispatchEvent(new Event('input',{bubbles:true}))});
  assert(await page.evaluate(()=>backgroundMusic.getState().volume===0.41&&!backgroundMusic.getState().muted),'regional engine volume');
  await page.focus('#musicVolumeSlider');await page.keyboard.press('ArrowUp');assert(await page.$eval('#musicVolumeSlider',e=>Number(e.value)>0.41),'keyboard slider works');assert(await page.evaluate(()=>!keys.up),'slider does not move ship');
  await page.click('#musicMuteBtn');assert(await page.evaluate(()=>backgroundMusic.getState().muted),'regional engine mute');
  await page.$eval('#sfxVolumeSlider',e=>{e.value='0.23';e.dispatchEvent(new Event('input',{bubbles:true}))});
  assert(await page.evaluate(()=>localStorage.getItem('classSfxVolumeValue')==='0.23'),'effects volume saved');
  await page.click('#sfxMuteBtn');assert(await page.evaluate(()=>localStorage.getItem('classSfxMuted')==='1'),'effects mute saved');
  await page.screenshot({path:path.join(out,'sound-mobile.jpg')});await page.keyboard.press('Escape');assert(await page.$eval('.unified-audio-panel',e=>e.hidden),'sound Escape');
  await page.click('.unified-audio-menu-toggle');await page.click('#clock');assert(await page.$eval('.unified-audio-panel',e=>e.hidden),'sound outside click');
  await page.evaluate(()=>{window.backRequests=0;window.addEventListener('sitebackrequest',e=>{window.backRequests++;e.preventDefault()},{once:true});document.querySelector('site-back-navigation').shadowRoot.querySelector('button').click()});assert(await page.evaluate(()=>window.backRequests===1),'shared back event');
  await page.reload({waitUntil:'domcontentloaded'});await page.waitForSelector('#musicVolumeSlider');
  assert(await page.evaluate(()=>backgroundMusic.getState().muted && backgroundMusic.getState().volume===0.42),'shared music preferences survive reload');
  // Existing pages using an ordinary <audio id=bgm> keep the original path.
  const old=await browser.newPage();old.on('pageerror',e=>errors.push(e.message));await old.setRequestInterception(true);old.on('request',req=>req.url().endsWith('/control-fixture')?req.respond({status:200,contentType:'text/html',body:'<audio id="bgm"></audio><script src="/assets/sound/music-control.js"></script>'}):req.continue());
  await old.goto('http://127.0.0.1:31488/control-fixture',{waitUntil:'load'});await old.waitForSelector('#musicVolumeSlider');await old.$eval('#musicVolumeSlider',e=>{e.value='0.37';e.dispatchEvent(new Event('input',{bubbles:true}))});assert(await old.$eval('#bgm',e=>e.volume===0.37&&!e.muted),'ordinary audio volume');
  await page.evaluate(()=>document.querySelector('site-back-navigation').shadowRoot.querySelector('button').click());await page.waitForFunction(()=>location.pathname==='/');
  assert(!errors.length,JSON.stringify(errors));console.log(JSON.stringify({states,checks:'shared back, compact hud, details, music/sfx, keyboard, persistence, ordinary audio',errors}));
 }finally{if(browser)await browser.close();if(proxy)await new Promise(r=>proxy.close(r));child.kill()}
})().catch(e=>{console.error(e);process.exitCode=1});
