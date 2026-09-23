"use strict";

// Run against a local, real game-hub-server (no mocked sockets or game states).
// ROOM_TEST_ORIGIN=http://127.0.0.1:10000 node tests/multiplayer-lobby-browser.cjs
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const puppeteer = require("puppeteer-core");

const root = path.resolve(__dirname, "..");
const origin = process.env.ROOM_TEST_ORIGIN || "http://127.0.0.1:10000";
assert.ok(["127.0.0.1", "localhost"].includes(new URL(origin).hostname), "Use a local test server.");
const output = path.join(root, "outputs", "multiplayer-lobby-check");
fs.mkdirSync(output, { recursive: true });
const games = fs.readdirSync(path.join(root, "learning/games"), { withFileTypes: true })
  .filter(entry => entry.isDirectory() && !entry.name.startsWith("_"))
  .map(entry => ({ game: entry.name, file: path.join(root, "learning/games", entry.name, entry.name + ".html") }))
  .filter(({ game, file }) => fs.existsSync(file) && fs.readFileSync(file, "utf8").includes("multiplayer-lobby.js") &&
    (!process.env.ROOM_TEST_GAMES || process.env.ROOM_TEST_GAMES.split(",").includes(game)));

async function openPlayer(browser, game, name, errors) {
  const context = await browser.createBrowserContext();
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  await page.setViewport({ width: 1366, height: 768 });
  page.on("pageerror", error => errors.push(name + ": " + error.message));
  // Observe the actual instance while preserving its implementation and options.
  await page.evaluateOnNewDocument(name => {
    if (!["http:", "https:"].includes(location.protocol)) return;
    localStorage.setItem("classPlayerName", name);
    let api;
    Object.defineProperty(window, "ClassroomMultiplayerLobby", {
      configurable: true,
      get: () => api,
      set: value => {
        api = { ...value, create: options => {
          const handler = options.onServerMessage;
          const instance = value.create({ ...options, onServerMessage: message => {
            if (message.state) window.__roomTestState = message.state;
            handler?.(message);
          } });
          window.__roomTestLobby = instance;
          return instance;
        } };
      }
    });
  }, name);
  await page.goto(`${origin}/learning/games/${game}/${game}`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => window.__roomTestLobby?.mounted, { timeout: 10000 });
  return { page, context };
}

async function clickControl(page, name) {
  const id = await page.evaluate(name => window.__roomTestLobby.ids[name], name);
  await page.waitForSelector("#" + id, { visible: true, timeout: 5000 });
  await page.click("#" + id);
}

async function roomCodeMetrics(page) {
  return page.evaluate(() => {
    const lobby = window.__roomTestLobby;
    const candidates = [...document.querySelectorAll('[id*="roomCode" i], [id*="room-code" i]')]
      .filter(element => !element.matches("input"));
    const element = candidates.find(element => element.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }))
      || lobby.elements.roomCode;
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    const visible = element.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true });
    return {
      value: element.textContent.trim(), expected: lobby.snapshot().roomCode,
      visible, inViewport: visible && rect.width > 0 && rect.height > 0 && rect.left >= 0 &&
        rect.top >= 0 && rect.right <= innerWidth + 1 && rect.bottom <= innerHeight + 1,
      hidden: element.hidden, display: style.display,
      width: innerWidth, height: innerHeight
    };
  });
}

async function joinPlayer(browser, game, name, code, errors, players) {
  const guest = await openPlayer(browser, game, name, errors);
  players.push(guest);
  await clickControl(guest.page, "joinTab");
  const joinId = await guest.page.evaluate(() => window.__roomTestLobby.ids.joinCode);
  await guest.page.type("#" + joinId, code);
  await clickControl(guest.page, "joinButton");
  await guest.page.waitForFunction(() => window.__roomTestLobby.connected, { timeout: 10000 });
  assert.equal(await guest.page.evaluate(() => window.__roomTestLobby.snapshot().roomCode), code);
  return guest;
}

