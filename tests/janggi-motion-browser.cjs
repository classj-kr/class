"use strict";
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('../game-hub-server/node_modules/playwright');
const R=require('../learning/games/board-coach/janggi-rules.js');
const root=path.resolve(__dirname,'..'),output=path.join(root,'tmp/janggi-motion');
const types={K:'king',R:'rook',C:'cannon',H:'horse',E:'elephant',A:'guard',P:'soldier'};
const fixtures=[
  {name:'horse',pieces:[['cH',1,9]],from:82,to:65,frames:3,duration:280},
  {name:'elephant',pieces:[['cE',2,9]],from:83,to:58,frames:4,duration:360},
  {name:'chariot capture',pieces:[['cR',0,5],['hH',0,2]],from:45,to:18,frames:2,duration:234,capture:'hH'},
  {name:'cannon capture',pieces:[['cC',1,7],['cP',1,4],['hE',1,1]],from:64,to:10,frames:2,duration:318,capture:'hE'}
];
function position(fixture,flip=false){
  const board=Array(90).fill(null);for(const[p,x,y]of [['cK',4,8],['hK',3,1],...fixture.pieces])board[y*9+x]=p;
  return flip?R.position(board.reverse().map(p=>p?R.other(p[0])+p[1]:null),'h'):R.position(board,'c');
}
async function installProbe(page){
  await page.addInitScript(()=>{
    window.motionLog=[];window.holdMotion=true;
    const original=Element.prototype.animate;
    Element.prototype.animate=function(frames,options){
      const animation=original.call(this,frames,options);
      window.motionLog.push({element:this,animation,frames,options});if(window.holdMotion)animation.pause();return animation;
    };
  });
}
async function finish(page){
  await page.evaluate(()=>{for(const item of motionLog)if(item.animation.playState!=='idle')item.animation.finish();});
  await page.waitForFunction(()=>!document.querySelector('.path-moving,.capture-ghost,.capture-impact'));
}
async function snapshot(page){
  return page.evaluate(()=>({
    frames:motionLog[0].frames,options:motionLog[0].options,
    count:motionLog.length,ghost:document.querySelector('.capture-ghost')?.textContent,
    captureDelay:motionLog.find(m=>m.element.classList.contains('capture-ghost'))?.options.delay,
    captureFrames:motionLog.find(m=>m.element.classList.contains('capture-ghost'))?.frames,
    cellRaised:document.querySelector('.path-moving')?.parentElement.classList.contains('motion-cell')
  }));
}
async function main(){
  const server=http.createServer((req,res)=>{
    let file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
    if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
    if(!path.extname(file))file+='.html';
    fs.readFile(file,(error,data)=>{if(error){res.writeHead(404);res.end();return;}
      res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.webp':'image/webp'})[path.extname(file)]||'application/octet-stream');res.end(data);});
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const base=`http://127.0.0.1:${server.address().port}`,errors=[];let browser;
  try{
    browser=await chromium.launch({headless:true,channel:'msedge'});fs.mkdirSync(output,{recursive:true});
    async function coach(fixture,flip=false,aiMove=null,reduced=false){
      const page=await browser.newPage({viewport:{width:1280,height:900},reducedMotion:reduced?'reduce':'no-preference'});
      page.on('pageerror',e=>errors.push(e.message));await installProbe(page);
      const state=position(fixture,flip);if(aiMove)state.turn=R.other(state.turn);
      await page.route('**/janggi-coach.js?*',async route=>{const response=await route.fetch();await route.fulfill({response,body:`window.JanggiCoachRules={...window.JanggiCoachRules,initial:()=>(${JSON.stringify(state)})};\n`+await response.text()});});
      await page.route('**/janggi-worker.js?*',route=>route.fulfill({contentType:'text/javascript',body:aiMove?
        `importScripts('janggi-rules.js?v=3');self.onmessage=({data})=>{const move=JanggiCoachRules.actions(data.state).find(m=>m.from===${aiMove.from}&&m.to===${aiMove.to});self.postMessage({token:data.token,result:{move,reason:'테스트 수'}})};`:'self.onmessage=()=>{};'}));
      await page.goto(base+'/learning/games/board-coach/coach?game=janggi');await page.locator('#setup[open]').waitFor();
      if(flip)await page.locator("input[name=color][value='2']").check();
      await page.locator('#startLearning').click();return page;
    }
    for(const fixture of fixtures)for(const flip of [false,true]){
      const page=await coach(fixture,flip),from=flip?89-fixture.from:fixture.from,to=flip?89-fixture.to:fixture.to;
      assert.equal(await page.evaluate(()=>motionLog.length),0,'initial boards must not animate');
      await page.locator(`[data-square="${from}"]`).click();await page.locator(`[data-square="${to}"]`).click();
      const motion=await snapshot(page);
      assert.equal(motion.frames.length,fixture.frames);assert.equal(motion.options.duration,fixture.duration);
      assert.notEqual(motion.frames[0].transform,'translate(0px, 0px)');assert.equal(motion.frames.at(-1).transform,'translate(0px, 0px)');
      assert.equal(motion.cellRaised,true);assert.equal(await page.locator('#hint').isEnabled(),false);
      assert.equal(await page.locator('#board button:not(:disabled)').count(),0,'no next move while animating');
      assert.equal(await page.locator('#myCaptureCount').innerText(),'0','capture inventory waits for impact');
      if(fixture.capture){
        assert.equal(motion.count,4);assert.equal(motion.captureDelay,fixture.duration);
        assert.equal(motion.captureFrames.at(-1).opacity,0);assert.match(motion.captureFrames.at(-1).transform,/translateY\(-30px\)/);
        assert.ok(motion.ghost);
        if(!flip&&fixture.name==='chariot capture'){
          await page.evaluate(()=>{for(const item of motionLog)item.animation.currentTime=motionLog[0].options.duration+70;});
          await page.screenshot({path:path.join(output,'ai-capture-impact.png'),fullPage:true});
        }
      }
      await finish(page);
      if(fixture.capture){
        assert.equal(await page.locator('#myCaptureCount').innerText(),'1');assert.equal(await page.locator('#aiCaptureCount').innerText(),'0');
        assert.match(await page.locator('#latestCapture').innerText(),/내 .*상대 .*잡았어요/);
        assert.match(await page.locator('#janggiMoves').textContent(),/잡음/);
        if(!flip&&fixture.name==='chariot capture')await page.screenshot({path:path.join(output,'ai-capture-summary.png'),fullPage:true});
        await page.locator('#undo').click();
        assert.equal(await page.locator('#myCaptureCount').innerText(),'0');assert.match(await page.locator('#latestCapture').innerText(),/아직/);
        assert.equal(await page.locator(`[data-square="${to}"] .piece`).count(),1,'undo restores the captured piece');
      }
      console.log('AI '+fixture.name+(flip?' (Han)':' (Cho)')+': PASS');await page.close();
    }
    const capture=fixtures[2],cancelled=await coach(capture);
    await cancelled.locator('[data-square="45"]').click();await cancelled.locator('[data-square="18"]').click();
    await cancelled.locator('#undo').click();assert.equal(await cancelled.locator('.capture-ghost,.path-moving,.capture-impact').count(),0);
    assert.equal(await cancelled.locator('#myCaptureCount').innerText(),'0');assert.match(await cancelled.locator('#turn').innerText(),/^내 차례/);await cancelled.close();
    const opponent=await coach({pieces:[['hR',0,4],['cH',0,6]]},false,{from:36,to:54});
    await opponent.locator('.capture-ghost').waitFor();await finish(opponent);
    assert.equal(await opponent.locator('#aiCaptureCount').innerText(),'1');assert.match(await opponent.locator('#latestCapture').innerText(),/AI의 차가 내 마를/);
    await opponent.setViewportSize({width:390,height:844});assert.equal(await opponent.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
    await opponent.screenshot({path:path.join(output,'ai-capture-summary-phone.png'),fullPage:true});await opponent.close();
    const reduced=await coach(capture,false,null,true);
    await reduced.locator('[data-square="45"]').click();await reduced.locator('[data-square="18"]').click();
    assert.equal(await reduced.evaluate(()=>motionLog.length),0);assert.equal(await reduced.locator('#myCaptureCount').innerText(),'1');await reduced.close();
    // Exercise the actual online controller, with the same positions and moves.
    const online=await browser.newPage({viewport:{width:1280,height:900}});online.on('pageerror',e=>errors.push(e.message));await installProbe(online);
    await online.goto(base+'/learning/games/janggi/janggi');
    for(const fixture of fixtures){
      const s=position(fixture),pieces=s.board.flatMap((p,i)=>p?[{id:i,side:p[0]==='c'?'cho':'han',type:types[p[1]],x:i%9,y:Math.floor(i/9)}]:[]);
      await online.evaluate(({pieces,from,to})=>{
        motionLog=[];myRole='host';applyStartState({...makeInitialState('HEEH','HEEH',30),pieces});stopTurnTimer();
        selected=from;legalTargets=legalMovesFor(state.pieces.find(p=>p.id===selected),state.pieces);moveSelected(to%9,Math.floor(to/9));stopTurnTimer();
      },{pieces,from:fixture.from,to:fixture.to});
      const motion=await snapshot(online);assert.equal(motion.frames.length,fixture.frames);assert.equal(motion.options.duration,fixture.duration);
      if(fixture.capture){assert.ok(motion.ghost);assert.match(await online.locator('#lastCapture').innerText(),/최근 잡기/);}
      await finish(online);
      const count=await online.evaluate(()=>motionLog.length);await online.evaluate(()=>render());assert.equal(await online.evaluate(()=>motionLog.length),count,'rerender must not replay the move');
      console.log('Online '+fixture.name+': PASS');
    }
    await online.evaluate(()=>{applyStartState(makeInitialState('HEEH','HEEH',30));stopTurnTimer();});
    assert.equal(await online.locator('#choCaptures .capture-piece').count(),0);assert.match(await online.locator('#lastCapture').innerText(),/아직/);
    // A later quiet move retains the most recent capture, including on a guest.
    await online.evaluate(()=>{
      const initial=makeInitialState('HEEH','HEEH',30),rook=initial.pieces.find(p=>p.side==='cho'&&p.type==='rook');
      const victim=initial.pieces.find(p=>p.side==='han'&&p.type==='horse');
      rook.x=0;rook.y=5;victim.x=0;victim.y=4;applyStartState(initial);stopTurnTimer();
      selected=rook.id;legalTargets=legalMovesFor(state.pieces.find(p=>p.id===rook.id),state.pieces);moveSelected(0,4);stopTurnTimer();
    });
    await finish(online);assert.equal(await online.locator('#choCaptures .capture-piece').count(),1);
    const lastCapture=await online.locator('#lastCapture').innerText();assert.match(lastCapture,/초 차가 한 마를/);
    await online.evaluate(()=>{
      myRole='guest';const horse=state.pieces.find(p=>p.side==='han'&&p.type==='horse');
      selected=horse.id;legalTargets=legalMovesFor(horse,state.pieces);const move=legalTargets.find(m=>!m.capture);moveSelected(move.x,move.y);stopTurnTimer();
    });
    await finish(online);assert.equal(await online.locator('#lastCapture').innerText(),lastCapture);
    assert.equal(await online.locator('#choCaptures .capture-piece').count(),1);
    // The final king capture must be visible before the victory dialog covers it.
    await online.evaluate(()=>{
      myRole='host';motionLog=[];applyStartState({...makeInitialState('HEEH','HEEH',30),pieces:[
        {id:1,side:'cho',type:'king',x:3,y:8},{id:2,side:'han',type:'king',x:4,y:1},{id:3,side:'cho',type:'rook',x:4,y:3}
      ]});stopTurnTimer();selected=3;legalTargets=legalMovesFor(state.pieces[2],state.pieces);moveSelected(4,1);
    });
    assert.equal(await online.locator('#modal').getAttribute('class').then(c=>c.includes('show')),false);
    assert.equal(await online.locator('.capture-ghost').textContent(),'漢');await finish(online);
    assert.equal(await online.locator('#modal').getAttribute('class').then(c=>c.includes('show')),true);
    await online.close();assert.deepEqual(errors,[]);
    console.log('PASS: shared paths and timing, capture impact, inventories, undo during motion, opponent capture, restart and reduced motion');
  }finally{await browser?.close();server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
