"use strict";
// Real pointer/touch inputs on production pages, with deterministic game-state fixtures.
const fs = require('node:fs'), path = require('node:path'), http = require('node:http');
const assert = require('node:assert/strict');
const { chromium } = require('../game-hub-server/node_modules/playwright');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'outputs/sound-review-2026-10-09');
const report = { passed: [], errors: [] };
const server = http.createServer((req, res) => {
  const file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
  if (!file.startsWith(root + path.sep)) return res.writeHead(403).end();
  fs.readFile(file, (error, data) => {
    if (error) return res.writeHead(404).end();
    res.setHeader('Content-Type', ({'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.ogg':'audio/ogg','.m4a':'audio/mp4'})[path.extname(file)] || 'application/octet-stream');
    res.end(data);
  });
});
async function main() {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({channel:'msedge', headless:true});
  const origin = `http://127.0.0.1:${server.address().port}`;
  async function pageFor(game, touch = false) {
    const page = await browser.newPage({ viewport:{width:1280,height:900}, hasTouch:touch });
    page.on('pageerror', e => report.errors.push(`${game}: ${e.message}`));
    await page.addInitScript(() => {
      Object.defineProperty(window, 'CLASS_PLAYER_NAME', {get:()=> '검증가람', set:()=>{}});
      window.soundProbe = {oscillators:0, buffers:0, files:[], playing:[]};
      const buffer = BaseAudioContext.prototype.createBufferSource;
      BaseAudioContext.prototype.createBufferSource = function() { soundProbe.buffers++; return buffer.call(this); };
      const osc = BaseAudioContext.prototype.createOscillator;
      BaseAudioContext.prototype.createOscillator = function() { soundProbe.oscillators++; return osc.call(this); };
      const play = HTMLMediaElement.prototype.play;
      HTMLMediaElement.prototype.play = function() {
        if (this.src.includes('/sfx/')) {
          soundProbe.files.push(this.src.split('/').pop());
          this.addEventListener('playing', ()=>soundProbe.playing.push(this.src.split('/').pop()), {once:true});
        }
        return play.call(this);
      };
    });
    await page.goto(`${origin}/learning/games/${game}/${game}.html`);
    await page.waitForFunction(()=>window.ClassGameSfx?.getAudioBus);
    await page.evaluate(()=>{ClassGameSfx.setMuted(false);ClassGameSfx.setVolume(.65);});
    return page;
  }
  const reset = page => page.evaluate(()=>{soundProbe.oscillators=0;soundProbe.buffers=0;soundProbe.files=[];soundProbe.playing=[];});
  async function check(page, name, oscillators, files = []) {
    await page.waitForTimeout(160);
    const actual = await page.evaluate(()=>soundProbe);
    assert.equal(actual.oscillators, oscillators, `${name}: oscillator count ${JSON.stringify(actual)}`);
    assert.deepEqual(actual.files, files, `${name}: file count`);
    report.passed.push(name); console.log('PASS',name);
  }
  try {
    for (const touch of [false,true]) {
      const input = touch ? 'touch' : 'mouse';
      const click = locator => touch ? locator.tap() : locator.click();
      const hanoi = await pageFor('hanoitower', touch);
      await hanoi.evaluate(()=>{
        document.getElementById('start-screen').style.display='none';
        document.getElementById('game-container').style.display='flex';
        poles=[[3,2,1],[],[]];moveCount=0;selectedPoleIndex=null;render();
      });
      await reset(hanoi);
      await click(hanoi.locator('#pole0 .disk[data-size="1"]'));
      await check(hanoi, `hanoi ${input}: selection silent`,0);
      await click(hanoi.locator('#pole1'));
      await check(hanoi, `hanoi ${input}: one move tone`,2);
      assert.equal(await hanoi.evaluate(()=>moveCount),1);
      await reset(hanoi);
      await click(hanoi.locator('#pole0 .disk[data-size="2"]'));
      await click(hanoi.locator('#pole1'));
      await check(hanoi, `hanoi ${input}: invalid move gives only error feedback`,0,['error.ogg']);
      assert.equal(await hanoi.evaluate(()=>moveCount),1);
      await reset(hanoi);
      await hanoi.evaluate(()=>{selectedPoleIndex=null;render();ClassGameSfx.setMuted(true);});
      await click(hanoi.locator('#pole1 .disk'));
      await click(hanoi.locator('#pole2'));
      await check(hanoi, `hanoi ${input}: muted move silent`,0);
      assert.equal(await hanoi.evaluate(()=>moveCount),2);
      await hanoi.close();

      const coin = await pageFor('coinweighing',touch);
      await coin.evaluate(()=>{
        document.getElementById('start-screen').style.display='none';
        document.getElementById('game-board').style.display='block';initGame();
      });
      await reset(coin);
      await click(coin.locator('#coin-0'));
      await check(coin, `coin ${input}: selection silent`,0);
      await click(coin.locator('#left-wrapper'));
      await check(coin, `coin ${input}: one placement tone`,2);
      assert.equal(await coin.locator('#left-plate #coin-0').count(),1);
      await reset(coin);
      await click(coin.locator('#right-wrapper'));
      await check(coin, `coin ${input}: no selection silent`,0);
      await coin.evaluate(()=>ClassGameSfx.setMuted(true));
      await click(coin.locator('#coin-0'));await click(coin.locator('#right-wrapper'));
      await check(coin, `coin ${input}: muted placement silent`,0);
      assert.equal(await coin.locator('#right-plate #coin-0').count(),1);
      await coin.close();

      const set = await pageFor('setgame',touch);
      await set.evaluate(()=>{
        document.getElementById('lobby-card').classList.add('hidden');
        document.getElementById('game-container').style.display='flex';
        myId='me';activeSetter='me';myRole='guest';
        boardCards=Array.from({length:12},(_,id)=>({id,number:id%3,color:0,shape:0,filling:0}));renderBoard();
      });
      await reset(set);
      await click(set.locator('.set-card').first());
      await check(set, `set ${input}: selected card has no generic overlay`,3);
      await reset(set);await click(set.locator('.set-card').first());
      await check(set, `set ${input}: deselected card has no generic overlay`,3);
      await set.evaluate(()=>{activeSetter='other';});await reset(set);
      await click(set.locator('.set-card').first());
      await check(set, `set ${input}: unavailable card silent`,0);
      await set.close();

      const fruit = await pageFor('fruitbell',touch);
      await fruit.evaluate(()=>{
        myId='me';myRole='guest';started=true;state.ended=false;
        window.sent=[];lobby={send:message=>{sent.push(message);return true;}};showGame();
      });
      await reset(fruit);await click(fruit.locator('#bellBtn'));
      await fruit.waitForFunction(()=>soundProbe.playing.length===1);
      await check(fruit, `fruit ${input}: pointer bell played once`,0,['bell-hit-01.ogg']);
      assert.equal(await fruit.evaluate(()=>sent.filter(m=>m.type==='BELL_REQ').length),1);
      await reset(fruit);
      await fruit.evaluate(()=>{const cue={id:'test-result',type:'bell-result',sender:'me',ok:true};consumeSfxCue(cue);consumeSfxCue(cue);});
      await fruit.waitForFunction(()=>soundProbe.playing.length===2);
      await check(fruit, `fruit ${input}: own result does not repeat bell`,0,['answer-correct.ogg','cards-collected.ogg']);
      await reset(fruit);
      await fruit.evaluate(()=>{consumeSfxCue({id:'test-muted-result',type:'bell-result',sender:'me',ok:true});ClassGameSfx.setMuted(true);});
      await fruit.waitForTimeout(350);
      await check(fruit, `fruit ${input}: mute cancels delayed results`,0);
      await fruit.close();
    }
    const timer = await pageFor('setgame');
    await reset(timer);
    await check(timer,'timer: hidden initial countdown silent',0);
    await timer.evaluate(()=>{
      const el=document.createElement('div');el.id='turnSeconds';el.textContent='10';document.body.appendChild(el);
    });
    await timer.waitForFunction(()=>soundProbe.playing.length===1);
    await check(timer,'timer: visible warning starts once',0,['tick.ogg']);
    await reset(timer);await timer.waitForTimeout(350);
    await check(timer,'timer: unchanged seconds do not repeat',0);
    await timer.evaluate(()=>document.getElementById('turnSeconds').textContent='9');
    await timer.waitForFunction(()=>soundProbe.playing.length===1);
    await check(timer,'timer: new second ticks once',0,['tick.ogg']);
    await reset(timer);
    await timer.evaluate(()=>{const el=document.getElementById('turnSeconds');el.style.display='none';el.textContent='8';});
    await check(timer,'timer: hidden countdown update silent',0);
    await timer.evaluate(()=>{const el=document.getElementById('turnSeconds');el.style.display='block';el.style.visibility='hidden';el.textContent='7';});
    await check(timer,'timer: invisible countdown update silent',0);
    await timer.evaluate(()=>{ClassGameSfx.setMuted(true);const el=document.getElementById('turnSeconds');el.style.visibility='visible';el.textContent='6';});
    await check(timer,'timer: mute suppresses warning',0);
    await timer.close();

    const expedition=await pageFor('expedition');
    await expedition.evaluate(()=>{
      state={phase:'revealing',round:1,theme:'orerun',revealed:[],treasureLabel:'보석',relicLabel:'유물',nextRelicValue:5,hazardNames:['낙석','가스','붕괴','침수','박쥐']};
    });
    for (const card of [{kind:'treasure',value:6},{kind:'relic'},...Array.from({length:5},(_,hazard)=>({kind:'hazard',hazard}))]) {
      await reset(expedition);
      await expedition.evaluate(card=>{const before=structuredClone(state);state.revealed.push(card);reactToChange(before,state);},card);
      await expedition.waitForTimeout(180);
      const sound=await expedition.evaluate(()=>soundProbe);
      assert.ok(sound.oscillators+sound.buffers>0,JSON.stringify(card));
      assert.deepEqual(sound.files,[], 'Dedicated synthesis must not fall back to extra file audio');
      report.passed.push(`expedition: ${card.kind}${card.hazard ?? ''} reveal generates audio`);
      await reset(expedition);
      await expedition.evaluate(()=>reactToChange(structuredClone(state),state));
      await check(expedition,`expedition: repeated ${card.kind}${card.hazard ?? ''} snapshot silent`,0);
      assert.equal(await expedition.evaluate(()=>soundProbe.buffers),0);
    }
    await reset(expedition);
    await expedition.evaluate(()=>{
      const before=structuredClone(state);state.revealed.push({kind:'hazard',hazard:2});reactToChange(before,state);
    });
    await expedition.waitForTimeout(180);
    const beforeMute=await expedition.evaluate(()=>{ClassGameSfx.setMuted(true);return soundProbe.oscillators+soundProbe.buffers;});
    assert.ok(beforeMute>0);
    await expedition.waitForTimeout(350);
    assert.equal(await expedition.evaluate(()=>soundProbe.oscillators+soundProbe.buffers),beforeMute,'Delayed wipe must respect mute');
    assert.deepEqual(await expedition.evaluate(()=>soundProbe.files),[]);
    report.passed.push('expedition: mute cancels delayed collapse');
    await expedition.close();
    assert.deepEqual(report.errors, [], 'No page errors');
  } finally {
    fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'game-actions.json'),JSON.stringify(report,null,2));
    await browser.close();await new Promise(resolve=>server.close(resolve));
  }
}
main().catch(e=>{console.error(e);process.exitCode=1;server.close();});
