const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const phase=require('../learning/inquiry/science-lab/state-change/phase-model.js');
test('water phases: coexistence, mass balance and latent heat plateaus',()=>{
    let count=0;
    for(let t=-10;t<=110;t++)for(let p=0;p<=100;p+=10){const a=phase.sample(t,p);assert.ok(Math.abs(a.ice+a.liquid+a.vapour-1)<1e-12);assert.equal(a.mass,100);const expected=t<0?'solid':t>100?'gas':t===0?(p===0?'solid':p===100?'liquid':'solid-liquid'):t===100?(p===0?'liquid':p===100?'gas':'liquid-gas'):'liquid';assert.equal(a.state,expected);count++;}
    assert.ok(Math.abs((phase.sample(0,100).time-phase.sample(0,0).time)*60*100-33400)<1e-7);
    assert.ok(Math.abs((phase.sample(100,100).time-phase.sample(100,0).time)*60*100-226000)<1e-7);
    assert.equal(phase.sample(0,50).state,'solid-liquid');assert.equal(phase.sample(100,50).state,'liquid-gas');
    console.log(count+' temperature/fraction states verified against independent phase rules');
});
for(const engine of ['chromium','webkit'])test(engine+': corrected phase grades and non-numeric food chains',{timeout:120000},async()=>{
    const root=path.resolve(__dirname,'../learning/inquiry/science-lab'),out=path.resolve(__dirname,'../docs/science-lab-audit-2026-09-20/content-validity');fs.mkdirSync(out,{recursive:true});
    const server=http.createServer((req,res)=>{let f=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!f.startsWith(root+path.sep)){res.writeHead(403).end();return;}if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');fs.readFile(f,(e,b)=>{if(e){res.writeHead(404).end();return;}res.setHeader('Content-Type',{'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'}[path.extname(f)]||'application/octet-stream');res.end(b);});});await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
    try{browser=await require('playwright')[engine].launch({headless:true,...(engine==='chromium'?{executablePath:process.env.SCIENCE_BROWSER||'C:/Program Files/Google/Chrome/Application/chrome.exe'}:{})});const page=await browser.newPage({viewport:{width:1024,height:768},hasTouch:true});await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.clock.install();
    await page.goto('http://127.0.0.1:'+server.address().port+'/state-change/');
    for(const [t,p,expected]of [[-10,50,'solid'],[0,0,'solid'],[0,50,'solid-liquid'],[0,100,'liquid'],[20,50,'liquid'],[100,0,'liquid'],[100,50,'liquid-gas'],[100,100,'gas'],[110,50,'gas']]){
        await page.evaluate(([t,p])=>{__phaseModel.setTemperature(t);__phaseModel.setProgress(p);},[t,p]);
        for(const choice of ['solid','liquid','gas','solid-liquid','liquid-gas']){await page.locator('[data-prediction="'+choice+'"]').tap();await page.locator('#checkStateBtn').tap();assert.equal(/맞았습니다/.test(await page.locator('#predictionResult').textContent()),choice===expected,t+'/'+p+'/'+choice);}
        const before=await page.locator('#iceClipRect').getAttribute('height');await page.clock.runFor(10000);assert.equal(await page.locator('#iceClipRect').getAttribute('height'),before,'no spontaneous phase oscillation');
        assert.equal(await page.locator('#beaker').getAttribute('data-phase'),expected);
    }
    await page.evaluate(()=>{__phaseModel.setTemperature(0);__phaseModel.setProgress(50);});await page.locator('.experiment-layout').screenshot({path:path.join(out,'phase-coexist-'+engine+'.png')});
    for(const width of [1366,1024,820,768]){await page.setViewportSize({width,height:1024});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);}
    await page.goto('http://127.0.0.1:'+server.address().port+'/life-cycle/');
    for(const animal of ['butterfly','mantis','frog','chick']){await page.evaluate(a=>{__lifeModel.setAnimal(a);__lifeModel.check();},animal);const s=await page.evaluate(()=>({a:__lifeModel.analyse(),text:document.getElementById('graphGroup').textContent,explanation:document.getElementById('elementaryExplanation').textContent}));assert.ok(s.a.chain.every(x=>!Object.hasOwn(x,'count')));assert.ok(!/쯤|필요한 수|열 배쯤/.test(s.text));assert.ok(!/쓰여 사라지므로/.test(s.explanation));assert.equal(await page.locator('[data-food-direction]').count(),s.a.chain.length-1);}
    await page.locator('.experiment-layout').screenshot({path:path.join(out,'food-chain-'+engine+'.png')});assert.deepEqual(errors,[]);
    }finally{await browser?.close();await new Promise(r=>server.close(r));}
});
