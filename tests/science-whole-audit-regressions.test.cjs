const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),http=require('node:http');
const optics=require('../learning/inquiry/science-lab/optics-comparison.js');
const {synchronize}=require('../scripts/sync-science-assets.cjs');
const screenshotWebp=require('./science-screenshot.cjs');
const root=path.resolve(__dirname,'../learning/inquiry/science-lab');
test('all science entry pages and dynamic resources carry their current content hash',()=>assert.deepEqual(synchronize(root,false),[]));
test('all ten optical diagrams satisfy imaging equations and ray intersections',()=>{
 for(const optic of ['plane','convexMirror','concaveMirror','convexLens','concaveLens'])for(const distance of ['near','far']){
  const a=optics(optic,distance),mirror=!optic.endsWith('Lens'),converging=['concaveMirror','convexLens'].includes(optic);
  if(optic==='plane'){assert.equal(a.v,-a.u);assert.equal(a.m,1);}else assert(Math.abs(1/a.u+1/a.v-1/(converging?60:-60))<1e-10);
  assert.equal(a.m>0,!converging||distance==='near');
  assert.equal(Math.abs(a.m)>1,converging&&distance==='near');
  const x=230+(mirror?-a.v:a.v),y=165-a.m*35;
  const rays=[...a.svg.matchAll(/<line data-ray="light" x1="([^"]+)" y1="([^"]+)" x2="([^"]+)" y2="([^"]+)"/g)].slice(2);
  assert.equal(rays.length,2);for(const ray of rays){const [x1,y1,x2,y2]=ray.slice(1).map(Number);assert(Math.abs(y1+(y2-y1)*(x-x1)/(x2-x1)-y)<1e-8);}
  assert.equal((a.svg.match(/data-ray="extension"/g)||[]).length,a.v<0?2:0);
  assert.match(a.svg,/data-optics-part="device"/);
 }
});
test('a changed child invalidates its dynamic loader and HTML entry; rerun is stable',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'science-cache-'));
 try{fs.writeFileSync(path.join(dir,'child.js'),'const version=1;');fs.writeFileSync(path.join(dir,'loader.js'),"new URL('child.js?v=1',base)");fs.writeFileSync(path.join(dir,'index.html'),'<script src="loader.js?v=1"></script>');
  assert.equal(synchronize(dir,true).length,2);assert.deepEqual(synchronize(dir,false),[]);const first=fs.readFileSync(path.join(dir,'index.html'),'utf8');
  fs.writeFileSync(path.join(dir,'child.js'),'const version=2;');assert.equal(synchronize(dir,true).length,2);assert.notEqual(fs.readFileSync(path.join(dir,'index.html'),'utf8'),first);assert.deepEqual(synchronize(dir,false),[]);
 }finally{for(const name of ['child.js','loader.js','index.html'])fs.unlinkSync(path.join(dir,name));fs.rmdirSync(dir);}
});
for(const engine of ['chromium','webkit'])test(engine+': corrected observations, charge conservation and complete electrical apparatus',{timeout:180000},async()=>{
 const out=path.resolve(process.env.SCIENCE_TEST_ARTIFACTS||'tmp/science-whole-regressions');fs.mkdirSync(out,{recursive:true});
 const server=http.createServer((req,res)=>{let file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!file.startsWith(root+path.sep))return res.writeHead(403).end();if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');fs.readFile(file,(error,bytes)=>{if(error)return res.writeHead(404).end();res.setHeader('Content-Type',{'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.webp':'image/webp'}[path.extname(file)]||'application/octet-stream');res.end(bytes);});});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));let browser;
 try{
  browser=await require('playwright')[engine].launch({headless:true,...(engine==='chromium'?{executablePath:process.env.SCIENCE_BROWSER}:{})});
  const page=await browser.newPage({viewport:{width:1024,height:900},hasTouch:true}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
  const open=async slug=>{await page.goto(`http://127.0.0.1:${server.address().port}/${slug}/`);await page.waitForLoadState('networkidle');};
  const choice=async(key,value)=>page.locator(`[data-supplement-choice="${key}"][data-value="${value}"]`).click();
  const shot=async(name,selector='.curriculum-supplement')=>screenshotWebp(page.locator(selector),path.join(out,name+'-'+engine+'.webp'));
  await open('refraction');await page.evaluate(()=>{__rayModel.setAngle(30);__rayModel.setDir('out');});
  assert.match(await page.locator('#stageCaption').textContent(),/공기/);const first=await page.locator('#stageCaption').textContent();
  await page.evaluate(()=>__rayModel.setDir('in'));assert.notEqual(await page.locator('#stageCaption').textContent(),first);
  await page.evaluate(()=>__rayModel.setAngle(0));assert.match(await page.locator('#stageCaption').textContent(),/꺾이지|방향/);
  for(const optic of ['plane','convexMirror','concaveMirror','convexLens','concaveLens'])for(const distance of ['near','far']){
   await choice('optic',optic);await choice('distance',distance);assert.equal(await page.locator('[data-optics-part="device"]').count(),1);assert.equal(await page.locator('[data-optics-part="object"]').count(),1);assert.equal(await page.locator('[data-optics-part="image"]').count(),1);
   for(const width of [390,768,1024]){await page.setViewportSize({width,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false);assert(await page.locator('.supplement-observation').isVisible());}await shot('optics-'+optic+'-'+distance);
  }
  await open('moon-phases');await page.evaluate(()=>__moonModel.setDay(7.4));const quarter=await page.locator('#stageCaption').textContent();await page.evaluate(()=>__moonModel.setDay(0));assert.notEqual(await page.locator('#stageCaption').textContent(),quarter);assert.match(await page.locator('#stageCaption').textContent(),/삭 이후 약 0.0일/);
  await open('natural-selection');await page.evaluate(()=>{__selectionModel.setMode('coat');__selectionModel.setProgress(1);});const values=await page.locator('text').allTextContents();const figure=values.find(s=>s.startsWith('털 색 평균 '));assert(figure);assert(values.includes('평균 '+figure.split(' ').at(-1)));await shot('natural-selection','.experiment-layout');
  await open('ohms-law');await choice('kind','static');await choice('stage','before');const ions=await page.locator('[data-charge="ion"]').allTextContents();const positions=await page.locator('[data-charge="ion"] text').evaluateAll(es=>es.map(e=>[e.getAttribute('x'),e.getAttribute('y')]));
  const beforeElectrons=await page.locator('[data-charge="electron"] text').evaluateAll(es=>es.map(e=>+e.getAttribute('x')));await choice('stage','after');assert.deepEqual(await page.locator('[data-charge="ion"]').allTextContents(),ions);assert.deepEqual(await page.locator('[data-charge="ion"] text').evaluateAll(es=>es.map(e=>[e.getAttribute('x'),e.getAttribute('y')])),positions);const electrons=await page.locator('[data-charge="electron"] text').evaluateAll(es=>es.map(e=>+e.getAttribute('x')));assert.equal(electrons.length,4);assert(electrons.reduce((a,b)=>a+b)>beforeElectrons.reduce((a,b)=>a+b));await shot('electrostatic-induction');
  await choice('kind','coil');assert.equal(await page.locator('[data-coil-wire]').count(),1);await shot('coil-power');
  await open('periodic-bonding');await page.locator('[data-experiment="compound-conductivity"]').click();assert.equal(await page.locator('[data-conductivity-wire]').count(),1);assert.match(await page.locator('.required-experiments').textContent(),/전지/);await shot('compound-conductivity','.required-experiments');
  await open('electric-field');await page.evaluate(()=>__efieldModel.setMode('cap'));assert.equal(await page.locator('[data-capacitor-wire]').count(),1);await shot('capacitor','.experiment-layout');await page.evaluate(()=>{__efieldModel.set('charge','release');__efieldModel.setProgress(.5);});assert.match(await page.locator('#checkBtn').textContent(),/전구/);assert.equal(await page.locator('[data-capacitor-source]').count(),0);assert.equal(await page.locator('[data-capacitor-lamp]').getAttribute('fill'),'#f7cc63');await page.evaluate(()=>__efieldModel.setProgress(1));assert.equal(await page.locator('[data-capacitor-lamp]').getAttribute('fill'),'#e3ebee');await shot('capacitor-released','.experiment-layout');
  await open('energy-conversion');assert.equal(await page.locator('[data-induction-wire]').count(),1);await shot('induction-apparatus');
  await open('flame-ions');await choice('group','noble');assert.match(await page.locator('.curriculum-supplement').textContent(),/기체/);await shot('noble-gases');
  assert.deepEqual(errors,[]);
 }finally{await browser?.close();await new Promise(resolve=>server.close(resolve));}
});
