import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
import { createPreview } from '../learning/games/night-gallery/preview.mjs';
import { newGame, chooseBotAction, playCard, resolveDefense, botShouldBlock, validSave } from '../learning/games/night-gallery/engine.mjs';
const require=createRequire(import.meta.url);
const {chromium}=require('../game-hub-server/node_modules/playwright');
const key='night-gallery:game:v1';
let server,browser,url,context,page,errors;
const read=()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);
async function load(state) {await page.evaluate(({key,state})=>localStorage.setItem(key,JSON.stringify(state)),{key,state});await page.reload();await page.locator('#resume-button').click();}
test.before(async()=>{
  server=createPreview();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));url=`http://127.0.0.1:${server.address().port}`;
  browser=await chromium.launch({headless:true,...(process.platform==='win32'?{channel:'msedge'}:{})});
  await mkdir('outputs/night-gallery',{recursive:true});
});
test.beforeEach(async()=>{
  context=await browser.newContext({viewport:{width:1440,height:1100}});page=await context.newPage();errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(url);
});
test.afterEach(async()=>{try{assert.deepEqual(errors,[]);}finally{await context.close();}});
test.after(async()=>{await browser?.close();if(server)await new Promise(resolve=>server.close(resolve));});
test('desktop setup, custom names, complete four-raid local game, result and replay',{timeout:120000},async()=>{
  await page.screenshot({path:'outputs/night-gallery/desktop-lobby.png',fullPage:true});
  await page.locator('[data-mode="local"]').click();await page.locator('[data-count="3"]').click();
  await page.getByRole('textbox',{name:'1번 플레이어 이름'}).fill('별이');await page.locator('select[name="starter"]').selectOption('1');
  await page.getByRole('button',{name:'게임 시작'}).click();
  assert.equal((await read()).current,1);assert.equal(await page.locator('.hand-card').count(),0);
  let s=await read(),steps=0;
  while(s.phase!=='gameover'&&steps++<300){
    if(s.phase==='round')await page.locator('#next-round').click();
    else if(s.phase==='defense')await page.locator('[data-defense="block"]').click();
    else {
      await page.locator('#reveal-button').click();assert.equal(await page.locator('.hand-card').count(),5);
      const choice=chooseBotAction(s);await page.locator(`[data-card="${choice.cardId}"]`).click();
      if(steps===1)await page.screenshot({path:'outputs/night-gallery/desktop-game.png',fullPage:true});
      if(choice.tileId)await page.locator(`[data-tile="${choice.tileId}"]`).click();else await page.locator('#play-no-target').click();
    }
    s=await read();assert.equal(validSave(s),true);
  }
  assert.equal(s.phase,'gameover');assert.equal(s.round,4);assert.equal(await page.locator('tbody tr').count(),3);
  await page.screenshot({path:'outputs/night-gallery/result.png',fullPage:true});
  await page.reload();await page.locator('#resume-button').click();assert.equal(await page.locator('tbody tr').count(),3);
  await page.locator('#again-button').click();assert.equal((await read()).round,1);assert.equal((await read()).players[0].name,'별이');
});
test('bots take their turns, rules pause them, and refresh resumes without duplicating moves',async()=>{
  const fixture=newGame({names:['나','루나','모카'],seed:19,starter:1});await load(fixture);
  await page.locator('[data-open-rules]:visible').click();const before=await read();
  await page.waitForTimeout(1100);assert.deepEqual(await read(),before);
  await page.getByRole('button',{name:'알겠어요',exact:true}).click();
  await page.waitForFunction(key=>JSON.parse(localStorage.getItem(key)).current===0,key,{timeout:10000});
  assert.equal(await page.locator('.hand-card').count(),5);const after=await read();assert.equal(after.turn,2);
  await page.reload();await page.locator('#resume-button').click();assert.deepEqual(await read(),after);
  await page.locator('#home-button').click();await page.getByRole('button',{name:'계속하기',exact:true}).click();assert.deepEqual(await read(),after);
  await page.locator('#home-button').click();await page.locator('#confirm-reset').click();assert.equal(await page.locator('#setup-form').count(),1);assert.equal(await read(),null);
});
test('dog defense can survive reload, and handoff hides cards between local turns',async()=>{
  let s=newGame({names:['가','나','다'],seed:17,mode:'local'}),pending;
  for(let i=0;i<300&&!pending;i++){
    if(s.phase==='round')break;
    const choice=chooseBotAction(s);s=playCard(s,choice.cardId,choice.tileId);
    if(s.phase==='defense')pending=s;
  }
  // Create a valid deterministic defense fixture if this seed did not reach one.
  if(!pending){
    s=newGame({names:['가','나','다'],seed:17,mode:'local'});
    const source=[s.deck,...s.players.map(p=>p.hand)].find(a=>a.some(c=>c.type==='number'&&c.value===5));
    const i=source.findIndex(c=>c.type==='number'&&c.value===5),card=source[i];source[i]=s.players[0].hand[0];s.players[0].hand[0]=card;
    const tile=s.center.splice(s.center.findIndex(t=>t.kind==='number'&&t.value===5),1)[0];s.players[1].loot.push(tile);s.dogOwner=1;
    pending=playCard(s,card.id,tile.id);
  }
  assert.equal(validSave(pending),true);await load(pending);assert.equal(await page.locator('.hand-card').count(),0);
  await page.reload();await page.locator('#resume-button').click();await page.locator('[data-defense="allow"]').click();
  assert.deepEqual(await read(),resolveDefense(pending,false));assert.equal(await page.locator('.hand-card').count(),0);
  await page.locator('#reveal-button').click();assert.equal(await page.locator('.hand-card').count(),5);
});
test('mobile and tablet remain within viewport; five-player setup and game are operable',async()=>{
  for(const width of [360,390,768]){
    await page.setViewportSize({width,height:900});await page.reload();
    if(await page.locator('#resume-button').count()){await page.evaluate(key=>localStorage.removeItem(key),key);await page.reload();}
    await page.locator('[data-mode="local"]').click();await page.locator('[data-count="5"]').click();
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    await page.screenshot({path:`outputs/night-gallery/lobby-${width}.png`,fullPage:true});
    await page.getByRole('button',{name:'게임 시작'}).click();await page.locator('#reveal-button').click();
    assert.equal(await page.locator('.player').count(),5);assert.equal(await page.locator('.hand-card').count(),5);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    const s=await read(),choice=chooseBotAction(s);await page.locator(`[data-card="${choice.cardId}"]`).click();
    await page.screenshot({path:`outputs/night-gallery/game-${width}.png`,fullPage:true});
    if(choice.tileId)await page.locator(`[data-tile="${choice.tileId}"]`).click();else await page.locator('#play-no-target').click();
    assert.equal((await read()).turn,1);
  }
});
test('broken saves, storage denial, rules keyboard dismissal and text injection are safe',async()=>{
  await page.evaluate(key=>localStorage.setItem(key,'{broken'),key);await page.reload();assert.equal(await page.locator('#setup-form').count(),1);
  await page.getByRole('textbox',{name:'1번 플레이어 이름'}).fill('<img onload>');await page.locator('[data-count="2"]').click();assert.equal(await page.locator('#app img').count(),0);
  await page.locator('[data-open-rules]:visible').click();await page.keyboard.press('Escape');assert.equal(await page.locator('dialog[open]').count(),0);
  await context.addInitScript(()=>{Object.defineProperty(Storage.prototype,'getItem',{value(){throw Error('Denied');}});Object.defineProperty(Storage.prototype,'setItem',{value(){throw Error('Denied');}});});
  await page.reload();await page.getByRole('button',{name:'게임 시작'}).click();assert.equal(await page.locator('.hand-card').count(),5);assert.match(await page.locator('.notice').textContent(),/저장/);
});
