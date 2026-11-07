const {chromium}=require('../game-hub-server/node_modules/playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const built=path.join(root,'learning/literacy-numeracy/arithmetics/dist/client');
const output=process.env.ARITHMETIC_CAPTURE_DIR||path.join(root,'outputs/arithmetic-toolbar');
const base=process.env.ARITHMETIC_TEST_URL||'http://127.0.0.1:8788';
// 순위전은 머리 도구 줄이 아니라 오른쪽 아래 학습 기록 단추 줄에 「🏁 순위전」으로 놓인다(다른 학습 앱과 같은 자리).
// 누르면 묻는 창 없이 대기실이 바로 방을 만든다. 제한 시간은 대기실에서 고른다.
const overlaps=(a,b)=>!(a.right<=b.left+1||b.right<=a.left+1||a.bottom<=b.top+1||b.bottom<=a.top+1);
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 for(const [route,width] of [['multiplication-2',1295],['add-subtract-1',1366],['multiplication-2',1024],['multiplication-2',768],['grade-3-division-1',390],['clock-1',1007],['clock-1',390]]){
 const page=await browser.newPage({viewport:{width,height:900}});let submitted=null;
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.route('**/assets/**',async r=>{
 const pathname=decodeURIComponent(new URL(r.request().url()).pathname);
 const target=path.resolve(root,'.'+pathname),app=path.resolve(built,'.'+pathname);
 if(target.startsWith(root+path.sep)&&fs.existsSync(target)&&fs.statSync(target).isFile())await r.fulfill({path:target});
 else if(app.startsWith(built+path.sep)&&fs.existsSync(app)&&fs.statSync(app).isFile())await r.fulfill({path:app});
 else await r.continue();
 });
 await page.route('**/api/**',async r=>{
 const path=new URL(r.request().url()).pathname;
 let data={};
 if(path==='/api/auth/me')data={user:{name:'교사'}};
 if(path==='/api/learning-records/context')data={student:{name:'학생'}};
 if(path==='/api/arithmetic-race'){
 if(r.request().method()==='POST')submitted=r.request().postDataJSON();
 data={roomCode:'123456',participantId:'p1',participantToken:'token1',hostToken:'host1',race:{worksheetName:'검사',worksheetRoute:'/arithmetic/'+route,status:'waiting'},participants:[]};
 }
 await r.fulfill({json:data});
 });
 await page.goto(base+'/arithmetic/'+route);
 await page.getByRole('button',{name:'설정 열기',exact:true}).waitFor();
 await page.waitForFunction(()=>document.querySelector('.counting-back')?.getAttribute('data-site-back-legacy')==='true');
 const race=page.locator('learning-records a.race');
 await race.waitFor();
 await page.locator('learning-records').getByRole('button',{name:'이번 학습 마치기',exact:true}).waitFor();
 assert.equal(await race.innerText(),'🏁 순위전');
 assert.equal(await race.getAttribute('href'),'/arithmetic/race?worksheet='+encodeURIComponent('/arithmetic/'+route));
 assert.equal(await page.locator('.worksheet-race-trigger, body > a.race-link').count(),0,'no race control left in the toolbar or outside the dock');
 const layout=await page.locator('.counting-toolbar').evaluate(toolbar=>{
 const area=toolbar.getBoundingClientRect();
 const buttons=[...toolbar.querySelectorAll('button')].filter(button=>button.getClientRects().length>0).map(button=>{
 const rect=button.getBoundingClientRect(),range=document.createRange();range.selectNodeContents(button);
 return {text:button.textContent,lines:range.getClientRects().length,left:rect.left,right:rect.right,top:rect.top,bottom:rect.bottom};
 });
 return {left:area.left,right:area.right,bottom:area.bottom,buttons};
 });
 assert.ok(layout.buttons.every(button=>!/순위전/.test(button.text)),`${width}: 순위전 is not in the top toolbar`);
 const counter=await page.locator('.counting-progress').boundingBox();
 const settings=await page.getByRole('button',{name:'설정 열기',exact:true}).boundingBox();
 assert.ok(counter.x+counter.width<=settings.x||settings.x+settings.width<=counter.x||counter.y+counter.height<=settings.y||settings.y+settings.height<=counter.y,`${width}: settings cannot cover the correct-answer count`);
 for(const button of layout.buttons){
 assert.equal(button.lines,1,`${width}: ${button.text} must stay on one line`);
 assert.ok(button.left>=layout.left-1&&button.right<=layout.right+1,`${width}: action stays inside toolbar`);
 assert.ok(button.bottom<=layout.bottom+1,`${width}: actions cannot overlap the worksheet`);
 }
 for(let i=0;i<layout.buttons.length;i++)for(let j=i+1;j<layout.buttons.length;j++)assert.ok(!overlaps(layout.buttons[i],layout.buttons[j]),`${width}: actions cannot overlap each other`);
 // 오른쪽 아래 줄: 순위전·학습 기록·이번 학습 마치기가 한 줄로 서고 겹치지 않으며 화면 안에 있다.
 const dock=await page.locator('learning-records').evaluate(host=>[...host.shadowRoot.querySelectorAll('.strip > a, .strip > button')].filter(node=>node.getClientRects().length).map(node=>{
 const rect=node.getBoundingClientRect(),range=document.createRange();range.selectNodeContents(node);
 return {text:node.textContent,lines:range.getClientRects().length,left:rect.left,right:rect.right,top:rect.top,bottom:rect.bottom};
 }));
 assert.deepEqual(dock.map(item=>item.text).filter(text=>/순위전|학습 기록|이번 학습 마치기/.test(text)),['🏁 순위전','학습 기록','이번 학습 마치기']);
 for(const item of dock){
 assert.equal(item.lines,1,`${width}: ${item.text} stays on one line`);
 assert.ok(item.left>=0&&item.right<=width&&item.bottom<=900,`${width}: ${item.text} stays on screen`);
 }
 for(let i=0;i<dock.length;i++)for(let j=i+1;j<dock.length;j++)assert.ok(!overlaps(dock[i],dock[j]),`${width}: ${dock[i].text} and ${dock[j].text} overlap`);
 if(route==='clock-1'){
 const labels=await page.locator('.clock-write-row > strong, .clock-read-row > strong').evaluateAll(nodes=>nodes.filter(node=>node.getClientRects().length).map(node=>{const range=document.createRange();range.selectNodeContents(node);return {text:node.textContent,lines:range.getClientRects().length};}));
 assert.ok(labels.length>=12);
 for(const label of labels)assert.equal(label.lines,1,`${width}: ${label.text} label stays on one line`);
 }
 fs.mkdirSync(output,{recursive:true});
 const png=await page.screenshot();
 execFileSync('python',['-c','import io,sys\nfrom PIL import Image,ImageChops\na=Image.open(io.BytesIO(sys.stdin.buffer.read())).convert("RGBA")\na.save(sys.argv[1],"WEBP",lossless=True,exact=True)\nb=Image.open(sys.argv[1]).convert("RGBA")\nassert a.size==b.size and ImageChops.difference(a,b).getbbox() is None',path.join(output,`${route}-${width}.webp`)],{input:png});
 await race.click();
 await page.waitForURL(/\/arithmetic\/race\?room=123456&participant=p1&participantToken=token1&hostToken=host1$/);
 assert.equal(await page.getByRole('dialog').count(),0,'no extra screen before the lobby');
 assert.equal(submitted.action,'create');assert.equal(submitted.worksheetRoute,'/arithmetic/'+route);assert.equal(submitted.durationSeconds,undefined);assert.equal(submitted.name,'학생');
 assert.deepEqual(errors,[]);
 console.log('PASS',route,width,'race shortcut in the record dock, toolbar labels and bounds, one-line labels, direct create, roster identity, waiting room');
 await page.goto(base+'/arithmetic/race');
 await page.waitForURL(/\/arithmetic$/);
 assert.equal(await page.locator('.race-create-card').count(),0);
 await page.close();
 }
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
