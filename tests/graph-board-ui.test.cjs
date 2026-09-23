const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const root = path.resolve(__dirname,'..'), output = path.join(root,'outputs','graph-board');
let browser, server, url, context, page, errors;
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.woff2':'font/woff2'};
const saved = () => page.evaluate(()=>JSON.parse(localStorage.getItem('graph-board:current:v1')));
async function menuAction(id) { await page.locator('#menuButton').click(); await page.locator('#'+id).click(); }
async function settled() { await page.waitForFunction(()=>document.getElementById('saveStatus').textContent.includes('자동 저장됨')); }
async function parameter(name,value) { await page.getByRole('spinbutton',{name:`${name} 값`,exact:true}).fill(String(value)); await page.keyboard.press('Tab'); await settled(); }
async function openPreset(name) { await page.locator('#presetDrawer').evaluate(el=>el.open=true); await page.getByRole('button',{name,exact:true}).click(); }
async function drag(from,to) { await page.mouse.move(from.x,from.y);await page.mouse.down();await page.mouse.move(to.x,to.y,{steps:12});await page.mouse.up();await settled(); }
async function graphPoint(x,y) { const box=await page.locator('#graphCanvas').boundingBox();const state=await saved()||{view:{x:0,y:0,range:6}}; const scale=Math.min(box.width,box.height)/(2*state.view.range);return {x:box.x+box.width/2+(x-state.view.x)*scale,y:box.y+box.height/2-(y-state.view.y)*scale}; }
test.before(async()=>{
  await fs.mkdir(output,{recursive:true});
  server=http.createServer(async(req,res)=>{try{let p=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://local').pathname));if(p!==root&&!p.startsWith(root+path.sep)){res.writeHead(403).end();return;}if((await fs.stat(p)).isDirectory())p=path.join(p,'index.html');res.setHeader('Content-Type',types[path.extname(p)]||'application/octet-stream');res.end(await fs.readFile(p));}catch{res.writeHead(404).end();}});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));url=`http://127.0.0.1:${server.address().port}/learning/literacy-numeracy/graph-studio/`;
  browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHANNEL?{channel:process.env.PLAYWRIGHT_CHANNEL}:process.platform==='win32'?{channel:'msedge'}:{})});
});
test.beforeEach(async()=>{context=await browser.newContext({viewport:{width:1440,height:900},acceptDownloads:true});page=await context.newPage();errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(url);await page.waitForFunction(()=>document.getElementById('graphCanvas').width>100);await page.evaluate(()=>document.fonts.ready);});
test.afterEach(async()=>{try{assert.deepEqual(errors,[]);}finally{await context.close();}});
test.after(async()=>{await browser?.close();if(server)await new Promise(resolve=>server.close(resolve));});

