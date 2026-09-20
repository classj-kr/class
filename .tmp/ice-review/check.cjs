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
  const result=await page.evaluate(()=>{const calls=[],orig=ctx.drawImage;ctx.drawImage=function(...a){if(a[0]===ICE_BUF)calls.push(a.slice(1));return orig.apply(this,a)};const t=performance.now();drawMap(innerWidth,innerHeight);ctx.drawImage=orig;const view=viewPosition(),left=view.x-viewSpanX/2,top=view.y-viewSpanY/2,cx0=Math.floor(left/TS)-1,cy0=Math.max(0,Math.floor(top/TS)-1);return{viewSpanX,viewSpanY,day:seasonDay(),type:terrainAtPixel(self.x,self.y).type,edge:UW3Terrain.iceLimitNorthAt(33.22,seasonDay()),buffer:[ICE_BUF.width,ICE_BUF.height],calls:calls.slice(0,3),count:calls.length,first:globeScreenPoint(cx0*TS,cy0*TS),last:globeScreenPoint((cx0+ICE_BUF.width)*TS,(cy0+ICE_BUF.height)*TS),duration:performance.now()-t}});
  await page.screenshot({path:path.join(out,(process.argv[2]||'before')+'.jpg')});console.log(JSON.stringify({result,errors}));
 }finally{if(browser)await browser.close();if(proxy)await new Promise(r=>proxy.close(r));child.kill()}
})().catch(e=>{console.error(e);process.exitCode=1});
