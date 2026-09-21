const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),{spawn,fork}=require('node:child_process');
const root='E:/webprojects/class',project=path.join(root,'learning/inquiry/age-of-exploration'),out=path.join(root,'.tmp/voyage-nature-review');
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

  const points=[['batur-caldera',-8.24,115.38,'land'],['milford-sound',-44.62,167.75,'sea'],['chocolate-hills',9.82,124.14,'land'],['palawan-underground-river',10.24,118.925,'sea'],['lm-table-mountain',-33.96,18.41,'sea']];
  for(const [id,lat,lon,mode] of points){
    await place({lat,lon,mode});
    await page.waitForFunction(id=>discoveryInteraction?.id===id&&!discoveryActionBtn.disabled,{},id);
    await page.click('#discoveryActionBtn');
    await page.waitForFunction(()=>discoveryView.classList.contains('show'));
    await page.waitForFunction(()=>[...document.querySelectorAll('#discoveryView img')].every(i=>i.complete&&i.naturalWidth>0));
    await page.screenshot({path:path.join(out,id+'.jpg')});
    if(id==='palawan-underground-river'){await page.setViewport({width:390,height:844,deviceScaleFactor:1});await page.screenshot({path:path.join(out,'mobile.jpg')});await page.setViewport({width:1440,height:900,deviceScaleFactor:1});}
    await page.click('#discoveryClose');
  }
  assert(errors.length===0,JSON.stringify(errors));console.log(JSON.stringify({ok:true,actualDiscoveryButtons:5,desktop:true,mobile:true,errors}));
 }finally{if(browser)await browser.close();if(proxy)await new Promise(r=>proxy.close(r));child.kill()}
})().catch(e=>{console.error(e);process.exitCode=1});
