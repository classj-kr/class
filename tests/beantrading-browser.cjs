"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("../game-hub-server/node_modules/playwright");
const base = process.env.BEAN_TEST_URL || "http://127.0.0.1:8936";
const url = `${base}/learning/games/beantrading/beantrading`;
const output = path.resolve(__dirname, "../tmp/beantrading");
fs.mkdirSync(output, { recursive: true });
const errors = [];
async function attach(page) {
  page.on("pageerror", error => errors.push(error.message));
  page.on("response", response => { if (response.url().includes("/beantrading/") && response.status() >= 400) errors.push(`${response.status()}: ${response.url()}`); });
}
async function main() {
  const browser = await chromium.launch({ headless: true, channel: "msedge" });
  try {
    const practice = await browser.newPage({ viewport: { width: 1440, height: 1000 } }); await attach(practice);
    await practice.goto(url); await practice.locator("#practiceBtnMissing").click();
    await practice.locator("#gameScreen:not(.hidden)").waitFor();
    assert.equal(await practice.locator(".player").count(), 4);
    await practice.locator("[data-plant='0']").click();
    await practice.locator("#nextBtn").click();
    await practice.locator("#stageLabel").filter({ hasText: "거래" }).waitFor();
    await practice.screenshot({ path: path.join(output, "practice-desktop.png"), fullPage: true });
    await practice.locator("#rulesBtnGame").click();
    assert.equal(await practice.locator("#rulesDialog").evaluate(e => e.open), true);
    assert.equal(await practice.locator(".price-bean").count(), 8);
    await practice.locator("#closeRules").click();
    await practice.setViewportSize({ width: 390, height: 844 });
    await practice.screenshot({ path: path.join(output, "practice-mobile.png"), fullPage: true });
    assert.ok(await practice.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), "mobile page must not overflow horizontally");
    await practice.locator("#handCards").scrollIntoViewIfNeeded();
    assert.ok(await practice.locator("#handCards .bean-card").first().isVisible());
    await practice.screenshot({ path: path.join(output, "mobile-hand.png") });
    await practice.close();

    const players = [];
    for (const name of ["가람", "나래", "다온", "라온", "마루"]) {
      const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
      await context.addInitScript(n => localStorage.setItem("classPlayerName", n), name);
      const page = await context.newPage(); await attach(page); await page.goto(url); players.push(page);
    }
    const host = players[0];
    await host.locator("#hostTab").click();
    await host.waitForFunction(() => /^\d{4}$/.test(document.getElementById("roomCode").textContent.trim()));
    const code = (await host.locator("#roomCode").textContent()).trim();
    for (const page of players.slice(1)) {
      await page.locator("#joinCode").fill(code); await page.locator("#joinBtn").click();
      await page.locator("#lobbyPlayers .mp-lobby-player").first().waitFor();
    }
    await host.waitForFunction(() => document.querySelectorAll("#lobbyPlayers .mp-lobby-player").length === 5);
    await host.screenshot({ path: path.join(output, "lobby.png"), fullPage: true });
    await host.locator("#startBtn").click();
    for (const page of players) await page.locator("#gameScreen:not(.hidden)").waitFor();
    assert.equal(await host.locator(".player").count(), 5);
    await host.locator("[data-plant='0']").click(); await host.locator("#nextBtn").click();
    await host.locator("#marketCards .bean-card").first().click();
    const recipientId = await host.locator("#tradeTarget option").first().getAttribute("value");
    await host.locator("#tradeTarget").selectOption(recipientId);
    await host.locator("#offerBtn").click();
    await players[1].locator("[data-accept]").first().click();
    await players[1].locator("#pendingCards .bean-card").first().waitFor();
    await host.screenshot({ path: path.join(output, "multiplayer-desktop.png"), fullPage: true });
    await host.setViewportSize({ width: 1366, height: 768 });
    await host.screenshot({ path: path.join(output, "multiplayer-laptop.png"), fullPage: true });
    const handBottom = await host.locator("#handCards").evaluate(e => e.getBoundingClientRect().bottom);
    assert.ok(handBottom <= 768, `laptop hand controls must fit on screen, got ${handBottom}`);
    await host.setViewportSize({ width: 820, height: 1180 });
    await host.screenshot({ path: path.join(output, "multiplayer-ipad.png"), fullPage: true });
    assert.ok(await host.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), "iPad page must not overflow horizontally");
    await host.locator("#nextBtn").click();
    await players[1].locator(".field-plant:not(:disabled)").first().click();
    await players[1].locator("#myFields .field-plant img").first().waitFor();
    assert.equal(await players[1].locator("#myFields .field-plant img").count(), 1);
    assert.deepEqual(errors, []);
    console.log("beantrading-browser: practice, rules, 390px and iPad layouts, 5 browser players, gifting and planting OK");
    console.log(`Screenshots: ${output}`);
  } finally { await browser.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
