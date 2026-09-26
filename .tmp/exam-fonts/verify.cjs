const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const {spawn, spawnSync} = require("node:child_process");
const root = process.cwd();
const WebSocket = require(path.join(root, "game-hub-server/node_modules/ws"));
const dir = path.join(root, ".tmp/exam-fonts");
fs.mkdirSync(dir, {recursive:true});
const port = 26740;
const base = "http://127.0.0.1:"+port;
let log = "";
const server = spawn(process.execPath, ["game-hub-server/server.js"], {cwd:root, windowsHide:true, env:{...process.env, PORT:String(port),ARITHMETIC_PORT:"26742",WORLD_VOYAGE_PORT:"26743",NODE_ENV:"test",DATABASE_URL:"",GOOGLE_CLIENT_ID:""},stdio:["ignore","pipe","pipe"]});
server.stdout.on("data",d=>log+=d);server.stderr.on("data",d=>log+=d);
let chrome, socket;
const delay = ms=>new Promise(r=>setTimeout(r,ms));
async function retry(fn, ms=15000){const start=Date.now();let err;while(Date.now()-start<ms){try{return await fn();}catch(e){err=e;await delay(150);}}throw err;}
async function json(url){const r=await fetch(url);if(!r.ok)throw Error(r.status+" "+url);return r.json();}
(async()=>{
try {
  await retry(async()=>{const r=await fetch(base+"/assets/exam-typography.css");assert.equal(r.status,200);});
  const routes = [
    "literacy-numeracy/reading/", "literacy-numeracy/idiomatic-expressions/", "literacy-numeracy/proverbs/",
    "literacy-numeracy/spelling/", "literacy-numeracy/vocabulary/", "literacy-numeracy/classical-chinese-idioms/",
    "literacy-numeracy/metacognition/", "literacy-numeracy/math-ox/", "literacy-numeracy/sentence-building/",
    "literacy-numeracy/story-books/world-tales/red-hood/", "literacy-numeracy/story-books/korea-tales/jopssal-han-tol/",
    "literacy-numeracy/phonics/", "inquiry/science-lab/force-motion/", "inquiry/science-lab/exam-review",
    "inquiry/periodic-table/", "inquiry/space/solar-system/", "inquiry/globe/", "inquiry/korea-map/",
    "inquiry/korean-history/", "inquiry/human-body/", "inquiry/information-computing/computer-fundamentals/",
    "arts/music-theory/ear-training/", "class-race/"
  ];
  for (const route of routes) {
    const response=await fetch(base+"/learning/"+route);
    assert.equal(response.status,200,route);
    const html=await response.text();
    assert.equal((html.match(/href="\/assets\/exam-typography.css\?v=20260926-1"/g)||[]).length,1,route);
  }
  const font=await fetch(base+"/assets/fonts/kopub-world/KoPubWorld-Batang-Medium.woff2");
  assert.equal(Buffer.from(await font.arrayBuffer()).toString("ascii",0,4),"wOF2");
  const admin=await (await fetch(base+"/admin/reading/")).text();
  assert.ok(!admin.includes("/assets/exam-typography.css"));
  console.log("PASS: shared stylesheet on "+routes.length+" learning routes; bundled font served; admin unaffected.");
  chrome=spawn("C:/Program Files/Google/Chrome/Application/chrome.exe",["--headless=new","--disable-gpu","--no-first-run","--no-default-browser-check","--remote-debugging-port=26741","--user-data-dir="+path.join(dir,"chrome-profile"),"about:blank"],{windowsHide:true,stdio:"ignore"});
  const tabs=await retry(()=>json("http://127.0.0.1:26741/json/list"));
  socket=new WebSocket(tabs.find(x=>x.type==="page").webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{socket.once("open",resolve);socket.once("error",reject);});
  let id=0;const pending=new Map();
  socket.on("message",data=>{const m=JSON.parse(data);if(m.id&&pending.has(m.id)){const x=pending.get(m.id);pending.delete(m.id);m.error?x.reject(Error(JSON.stringify(m.error))):x.resolve(m.result);}});
  const call=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,{resolve,reject});socket.send(JSON.stringify({id:n,method,params}));});
  const run=async expression=>{const r=await call("Runtime.evaluate",{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
  await call("Page.enable");await call("Runtime.enable");await call("Network.enable");await call("Network.setCacheDisabled",{cacheDisabled:true});
  await call("Emulation.setDeviceMetricsOverride",{width:1100,height:900,deviceScaleFactor:1,mobile:false});
  async function open(route){
    await call("Page.navigate",{url:base+"/learning/"+route});
    await retry(async()=>assert.ok(await run("location.pathname.includes("+JSON.stringify(route.split("/")[1])+") && document.readyState === 'complete'")));
    await run('document.fonts.load(\'18px "Class Exam Batang"\').then(()=>document.fonts.ready).then(()=>true)');
  }
  async function check(name, selectors) {
    const result=await run("("+function(selectors){
      return selectors.map(selector=>{const elements=[...document.querySelectorAll(selector)];return {selector,count:elements.length,fonts:[...new Set(elements.map(el=>getComputedStyle(el).fontFamily))]};});
    }.toString()+")("+JSON.stringify(selectors)+")");
    for(const row of result){assert.ok(row.count,name+" missing "+row.selector);assert.ok(row.fonts.every(x=>x.includes("Class Exam Batang")),name+" "+JSON.stringify(row));}
    console.log("PASS: "+name+" "+JSON.stringify(result));
  }
  async function shot(name){const r=await call("Page.captureScreenshot",{format:"png",captureBeyondViewport:false});fs.writeFileSync(path.join(dir,name+".png"),Buffer.from(r.data,"base64"));}
  await open("literacy-numeracy/reading/");
  await retry(async()=>{assert.ok(await run("!!document.querySelector('.level-card')"));});
  await run("document.querySelector('.level-card').click()");
  await retry(async()=>assert.ok(await run("document.querySelectorAll('.student-choice').length>0")));
  await check("reading",[".student-passage",".student-prompt",".student-choice"]);
  await shot("reading");
  await open("literacy-numeracy/idiomatic-expressions/");
  await run("document.querySelector('.lesson-item').click();document.querySelector('[data-mode=quiz]').click()");
  await check("idioms",["#quizTitle","#question",".choices button","#feedback"]);
  await shot("idioms");
  await call("Emulation.setDeviceMetricsOverride",{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await shot("idioms-mobile");
  await call("Emulation.setDeviceMetricsOverride",{width:1100,height:900,deviceScaleFactor:1,mobile:false});
  await open("inquiry/science-lab/force-motion/");
  await check("science",[".quiz-card h3",".quiz-options label"]);
  await open("literacy-numeracy/math-ox/");
  await check("math-ox",[".q-prompt",".ox-btn"]);
  await open("literacy-numeracy/story-books/world-tales/red-hood/");
  await run("document.querySelector('#tocLink').click()");
  await retry(async()=>assert.ok(await run("!!document.querySelector('[data-goto-kind=quiz]')")));
  await run("document.querySelector('[data-goto-kind=quiz]').click()");
  await retry(async()=>assert.ok(await run("!!document.querySelector('.quiz-question')")));
  await check("story",[".quiz-question",".quiz-choice"]);
  await open("literacy-numeracy/proverbs/");
  await run("document.querySelector('.lesson-item').click();document.querySelector('[data-mode=quiz]').click()");
  await check("proverbs",[".quiz h2",".choices button","#feedback"]);
  await run("document.querySelector('.choices button').click()");
  await check("proverbs feedback",["#feedback"]);
  console.log("BROWSER CHECKS COMPLETE");
} catch(e){console.error(e.stack);console.error(log.slice(-1600));process.exitCode=1;}
finally {
 if(socket)socket.close();
 for(const child of [chrome,server])if(child?.pid)spawnSync("taskkill",["/PID",String(child.pid),"/T","/F"],{windowsHide:true,stdio:"ignore"});
}
})();
