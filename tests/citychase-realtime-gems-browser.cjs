// Real four-client gem journey. The only instrumentation observes snapshots;
// positions, targets, inventory, clock and scores are never assigned by the test.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {chromium,webkit}=require('../game-hub-server/node_modules/playwright');
const base=process.env.CITYCHASE_TEST_URL||'http://127.0.0.1:19427';
const safari=process.argv.includes('--webkit'),out=path.join(os.tmpdir(),'citychase-realtime-gem-review');
fs.mkdirSync(out,{recursive:true});
(async()=>{
  const browser=await(safari?webkit:chromium).launch(safari?{headless:true}:{channel:'msedge',headless:true});
  const pages=[],errors=[],names=['보관담당','경찰','수색담당','단서담당'];
  try{
    for(const name of names){
      const context=await browser.newContext({viewport:{width:1024,height:668},hasTouch:true});
      await context.addInitScript(name=>Object.defineProperty(window,'CLASS_PLAYER_NAME',{get:()=>name,set:()=>{}}),name);
      await context.route('**/realtime.js*',async route=>{
        const response=await route.fetch(),body=await response.text(),anchor='function install(next){if(!next)return;';
        assert(body.includes(anchor));
        await route.fulfill({response,body:body.replace(anchor,anchor+'window.gemAuditView=next;window.gemAuditId=myId;')});
      });
      const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));pages.push(page);
      await page.goto(base+'/learning/games/citychase/realtime');
    }
    const [host,cop,scout]=pages;
    await host.locator('#hostTab').tap();await host.waitForFunction(()=>/^\d{4}$/.test(document.querySelector('#roomCode').textContent.trim()));
    const code=(await host.locator('#roomCode').innerText()).trim();
    for(const p of pages.slice(1)){await p.locator('#joinCode').fill(code);await p.locator('#joinBtn').tap();}
    await host.waitForFunction(()=>!document.querySelector('#startBtn').disabled);await host.locator('#startBtn').tap();
    await cop.locator('#placementPanel:not(.hidden)').waitFor();
    for(const id of ['star','ediya','twosome'])await cop.locator(`#placementShops [data-shop="${id}"]`).tap();
    await cop.locator('#placementConfirm').tap();
    for(const p of pages)await p.waitForFunction(()=>gemAuditView?.phase==='playing');
    for(const p of pages){await p.waitForFunction(()=>window.gemAuditView?.players.length===4);await p.locator('#viewBtn').tap();}
    const ids=await Promise.all(pages.map(p=>p.evaluate(()=>gemAuditId)));
    const world=await host.evaluate(()=>({shops:ChaseWorld.shops,hideout:ChaseWorld.nodes.hideout,park:ChaseWorld.nodes.c}));
    const state=()=>host.evaluate(()=>gemAuditView);
    async function settled(p,point,range=2){
      await p.waitForFunction(({point,range})=>{
        const v=gemAuditView,me=v.players.find(p=>p.id===gemAuditId);
        if(v.phase!=='playing')throw new Error('Round ended before arrival');
        return !me.path.length&&Math.hypot(me.x-point.x,me.y-point.y)<range;
      },{point,range},{timeout:35000});
    }
    async function tapPoint(p,point){
      const box=await p.locator('#town').boundingBox(),scale=Math.min(box.width/1600,(box.height-64)/1000);
      await p.touchscreen.tap(box.x+box.width/2+(point.x-800)*scale,box.y+box.height/2+(point.y-500)*scale);
    }
    async function visit(p,shop){await tapPoint(p,shop);await settled(p,shop.door);}
    async function share(p){
      await p.locator('#clueBtn').tap();if(await p.locator('#shareBtn').isEnabled())await p.locator('#shareBtn').tap();await p.locator('#closeClue').tap();
    }
    async function target(){
      await share(host);await share(scout);
      await scout.waitForFunction(()=>gemAuditView.shared.length===2);
      const clues=await scout.evaluate(()=>gemAuditView.shared.map(c=>c.candidates));
      const matches=clues[0].filter(id=>clues.every(c=>c.includes(id)));assert.equal(matches.length,1);
      return world.shops.find(s=>s.id===matches[0]);
    }
    async function sync(expected){
      for(const p of pages)await p.waitForFunction(expected=>{
        const v=gemAuditView;
        return Object.entries(expected).every(([k,value])=>k==='carrier'?v.players.find(p=>p.id===value)?.carrying:v[k]===value);
      },expected);
    }
    async function search(p){
      await p.locator('#interactBtn:not([disabled])').waitFor();await p.locator('#interactBtn').tap();
      await p.waitForFunction(()=>gemAuditView.players.find(p=>p.id===gemAuditId).task?.type==='search');
      assert.match(await p.locator('#interactBtn').innerText(),/수색.*%/);
      await p.waitForFunction(()=>!gemAuditView.players.find(p=>p.id===gemAuditId).task);
    }
    const first=await target(),wrong=world.shops.find(s=>s.id!==first.id);assert.equal(first.id,'star','clues lead to the police-selected first shop');
    assert.equal(await scout.locator('#interactBtn').isEnabled(),false,'search unavailable away from a door');
    await visit(scout,wrong);await search(scout);
    assert.equal((await state()).players.find(p=>p.id===ids[2]).carrying,false);
    await scout.waitForFunction(id=>gemAuditView.events.some(e=>e.type==='emptySearch'&&e.shopId===id),wrong.id);
    await sync({score:0});
    console.log('PASS touch travel to an empty shop, timed search, no gem or score');

    await visit(scout,first);
    await scout.locator('#interactBtn').tap();await scout.waitForFunction(()=>gemAuditView.players.find(p=>p.id===gemAuditId).task?.type==='search');
    await scout.keyboard.down('d');await scout.waitForTimeout(180);await scout.keyboard.up('d');
    await scout.waitForFunction(()=>!gemAuditView.players.find(p=>p.id===gemAuditId).task);
    await scout.waitForTimeout(1700);assert.equal((await state()).players.find(p=>p.id===ids[2]).carrying,false);
    console.log('PASS moving cancels an unfinished search');

    await visit(scout,first);await search(scout);await sync({score:0,carrier:ids[2]});
    assert.equal(await scout.locator('#missionText').innerText(),'보석 운반 중');
    await scout.screenshot({path:path.join(out,(safari?'webkit':'chromium')+'-found.png')});
    console.log('PASS actual shop search finds a gem; all four clients show its carrier, banked score stays zero');

    // The police walks to the carrier: no teleport or invented capture event.
    await tapPoint(cop,first);
    await sync({captures:1,score:0});
    for(const p of pages)await p.waitForFunction(id=>{
      const v=gemAuditView,t=v.players.find(p=>p.id===id);return !t.carrying&&t.jailedUntil>v.elapsed&&v.events.some(e=>e.type==='capture'&&e.thiefId===id&&e.droppedGem);
    },ids[2]);
    await cop.keyboard.press('Escape');await tapPoint(cop,world.park);
    console.log('PASS physically catching the carrier removes the gem, preserves banked score and synchronizes imprisonment');

    // A teammate recovers the lost gem from the same shop while the police leaves.
    await visit(host,first);await search(host);await sync({score:0,carrier:ids[0]});
    console.log('PASS a teammate searches the same shop and recovers the lost gem');
    await tapPoint(host,world.hideout);await sync({score:1});
    for(const p of pages){assert(!(await p.evaluate(()=>gemAuditView.players.some(p=>p.carrying))));assert.equal(await p.locator('#scoreText').innerText(),'1 / 3');}
    await scout.waitForFunction(()=>gemAuditView.players.find(p=>p.id===gemAuditId).jailedUntil<=gemAuditView.elapsed);
    await tapPoint(scout,world.hideout);
    console.log('PASS returning along roads and stopping in the hideout banks the recovered gem once');

    for(let score=1;score<3;score++){
      const shop=await target();assert.equal(shop.id,['star','ediya','twosome'][score],'the police-selected order is preserved');await visit(host,shop);await search(host);await sync({score,carrier:ids[0]});
      await tapPoint(host,world.hideout);await sync({score:score+1});
      console.log('PASS gem',score+1,'new shared clues, travel, search, carry and bank');
    }
    await sync({winner:'thief',phase:'ended',endReason:'gems'});
    for(const p of pages){await p.locator('#result:not(.hidden)').waitFor();assert.equal(await p.locator('#resultTitle').innerText(),'도둑팀 승리');assert.equal(await p.locator('#scoreText').innerText(),'3 / 3');assert(await p.locator('#interactBtn').isDisabled());}
    await host.screenshot({path:path.join(out,(safari?'webkit':'chromium')+'-three-gems.png')});
    assert.deepEqual(errors,[]);console.log('PASS all four clients agree on three deposited gems and thief victory; no console errors');console.log('Screenshots:',out);
  }finally{for(const p of pages)await p.context().close();await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
