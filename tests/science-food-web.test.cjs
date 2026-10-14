const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const M=require('../learning/inquiry/science-lab/food-web-model.js');
test('classification and directed food paths remain distinct; removal never invents a shortcut',()=>{
 const s=M.create();assert.deepEqual(M.classify(s).missing,M.cards.map(c=>c.id));
 for(const c of M.cards)M.assign(s,c.id,c.role);assert.equal(M.classify(s).correct.length,9);
 M.assign(s,'mushroom','consumer');assert.deepEqual(M.classify(s).wrong,['mushroom']);M.assign(s,'mushroom','');assert.deepEqual(M.classify(s).missing,['mushroom']);assert.equal(M.assign(s,'unknown','producer'),false);
 assert.equal(M.connect(s,'frog','frog'),false);assert.equal(M.connect(s,'mushroom','frog'),false);
 const edges=['rice>grasshopper','cabbage>grasshopper','cabbage>caterpillar','grasshopper>frog','caterpillar>frog','rice>sparrow','grasshopper>sparrow','caterpillar>sparrow','frog>hawk','sparrow>hawk'];
 for(const e of edges)assert(M.connect(s,...e.split('>')));assert.equal(M.connect(s,'rice','sparrow'),false);assert.equal(M.remove(s,'frog'),false,'unchecked construction cannot be used for the comparison');
 assert.deepEqual(M.check(s).wrong,[]);assert.deepEqual(M.check(s).missing,[]);assert.equal(M.paths(s,'hawk').length,7);
 for(const [removed,paths,direct]of [['frog',4,['sparrow']],['sparrow',3,['frog']],['grasshopper',3,['frog','sparrow']]]){assert(M.remove(s,removed));assert.equal(M.paths(s,'hawk').length,paths);assert.deepEqual(M.prey(s,'hawk'),direct);assert(M.paths(s,'hawk').every(p=>!p.includes(removed)));assert.equal(M.activeEdges(s).includes('rice>hawk'),false);}
 M.remove(s,'none');M.disconnect(s,'grasshopper>frog');M.connect(s,'frog','grasshopper');assert.deepEqual(M.check(s).wrong,['frog>grasshopper']);assert.deepEqual(M.check(s).missing,['grasshopper>frog']);assert.equal(M.complete(s),false);
 // Even an incorrect learner-created cycle must terminate, not recurse forever.
 M.connect(s,'grasshopper','frog');assert(M.paths(s,'hawk').every(p=>new Set(p).size===p.length));
});
for(const engine of ['chromium','webkit'])test(engine+': classify, build, correct, remove and compare food relationships with touch and keyboard',{timeout:180000},async()=>{
 const root=path.resolve(__dirname,'../learning/inquiry/science-lab'),out=path.resolve('docs/science-lab-audit-2026-10-12/course-practices/browser');fs.mkdirSync(out,{recursive:true});
 const server=http.createServer((req,res)=>{let file=path.resolve(root,'.'+new URL(req.url,'http://local').pathname);if(!file.startsWith(root+path.sep))return res.writeHead(403).end();if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');fs.readFile(file,(e,b)=>{if(e)return res.writeHead(404).end();res.setHeader('Content-Type',{'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'}[path.extname(file)]||'application/octet-stream');res.end(b);});});await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{browser=await require('playwright')[engine].launch({headless:true,...(engine==='chromium'?{executablePath:process.env.SCIENCE_BROWSER}:{})});const page=await browser.newPage({viewport:{width:1366,height:768},hasTouch:true}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());await page.goto('http://127.0.0.1:'+server.address().port+'/food-web/');await page.waitForFunction(()=>!!window.__foodWeb);
 const snapshot=()=>page.evaluate(()=>window.__foodWeb.getState()),node=id=>page.locator('[data-fw-node="'+id+'"]'),paint=()=>page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
 await page.locator('#fwCheckRoles').tap();assert.match(await page.locator('#fwRoleStatus').textContent(),/9종/);
 for(const c of M.cards)await page.locator('[data-fw-role="'+c.id+'"]').selectOption(c.id==='mushroom'?'consumer':c.role);
 await page.locator('#fwCheckRoles').tap();assert.deepEqual((await snapshot()).roleCheck.wrong,['mushroom']);
 await page.locator('[data-fw-role=mushroom]').selectOption('decomposer');await page.locator('#fwCheckRoles').tap();assert.equal((await snapshot()).roleCheck.correct.length,9);
 for(const [width,height]of [[1366,768],[1180,820],[1024,768],[820,1180],[768,1024]]){await page.setViewportSize({width,height});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);await require('./science-screenshot.cjs')(page.locator('.fw-role-panel'),path.join(out,`${engine}-food-roles-${width}.webp`));}
 await page.locator('[data-fw-mode=web]').tap();assert(await page.locator('#fwMissing').isDisabled());await node('frog').focus();await page.keyboard.press('Enter');assert.equal((await snapshot()).from,'frog');await page.keyboard.press('Enter');assert.equal((await snapshot()).from,null);
 await node('frog').tap();await node('grasshopper').tap();await page.locator('#fwCheckWeb').tap();await paint();assert.deepEqual((await snapshot()).edgeCheck.wrong,['frog>grasshopper']);assert.equal(await page.locator('.fw-line.wrong').count(),1);
 await page.getByRole('button',{name:'개구리 → 메뚜기 연결 삭제',exact:true}).tap();
 for(const edge of M.edges)for(const id of edge.split('>'))await node(id).tap();await page.locator('#fwCheckWeb').tap();await paint();assert.equal((await snapshot()).edgeCheck.missing.length,0);assert.equal(await page.locator('.fw-line').count(),10);assert.equal(await page.locator('#fwMissing').isDisabled(),false);
 await page.locator('#fwFlow').tap();await paint();assert.notEqual(await page.locator('.fw-line.flow').first().evaluate(n=>getComputedStyle(n).animationName),'none');await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.locator('.fw-line.flow').first().evaluate(n=>getComputedStyle(n).animationName),'none');await page.emulateMedia({reducedMotion:'no-preference'});
 for(const removed of ['none','frog','sparrow']){await page.locator('#fwMissing').selectOption(removed);if(removed!=='none')assert.match(await page.locator('#fwComparison').textContent(),removed==='frog'?/참새와의 관계/:/개구리와의 관계/);
  for(const[width,height]of [[1366,768],[1180,820],[1024,768],[820,1180],[768,1024]]){await page.setViewportSize({width,height});await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
   assert((await page.locator('.fw-line').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('d')))).every(d=>!d.includes('NaN')&&!d.includes('Infinity')));assert.equal(await page.locator('.fw-line.missing').count(),removed==='none'?0:removed==='frog'?3:4);
   await require('./science-screenshot.cjs')(page.locator('.fw-web-panel'),path.join(out,`${engine}-food-web-${removed}-${width}.webp`));
  }
 }
 await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);await page.locator('#fwReset').tap();assert.deepEqual(await snapshot(),M.create());
 await page.locator('.quiz-section>summary').tap();for(const card of await page.locator('.quiz-card').all()){const answer=await card.getAttribute('data-answer'),wrong=answer==='a'?'b':'a';await card.locator('input[value="'+wrong+'"]').check();await card.locator('.answer-button').click();await card.locator('input[value="'+answer+'"]').check();await card.locator('.answer-button').click();assert.match(await card.textContent(),/첫 응답은 오답/);}
 await page.waitForFunction(()=>!!document.querySelector('.exam-widget')?.examController);assert.deepEqual(await page.locator('.exam-widget').evaluate(w=>w.examController.ids()),['food-web@decomposer','food-web@remaining-path']);assert.deepEqual(errors,[]);
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
});
