"use strict";
// Real local WebSocket server and independent browser sessions; no mocked game state.
// Start game-hub-server/server.js locally, then BOMB77_TEST_ORIGIN=http://127.0.0.1:18124 node tests/bomb77-browser.cjs
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const puppeteer = require("puppeteer-core");
const origin = process.env.BOMB77_TEST_ORIGIN || "http://127.0.0.1:18124";
assert.ok(["127.0.0.1", "localhost"].includes(new URL(origin).hostname));
const output = path.resolve(__dirname, "../outputs/bomb77-check");
fs.mkdirSync(output, { recursive: true });
const errors = [], players = [], seen = new Set();
const penalty = total => total >= 77 || total > 0 && total % 11 === 0;
async function open(browser, name) {
  const context = await browser.createBrowserContext(), page = await context.newPage();
  await page.setViewport({ width: 1024, height: 768 });
  page.on("pageerror", error => errors.push(error.message));
  await page.evaluateOnNewDocument(name => {
    localStorage.setItem("classPlayerName", name);
    window.__messages = [];
    const NativeSocket = window.WebSocket;
    window.WebSocket = class extends NativeSocket {
      constructor(...args) { super(...args); this.addEventListener("message", event => { try { window.__messages.push(JSON.parse(event.data)); } catch (_) {} }); }
    };
    let api;
    Object.defineProperty(window, "ClassroomMultiplayerLobby", { configurable: true, get: () => api, set(value) {
      api = { ...value, create(options) {
        const handler = options.onServerMessage;
        const instance = value.create({ ...options, onServerMessage(message) {
          if (message.type === "BOMB77_STATE") window.__state = message.state;
          if (message.type === "BOMB77_ERROR") window.__lastError = message.message;
          handler?.(message);
        } });
        window.__lobby = instance;return instance;
      } };
    } });
  }, name);
  await page.goto(`${origin}/learning/games/bomb77/bomb77`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => window.__lobby?.mounted);
  const player = { context, page };players.push(player);return player;
}
const state = page => page.evaluate(() => window.__state);
async function click(page, control) {
  const id = await page.evaluate(control => __lobby.ids[control], control);await page.click(`#${id}`);
}
async function play(page, card, action) {
  await page.bringToFront();
  const selector = `[data-card-id="${card.id}"]`;
  await page.waitForFunction(selector => {
    const button = document.querySelector(selector);
    return button && !button.disabled && getComputedStyle(button).visibility !== "hidden";
  }, {}, selector);
  await page.click(selector);
  const hint = await page.$eval("#selectionHint", el => el.textContent);
  assert.match(hint, /→/);
  const before = await state(page), total = before.total + (card.kind === "number" ? card.value : 0);
  assert.ok(hint.includes(`${before.total} → ${total}`));
  assert.equal(await page.$eval("#selectionHint", el => el.classList.contains("is-risk")), penalty(total));
  await page.click("#playButton");
  await page.waitForFunction(action => __state.actionNumber > action, {}, action);
}
(async () => {
 const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
 try {
  const host = await open(browser, "검증가람");await click(host.page, "hostTab");
  await host.page.waitForFunction(() => __lobby.connected && /^\d{4}$/.test(__lobby.snapshot().roomCode));
  const code = await host.page.evaluate(() => __lobby.snapshot().roomCode);
  assert.equal(await host.page.$eval("#roomCode", el => el.textContent.trim()), code);
  for (const name of ["검증바다", "검증하늘"]) {
    const guest = await open(browser, name);await click(guest.page, "joinTab");await guest.page.type("#joinCode", code);await click(guest.page, "joinButton");
    await guest.page.waitForFunction(() => __lobby.connected);
  }
  await host.page.waitForFunction(() => __state?.players.length === 3);
  await click(host.page, "startButton");
  for (const p of players) {
    await p.page.waitForFunction(() => __state?.phase === "playing");
    p.id = await p.page.evaluate(() => __lobby.snapshot().myId);
  }
  for (const [width, height] of [[1024,768],[768,1024],[720,900],[390,844]]) {
    await host.page.setViewport({ width, height });
    const metrics = await host.page.evaluate(() => {
      const box = el => { const r=el.getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom,width:r.width,height:r.height}; };
      const hand=box(document.querySelector("#hand")),button=box(document.querySelector("#playButton")),table=box(document.querySelector(".table-zone"));
      return { overflow:document.documentElement.scrollWidth>innerWidth+1,button,hand,table,visible:document.querySelector("#gameRoomCode").checkVisibility() };
    });
    assert.equal(metrics.overflow,false,JSON.stringify({width,metrics}));assert.equal(metrics.visible,true);
    assert.ok(metrics.button.y>=metrics.hand.bottom,JSON.stringify(metrics));assert.ok(metrics.button.height>=44);
    if(width>=700) assert.ok(metrics.button.bottom<=height,JSON.stringify({width,metrics}));
    await host.page.screenshot({ path:path.join(output,`playing-${width}x${height}.png`),fullPage:true });
  }
  await host.page.setViewport({width:1024,height:768});
  // Both roles must reconnect repeatedly, not merely keep a socket alive.
  for(const p of [host,players[1],host,players[1],host,players[1]]) {
    const beforeReload=await state(p.page),oldId=p.id;
    await p.page.bringToFront();
    await p.page.reload({waitUntil:"domcontentloaded"});
    await p.page.waitForFunction(()=>__state?.phase==="playing",{timeout:7000});
    assert.equal(await p.page.evaluate(()=>__lobby.snapshot().myId),oldId);
    assert.deepEqual((await state(p.page)).hand,beforeReload.hand);
  }
  seen.add("reconnect-host-and-guest");seen.add("reconnect");
  console.log("Room creation, four viewports, six host/guest reloads PASS");
  let steps=0;
  while(steps++<350) {
    const current=await state(host.page);
    if(current.phase==="finished") {seen.add("winner");break;}
    if(current.phase==="roundEnd") {
      seen.add("explosion");
      assert.ok(current.total>=77);assert.equal(current.turnDeadline,null);
      if(!seen.has("explosion-shot")) {await host.page.screenshot({path:path.join(output,"explosion.png")});seen.add("explosion-shot");}
      await host.page.waitForFunction(round=>__state.phase==="playing"&&__state.round===round+1,{timeout:6000},current.round);
      const next=await state(host.page);assert.equal(next.total,0);assert.ok(next.players.filter(p=>!p.eliminated).every(p=>p.handCount===5));seen.add("redeal");continue;
    }
    const actor=players.find(p=>p.id===current.turnPlayerId);
    await actor.page.waitForFunction(action=>__state.actionNumber===action,{},current.actionNumber);
    const own=await state(actor.page);
    assert.equal(own.hand.length,own.turnCardsPlayed===1?4:5);
    if(own.turnCardsRemaining===2) {
      seen.add("double");
      for(const card of own.hand.filter(c=>c.kind==="double")) {
        assert.equal(await actor.page.$eval(`[data-card-id="${card.id}"]`,el=>el.disabled),true);
        if(!seen.has("double-error")) {
          await actor.page.evaluate(cardId=>__lobby.sendServer({type:"BOMB77_ACTION",action:"PLAY",cardId}),card.id);
          await actor.page.waitForFunction(()=>Boolean(__lastError));assert.equal((await state(actor.page)).actionNumber,own.actionNumber);seen.add("double-error");
        }
      }
    }
    if(own.turnCardsPlayed===1) {seen.add("second-card");
      if(!seen.has("forced-turn-reconnect")) {
        await actor.page.reload({waitUntil:"domcontentloaded"});await actor.page.waitForFunction(action=>__state?.actionNumber===action,{timeout:7000},own.actionNumber);
        assert.equal((await state(actor.page)).turnCardsPlayed,1);assert.equal((await state(actor.page)).hand.length,4);seen.add("forced-turn-reconnect");
      }
      assert.match(await actor.page.$eval("#turnBanner",el=>el.textContent),/한 장 더/);}
    if(own.players.some(p=>p.swimming)) {seen.add("swimming");assert.match(await actor.page.$eval("#playerSeats",el=>el.textContent),/마지막 기회/);}
    if(own.players.some(p=>p.eliminated)) seen.add("elimination");
    const legal=own.hand.filter(c=>own.legalCardIds.includes(c.id));
    const score=c=>{
      const total=own.total+(c.kind==="number"?c.value:0);
      if(c.kind==="double"&&!seen.has("second-card"))return 10000;
      if(c.kind==="reverse"&&!seen.has("reverse"))return 9000;
      return penalty(total)?2000+total:total;
    };
    legal.sort((a,b)=>score(b)-score(a));const card=legal[0];
    if(card.kind==="reverse")seen.add("reverse");
    await play(actor.page,card,own.actionNumber);
    await host.page.waitForFunction(action=>__state.actionNumber>action,{},own.actionNumber);
    const next=await state(host.page);
    if(next.lastEvent?.penalty&&!next.lastEvent.exploded)seen.add("double-number-penalty");
    for(const p of players) {
      await p.page.waitForFunction(action=>__state.actionNumber===action,{},next.actionNumber);
      const snapshot=await state(p.page);assert.equal(snapshot.total,next.total);assert.equal(snapshot.turnPlayerId,next.turnPlayerId);
      assert.deepEqual(snapshot.players,next.players);
    }
  }
  assert.ok(steps<350,"Match must finish");
  for(const required of ["double","second-card","reverse","swimming","elimination","explosion","redeal","winner","reconnect"])assert.ok(seen.has(required),`Missing real-play coverage: ${required}`);
  await host.page.screenshot({path:path.join(output,"winner.png")});
  await host.page.click("#finishActions .primary-button");
  await host.page.waitForFunction(()=>__state.phase==="playing"&&__state.round===1);
  assert.ok((await state(host.page)).players.every(p=>p.fuses===3&&!p.eliminated));seen.add("rematch");
  const timeoutAction=(await state(host.page)).actionNumber;
  await host.page.waitForFunction(action=>__state.actionNumber>action,{timeout:29000},timeoutAction);
  assert.match((await state(host.page)).lastAction,/시간 초과 자동 선택/);seen.add("server-timeout");
  await host.page.evaluate(()=>__lobby.sendServer({type:"BOMB77_ACTION",action:"RETURN_LOBBY"}));
  for(const p of [host,players[1]]) {
    await p.page.waitForFunction(()=>__state.phase==="lobby");
    await p.page.reload({waitUntil:"domcontentloaded"});
    await p.page.waitForFunction(()=>__state?.phase==="lobby"&&Object.keys(__lobby.snapshot().players).length===3,{timeout:7000});
  }
  assert.equal(await host.page.$eval("#startBtn",el=>el.disabled),false);seen.add("lobby-reconnect");
  // An expired saved room must not trap CREATE ROOM in resume-only mode.
  await host.page.evaluate(()=>__lobby.destroy());
  await players[1].page.waitForFunction(()=>document.querySelector("#abortOverlay").checkVisibility());
  await host.page.reload({waitUntil:"domcontentloaded"});
  await host.page.waitForFunction(()=>__messages.some(m=>m.type==="ROOM_NOT_FOUND"),{timeout:7000});
  await click(host.page,"hostTab");
  await host.page.waitForFunction(()=>__lobby.connected&&__state?.phase==="lobby",{timeout:7000});
  seen.add("expired-room-create");
  assert.deepEqual(errors,[]);
  const report={ok:true,steps,coverage:[...seen],errors};fs.writeFileSync(path.join(output,"report.json"),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
 } catch(error) {
   console.error("Browser diagnostics", JSON.stringify(await Promise.all(players.map(p=>p.page.evaluate(()=>({state:window.__state,lobby:window.__lobby?.snapshot(),saved:sessionStorage.getItem("bomb77ActiveRoom"),messages:window.__messages?.slice(-6)})))),null,2));
   console.error("Page errors",errors);throw error;
 } finally {for(const p of players)await p.context.close();await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
