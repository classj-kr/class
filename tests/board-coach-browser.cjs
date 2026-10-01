"use strict";
const assert = require("node:assert/strict"), fs = require("node:fs"), path = require("node:path");
const { chromium } = require("../game-hub-server/node_modules/playwright");
const base = process.env.BOARD_COACH_TEST_URL || "http://127.0.0.1:8936";
const output = path.resolve(__dirname, "../tmp/board-coach");
fs.mkdirSync(output, {recursive:true});
const errors = [];
const route = game => `${base}/learning/games/board-coach/coach.html?game=${game}`;
async function start(page, game, level="beginner", color="1") {
  await page.goto(route(game));
  await page.locator(`#setup input[name=level][value=${level}]`).check();
  await page.locator(`#setup input[name=color][value='${color}']`).check();
  await page.locator("#startLearning").click();
  await page.waitForFunction(() => !document.getElementById("setup").open);
  if(color==="2") await page.waitForFunction(() => document.querySelector("#board button:not(:disabled)"));
}
async function humanReady(page) {
  await page.waitForFunction(() => document.querySelector("#board button:not(:disabled)") || !document.getElementById("reviewPanel").classList.contains("hidden"));
}
async function checkLayout(page,label,landscape=true) {
  const bounds=await page.evaluate(() => {
    const box=s=>{const r=document.querySelector(s).getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,bottom:r.bottom,right:r.right}};
    return {w:innerWidth,h:innerHeight,scroll:document.documentElement.scrollWidth,board:box("#board"),frame:box("#boardViewport"),controls:box(".controls"),buttons:[...document.querySelectorAll(".controls button,.topbar button,.topbar a")].map(e=>({w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height})),font:parseFloat(getComputedStyle(document.getElementById("reason")).fontSize)};
  });
  assert.ok(bounds.scroll<=bounds.w+1,`${label}: no horizontal page overflow`);
  assert.ok(bounds.board.w>250 && Math.abs(bounds.board.w-bounds.board.h)<3,`${label}: square board ${JSON.stringify(bounds.board)}`);
  assert.ok(bounds.board.x>=bounds.frame.x && bounds.board.right<=bounds.frame.right+1 && bounds.board.bottom<=bounds.frame.bottom+1,`${label}: board is inside viewport`);
  assert.ok(bounds.buttons.every(b=>b.w>=44&&b.h>=48),`${label}: controls have adequate touch targets`);
  assert.ok(bounds.font>=16,`${label}: explanation text >=16px`);
  if(landscape) assert.ok(bounds.controls.bottom<=bounds.h,`${label}: controls visible without scrolling`);
  await page.screenshot({path:path.join(output,`${label}.png`),fullPage:true});
}
async function main() {
  const browser=await chromium.launch({channel:"msedge",headless:true});
  try {
    const page=await browser.newPage({viewport:{width:1366,height:668}});
    page.on("pageerror",error=>errors.push(error.message));
    page.on("response",r=>{if(r.url().includes("/board-coach/")&&r.status()>=400) errors.push(`${r.status()}: ${r.url()}`)});
    for(const game of ["reversi","omok"]) {
      await page.goto(`${base}/learning/games/${game}/${game}`);
      assert.equal(await page.locator("a.coach-entry").isVisible(),true);
      await page.locator("a.coach-entry").click();
      await page.locator("#setup[open]").waitFor();
      assert.ok(page.url().includes(`game=${game}`));
      await page.locator("#startLearning").click();
      const initial=game==="omok"?0:4;
      await page.locator("#hint").click();
      await page.locator(".suggested").waitFor();
      assert.equal(await page.locator("#board .stone").count(),initial,"hint does not place a stone");
      assert.match(await page.locator("#reasonLabel").innerText(),/힌트/);
      await checkLayout(page,`${game}-chromebook`);
      const suggested=await page.locator(".suggested").getAttribute("data-index");
      await page.locator(`[data-index='${suggested}']`).click();
      await humanReady(page);
      assert.equal(await page.locator("#board .stone").count(),initial+2);
      assert.equal(await page.locator("#reasonLabel").innerText(),"AI의 수");
      assert.ok((await page.locator("#reason").innerText()).length>15);
      await page.locator("#undo").click();
      assert.equal(await page.locator("#board .stone").count(),initial);
      // Cancel a pending computer turn: no late move may land after undo.
      await page.locator("#board button:not(:disabled)").first().click();
      await page.locator("#undo").click();
      await page.waitForTimeout(500);
      assert.equal(await page.locator("#board .stone").count(),initial);
      for(const [label,viewport] of [["ipad-landscape",{width:1024,height:768}],["ipad-portrait",{width:820,height:1180}],["phone",{width:390,height:844}]]) {
        await page.setViewportSize(viewport);
        await checkLayout(page,`${game}-${label}`,label==="ipad-landscape");
      }
      await page.locator("#zoom").click();
      assert.equal(await page.locator("#zoom").getAttribute("aria-pressed"),"true");
      const size=await page.locator("#board .square").first().boundingBox();
      assert.ok(size.width>=48 && size.height>=48,"enlarged board supports finger placement");
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
      await page.locator("#zoom").click();
      await page.setViewportSize({width:1366,height:668});
      console.log(`${game}: entry, hint, worker move, undo, cancellation, responsive layouts passed`);
    }
    for(const level of ["beginner","intermediate","advanced"]) {
      await start(page,"omok",level,"2");
      assert.equal(await page.locator("[data-index='112'] .black").count(),1);
      assert.equal(await page.locator("#board .stone").count(),1);
      assert.match(await page.locator("#reason").innerText(),/중앙/);
    }
    // Restart while a reply is pending, and close settings without restarting.
    await page.locator("[data-index='111']").click();
    await page.locator("#newGame").click();
    await page.locator("#setup input[name=level][value=beginner]").check();
    await page.locator("#setup input[name=color][value='1']").check();
    await page.locator("#startLearning").click();
    await page.waitForTimeout(600);
    assert.equal(await page.locator("#board .stone").count(),0);
    await page.locator("[data-index='112']").click();
    await page.locator("#newGame").click(); await page.locator("#closeSetup").click();
    await humanReady(page);
    assert.equal(await page.locator("#board .stone").count(),2);
    // Complete both games through the real UI and Web Workers, then inspect review scenes.
    for(const game of ["reversi","omok"]) {
      await start(page,game);
      for(let turn=0;turn<225;turn++) {
        await humanReady(page);
        if(await page.locator("#reviewPanel").isVisible()) break;
        await page.locator("#board button:not(:disabled)").first().click();
      }
      await page.locator("#reviewPanel:not(.hidden)").waitFor();
      assert.ok(await page.locator("#reviewList button").count()>0);
      const final=await page.locator("#board .stone").count();
      await page.locator("#reviewList button").first().click();
      assert.match(await page.locator("#turn").innerText(),/복기/);
      assert.equal(await page.locator("#board button:not(:disabled)").count(),0);
      await page.locator("#liveBoard").click();
      assert.equal(await page.locator("#board .stone").count(),final);
      await page.locator("#undo").click();
      assert.equal(await page.locator("#reviewPanel").isVisible(),false);
      assert.ok(await page.locator("#board button:not(:disabled)").count()>0);
      console.log(`${game}: full game, result, review and post-game undo passed`);
    }
    assert.deepEqual(errors,[]);
    console.log(`board-coach UI passed; screenshots: ${output}`);
  } finally { await browser.close(); }
}
main().catch(error=>{console.error(error);process.exitCode=1});
