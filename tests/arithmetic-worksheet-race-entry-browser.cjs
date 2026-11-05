const {chromium}=require('../game-hub-server/node_modules/playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const output=path.join(root,'outputs/arithmetic-toolbar');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 for(const [route,width] of [['multiplication-2',1295],['add-subtract-1',1366],['multiplication-2',1024],['multiplication-2',768],['grade-3-division-1',390]]){
 const page=await browser.newPage({viewport:{width,height:900}});let submitted=null;
 await page.route('**/assets/**',async r=>{
 const target=path.resolve(root,'.'+decodeURIComponent(new URL(r.request().url()).pathname));
 if(target.startsWith(root+path.sep)&&fs.existsSync(target)&&fs.statSync(target).isFile())await r.fulfill({path:target});
 else await r.fulfill({status:404,body:''});
 });
 await page.addInitScript(()=>{window.LearningRecords={create:()=>({start:async args=>({checkpoint:args.checkpoint}),addAction:()=>document.createElement('button'),save:async()=>{},showResult:async()=>{}})}});
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
 await page.goto((process.env.ARITHMETIC_TEST_URL || 'http://127.0.0.1:8788')+'/arithmetic/'+route);
 await page.getByRole('button',{name:'설정 열기',exact:true}).waitFor();
 await page.waitForFunction(()=>document.querySelector('.counting-back')?.getAttribute('data-site-back-legacy')==='true');
 const layout=await page.locator('.counting-toolbar').evaluate(toolbar=>{
 const area=toolbar.getBoundingClientRect();
 const buttons=[...toolbar.querySelectorAll('button')].filter(button=>button.getClientRects().length>0).map(button=>{
 const rect=button.getBoundingClientRect(),range=document.createRange();range.selectNodeContents(button);
 return {text:button.textContent,lines:range.getClientRects().length,left:rect.left,right:rect.right,top:rect.top,bottom:rect.bottom};
 });
 return {left:area.left,right:area.right,bottom:area.bottom,buttons,parent:toolbar.querySelector('.worksheet-race-trigger')?.parentElement?.className};
 });
 assert.equal(layout.parent,'toolbar','race action belongs inside the existing action group');
 const counter=await page.locator('.counting-progress').boundingBox();
 const settings=await page.getByRole('button',{name:'설정 열기',exact:true}).boundingBox();
 assert.ok(counter.x+counter.width<=settings.x||settings.x+settings.width<=counter.x||counter.y+counter.height<=settings.y||settings.y+settings.height<=counter.y,`${width}: settings cannot cover the correct-answer count`);
 for(const button of layout.buttons){
 assert.equal(button.lines,1,`${width}: ${button.text} must stay on one line`);
 assert.ok(button.left>=layout.left-1&&button.right<=layout.right+1,`${width}: action stays inside toolbar`);
 assert.ok(button.bottom<=layout.bottom+1,`${width}: actions cannot overlap the worksheet`);
 }
 for(let i=0;i<layout.buttons.length;i++)for(let j=i+1;j<layout.buttons.length;j++){
 const a=layout.buttons[i],b=layout.buttons[j];
 assert.ok(a.right<=b.left+1||b.right<=a.left+1||a.bottom<=b.top+1||b.bottom<=a.top+1,`${width}: actions cannot overlap each other`);
 }
 fs.mkdirSync(output,{recursive:true});
 const png=await page.screenshot({clip:{x:0,y:0,width,height:Math.min(900,Math.ceil(layout.bottom+220))}});
 execFileSync('python',['-c','import io,sys\nfrom PIL import Image,ImageChops\na=Image.open(io.BytesIO(sys.stdin.buffer.read())).convert("RGBA")\na.save(sys.argv[1],"WEBP",lossless=True,exact=True)\nb=Image.open(sys.argv[1]).convert("RGBA")\nassert a.size==b.size and ImageChops.difference(a,b).getbbox() is None',path.join(output,`${route}-${width}.webp`)],{input:png});
 await page.getByRole('button',{name:'순위전 만들기',exact:true}).click();
 const dialog=page.getByRole('dialog');await dialog.waitFor();
 assert.equal(await dialog.locator('select').count(),0,'no dropdown');
 assert.equal(await dialog.getByRole('button',{name:'3분',exact:true}).getAttribute('aria-pressed'),'true');
 await dialog.getByRole('button',{name:'2분',exact:true}).click();
 await dialog.getByRole('button',{name:'취소',exact:true}).click();
 assert.equal(await dialog.isVisible(),false);
 await page.getByRole('button',{name:'순위전 만들기',exact:true}).click();
 await dialog.getByRole('button',{name:'방 만들고 입장',exact:true}).click();
 await page.waitForURL(/\/arithmetic\/race\?room=123456/);
 assert.equal(submitted.worksheetRoute,'/arithmetic/'+route);assert.equal(submitted.durationSeconds,120);assert.equal(submitted.name,'학생');
 console.log('PASS',route,width,'toolbar labels and bounds, shared controls, direct create, duration, cancel, roster identity, waiting room redirect');
 await page.goto((process.env.ARITHMETIC_TEST_URL || 'http://127.0.0.1:8788')+'/arithmetic/race');
 await page.waitForURL(/\/arithmetic$/);
 assert.equal(await page.locator('.race-create-card').count(),0);
 await page.close();
 }
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});

