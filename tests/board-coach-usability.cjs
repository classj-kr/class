"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const {chromium}=require("../game-hub-server/node_modules/playwright");
const base=process.env.BOARD_COACH_TEST_URL||"http://127.0.0.1:8936";
const output=path.resolve(__dirname,"../tmp/board-coach-usability");fs.mkdirSync(output,{recursive:true});
const games=["reversi","omok","chess","janggi"];
const workers={reversi:"ai-worker.js",omok:"ai-worker.js",chess:"chess-worker.js",janggi:"janggi-worker.js"};
async function start(page,game,color="1"){
  await page.goto(`${base}/learning/games/board-coach/coach?game=${game}`);
  await page.locator(`input[name=color][value='${color}']`).check();
  await page.locator("#startLearning").click();
  await page.locator("#hint:not(:disabled)").waitFor();
}
const board=page=>page.locator("#board .square").evaluateAll(cells=>cells.map(cell=>({
  square:cell.dataset.square??cell.dataset.index,label:cell.getAttribute("aria-label").split(" · ").slice(0,2).join(" · ")
})));
async function hint(page){
  await page.locator("#hint").click();await page.locator(".suggested").first().waitFor();
  await page.waitForFunction(()=>{const r=document.querySelector(".explanation").getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight+1;});
}
async function arrow(page){
  assert.equal(await page.locator(".move-arrow").count(),1);
  const endpoints=await page.evaluate(()=>{
    const svg=document.querySelector(".move-arrow"),line=svg.querySelector(".arrow-line");
    const from=document.querySelector("[aria-label$='추천 수 출발']").getBoundingClientRect();
    const to=document.querySelector("[aria-label$='추천 수 도착']").getBoundingClientRect();
    const start=line.getPointAtLength(0),end=line.getPointAtLength(line.getTotalLength()),matrix=svg.getScreenCTM();
    const a=new DOMPoint(start.x,start.y).matrixTransform(matrix),b=new DOMPoint(end.x,end.y).matrixTransform(matrix);
    return {fromDistance:Math.hypot(a.x-from.x-from.width/2,a.y-from.y-from.height/2)/from.width,
      toDistance:Math.hypot(b.x-to.x-to.width/2,b.y-to.y-to.height/2)/to.width,
      pointerEvents:getComputedStyle(svg).pointerEvents};
  });
  assert.ok(endpoints.fromDistance<.4&&endpoints.toDistance<.25,JSON.stringify(endpoints));
  assert.equal(endpoints.pointerEvents,"none","hint arrow must not intercept moves");
}
async function main(){
  const browser=await chromium.launch({channel:"msedge",headless:true}),errors=[];
  try{
    const page=await browser.newPage({viewport:{width:390,height:844}});
    await page.addInitScript(()=>{
      window.coachJobs=[];const send=Worker.prototype.postMessage;
      Worker.prototype.postMessage=function(data,...args){window.coachJobs.push({kind:data.kind,level:data.level});return send.call(this,data,...args);};
    });
    page.on("pageerror",e=>errors.push(e.message));
    for(const game of games){
      await start(page,game);const before=await board(page);await hint(page);
      assert.deepEqual(await page.evaluate(()=>window.coachJobs.at(-1)),{kind:'hint',level:'beginner'},'hint uses its own analysis route even against beginner');
      assert.deepEqual(await board(page),before,"a hint never plays a move");
      if(["chess","janggi"].includes(game))await arrow(page);
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
      await page.screenshot({path:path.join(output,game+"-phone-hint.png")});
      // Hold a real worker load so cancellation happens while calculation is pending.
      const pattern=`**/${workers[game]}?*`;
      const delay=async route=>{await new Promise(resolve=>setTimeout(resolve,900));try{await route.continue();}catch{}};
      await page.route(pattern,delay);
      const request=page.waitForRequest(r=>r.url().includes(workers[game]));
      await page.locator("#hint").click();await request;
      await page.locator("#newGame").click();await page.locator("#closeSetup").click();
      assert.equal(await page.locator("#hint").isEnabled(),true);
      assert.doesNotMatch(await page.locator("#reasonLabel").textContent(),/계산 중|생각하고/);
      await page.waitForTimeout(1100);
      assert.equal(await page.locator(".suggested").count(),0,"cancelled hint cannot arrive later");
      assert.deepEqual(await board(page),before);
      await page.unroute(pattern,delay);
      // A failed worker load must offer retry without losing the board.
      await page.route(pattern,route=>route.abort(),{times:1});
      await page.locator("#hint").click();await page.locator("#retry:not(.hidden)").waitFor();
      assert.deepEqual(await board(page),before);
      await page.locator("#retry").click();await page.locator(".suggested").first().waitFor();
      assert.equal(await page.locator("#retry").isVisible(),false);
      assert.deepEqual(await board(page),before);
      if(["chess","janggi"].includes(game)){
        const from=await page.locator("[aria-label$='추천 수 출발']").getAttribute("data-square");
        const to=await page.locator("[aria-label$='추천 수 도착']").getAttribute("data-square");
        await page.locator(`[data-square='${from}']`).click();await page.locator(`[data-square='${to}']`).click();
        assert.equal(await page.locator(".move-arrow").count(),0);
        await page.locator("#undo").click();assert.deepEqual(await board(page),before);
      }
      console.log(`${game}: readable hint, cancellation, no stale result and worker retry passed`);
    }
    // Both orientations and larger classroom screens use the actual rendered squares.
    for(const game of ["chess","janggi"])for(const color of ["1","2"]){
      await page.setViewportSize({width:1024,height:768});await start(page,game,color);await hint(page);await arrow(page);
      await page.screenshot({path:path.join(output,`${game}-${color}-ipad-hint.png`)});
      await page.setViewportSize({width:1366,height:668});await arrow(page);
      await page.screenshot({path:path.join(output,`${game}-${color}-chromebook-hint.png`)});
    }
    await start(page,"chess");assert.equal(await page.locator(".piece-rules li").count(),6);
    assert.deepEqual(errors,[]);
    console.log("hint direction in both orientations, tablet/Chromebook layouts and complete chess movement rules passed");
  }finally{await browser.close();}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
