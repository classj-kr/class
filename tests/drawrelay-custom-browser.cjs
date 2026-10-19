"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const { spawn, spawnSync } = require("node:child_process");
const puppeteer = require("puppeteer-core");
const express = require("../game-hub-server/node_modules/express");

const root = path.resolve(__dirname, "..");
const output = path.join(root, "outputs/drawrelay-custom");
const port = 23000 + Math.floor(Math.random() * 9000);

async function capture(page, filename) {
  const png = await page.screenshot({ fullPage: true });
  const converted = spawnSync("python", ["-c",
    "import io,sys; from PIL import Image; im=Image.open(io.BytesIO(sys.stdin.buffer.read())).convert('RGB'); im.save(sys.argv[1],format='WEBP',lossless=True); out=Image.open(sys.argv[1]); out.load(); assert out.size == im.size and out.tobytes() == im.tobytes()",
    path.join(output, filename)], { input: png });
  assert.equal(converted.status, 0, converted.stderr?.toString());
}

async function main() {
  const app = express();
  app.get("/api/student/profile", (_req, res) => res.json({ profile: {} }));
  app.get("/api/home-content-access", (_req, res) => res.json({ globallyDisabledPaths: [] }));
  app.use(express.static(root));
  const httpServer = http.createServer(app);
  await new Promise(resolve => httpServer.listen(0, "127.0.0.1", resolve));
  const origin = `http://127.0.0.1:${httpServer.address().port}`;
  const backend = spawn(process.execPath, [path.join(root, "game-hub-server/server.js")], {
    cwd: path.join(root, "game-hub-server"), env: { ...process.env, PORT: String(port), NODE_ENV: "test" }, stdio: ["ignore", "pipe", "pipe"]
  });
  let browser;
  const pages = [];
  try {
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error("Server startup timeout")), 10000);
      backend.stdout.on("data", chunk => {
        if (chunk.toString().includes("listening on port")) { clearTimeout(timeout); resolve(); }
      });
      backend.once("exit", code => { clearTimeout(timeout); reject(new Error(`Server exited: ${code}`)); });
    });
    console.log("custom-browser: local server ready");
    browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
    const errors = [];
    for (const [index, name] of ["가람", "나래", "다솜", "라온"].entries()) {
      const page = await browser.newPage();
      page.setDefaultTimeout(10000);
      pages.push(page);
      page.on("pageerror", error => errors.push(error.message));
      await page.setViewport(index === 1 ? { width: 390, height: 844 } : { width: 1366, height: 900 });
      await page.evaluateOnNewDocument(name => { window.CLASS_PLAYER_NAME = name; }, name);
      await page.setRequestInterception(true);
      page.on("request", request => {
        if (request.url().includes("/assets/network/game-network.js")) {
          return request.respond({ contentType: "application/javascript", body:
            `window.ClassroomNetwork = { generateRoomCode: () => '7531', createSocket: () => new WebSocket('ws://127.0.0.1:${port}') };` });
        }
        if (!request.url().startsWith(origin) && !request.url().startsWith("data:")) return request.abort();
        return request.continue();
      });
      await page.goto(`${origin}/learning/games/drawrelay/drawrelay.html`, { waitUntil: "networkidle0" });
      console.log(`custom-browser: loaded ${name}`);
    }
    const host = pages[0];
    await host.bringToFront();
    console.log("custom-browser: creating room");
    await host.click("#hostTab");
    console.log("custom-browser: waiting for host state");
    await host.waitForFunction(() => lobby.snapshot().connected && gameState?.players.length === 1);
    console.log("custom-browser: host connected");
    const roomCode = await host.evaluate(() => lobby.snapshot().roomCode);
    for (const guest of pages.slice(1)) {
      await guest.bringToFront();
      await guest.type("#joinCode", roomCode);
      await guest.click("#joinBtn");
      await guest.waitForFunction(() => lobby.snapshot().connected && !!gameState);
    }
    await host.waitForFunction(() => gameState.players.length === 4);
    console.log("custom-browser: four players connected");
    await host.bringToFront();
    await host.select("#packSelect", "custom");
    await Promise.all(pages.map(page => page.waitForFunction(() => gameState.packId === "custom")));
    assert.equal(await host.$eval("#startBtn", button => button.disabled), true);
    assert.equal(await host.$eval("#customWordOne", input => input.disabled), true);
    assert.equal(await pages[1].$eval("#topicForm", form => form.classList.contains("hidden")), true);
    await host.type("#topicInput", "연습 주제");
    await host.click("#saveTopicBtn");
    await host.waitForFunction(() => gameState.topic === "연습 주제");
    await host.type("#customWordOne", "이전 제시어");
    await host.click("#saveWordsBtn");
    await host.waitForFunction(() => gameState.myWords.length === 1);
    await host.$eval("#topicInput", input => { input.value = "동물"; input.dispatchEvent(new Event("input", { bubbles: true })); });
    await host.click("#saveTopicBtn");
    await Promise.all(pages.map(page => page.waitForFunction(() => gameState.topic === "동물")));
    assert.equal(await host.$eval("#customWordOne", input => input.value), "");
    const words = [["고양이", "강아지"], ["호랑이"], ["기린", "코끼리"], ["토끼"]];
    for (let index = 0; index < pages.length; index += 1) {
      await pages[index].bringToFront();
      await pages[index].type("#customWordOne", words[index][0]);
      if (words[index][1]) await pages[index].type("#customWordTwo", words[index][1]);
      await pages[index].click("#saveWordsBtn");
      await pages[index].waitForFunction(count => gameState.myWords.length === count, {}, words[index].length);
    }
    await host.waitForFunction(() => !document.getElementById("startBtn").disabled);
    assert.equal(await host.$eval("#customWordOne", input => input.value), "고양이", "Other submissions must preserve the host's draft");
    for (let index = 0; index < pages.length; index += 1) {
      const visible = await pages[index].evaluate(() => document.getElementById("lobbyScreen").innerText);
      for (let other = 0; other < words.length; other += 1) {
        if (index !== other) assert.ok(!visible.includes(words[other][0]));
      }
      assert.equal(await pages[index].evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
    }
    fs.mkdirSync(output, { recursive: true });
    await host.bringToFront();
    await capture(host, "host-desktop.webp");
    await pages[1].bringToFront();
    await capture(pages[1], "participant-mobile.webp");
    await host.bringToFront();
    await host.click("#startBtn");
    await Promise.all(pages.map(page => page.waitForFunction(() => gameState.phase === "playing" && !document.getElementById("gameScreen").classList.contains("hidden"))));
    for (let index = 0; index < pages.length; index += 1) {
      const prompt = await pages[index].$eval("#textPrompt", element => element.textContent);
      assert.ok(!words[index].includes(prompt));
      assert.equal(await pages[index].evaluate(() => lobby.snapshot().started), true);
    }
    await host.evaluate(() => lobby.sendServer({ type: "DRAWRELAY_ACTION", action: "RETURN_LOBBY" }));
    await Promise.all(pages.map(page => page.waitForFunction(() => gameState.phase === "lobby" && !lobby.snapshot().started)));
    assert.equal(await host.$eval("#customWordOne", input => input.value), "");
    assert.equal(await host.$eval("#startBtn", button => button.disabled), true);
    await host.select("#packSelect", "history");
    await Promise.all(pages.map(page => page.waitForFunction(() => gameState.packId === "history")));
    assert.equal(await host.$eval("#customTopicSection", section => section.classList.contains("hidden")), true);
    await host.click("#startBtn");
    await Promise.all(pages.map(page => page.waitForFunction(() => gameState.phase === "playing")));
    const historyWords = require("../game-hub-server/drawrelay").PACKS.history.words;
    for (const page of pages) assert.ok(historyWords.includes(await page.$eval("#textPrompt", element => element.textContent)));
    assert.deepEqual(errors, []);
    console.log("drawrelay-custom-browser: topic edits, host/guest submissions, privacy, mobile layout and real 4-player start ok");
  } catch (error) {
    console.error(error);
    if (pages[0] && !pages[0].isClosed()) {
      console.error(await pages[0].evaluate(() => ({ state: typeof gameState === "undefined" ? null : gameState, lobby: typeof lobby === "undefined" ? null : lobby?.snapshot(), text: document.body.innerText })));
    }
    throw error;
  } finally {
    await browser?.close();
    backend.kill();
    httpServer.closeAllConnections();
    await new Promise(resolve => httpServer.close(resolve));
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