async function checkSharedScreenLifecycle(browser, game, code, result, players) {
  const minimum = { avalon: 5, codenames: 4, dobble: 2 }[game];
  if (!minimum) return;
  const host = players[0];
  result.step = "copy room code";
  await host.context.overridePermissions(origin, ["clipboard-read", "clipboard-write", "clipboard-sanitized-write"]);
  await host.page.bringToFront();
  await clickControl(host.page, "copyButton");
  await host.page.waitForFunction(async code => (await navigator.clipboard.readText()) === code, {}, code);
  result.copied = true;
  result.step = "fill minimum players";
  for (const name of ["검증다람", "검증라온", "검증마루"].slice(0, minimum - 2)) {
    await joinPlayer(browser, game, name, code, result.errors, players);
  }
  await host.page.waitForFunction(count => window.__roomTestState?.players.length === count, {}, minimum);
  for (const { page } of players) {
    const metric = await roomCodeMetrics(page);
    assert.ok(metric.visible && metric.value === code, "Host and guests must see the same waiting-room code");
  }
  if (game === "codenames") {
    for (const [i, role] of ["red-spymaster", "red-operative", "blue-spymaster", "blue-operative"].entries()) {
      await players[i].page.click("#pick-" + role);
    }
  }
  result.step = "start game";
  const start = game === "avalon" ? "#start" : "#beginGameBtn";
  await host.page.waitForSelector(start + ":not(:disabled)", { visible: true });
  await host.page.click(start);
  for (const { page } of players) {
    await page.waitForFunction(() => window.__roomTestState?.phase !== "lobby" && document.getElementById("roomShare").hidden);
    assert.equal((await roomCodeMetrics(page)).visible, false, "Room sharing should be hidden during play");
  }
  result.started = true;
  // A real departure triggers the server's existing return-to-lobby rule.
  result.step = "return to lobby";
  await players.at(-1).page.goto("about:blank");
  for (const { page } of players.slice(0, -1)) {
    await page.waitForFunction(() => window.__roomTestState?.phase === "lobby", { timeout: 10000 });
    const metric = await roomCodeMetrics(page);
    assert.ok(metric.visible && metric.value === code, "Returning to the lobby must restore the same room code");
  }
  result.returnedToLobby = true;
  delete result.step;
}

async function main() {
  const health = await fetch(origin + "/health");
  assert.ok(health.ok, "Start the local game-hub-server first.");
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true
  });
  const results = [];
  try {
    for (const { game } of games) {
      const result = { game, errors: [], checks: [], joined: false };
      const players = [];
      try {
        const host = await openPlayer(browser, game, "검증방장", result.errors);
        players.push(host);
        await clickControl(host.page, "hostTab");
        await host.page.waitForFunction(() => window.__roomTestLobby.connected, { timeout: 10000 });
        const code = await host.page.evaluate(() => window.__roomTestLobby.snapshot().roomCode);
        assert.match(code, /^\d{4}$/);
        for (const [width, height] of [[1366, 768], [768, 1024], [390, 844]]) {
          await host.page.setViewport({ width, height });
          const metric = await roomCodeMetrics(host.page);
          if (game === "avalon") {
            metric.lobbyUsesFullWidth = await host.page.evaluate(() => {
              const setup = document.getElementById("lobby").getBoundingClientRect();
              const game = document.getElementById("game").getBoundingClientRect();
              return setup.width >= game.width - 2 && setup.left >= 0 && setup.right <= innerWidth;
            });
            assert.ok(metric.lobbyUsesFullWidth, "The waiting room must not reserve a column for a hidden identity card");
          }
          result.checks.push(metric);
          await host.page.screenshot({ path: path.join(output, `${game}-host-${width}.png`) });
        }
        await joinPlayer(browser, game, "검증참가", code, result.errors, players);
        await host.page.waitForFunction(() => Object.keys(window.__roomTestLobby.players).length === 2, { timeout: 10000 });
        result.joined = true;
        result.checks.push({ afterJoin: true, ...await roomCodeMetrics(host.page) });
        assert.ok(result.checks.every(check => check.visible && check.inViewport && check.value === code),
          "The confirmed room code must be readable in the host lobby at every viewport and after joining.");
        await checkSharedScreenLifecycle(browser, game, code, result, players);
        assert.deepEqual(result.errors, [], "Unexpected browser runtime error");
      } catch (error) {
        result.failure = error.message;
        result.stack = error.stack;
        if (players[0]) {
          result.diagnostics = await players[0].page.evaluate(async () => ({
            clipboard: await navigator.clipboard.readText().catch(error => error.message),
            notices: [...document.querySelectorAll("#notice, #toast")].map(element => element.textContent),
            phase: window.__roomTestState?.phase
          })).catch(() => null);
        }
      } finally {
        for (const { page, context } of players.reverse()) {
          await page.evaluate(() => window.__roomTestLobby?.destroy()).catch(() => {});
          await context.close();
        }
      }
      results.push(result);
      console.log(`${game}: ${result.failure ? "FAIL " + result.failure : "PASS create / visible code / join"}`);
    }
  } finally {
    await browser.close();
  }
  fs.writeFileSync(path.join(output, "report.json"), JSON.stringify({
    generatedAt: new Date().toISOString(), origin,
    coverage: "Real local server, browser host creation and guest joining, three host viewport sizes. Avalon, Codenames and Dobble also verify clipboard, minimum players, start and return to lobby after a departure. No physical-device or production validation.",
    results
  }, null, 2));
  console.log(`${results.filter(result => !result.failure).length}/${results.length} games passed`);
  if (results.some(result => result.failure)) process.exitCode = 1;
}

main().catch(error => { console.error(error); process.exitCode = 1; });
