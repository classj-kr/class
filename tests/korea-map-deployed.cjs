// A clean-profile, real-network smoke test. Does not authenticate or change server data.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const puppeteer=require('puppeteer-core');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),out=path.join(root,'outputs/korea-map-deployed');
const url=process.env.MAP_TEST_URL||'https://classj-kr.github.io/class/learning/inquiry/korea-map/index.html';
const expectedCommit=process.env.MAP_EXPECTED_COMMIT||'abddd85c7cce38cec6ff3d4fc9c69d165d311eaa';
assert.match(expectedCommit,/^[0-9a-f]{40}$/);
const normalize=text=>text.replace(/\r\n/g,'\n');
const digest=text=>crypto.createHash('sha256').update(text).digest('hex');
(async()=>{
 fs.mkdirSync(out,{recursive:true});
 const report={testedAt:new Date().toISOString(),url,expectedCommit,authenticated:false,physicalDevice:false,assets:[],journeys:[]};
 const index=await fetch(url);assert.equal(index.status,200);assert.equal(index.url,url);const html=await index.text();
 const files=['index.html',...new Set([...html.matchAll(/(?:src|href)="([^"]+\.(?:js|css)(?:\?[^"]*)?)"/g)].map(match=>match[1])), 'data/watersheds.geojson','data/watershed-notice.html'];
 for(let i=0;i<files.length;i+=5)await Promise.all(files.slice(i,i+5).map(async file=>{
  const response=await fetch(new URL(file,url));assert.equal(response.status,200,file);
  const body=normalize(await response.text()),local=normalize(execFileSync('git',['show',expectedCommit+':learning/inquiry/korea-map/'+file.split('?')[0]],{cwd:root,encoding:'utf8',maxBuffer:16*1024*1024}));
  assert.equal(digest(body),digest(local),`${file}: deployed file differs from the uploaded commit`);
  report.assets.push({file,status:response.status,sha256:digest(body)});
 }));
 const browser=await puppeteer.launch({headless:true,executablePath:process.env.MAP_TEST_BROWSER||'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--no-first-run','--disable-background-networking']});
 try{
  for(const mobile of [false,true]){
   const page=await browser.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
   await page.setViewport({width:mobile?390:1440,height:mobile?844:1000,deviceScaleFactor:mobile?3:1,isMobile:mobile,hasTouch:mobile});
   async function click(selector){const element=await page.waitForSelector(selector,{visible:true});await element.scrollIntoView();if(mobile)await element.tap();else await element.click();}
   await page.goto(url+'?lesson=river#terrain',{waitUntil:'networkidle0'});await page.waitForFunction(()=>document.querySelector('#sceneInsight')?.dataset.basin==='한강');
   await click('.water-life summary');await click('[data-water-open]');
   await page.waitForFunction(()=>{const image=document.querySelector('#placePhoto');return image?.complete&&image.naturalWidth>0&&!image.hidden;});
   const place=await page.$eval('#placeName',e=>e.textContent);const paragraphs=await page.$$eval('#placeDescription p',els=>els.length);assert.equal(paragraphs,2);
   await page.waitForFunction(()=>!document.querySelector('#routeStatus').textContent.includes('찾고 있어요'));
   const routeStatus=await page.$eval('#routeStatus',e=>e.textContent);
   await page.screenshot({path:path.join(out,`${mobile?'mobile':'desktop'}-place.png`)});await click('#placeClose');
   await page.waitForFunction(()=>!document.querySelector('#placeDialog').open);
   await click('#quickPractice');await page.waitForSelector('#practiceDialog[open]');
   const count=await page.$eval('#questionProgress',e=>Number(e.textContent.split('/')[1]));assert.ok(count>0&&count<10);
   for(let n=0;n<count;n++){
    const choice=await page.evaluate(()=>{
     const prompt=document.querySelector('#questionTitle').innerHTML,buttons=[...document.querySelectorAll('#answerOptions button')];
     const labels=buttons.map(b=>b.lastElementChild.textContent);
     const question=KOREA_GEOGRAPHY.questions.find(q=>q.prompt===prompt&&q.options.every(o=>labels.includes(o)));
     if(!question)throw Error('Question not found');return labels.indexOf(question.options[question.answer])+1;
    });
    await click(`#answerOptions button:nth-child(${choice})`);
    await page.waitForFunction(()=>!document.querySelector('#nextQuestion').disabled,{timeout:3000}).catch(async error=>{
     await page.screenshot({path:path.join(out,'answer-failure.png')});
     console.log({mobile,n,choice,state:await page.evaluate(()=>({feedback:document.querySelector('#answerFeedback').textContent,options:[...document.querySelectorAll('#answerOptions button')].map(e=>({text:e.textContent,disabled:e.disabled,classes:e.className}))}))});throw error;
    });
    await click('#nextQuestion');
    await page.waitForFunction((next,total)=>next>total?document.querySelector('#resultDialog').open:document.querySelector('#questionProgress').textContent===`${next} / ${total}`,{},n+2,count);
   }
   await page.waitForSelector('#resultDialog[open]');await page.screenshot({path:path.join(out,`${mobile?'mobile':'desktop'}-result.png`)});await click('#finishPractice');
   await page.waitForFunction(()=>!document.querySelector('#resultDialog').open);
   const records=await page.evaluate(()=>JSON.parse(localStorage.getItem('classj-korea-geography-progress-v2')));assert.ok(Object.keys(records.items).length>=count);
   await click('[data-theme="history"]');await page.waitForSelector('#historyContent');assert.equal(await page.$('#sceneInsight'),null);
   await click('[data-theme="climate"]');await page.select('#lessonSelect','foehn');await page.waitForFunction(()=>document.querySelector('#lessonDiagram')?.dataset.status==='ready');
   await click('[data-mountain-wind="west"]');assert.ok((await page.$eval('.mountain-side.leeward',e=>e.textContent)).includes('강릉'));
   await new Promise(resolve=>setTimeout(resolve,600));
   const mapSpan=await page.$$eval('.mountain-map-air',els=>{const boxes=els.map(e=>e.getBoundingClientRect());return Math.max(...boxes.map(b=>b.right))-Math.min(...boxes.map(b=>b.left));});
   assert.ok(mapSpan>100,'History transition left the mountain map too zoomed out: '+mapSpan);
   const labelsInside=await page.$$eval('.scene-map-label',els=>{
    const labels=els.filter(e=>/^[AB] (진부|강릉)/.test(e.textContent)&&e.getBoundingClientRect().width>0);
    return labels.length===2&&labels.every(e=>{const b=e.getBoundingClientRect(),m=e.closest('.leaflet-container').getBoundingClientRect();return b.left>=m.left&&b.right<=m.right;});
   });
   assert.ok(labelsInside,'Mountain endpoint labels are clipped at the map edge');
   await page.screenshot({path:path.join(out,`${mobile?'mobile':'desktop'}-mountain.png`)});
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);assert.ok(overflow<=1);assert.deepEqual(errors,[]);
   report.journeys.push({mobile,input:mobile?'emulated touch':'mouse',place,paragraphs,questionsCompleted:count,routeStatus,mapSpan,labelsInside,overflow,errors});await page.close();
  }
 }finally{await browser.close();}
 fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({url,matchingAssets:report.assets.length,journeys:report.journeys,physicalDevice:false},null,2));
})().catch(error=>{console.error(error);process.exitCode=1;});
