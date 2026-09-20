const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),{spawn}=require('node:child_process');
const root='E:/webprojects/class',project=path.join(root,'learning/inquiry/age-of-exploration'),out=path.join(root,'.tmp/city-description-review');
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

  const results=await page.evaluate(async()=>{
    const entries=[...cityCatalogById.values()].filter(c=>c.story);if(entries.length!==228)throw Error('city catalog incomplete');
    const city=entries.find(c=>c.name==='청두');serverSelf={currentCityId:city.id};openCityStory();await document.fonts.load('16px "Voyage Batang"');await document.fonts.ready;
    const heading=[...discoveryText.querySelectorAll('.storyHead')].map(n=>n.textContent);if(!heading[0].includes('촉한'))throw Error('Chengdu primary topic');
    if(discoveryKind.textContent.includes('1520'))throw Error('fixed period metadata');
    const bodyFont=getComputedStyle(discoveryText.querySelector('.storyBody')).fontFamily;
    if(!document.fonts.check('16px "Voyage Batang"')||!bodyFont.includes('Voyage Batang'))throw Error('reading font missing');
    return{cities:entries.length,sectionCounts:[...new Set(entries.map(c=>c.story.sections.length))],heading,bodyFont};
  });await page.screenshot({path:path.join(out,'chengdu-desktop.jpg')});
  await page.setViewport({width:390,height:844,deviceScaleFactor:2});await delay(250);await page.screenshot({path:path.join(out,'chengdu-mobile.jpg')});
  await page.evaluate(()=>{discoveryView.classList.remove('show');activeMission={id:'font-review',title:'최종 문제'};missionProgress={finalQuizStatus:'answering',finalQuiz:{targetPlaceName:'청두',questions:[{label:'도시의 역사',passage:'청두는 삼국 시대 촉한의 수도였다. 유비와 제갈량의 흔적은 무후사에서 만날 수 있다.',prompt:'청두와 관련 있는 나라를 고르시오.',choices:['촉한','로마','아스테카','잉카']}]}};renderFinalQuiz();});
  await delay(200);
  const quiz=await page.evaluate(()=>({font:getComputedStyle(document.querySelector('.finalPassage')).fontFamily,choices:document.querySelectorAll('.finalChoice').length,overflow:document.querySelector('#finalQuizQuestions').scrollWidth>document.querySelector('#finalQuizQuestions').clientWidth}));
  await page.screenshot({path:path.join(out,'quiz-mobile.jpg')});if(quiz.overflow||errors.length)throw Error(JSON.stringify({quiz,errors}));console.log(JSON.stringify({results,quiz,errors}));
 }finally{if(browser)await browser.close();if(proxy)await new Promise(r=>proxy.close(r));child.kill()}
})().catch(e=>{console.error(e);process.exitCode=1});
