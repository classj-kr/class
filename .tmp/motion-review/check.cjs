const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),{spawn}=require('node:child_process');
const root='E:/webprojects/class',project=path.join(root,'learning/inquiry/age-of-exploration'),out=path.join(root,'.tmp/motion-review');
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
  await page.evaluate(async()=>{
   const ack=(event,payload={})=>new Promise(resolve=>socket.emit(event,payload,resolve));
   const room=await ack('createRoom',{roomType:'free'});const result=await ack('joinClass',{roomCode:room.roomCode,name:'이동검사',hostToken:room.hostToken});
   if(!result.ok)throw Error(result.error);finishJoin(result);await ack('hostStartFree');
  });await delay(1500);
  await page.evaluate(()=>{
   window.stats={paints:[],outsideRender:0,offsets:[],raf:0,steps:[]};
   const city=mapCities.find(c=>c.id==='lisbon').cityPoint;
   let lastRendered=globeScreenPoint(city.x,city.y),inside=false;
   const fire=globeMap.fire;globeMap.fire=function(e,...rest){const rendering=(typeof e==='string'?e:e.type)==='render';if(rendering){lastRendered=globeScreenPoint(city.x,city.y);inside=true}try{return fire.call(this,e,...rest)}finally{if(rendering)inside=false}};
   const paint=drawMap;drawMap=function(...args){const result=paint(...args),p=globeScreenPoint(city.x,city.y);stats.paints.push(performance.now());stats.steps.push(p.x);stats.offsets.push(Math.hypot(p.x-lastRendered.x,p.y-lastRendered.y));if(!inside)stats.outsideRender++;return result};
   const tick=()=>{stats.raf++;requestAnimationFrame(tick)};requestAnimationFrame(tick);
  });
  await page.keyboard.down('ArrowLeft');await delay(4000);await page.keyboard.up('ArrowLeft');await delay(400);
  const result=await page.evaluate(()=>{const p=stats.paints,intervals=p.slice(1).map((v,i)=>v-p[i]),steps=stats.steps.slice(1).map((v,i)=>v-stats.steps[i]);return{paints:p.length,raf:stats.raf,outsideRender:stats.outsideRender,maxMapIconOffset:Math.max(...stats.offsets),meanInterval:intervals.reduce((a,b)=>a+b,0)/intervals.length,backsteps:steps.filter(v=>v<-.2).length,globeReady,mode,self:{x:self.x,y:self.y},server:{x:serverSelf.x,y:serverSelf.y}}});
  await page.screenshot({path:path.join(out,(process.argv[2]||'before')+'.png')});
  fs.writeFileSync(path.join(out,(process.argv[2]||'before')+'.json'),JSON.stringify({...result,errors},null,2));console.log(JSON.stringify({...result,errors}));
 }finally{if(browser)await browser.close();if(proxy)await new Promise(r=>proxy.close(r));child.kill()}
})().catch(e=>{console.error(e);process.exitCode=1});
