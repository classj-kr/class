const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const { startHarness } = require('./site-storage-harness.cjs');
const url = '/learning/literacy-numeracy/math-tools/geoboard/';
let h, browser, context, page, errors;
const output = path.resolve(__dirname, '../outputs/geoboard');
const ready = p => p.waitForFunction(() => /계정에 자동 저장|이 탭에서 사용 중/.test(document.getElementById('save-status').textContent));
const settled = () => page.waitForFunction(() => document.getElementById('save-status').textContent === '계정에 자동 저장됨');
const count = () => page.locator('#bands .band').count();
const coords = (p, x, y) => p.evaluate(([x, y]) => { const b = document.getElementById('board'), size = Number(document.getElementById('size').value), step = 480 / (size - 1); const v = new DOMPoint(60 + x * step, 60 + y * step).matrixTransform(b.getScreenCTM()); return {x:v.x,y:v.y}; }, [x,y]);
const clickPin = async (x,y,p=page,touch=false) => { const v = await coords(p,x,y); if(touch) await p.touchscreen.tap(v.x,v.y); else await p.mouse.click(v.x,v.y); };
const dragPin = async (x,y,toX,toY) => { const a=await coords(page,x,y),b=await coords(page,toX,toY); await page.mouse.move(a.x,a.y); await page.mouse.down(); await page.mouse.move(b.x,b.y,{steps:12}); await page.mouse.up(); };
const shot = async name => {
  const code = "import io,sys;from PIL import Image;im=Image.open(io.BytesIO(sys.stdin.buffer.read())).convert('RGBA');im.save(sys.argv[1],format='WEBP',lossless=True,exact=True);out=Image.open(sys.argv[1]).convert('RGBA');assert im.size==out.size and im.tobytes()==out.tobytes()";
  const r = spawnSync('python',['-c',code,path.join(output,name+'.webp')],{input:await page.screenshot({fullPage:true})}); assert.equal(r.status,0,String(r.stderr));
};
test.before(async () => {
  fs.mkdirSync(output,{recursive:true});
  h=await startHarness({me:user=>({signedIn:true,user:{id:user.id,name:'검수교사',role:'teacher'}}),extraRoutes(app){
    app.get('/api/site/access',(_,res)=>res.json({mode:'open'}));
    app.get('/api/teacher/profile',(_,res)=>res.json({profiles:[{name:'검수교사',schoolName:'검수학교',teacherType:'담임',grade:3,classNumber:1}]}));
    app.get('/api/home-content-access',(_,res)=>res.json({mode:'open',enabledPaths:[],globallyDisabledPaths:[],hasClassAccess:false,canManage:false,canManageGlobally:false}));
  }});
  browser=await chromium.launch({headless:true,...(process.platform==='win32'?{channel:'msedge'}:{})});
});
test.beforeEach(async()=>{
  await h.db.query('DELETE FROM user_storage');
  context=await browser.newContext({viewport:{width:1366,height:900}});
  await context.addCookies([{name:'test_user',value:'1',url:h.base}]);
  page=await context.newPage();errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(h.base+url);await ready(page);
});
test.afterEach(async()=>{try{assert.deepEqual(errors,[]);}finally{await context?.close();}});
test.after(async()=>{await browser?.close();await h?.close();});
test('main menu reaches geoboard and shared settings expose only the effects channel',async()=>{
  await page.goto(h.base+'/');
  await page.locator('#category-literacy-toggle').click();
  await page.locator('[data-access-group="numeracy"] > summary').click();
  await page.locator('a[href="learning/literacy-numeracy/math-tools/"]').click();
  await page.locator(`a[href="${url}"]`).click();await ready(page);
  assert.equal(await page.title(),'지오보드 · 수학 교구');
  assert.equal(await count(),0);
  assert.equal(await page.locator('#measurement').isVisible(),false);
  assert.equal(await page.locator('site-back-navigation').count(),1);
  await page.locator('[aria-controls="unifiedSettingsPanel"]').click();
  assert.equal(await page.locator('#sfxVolumeSlider').isVisible(),true);
  assert.equal(await page.locator('#musicVolumeSlider').isVisible(),false);
  await page.locator('#sfxMuteBtn').click();
  assert.equal(await page.evaluate(()=>ClassGameSfx.isMuted()),true);
  await page.locator('[aria-controls="unifiedSettingsPanel"]').click();
  await shot('empty');
});
test('pulling a vertex and an edge updates shape, measurements and undo without losing geometry',async()=>{
  await page.locator('#add').click();
  await page.locator('#show-area').click();await page.locator('#show-length').click();
  assert.equal(await page.locator('#values').textContent(),'넓이 4둘레 8');
  await dragPin(3,1,4,0);
  assert.equal(await page.locator('#values').textContent(),'넓이 6둘레 ≈ 10.32');
  await page.locator('#undo').click();assert.equal(await page.locator('#values').textContent(),'넓이 4둘레 8');
  await dragPin(2,1,2,0);
  assert.equal(await page.locator('.handle.vertex').count(),5);
  assert.equal(await page.locator('#values').textContent(),'넓이 5둘레 ≈ 8.83');
  await page.locator('[aria-label="주황"]').click();await page.locator('#fill').click();
  assert.equal(await page.locator('.band-fill').getAttribute('fill-opacity'),'0');
  await page.locator('#show-grid').click();await shot('pentagon');
  await settled();
  const saved=(await h.items('geoboard')).board;
  assert.equal(saved.scenes[5][0].points.length,5);assert.equal(saved.scenes[5][0].fill,false);
});
test('pin clicks close a triangle, drag creates a line, and whole shapes translate within boundaries',async()=>{
  for(const p of [[0,0],[2,0],[0,2],[0,0]])await clickPin(...p);
  assert.equal(await count(),1);
  await page.locator('#show-area').click();assert.equal(await page.locator('#values').textContent(),'넓이 2');
  await dragPin(.5,.5,3.5,3.5);
  await settled();
  assert.deepEqual((await h.items('geoboard')).board.scenes[5][0].points,[{x:2,y:2},{x:4,y:2},{x:2,y:4}]);
  await dragPin(0,0,1,0);assert.equal(await count(),2);
  await page.locator('#show-length').click();assert.equal(await page.locator('#values').textContent(),'길이 1');
  await dragPin(.5,0,0,1);assert.equal(await page.locator('.handle.vertex').count(),3);
  assert.equal(await page.locator('#values').textContent(),'넓이 0.5둘레 ≈ 3.41');
  await page.keyboard.press('Control+z');assert.equal(await page.locator('.handle.vertex').count(),2);
  await page.keyboard.press('Control+Shift+z');assert.equal(await page.locator('.handle.vertex').count(),3);
});
test('invalid crossings roll back, canceled pointer gestures preserve shape and clear is reversible',async()=>{
  await page.locator('#add').click();await settled();
  const before=(await h.items('geoboard')).board.scenes[5][0].points;
  await dragPin(1,1,4,2);
  assert.match(await page.locator('#message').textContent(),/교차/);
  const a=await coords(page,1,1),b=await coords(page,0,0);
  await page.mouse.move(a.x,a.y);await page.mouse.down();await page.mouse.move(b.x,b.y,{steps:5});
  await page.locator('#board').dispatchEvent('pointercancel',{pointerId:1});await page.mouse.up();
  assert.deepEqual((await h.items('geoboard')).board.scenes[5][0].points,before);
  await page.locator('#clear').click();assert.equal(await count(),0);
  await page.locator('#undo').click();assert.equal(await count(),1);
  await page.locator('#remove').click();assert.equal(await count(),0);
});
test('both board sizes restore across accounts and guests do not retain drawings',async()=>{
  await page.locator('#add').click();await page.locator('#size').selectOption('9');assert.equal(await count(),0);
  await page.locator('#add').click();await page.locator('#add').click();await settled();
  await page.locator('#size').selectOption('5');assert.equal(await count(),1);await settled();
  const other=await browser.newContext();await other.addCookies([{name:'test_user',value:'1',url:h.base}]);
  const restored=await other.newPage();await restored.goto(h.base+url);await ready(restored);
  assert.equal(await restored.locator('#bands .band').count(),1);
  await restored.locator('#size').selectOption('9');assert.equal(await restored.locator('#bands .band').count(),2);
  await other.close();
  const guest=await browser.newContext();const gp=await guest.newPage();await gp.goto(h.base+url);await ready(gp);
  await gp.locator('#add').click();assert.equal(await gp.locator('#bands .band').count(),1);
  await gp.reload();await ready(gp);assert.equal(await gp.locator('#bands .band').count(),0);await guest.close();
  const second=await browser.newContext();await second.addCookies([{name:'test_user',value:'2',url:h.base}]);
  const sp=await second.newPage();await sp.goto(h.base+url);await ready(sp);assert.equal(await sp.locator('#bands .band').count(),0);await second.close();
});
test('keyboard drawing, handle edits and recovery after save failure remain usable',async()=>{
  await page.locator('#board').focus();await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowRight');await page.keyboard.press('ArrowRight');await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowDown');await page.keyboard.press('ArrowDown');await page.keyboard.press('Enter');
  await page.locator('#finish').click();assert.equal(await count(),1);
  await page.locator('.handle.vertex').first().focus();await page.keyboard.press('ArrowRight');
  assert.equal(await page.evaluate(()=>document.activeElement.dataset.kind),'vertex');
  await page.locator('#show-area').click();assert.equal(await page.locator('#values').textContent(),'넓이 1');
  await settled();
  await page.route('**/api/me/storage/geoboard/board',route=>route.fulfill({status:503,contentType:'application/json',body:'{"error":"OFFLINE"}'}));
  await page.locator('#add').click();await page.waitForFunction(()=>document.getElementById('save-status').textContent==='저장 실패');
  assert.equal(await count(),2);
  await page.unroute('**/api/me/storage/geoboard/board');await page.locator('#show-grid').click();await settled();
  await page.reload();await ready(page);assert.equal(await count(),2);
});
test('slow earlier saves cannot overwrite later edits',async()=>{
  let requests=0;
  await page.route('**/api/me/storage/geoboard/board',async route=>{
    if(++requests===1) await new Promise(resolve=>setTimeout(resolve,350));
    await route.continue();
  });
  await page.locator('#add').click();await page.locator('#add').click();await page.locator('[aria-label="파랑"]').click();
  await settled();
  const saved=(await h.items('geoboard')).board;
  assert.equal(saved.scenes[5].length,2);assert.equal(saved.scenes[5][1].color,'#427bb5');
  await page.reload();await ready(page);assert.equal(await count(),2);
});
test('small phones support touch construction, touch dragging and an unclipped board',async()=>{
  const phone=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
  const p=await phone.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto(h.base+url);await ready(p);
  await p.locator('[aria-controls="unifiedSettingsPanel"]').tap();await p.locator('#unifiedSettingsPanel').waitFor({state:'visible',timeout:2000});
  await p.locator('[aria-controls="unifiedSettingsPanel"]').tap();
  for(const point of [[0,0],[3,0],[0,3],[0,0]])await clickPin(...point,p,true);
  assert.equal(await p.locator('#bands .band').count(),1);
  await p.locator('#show-area').tap();assert.equal(await p.locator('#values').textContent(),'넓이 4.5');
  const cdp=await phone.newCDPSession(p),a=await coords(p,3,0),b=await coords(p,4,0);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:a.x,y:a.y}]});
  for(let i=1;i<=8;i++) {
    await p.evaluate(()=>new Promise(resolve=>requestAnimationFrame(resolve)));
    await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:a.x+(b.x-a.x)*i/8,y:a.y+(b.y-a.y)*i/8}]});
  }
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await cdp.detach();
  assert.equal(await p.locator('#values').textContent(),'넓이 6');
  await p.locator('[aria-controls="unifiedSettingsPanel"]').tap();
  await p.locator('#unifiedSettingsPanel').waitFor({state:'visible'});
  await p.locator('[aria-controls="unifiedSettingsPanel"]').tap();await p.locator('#unifiedSettingsPanel').waitFor({state:'hidden'});
  for(const width of [390,320]){
    await p.setViewportSize({width,height:844});
    assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    const boardBox=await p.locator('#board').boundingBox(),dockBox=await p.locator('.dock').boundingBox();
    assert.ok(boardBox.width>=280&&boardBox.y+boardBox.height<=dockBox.y);
    const old=page;page=p;await shot(`phone-${width}`);page=old;
  }
  await p.locator('[aria-controls="unifiedSettingsPanel"]').tap();
  await p.locator('#unifiedSettingsPanel').waitFor({state:'visible'});
  await p.locator('.unified-settings-help > summary').tap();await p.locator('.unified-settings-help ul').waitFor({state:'visible'});
  await phone.close();
});
