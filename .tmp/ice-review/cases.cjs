const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),{spawn}=require('node:child_process');
const root='E:/webprojects/class',project=path.join(root,'learning/inquiry/age-of-exploration'),out=path.join(root,'.tmp/ice-review');
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

  await page.evaluate(()=>{socket.disconnect();document.querySelector('#join').style.display='none';self={x:(33.22+180)/360*SPAN,y:(90-78.97)/180*MAP_H,mode:'sea',dir:0,name:'얼음 검사'};serverSelf={...self};joined=true;roomType='free';classSettings={started:false};syncClassClock(220*1440);zoom=1.4;viewMotion.update(self,0,mode);syncGlobeCamera();});await delay(2500);

  const cases=[];
  for(const test of [{name:'arctic-wide',lat:78.97,lon:33.22,z:.68},{name:'arctic-close',lat:78.97,lon:33.22,z:3.6},{name:'south',lat:-68,lon:-40,z:1},{name:'dateline',lat:75,lon:179.7,z:1},{name:'mobile',lat:78.97,lon:33.22,z:.68,mobile:true}]){
    if(test.mobile)await page.setViewport({width:390,height:844,deviceScaleFactor:2});
    await page.evaluate(t=>{self={...self,x:(t.lon+180)/360*SPAN,y:(90-t.lat)/180*MAP_H};serverSelf={...self};zoom=t.z;viewMotion.update(self,0,mode);syncGlobeCamera()},test);await delay(350);
    const r=await page.evaluate(()=>{let count=0;const fill=ctx.fill;ctx.fill=function(...a){count++;return fill.apply(this,a)};const t=performance.now();drawIceLayer(innerWidth,innerHeight,viewPosition().x-viewSpanX/2,viewPosition().y-viewSpanY/2);ctx.fill=fill;return{count,ms:performance.now()-t}});
    if(r.count<5)throw Error(test.name+' missing ice');cases.push({name:test.name,...r});
    await page.screenshot({path:path.join(out,test.name+'.jpg')});
  }
  await page.evaluate(()=>{globeReady=false;globeMap=null});await delay(250);
  const fallback=await page.evaluate(()=>({globeReady,landMask:!!naturalLandMask}));
  if(errors.length)throw Error(errors.join(';'));console.log(JSON.stringify({cases,fallback,errors}));
 }finally{if(browser)await browser.close();if(proxy)await new Promise(r=>proxy.close(r));child.kill()}
})().catch(e=>{console.error(e);process.exitCode=1});
