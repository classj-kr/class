const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const puppeteer = require('puppeteer-core');
const C = require('../learning/inquiry/periodic-table/matter-core.js');
const root = path.resolve(__dirname, '../learning/inquiry/periodic-table');

function coreChecks() {
    assert.equal(C.heating(30).temperature, 0);
    assert.equal(C.heating(70).temperature, 100);
    assert.equal(C.heating(100).temperature, 120);
    assert.equal(C.gasPressure(.1,300,2)*2,C.gasPressure(.1,300,1));
    assert.equal(C.gasPressure(.1,300,2)*2,C.gasPressure(.1,600,2));
    for(let i=0;i<C.atoms.length;i++)for(const ion of [false,true]) {
        const a=C.atomCounts(i,ion);
        assert.equal(a.protons+a.neutrons,a.a);
        assert.equal(a.protons-a.electrons,a.charge);
        assert.equal(a.shells.reduce((s,n)=>s+n,0),a.electrons);
    }
    for(let z=1;z<=29;z++) {
        const rows=C.configuration(z);
        assert.equal(rows.reduce((s,r)=>s+r.count,0),z);
        for(const r of rows){assert.ok(r.occupancy.every(n=>n>=0&&n<=2));assert.equal(r.occupancy.reduce((s,n)=>s+n,0),r.count);}
    }
    assert.deepEqual(C.configuration(7)[2].occupancy,[1,1,1]);
    assert.equal(C.configuration(24)[5].count,1);assert.equal(C.configuration(24)[6].count,5);
    assert.equal(C.configuration(29)[5].count,1);assert.equal(C.configuration(29)[6].count,10);
    assert.ok(Math.abs(C.radial(2,0,2))<1e-10);
    assert.equal(C.angular('z',1,0,0),0);
    const cloud=C.sampleOrbital(0,4000);
    const mean=cloud.reduce((s,p)=>s+Math.hypot(p.x,p.y,p.z),0)/cloud.length;
    assert.ok(Math.abs(mean-1.5)<.08,`1s mean radius ${mean} a0`);
    for(let i=0;i<C.orbitals.length;i++)assert.ok(C.sampleOrbital(i,100).every(p=>[p.x,p.y,p.z].every(Number.isFinite)));
    for(let h=0;h<=12;h++)for(let o=0;o<=6;o++) {
        const r=C.reaction(h,o);assert.equal(2*r.hydrogen+2*r.water,2*h);assert.equal(2*r.oxygen+r.water,2*o);
        assert.ok(r.hydrogen<2||r.oxygen===0);
    }
    for(const k of [.5,1,3,5]){const e=C.equilibrium(8,2,k,100);assert.ok(Math.abs(e.a+e.b-10)<1e-8);assert.ok(Math.abs(e.q-k)<1e-5);assert.ok(Math.abs(e.forward-e.reverse)<1e-5);}
    assert.ok(Math.abs(C.neutralization(0).ph-1)<1e-8);
    assert.equal(C.neutralization(25).ph,7);
    assert.ok(C.neutralization(50).ph>12);
    console.log('Core: gas laws, isotope/ion counts, Hund/Pauli, orbital distribution, atom conservation, equilibrium and pH passed.');
}
async function run() {
    coreChecks();
    const server=http.createServer((req,res)=>{let file=path.resolve(root,'.'+new URL(req.url,'http://local').pathname);if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);res.end();return;}res.setHeader('Content-Type',{'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'}[path.extname(file)]||'application/octet-stream');res.end(data);});});
    await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
    try {
        browser=await puppeteer.launch({headless:true,executablePath:process.env.SCIENCE_BROWSER||'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--no-first-run','--disable-background-networking']});
        const page=await browser.newPage();await page.setViewport({width:1440,height:1080,deviceScaleFactor:1});
        await page.setRequestInterception(true);page.on('request',r=>new URL(r.url()).hostname==='127.0.0.1'?r.continue():r.abort());
        const errors=[];page.on('pageerror',e=>errors.push(e.message));
        await page.goto(`http://127.0.0.1:${server.address().port}/`,{waitUntil:'networkidle0'});
        await page.waitForSelector('#modelStage canvas');
        const shots=path.resolve(__dirname,'../tmp/matter-models');fs.mkdirSync(shots,{recursive:true});
        await page.screenshot({path:path.join(shots,'states-desktop.png'),fullPage:true});
        const ids=await page.$$eval('[data-model]',els=>els.map(el=>el.dataset.model));assert.equal(ids.length,13);
        const input=async(key,value)=>page.$eval('#control-'+key,(el,v)=>{el.value=String(v);el.dispatchEvent(new Event('input',{bubbles:true}));},value);
        for(const id of ids){await page.click(`[data-model="${id}"]`);assert.ok(await page.$eval('#modelStage',el=>el.children.length>0),id);assert.ok(await page.$eval('#modelFacts',el=>el.textContent.length>10),id);}
        await page.click('[data-model="orbital"]');
        for(let i=0;i<C.orbitals.length;i++)await input('orbital',i);
        await input('orbital',2);await input('phase','sign');await page.screenshot({path:path.join(shots,'orbital-desktop.png'),fullPage:true});
        const before=await page.$eval('#modelStage canvas',el=>el.toDataURL());
        await page.focus('#modelStage canvas');await page.keyboard.press('ArrowRight');
        assert.notEqual(await page.$eval('#modelStage canvas',el=>el.toDataURL()),before);
        await input('slice','slice');
        await page.click('[data-model="states"]');await input('focus','liquid');assert.equal(await page.$eval('#modelStage canvas',el=>el.width),390);await page.click('#modelPause');const pausedImage=await page.$eval('#modelStage canvas',el=>el.toDataURL());await new Promise(r=>setTimeout(r,150));assert.equal(await page.$eval('#modelStage canvas',el=>el.toDataURL()),pausedImage);await page.click('#modelPause');
        await page.click('[data-model="gas"]');await input('volume',1);await input('temperature',600);assert.match(await page.$eval('#modelFacts',el=>el.textContent),/498\.9/);
        await page.click('[data-model="atom"]');await input('ion','ion');assert.match(await page.$eval('#modelFacts',el=>el.textContent),/10개/);
        await input('isotope',2);assert.equal(await page.$eval('#control-ion',el=>el.disabled),true);
        await page.click('[data-model="bond"]');
        for(const compound of ['H2','CO2','H2O','NH3','CH4','BF3','NaCl','metal']){await input('compound',compound);if(!['NaCl','metal'].includes(compound))await input('view','lewis');}
        await input('compound','H2O');await page.screenshot({path:path.join(shots,'bond-desktop.png'),fullPage:true});
        await page.click('[data-model="phase"]');await input('progress',70);assert.match(await page.$eval('#modelFacts',el=>el.textContent),/100 °C/);await input('direction','cool');assert.match(await page.$eval('#modelFacts',el=>el.textContent),/0 °C/);
        await page.click('[data-model="reaction"]');await input('hydrogen',0);assert.match(await page.$eval('#modelFacts',el=>el.textContent),/0분자/);
        await page.click('[data-model="acid"]');await input('volume',25);assert.match(await page.$eval('#modelFacts',el=>el.textContent),/7\.00/);
        await page.click('[data-answer="1"]');assert.equal(await page.$eval('[data-answer="1"]',el=>el.disabled),true);await page.click('[data-answer="0"]');assert.equal(await page.$eval('#modelAnswers',el=>[...el.children].every(b=>b.disabled)),true);
        await page.click('#modelReset');assert.equal(await page.$eval('#control-volume',el=>el.value),'0');
        await page.click('#tabExploreBtn');assert.equal(await page.$eval('#toolbarSection',el=>getComputedStyle(el).display!=='none'),true);
        await page.click('#tabQuizBtn');assert.equal(await page.$$eval('.quiz-opt-btn',els=>els.length),4);
        await page.click('#tabMoleculeBtn');assert.ok(await page.$('#molecule3dCanvas'));
        await page.click('#tabModelsBtn');
        await page.setViewport({width:390,height:844,deviceScaleFactor:1});
        for(const id of ids){await page.$eval(`[data-model="${id}"]`,el=>el.click());assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,`${id}: mobile overflow`);}
        await page.$eval('[data-model="states"]',el=>el.click());await page.screenshot({path:path.join(shots,'states-mobile.png'),fullPage:true});await input('focus','liquid');await page.screenshot({path:path.join(shots,'liquid-mobile.png'),fullPage:true});
        await page.$eval('[data-model="orbital"]',el=>el.click());await input('orbital',11);await page.screenshot({path:path.join(shots,'orbital-mobile.png'),fullPage:true});
        assert.deepEqual(errors,[]);
        console.log('Browser: 13 models, all orbitals/bonds, controls, retries, existing tabs and 390px overflow checks passed.');
        console.log('Screenshots: '+shots);
    } finally {if(browser)await browser.close();await new Promise(r=>server.close(r));}
}
run().catch(e=>{console.error(e);process.exitCode=1;});
