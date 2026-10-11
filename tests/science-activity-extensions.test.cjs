const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const ext=require('../learning/inquiry/science-lab/activity-analysis.js'),registry=require('../scripts/science-activity-tools.cjs'),shot=require('./science-screenshot.cjs');
const near=(a,b,tol=1e-7)=>assert(Math.abs(a-b)<tol,`${a} != ${b}`);
test('data parsing rejects missing cells; regression retains known slope and intercept',()=>{
 assert.throws(()=>ext.parseTable('1,,3\n2,3,4',3));assert.throws(()=>ext.parseTable('1,bad\n2,3'));assert.throws(()=>ext.parseTable('1,2\n1,3').length&&ext.regression([[1,2],[1,3]]));
 const r=ext.regression(ext.parseTable('시간,온도\n0,2\n1,5\n2,8'));near(r.slope,3);near(r.intercept,2);near(r.r2,1);
});
test('independent physical limiting cases and analytical results',()=>{
 const run=(id,patch={})=>ext.specs[id].run({...ext.defaults(id),...patch});
 near(run('gas-identity',{temperature:25,pressure:101.325,vapor:0,head:0,volume:100,mass:44*101.325*.1/(8.314462618*298.15)}).M,44);
 near(run('buffer',{added:0}).pure,7);assert(run('buffer',{added:0.1}).pure>run('buffer',{added:0.1}).pH);assert(run('buffer',{added:-0.1}).pure<run('buffer',{added:-0.1}).pH);
 const deep=run('water-waves',{depth:100,length:10});near(deep.speed,Math.sqrt(9.81*10/(2*Math.PI)),1e-6);
 const hz=run('habitable-zone',{temperature:5772,radius:1});near(hz.L,1);near(hz.inner,Math.sqrt(1/1.1));
 near(run('cluster-distance',{data:'0,1,6\n1,2,7',extinction:0}).distance,100);
 const solar=run('sunspots',{days:4,longitude:360*4/27});near(solar.syn,27);assert(solar.sid<solar.syn);
 const noPower=run('wireless',{supply:'dc'});assert.match(noPower.summary,/0 V/);
});
test('standard genetic code and biological model boundary cases',()=>{
 assert.equal(Object.keys(ext.codons).length,64);assert.equal(Object.values(ext.codons).filter(x=>x==='*').length,3);
 const run=(id,patch)=>ext.specs[id].run({...ext.defaults(id),...patch});
 assert.equal(run('translation',{sequence:'AUGGCUUUUUAA',step:20}).peptide,'MAF');assert(run('translation',{sequence:'AUGGCUUUUUAA',step:20}).stopped);
 assert.equal(run('translation',{sequence:'CCCGGG',step:20}).peptide,'');assert.throws(()=>run('translation',{sequence:'ATG'}));
 assert.equal((run('dna-replication',{progress:0}).svg.match(/fill="#f0c58e"/g)||[]).length,0);
 assert.equal((run('dna-replication',{progress:24}).svg.match(/fill="#f0c58e"/g)||[]).length,24);
});
test('every activity model supports declared numeric endpoints without non-finite output',()=>{
 for(const [id,spec]of Object.entries(ext.specs)){
  const states=[ext.defaults(id)];for(const c of spec.controls){if(c.type==='number')for(const value of [c.min,c.max])states.push({...ext.defaults(id),[c.key]:value});if(c.type==='select')for(const [value]of c.options)states.push({...ext.defaults(id),[c.key]:value});}
  for(const state of states){const r=spec.run(state);assert.equal(typeof r.summary,'string',id);assert(!/NaN|Infinity|undefined/.test(r.svg),id);}
 }
 for(const entry of Object.values(registry))assert(['periodic','pasteur','prism'].includes(entry.tool)||ext.specs[entry.tool],entry.tool);
});
for(const engine of ['chromium','webkit'])test(engine+': registered tools, edit, persist and invalid data',{timeout:180000},async()=>{
 const root=path.resolve('learning/inquiry/science-lab'),out=path.resolve(process.env.SCIENCE_TEST_ARTIFACTS||'tmp/science-activity-extensions');fs.mkdirSync(out,{recursive:true});
 const server=http.createServer((req,res)=>{let p=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!p.startsWith(root+path.sep))return res.writeHead(403).end();fs.readFile(p,(e,b)=>{if(e)return res.writeHead(404).end();res.setHeader('Content-Type',p.endsWith('.html')?'text/html; charset=utf-8':p.endsWith('.js')?'text/javascript':'text/css');res.end(b);});});await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{browser=await require('playwright')[engine].launch({headless:true,...(engine==='chromium'?{executablePath:process.env.SCIENCE_BROWSER}:{})});const page=await browser.newPage({viewport:{width:1024,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
 for(const [id,entry]of Object.entries(registry).filter(([,r])=>ext.specs[r.tool])){
  await page.goto(`http://127.0.0.1:${server.address().port}/activity-workbench.html?activity=${encodeURIComponent(id)}`);await page.waitForSelector('#observation');assert(await page.locator('#scene svg').count(),id);
  await page.locator('#record').click();assert.equal(await page.locator('#records tbody tr').count(),1);await page.locator('#save').click();await page.reload();assert.equal(await page.locator('#records tbody tr').count(),1);
  for(const width of [390,1024]){await page.setViewportSize({width,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,id+' overflow');await shot(page.locator('#workbench'),path.join(out,`${entry.tool}-${engine}-${width}.webp`));}
  if(entry.tool==='climate'){await page.locator('[data-control="data"]').fill('1,,2\n2,3');assert(await page.locator('#record').isDisabled());await page.locator('[data-control="data"]').fill('0,2\n1,5\n2,8');assert.match(await page.locator('#observation').textContent(),/기울기 3/);assert(!(await page.locator('#record').isDisabled()));}
 }assert.deepEqual(errors,[]);
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
});
