const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {test}=require('node:test');
test('real specimen comparison, enlarged surfaces and retry rule on desktop and mobile',{timeout:60000},async()=>{
 const root=path.resolve(__dirname,'..');
 const server=http.createServer((req,res)=>{let file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');fs.readFile(file,(err,data)=>{if(err){res.writeHead(404).end();return;}res.setHeader('Content-Type',{'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css','.jpg':'image/jpeg'}[path.extname(file)]||'application/octet-stream');res.end(data);});});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{browser=await chromium.launch({executablePath:process.env.SCIENCE_BROWSER||chromium.executablePath(),headless:true});
try{for(const width of [1366,390]){
 const page=await browser.newPage({viewport:{width,height:950}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());
 await page.goto(`http://127.0.0.1:${server.address().port}/learning/inquiry/science-lab/volcano-model/`,{waitUntil:'networkidle'});
 const panel=page.locator('.curriculum-supplement');await panel.waitFor();await panel.scrollIntoViewIfNeeded();
 assert.doesNotMatch(await panel.innerText(),/관련 성취기준|특징을 비교하는 설명 그림|실제 측정 결과가 아닙니다/);
 assert.equal(await panel.locator('.supplement-note').count(),0);
 assert.equal(await panel.locator('.supplement-guidance:visible').count(),0);
 await page.waitForFunction(()=>[...document.querySelectorAll('.supplement-photo-frame img')].length===2&&[...document.querySelectorAll('.supplement-photo-frame img')].every(i=>i.complete&&i.naturalWidth>2000));
 await panel.locator('[data-supplement-choice="detail"][data-value="grain"]').click();
 assert.equal(await panel.locator('.is-enlarged').count(),2);
 const wrong=panel.locator('[data-check-answer]').filter({hasText:'현무암에서 서로'});await wrong.click();
 assert.match(await panel.locator('.supplement-check-feedback').innerText(),/다시 관찰/);
 assert.equal(await panel.locator('[data-correct="true"]').count(),0);
 const correct=panel.locator('[data-check-answer]').filter({hasText:'화강암에서 여러'});assert.equal(await correct.isEnabled(),true);await correct.click();
 assert.match(await panel.locator('.supplement-check-feedback').innerText(),/정답입니다/);
 assert.equal(await panel.locator('.supplement-check button:enabled').count(),0);
 await panel.locator('.supplement-reset').click();assert.equal(await panel.locator('.supplement-photo-frame img').count(),2);assert.equal(await panel.locator('.is-enlarged').count(),0);
 for(const rock of ['basalt','granite']){await panel.locator(`[data-supplement-choice="rock"][data-value="${rock}"]`).click();assert.equal(await panel.locator('.supplement-photo-frame img').count(),1);await panel.locator('[data-supplement-choice="detail"][data-value="grain"]').click();assert.equal(await panel.locator('.is-enlarged').count(),1);}
 await panel.locator('.supplement-reset').click();await panel.locator('summary').click();assert.equal(await panel.locator('.supplement-sources a').count(),4);await panel.locator('summary').click();
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
 assert.deepEqual(errors,[]);
 console.log(width+': real images, compare, zoom, wrong retry, correct lock, reset, source links and overflow passed');await page.close();
}}finally{await browser.close();}
 }finally{await new Promise(r=>server.close(r));}
});
