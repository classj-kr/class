const {test}=require('node:test'),assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
const lab=path.resolve(__dirname,'../learning/inquiry/science-lab');
for(const engine of ['chromium','webkit'])test(engine+': figure ink follows its painted background and moving the result preserves its live node',async()=>{
 const browser=await require('playwright')[engine].launch({headless:true,...(engine==='chromium'?{executablePath:process.env.SCIENCE_BROWSER}:{})});
 try{
  const page=await browser.newPage({viewport:{width:1100,height:850}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.setContent(`<body style="background:white"><div class="experiment-layout"><section class="panel control-panel"><section class="result-box" aria-live="polite"><button id="resultAction">結果</button></section></section><section class="panel stage"><svg class="main-svg" viewBox="0 0 460 180" style="width:100%;max-width:460px"><text id="pale" x="20" y="30" fill="#bceff4">가상 측정값</text><g transform="translate(200 0)"><rect x="0" y="0" width="240" height="80" fill="#142b3b"/><text id="dark" x="20" y="30" fill="white">어두운 관찰 화면</text></g><rect x="20" y="100" width="420" height="60" fill="#d6eaf1"/><text id="bar" x="35" y="136" fill="white">밝은 막대 위의 수치</text></svg></section></div></body>`);
  await page.evaluate(()=>{window.resultNode=document.querySelector('.result-box');window.clicks=0;document.getElementById('resultAction').onclick=()=>clicks++;});
  await page.addStyleTag({content:fs.readFileSync(path.join(lab,'lab-ui.css'),'utf8')});
  await page.addScriptTag({content:fs.readFileSync(path.join(lab,'lab-ui.js'),'utf8')});
  await page.waitForFunction(()=>document.getElementById('pale').style.fill);
  const check=await page.evaluate(()=>{
   const rgb=s=>s.match(/[\d.]+/g).slice(0,3).map(Number),l=c=>c.map(x=>{x/=255;return x<=.04045?x/12.92:((x+.055)/1.055)**2.4}).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
   const contrast=(c,b)=>{const a=l(c),d=l(b);return(Math.max(a,d)+.05)/(Math.min(a,d)+.05)};
   return{values:[['pale',[255,255,255]],['dark',[20,43,59]],['bar',[214,234,241]]].map(([id,b])=>({id,ratio:contrast(rgb(getComputedStyle(document.getElementById(id)).fill),b)})),same:resultNode===document.querySelector('.stage .result-box'),live:resultNode.getAttribute('aria-live')};
  });
  assert(check.same);assert.equal(check.live,'polite');for(const v of check.values)assert(v.ratio>=4.5,v.id+' '+v.ratio);
  await page.locator('#resultAction').click();assert.equal(await page.evaluate(()=>clicks),1);
  await page.evaluate(()=>{window.figureNode=document.querySelector('svg');});
  await page.setViewportSize({width:320,height:850});await page.waitForFunction(()=>!document.querySelector('.figure-tools').hidden);
  assert(await page.locator('svg').evaluate(e=>e.getBoundingClientRect().width<=innerWidth),'whole diagram fits the phone');
  await page.locator('.figure-tools button').click();
  assert(await page.locator('svg').evaluate(e=>e.getBoundingClientRect().width>=460),'zoom exposes readable native geometry');
  assert.equal(await page.locator('.figure-viewport').getAttribute('tabindex'),'0');
  await page.locator('.figure-viewport').evaluate(e=>e.scrollLeft=120);
  assert(await page.locator('.figure-viewport').evaluate(e=>e.scrollLeft>0));
  await page.locator('.figure-tools button').click();assert.equal(await page.evaluate(()=>figureNode===document.querySelector('svg')),true);
  // A model redraw must retain its chosen scientific colors, then receive fresh ink.
  await page.evaluate(()=>{document.querySelector('svg').innerHTML='<text id="fresh" x="20" y="40" fill="#a3e4cc">새 관찰값</text>';});
  await page.waitForFunction(()=>document.getElementById('fresh').style.fill);
  assert.equal(await page.locator('#fresh').getAttribute('fill'),'#a3e4cc');assert.deepEqual(errors,[]);
 }finally{await browser.close();}
});
