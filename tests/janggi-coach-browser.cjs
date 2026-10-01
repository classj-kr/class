"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const {chromium}=require("../game-hub-server/node_modules/playwright");
const base=process.env.BOARD_COACH_TEST_URL||"http://127.0.0.1:8936",url=base+"/learning/games/board-coach/coach?game=janggi";
const output=path.resolve(__dirname,"../tmp/janggi-coach");fs.mkdirSync(output,{recursive:true});
const at=(p,x,y)=>p.locator(`[data-square='${y*9+x}']`),errors=[];
async function ready(page){await page.waitForFunction(()=>document.getElementById("turn").textContent.startsWith("내 차례")||!document.getElementById("reviewPanel").classList.contains("hidden"),null,{timeout:25000});}
async function move(page,x,y,tx,ty){await at(page,x,y).click();await at(page,tx,ty).click();}
async function start(page,color="1",level="beginner"){
  await page.goto(url);await page.locator("#setup[open]").waitFor();
  await page.locator(`input[name=color][value='${color}']`).check();await page.locator(`input[name=level][value='${level}']`).check();
  await page.locator("#startLearning").click();if(color==="2")await ready(page);
}
const artwork=page=>page.evaluate(()=>{
  const styles=(element,keys)=>{const css=getComputedStyle(element);return Object.fromEntries(keys.map(key=>[key,css[key]]));};
  return {
    background:getComputedStyle(document.body).backgroundImage,
    board:styles(document.querySelector('#board'),['backgroundImage','borderTopWidth','borderTopStyle','borderTopColor','boxShadow']),
    pieces:[...document.querySelectorAll('#board .piece')].map(piece=>({
      text:piece.textContent,style:styles(piece,['backgroundImage','borderRadius','borderTopColor','fontFamily','color'])
    })).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)))
  };
});
async function fixture(browser,pieces,extra={}){
  const page=await browser.newPage({viewport:{width:1024,height:768}});page.on("pageerror",e=>errors.push(e.message));
  const board=Array(90).fill(null);for(const[p,x,y]of pieces)board[y*9+x]=p;
  await page.route("**/janggi-coach.js?*",async route=>{
    const response=await route.fetch();
    const prefix=`window.JanggiCoachRules={...window.JanggiCoachRules,initial:()=>({...window.JanggiCoachRules.position(${JSON.stringify(board)}),...${JSON.stringify(extra)}})};\n`;
    await route.fulfill({response,body:prefix+await response.text()});
  });
  await start(page);return page;
}
async function main(){
  const browser=await chromium.launch({headless:true,channel:"msedge"});
  try{
    for(const named of [false,true]){
      const context=await browser.newContext({viewport:{width:390,height:844}});
      if(named)await context.addInitScript(()=>localStorage.setItem("classPlayerName","검토자"));
      const page=await context.newPage();page.on("pageerror",e=>errors.push(e.message));
      await page.goto(base+"/learning/games/janggi/janggi");
      const entry=page.locator("a.coach-entry");await entry.waitFor({state:"visible"});assert.equal(await entry.count(),1);
      if(named){
        assert.equal(await entry.evaluate(e=>e.previousElementSibling.classList.contains("mp-ui-tabs")),true);
        const button=await entry.boundingBox(),tabs=await page.locator(".mp-ui-tabs").boundingBox();assert.ok(Math.abs(button.y-tabs.y)<8);
      }
      await entry.click();await page.locator("#setup[open]").waitFor();assert.equal(await page.locator("#title").innerText(),"장기");
      await context.close();
    }
    const page=await browser.newPage({viewport:{width:1366,height:768}});page.on("pageerror",e=>errors.push(e.message));
    await start(page);assert.equal(await page.locator(".janggi-piece").count(),32);
    const original=await browser.newPage({viewport:{width:1366,height:768}});
    await original.goto(base+"/learning/games/janggi/janggi");
    await original.evaluate(()=>{applyStartState(makeInitialState('HEEH','HEEH',30));stopTurnTimer();});
    assert.deepEqual(await artwork(page),await artwork(original),"AI lessons must use the existing Janggi board, pieces and background");
    await original.close();
    await page.locator("#hint").click();await page.locator(".suggested").first().waitFor({timeout:25000});
    assert.equal(await page.locator(".suggested").count(),2);assert.match(await page.locator("#moveLabel").textContent(),/마/);
    await move(page,1,9,2,7);await ready(page);assert.equal(await page.locator("#reasonLabel").textContent(),"AI의 수");
    assert.match(await page.locator("#janggiMoves").textContent(),/2\. 한/);
    await page.locator("#undo").click();assert.match(await at(page,1,9).getAttribute("aria-label"),/초 마/);
    assert.equal(await page.locator("#janggiMoves").textContent(),"아직 둔 수가 없습니다.");
    await page.route("**/janggi-worker.js?*",async route=>{await new Promise(r=>setTimeout(r,800));try{await route.continue();}catch{}});
    await move(page,1,9,2,7);await page.locator("#turn").filter({hasText:"AI가 생각"}).waitFor();await page.locator("#undo").click();
    await page.waitForTimeout(1100);assert.equal(await page.locator("#janggiMoves").textContent(),"아직 둔 수가 없습니다.");await page.unroute("**/janggi-worker.js?*");
    for(const [name,viewport]of [["chromebook",{width:1366,height:668}],["ipad-landscape",{width:1024,height:768}],["ipad-portrait",{width:820,height:1180}],["phone",{width:390,height:844}]]){
      await page.setViewportSize(viewport);
      const dims=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:innerWidth,board:document.getElementById("board").getBoundingClientRect().width,piece:document.querySelector(".janggi-piece").getBoundingClientRect().width}));
      assert.ok(dims.scroll<=dims.width+1,JSON.stringify(dims));assert.ok(dims.board>280&&dims.piece>24,JSON.stringify(dims));
      if(name==='phone')assert.ok((await page.locator('#board').boundingBox()).y>=50,'the back button must not cover the top rank');
      await page.screenshot({path:path.join(output,name+".png"),fullPage:true});
      await page.locator("#newGame").click();assert.equal(await page.locator("#setup #variantNote").count(),0);
      assert.ok(await page.locator("#setup").evaluate(e=>e.scrollWidth<=e.clientWidth));
      await page.locator("#setup").screenshot({path:path.join(output,name+"-setup.png")});await page.locator("#closeSetup").click();
    }
    await page.locator("#zoom").click();assert.ok((await at(page,1,9).boundingBox()).width>70);await page.locator("#zoom").click();
    for(const level of ["beginner","intermediate","advanced"]){await start(page,"2",level);assert.equal(await page.locator("#board button").first().getAttribute("data-square"),"89");assert.equal(await page.locator("#colorLabel").textContent(),"나는 한");}
    await page.locator("#newGame").click();await page.locator("#humanFormation").selectOption("HEHE");await page.locator("#aiFormation").selectOption("EHEH");await page.locator("#startLearning").click();await ready(page);
    assert.match(await at(page,7,0).getAttribute("aria-label"),/한 마/);
    await page.locator("#janggiResign").click();await page.locator("#janggiConfirmCancel").click();assert.equal(await page.locator("#reviewPanel").isVisible(),false);
    await page.locator("#janggiResign").click();await page.locator("#janggiConfirmYes").click();await page.locator("#reviewPanel:not(.hidden)").waitFor();
    await page.locator("[data-review]").first().click();assert.equal(await page.locator("#hint").isDisabled(),true);await page.locator("#liveBoard").click();
    console.log("janggi: entry, levels, formations, orientation, hint, undo, worker cancellation, resignation, review and device layouts passed");
    const pin=await fixture(browser,[["cK",4,8],["hK",3,1],["hR",4,2],["cR",4,6]]);
    await at(pin,4,6).click();assert.equal(await at(pin,5,6).isDisabled(),true);assert.equal(await at(pin,4,2).isDisabled(),false);await pin.close();
    const check=await fixture(browser,[["cK",4,8],["hK",3,1],["hR",4,2],["cR",0,9]]);assert.match(await check.locator("#turn").textContent(),/장군/);assert.equal(await check.locator("#janggiPass").isDisabled(),true);await check.close();
    const bik=await fixture(browser,[["cK",4,8],["hK",4,1]]);assert.equal(await bik.locator("#janggiPass").textContent(),"빅장 수락");
    await bik.locator("#janggiPass").click();await bik.locator("#janggiConfirmYes").click();assert.match(await bik.locator("#turn").textContent(),/빅장 · 무승부/);await bik.locator("#undo").click();assert.match(await bik.locator("#turn").textContent(),/내 차례/);await bik.close();
    const mate=await fixture(browser,[["cK",4,8],["hK",4,0],["cR",3,2],["cR",5,3],["cP",4,4]]);
    await move(mate,3,2,5,0);assert.match(await mate.locator("#turn").textContent(),/외통수 · 내가 이겼어요/);await mate.locator("#undo").click();assert.match(await at(mate,3,2).getAttribute("aria-label"),/초 차/);await mate.close();
    const pass=await fixture(browser,[["cK",4,8],["hK",3,1]],{passes:1});await pass.locator("#janggiPass").click();assert.match(await pass.locator("#turn").textContent(),/양쪽 한 수 쉬기 · 무승부/);await pass.close();
    console.log("janggi: pinned move, check, bikjang confirmation, mate, passing and ended-game undo passed");
    for(const game of ["chess","reversi","omok"]){await page.goto(base+"/learning/games/board-coach/coach?game="+game);await page.locator("#setup[open]").waitFor();assert.equal(await page.locator("#humanFormation").count(),0);await page.locator("#startLearning").click();assert.ok(await page.locator("#board button:not(:disabled)").count()>0);}
    assert.deepEqual(errors,[]);
  }finally{await browser.close();}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
