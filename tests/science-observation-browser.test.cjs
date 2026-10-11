const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const screenshotWebp=require('./science-screenshot.cjs');
const root=path.resolve(__dirname,'../learning/inquiry/science-lab');
for(const engine of ['chromium','webkit'])test(engine+': sound playback, lunar dates and atmospheric boundary conditions',{timeout:180000},async()=>{
 const out=path.resolve(process.env.SCIENCE_TEST_ARTIFACTS||'tmp/science-observation-browser');fs.mkdirSync(out,{recursive:true});
 const server=http.createServer((req,res)=>{let file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!file.startsWith(root+path.sep))return res.writeHead(403).end();if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');fs.readFile(file,(error,bytes)=>{if(error)return res.writeHead(404).end();res.setHeader('Content-Type',{'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.webp':'image/webp'}[path.extname(file)]||'application/octet-stream');res.end(bytes);});});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));let browser;
 try{
  browser=await require('playwright')[engine].launch({headless:true,...(engine==='chromium'?{executablePath:process.env.SCIENCE_BROWSER}:{})});
  const page=await browser.newPage({viewport:{width:1024,height:900},hasTouch:true}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
  // Observe the real audio graph rather than replacing playback with a stub.
  await page.addInitScript(()=>{
   window.audioAudit={contexts:0,tones:[],gains:[]};const Context=window.AudioContext||window.webkitAudioContext;if(!Context)return;
   window.AudioContext=class extends Context{
    constructor(...args){try{super(...args);}catch(e){audioAudit.constructorError=e.message;throw e;}audioAudit.contexts++;window.lastAudioContext=this;}
    createOscillator(){const node=super.createOscillator(),start=node.start.bind(node);node.start=(...args)=>{audioAudit.tones.push(node.frequency.value);return start(...args);};return node;}
    createGain(){const node=super.createGain(),ramp=node.gain.linearRampToValueAtTime.bind(node.gain);node.gain.linearRampToValueAtTime=(value,time)=>{audioAudit.gains.push(value);return ramp(value,time);};return node;}
   };
  });
  const open=async slug=>{await page.goto(`http://127.0.0.1:${server.address().port}/${slug}/`);await page.waitForLoadState('networkidle');};
  const choice=async(key,value)=>page.locator(`[data-supplement-choice="${key}"][data-value="${value}"]`).click();
  const capture=async(slug,selector='.experiment-layout')=>{for(const width of [390,768,1024]){await page.setViewportSize({width,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,slug+': overflow '+width);await screenshotWebp(page.locator(selector),path.join(out,`${slug}-${engine}-${width}.webp`));}};
  await open('sound-vibration');assert.equal(await page.evaluate(()=>audioAudit.contexts),0);
  const listen=page.getByRole('button',{name:'이 조건의 소리 듣기'});
  let playback=true;
  for(const [kind,condition]of [['string','on'],['string','off'],['noise','on'],['noise','off']]){
   await choice('kind',kind);await choice('condition',condition);await listen.click();
   await page.waitForFunction(()=>/재생 끝|재생할 수 없습니다/.test(document.querySelector('.supplement-audio [role="status"]').textContent));
   if((await page.locator('.supplement-audio [role="status"]').textContent()).includes('재생할 수 없습니다')){assert.equal(engine,'webkit','Chromium audio must play');playback=false;assert.equal(await listen.isDisabled(),false);break;}
  }
  const audio=await page.evaluate(()=>audioAudit);
  if(playback){assert.equal(audio.contexts,1);assert.deepEqual(audio.tones,[440,440,440,440]);const peaks=audio.gains.filter(x=>x>0);assert.equal(peaks.length,4);assert(peaks[0]>peaks[1]);assert(peaks[2]<peaks[3]);}
  else {assert.equal(await page.evaluate(()=>window.lastAudioContext?.state==='running'),false);console.log(engine+': audio unavailable ('+(audio.constructorError||'resume timeout')+'); verified recovery and waveform fallback');}
  await listen.click();await choice('condition','on');assert.equal(await listen.isDisabled(),false);assert.equal(await page.locator('.supplement-audio [role="status"]').textContent(),'');
  await capture('sound-vibration','.curriculum-supplement');
  await open('night-sky');const phases=await page.evaluate(()=>__skyModel.DAYS.map(d=>({day:d.day,label:d.label,lit:__skyModel.analyseMoon({...__skyModel.state,day:d.day}).lit})));
  assert.equal(phases[0].day,0);assert.equal(phases[0].lit,0);assert(Math.abs(phases[2].lit-.5)<1e-12);assert.equal(phases[3].lit,1);assert(Math.abs(phases[4].lit-.5)<1e-12);
  await page.evaluate(()=>{__skyModel.setMode('moon');__skyModel.set('day',__skyModel.DAYS[2].day);__skyModel.runToEnd();});
  assert.doesNotMatch(await page.locator('.experiment-layout').textContent(),/음력/);await capture('night-sky');
  await open('air-stability');
  for(const [lapse,verdict]of [[4.5,'p1'],[5,'p4'],[5.5,'p2'],[10,'p3']]){
   const actual=await page.evaluate(l=>{__airModel.setLapse(l);return __airModel.analyse().verdict;},lapse);assert.equal(actual,verdict);await page.locator(`[data-prediction="${verdict}"]`).click();await page.evaluate(()=>__airModel.check());assert.match(await page.locator('#predictionResult').textContent(),/맞/);
  }
  const atmosphere=await page.evaluate(()=>{
   const m=__airModel;m.state.lapse=m.GD;m.render();m.check();const verdict=m.analyse().verdict;
   const curves=[];for(const height of [500,3000]){m.state.height=height;const lcl=m.crossing().lcl;curves.push({height,lcl,near:[m.liftedAt(lcl-1e-6),m.liftedAt(lcl+1e-6)],at3:m.liftedAt(3),expected:m.state.temp-m.GD*Math.min(3,lcl)-m.GM*Math.max(0,3-lcl)});}
   m.setHeight(3000);m.setLapse(5);m.check();return{verdict,curves};
  });
  assert.equal(atmosphere.verdict,'p4');for(const c of atmosphere.curves){assert(Math.abs(c.near[0]-c.near[1])<.00003);assert(Math.abs(c.at3-c.expected)<1e-10);}assert.equal(atmosphere.curves[0].at3,atmosphere.curves[1].at3);
  await page.locator('[data-prediction="p4"]').click();await page.evaluate(()=>__airModel.check());assert.match(await page.locator('#elementaryExplanation').textContent(),/포화 공기는 중립/);await capture('air-stability');
  await open('energy-metabolism');await page.evaluate(()=>__metabModel.setMode('atp'));
  for(const [shuttle,total]of [['malate',32],['g3p',30]]){
   const value=await page.evaluate(s=>{__metabModel.setShuttle(s);__metabModel.check();return __metabModel.atpPlan(true,s).total;},shuttle);assert.equal(value,total);assert.match(await page.locator('#elementaryExplanation').textContent(),/전자/);
  }
  await capture('energy-metabolism');assert.deepEqual(errors,[]);
 }finally{await browser?.close();await new Promise(resolve=>server.close(resolve));}
});
