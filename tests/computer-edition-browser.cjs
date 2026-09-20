const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),http=require("node:http"),vm=require("node:vm"),pp=require("puppeteer-core");
const root=path.resolve(__dirname,".."),course="learning/inquiry/information-computing/computer-fundamentals",out=path.join(root,"docs/computer-edition");
const server=http.createServer((req,res)=>{
 let file=path.resolve(root,"."+decodeURIComponent(new URL(req.url,"http://localhost").pathname));
 if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,"index.html");
 fs.readFile(file,(err,data)=>{if(err){res.writeHead(404).end();return;}res.writeHead(200,{"Content-Type":({".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".webp":"image/webp",".woff2":"font/woff2"})[path.extname(file)]||"application/octet-stream"}).end(data);});
});
const context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,course,"lessons/index-data.js"),"utf8"),context);
const index=context.window.COMPUTER_LESSON_INDEX;
const data={};for(const group of ["abc","de","fg","h","ij"]){const c={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,course,"textbook/edition-"+group+".js"),"utf8"),c);Object.assign(data,c.window.COMPUTER_EDITION_DATA);}
assert.equal(index.length,36);assert.equal(Object.keys(data).length,35);
const plans={
a02:{click:['[data-a02-run]','[data-a02-presence=hardware]','[data-a02-run]'],observe:'[data-a02-lab]'},
a03:{click:['[data-a03-device=ipad]','[data-a03-run]','[data-a03-os=ipados]','[data-a03-app=ipad-sketch]','[data-a03-run]'],observe:'[data-a03-preview-title]',expect:'앱 실행 성공'},
a04:{steps:[['value','[data-a04-slider]','2011'],['click','[data-a04-capture]'],['value','[data-a04-slider]','2014'],['click','[data-a04-capture]']],observe:'[data-a04-status]'},
a05:{click:['[data-a05-record]','[data-a05-save=a]','[data-a05-rate="8"]','[data-a05-record]','[data-a05-save=b]'],observe:'[data-a05-comparison]',expect:'측정'},
b01:{click:['#componentTab1','#componentTab3'],observe:'#componentPartPanel',expect:'SSD'},
b02:{click:['[data-device-choice=tablet]','[data-mobile-part=camera]'],observe:'#editionLab',expect:'카메라'},
b03:{click:['[data-port-connect]','[data-port-cable-choice=video]','[data-port-connect]'],observe:'[data-port-status]'},
c01:{click:['[data-relay-permission]','[data-relay-run]'],wait:['[data-request-relay]','data-relay-state','blocked'],observe:'[data-relay-status]',expect:'권한'},
c02:{click:['[data-os-choice=ios]','[data-os-open-location]'],observe:'#editionLab'},
c03:{click:['[data-program-action=run]','[data-program-action=new]','[data-program-action=background]'],observe:'[data-program-status]'},
c04:{click:['[data-permission-toggle]','[data-settings-choice=update]','[data-update-check]'],observe:'[data-update-result]',expect:'확인 완료'},
d01:{steps:[['type','[data-demo-text]',' 입력 위치 확인']],observe:'[data-demo-text]'},
d02:{custom:'gesture',click:['[data-gesture-choice=long]'],observe:'[data-gesture-status]',expect:'이름 바꾸기'},
d03:{click:['[data-select-text=고양이]','[data-clipboard-action=copy]','[data-clipboard-action=paste]'],observe:'#editionLab'},
e01:{click:['[data-path-choice=user]','[data-path-choice=pictures]','[data-path-choice=trip]','[data-path-choice=file]'],observe:'[data-path-output]',expect:'바다.jpg'},
e02:{click:['[data-format-action=rename]','[data-format-action=convert]'],observe:'[data-app-result]',expect:'PNG'},
e03:{click:['[data-file-operation=copy]','[data-file-operation=move]'],observe:'[data-file-operation-status]',expect:'이동'},
e04:{click:['[data-reference-action=open]','[data-reference-action=change]','[data-reference-action=open]'],observe:'#editionLab'},
e05:{click:['[data-storage-mode-choice=sync]','[data-storage-action]','[data-storage-action]','[data-storage-action]'],observe:'[data-storage-status]'},
f01:{click:['[data-display-mode=same-resolution]','[data-ui-scale-choice="200"]'],observe:'#editionLab'},
f02:{steps:[['value','[data-color-channel=red]','255'],['click','[data-image-panel-choice=structure]'],['value','[data-image-zoom]','4']],observe:'[data-image-zoom-output]',expect:'4'},
f03:{click:['[data-media-video-frame="5"]'],observe:'#editionLab'},
g01:{custom:'binary',observe:'#binaryRecords'},
g02:{steps:[['click','[data-bit-index="7"]'],['click','[data-unit-index="1"]'],['value','[data-unit-amount]','4']],observe:'#editionLab'},
g03:{steps:[['value','[data-utf8-input]','가나'],['click','[data-utf8-run]'],['value','[data-compression-quality]','25'],['value','[data-transfer-speed]','4']],observe:'#editionLab'},
h01:{click:['[data-network-link=internet]','[data-network-send]','[data-network-send]'],observe:'#editionLab'},
h02:{repeat:['[data-request-action]',5],observe:'[data-request-status]'},
h03:{click:['[data-browser-new-tab]','[data-browser-suggestion=달]'],observe:'#editionLab'},
h04:{click:['[data-stack-answer="3"]','[data-stack-start]'],repeat:['[data-stack-next]',5],observe:'[data-stack-screen-score]'},
h05:{click:['#transfer-tab-deploy'],repeat:['[data-transfer-panel=deploy] [data-transfer-action]',2],observe:'[data-transfer-panel=deploy]'},
i01:{steps:[['value','[data-account-name]','student01'],['value','[data-account-secret]','cedar27'],['click','[data-account-next]'],['value','[data-account-code]','482169'],['click','[data-account-next]'],['click','[data-permission-attempt=grades]']],observe:'[data-permission-result]',expect:'거부'},
i02:{click:['[data-evidence-choice=urgency]','[data-evidence-choice=secret]','[data-evidence-choice=link]','[data-evidence-check]'],observe:'#editionLab'},
j01:{click:['[data-algo-location=downloads]','[data-file-source]','[data-algo-location=assignment]','[data-algo-move]','[data-algo-verify]'],observe:'[data-algo-status]'},
j02:{custom:'robot',observe:'[data-control-score]',expect:'3'},
j03:{steps:[['click','[data-debug-run]'],['value','[data-debug-code]','/pictures/'],['click','[data-debug-run]'],['click','[data-debug-case=dog]'],['click','[data-debug-case=missing]']],observe:'[data-debug-lab]'}
};
const selectedIds=process.env.EDITION_IDS?.split(",");const entries=index.filter(x=>x.id!=="a01"&&(!selectedIds||selectedIds.includes(x.id)));
(async()=>{await new Promise(r=>server.listen(0,"127.0.0.1",r));const base="http://127.0.0.1:"+server.address().port+"/"+course+"/";
let browser;const results=[],failures=[];try{
 browser=await pp.launch({executablePath:process.env.CHROME_PATH||"C:/Program Files/Google/Chrome/Application/chrome.exe",headless:true,args:["--no-first-run","--no-default-browser-check"]});
 const page=await browser.newPage();page.setDefaultTimeout(5000);let errors=[];
 page.on("pageerror",e=>errors.push(e.message));page.on("response",r=>{if(r.status()>=400)errors.push(r.status()+" "+r.url());});
 const screenshot=async options=>{for(let attempt=0;;attempt++){try{return await page.screenshot(options);}catch(error){if(attempt>=2)throw error;await new Promise(resolve=>setTimeout(resolve,200));}}};
 const go=async view=>{await page.click('.edition-nav [data-page="'+view+'"]');await page.waitForFunction(v=>!document.getElementById("edition-"+v).hidden,{},view);};
 const click=async selector=>{const handles=await page.$$(selector);for(const handle of handles){if(await handle.evaluate(e=>!!e.getBoundingClientRect().width&&!e.disabled)){await handle.click();return;}}throw Error("No enabled visible control: "+selector);};
 const value=async(selector,text)=>page.$eval(selector,(el,text)=>{el.value=text;el.dispatchEvent(new Event("input",{bubbles:true}));el.dispatchEvent(new Event("change",{bubbles:true}));},text);
 const read=selector=>page.$eval(selector,e=>e.value??e.innerText);
 fs.mkdirSync(out,{recursive:true});
 for(const entry of entries){const id=entry.id;errors=[];const record={id,layouts:[],fontChecks:[]};try{
  await page.setViewport({width:1440,height:1000});await page.goto(base+"lessons/?lesson="+id,{waitUntil:"networkidle0"});await page.waitForSelector("#edition");
  assert.equal(await read(".edition-header h1"),entry.number+"차시. "+entry.title);
  const key="classj:textbook:"+id+":v1";
  assert.equal(await read("#editionProgress"),"0 / 3");
  const qlist=[data[id].labCheck,...data[id].apply.fields,...data[id].checks];
  for(const q of qlist){assert.ok(q.options.length>=2);assert.equal(new Set(q.options.map(x=>x[0])).size,q.options.length);assert.ok(q.options.every(x=>x[0]&&x[1]));}
  await go("lab");
  await click('[data-question="0"] input[value="0"]');await click('[data-question="0"] .edition-submit');
  assert.match(await read('[data-question="0"] .edition-feedback'),/실습/);
  const plan=plans[id],before=await read(plan.observe);
  for(const selector of plan.click||[])await click(selector);
  for(const [kind,selector,text] of plan.steps||[]){if(kind==="click")await click(selector);else if(kind==="type"){await page.focus(selector);await page.keyboard.press("End");await page.keyboard.type(text);}else await value(selector,text);}
  if(plan.repeat){for(let i=0;i<plan.repeat[1];i++){const enabled=await page.$eval(plan.repeat[0],e=>!e.disabled);if(!enabled)break;await click(plan.repeat[0]);}}
  if(plan.wait)await page.waitForFunction(([s,a,v])=>document.querySelector(s)?.getAttribute(a)===v,{},plan.wait);
  if(plan.custom==="gesture"){await page.focus("[data-gesture-surface]");await page.keyboard.press("Enter");assert.equal(await page.$eval("[data-gesture-menu]",e=>e.hidden),false);await click("[data-gesture-menu-action=rename]");assert.equal(await page.$eval("[data-gesture-surface]",e=>e.dataset.menuAction),"rename");await page.focus("[data-gesture-menu-action=share]");await page.keyboard.press("Enter");assert.equal(await page.$eval("[data-gesture-surface]",e=>e.dataset.menuAction),"share");await page.focus("[data-gesture-menu-action=rename]");await page.keyboard.press("Enter");}
  if(plan.custom==="binary"){
   await page.select("#binaryLength","2");
   for(const sequence of [[],[1],[0],[1]]){for(const bit of sequence)await click('[data-binary-bit="'+bit+'"]');await click("#binaryRecord");}
   assert.equal(await page.$$eval("#binaryRecords li",els=>els.map(x=>x.textContent).join(",")),"00,01,10,11");
   await click("#binaryRecord");assert.equal(await page.$$eval("#binaryRecords li",els=>els.length),4);
  }
  if(plan.custom==="robot"){for(const moves of [[1,1],[-1,-1],[1]]){for(const n of moves)await click('[data-control-move="'+n+'"]');await click("[data-control-robot]");await page.waitForFunction(()=>document.querySelector("[data-control-robot]").disabled===false||document.querySelector("[data-control-score]").textContent==="3");}}
  const after=await read(plan.observe);assert.notEqual(after,before,"real lab observation must change");if(plan.expect)assert.ok(after.includes(plan.expect),"expected "+plan.expect+" in "+after);
  if(id==="a03")assert.doesNotMatch(await read("#editionLab"),/API|펌웨어/);
  for(let i=0;i<qlist.length;i++){
   await go(i===0?"lab":i<3?"apply":"check");const selector='[data-question="'+i+'"]';
   await click(selector+' input[value="1"]');await click(selector+" .edition-submit");
   assert.ok((await read(selector+" .edition-feedback")).includes(qlist[i].options[1][1]));
   assert.equal(await page.$$eval(selector+" input",els=>els.filter(e=>e.disabled).length),0,"wrong choices remain available");
   await click(selector+' input[value="0"]');await click(selector+" .edition-submit");
   assert.equal(await page.$eval(selector,e=>e.dataset.solved),"true");
  }
  assert.equal(await read("#editionProgress"),"3 / 3");
  const saved=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);assert.equal(saved.completed,true);assert.equal(saved.answers.filter(x=>x.firstCorrect).length,0);
  await page.reload({waitUntil:"networkidle0"});await page.waitForSelector("#edition");assert.equal(await read("#editionProgress"),"3 / 3");
  for(const width of [1440,1024,768,390]){await page.setViewport({width,height:1000});
   for(const view of ["read","lab","apply","check"]){await go(view);
    const layout=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,top:document.querySelector(".edition-page:not([hidden])").getBoundingClientRect().top}));
    record.layouts.push({view,...layout});if(id==="j02"&&view==="lab")assert.equal(await page.$eval(".program-flow .flow-branch",e=>getComputedStyle(e).transform),"none","branch text stays upright");assert.ok(layout.scrollWidth<=width+1,"overflow "+width+" "+view);
    if(width===1440&&view==="read"){await screenshot({path:path.join(out,id+"-read-1440.png"),fullPage:true});assert.ok(layout.top<160,"compact header");}
    if(width===390&&view==="lab")await screenshot({path:path.join(out,id+"-lab-390.png"),fullPage:true});
   }
  }
  await page.setViewport({width:1440,height:1000});
  const cdp=await page.createCDPSession();await cdp.send("DOM.enable");await cdp.send("CSS.enable");
  for(const [view,selector] of [["read",".edition-reading p"],["check",".edition-question legend"],["check",".edition-option span"],["check",".edition-feedback"]]){
   await go(view);await page.evaluate(()=>document.fonts.ready);
   const {root:doc}=await cdp.send("DOM.getDocument");const {nodeId}=await cdp.send("DOM.querySelector",{nodeId:doc.nodeId,selector:"#edition-"+view+" "+selector});
   const {fonts}=await cdp.send("CSS.getPlatformFontsForNode",{nodeId});assert.ok(fonts.some(f=>f.isCustomFont&&/KoPub/.test(f.familyName)),"actual KoPub font "+selector);record.fontChecks.push(selector);
  }
  await cdp.detach();assert.deepEqual(errors,[]);record.passed=true;console.log("PASS "+id);
 }catch(e){record.passed=false;record.error=e.message;record.errors=[...errors];failures.push({id,error:e.message});console.log("FAIL "+id+": "+e.message);}results.push(record);}
 // The canonical first-lesson URL must open the finished first chapter.
 await page.goto(base+"lessons/?lesson=a01",{waitUntil:"networkidle0"});assert.ok(page.url().includes("/textbook/a01.html"));await page.waitForSelector("#progressText");
 if(!failures.length){await page.goto(base,{waitUntil:"networkidle0"});assert.equal(await page.$$eval(".lesson-link-list li.is-complete",els=>els.length),entries.length);}
 if(!failures.length){
 const last=entries[entries.length-1].id;
 await page.goto(base+"lessons/?lesson="+last,{waitUntil:"networkidle0"});await go("check");
 page.once("dialog",dialog=>dialog.dismiss());await click(".edition-reset");assert.equal(await read("#editionProgress"),"3 / 3");
 await page.evaluate(id=>localStorage.setItem("computer-literacy:"+id,JSON.stringify({completed:true,legacy:true})),last);
 page.once("dialog",dialog=>dialog.accept());await Promise.all([page.waitForNavigation({waitUntil:"networkidle0"}),click(".edition-reset")]);assert.equal(await read("#editionProgress"),"0 / 3");
 assert.equal(await page.evaluate(id=>JSON.parse(localStorage.getItem("computer-literacy:"+id)).legacy,last),true);
 }
 // Corrupt and unavailable browser storage must not break reading or answers.
 await page.goto(base+"lessons/?lesson=a02",{waitUntil:"networkidle0"});await page.evaluate(()=>localStorage.setItem("classj:textbook:a02:v1","{broken"));await page.reload({waitUntil:"networkidle0"});assert.equal(await read("#editionProgress"),"0 / 3");
 const blocked=await browser.newPage();await blocked.evaluateOnNewDocument(()=>{Storage.prototype.getItem=function(){throw Error("blocked");};Storage.prototype.setItem=function(){throw Error("blocked");};});
 await blocked.goto(base+"lessons/?lesson=a02",{waitUntil:"networkidle0"});await blocked.waitForSelector("#edition");await blocked.click('.edition-nav [data-page="check"]');await blocked.waitForFunction(()=>!document.querySelector("#edition-check").hidden);await blocked.click('[data-question="3"] input[value="0"]');await blocked.click('[data-question="3"] .edition-submit');assert.equal(await blocked.$eval('[data-question="3"]',e=>e.dataset.solved),"true");assert.equal(await blocked.$eval(".edition-save-note",e=>e.hidden),false);await blocked.close();
 fs.writeFileSync(path.join(out,selectedIds?"verification-"+selectedIds.join("-")+".json":"verification.json"),JSON.stringify({date:new Date().toISOString(),results,failures,firstLessonRoute:true,storageChecks:true},null,2));
 assert.deepEqual(failures,[]);console.log("Verified "+results.length+" chapters, retained A01 route, and storage recovery.");
}finally{await browser?.close();await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e.message);process.exitCode=1;});
