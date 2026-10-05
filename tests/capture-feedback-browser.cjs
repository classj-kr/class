'use strict';
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require('../game-hub-server/node_modules/playwright');
const root=path.resolve(__dirname,'..'),output=path.join(root,'tmp/capture-feedback');

async function main(){
  const server=http.createServer((req,res)=>{
    const file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
    if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
    fs.readFile(file,(error,data)=>{if(error){res.writeHead(404);res.end();return;}
      res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'})[path.extname(file)]||'application/octet-stream');res.end(data);});
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const base=`http://127.0.0.1:${server.address().port}`,errors=[];let browser;
  try{
    browser=await chromium.launch({headless:true,channel:'msedge'});fs.mkdirSync(output,{recursive:true});
    const page=await browser.newPage({viewport:{width:1100,height:880}});
    page.on('pageerror',error=>errors.push(error.message));
    await page.addInitScript(()=>{
      localStorage.setItem('classPlayerName','테스트');
      window.motionLog=[];window.soundLog=[];
      const animate=Element.prototype.animate;
      Element.prototype.animate=function(frames,options){const animation=animate.call(this,frames,options);animation.pause();motionLog.push({element:this,animation});return animation;};
      addEventListener('classsfxready',()=>{const play=ClassGameSfx.play;ClassGameSfx.play=name=>{const played=play(name);soundLog.push({name,played});return played;};});
    });
    await page.goto(base+'/learning/games/baduk/baduk.html');
    await page.evaluate(()=>{
      lobby={snapshot:()=>({role:'guest',myId:'a',players:{a:{name:'흑'},b:{name:'백'}}}),broadcast:()=>{}};
      window.fixture=(color=1,count=2)=>{
        ClassGameMotion.cancel();gameState=null;selectedMode='capture';
        const state=createInitialState(lobby.snapshot());
        state.board[16]=3-color;
        for(const i of [9,10,15,18,23])state.board[i]=color;
        state.board[17]=count===2?3-color:color;
        if(count===1)state.board[23]=0;
        state.turn=color-1;state.moveCount=7;state.history=[boardKey(state.board)];
        motionLog=[];soundLog=[];installState(state,false);
      };
    });
    const captures=()=>page.evaluate(()=>soundLog.filter(s=>s.name==='capture'));
    async function finish(){await page.evaluate(()=>motionLog.forEach(t=>{if(t.animation.playState!=='idle')t.animation.finish()}));await page.waitForFunction(()=>!document.querySelector('.capture-ghost,.capture-impact'));}
    for(const color of [1,2])for(const count of [1,2]){
      await page.evaluate(({color,count})=>fixture(color,count),{color,count});
      assert.equal(await page.evaluate(()=>motionLog.length),0,'initial snapshot is silent and still');
      await page.evaluate(({color,count})=>applyAction({kind:'move',row:3,col:count===2?3:2,playerId:color===1?'a':'b'}),{color,count});
      assert.equal(await page.locator('.capture-ghost').count(),count);
      assert.equal(await page.locator('.capture-impact').count(),count);
      assert.deepEqual(await captures(),[],'no impact sound before placement finishes');
      await page.evaluate(()=>installState(structuredClone(gameState),false));
      assert.equal(await page.evaluate(()=>motionLog.length),1+count*2,'duplicate state does not restart FX');
      await page.evaluate(()=>{motionLog[0].animation.finish();for(const t of motionLog.slice(1))t.animation.currentTime=290;});
      await page.waitForFunction(()=>soundLog.some(s=>s.name==='capture'));
      assert.equal((await captures()).length,1,'a group capture plays one sound');
      assert.equal((await captures())[0].played,true);
      if(color===1&&count===2){
        assert.ok(await page.locator('.capture-impact').first().evaluate(el=>Number(getComputedStyle(el).opacity)>.7));
        // Full-page screenshots resize the viewport and intentionally cancel FX.
        await page.screenshot({path:path.join(output,'baduk-group-impact.png')});
        assert.equal(await page.locator('.capture-impact').count(),2);
      }
      await finish();
      assert.equal(await page.locator(color===1?'#blackCaptured':'#whiteCaptured').innerText(),String(count));
      await page.evaluate(()=>renderGame());assert.equal((await captures()).length,1);
    }
    console.log('Baduk: both colors, one/group capture, arrival sound, remote duplicate and cleanup passed');

    await page.evaluate(()=>{fixture();applyAction({kind:'move',row:3,col:3,playerId:'a'});const remote=structuredClone(gameState);fixture();handleGameMessage('a',{type:MESSAGE.STATE,state:remote});});
    assert.equal(await page.locator('.capture-ghost').count(),2);await finish();assert.equal((await captures()).length,1,'remote captures have the same feedback');

    await page.evaluate(()=>{fixture();applyAction({kind:'move',row:3,col:3,playerId:'a'});showLobby();});
    await page.waitForTimeout(650);assert.deepEqual(await captures(),[]);assert.equal(await page.locator('.capture-ghost,.capture-impact').count(),0);
    await page.evaluate(()=>{fixture();gameState.captures[0]=2;applyAction({kind:'move',row:3,col:3,playerId:'a'});});
    assert.match(await page.locator('#turnBanner').innerText(),/승리/);assert.equal(await page.locator('.capture-ghost').count(),2);await finish();
    await page.evaluate(()=>{fixture();ClassGameSfx.setMuted(true);applyAction({kind:'move',row:3,col:3,playerId:'a'});});
    await finish();assert.deepEqual(await captures(),[{name:'capture',played:false}],'mute suppresses audio, not the visual effect');
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.evaluate(()=>{fixture();ClassGameSfx.setMuted(false);applyAction({kind:'move',row:3,col:3,playerId:'a'});});
    assert.equal(await page.evaluate(()=>motionLog.length),0);assert.deepEqual(await captures(),[{name:'capture',played:true}]);
    await page.emulateMedia({reducedMotion:'no-preference'});
    // Scoring removes agreed dead stones, not a new capture move.
    await page.evaluate(()=>{
      fixture();gameState.mode='standard';gameState=beginScoring(gameState);installState(gameState,false);
      const next={...gameState,board:gameState.board.map(v=>v===2?0:v),scoring:false,winner:1,lastMove:null};installState(next,false);
    });
    assert.deepEqual(await captures(),[]);assert.equal(await page.evaluate(()=>motionLog.length),0);
    await page.setViewportSize({width:390,height:844});await page.locator('#board').scrollIntoViewIfNeeded();
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    await page.evaluate(()=>{fixture();applyAction({kind:'move',row:3,col:3,playerId:'a'});motionLog.forEach(t=>t.animation.currentTime=290);});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
    await page.screenshot({path:path.join(output,'baduk-impact-phone.png')});await finish();await page.close();
    console.log('Baduk: winning capture, cancellation, mute, reduced motion, scoring and phone layout passed');

    const audio=await browser.newPage();audio.on('pageerror',error=>errors.push(error.message));
    await audio.route('**/audio-probe',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><title>Audio probe</title>'}));
    await audio.goto(base+'/audio-probe');
    await audio.evaluate(()=>{
      window.AudioContext=class extends OfflineAudioContext {constructor(){super(1,22050,44100);window.renderContext=this;}resume(){return Promise.resolve();}};
    });
    await audio.addScriptTag({url:base+'/assets/sound/game-sfx.js?v=20261006-capture'});
    const wave=await audio.evaluate(async()=>{
      ClassGameSfx.setMuted(true);const muted=ClassGameSfx.play('capture');
      ClassGameSfx.setMuted(false);ClassGameSfx.setVolume(.65);const played=ClassGameSfx.play('capture');
      const buffer=await renderContext.startRendering(),samples=buffer.getChannelData(0);
      const peak=Math.max(...samples.map(Math.abs)),tail=Math.max(...samples.slice(16000).map(Math.abs));
      return {muted,played,peak,tail};
    });
    assert.equal(wave.muted,false);assert.equal(wave.played,true);assert.ok(wave.peak>.02&&wave.peak<.95,JSON.stringify(wave));assert.ok(wave.tail<.0001);
    await audio.close();

    const coach=await browser.newPage({viewport:{width:390,height:844}});coach.on('pageerror',error=>errors.push(error.message));
    await coach.goto(base+'/learning/games/board-coach/coach.html?game=janggi');await coach.locator('#startLearning').click();
    await coach.locator('.unified-audio-menu-toggle').click();
    assert.equal(await coach.locator('#musicMuteBtn').isVisible(),false);assert.equal(await coach.locator('#sfxMuteBtn').isVisible(),true);
    await coach.locator('#sfxMuteBtn').click();assert.equal(await coach.evaluate(()=>ClassGameSfx.isMuted()),true);
    await coach.reload();assert.equal(await coach.evaluate(()=>ClassGameSfx.isMuted()),true);
    await coach.locator('#startLearning').click();await coach.locator('.unified-audio-menu-toggle').click();
    await coach.locator('.unified-audio-panel').evaluate(el=>Promise.all(el.getAnimations().map(a=>a.finished)));
    await coach.screenshot({path:path.join(output,'coach-sound-phone.png'),fullPage:true});await coach.close();
    assert.deepEqual(errors,[]);console.log('Capture synth: actual audio samples, mute and tail verified; AI effects-only controls persist on phone');
  }finally{await browser?.close();server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
