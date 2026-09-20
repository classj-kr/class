const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),{spawn}=require('node:child_process');
const root='E:/webprojects/class',project=path.join(root,'learning/inquiry/age-of-exploration'),out=path.join(root,'.tmp/ship-design-review');
const puppeteer=require(path.join(root,'node_modules/puppeteer-core'));
const delay=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 let browser,proxy;
 const child=spawn(process.execPath,['server.js'],{cwd:project,env:{...process.env,PORT:'31387',DATA_DIR:path.join(out,'runtime')},windowsHide:true,stdio:['ignore','pipe','pipe']});
 let logs='';child.stdout.on('data',d=>logs+=d);child.stderr.on('data',d=>logs+=d);
 try{
  let ready=false;for(let i=0;i<100;i++){try{ready=(await fetch('http://127.0.0.1:31387/health')).ok}catch{}if(ready)break;await delay(150)}if(!ready)throw Error(logs);
  proxy=http.createServer((req,res)=>{
   if(req.url.startsWith('/learn/world-voyage/')){
    const p=http.request({hostname:'127.0.0.1',port:31387,path:req.url.replace('/learn/world-voyage',''),method:req.method,headers:req.headers},r=>{res.writeHead(r.statusCode,r.headers);r.pipe(res)});p.on('error',()=>{res.statusCode=502;res.end()});req.pipe(p);
   }else{
    const file=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));
    if(!file.startsWith(path.resolve(root)+path.sep)){res.statusCode=403;return res.end()}
    const types={'.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.json':'application/json','.pbf':'application/x-protobuf'};
    fs.readFile(file,(e,data)=>{if(e){res.statusCode=404;res.end();return}res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');res.end(data)});
   }
  });await new Promise(r=>proxy.listen(31388,'127.0.0.1',r));
  browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--disable-gpu'],defaultViewport:{width:1200,height:1000,deviceScaleFactor:1}});
  const sheet=await browser.newPage();
  await sheet.setViewport({width:1280,height:1390,deviceScaleFactor:1});
  await sheet.setContent('<html lang="ko"><meta charset="utf-8"><body style="margin:0;background:#102832"><canvas id="sheet" width="1280" height="1390"></canvas></body></html>');
  await sheet.addScriptTag({path:path.join(project,'public/js/ship-designs.js')});
  const renderResult=await sheet.evaluate(()=>{
   const c=document.querySelector('canvas').getContext('2d');c.fillStyle='#102832';c.fillRect(0,0,1280,1390);c.fillStyle='#f2cf78';c.font='bold 25px sans-serif';c.fillText('출발 항구별 선박 · 렌더링 검증',30,44);c.font='14px sans-serif';c.fillStyle='#cadbd7';c.fillText('방향을 바꿔도 돛대가 수직으로 서 있는 8방향 선박',30,76);
   Object.entries(VoyageShips.designs).forEach(([type,v],i)=>{const x=25+(i%3)*420,y=102+Math.floor(i/3)*254;c.fillStyle='#1b485c';c.fillRect(x,y,405,235);c.fillStyle='#f2e5c7';c.font='bold 17px sans-serif';c.fillText(v.name,x+14,y+28);c.font='12px sans-serif';c.fillStyle='#b9ccd0';c.fillText(v.region,x+14,y+49);[3,0,6].forEach((dir,j)=>VoyageShips.draw(c,type,dir,x+70+j*131,y+153,1.55,{moving:true}));});
   let checked=0;
   for(const type of Object.keys(VoyageShips.designs))for(let dir=0;dir<8;dir++){
    const can=document.createElement('canvas');can.width=128;can.height=128;const g=can.getContext('2d');VoyageShips.draw(g,type,dir,64,72,1);
    const pixels=g.getImageData(0,0,128,128).data;let count=0;
    for(let y=0;y<128;y++)for(let x=0;x<128;x++)if(pixels[(y*128+x)*4+3]){count++;if(x<3||x>124||y<3||y>124)throw Error(type+':'+dir+' clipped')}
    if(count<120)throw Error(type+' invisible');checked++;
   }
   return {bearingsChecked:checked};
  });await sheet.screenshot({path:path.join(out,'ships-review.png')});
  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.setViewport({width:1440,height:1000,deviceScaleFactor:1});
  await page.goto('http://127.0.0.1:31388/learn/world-voyage/',{waitUntil:'domcontentloaded'});
  await page.waitForFunction('assetsReady',{timeout:45000});
  await page.evaluate(()=>{document.querySelector('#join').style.display='none';self={...mapCities.find(c=>c.id==='lisbon').cityPoint,name:'리스본 출발',shipType:'galleon',shipScale:1.08,dir:3,mode:'sea'};self.x-=120;self.y+=80;zoom=1.4;ctx.setTransform(dpr,0,0,dpr,0,0);drawMap(innerWidth,innerHeight);drawShipAt(self,true,innerWidth,innerHeight)});
  await delay(1500);
  await page.evaluate(()=>{drawMap(innerWidth,innerHeight);drawShipAt(self,true,innerWidth,innerHeight)});await page.screenshot({path:path.join(out,'map-desktop.png')});
  await page.setViewport({width:390,height:844,deviceScaleFactor:2});
  await page.evaluate(()=>{zoom=.68;ctx.setTransform(dpr,0,0,dpr,0,0);drawMap(innerWidth,innerHeight);drawShipAt(self,true,innerWidth,innerHeight)});await delay(600);await page.evaluate(()=>{drawMap(innerWidth,innerHeight);drawShipAt(self,true,innerWidth,innerHeight)});
  await page.screenshot({path:path.join(out,'map-mobile.png')});
  const result=await page.evaluate(()=>({cities:mapCities.length,globeReady,legendWidth:document.querySelector('#cityLegend>div').getBoundingClientRect().width,legendRight:document.querySelector('#cityLegend>div').getBoundingClientRect().right,screen:innerWidth}));
  if(errors.length)throw Error(JSON.stringify(errors));console.log(JSON.stringify({ok:true,...result,...renderResult,errors,output:out}));
 }finally{if(browser)await browser.close();if(proxy)await new Promise(r=>proxy.close(r));child.kill()}
})().catch(e=>{console.error(e);process.exitCode=1});