test('desktop layout, vertex drag, immutable comparison, undo and redo',async()=>{
  assert.equal(await page.title(),'그래프 칠판');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await page.screenshot({path:path.join(output,'desktop-initial.png')});
  await page.locator('#snapshotButton').click();await settled();
  await drag(await graphPoint(0,0),await graphPoint(2,1));
  let state=await saved();assert.equal(state.functions[0].params.h,2);assert.equal(state.functions[0].params.k,1);assert.equal(state.ghosts[0].params.h,0);
  assert.equal(await page.locator('.katex-error').count(),0);assert.equal(await page.locator('#formulaDisplay annotation').textContent(),'y=\\left(x-2\\right)^{2}+1');
  await page.locator('#undoButton').click();await settled();assert.equal((await saved()).functions[0].params.h,0);
  await page.locator('#redoButton').click();await settled();assert.equal((await saved()).functions[0].params.h,2);
  await page.locator('#sidebar').evaluate(el=>el.scrollTop=0);await page.screenshot({path:path.join(output,'desktop-comparison.png')});
  const box=await page.locator('#graphCanvas').boundingBox(),distance=80/(Math.min(box.width,box.height)/12),offset=Math.sqrt(2*distance**2/(1+Math.sqrt(1+4*distance**2)));
  await drag(await graphPoint(2+offset,1+offset**2),await graphPoint(4,-7));assert.equal((await saved()).functions[0].params.a,-2);
});
test('linear intercept and slope handles, independent curve coefficients',async()=>{
  await openPreset('일차함수');await settled();await drag(await graphPoint(0,1),await graphPoint(0,2));assert.equal((await saved()).functions[0].params.b,2);
  const box=await page.locator('#graphCanvas').boundingBox(),scale=Math.min(box.width,box.height)/12,offset=80/scale/Math.sqrt(2);
  await drag(await graphPoint(offset,offset+2),await graphPoint(2,-2));assert.equal((await saved()).functions[0].params.a,-2);
  await page.locator('#addFunctionButton').click();await openPreset('이차함수');await parameter('a',3);
  const state=await saved();assert.equal(state.functions[0].params.a,-2);assert.equal(state.functions[1].params.a,3);
  await page.getByRole('button',{name:'1번 함수 선택',exact:true}).click();assert.equal(await page.getByRole('spinbutton',{name:'a 값',exact:true}).inputValue(),'-2');
});
test('bad expressions stay isolated and natural input recovers',async()=>{
  await page.locator('#addFunctionButton').click();await page.getByRole('textbox',{name:'2번 함수 수식',exact:true}).fill('foo(x)');await settled();
  assert.match(await page.locator('.function-error').nth(1).textContent(),/사용할 수 없/);assert.match(await page.locator('#graphCount').textContent(),/^1개/);
  await page.getByRole('textbox',{name:'2번 함수 수식',exact:true}).fill('-x^2');await settled();assert.equal(await page.locator('.function-error').nth(1).textContent(),'');assert.match(await page.locator('#graphCount').textContent(),/^2개/);
  await page.getByRole('textbox',{name:'2번 함수 수식',exact:true}).fill('y=2(x+1)');await settled();assert.equal(await page.locator('.function-error').nth(1).textContent(),'');
  await page.locator('#keyboardDrawer').evaluate(el=>el.open=true);const input=page.getByRole('textbox',{name:'2번 함수 수식',exact:true});await input.fill('x');await input.selectText();await page.locator('[data-wrap="sqrt"]').click();assert.equal(await input.inputValue(),'sqrt(x)');
});
test('pan, zoom, coordinate exploration and reload preserve state',async()=>{
  await page.locator('#homeButton').click();await settled();await drag(await graphPoint(-4,-3),await graphPoint(-3,-2));
  let state=await saved();assert.ok(Math.abs(state.view.x+1)<.01);assert.ok(Math.abs(state.view.y+1)<.01);
  const box=await page.locator('#graphCanvas').boundingBox();await page.mouse.move(box.x+box.width*.6,box.y+box.height*.6);await page.mouse.wheel(0,-150);await settled();assert.ok((await saved()).view.range<6);
  await page.locator('#traceButton').click();await page.mouse.click(box.x+box.width*.55,box.y+box.height*.55);await settled();await page.locator('#traceReadout').waitFor({state:'visible'});
  const before=await saved();await page.reload();await page.waitForFunction(()=>document.getElementById('graphCanvas').width>100);assert.deepEqual(await saved(),before);
  await menuAction('teachingButton');assert.equal(await page.locator('.function-source').first().isVisible(),false);assert.equal(await page.locator('#sliders').isVisible(),true);await page.screenshot({path:path.join(output,'teaching.png')});
});
test('named scene save/open and file export/import round trip',async()=>{
  await parameter('h',3);await page.locator('#snapshotButton').click();await settled();await menuAction('scenesButton');await page.locator('#sceneName').fill('평행이동 수업');await page.getByRole('button',{name:'현재 수업 보관',exact:true}).click();await settled();
  const downloadPromise=page.waitForEvent('download');await page.locator('#jsonButton').click();const download=await downloadPromise;const file=path.join(output,'lesson.graph.json');await download.saveAs(file);const exported=JSON.parse(await fs.readFile(file,'utf8'));
  assert.equal(exported.state.functions[0].params.h,3);assert.equal(exported.state.ghosts.length,1);
  await page.locator('#scenesDialog [data-close]').click();await parameter('h',-2);await menuAction('scenesButton');await page.getByRole('button',{name:'평행이동 수업 열기',exact:true}).click();await settled();assert.equal((await saved()).functions[0].params.h,3);
  await parameter('h',-4);await menuAction('scenesButton');await page.locator('#importFile').setInputFiles(file);await page.locator('#scenesDialog').waitFor({state:'hidden'});await settled();assert.deepEqual(await saved(),exported.state);
  await menuAction('scenesButton');await page.locator('#importFile').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{"app":"class-graph-board","state":{"version":9}}')});await page.waitForFunction(()=>document.getElementById('toast').textContent.includes('올바른'));assert.deepEqual(await saved(),exported.state);
});
test('PNG download includes graph and lesson; full and blank printing work',async()=>{
  await parameter('h',2);await page.locator('#snapshotButton').click();await settled();await menuAction('exportButton');const downloadPromise=page.waitForEvent('download');await page.locator('#pngButton').click();const download=await downloadPromise;const file=path.join(output,'export.png');await download.saveAs(file);const png=await fs.readFile(file);assert.equal(png.toString('ascii',1,4),'PNG');assert.ok(png.readUInt32BE(16)>800);assert.ok(png.readUInt32BE(20)>600);
  await page.evaluate(()=>{window.printCount=0;window.print=()=>{window.printCount++;window.dispatchEvent(new Event('beforeprint'));};});
  await menuAction('exportButton');await page.locator('#printButton').click();await page.waitForFunction(()=>window.printCount===1);assert.equal(await page.locator('#printSheet .print-formulas>div').count(),2);
  await page.emulateMedia({media:'print'});await page.screenshot({path:path.join(output,'print-full.png'),fullPage:true});await page.pdf({path:path.join(output,'lesson.pdf'),preferCSSPageSize:true,printBackground:true});
  await page.emulateMedia({media:'screen'});await menuAction('exportButton');await page.locator('#blankPrintButton').click();await page.waitForFunction(()=>window.printCount===2);assert.equal(await page.locator('#printSheet .print-formulas').count(),0);assert.match(await page.locator('#printSheet').textContent(),/이름/);
  await page.emulateMedia({media:'print'});await page.screenshot({path:path.join(output,'print-blank.png'),fullPage:true});
});
test('phone layout, panel control and touch pinch',async()=>{
  await context.close();context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1});page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await page.goto(url);await page.waitForFunction(()=>document.getElementById('graphCanvas').width>100);
  assert.equal(await page.locator('#sidebar').isVisible(),false);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);await page.screenshot({path:path.join(output,'mobile.png')});
  await page.locator('#sidebarButton').tap();assert.equal(await page.locator('#sidebar').isVisible(),true);await parameter('h',1);await page.locator('#sidebarButton').tap();
  const box=await page.locator('#graphCanvas').boundingBox(),client=await context.newCDPSession(page),x=box.x+box.width/2,y=box.y+box.height/2;
  await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:x-30,y,id:0},{x:x+30,y,id:1}]});
  await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-70,y,id:0},{x:x+70,y,id:1}]});
  await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await settled();assert.ok((await saved()).view.range<6);await client.detach();
});
test('storage failure is visible and drawing remains usable',async()=>{
  await page.addInitScript(()=>{Storage.prototype.setItem=function(){throw new DOMException('Full','QuotaExceededError');};});await page.reload();await page.locator('#homeButton').click();await page.waitForFunction(()=>document.getElementById('saveStatus').textContent.includes('자동 저장 불가'));
  await page.getByRole('textbox',{name:'1번 함수 수식',exact:true}).fill('-x^2');await page.waitForFunction(()=>document.getElementById('graphCount').textContent.includes('1개의 그래프'));assert.equal(await page.locator('.function-error').textContent(),'');
});
test('analysis finds crossing and tangent intersections and never labels poles as roots',async()=>{
  await page.locator('#addFunctionButton').click();await page.locator('#analysisButton').click();await settled();await page.locator('#analysisPanel').waitFor({state:'visible'});
  await page.waitForFunction(()=>document.querySelectorAll('.intersection-point').length===2);assert.match(await page.locator('#analysisResult').textContent(),/찾은 교점 2개/);
  await page.getByRole('textbox',{name:'1번 함수 수식',exact:true}).fill('(x-.137)^2');await page.getByRole('textbox',{name:'2번 함수 수식',exact:true}).fill('0');await settled();await page.waitForFunction(()=>document.querySelectorAll('.intersection-point').length===1);assert.match(await page.locator('#analysisResult').textContent(),/0.137/);
  await page.getByRole('textbox',{name:'1번 함수 수식',exact:true}).fill('1/(x-.13)');await settled();await page.waitForFunction(()=>document.querySelectorAll('.intersection-point').length===0);assert.match(await page.locator('#analysisResult').textContent(),/찾은 교점이 없/);
});
test('moving tangent tracks the point, rejects a corner and restores after reload',async()=>{
  await page.locator('#analysisButton').click();await page.locator('[data-analysis="tangent"]').click();await settled();assert.match(await page.locator('#analysisResult').textContent(),/기울기 ≈ 2/);
  await drag(await graphPoint(1,1),await graphPoint(2,4));await page.waitForFunction(()=>document.getElementById('analysisResult').textContent.includes('기울기 ≈ 4'));assert.equal((await saved()).analysis.tangentX,2);
  await page.locator('#sidebar').evaluate(el=>el.scrollTop=0);await page.screenshot({path:path.join(output,'tangent.png')});
  await page.reload();await page.locator('#analysisPanel').waitFor({state:'visible'});assert.equal(await page.locator('#tangentX').inputValue(),'2');
  await page.getByRole('textbox',{name:'1번 함수 수식',exact:true}).fill('abs(x)');await page.locator('#tangentX').fill('0');await page.keyboard.press('Tab');await settled();await page.waitForFunction(()=>document.querySelector('#analysisResult .analysis-error'));assert.match(await page.locator('#analysisResult').textContent(),/미분계수/);
});
test('integral endpoints drag, signed values differ from area, exports include analysis',async()=>{
  await page.getByRole('textbox',{name:'1번 함수 수식',exact:true}).fill('x');await page.locator('#analysisButton').click();await page.locator('[data-analysis="integral"]').click();await settled();
  await page.waitForFunction(()=>document.getElementById('analysisResult').textContent.includes('넓이 ≈ 4'));assert.match(await page.locator('#analysisResult').textContent(),/정적분 ≈ 0/);
  await drag(await graphPoint(-2,0),await graphPoint(-1,0));await settled();assert.equal((await saved()).analysis.from,-1);await page.waitForFunction(()=>document.getElementById('analysisResult').textContent.includes('정적분 ≈ 1.5'));assert.match(await page.locator('#analysisResult').textContent(),/넓이 ≈ 2.5/);
  await page.locator('#sidebar').evaluate(el=>el.scrollTop=0);await page.screenshot({path:path.join(output,'integral.png')});
  await page.evaluate(()=>{window.printCount=0;window.print=()=>window.printCount++;});await menuAction('exportButton');await page.locator('#printButton').click();await page.waitForFunction(()=>window.printCount===1);assert.match(await page.locator('#printSheet .print-analysis').textContent(),/정적분 ≈ 1.5/);
  await page.getByRole('textbox',{name:'1번 함수 수식',exact:true}).fill('1/x');await settled();await page.waitForFunction(()=>document.querySelector('#analysisResult .analysis-error'));assert.match(await page.locator('#analysisResult').textContent(),/수렴/);
});
test('mobile analysis stays within screen and accepts exact bounds',async()=>{
  await page.setViewportSize({width:390,height:844});await page.locator('#sidebarButton').click();await page.locator('#analysisButton').click();await page.locator('[data-analysis="integral"]').click();await page.locator('#integralFrom').fill('0');await page.locator('#integralTo').fill('1');await page.keyboard.press('Tab');await settled();
  await page.waitForFunction(()=>document.getElementById('analysisResult').textContent.includes('0.333333'));assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);const box=await page.locator('#analysisPanel').boundingBox();assert.ok(box.x>=0&&box.x+box.width<=390);await page.screenshot({path:path.join(output,'mobile-analysis.png')});
});
