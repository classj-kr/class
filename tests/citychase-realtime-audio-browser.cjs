// Real browser audio graphs + game UI. Engine positioning is a fixture; search,
// capture and bank outcomes still run through the real engine and snapshots.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium,webkit}=require('../game-hub-server/node_modules/playwright');
const Audio=require('../learning/games/citychase/realtime-audio');
const root=path.resolve(__dirname,'..'),base=process.env.CITYCHASE_TEST_URL||'http://127.0.0.1:19427';
(async()=>{
  const safari=process.argv.includes('--webkit'),browser=await(safari?webkit:chromium).launch(safari?{headless:true}:{channel:'msedge',headless:true});
  try{
    const context=await browser.newContext({viewport:{width:1024,height:668},hasTouch:true}),page=await context.newPage(),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await context.route('**/realtime-engine.js*',route=>route.fulfill({contentType:'application/javascript',body:fs.readFileSync(path.join(root,'learning/games/citychase/realtime-engine.js'),'utf8')+`
      const createGame=ChaseEngine.create;ChaseEngine.create=(...args)=>{window.audioTestGame=createGame(...args);audioTestGame.players.forEach(p=>p.bot=false);return audioTestGame;};`}));
    await context.addInitScript(()=>{
      window.playedNotes=[];window.outputPeak=0;
      const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;const create=Audio.prototype.createOscillator;
      Audio.prototype.createOscillator=function(){const oscillator=create.call(this),set=oscillator.frequency.setValueAtTime.bind(oscillator.frequency);oscillator.frequency.setValueAtTime=(hz,at)=>{playedNotes.push(hz);return set(hz,at);};return oscillator;};
      document.addEventListener('pointerdown',()=>{
        if(window.audioProbe)return;
        const bus=window.ClassGameSfx?.getAudioBus();if(!bus)return;
        const probe=window.audioProbe=bus.context.createAnalyser(),data=new Float32Array(probe.fftSize);bus.output.connect(probe);
        const sample=()=>{probe.getFloatTimeDomainData(data);for(const value of data)outputPeak=Math.max(outputPeak,Math.abs(value));requestAnimationFrame(sample);};sample();
      },{capture:true});
    });
    async function open(){await page.goto(base+'/learning/games/citychase/realtime.html');await page.evaluate(()=>document.body.dataset.sfxClicks='none');}
    async function start(){await page.locator('#practiceSetup summary').tap();await page.locator('#practiceBtn').tap();await page.waitForFunction(()=>window.audioTestGame);}
    const expected=kind=>Audio.CUES[kind].map(n=>n[1]);
    const notes=()=>page.evaluate(()=>playedNotes);
    async function clear(){await page.evaluate(()=>{playedNotes=[];outputPeak=0;});}
    async function heard(...kinds){try{await page.waitForFunction(count=>playedNotes.length>=count,kinds.flatMap(expected).length,{timeout:4000});assert.deepEqual(await notes(),kinds.flatMap(expected));}catch(error){console.error('Audio failure',kinds,await notes(),errors);throw error;}}
    await open();
    if(!await page.evaluate(()=>!!(window.AudioContext||window.webkitAudioContext))){
      await start();await page.setViewportSize({width:390,height:844});assert(await page.locator('#soundBtn').isVisible());await page.locator('#soundBtn').tap();
      await open();await start();assert.equal(await page.locator('#soundBtn').getAttribute('aria-pressed'),'false');assert.deepEqual(errors,[]);
      console.log('PASS mute UI and preference persistence. SKIP audio output: this browser build exposes no Web Audio API.');return;
    }
    await start();await heard('start');
    assert.equal(await page.locator('#soundBtn').getAttribute('aria-pressed'),'true');
    await page.waitForFunction(()=>outputPeak>.001);
    assert.equal(await page.evaluate(()=>ClassGameSfx.getAudioBus().context.state),'running');
    console.log('PASS first-touch unlock, default sound enabled, nonzero samples at shared audio output');

    async function atShop(correct){await page.evaluate(correct=>{
      const g=audioTestGame,p=g.players.find(p=>p.id==='me'),shop=ChaseWorld.shops.find(s=>(s.id===g.targets[g.score])===correct);
      Object.assign(p,{...shop.door,path:[],task:null});
    },correct);await page.waitForFunction(()=>!document.querySelector('#interactBtn').disabled);await clear();}
    await atShop(false);await page.locator('#interactBtn').tap();await heard('searchStart');await page.waitForTimeout(1800);await heard('searchStart','emptySearch');
    await atShop(true);await page.locator('#interactBtn').tap();await page.waitForTimeout(1800);await heard('searchStart','gemFound');
    await clear();await page.evaluate(()=>{const {x,y}=ChaseWorld.nodes.hideout;Object.assign(audioTestGame.players.find(p=>p.id==='me'),{x,y});});await page.waitForFunction(()=>audioTestGame.score===1);await heard('bank');
    await clear();await page.locator('#dashBtn').tap();await heard('dash');
    await page.locator('#clueBtn').tap();await clear();await page.locator('#shareBtn').tap();await heard('share');await page.locator('#closeClue').tap();
    await clear();await page.locator('#pingBtn').tap();await page.locator('#town').tap({position:{x:530,y:340}});await heard('ping');
    console.log('PASS UI search start, empty search, gem discovery, bank, dash, clue sharing and team ping have distinct cues');

    await clear();await page.evaluate(()=>{
      const g=audioTestGame,p=g.players.find(p=>p.id==='me'),cop=g.players.find(p=>p.team==='police');
      const {x,y}=ChaseWorld.nodes.p0;g.captures=ChaseEngine.CAPTURE_GOAL-1;Object.assign(p,{x,y,path:[],immuneUntil:0});Object.assign(cop,{x,y,path:[]});
    });await page.waitForFunction(()=>audioTestGame.phase==='ended');await heard('capture');assert(await page.locator('#result').isHidden());
    await page.locator('#result:not(.hidden)').waitFor();await heard('capture','defeat');await page.waitForTimeout(800);await heard('capture','defeat');
    console.log('PASS final capture sound once, then defeat only after the capture animation ends');

    await page.locator('#againBtn').tap();await start();await page.setViewportSize({width:390,height:844});
    assert(await page.locator('#soundBtn').isVisible());const button=await page.locator('#soundBtn').boundingBox();assert(button.width>=44&&button.height>=44&&button.x>=0&&button.x+button.width<=390);
    await page.locator('#soundBtn').tap();assert.equal(await page.evaluate(()=>localStorage.getItem('classSfxMuted')),'1');assert.equal(await page.evaluate(()=>ClassGameSfx.isMuted()),true);
    await clear();await page.locator('#dashBtn').tap();await page.waitForTimeout(350);assert.deepEqual(await notes(),[]);
    await open();await start();assert.equal(await page.locator('#soundBtn').getAttribute('aria-pressed'),'false');assert.deepEqual(await notes(),[]);
    await page.locator('#soundBtn').tap();await heard('share');assert.equal(await page.evaluate(()=>ClassGameSfx.isMuted()),false);
    console.log('PASS phone mute control, immediate silence, saved setting survives reload, unmute has no event backlog');

    const rendered=await page.evaluate(async()=>{
      const results=[];
      for(const kind of Object.keys(ChaseAudio.CUES)){
        const offline=new OfflineAudioContext(1,52920,44100);
        // OfflineAudioContext is suspended until startRendering. Only the
        // state facade differs; every node and sample is real browser DSP.
        const context={state:'running',currentTime:0,createOscillator:()=>offline.createOscillator(),createGain:()=>offline.createGain()};
        const environment=Object.assign(new EventTarget(),{ClassGameSfx:{getAudioBus:()=>({context,output:offline.destination})}});
        const sound=ChaseAudio.create({environment});sound.play(kind);
        const samples=(await offline.startRendering()).getChannelData(0);let peak=0,energy=0,hash=0;
        for(let i=0;i<samples.length;i++){peak=Math.max(peak,Math.abs(samples[i]));energy+=samples[i]*samples[i];if(i%97===0)hash=(hash*31+Math.round(samples[i]*100000))|0;}
        results.push({kind,peak,rms:Math.sqrt(energy/samples.length),hash});sound.destroy();
      }return results;
    });
    assert.equal(new Set(rendered.map(r=>r.hash)).size,rendered.length);
    for(const item of rendered)assert(item.peak>.02&&item.peak<.7&&item.rms>.003,JSON.stringify(item));
    console.log('PASS all '+rendered.length+' effects render distinct audible waveforms without clipping');
    assert.deepEqual(errors,[]);console.log('PASS '+(safari?'WebKit':'Chromium')+' audio integration');
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
