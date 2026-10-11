const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const model=require('../learning/inquiry/science-lab/activity-models.js'),webp=require('./science-screenshot.cjs');
test('activity models: controls, counterexamples, ordering and numerical optics',()=>{
 for(const neck of ['swan','cut','tilt','sealed'])for(const heated of [true,false])for(let day=0;day<=4;day++){
  const r=model.broth(neck,heated,day);assert.equal(r.air,neck!=='sealed');assert.equal(r.growth,day!==0&&(!heated||['cut','tilt'].includes(neck)));
 }
 const slots=Array(12).fill('');for(const e of model.elements)slots[e.slot]=e.symbol;
 assert(model.periodic(slots).complete);[slots[0],slots[1]]=[slots[1],slots[0]];assert.equal(model.periodic(slots).correct,8);
 const values=model.prism({stage:'dispersion',screen:0,color:0}).values;
 assert(values.rays[0].delta<values.rays[1].delta&&values.rays[1].delta<values.rays[2].delta);
 // Recover refractive index from the reported minimum-deviation angle.
 for(const r of values.rays)assert(Math.abs(Math.sin((r.delta+60)*Math.PI/360)/.5-r.n)<1e-12);
 for(let color=0;color<3;color++)assert.deepEqual(model.prism({stage:'single',color,screen:0}).values.result,[['빨강','초록','파랑'][color]]);
 assert.deepEqual(model.prism({stage:'combine',color:0,screen:0}).values.result,['흰빛']);
 assert.equal(model.prism({stage:'combine',color:0,screen:1}).values.atFocus,false);
});
for(const engine of ['chromium','webkit'])test(engine+': new activities, persistence, mobile layout and dating evidence',{timeout:180000},async()=>{
 const root=path.resolve(__dirname,'../learning/inquiry/science-lab'),out=path.resolve(process.env.SCIENCE_TEST_ARTIFACTS||'tmp/science-activity-workbench');fs.mkdirSync(out,{recursive:true});
 const server=http.createServer((req,res)=>{let file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!file.startsWith(root+path.sep))return res.writeHead(403).end();if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');fs.readFile(file,(e,b)=>{if(e)return res.writeHead(404).end();res.setHeader('Content-Type',{'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css'}[path.extname(file)]||'application/octet-stream');res.end(b);});});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{
  browser=await require('playwright')[engine].launch({headless:true,...(engine==='chromium'?{executablePath:process.env.SCIENCE_BROWSER}:{})});
  const page=await browser.newPage({viewport:{width:1024,height:900},hasTouch:true}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
  const url=`http://127.0.0.1:${server.address().port}`,open=async id=>{await page.goto(url+'/activity-workbench.html?activity='+encodeURIComponent(id));await page.waitForSelector('#lab');};
  const capture=async name=>{for(const width of [390,768,1024]){await page.setViewportSize({width,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,name+' overflow');await webp(page.locator('#workbench'),path.join(out,`${name}-${engine}-${width}.webp`));}};
  await open('10과탐1-01#3');for(const e of model.elements)await page.locator(`[data-slot="${e.slot}"]`).selectOption(e.symbol);
  await page.locator('#arrangementCheck').click();assert.match(await page.locator('#arrangementResult').textContent(),/10곳/);
  await page.locator('[data-guess="6mass"]').fill('약 70');await page.locator('#hypothesis').fill('성질과 원자량을 함께 비교한다.');await page.locator('#record').click();await page.locator('#save').click();await page.reload();assert.equal(await page.locator('[data-slot="0"]').inputValue(),'B');assert.equal(await page.locator('[data-guess="6mass"]').inputValue(),'약 70');assert.equal(await page.locator('#records tbody tr').count(),1);await capture('periodic');
  await open('10과탐1-02#1');await page.locator('[data-control="day"]').selectOption('4');
  for(const neck of ['swan','cut','tilt','sealed'])for(const boiled of ['yes','no']){await page.locator('[data-control="neck"]').selectOption(neck);await page.locator('[data-control="boiled"]').selectOption(boiled);const growth=await page.locator('#scene text').allTextContents();assert.equal(growth.filter(s=>s==='미생물 증식 모형').length,boiled==='no'||['cut','tilt'].includes(neck)?1:0);}
  await page.locator('[data-control="boiled"]').selectOption('yes');await page.locator('[data-control="neck"]').selectOption('cut');await page.locator('#record').click();await capture('pasteur');
  await open('10과탐1-02#2');for(const stage of ['dispersion','single','combine']){await page.locator('[data-control="stage"]').selectOption(stage);if(stage==='single')for(const color of ['0','1','2'])await page.locator('[data-control="color"]').selectOption(color);if(stage==='combine'){assert.match(await page.locator('#observation').textContent(),/흰빛/);await page.locator('[data-control="screen"]').fill('30');assert.doesNotMatch(await page.locator('#observation').textContent(),/흰빛이 보/);await page.locator('[data-control="screen"]').fill('0');}}
  await page.locator('#record').click();await capture('prism');
  const [download]=await Promise.all([page.waitForEvent('download'),page.locator('#download').click()]);const data=JSON.parse(fs.readFileSync(await download.path(),'utf8'));assert.equal(data.activity,'10과탐1-02#2');assert.equal(data.records.length,1);
  await page.locator('#reset').click();assert.equal(await page.locator('#records tbody tr').count(),0);assert.equal(await page.locator('[data-control="stage"]').inputValue(),'dispersion');
  await page.goto(url+'/rock-age/');await page.waitForFunction(()=>window.__rockModel);const results=await page.evaluate(()=>{const m=__rockModel;m.setMode('strata');const rows=[];for(const iso of ['c14','k40','u238'])for(const target of ['fault','A','C','D','dyke','ash']){m.setIso(iso);m.setTarget(target);rows.push({iso,target,verdict:m.analyse().verdict});}m.setIso('c14');m.setTarget('dyke');m.check();return rows;});
  for(const r of results)if(['fault','A','C','D'].includes(r.target)||(r.iso==='c14'&&r.target==='dyke'))assert.equal(r.verdict,'p4');
  assert.match(await page.locator('#elementaryExplanation').textContent(),/観|관입암 자체/);await webp(page.locator('.experiment-layout'),path.join(out,`dating-${engine}.webp`));
  await page.evaluate(()=>{__rockModel.setMode('decay');__rockModel.setIso('k40');__rockModel.setHl(1);__rockModel.check();});assert.equal(await page.locator('[data-prediction="p4"]').isVisible(),false);assert.match(await page.locator('#elementaryExplanation').textContent(),/칼슘-40/);await webp(page.locator('.experiment-layout'),path.join(out,`decay-k40-${engine}.webp`));assert.deepEqual(errors,[]);
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
});
