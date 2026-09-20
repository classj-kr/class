const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict'),vm=require('node:vm'),pp=require('puppeteer-core');
const root=path.resolve(__dirname,'..'),prefix='/learning/inquiry/information-computing/computer-fundamentals/',dir=path.join(root,'docs/computer-analogies');
const data={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,prefix,'textbook/life-figures.js'),'utf8'),data);
const ids=Array.from(data.window.COMPUTER_LIFE_FIGURES.ids);
assert.equal(ids.length,33);
vm.runInNewContext(fs.readFileSync(path.join(root,prefix,'lessons/index-data.js'),'utf8'),data);
assert.deepEqual([...ids,'a01','b01','e04'].sort(),Array.from(data.window.COMPUTER_LESSON_INDEX,e=>e.id).sort(),'Every lesson has a reviewed picture');
const selected=process.env.LIFE_IDS?.split(',').filter(Boolean);
if(selected)assert.ok(selected.every(id=>ids.includes(id)));
const testIds=selected||ids;
const server=http.createServer((req,res)=>{
 let file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);
 if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
 fs.readFile(file,(err,data)=>{if(err){res.writeHead(404).end();return;}res.writeHead(200,{'Content-Type':({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css','.woff2':'font/woff2','.webp':'image/webp','.ogg':'audio/ogg'})[path.extname(file)]||'application/octet-stream'}).end(data);});
});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;const report=[],errors=[];
 try {
  fs.mkdirSync(dir,{recursive:true});
  browser=await pp.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-first-run']});
  const page=await browser.newPage();
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url())});
  for(const id of testIds){
   await page.setViewport({width:1440,height:1050});
   await page.goto('http://127.0.0.1:'+server.address().port+prefix+'lessons/?lesson='+id+'#read',{waitUntil:'networkidle0'});
   await page.waitForSelector('[data-life-figure="'+id+'"] svg');
   const states=await page.$$eval('[data-life-state]',els=>els.map(e=>e.dataset.lifeState));
   const rows=[],clipping=[],drawings=[];
   for(const width of [1440,768,390,320]){
    await page.setViewport({width,height:1000});
    for(const state of states){
     await page.click('[data-life-state="'+state+'"]');
     const actual=await page.$eval('.life-figure',e=>({state:e.dataset.state,pressed:e.querySelectorAll('[aria-pressed=true]').length,explanation:e.querySelector('.life-explanation').textContent,overflow:document.documentElement.scrollWidth>innerWidth+1,images:e.querySelectorAll('svg[role=img][aria-label]').length,drawing:e.querySelector('.life-pair').innerHTML}));
     assert.equal(actual.state,state);assert.equal(actual.pressed,1);assert.equal(actual.images,2);assert.equal(actual.overflow,false,id+' '+width);assert.ok(actual.explanation.length>40);
     if(width===1440)drawings.push(actual.drawing);
     const clipped=await page.$$eval('.life-pair svg text',els=>els.map(e=>{const b=e.getBoundingClientRect(),r=e.ownerSVGElement.getBoundingClientRect();return{text:e.textContent,left:b.left-r.left,top:b.top-r.top,right:b.right-r.right,bottom:b.bottom-r.bottom};}).filter(b=>b.left < -1||b.top < -1||b.right > 1||b.bottom > 1));
     if(clipped.length)clipping.push({width,state,clipped});
     rows.push({width,state});
    }
    await page.click('[data-life-state="0"]');
    if(width===1440||width===390){
     await page.$eval('.life-figure',e=>e.scrollIntoView({block:'start'}));
     await (await page.$('.life-figure')).screenshot({path:path.join(dir,id+'-life-'+width+'.png')});
    }
   }
   assert.equal(new Set(drawings).size,states.length,id+' changes the drawing with every comparison');
   await page.setViewport({width:1440,height:1000});
   await page.click('[data-life-state="0"]');
   // Mouse-independent access and true rendered font.
   await page.focus('[data-life-state="1"]');await page.keyboard.press('Enter');
   assert.equal(await page.$eval('.life-figure',e=>e.dataset.state),'1');
   const cdp=await page.createCDPSession();await cdp.send('DOM.enable');await cdp.send('CSS.enable');const d=await cdp.send('DOM.getDocument');const n=await cdp.send('DOM.querySelector',{nodeId:d.root.nodeId,selector:'.life-explanation'});const fonts=await cdp.send('CSS.getPlatformFontsForNode',{nodeId:n.nodeId});assert.ok(fonts.fonts.some(f=>f.isCustomFont&&/KoPub/.test(f.familyName)),id+' real KoPub font');await cdp.detach();
   if(id==='a04'){
    for(const state of states){
     await page.click('[data-life-state="'+state+'"]');
     const before=await page.$eval('.life-pair',e=>e.innerHTML);
     await page.$eval('[data-life-range]',e=>{e.value=75;e.dispatchEvent(new Event('input',{bubbles:true}));});
     assert.notEqual(await page.$eval('.life-pair',e=>e.innerHTML),before,'A04 slider changes illustration');
     assert.ok(await page.$eval('[data-life-range]',e=>e.getAttribute('aria-valuetext')));
     await page.focus('[data-life-range]');await page.keyboard.press('ArrowRight');
     assert.equal(await page.$eval('[data-life-range]',e=>Number(e.value)),76);
     await (await page.$('.life-figure')).screenshot({path:path.join(dir,'a04-detail-'+state+'.png')});
     await page.$eval('[data-life-range]',e=>{e.value=25;e.dispatchEvent(new Event('input',{bubbles:true}));});
    }
    const mapping=async(state,value)=>{
     await page.click('[data-life-state="'+state+'"]');
     return page.$eval('[data-life-range]',(e,v)=>{e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}));return document.querySelector('.life-range output').value;},value);
    };
    assert.match(await mapping(0,10),/30.20초 → 숫자 표시는 30초/);
    assert.match(await mapping(0,40),/30.80초 → 숫자 표시는 30초/);
    assert.match(await mapping(0,60),/31.20초 → 숫자 표시는 31초/);
    assert.match(await mapping(1,10),/28.0 → 기록 단계 25/);
    assert.match(await mapping(1,15),/32.0 → 기록 단계 25/);
    assert.match(await mapping(1,80),/84.0 → 기록 단계 75/);
    assert.match(await mapping(2,14),/20.14 °C → 20.0 °C/);
    assert.match(await mapping(2,22),/20.22 °C → 20.0 °C/);
    assert.match(await mapping(2,30),/20.30 °C → 20.5 °C/);
   }
   report.push({id,states:rows,clipping});
   console.log(id+': '+rows.length+' states; '+clipping.length+' clipping cases');
  }
  fs.writeFileSync(path.join(dir,selected?'verification-life-'+selected.join('-')+'.json':'verification-all-life.json'),JSON.stringify({lessons:report.length,report,errors},null,2));
  assert.deepEqual(errors,[]);assert.ok(report.every(x=>!x.clipping.length),'Some SVG text is clipped; see verification-all-life.json');
 } finally {await browser?.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});

