'use strict';
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict'),{spawn}=require('node:child_process');
const {chromium}=require('../game-hub-server/node_modules/playwright');
const C=require('../learning/games/chess/chess-rules.js'),R=require('../learning/games/board-coach/rules.js');
const root=path.resolve(__dirname,'..'),output=path.join(root,'outputs/qa/coach-feedback');
async function main(){
  const server=http.createServer((req,res)=>{
    let file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
    if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
    if(!path.extname(file))file+='.html';
    fs.readFile(file,(error,data)=>{if(error){res.writeHead(404);res.end();return;}res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.webp':'image/webp'})[path.extname(file)]||'application/octet-stream');res.end(data);});
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const base=`http://127.0.0.1:${server.address().port}`,errors=[];let browser;
  try{
    browser=await chromium.launch({headless:true,channel:'msedge'});fs.mkdirSync(output,{recursive:true});
    async function boot(game,position,color='1',{scripted,reduced=false}={}){
      const page=await browser.newPage({viewport:{width:1280,height:850},reducedMotion:reduced?'reduce':'no-preference'});page.on('pageerror',e=>errors.push(e.message));
      await page.addInitScript(()=>{window.motionLog=[];window.holdMotion=true;window.soundLog=[];addEventListener('classsfxready',()=>{const play=ClassGameSfx.play;ClassGameSfx.play=name=>{if(['capture','stone'].includes(name))soundLog.push(name);return play(name);};});const original=Element.prototype.animate;Element.prototype.animate=function(frames,options){const animation=original.call(this,frames,options);motionLog.push({element:this,frames,options,animation});if(holdMotion)animation.pause();return animation;};});
      const controller=game==='chess'?'chess-coach':'coach';
      if(position)await page.route(`**/${controller}.js?*`,async route=>{
        const response=await route.fetch(),prefix=game==='chess'?`window.ClassChessRules={...ClassChessRules,createInitialState:()=>ClassChessRules.boardFromFen(${JSON.stringify(position)},'standard')};\n`:`window.BoardCoachRules={...BoardCoachRules,initial:()=>(${JSON.stringify(position)})};\n`;
        await route.fulfill({response,body:prefix+await response.text()});
      });
      if(scripted!==undefined)await page.route(`**/${game==='chess'?'chess-worker':'ai-worker'}.js?*`,async route=>{
        const response=await route.fetch(),override=game==='chess'?`ChessCoachAI.choose=(state)=>{const m=ClassChessRules.applyMove(state,${JSON.stringify(scripted[0])},${JSON.stringify(scripted[1])}).move;return {move:m,reason:ChessCoachAI.explain(state,m)}};`:`const originalChoose=BoardCoachAI.choose;BoardCoachAI.choose=(state,...args)=>state.count===${position.count}?({index:${scripted},reason:BoardCoachAI.explain(state,${scripted})}):originalChoose(state,...args);`;
        await route.fulfill({response,body:await response.text()+'\n'+override});
      });
      await page.goto(`${base}/learning/games/board-coach/coach.html?game=${game}`);await page.locator(`input[name=color][value='${color}']`).check();await page.locator('#startLearning').click();return page;
    }
    async function finish(page){await page.evaluate(()=>motionLog.forEach(t=>{if(t.animation.playState!=='idle')t.animation.finish();}));await page.waitForFunction(()=>!document.querySelector('.piece-moving,.capture-ghost,.moving-ghost,.flip-ghost'));}
    async function move(page,from,to,promotion){await page.locator(`[data-square='${C.squareIndex(from)}']`).click();await page.locator(`[data-square='${C.squareIndex(to)}']`).click();if(promotion)await page.locator(`[data-promote='${promotion}']`).click();}
    const cases=[
      ['knight',null,'g1','f3',null,'1',1],
      ['capture','4k3/8/8/3p4/4P3/8/8/4K3 w - - 0 1','e4','d5',null,'1',3],
      ['castle','4k3/8/8/8/8/8/8/4K2R w K - 0 1','e1','g1',null,'1',2],
      ['black castle','r3k3/8/8/8/8/8/8/4K3 b q - 0 1','e8','c8',null,'2',2],
      ['en passant','4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1','e5','d6',null,'1',3],
      ['promotion','4k3/P7/8/8/8/8/8/4K3 w - - 0 1','a7','a8','Q','1',1],
      ['promotion capture','1r2k3/P7/8/8/8/8/8/4K3 w - - 0 1','a7','b8','Q','1',3]
    ];
    for(const [name,fen,from,to,promotion,color,count]of cases){
      const page=await boot('chess',fen,color);assert.equal(await page.evaluate(()=>motionLog.length),0);
      await move(page,from,to,promotion);assert.equal(await page.evaluate(()=>motionLog.length),count,name);assert.deepEqual(await page.evaluate(()=>soundLog),[],'sound waits for arrival');
      assert.equal(await page.locator('#hint').isDisabled(),true);assert.equal(await page.locator('#zoom').isDisabled(),true);
      if(name==='knight')assert.equal(await page.evaluate(()=>motionLog[0].frames.length),3);
      if(count===3){
        assert.equal(await page.locator('#myCaptureCount').innerText(),'0');
        assert.ok(await page.evaluate(()=>motionLog[1].options.delay===motionLog[0].options.duration));
        assert.equal(await page.locator('.capture-ghost').count(),1);
        if(name==='en passant')assert.equal(await page.locator('[data-square="35"] .capture-ghost').count(),1);
      }
      if(name==='capture'){await page.evaluate(()=>motionLog.forEach(t=>t.animation.currentTime=motionLog[0].options.duration+60));await page.screenshot({path:path.join(output,'chess-capture-impact.png')});}
      await finish(page);
      assert.deepEqual(await page.evaluate(()=>soundLog),[count===3?'capture':'stone']);
      if(count===3){assert.equal(await page.locator('#myCaptureCount').innerText(),'1');assert.match(await page.locator('#latestCapture').innerText(),/(?:폰|룩).*잡음/);}
      await page.locator('#undo').click();assert.equal(await page.locator('#myCaptureCount').innerText(),'0');assert.equal(await page.locator('#board .capture-ghost,.moving-ghost').count(),0);assert.equal(await page.locator(`[data-square='${C.squareIndex(from)}'] .piece-svg`).count(),1);
      await page.close();
    }
    console.log('chess motion: both colors, knight, captures, castling, en passant, promotion and undo passed');
    const canceled=await boot('chess',cases[1][1]);await move(canceled,'e4','d5');await canceled.locator('#undo').click();await canceled.waitForTimeout(500);assert.equal(await canceled.locator('.capture-ghost,.piece-moving').count(),0);assert.equal(await canceled.locator('#myCaptureCount').innerText(),'0');assert.deepEqual(await canceled.evaluate(()=>soundLog),[]);await canceled.close();
    const reduced=await boot('chess',cases[1][1],'1',{reduced:true});await move(reduced,'e4','d5');assert.equal(await reduced.evaluate(()=>motionLog.length),0);assert.equal(await reduced.locator('#myCaptureCount').innerText(),'1');assert.deepEqual(await reduced.evaluate(()=>soundLog),['capture']);await reduced.close();
    const captured=await boot('chess','4k3/8/8/3p4/4P3/8/8/4K3 b - - 0 1','1',{scripted:['d5','e4']});
    await captured.waitForFunction(()=>motionLog.length===3);assert.equal(await captured.locator('#aiCaptureCount').innerText(),'0');await finish(captured);
    assert.deepEqual(await captured.evaluate(()=>soundLog),['capture']);assert.equal(await captured.locator('#aiCaptureCount').innerText(),'1');assert.equal(await captured.locator('#myCaptureCount').innerText(),'0');
    const captureText=await captured.locator('#latestCapture').innerText();assert.match(captureText,/AI의.*내 폰 잡음/);
    await move(captured,'e1','d1');await finish(captured);assert.equal(await captured.locator('#latestCapture').innerText(),captureText);
    await captured.locator('#undo').click();assert.equal(await captured.locator('#aiCaptureCount').innerText(),'1');await captured.close();
    const omok=R.initial('omok');omok.color=2;omok.board[108]=1;for(const i of [109,110,111])omok.board[i]=2;omok.count=4;
    for(const game of ['chess','reversi','omok']){
      const page=game==='chess'?await boot(game,'6k1/1b6/2p5/8/4R3/8/8/6K1 b - - 0 1','1',{scripted:['c6','c5']}):game==='omok'?await boot(game,omok,'1',{scripted:112}):await boot(game,null,'2');
      await page.waitForFunction(()=>motionLog.length>0);
      if(game==='reversi'){assert.equal(await page.locator('.flip-ghost').count(),1);assert.match(await page.locator('#lastFlip').innerText(),/AI가.*1개/);}
      await finish(page);await page.locator('#opponentPanel:not(.hidden)').waitFor();
      const note=await page.locator('#opponentPanel').innerText();assert.ok(note.length>50);
      if(game==='chess')assert.equal(await page.locator('[data-square="28"].opponent-target').count(),1);
      if(game==='omok'){assert.equal(await page.locator('[data-index="113"].opponent-target').count(),1);assert.equal(await page.locator('.threat-lines polyline').count(),1);}
      await page.locator('#hint').click();await page.locator('.suggested').first().waitFor();assert.equal(await page.locator('#opponentPanel').innerText(),note);
      if(game==='reversi')assert.equal(await page.locator('.flipped').count(),1);
      for(const viewport of [{width:1280,height:850},{width:390,height:844}]){await page.setViewportSize(viewport);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await page.screenshot({path:path.join(output,game+'-'+viewport.width+'.png'),fullPage:true});}
      await page.setViewportSize({width:1280,height:850});
      if(game==='chess'){const squares=(await page.locator('#moveLabel').innerText()).match(/[a-h][1-8]/g);await move(page,squares[0],squares[1]);}
      else await page.locator('.suggested').click();
      await page.locator('#undo').click();assert.equal(await page.locator('#opponentPanel').innerText(),note);assert.equal(await page.locator('.capture-ghost,.flip-ghost,.piece-moving').count(),0);
      await page.locator('#newGame').click();await page.locator("input[name=color][value='1']").check();await page.locator('#startLearning').click();
      // Fixture pages may deliberately restart with the AI to play; cancel that new turn.
      await page.locator('#newGame').click();assert.equal(await page.locator('#opponentPanel:not(.hidden)').count(),0);await page.close();
      console.log(game+': persistent opponent plan, hint, threat markers, undo/restart and desktop/mobile layout passed');
    }
    for(const game of ['reversi','omok']){
      const page=await boot(game,null,'1',{reduced:true});await page.locator('#board button:not(:disabled)').first().click();assert.equal(await page.evaluate(()=>motionLog.length),0);await page.close();
    }
    // Reversi may give the same player consecutive turns: do not start the next
    // worker until all discs from the previous move have finished flipping.
    let state=R.initial('reversi'),pass;
    while(!state.ended){const i=R.legal(state)[0],next=R.play(state,i);if(next.passed){pass={before:state,index:i};break;}state=next;}
    assert.ok(pass,'pass fixture');
    const page=await boot('reversi',pass.before,String(3-pass.before.color),{scripted:pass.index});await page.waitForFunction(()=>motionLog.length>0);
    const count=await page.evaluate(()=>motionLog.length);await page.waitForTimeout(500);assert.equal(await page.evaluate(()=>motionLog.length),count);await finish(page);
    await page.waitForFunction(n=>motionLog.length>n,count);await page.close();
    assert.deepEqual(errors,[]);console.log('reduced motion, cancellation and Reversi consecutive-turn timing passed');
    if(process.argv.includes('--regression'))for(const name of ['chess-coach-browser.cjs','board-coach-browser.cjs'])await new Promise((resolve,reject)=>{
      const child=spawn(process.execPath,[path.join(__dirname,name)],{stdio:'inherit',env:{...process.env,BOARD_COACH_TEST_URL:base}});child.on('error',reject);child.on('exit',code=>code?reject(Error(name+' failed: '+code)):resolve());
    });
  }finally{await browser?.close();server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
