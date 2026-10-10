// Independent causal checks from collected textbook/assessment review.
// Evidence and scope: docs/science-lab-audit-2026-10-11/README.md.
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const screenshotWebp=require('./science-screenshot.cjs');
const root=path.resolve(__dirname,'../learning/inquiry/science-lab');
const out=path.resolve(process.env.SCIENCE_TEST_ARTIFACTS || 'tmp/science-textbook-tests');

for(const engine of ['chromium','webkit'])test(engine+': textbook causal relationships and every photosynthesis control combination',{timeout:90000},async()=>{
 const server=http.createServer((req,res)=>{
  let file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);
  if(!file.startsWith(root+path.sep))return res.writeHead(403).end();
  if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  fs.readFile(file,(error,bytes)=>{if(error)return res.writeHead(404).end();res.setHeader('Content-Type',{'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css'}[path.extname(file)]||'application/octet-stream');res.end(bytes);});
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 let browser;
 try{
  browser=await require('playwright')[engine].launch({headless:true,...(engine==='chromium'?{executablePath:process.env.SCIENCE_BROWSER}:{})});
  const page=await browser.newPage({viewport:{width:1366,height:900},hasTouch:true});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());
  await page.goto('http://127.0.0.1:'+server.address().port+'/photosynthesis/');
  const result=await page.evaluate(()=>{
   const m=window.__photoModel,available=[...document.querySelectorAll('[data-prediction]')].map(e=>e.dataset.prediction);
   const problems=[],counts={};let states=0;
   const same=(a,b)=>Math.abs(a-b)<1e-7;
   for(let L=0;L<=100;L+=5)for(let C=0;C<=100;C+=5)for(let T=0;T<=50;T++){
    const a=m.analyse(L,C,T),rate=a.rate;
    const light=m.analyse(100,C,T).rate,co2=m.analyse(L,100,T).rate,temperature=m.analyse(L,C,32).rate;
    const issue=message=>{if(problems.length<30)problems.push({L,C,T,limiter:a.limiter,rate,message});};
    states++;counts[a.limiter]=(counts[a.limiter]||0)+1;
    if(!available.includes(a.limiter))issue('no answer for the observed outcome');
    if(!Number.isFinite(rate)||rate<0||rate>100)issue('invalid rate');
    if((L===0||C===0)&&rate!==0)issue('photosynthesis without light or carbon dioxide');
    if(light<rate-1e-7||co2<rate-1e-7||temperature<rate-1e-7)issue('improving a condition reduced rate');
    if(a.limiter==='none'&&!same(rate,100))issue('submaximum rate labelled maximum');
    if(a.limiter==='light'&&!(light>rate&&same(co2,rate)&&same(temperature,rate)))issue('light verdict contradicts controlled comparison');
    if(a.limiter==='co2'&&!(co2>rate&&same(light,rate)&&same(temperature,rate)))issue('carbon dioxide verdict contradicts controlled comparison');
    if(a.limiter==='temp'&&!(temperature>rate&&same(light,rate)&&same(co2,rate)))issue('temperature verdict contradicts controlled comparison');
    if(a.limiter==='multiple'&&!(same(light,rate)&&same(co2,rate)&&same(temperature,rate)&&rate<100))issue('joint limitation contradicts controlled comparisons');
   }
   return{states,counts,problems};
  });
  assert.equal(result.states,22491);assert.deepEqual(result.problems,[]);
  assert.equal(Object.keys(result.counts).length,5);
  const scenarios=[[10,100,32,'light'],[100,5,32,'co2'],[100,100,0,'temp'],[40,30,32,'multiple'],[0,0,32,'multiple'],[100,100,32,'none'],[100,100,30,'temp']];
  let answers=0;
  for(const [L,C,T,expected]of scenarios){
   await page.evaluate(([L,C,T])=>{__photoModel.setLight(L);__photoModel.setCO2(C);__photoModel.setTemp(T);},[L,C,T]);
   for(const choice of ['light','co2','temp','multiple','none']){
    await page.locator(`[data-prediction="${choice}"]`).tap();await page.locator('#checkBtn').tap();
    assert.equal(/예상이 맞았습니다/.test(await page.locator('#predictionResult').textContent()),choice===expected,`${L}/${C}/${T}/${choice}`);answers++;
   }
  }
  fs.mkdirSync(out,{recursive:true});
  for(const width of [1366,820,390]){
   await page.setViewportSize({width,height:width===1366?900:1180});
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${width}: overflow`);
   assert(await page.locator('[data-prediction]').evaluateAll(es=>es.every(e=>e.getBoundingClientRect().height>=44)),`${width}: touch target`);
   await screenshotWebp(page.locator('.experiment-layout'),path.join(out,`photosynthesis-${engine}-${width}.webp`));
  }
  assert.deepEqual(errors,[]);
  fs.writeFileSync(path.join(out,`textbook-causal-${engine}.json`),JSON.stringify({...result,answers,errors},null,2));
  console.log(engine,result.states+' independent causal comparisons',answers+' UI answer checks',result.counts);
 }finally{await browser?.close();await new Promise(resolve=>server.close(resolve));}
});
