"use strict";
const assert=require("node:assert/strict"), fs=require("node:fs"), path=require("node:path");
const {chromium}=require("../game-hub-server/node_modules/playwright");
const base=process.env.BOARD_COACH_TEST_URL||"http://127.0.0.1:8936", url=base+"/learning/games/board-coach/coach.html?game=chess";
const output=path.resolve(__dirname,"../tmp/chess-coach");fs.mkdirSync(output,{recursive:true});
const square=s=>(Number(s[1])-1)*8+s.charCodeAt(0)-97;
const at=(p,s)=>p.locator(`[data-square='${square(s)}']`);
const errors=[];
async function start(page,color="1",level="beginner") {
  await page.goto(url);await page.locator("#setup[open]").waitFor();
  await page.locator(`input[name=color][value='${color}']`).check();await page.locator(`input[name=level][value='${level}']`).check();
  await page.locator("#startLearning").click();
  if(color==="2")await ready(page);
}
async function ready(page) {await page.waitForFunction(()=>!!document.querySelector("#board button:not(:disabled)")||!document.getElementById("reviewPanel").classList.contains("hidden"));}
async function move(page,a,b) {await at(page,a).click();await at(page,b).click();}
async function fixture(browser,fen,color="1") {
  const page=await browser.newPage({viewport:{width:1024,height:768}});page.on("pageerror",e=>errors.push(e.message));
  // Feed a rule-test position into the UI while retaining the real engine and worker.
  await page.route("**/chess-coach.js?*",async route=>{
    const response=await route.fetch();
    const prefix=`window.ClassChessRules=Object.freeze({...window.ClassChessRules,createInitialState:()=>window.ClassChessRules.boardFromFen(${JSON.stringify(fen)},"standard")});\n`;
    await route.fulfill({response,body:prefix+await response.text()});
  });
  await start(page,color);return page;
}
async function main() {
  const browser=await chromium.launch({headless:true,channel:"msedge"});
  try {
    const page=await browser.newPage({viewport:{width:1366,height:668}});page.on("pageerror",e=>errors.push(e.message));
    page.on("response",r=>{if(r.url().includes("/board-coach/")&&r.status()>=400)errors.push(`${r.status()}: ${r.url()}`);});
    await page.goto(base+"/learning/games/chess/chess");await page.locator("a.coach-entry").click();
    await page.locator("#setup[open]").waitFor();assert.equal(await page.locator("#title").innerText(),"체스");
    await page.locator("#startLearning").click();
    assert.equal(await page.locator(".chess-piece").count(),32);
    await page.locator("#hint").click();await page.locator(".suggested").first().waitFor();
    assert.equal(await page.locator(".suggested").count(),2);assert.match(await page.locator("#moveLabel").innerText(),/e2.*e4/);
    await move(page,"e2","e4");await ready(page);assert.match(await page.locator("#chessMoves").textContent(),/1\. e4 e5/);
    assert.equal(await page.locator("#reasonLabel").innerText(),"AI의 수");
    await page.locator("#undo").click();assert.equal(await at(page,"e2").locator("svg.w").count(),1);assert.equal(await at(page,"e7").locator("svg.b").count(),1);
    // Cancel an already-started worker while its script is loading.
    await page.route("**/chess-worker.js?*",async route=>{await new Promise(resolve=>setTimeout(resolve,800));try{await route.continue();}catch{}});
    await move(page,"d2","d4");await page.locator("#turn").filter({hasText:"AI가 생각"}).waitFor();await page.locator("#undo").click();
    await page.waitForTimeout(1000);assert.equal(await at(page,"d2").locator("svg.w").count(),1);assert.equal(await page.locator("#chessMoves").textContent(),"아직 둔 수가 없습니다.");
    await page.unroute("**/chess-worker.js?*");
    await move(page,"e2","e4");await ready(page);
    for(const [name,viewport] of [["chromebook",{width:1366,height:668}],["ipad-landscape",{width:1024,height:768}],["ipad-portrait",{width:820,height:1180}],["phone",{width:390,height:844}]]) {
      await page.setViewportSize(viewport);
      const sizes=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,board:document.getElementById("board").getBoundingClientRect().width,pieces:[...document.querySelectorAll("#board svg")].every(e=>e.getBoundingClientRect().width>25),controls:[...document.querySelectorAll(".controls button")].every(e=>e.getBoundingClientRect().height>=48)}));
      assert.ok(sizes.scroll<=sizes.width+1);assert.ok(sizes.board>250&&sizes.pieces&&sizes.controls,JSON.stringify(sizes));
      await page.screenshot({path:path.join(output,name+".png"),fullPage:true});
    }
    await page.locator("#zoom").click();assert.ok((await page.locator("#board .square").first().boundingBox()).width>=48);await page.locator("#zoom").click();
    await page.setViewportSize({width:1366,height:768});
    for(const level of ["beginner","intermediate","advanced"]) {
      await start(page,"2",level);assert.equal(await at(page,"e4").locator("svg.w").count(),1);
      assert.equal(await page.locator("#board button").first().getAttribute("data-square"),"7","black sees h1 at top left");
    }
    await page.locator("#newGame").click();await page.locator("input[name=color][value='1']").check();await page.locator("#startLearning").click();
    await move(page,"e2","e4");await page.locator("#newGame").click();await page.locator("#startLearning").click();await page.waitForTimeout(500);
    assert.equal(await at(page,"e2").locator("svg.w").count(),1);
    console.log("chess: entry, all levels, hint, move, undo, worker cancellation, restart and device layouts passed");

    const promotion=await fixture(browser,"4k3/P7/8/8/8/8/8/4K3 w - - 0 1");
    await move(promotion,"a7","a8");await promotion.locator("#chessPromotion[open]").waitFor();assert.equal(await promotion.locator("[data-promote]").count(),4);
    await promotion.locator("[data-promote='N']").click();assert.match(await at(promotion,"a8").getAttribute("aria-label"),/나이트/);assert.match(await promotion.locator("#turn").innerText(),/무승부/);await promotion.close();
    const castle=await fixture(browser,"r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1");
    await move(castle,"e1","g1");assert.match(await at(castle,"f1").getAttribute("aria-label"),/백 룩/);assert.match(await castle.locator("#chessMoves").textContent(),/O-O/);await castle.close();
    const check=await fixture(browser,"4r1k1/8/8/8/8/8/4R3/4K3 w - - 0 1");
    await at(check,"e2").click();assert.equal(await at(check,"d2").isDisabled(),true);await check.close();
    const ep=await fixture(browser,"4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 2");
    await move(ep,"e5","d6");assert.match(await at(ep,"d5").getAttribute("aria-label"),/빈칸/);assert.match(await ep.locator("#reason").innerText(),/앙파상/);await ep.close();
    const draw=await fixture(browser,"4k3/8/8/8/8/8/8/R3K3 w - - 99 51");
    await draw.locator("#claimDraw").click();await draw.locator("#chessDraw[open]").waitFor();await draw.locator("[data-claim]").first().click();assert.match(await draw.locator("#turn").innerText(),/50수 규칙.*무승부/);await draw.close();
    const aiDraw=await fixture(browser,"4k3/8/8/8/8/8/8/R3K3 b - - 100 51","1");
    await aiDraw.locator("#reviewPanel:not(.hidden)").waitFor();assert.match(await aiDraw.locator("#turn").innerText(),/50수 규칙.*무승부/);await aiDraw.close();
    const hintDraw=await fixture(browser,"4k3/8/8/8/8/8/8/R3K3 b - - 100 51","2");
    await hintDraw.locator('#hint').click();
    await hintDraw.locator('#moveLabel').filter({hasText:'무승부 선언'}).waitFor();
    assert.equal(await hintDraw.locator('#claimDraw').isEnabled(),true);
    assert.equal(await hintDraw.locator('.suggested').count(),0);
    assert.match(await hintDraw.locator('#turn').textContent(),/내 차례/,'a hint must never claim the draw for the player');
    await hintDraw.locator('#claimDraw').click();await hintDraw.locator('[data-claim]').first().click();
    assert.match(await hintDraw.locator('#turn').textContent(),/50수 규칙.*무승부/);await hintDraw.close();
    console.log("chess: promotion, castling, pinned piece, en passant and human/AI/hint draw claims passed");

    // Exercise an actual AI checkmate and end-game review; both kings remain on the board.
    const mate=await fixture(browser,"rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR b KQkq g3 0 2");
    await mate.locator("#reviewPanel:not(.hidden)").waitFor();assert.match(await mate.locator("#turn").innerText(),/체크메이트/);
    assert.equal(await mate.locator("#board [aria-label$='킹']").count(),2);
    await mate.locator("#reviewList button").first().click();assert.match(await mate.locator("#turn").innerText(),/복기/);assert.equal(await mate.locator("#board button:not(:disabled)").count(),0);
    await mate.locator("#liveBoard").click();assert.match(await mate.locator("#turn").innerText(),/체크메이트/);await mate.close();
    await start(page);await move(page,"e2","e4");await ready(page);await page.locator("#resign").click();await page.locator("#confirmResign").click();
    await page.locator("#reviewList button").first().click();await page.locator("#liveBoard").click();await page.locator("#undo").click();assert.equal(await page.locator("#reviewPanel").isVisible(),false);
    assert.deepEqual(errors,[]);console.log("chess: checkmate, review, resignation and post-game undo passed");
  } finally {await browser.close();}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
