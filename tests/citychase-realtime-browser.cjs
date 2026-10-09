const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),http=require('node:http');
const {chromium,webkit}=require('../game-hub-server/node_modules/playwright');
const root=path.resolve(__dirname,'..'),out=path.join(os.tmpdir(),'citychase-realtime-review');fs.mkdirSync(out,{recursive:true});
const external=process.env.CITYCHASE_TEST_URL;
const server=http.createServer((req,res)=>{
  if(req.url.startsWith('/api/student/profile')){res.setHeader('Content-Type','application/json');res.end('{"profile":{"avatar":{"key":""}}}');return;}
  const file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);
  if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  fs.readFile(file,(err,data)=>{if(err){res.writeHead(404).end();return;}res.setHeader('Content-Type',({'.html':'text/html','.js':'application/javascript','.css':'text/css','.png':'image/png','.webp':'image/webp'})[path.extname(file)]||'application/octet-stream');res.end(data);});
});
(async()=>{
  if(!external)await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const base=external||'http://127.0.0.1:'+server.address().port;
  const safari=process.argv.includes('--webkit');
  const browser=await(safari?webkit:chromium).launch(safari?{headless:true}:{channel:'msedge',headless:true});
  const errors=[];
  async function open(name,viewport={width:1366,height:650}){
    const context=await browser.newContext({viewport,hasTouch:true});
    await context.addInitScript(name=>{Object.defineProperty(window,'CLASS_PLAYER_NAME',{get:()=>name,set:()=>{}});},name);
    await context.route('**/realtime-engine.js*',r=>r.fulfill({contentType:'application/javascript',body:fs.readFileSync(path.join(root,'learning/games/citychase/realtime-engine.js'),'utf8')+`
      const originalCreate=ChaseEngine.create;
      ChaseEngine.create=(...a)=>{window.chaseTestGame=originalCreate(...a);chaseTestGame.players.forEach(p=>p.bot=false);return chaseTestGame;};`}));
    await context.route('**/realtime-capture.js*',r=>r.fulfill({contentType:'application/javascript',body:fs.readFileSync(path.join(root,'learning/games/citychase/realtime-capture.js'),'utf8')+`
      const makeCapture=ChaseCapture.create;ChaseCapture.create=(...a)=>{
        const model=window.chaseTestCapture=makeCapture(...a),observe=model.observe;window.chaseReceivedCaptures=[];
        model.observe=(state,...args)=>{window.chaseTestState=state;for(const event of state.events.filter(e=>e.type==='capture'))if(!chaseReceivedCaptures.some(e=>e.id===event.id))chaseReceivedCaptures.push(event);return observe(state,...args);};return model;
      };`}));
    const p=await context.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto(base+'/learning/games/citychase/realtime.html');return p;
  }
  try{
    const p=await open('가람');
    await p.evaluate(()=>{window.shopTagPoints={};const fill=CanvasRenderingContext2D.prototype.fillText;CanvasRenderingContext2D.prototype.fillText=function(text,x,y,...rest){if(ChaseWorld.shops.some(s=>s.name===text)){const point=new DOMPoint(x,y).matrixTransform(this.getTransform()),d=Math.min(devicePixelRatio||1,2);shopTagPoints[text]={x:point.x/d,y:point.y/d,width:this.measureText(text).width*this.getTransform().a/d};}return fill.call(this,text,x,y,...rest);};});
    assert.equal(await p.locator('#practiceCount').count(),0);
    assert.equal(await p.locator('#lobbyScreen .mp-ui-header').count(),1);
    await p.screenshot({path:path.join(out,(safari?'webkit-':'chrome-')+'entry.png')});
    const popupPromise=p.waitForEvent('popup');await p.locator('#rulesBtnLobby').click();const rules=await popupPromise;await rules.waitForLoadState();
    assert.match(await rules.locator('main').innerText(),/5명, 경찰 2명·도둑 3명/);assert.match(await rules.locator('main').innerText(),/15초/);
    assert.match(await rules.locator('main').innerText(),/5회 체포/);
    await rules.setViewportSize({width:768,height:920});await rules.screenshot({path:path.join(out,(safari?'webkit-':'chrome-')+'rules.png')});await rules.close();
    await p.locator('#practiceSetup summary').tap();await p.locator('#practiceBtn').tap();
    await p.waitForFunction(()=>window.chaseTestState?.players.length===5);
    assert.equal(await p.evaluate(()=>chaseTestState.players.filter(p=>p.team==='police').length),2);
    assert.equal(await p.evaluate(()=>chaseTestState.players.filter(p=>p.team==='thief').length),3);
    assert.equal(await p.locator('#captureText').innerText(),'0 / 5');
    await p.evaluate(()=>{chaseTestGame.players.forEach(p=>{p.bot=false;p.path=[];p.immuneUntil=1000;});});
    await p.locator('#viewBtn').tap();
    for(const[name,w,h]of[['pc',1900,950],['chromebook',1366,650],['ipad-landscape',1024,668],['ipad-portrait',768,920],['phone',390,844]]){
      await p.setViewportSize({width:w,height:h});await p.waitForTimeout(600);
      assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth&&document.documentElement.scrollHeight<=innerHeight));
      for(const id of ['clueBtn','dashBtn','viewBtn','interactBtn']){const b=await p.locator('#'+id).boundingBox();assert(b.x>=0&&b.y>=0&&b.x+b.width<=w+.1&&b.y+b.height<=h+.1);assert(b.height>=44);}
      await p.screenshot({path:path.join(out,(safari?'webkit-':'chrome-')+name+'.png')});
      await p.evaluate(()=>{const g=chaseTestGame;for(const player of g.players)ChaseEngine.command(g,player.id,{type:'SHARE'});});
      await p.locator('#clueBtn').tap();if(await p.locator('#shareBtn').isEnabled())await p.locator('#shareBtn').tap();assert.match(await p.locator('#sharedClues').innerText(),/가람/);
      assert(await p.locator('#cluePanel').evaluate(el=>el.scrollHeight<=el.clientHeight+1),'all clues and seven destinations fit without scrolling');
      assert.equal(await p.locator('#shopChoices button').count(),7);
      for(const id of ['closeClue','shareBtn'])assert((await p.locator('#'+id).boundingBox()).height>=44);
      const tags=await p.evaluate(()=>[...document.querySelectorAll('#privateClues .clueCandidates span')].map(e=>e.textContent));
      assert.equal(tags.length,3);assert.deepEqual(tags.sort(),await p.evaluate(()=>chaseTestState.clues[0].candidates.map(id=>ChaseWorld.shops.find(s=>s.id===id).name).sort()));
      await p.screenshot({path:path.join(out,(safari?'webkit-':'chrome-')+name+'-clues.png')});await p.locator('#closeClue').tap();
      console.log('PASS',name,'5 characters, touch controls, clue sharing, no page overflow');
    }
    // Keyboard and two-finger controls use the same authoritative road movement.
    await p.setViewportSize({width:1024,height:668});
    await p.waitForTimeout(600);const tag=await p.evaluate(()=>shopTagPoints['투썸플레이트']);
    await p.touchscreen.tap(tag.x+tag.width/2+5,tag.y);
    await p.waitForFunction(()=>{const route=chaseTestGame.players[0].path,door=ChaseWorld.shops.find(s=>s.id==='twosome').door;return route.length&&ChaseWorld.distance(route.at(-1),door)<1;});
    console.log('PASS tapping the edge of a displayed shop label walks to that shop entrance');
    async function place(x,y){await p.evaluate(({x,y})=>{const me=chaseTestGame.players[0];Object.assign(me,{x,y,path:[],steering:null,task:null,dashReady:0,dashUntil:0});},{x,y});await p.waitForTimeout(120);}
    const position=()=>p.evaluate(()=>({x:chaseTestGame.players[0].x,y:chaseTestGame.players[0].y}));
    async function stationary(){await p.waitForTimeout(100);const before=await position();await p.waitForTimeout(220);assert.deepEqual(await position(),before);}
    await place(500,60);await p.locator('#viewBtn').focus();
    await p.keyboard.down('ArrowRight');await p.waitForFunction(()=>chaseTestGame.players[0].x>535);
    await p.keyboard.press('Space');assert(await p.locator('#dashBtn').isDisabled());
    await p.keyboard.up('ArrowRight');await stationary();
    await place(1000,450);await p.keyboard.down('s');await p.waitForFunction(()=>chaseTestGame.players[0].y>475);await p.keyboard.up('s');
    await p.keyboard.down('w');await p.waitForFunction(()=>chaseTestGame.players[0].y<465);await p.keyboard.up('w');await stationary();
    await place(823,64.82);await p.keyboard.down('ArrowDown');await p.waitForFunction(()=>chaseTestGame.players[0].y>90);await p.keyboard.up('ArrowDown');
    assert(Math.abs((await position()).x-835)<1,'early input turns at the junction');
    // A thumb may stay on the pad while another finger presses dash.
    await place(500,60);const pad=p.locator('#movePad');assert(await pad.isVisible());
    const box=await pad.boundingBox(),x=box.x+box.width/2+40,y=box.y+box.height/2;
    if(!safari){
      const cdp=await p.context().newCDPSession(p);
      await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y,id:1}]});
      await p.waitForFunction(()=>chaseTestGame.players[0].x>520);
      const dash=await p.locator('#dashBtn').boundingBox(),other={x:dash.x+dash.width/2,y:dash.y+dash.height/2,id:2};
      await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y,id:1},other]});
      await p.waitForFunction(()=>chaseTestGame.players[0].dashReady>chaseTestGame.elapsed);
      assert(await pad.evaluate(el=>el.classList.contains('active')),'dash must not cancel the held thumb');
      await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+1,y,id:1}]});
      assert(await pad.evaluate(el=>el.classList.contains('active')),'lifting only the dash finger preserves movement');
      await p.screenshot({path:path.join(out,'chrome-pad-dash.png')});
      await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await cdp.detach();
    }else{
      // WebKit has no multi-touch injection API: exercise its pointer capture
      // with a held mouse, and a touch PointerEvent for the second-finger action.
      await p.mouse.move(x,y);await p.mouse.down();await p.waitForFunction(()=>chaseTestGame.players[0].x>520);
      await p.locator('#dashBtn').dispatchEvent('pointerdown',{pointerId:2,pointerType:'touch',button:0});assert(await p.locator('#dashBtn').isDisabled());
      await p.mouse.up();
    }
    await stationary();assert(!(await pad.evaluate(el=>el.classList.contains('active'))));
    await place(500,60);await p.mouse.move(x,y);await p.mouse.down();await p.waitForFunction(()=>chaseTestGame.players[0].x>520);
    await pad.dispatchEvent('pointercancel',{pointerId:1,pointerType:'mouse'});await p.mouse.up();await stationary();
    await place(500,60);await p.keyboard.down('d');await p.waitForFunction(()=>chaseTestGame.players[0].x>520);
    await p.evaluate(()=>window.dispatchEvent(new Event('blur')));await stationary();await p.keyboard.up('d');
    await place(500,60);await p.keyboard.down('d');await p.waitForFunction(()=>chaseTestGame.players[0].x>515);
    await p.locator('#clueBtn').tap();await stationary();await p.keyboard.up('d');assert(await pad.evaluate(el=>el.getAttribute('aria-disabled')==='true'));await p.locator('#closeClue').tap();
    // E must stop a held direction before starting the search channel.
    const door=await p.evaluate(()=>ChaseWorld.shops[0].door);await place(door.x,door.y);await p.keyboard.down('d');await p.keyboard.press('e');await p.keyboard.up('d');
    await p.waitForFunction(()=>chaseTestGame.players[0].task?.type==='search');assert.equal(await p.evaluate(()=>chaseTestGame.players[0].steering),null);
    await place(265,865);
    console.log('PASS keyboard, early turns, reverse, touch pad + dash, release, cancel, blur, clue panel and E search');
    await p.setViewportSize({width:1600,height:1000});await p.waitForTimeout(600);
    // Save a geometry overlay to inspect whether every painted street matches navigation.
    await p.evaluate(()=>{
      const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.id='navReview';svg.setAttribute('viewBox','0 0 1600 1000');const scale=Math.min(innerWidth/1600,(innerHeight-64)/1000);svg.style=`position:absolute;left:${(innerWidth-1600*scale)/2}px;top:${(innerHeight-1000*scale)/2}px;width:${1600*scale}px;height:${1000*scale}px;pointer-events:none`;
      for(const e of ChaseWorld.edges){const a=ChaseWorld.nodes[e.a],b=ChaseWorld.nodes[e.b],l=document.createElementNS(svg.namespaceURI,'line');for(const[k,v]of Object.entries({x1:a.x,y1:a.y,x2:b.x,y2:b.y,stroke:'#e900d8','stroke-width':4}))l.setAttribute(k,v);svg.append(l);}
      for(const n of Object.values(ChaseWorld.nodes)){const t=document.createElementNS(svg.namespaceURI,'text');t.setAttribute('x',n.x);t.setAttribute('y',n.y);t.setAttribute('fill','#000');t.setAttribute('font-size','17');t.textContent=n.id;svg.append(t);}document.querySelector('#play').append(svg);
    });
    await p.screenshot({path:path.join(out,'road-overlay.png')});await p.locator('#navReview').evaluate(e=>e.remove());
    // Touch a street, then observe physical motion and the running frame rendered by canvas.
    await p.evaluate(()=>{window.runFrames=[];const draw=CanvasRenderingContext2D.prototype.drawImage;CanvasRenderingContext2D.prototype.drawImage=function(img,...args){if(img.src?.includes('thief-run')&&args.length===8)runFrames.push(args.slice(0,2));return draw.call(this,img,...args);};});
    const start=await p.evaluate(()=>({x:chaseTestState.players[0].x,y:chaseTestState.players[0].y}));
    await p.touchscreen.tap(435,610);await p.waitForTimeout(650);
    const motion=await p.evaluate(()=>({p:chaseTestState.players[0],frames:[...new Set(runFrames.map(f=>f.join(',')))]}));
    assert(Math.hypot(motion.p.x-start.x,motion.p.y-start.y)>15);assert(motion.frames.length>2,'running changes pose');
    await p.screenshot({path:path.join(out,'running.png')});
    await p.locator('#dashBtn').tap();assert(await p.locator('#dashBtn').isDisabled());
    // Verify the two sprite atlases really contain transparency, not opaque square tiles.
    const alpha=await p.evaluate(async()=>{const out=[];for(const team of ['police','thief']){const img=new Image();img.src='assets/realtime-'+team+'-run.png';await img.decode();const c=document.createElement('canvas');c.width=c.height=1;const ctx=c.getContext('2d');ctx.drawImage(img,0,0);out.push(ctx.getImageData(0,0,1,1).data[3]);}return out;});assert.deepEqual(alpha,[0,0]);
    await p.evaluate(()=>{chaseTestGame.elapsed=179.95;});await p.locator('#result:not(.hidden)').waitFor();await p.locator('#againBtn').tap();await p.locator('#practiceSetup summary').tap();await p.locator('[data-team=police]').tap();await p.locator('#practiceBtn').tap();assert.match(await p.locator('#teamLabel').innerText(),/경찰팀/);
    await p.locator('#placementPanel:not(.hidden)').waitFor();assert(await p.locator('#placementConfirm').isDisabled());
    assert(await p.locator('#notice').isHidden(),'the previous round result notice is cleared before placement');
    for(const viewport of [{name:'chromebook',width:1366,height:650},{name:'ipad',width:1024,height:668},{name:'phone',width:390,height:844}]){
      await p.setViewportSize({width:viewport.width,height:viewport.height});const panel=await p.locator('#placementPanel').boundingBox();
      assert(panel.y>=0&&panel.y+panel.height<=viewport.height,'the entire placement panel fits the screen');
      for(const button of await p.locator('#placementShops button').all())assert((await button.boundingBox()).height>=44);
      await p.screenshot({path:path.join(out,(safari?'webkit-':'chrome-')+viewport.name+'-placement.png')});
    }
    await p.locator('#placementShops [data-shop="star"]').tap();await p.locator('#placementShops [data-shop="ediya"]').tap();assert(await p.locator('#placementConfirm').isDisabled());
    await p.locator('#placementShops [data-shop="twosome"]').tap();assert(await p.locator('#placementConfirm').isEnabled());
    await p.locator('#placementShops [data-shop="ediya"]').tap();assert(await p.locator('#placementConfirm').isDisabled());
    await p.locator('#placementShops [data-shop="ediya"]').tap();await p.locator('#placementConfirm').tap();await p.waitForFunction(()=>chaseTestState.phase==='playing');
    assert.deepEqual(await p.evaluate(()=>chaseTestGame.targets),['star','twosome','ediya']);
    console.log('PASS police practice placement, touch-sized controls, compact panel, selection changes and chosen order');
    await p.evaluate(()=>window.dispatchEvent(new CustomEvent('sitebackrequest',{cancelable:true})));
    for(const team of ['thief','police']){
      assert.equal(await p.locator('#lobbyScreen .mp-ui-header').count(),1);await p.locator('#practiceSetup summary').tap();await p.locator('[data-team='+team+']').tap();await p.locator('#practiceBtn').tap();
      await p.waitForFunction(()=>chaseTestGame.players.length===5);
      assert.equal(await p.evaluate(()=>chaseTestGame.players.filter(p=>p.team==='police').length),2);
      assert.equal(await p.evaluate(()=>chaseTestGame.players.find(p=>p.id==='me').team),team);
      await p.evaluate(()=>window.dispatchEvent(new CustomEvent('sitebackrequest',{cancelable:true})));
    }
    console.log('PASS running animation, touch movement, transparent sprites, dash, timeout, replay');
    // Exercise the actual capture renderer, including the last capture of a round.
    await p.locator('#practiceSetup summary').tap();await p.locator('[data-team=thief]').tap();await p.locator('#practiceBtn').tap();await p.setViewportSize({width:1024,height:668});
    const hasAudio=await p.evaluate(()=>{
      window.captureSounds=0;const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return false;
      const original=Audio.prototype.createOscillator;
      Audio.prototype.createOscillator=function(){captureSounds++;return original.call(this);};return true;
    });
    assert.equal(await p.locator('#soundBtn').getAttribute('aria-pressed'),'true');const beforeCaptureSound=await p.evaluate(()=>captureSounds);
    await p.evaluate(()=>{
      window.captureDrawn=[];const original=CanvasRenderingContext2D.prototype.drawImage;
      CanvasRenderingContext2D.prototype.drawImage=function(img,...args){if(img.src?.includes('realtime-capture.png'))captureDrawn.push(args[0]);return original.call(this,img,...args);};
      const g=chaseTestGame;g.elapsed=7;g.players.forEach(p=>{p.path=[];p.immuneUntil=1000;});
      const me=g.players.find(p=>p.id==='me'),cop=g.players.find(p=>p.team==='police');
      Object.assign(me,{...ChaseWorld.nodes.p0,id:'me',immuneUntil:0,carrying:true});Object.assign(cop,{x:me.x+16,y:me.y});
    });
    await p.waitForFunction(()=>chaseTestCapture.actor(chaseTestState.players.find(p=>p.id==='me'))?.phase==='caught');
    assert.equal(await p.locator('#captureText').innerText(),'1 / 5');
    await p.waitForTimeout(280);await p.screenshot({path:path.join(out,(safari?'webkit-':'chrome-')+'caught.png')});
    if(hasAudio)assert.equal(await p.evaluate(()=>captureSounds),beforeCaptureSound+3,'capture plays the three-note comic cue once');
    assert(await p.locator('#dashBtn').isDisabled());
    assert.equal(await p.evaluate(()=>chaseTestState.players.find(p=>p.id==='me').x),await p.evaluate(()=>ChaseWorld.nodes.jail.x));
    await p.waitForTimeout(550);await p.screenshot({path:path.join(out,(safari?'webkit-':'chrome-')+'poof.png')});
    await p.waitForFunction(()=>!chaseTestCapture.busy());
    await p.screenshot({path:path.join(out,(safari?'webkit-':'chrome-')+'jailed.png')});
    assert.equal(await p.evaluate(()=>new Set(captureDrawn).size),3,'surprise, police salute and sheepish prisoner poses all rendered');
    await p.evaluate(()=>ChaseEngine.command(chaseTestGame,chaseTestGame.players.find(p=>p.team==='police').id,{type:'MOVE',...ChaseWorld.nodes.jail}));
    await p.waitForFunction(()=>chaseTestGame.players.find(p=>p.id==='me').escapeProtected,null,{timeout:20000});
    await p.waitForTimeout(3300);
    assert.equal(await p.locator('#captureText').innerText(),'1 / 5');assert.equal(await p.locator('#missionText').innerText(),'탈출 보호');assert(await p.locator('#dashBtn').isEnabled());
    assert(await p.evaluate(()=>ChaseWorld.distance(chaseTestGame.players.find(p=>p.team==='police'),ChaseWorld.nodes.jail)<1));
    await p.screenshot({path:path.join(out,(safari?'webkit-':'chrome-')+'escape-protected.png')});
    await p.keyboard.down('ArrowLeft');
    await p.waitForFunction(()=>{const p=chaseTestGame.players.find(p=>p.id==='me');return !p.escapeProtected&&p.escapeUntil>chaseTestGame.elapsed;});await p.keyboard.up('ArrowLeft');
    assert.match(await p.locator('#missionText').innerText(),/탈출 보호 [1-3]초/);
    await p.waitForFunction(()=>chaseTestGame.players.find(p=>p.id==='me').escapeUntil<=chaseTestGame.elapsed);
    console.log('PASS fifteen-second release, no stationary jail recapture, visible protection and keyboard escape grace');
    await p.locator('#soundBtn').tap();
    await p.locator('#viewBtn').tap();await p.waitForTimeout(600);
    const mutedSounds=await p.evaluate(()=>captureSounds);
    await p.evaluate(()=>{
      window.edgeCaptions=[];const fill=CanvasRenderingContext2D.prototype.fillText;
      CanvasRenderingContext2D.prototype.fillText=function(text,x,y,...rest){if(['앗!','잡았다!','퐁!'].includes(text)){const point=new DOMPoint(x,y).matrixTransform(this.getTransform());edgeCaptions.push({x:point.x/(devicePixelRatio||1),y:point.y/(devicePixelRatio||1)});}return fill.call(this,text,x,y,...rest);};
      const g=chaseTestGame,cop=g.players.find(p=>p.team==='police');
      g.captures=ChaseEngine.CAPTURE_GOAL-1;
      const thief=g.players.find(p=>p.id==='me');Object.assign(thief,{jailedUntil:0,immuneUntil:0,x:ChaseWorld.nodes.b.x,y:ChaseWorld.nodes.b.y,path:[]});
      cop.x=ChaseWorld.nodes.b.x;cop.y=ChaseWorld.nodes.b.y;
    });
    await p.waitForFunction(()=>chaseTestState.phase==='ended');assert(await p.locator('#result').isHidden());
    await p.waitForTimeout(260);await p.screenshot({path:path.join(out,(safari?'webkit-':'chrome-')+'edge-capture.png')});
    await p.locator('#result:not(.hidden)').waitFor();assert.equal(await p.evaluate(()=>chaseTestCapture.busy()),false);
    assert(await p.evaluate(()=>edgeCaptions.length>0&&edgeCaptions.every(p=>p.x>=44&&p.x<=innerWidth-44&&p.y>=76&&p.y<=innerHeight-86)),'capture captions stay inside the viewport at the top road');
    assert.equal(await p.locator('#captureText').innerText(),'5 / 5');assert.match(await p.locator('#resultText').innerText(),/누적 체포 달성/);
    assert.equal(await p.evaluate(()=>captureSounds),mutedSounds,'muted captures stay silent');
    console.log('PASS capture poses, dust effect, jail transition and final-capture result timing');
    if(external&&!safari){
      const pages=[];for(let i=0;i<5;i++)pages.push(await open(['하나','두리','세나','네오','다온'][i]));
      await pages[0].locator('#hostTab').tap();await pages[0].waitForFunction(()=>/^\d{4}$/.test(document.querySelector('#roomCode').textContent.trim()));
      const code=(await pages[0].locator('#roomCode').innerText()).trim();
      for(const [index,page] of pages.slice(1).entries()){
        await page.locator('#joinCode').fill(code);await page.locator('#joinBtn').tap();await page.waitForTimeout(180);
        if(index===2)assert(await pages[0].locator('#startBtn').isDisabled(),'four participants must wait for the fifth');
      }
      const extra=await open('추가학생');await extra.locator('#joinCode').fill(code);await extra.locator('#joinBtn').tap();
      await extra.waitForFunction(()=>document.querySelector('#joinStatus').textContent.includes('최대 5명'));await extra.context().close();
      console.log('PASS server rejects a sixth participant');
      await pages[0].waitForFunction(()=>!document.querySelector('#startBtn').disabled);await pages[0].locator('#startBtn').tap();
      for(const [index,page] of pages.entries()){
        await page.waitForFunction(()=>chaseTestState?.phase==='setup');assert.equal(await page.locator('#clock').innerText(),'3:00');
        assert.equal(await page.locator('#placementPanel').isVisible(),index===1);assert.equal(await page.locator('#placementWaiting').isVisible(),index!==1);
        assert.deepEqual(await page.evaluate(()=>chaseTestState.clues),[]);assert(await page.locator('#clueBtn').isDisabled());
      }
      await pages[0].waitForTimeout(500);for(const page of pages)assert.equal(await page.evaluate(()=>chaseTestState.elapsed),0);
      await pages[1].locator('#placementPanel:not(.hidden)').waitFor();
      for(const id of ['star','ediya','twosome'])await pages[1].locator(`#placementShops [data-shop="${id}"]`).tap();
      for(const page of [pages[0],pages[2],pages[3],pages[4]])assert.equal(await page.locator('#placementShops [aria-pressed=true]').count(),0);
      await pages[1].locator('#placementConfirm').tap();
      for(const page of pages)await page.waitForFunction(()=>chaseTestState?.phase==='playing');
      assert.deepEqual(await pages[0].evaluate(()=>chaseTestGame.targets),['star','ediya','twosome']);
      console.log('PASS actual server: only the guest police chooses secret locations; timer and clues start after confirmation');
      for(const page of pages){await page.locator('#play:not(.hidden)').waitFor();await page.waitForFunction(()=>document.querySelector('#teamLabel').textContent.length>0);}
      assert.match(await pages[0].locator('#teamLabel').innerText(),/하나/);assert.match(await pages[1].locator('#teamLabel').innerText(),/두리/);
      assert.equal(await pages[0].evaluate(()=>chaseTestGame.players.filter(p=>p.team==='police').length),2);
      await pages[0].locator('#clueBtn').tap();await pages[0].locator('#shareBtn').tap();
      await pages[2].locator('#clueBtn').tap();await pages[2].waitForFunction(()=>document.querySelector('#sharedClues').textContent.includes('하나'));
      await pages[1].locator('#clueBtn').tap();assert(!(await pages[1].locator('#sharedClues').innerText()).includes('하나'));
      await pages[1].locator('#shareBtn').tap();
      await pages[4].locator('#clueBtn').tap();await pages[4].waitForFunction(()=>document.querySelector('#sharedClues').textContent.includes('두리'));
      await pages[4].locator('#shareBtn').tap();await pages[1].waitForFunction(()=>chaseTestState.shared.length===2);
      assert.equal(await pages[0].evaluate(()=>chaseTestState.shared.length),1,'police clues stay private from all thieves');
      await pages[4].locator('#closeClue').tap();
      await pages[1].locator('#closeClue').tap();await pages[1].locator('#viewBtn').tap();await pages[1].waitForTimeout(650);await pages[1].touchscreen.tap(1070,400);
      await pages[0].waitForFunction(()=>chaseTestGame.players[1].path.length>0);
      await pages[0].evaluate(()=>{const g=chaseTestGame;g.players.forEach(p=>p.immuneUntil=1000);Object.assign(g.players[1],{x:500,y:60,path:[],steering:null,dashReady:0});});
      await pages[1].keyboard.down('d');await pages[0].waitForFunction(()=>chaseTestGame.players[1].steering?.x>.9&&chaseTestGame.players[1].x>530);
      await pages[1].keyboard.press('Space');await pages[0].waitForFunction(()=>chaseTestGame.players[1].dashReady>chaseTestGame.elapsed);
      await pages[1].keyboard.up('d');await pages[0].waitForFunction(()=>!chaseTestGame.players[1].steering);
      const stopped=await pages[0].evaluate(()=>chaseTestGame.players[1].x);await pages[0].waitForTimeout(300);assert.equal(await pages[0].evaluate(()=>chaseTestGame.players[1].x),stopped);
      console.log('PASS actual server: guest direction, dash and release reach the host');
      await pages[0].evaluate(()=>{
        const g=chaseTestGame;g.elapsed=7;g.players.forEach(p=>{p.immuneUntil=1000;p.path=[];});
        const thief=g.players[0],cop=g.players[1];Object.assign(thief,{x:ChaseWorld.nodes.p0.x,y:ChaseWorld.nodes.p0.y,immuneUntil:0});Object.assign(cop,{x:thief.x+15,y:thief.y});
      });
      for(const page of pages)await page.waitForFunction(()=>chaseReceivedCaptures.length>0);
      for(const page of pages)assert.equal(await page.locator('#captureText').innerText(),'1 / 5');
      console.log('PASS capture event reaches all five players');
      const jail=await pages[1].evaluate(()=>{const s=Math.min(innerWidth/1600,(innerHeight-64)/1000);return{x:innerWidth/2+(ChaseWorld.nodes.jail.x-800)*s,y:innerHeight/2+(ChaseWorld.nodes.jail.y-500)*s};});
      await pages[1].touchscreen.tap(jail.x,jail.y);
      for(const page of pages)await page.waitForFunction(()=>chaseTestState.players.find(p=>p.name==='하나').escapeProtected,null,{timeout:20000});
      await pages[0].waitForTimeout(3300);
      for(const page of pages){assert.equal(await page.locator('#captureText').innerText(),'1 / 5');assert(await page.evaluate(()=>chaseTestState.players.find(p=>p.name==='하나').escapeProtected));}
      console.log('PASS actual server: all five clients retain release protection against a camping police player');
      console.log('PASS actual server: five clients start, private team clues, guest movement reaches host');
      for(const page of pages)await page.context().close();
    }
    assert.deepEqual(errors,[]);console.log('Screenshots:',out);
  }finally{await browser.close();if(!external)server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
