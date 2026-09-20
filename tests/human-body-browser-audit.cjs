const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const http = require('node:http'), fs = require('node:fs'), path = require('node:path');
const root = path.resolve(__dirname, '..');
const out = process.env.AUDIT_OUTPUT || path.join(require('node:os').tmpdir(), 'human-body-browser-audit'); fs.mkdirSync(out,{recursive:true});
const apps = ['circulation','digestion','respiration','excretion','nervous','homeostasis','immune','skeleton'];
const mime = { '.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp' };
const server = http.createServer((req,res)=>{
 let f = path.resolve(root, '.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
 if(!f.toLowerCase().startsWith(path.resolve(root).toLowerCase()+path.sep)) return res.writeHead(403).end();
 if(fs.existsSync(f)&&fs.statSync(f).isDirectory()) f=path.join(f,'index.html');
 if(!fs.existsSync(f)) return res.writeHead(404).end();
 res.setHeader('Content-Type',mime[path.extname(f)]||'application/octet-stream'); fs.createReadStream(f).pipe(res);
});
function layoutAudit() {
 const visible = e => { const r=e.getBoundingClientRect(), c=getComputedStyle(e); return r.width>0&&r.height>0&&c.visibility!=='hidden'&&c.display!=='none'&&!e.closest('[hidden]'); };
 const stage=document.querySelector('.sim-stage-area'), sr=stage.getBoundingClientRect();
 const labels=[...stage.querySelectorAll('[class$="-tag"],.body-diagram-label,.diagram-label,svg text')].filter(visible);
 const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height};};
 const overlap=[];
 for(let i=0;i<labels.length;i++)for(let j=i+1;j<labels.length;j++){
  const a=labels[i].getBoundingClientRect(),b=labels[j].getBoundingClientRect();
  if(Math.min(a.right,b.right)-Math.max(a.left,b.left)>6&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>6)
   overlap.push([labels[i].textContent.trim(),labels[j].textContent.trim()]);
 }
 return {labels:labels.map(e=>({text:e.textContent.trim(),class:e.getAttribute('class'),...rect(e)})),overlap,
 outside:labels.filter(e=>{const r=e.getBoundingClientRect();return r.left<sr.left-1||r.right>sr.right+1||r.bottom>sr.bottom+1||r.top<sr.top-1;}).map(e=>e.textContent.trim()),
 controls:[...document.querySelectorAll('button,input,select')].filter(visible).map(e=>({id:e.id,text:e.textContent.trim(),type:e.type,value:e.value,cls:e.className})),
 layers:[...stage.querySelectorAll('div[class$="-layer"]')].filter(visible).map(e=>e.className)};
}
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE || undefined});
 const report=[];
 try{
  for(const app of apps){
   const page=await browser.newPage({viewport:{width:1440,height:960}});
   const errors=[],missing=[];
   page.on('pageerror',e=>errors.push(e.message));
   page.on('response',r=>{if(r.status()>=400)missing.push(r.url());});
   await page.goto('http://127.0.0.1:'+server.address().port+'/learning/inquiry/human-body/'+app+'/');
   await page.waitForTimeout(500);
   const scenes=await page.locator('.scene-btn').evaluateAll(ns=>ns.map(n=>({key:n.dataset.scene,text:n.textContent})));
   for(const scene of scenes){
    await page.locator('[data-scene="'+scene.key+'"]').click();
    await page.waitForTimeout(400);

    const key=app+'--'+scene.key;
    const labels=[];
    const labelNodes=page.locator('.body-diagram-label');
    for(let li=0;li<await labelNodes.count();li++){
      const label=labelNodes.nth(li);
      if(!await label.isVisible())continue;
      const text=await label.textContent();
      await label.evaluate(e=>e.click());
      labels.push({text,title:await page.locator('#organTitle').textContent().catch(()=>null)});
    }

    const controls=[],names=[],tabs=[];
    const tabNodes=page.locator('.sidebar-tab-btn');
    for(let ti=-1;ti<await tabNodes.count();ti++){
      if(ti>=0){
        const tab=tabNodes.nth(ti);
        if(!await tab.isVisible())continue;
        await tab.click();tabs.push(await tab.textContent());
      }
      for(const slider of await page.locator('input[type="range"]:visible').all()){
        const id=await slider.getAttribute('id');
        for(const end of ['min','max']){
          await slider.evaluate((e,end)=>{e.value=e[end];e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));},end);
          await page.waitForTimeout(100);
        }
        controls.push({id,value:await slider.inputValue()});
      }
      for(const action of await page.locator('button:visible:not(.scene-btn):not(.sidebar-tab-btn):not(#playPauseBtn):not([class*="quiz"])').all()){
        const id=await action.getAttribute('id'),text=await action.textContent();
        if(names.some(n=>n.text===text))continue;
        await action.click();names.push({id,text});
        await page.waitForTimeout(60);
      }
      const option=page.locator('.sim-quiz-opt-btn:visible:not(:disabled)').first();
      if(await option.count()){
        await option.click();
        if(!await page.locator('.sim-quiz-explanation:visible').count())throw Error(key+' quiz has no explanation');
        const next=page.locator('.sim-quiz-next-btn:visible');
        if(await next.count())await next.click();
      }
    }
    let pause=null;
    const pp=page.locator('#playPauseBtn:visible');
    if(await pp.count()){
      await pp.click();await page.waitForTimeout(150);
      const snapshot=()=>page.evaluate(()=>[...document.querySelectorAll('.sim-stage-area svg path,.sim-stage-area svg circle,.sim-stage-area svg ellipse,.sim-stage-area canvas')].filter(e=>e.getBoundingClientRect().width&&!e.closest('[hidden]')).map(e=>e.tagName==='CANVAS'?e.toDataURL():[e.id,...['d','cx','cy','rx','ry','r','transform'].map(k=>e.getAttribute(k))]));
      const a=await snapshot();await page.waitForTimeout(260);const b=await snapshot();
      pause={frozen:JSON.stringify(a)===JSON.stringify(b),shapes:a.length};
      await pp.click();
    }
    await page.waitForTimeout(250);
    await page.screenshot({path:path.join(out,key+'.png')});
    report.push({app,scene,key,labels,controls,tabs,pause,actions:names,active:await page.locator('.scene-btn.active').getAttribute('data-scene'),layout:await page.evaluate(layoutAudit)});
   }
   console.log(app+': '+scenes.length+' scenes; errors='+JSON.stringify(errors)+'; missing='+JSON.stringify(missing));
   report.push({app,errors,missing});
   await page.close();
  }
  fs.writeFileSync(path.join(out,'audit.json'),JSON.stringify(report,null,2));
  const failures=report.filter(r=>r.errors?.length || r.missing?.length ||
    (r.pause && !r.pause.frozen) || (r.scene && r.active!==r.scene.key));
  if(failures.length)throw Error('Browser audit failures: '+JSON.stringify(failures));
  console.log('PASS: all 25 scenes, controls, quiz feedback and 20 pause states; '+out);
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});

