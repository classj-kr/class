"use strict";

// Render the real lobby with local player fixtures; no live rooms are created.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const puppeteer = require("puppeteer-core");
const express = require("../game-hub-server/node_modules/express");

const root = path.resolve(__dirname, "..");
const output = path.join(root, "outputs/drawrelay-viewport");

async function main() {
  fs.mkdirSync(output, { recursive: true });
  const app = express();
  app.get("/api/student/profile", (_req, res) => res.json({ profile: {} }));
  app.get("/api/home-content-access", (_req, res) => res.json({ globallyDisabledPaths: [] }));
  app.use(express.static(root));
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe",
      headless: true
    });
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.evaluateOnNewDocument(() => localStorage.setItem("classPlayerName", "화면검증"));
    await page.setViewport({ width: 1366, height: 768 });
    const origin = `http://127.0.0.1:${server.address().port}`;
    await page.goto(`${origin}/learning/games/drawrelay/drawrelay.html`, { waitUntil: "networkidle0" });
    // The production server injects this navigation into game pages.
    await page.addScriptTag({ url: `${origin}/assets/site-back-navigation.js` });

    const results = [];
    for (const count of [1, 4, 8]) {
      await page.evaluate(count => {
        lobby.setMode("host");
        lobby.connected = true;
        lobby.role = "host";
        lobby.myId = "1";
        lobby.players = Object.fromEntries(Array.from({ length: count }, (_, i) =>
          [String(i + 1), { name: ["화면검증", "김가나다라마", "이그림", "박릴레이", "정참가", "최친구", "한교실", "윤학생"][i] }]));
        // A transport presence lets the existing renderer enable Start at 4+ players.
        lobby.socket = { close() {}, send() {} };
        lobby.elements.roomCode.textContent = "6798";
        lobby.elements.hostStatus.textContent = "참가자를 기다리는 중입니다.";
        lobby.render();
      }, count);
      for (const [width, height] of [[1389, 856], [1440, 900], [1366, 801], [1366, 800], [1366, 768], [1366, 600], [1280, 720], [1024, 600], [911, 512], [768, 1024], [390, 844]]) {
        await page.setViewport({ width, height });
        await page.evaluate(() => window.scrollTo(0, 0));
        const before = await page.evaluate(() => {
          const button = document.getElementById("startBtn");
          const rect = button.getBoundingClientRect();
          const title = document.querySelector("#lobbyScreen .mp-ui-title").getBoundingClientRect();
          return { bottom: rect.bottom, height: rect.height, disabled: button.disabled,
            titleHeight: title.height, pageHeight: document.documentElement.scrollHeight,
            horizontalOverflow: document.documentElement.scrollWidth > innerWidth + 1 };
        });
        assert.equal(before.disabled, count < 4, "Start availability must still follow the player count");
        assert.equal(before.horizontalOverflow, false, `${width}x${height}: horizontal overflow`);
        assert.ok(before.height >= 44, "Start must retain a usable touch target");
        assert.ok(before.titleHeight <= 70, `${width}x${height}: lobby title must remain compact`);
        if (height >= 768) {
          assert.ok(before.bottom <= height, `${width}x${height}: Start should fit without scrolling`);
          assert.ok(before.pageHeight <= height + 1, `${count} players at ${width}x${height}: unnecessary page scrolling ${JSON.stringify(before)}`);
        }
        if (before.bottom > height) {
          // Wheel input catches overflow:hidden; scrollIntoView would mask the original bug.
          await page.mouse.move(width / 2, height / 2);
          await page.mouse.wheel({ deltaY: 2000 });
        }
        await page.waitForFunction(() => {
          const button = document.getElementById("startBtn"), r = button.getBoundingClientRect();
          return r.top >= 0 && r.bottom <= innerHeight &&
            button.contains(document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2));
        }, { timeout: 2000 }).catch(async () => {
          await page.screenshot({ path: path.join(output, "failure.png") });
          throw new Error(`${count} players at ${width}x${height}: Start cannot be reached with normal scrolling`);
        });
        results.push({ count, width, height, visibleWithoutScrolling: before.bottom <= height });
        if (count === 8) await page.screenshot({ path: path.join(output, `lobby-${width}x${height}.png`) });
      }
    }
    assert.deepEqual(errors, [], "Unexpected browser errors");
    fs.writeFileSync(path.join(output, "report.json"), JSON.stringify(results, null, 2));
    console.log(`drawrelay-viewport: ${results.length} lobby checks passed`);
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
