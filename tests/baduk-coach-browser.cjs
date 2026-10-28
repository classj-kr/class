'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
let chromium;try{({chromium}=require('playwright'));}catch{({chromium}=require('../game-hub-server/node_modules/playwright'));}
const sharp=require('sharp'),R=require('../learning/games/board-coach/baduk-rules.js');
const root=path.resolve(__dirname,'..'),out=path.join(root,'outputs/qa/baduk-coach');
async function main(){
  const server=http.createServer((req,res)=>{
    let file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
    if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
    if(!path.extname(file))file+='.html';
    fs.readFile(file,(error,data)=>{if(error){res.writeHead(404);res.end();return;}res.setHeader('Content-Type',({'.js':'text/javascript','.html':'text/html; charset=utf-8','.css':'text/css','.webp':'image/webp','.ogg':'audio/ogg'})[path.extname(file)]||'application/octet-stream');res.end(data);});
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const base=`http://127.0.0.1:${server.address().port}`,errors=[];let browser;
  async function capture(page,name){
    const png=await page.screenshot({fullPage:true}),webp=await sharp(png).webp({lossless:true}).toBuffer();
    const before=await sharp(png).ensureAlpha().raw().toBuffer({resolveWithObject:true}),after=await sharp(webp).ensureAlpha().raw().toBuffer({resolveWithObject:true});
    assert.deepEqual(after.info,before.info);assert.ok(after.data.equals(before.data));
    fs.writeFileSync(path.join(out,name+'.webp'),webp);
  }
  async function boot(mode='capture',color='1',fixture=null,viewport={width:1280,height:850}){
    const page=await browser.newPage({viewport});page.on('pageerror',e=>errors.push(e.message));
    if(fixture)await page.route('**/baduk-coach.js?*',async route=>{
      const response=await route.fetch();await route.fulfill({response,body:`BadukCoachRules.initial=()=>(${JSON.stringify(fixture)});\n`+await response.text()});
    });
    await page.goto(`${base}/learning/games/board-coach/baduk.html?game=baduk`);
    assert.equal(await page.locator('html').getAttribute('data-coach-state'),'ready');
    assert.equal(await page.locator('input[name=level]').count(),5);
    await page.locator(`input[name=mode][value=${mode}]`).check();await page.locator(`input[name=color][value='${color}']`).check();
    await page.locator('#startLearning').click();return page;
  }
  const board=page=>page.locator('#board .square').evaluateAll(cells=>cells.map(c=>c.querySelector('.stone')?.className||''));
  try{
    fs.mkdirSync(out,{recursive:true});browser=await chromium.launch({channel:'msedge',headless:true});
    // Both entry states: no name, and a named student's rebuilt lobby.
    for(const named of [false,true]){
      const page=await browser.newPage();
      if(named)await page.addInitScript(()=>{window.CLASS_PLAYER_NAME='홍길동';});
      await page.goto(`${base}/learning/games/baduk/baduk.html`);
      await page.locator('a.coach-entry').waitFor({state:'visible'});
      assert.match(await page.locator('a.coach-entry').getAttribute('href'),/game=baduk/);
      await page.locator('a.coach-entry').click();await page.locator('#setup[open]').waitFor();await page.close();
    }
    for(const mode of Object.keys(R.MODES)){
      const page=await boot(mode);await page.locator('#hint').click();await page.locator('.square.suggested').waitFor();
      const cells=R.MODES[mode].size**2;assert.equal(await page.locator('#board .square').count(),cells);
      assert.equal(await page.locator('#board .stone').count(),0,'hint never places a stone');
      assert.match(await page.locator('#reason').innerText(),/활로|연결|따내/);
      await page.locator('.square.suggested').click();await page.waitForFunction(()=>document.querySelectorAll('#board .stone').length===2);
      await page.locator('#hint:not(:disabled)').waitFor();await page.locator('#undo').click();assert.equal(await page.locator('#board .stone').count(),0);
      await page.close();
    }
    const white=await boot('capture','2');await white.locator('#hint:not(:disabled)').waitFor();assert.equal(await white.locator('.stone.black').count(),1);await white.close();
    const page=await boot();const empty=await board(page);
    // Cancel an in-flight worker, then fail/retry one without losing the board.
    const pattern='**/baduk-worker.js?*';
    await page.route(pattern,async route=>{await new Promise(r=>setTimeout(r,700));try{await route.continue();}catch{}});
    await page.locator('#hint').click();await page.locator('#newGame').click();await page.locator('#closeSetup').click();await page.waitForTimeout(1000);
    assert.equal(await page.locator('.square.suggested').count(),0);assert.deepEqual(await board(page),empty);assert.equal(await page.locator('#hint').isEnabled(),true);
    await page.unroute(pattern);await page.route(pattern,route=>route.abort());await page.locator('#hint').click();await page.locator('#retry').waitFor({state:'visible'});
    assert.deepEqual(await board(page),empty);await page.unroute(pattern);await page.locator('#retry').click();await page.locator('.square.suggested').waitFor();
    await page.locator('.square.suggested').click();await page.locator('#hint:not(:disabled)').waitFor();
    await page.locator('#badukResign').click();await page.locator('#badukResignCancel').click();assert.equal(await page.locator('#hint').isEnabled(),true);
    await page.locator('#badukResign').click();await page.locator('#badukResignConfirm').click();await page.locator('#reviewList button').first().click();assert.match(await page.locator('#turn').innerText(),/복기/);
    await page.locator('#liveBoard').click();await page.close();
    // Capture win, warning, feedback and review use real rule transitions.
    let fixture=R.initial();fixture.board[10]=2;fixture.board[16]=2;fixture.board[17]=1;fixture.board[24]=2;fixture.history=[R.key(fixture.board)];fixture.captures=[0,2];
    const danger=await boot('capture','1',fixture);await danger.locator('[data-index="0"]').click();await danger.locator('#feedbackPanel').waitFor({state:'visible'});
    assert.match(await danger.locator('#feedback').innerText(),/잡힐/);
    await danger.locator('#rethink').click();assert.equal(await danger.locator('[data-index="0"] .stone').count(),0);await danger.close();
    fixture=R.initial();fixture.board[10]=1;fixture.board[16]=1;fixture.board[17]=2;fixture.board[24]=1;fixture.history=[R.key(fixture.board)];fixture.captures=[2,0];
    const win=await boot('capture','1',fixture);await win.locator('[data-index="18"]').click();
    assert.equal(await win.locator('[data-index="17"] .stone').count(),0);assert.match(await win.locator('#turn').innerText(),/내가 이겼/);
    assert.equal(await win.locator('#blackCaptured').innerText(),'3');await win.locator('#reviewList button').first().click();
    assert.equal(await win.locator('[data-index="17"] .stone.white').count(),1);await win.close();
    fixture=R.initial('standard');fixture.board[40]=1;fixture.board[0]=2;fixture.passes=1;fixture.history=[R.key(fixture.board)];
    const scoring=await boot('standard','1',fixture);await scoring.locator('#badukPass').click();await scoring.locator('#badukScoring').waitFor({state:'visible'});
    await scoring.locator('[data-index="0"]').click();assert.equal(await scoring.locator('.dead-stone').count(),1);
    await capture(scoring,'standard-scoring');await scoring.locator('#badukResume').click();assert.equal(await scoring.locator('.dead-stone').count(),0);
    await scoring.locator('#undo').click();await scoring.locator('#badukPass').click();await scoring.locator('[data-index="0"]').click();await scoring.locator('#badukAgree').click();
    assert.match(await scoring.locator('#badukStatus').innerText(),/최종 점수/);assert.equal(await scoring.locator('#hint').isDisabled(),true);await scoring.close();
    // Finish is reversible and cancels a pending AI response without placing it.
    const finish=await boot('standard');await finish.route('**/baduk-worker.js?*',async route=>{await new Promise(r=>setTimeout(r,800));try{await route.continue();}catch{}});
    await finish.locator('[data-index="40"]').click();await finish.locator('#badukFinish').click();
    await finish.waitForTimeout(1100);assert.equal(await finish.locator('#board .stone').count(),1);
    assert.equal(await finish.locator('#badukScoring').isVisible(),true);await finish.unroute('**/baduk-worker.js?*');
    await finish.locator('#badukResume').click();await finish.locator('#hint:not(:disabled)').waitFor();assert.equal(await finish.locator('#board .stone').count(),2);
    await finish.locator('#badukFinish').click();await finish.locator('#badukAgree').click();assert.match(await finish.locator('#badukStatus').innerText(),/최종 점수/);await finish.close();
    // Compare the actual multiplayer screen, not a hand-drawn reference.
    const look=async p=>p.evaluate(()=>{
      const read=(selector,props,pseudo)=>{const s=getComputedStyle(document.querySelector(selector),pseudo);return props.map(p=>s[p]);};
      return {background:read('body',['backgroundImage','backgroundColor','fontFamily']),
        frame:read('.board-frame',['backgroundColor','borderTopColor','borderTopWidth','borderRadius','boxShadow']),
        black:read('.stone.black',['backgroundImage','boxShadow','borderRadius']),white:read('.stone.white',['backgroundImage','boxShadow','borderRadius']),
        lines:read('.point',['backgroundColor','height'],'::before'),vertical:read('.point',['backgroundColor','width'],'::after')};
    });
    for(const viewport of [{width:390,height:844},{width:768,height:1024},{width:1280,height:850}]){
      const sample=R.initial('standard');sample.board[20]=1;sample.board[30]=2;sample.board[40]=1;sample.board[41]=2;sample.last=41;sample.count=4;sample.history=[R.key(sample.board)];
      const original=await browser.newPage({viewport});await original.goto(`${base}/learning/games/baduk/baduk.html`);
      await original.evaluate(sample=>{
        lobby={snapshot:()=>({myId:'human',role:'guest',roomCode:'1234',players:{human:{name:'나'},computer:{name:'AI'}}})};
        gameState={...sample,turn:0,moveCount:sample.count,playerOrder:['human','computer'],lastMove:{row:4,col:5},draw:false};
        document.getElementById('missingScreen').classList.add('hidden');showGame();renderGame();
      },sample);
      const matching=await boot('standard','1',sample,viewport);
      assert.deepEqual(await look(matching),await look(original),'board artwork must use the original game stylesheet');
      assert.equal(await matching.locator('.baduk-coordinate').count(),0,'do not print labels on every intersection');
      assert.equal(await matching.locator('link[href^="coach.css"],link[href^="game-theme.css"]').count(),0);
      await capture(original,`original-${viewport.width}`);await capture(matching,`matched-${viewport.width}`);
      await original.close();await matching.close();
      const p=await boot('standard','1',null,viewport);await p.locator('#hint').click();await p.locator('.square.suggested').waitFor();
      assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
      assert.ok(await p.locator('#board').evaluate(el=>{const r=el.getBoundingClientRect();return r.width>250&&Math.abs(r.width-r.height)<2;}));
      assert.ok(await p.locator('.explanation').evaluate(el=>{const r=el.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight+1;}));
      await capture(p,`hint-${viewport.width}`);await p.close();
    }
    const legacy=await browser.newPage();await legacy.goto(`${base}/learning/games/board-coach/coach.html?game=baduk`);await legacy.waitForURL('**/baduk.html?game=baduk');await legacy.locator('#setup[open]').waitFor();await legacy.close();
    // Shared shell continues to boot the other four games.
    for(const game of ['chess','janggi','omok','reversi']){
      const p=await browser.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto(`${base}/learning/games/board-coach/coach.html?game=${game}`);
      await p.locator('#setup[open]').waitFor();assert.equal(await p.locator('html').getAttribute('data-coach-state'),'ready');await p.close();
    }
    assert.deepEqual(errors,[]);console.log('Baduk browser: entries, three modes, both colors, hint/undo, worker cancel/retry, feedback, resign/review, scoring/resume, three viewports and shared shell passed.');
  }finally{await browser?.close();await new Promise(resolve=>server.close(resolve));}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
