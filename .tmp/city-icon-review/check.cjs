const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),{spawn}=require('node:child_process');
const root='E:/webprojects/class',project=path.join(root,'learning/inquiry/age-of-exploration'),out=path.join(root,'.tmp/city-icon-review');
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
  await sheet.setContent('<html lang="ko"><meta charset="utf-8"><body style="margin:0;background:#102832"><canvas id="sheet" width="1200" height="1000"></canvas></body></html>');
  await sheet.addScriptTag({path:path.join(project,'public/js/city-icons.js')});
  await sheet.evaluate(()=>{
   const c=document.querySelector('canvas').getContext('2d');c.fillStyle='#102832';c.fillRect(0,0,1200,1000);c.fillStyle='#f2cf78';c.font='bold 25px sans-serif';c.fillText('세계 항해 · 문화권별 도시 아이콘',35,45);c.font='14px sans-serif';c.fillStyle='#d1dfdb';c.fillText('왼쪽: 보통 도시 · 가운데: 대도시 · 오른쪽: 입항 가능한 항구',35,76);
   Object.entries(VoyageCityIcons.styles).forEach(([culture,v],i)=>{const x=35+(i%4)*295,y=110+Math.floor(i/4)*171;c.fillStyle='#183742';c.fillRect(x,y,275,152);c.fillStyle='#f2e5c7';c.font='bold 15px sans-serif';c.fillText(v[0],x+12,y+26);for(let j=0;j<3;j++){VoyageCityIcons.draw(c,{iconCulture:culture,originalCitySize:j===0?2:3,canEnterFromSea:j===2},x+48+j*87,y+98,1);}});
  });await sheet.screenshot({path:path.join(out,'city-icons.png')});
  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.setViewport({width:1440,height:1000,deviceScaleFactor:1});
  await page.goto('http://127.0.0.1:31388/learn/world-voyage/',{waitUntil:'domcontentloaded'});
  await page.waitForFunction('assetsReady',{timeout:45000});
  await page.evaluate(()=>{document.querySelector('#join').style.display='none';self={...mapCities.find(c=>c.id==='lisbon').cityPoint};zoom=1.4;ctx.setTransform(dpr,0,0,dpr,0,0);drawMap(innerWidth,innerHeight)});
  await delay(1500);
  await page.evaluate(()=>drawMap(innerWidth,innerHeight));await page.screenshot({path:path.join(out,'map-desktop.png')});
  await page.setViewport({width:390,height:844,deviceScaleFactor:2});
  await page.evaluate(()=>{zoom=.68;ctx.setTransform(dpr,0,0,dpr,0,0);drawMap(innerWidth,innerHeight)});await delay(600);await page.evaluate(()=>drawMap(innerWidth,innerHeight));
  await page.click('#cityLegend summary');await page.screenshot({path:path.join(out,'map-mobile.png')});
  const result=await page.evaluate(()=>({cities:mapCities.length,globeReady,legendWidth:document.querySelector('#cityLegend>div').getBoundingClientRect().width,legendRight:document.querySelector('#cityLegend>div').getBoundingClientRect().right,screen:innerWidth}));
  if(errors.length)throw Error(JSON.stringify(errors));console.log(JSON.stringify({ok:true,...result,errors,output:out}));
 }finally{if(browser)await browser.close();if(proxy)await new Promise(r=>proxy.close(r));child.kill()}
})().catch(e=>{console.error(e);process.exitCode=1});
