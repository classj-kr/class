"use strict";
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('../game-hub-server/node_modules/playwright');
const R=require('../learning/games/board-coach/janggi-rules.js');
const root=path.resolve(__dirname,'..'),output=path.join(root,'outputs/qa/janggi-commentary');
const board=Array(90).fill(null);
for(const[p,x,y]of [
  ['hR',0,0],['hE',2,0],['hA',3,0],['hA',5,0],['hE',6,0],['hR',8,0],
  ['hC',0,1],['hK',4,1],['hC',4,2],['cR',6,2],
  ['hP',0,3],['hP',3,3],['hP',4,3],['hP',5,3],['hP',8,4],['hH',3,4],['hH',5,4],
  ['cP',1,6],['cP',2,6],['cP',4,6],['cP',6,6],['cP',7,6],
  ['cH',2,7],['cC',3,7],['cC',4,7],['cH',6,7],['cK',4,8],
  ['cR',1,9],['cE',2,9],['cA',3,9],['cA',5,9],['cE',6,9]
])board[y*9+x]=p;
const state={...R.position(board,'h'),ply:23};
const ready=page=>page.waitForFunction(()=>document.getElementById('turn').textContent.startsWith('내 차례'),null,{timeout:25000});
async function main(){
  const server=http.createServer((req,res)=>{
    let file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
    if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
    if(!path.extname(file))file+='.html';
    fs.readFile(file,(error,data)=>{
      if(error){res.writeHead(404);res.end();return;}
      res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.webp':'image/webp','.png':'image/png'})[path.extname(file)]||'application/octet-stream');res.end(data);
    });
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const url=`http://127.0.0.1:${server.address().port}`;
  let browser;
  try{
    browser=await chromium.launch({headless:true,channel:'msedge'});
    const page=await browser.newPage({viewport:{width:1366,height:900}}),errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.route('**/janggi-coach.js?*',async route=>{
      const response=await route.fetch();
      await route.fulfill({response,body:`window.JanggiCoachRules={...window.JanggiCoachRules,initial:()=>(${JSON.stringify(state)})};\n`+await response.text()});
    });
    // Reproduce the user's last AI move through the real worker message path;
    // its analysis and all subsequent searches use the production code.
    await page.route('**/janggi-worker.js?*',async route=>{
      const response=await route.fetch();
      const fixture=`\nconst originalChoose=JanggiCoachAI.choose;JanggiCoachAI.choose=(state,level)=>{
        if(state.ply!==23)return originalChoose(state,level);
        const requests=[{from:32,to:33},{from:24,to:25},{from:8,to:17}],line=[];let next=state;
        for(const request of requests){const result=JanggiCoachRules.play(next,request);if(!result.ok)throw new Error(result.error);line.push(result.move);next=result.state;}
        return {move:line[0],line,reason:JanggiCoachAI.explain(state,line[0])};
      };`;
      await route.fulfill({response,body:await response.text()+fixture});
    });
    await page.goto(url+'/learning/games/board-coach/coach?game=janggi');
    await page.locator('#setup[open]').waitFor();await page.locator("input[name=level][value=advanced]").check();
    await page.locator('#startLearning').click();await ready(page);
    assert.equal(await page.locator('#opponentPanel').isVisible(),true);
    assert.match(await page.locator('#opponentIntent').innerText(),/병을 옮겨 마의 공격길/);
    const danger=await page.locator('#opponentDanger').innerText();assert.match(danger,/마가 56 → 37로 내 차를/);
    assert.match(await page.locator('[data-square="24"]').getAttribute('aria-label'),/상대가 노리는 말/);
    assert.equal(await page.locator('#opponentForecast').getAttribute('open'),'');
    assert.match(await page.locator('#opponentLine').innerText(),/내가 차 37 → 38로 응수하면/);
    await page.locator('#hint').click();await page.locator('.suggested').first().waitFor({timeout:25000});
    assert.equal(await page.locator('#opponentDanger').innerText(),danger,'the hint must preserve the opponent explanation');
    assert.equal(await page.locator('#opponentForecast').isVisible(),false,'the hint replaces the earlier forecast with its deeper continuation');
    assert.match(await page.locator('#reason').innerText(),/마.*차.*공격을 피해요/s);
    assert.match(await page.locator('#reason').innerText(),/예상 응수: 상대/);
    fs.mkdirSync(output,{recursive:true});
    for(const[name,viewport]of [['desktop',{width:1366,height:900}],['phone',{width:390,height:844}]]){
      await page.setViewportSize(viewport);await page.evaluate(()=>{scrollTo(0,0);document.querySelector('.sidebar').scrollTop=0;});
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
      const panel=page.locator('#opponentPanel');assert.equal(await panel.evaluate(el=>el.scrollWidth<=el.clientWidth),true);
      await page.screenshot({path:path.join(output,name+'.png'),fullPage:true});
    }
    await page.setViewportSize({width:1366,height:900});
    const from=Number(await page.locator('[aria-label$="추천 수 출발"]').getAttribute('data-square'));
    const to=Number(await page.locator('[aria-label$="추천 수 도착"]').getAttribute('data-square'));
    await page.locator(`[data-square="${from}"]`).click();await page.locator(`[data-square="${to}"]`).click();await ready(page);
    await page.locator('#undo').click();
    assert.equal(await page.locator('#opponentDanger').innerText(),danger,'undo restores the previous opponent plan');
    assert.equal(await page.locator('[data-square="24"]').getAttribute('class').then(c=>c.includes('threatened')),true);
    await page.locator('#janggiResign').click();await page.locator('#janggiConfirmYes').click();
    assert.equal(await page.locator('#opponentPanel').isVisible(),false);
    await page.locator('[data-review]').first().click();assert.equal(await page.locator('.threatened').count(),0);
    await page.locator('#newGame').click();
    await page.unroute('**/janggi-coach.js?*');await page.unroute('**/janggi-worker.js?*');
    await page.goto(url+'/learning/games/board-coach/coach?game=janggi');
    await page.locator('#startLearning').click();assert.equal(await page.locator('#opponentPanel').isVisible(),false);
    // A normal worker run also supplies the analysis, including when the human is Han.
    await page.locator('#newGame').click();await page.locator("input[name=color][value='2']").check();
    await page.locator("input[name=level][value=advanced]").check();await page.locator('#startLearning').click();await ready(page);
    assert.equal(await page.locator('#opponentPanel').isVisible(),true);
    assert.ok((await page.locator('#opponentIntent').innerText()).length>10);
    assert.match(await page.locator('#opponentLine').innerText(),/내가 .*로 응수하면/);
    assert.equal(await page.locator('#board button').first().getAttribute('data-square'),'89');
    // Reproduce the late ending with the real worker at each difficulty. The
    // human offers bikjang from the supplied screenshot, then undoes and passes.
    for(const side of ['c','h'])for(const level of ['beginner','intermediate','advanced']){
      const ending=Array(90).fill(null);ending[67]='cK';ending[3]='hK';ending[78]='hC';
      const pieces=side==='c'?ending:ending.reverse().map(p=>p?R.other(p[0])+p[1]:null);
      const position={...R.position(pieces,side),ply:202},endPage=await browser.newPage({viewport:{width:1366,height:900}});
      endPage.on('pageerror',e=>errors.push(e.message));
      await endPage.route('**/janggi-coach.js?*',async route=>{const response=await route.fetch();await route.fulfill({response,body:`window.JanggiCoachRules={...JanggiCoachRules,initial:()=>(${JSON.stringify(position)})};\n`+await response.text()});});
      await endPage.goto(url+'/learning/games/board-coach/coach?game=janggi');
      await endPage.locator(`input[name=color][value='${side==='c'?1:2}']`).check();await endPage.locator(`input[name=level][value='${level}']`).check();await endPage.locator('#startLearning').click();
      await endPage.locator(`[data-square='${side==='c'?67:22}']`).click();await endPage.locator(`[data-square='${side==='c'?66:23}']`).click();
      await endPage.locator('#reviewPanel:not(.hidden)').waitFor();
      assert.match(await endPage.locator('#turn').innerText(),/빅장.*무승부/);assert.equal(await endPage.locator('#moveLabel').innerText(),'빅장 수락');
      assert.match(await endPage.locator('#reason').innerText(),/외통수.*어려워.*빅장/);assert.equal(await endPage.locator('#opponentPanel').isVisible(),false);
      if(side==='c'&&level==='advanced')await endPage.screenshot({path:path.join(output,'bikjang-accepted.png'),fullPage:true});
      await endPage.locator('#undo').click();assert.match(await endPage.locator('#turn').innerText(),/내 차례/);
      await endPage.locator('#janggiPass').click();await endPage.locator('#reviewPanel:not(.hidden)').waitFor();
      assert.match(await endPage.locator('#turn').innerText(),/양쪽 한 수 쉬기.*무승부/);assert.equal(await endPage.locator('#board .piece').count(),3);
      await endPage.close();
    }
    assert.deepEqual(errors,[]);
    console.log('PASS: opponent strategy, discovered threat, forecast, hint persistence, desktop/mobile layout, undo, review, restart and both colors');
    console.log('PASS: reported king-and-cannon ending accepts bikjang or consecutive passes at every level, both colors, through the real worker');
  }finally{await browser?.close();await new Promise(resolve=>server.close(resolve));}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
