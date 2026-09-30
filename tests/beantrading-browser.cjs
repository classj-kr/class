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
async function checkReadability(page, label, fitScreen = false) {
  const sizes = await page.evaluate(() => {
    const visible = s => [...document.querySelectorAll(s)].filter(e => e.getClientRects().length);
    const buttonSizes = visible('#toggleComposer, #nextBtn, .field-harvest, .card-info, .pocket-tabs button, [data-accept], [data-cancel], [data-quick-to], #quickWant')
      .map(e => ({ name: e.getAttribute('aria-label') || e.textContent.trim(), h: e.getBoundingClientRect().height, w: e.getBoundingClientRect().width }));
    const marketBox = document.querySelector('.market').getBoundingClientRect();
    const marketHeader = document.querySelector('.market .section-head').getBoundingClientRect();
    const marketCards = visible('#marketCards .bean-card').map(e => ({ top: e.getBoundingClientRect().top, bottom: e.getBoundingClientRect().bottom }));
    return { width: innerWidth, height: innerHeight, scrollWidth: document.documentElement.scrollWidth,
      marketCards, marketTop: marketHeader.bottom, marketBottom: marketBox.bottom,
      farmBottom: document.querySelector('.farm').getBoundingClientRect().bottom,
      names: visible('.card-pick > strong').map(e => parseFloat(getComputedStyle(e).fontSize)),
      values: visible('.card-value b').map(e => parseFloat(getComputedStyle(e).fontSize)), buttonSizes };
  });
  assert.ok(sizes.scrollWidth <= sizes.width + 1, `${label}: no page overflow`);
  assert.ok(sizes.names.length && sizes.names.every(n => n >= 16), `${label}: bean names >=16px`);
  assert.ok(sizes.values.every(n => n >= 18), `${label}: harvest numbers >=18px`);
  assert.ok(sizes.buttonSizes.every(b => b.h >= 44 && b.w >= 44), `${label}: touch targets ${JSON.stringify(sizes.buttonSizes.filter(b => b.h < 44 || b.w < 44))}`);
  assert.ok(sizes.marketCards.every(b => b.top >= sizes.marketTop && b.bottom <= sizes.marketBottom), `${label}: market cards stay inside the panel below its heading`);
  if (fitScreen) assert.ok(sizes.farmBottom <= sizes.height + 1, `${label}: hand and fields visible without page scrolling, bottom=${sizes.farmBottom}`);
}
async function main() {
  const browser = await chromium.launch({ headless: true, channel: "msedge" });
  try {
    const practice = await browser.newPage({ viewport: { width: 1440, height: 1000 } }); await attach(practice);
    await practice.clock.install();
    await practice.goto(url); await practice.locator("#practiceBtnMissing").click();
    await practice.locator("#gameScreen:not(.hidden)").waitFor();
    assert.equal(await practice.locator(".player").count(), 4);
    await practice.locator("#handCards .card-info").first().click();
    await practice.locator("#beanDialog[open]").waitFor();
    assert.equal(await practice.locator(".bean-prices tbody tr").count(), 4);
    assert.match(await practice.locator("#beanDetail").innerText(), /아직 없는 콩/);
    await practice.locator("#closeBean").click();
    await practice.locator("[data-plant='0']").click();
    await practice.locator("#nextBtn").click();
    await practice.locator("#stageLabel").filter({ hasText: "거래" }).waitFor();
    assert.equal(await practice.locator("#tradeComposer").isVisible(), false);
    await practice.locator("#toggleComposer").click();
    assert.equal(await practice.locator("#tradeComposer").isVisible(), true);
    await practice.locator("#toggleComposer").click();
    await practice.screenshot({ path: path.join(output, "practice-desktop.png"), fullPage: true });
    await practice.locator("#rulesBtnGame").click();
    assert.equal(await practice.locator("#rulesBtnGame").textContent(), "규칙");
    assert.equal(await practice.locator("#rulesDialog").evaluate(e => e.open), true);
    assert.equal(await practice.locator(".price-bean").count(), 8);
    await practice.locator("#closeRules").click();
    await practice.setViewportSize({ width: 390, height: 844 });
    await practice.screenshot({ path: path.join(output, "practice-mobile.png"), fullPage: true });
    assert.ok(await practice.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), "mobile page must not overflow horizontally");
    await practice.locator("#handCards").scrollIntoViewIfNeeded();
    assert.ok(await practice.locator("#handCards .bean-card").first().isVisible());
    await practice.screenshot({ path: path.join(output, "mobile-hand.png") });
    await practice.clock.runFor(60000);
    assert.ok(!/· 나/.test(await practice.locator('.player.active .player-top strong').textContent()), "new practice bots plant, trade and advance turns");
    assert.equal(await practice.locator('#gameScreen').isVisible(), true);
    await practice.close();

    const players = [];
    for (const name of ["가람", "나래", "다온", "라온", "마루"]) {
      const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, hasTouch: true });
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
    await host.setViewportSize({ width: 1366, height: 668 });
    await host.locator("#marketCards .card-pick").first().click();
    await host.locator("#quickTrade:not(.hidden)").waitFor();
    const recipientId = await host.locator("[data-quick-to]").first().getAttribute("data-quick-to");
    await checkReadability(host, "1366x668 quick trade", true);
    for (const button of await host.locator('[data-quick-to]').all()) {
      assert.ok(await button.evaluate(e => {
        const r = e.getBoundingClientRect();
        return e.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2));
      }), "quick offer targets need no scrolling");
    }
    await host.screenshot({ path: path.join(output, "quick-trade-chromebook.png"), fullPage: true });
    await host.setViewportSize({ width: 1024, height: 668 });
    await checkReadability(host, "1024x668 quick trade", true);
    await host.screenshot({ path: path.join(output, "quick-trade-ipad.png"), fullPage: true });
    await host.setViewportSize({ width: 390, height: 844 });
    await checkReadability(host, "390px quick trade");
    await host.setViewportSize({ width: 1366, height: 668 });
    // One selected card plus one recipient tap sends a consent-based gift.
    await host.locator(`[data-quick-to='${recipientId}']`).click();
    await host.locator("#quickTrade").waitFor({ state: "hidden" });
    assert.equal(await players[1].locator("#tradeComposer").isVisible(), false);
    await players[1].locator("[data-accept]").first().waitFor();
    await players[1].setViewportSize({ width: 1366, height: 668 });
    await checkReadability(players[1], "1366x668 incoming offer", true);
    const acceptSize = await players[1].locator("[data-accept]").first().boundingBox();
    assert.ok(acceptSize.height >= 48 && acceptSize.width >= 48);
    for (const selector of ['[data-accept]', '[data-cancel]']) {
      assert.ok(await players[1].locator(selector).first().evaluate(e => {
        const r = e.getBoundingClientRect(), panel = document.getElementById('offers').getBoundingClientRect();
        return r.top >= panel.top && r.bottom <= panel.bottom && e.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2));
      }), "incoming offer can be accepted or declined without scrolling");
    }
    await players[1].screenshot({ path: path.join(output, "received-offer.png"), fullPage: true });
    await players[1].locator("[data-accept]").first().click();
    await players[1].locator("#pendingTab").click();
    await players[1].locator("#pendingCards .bean-card").first().waitFor();
    // A quick swap adds only the receive-kind choice; no composer or Add step.
    const paymentId = await players[1].locator('#handCards .card-pick').last().getAttribute('data-card');
    const paymentKind = paymentId.replace(/-\d+$/, '');
    await host.locator('#marketCards .card-pick').first().click();
    await host.locator('#quickWant').selectOption(paymentKind);
    await host.locator(`[data-quick-to='${recipientId}']`).click();
    await players[1].locator('[data-accept]').first().click();
    await host.locator('#pendingCount').filter({ hasText: '1장' }).waitFor();
    await players[1].locator('#pendingCount').filter({ hasText: '2장' }).waitFor();
    // Detailed offers remain available and retain the selected give cards.
    await host.locator('#handCards .card-pick').first().click();
    await host.locator('#customTrade').click();
    assert.equal(await host.locator('#tradeComposer').isVisible(), true);
    assert.notEqual(await host.locator('#giveLabel').textContent(), '손패·공개 카드를 선택하세요');
    await host.locator('#tradeTarget').selectOption(recipientId);
    await host.locator('#wantKind').selectOption(paymentKind);
    await host.locator('#addWant').click();
    await host.locator('#offerBtn').click();
    await host.locator('#tradeComposer').waitFor({ state: 'hidden' });
    await players[1].locator('[data-cancel]').first().click();
    await host.locator('.offer').waitFor({ state: 'hidden' });
    // A server rejection must keep the draft so the user can correct it.
    for (let i = 0; i < 4; i++) {
      await host.locator('#handCards .card-pick').first().click();
      await host.locator(`[data-quick-to='${recipientId}']`).click();
      await host.locator('#quickTrade').waitFor({ state: 'hidden' });
    }
    await host.locator('#handCards .card-pick').first().click();
    await host.locator('#quickWant').selectOption(paymentKind);
    await host.locator(`[data-quick-to='${recipientId}']`).click();
    await host.locator('#toast').filter({ hasText: '기존 제안을 취소' }).waitFor();
    assert.equal(await host.locator('#quickTrade').isVisible(), true);
    assert.equal(await host.locator('#quickWant').inputValue(), paymentKind);
    assert.equal(await host.locator('#handCards .bean-card.selected').count(), 1);
    await host.locator('#toggleComposer').click();
    for (let remaining = 3; remaining >= 0; remaining--) {
      await host.locator('[data-cancel]').first().click();
      await host.waitForFunction(n => document.querySelectorAll('[data-cancel]').length === n, remaining);
    }
    await host.screenshot({ path: path.join(output, "multiplayer-desktop.png"), fullPage: true });
    await host.setViewportSize({ width: 1366, height: 768 });
    await host.screenshot({ path: path.join(output, "multiplayer-laptop.png"), fullPage: true });
    await checkReadability(host, "1366x768 Chromebook", true);
    await host.setViewportSize({ width: 1366, height: 668 });
    await checkReadability(host, "1366x668 Chromebook with browser toolbar", true);
    await host.screenshot({ path: path.join(output, "chromebook-toolbar.png"), fullPage: true });
    await host.setViewportSize({ width: 1024, height: 768 });
    await checkReadability(host, "1024x768 iPad landscape", true);
    await host.screenshot({ path: path.join(output, "ipad-landscape.png"), fullPage: true });
    await host.setViewportSize({ width: 1024, height: 668 });
    await checkReadability(host, "1024x668 iPad landscape with browser toolbar", true);
    await host.setViewportSize({ width: 820, height: 1180 });
    await host.screenshot({ path: path.join(output, "multiplayer-ipad.png"), fullPage: true });
    await checkReadability(host, "820x1180 iPad portrait");
    await host.setViewportSize({ width: 768, height: 1024 });
    await checkReadability(host, "768x1024 iPad portrait");
    await players[1].locator('#handTab').click();
    await host.locator("#nextBtn").click();
    await players[1].locator('#pendingTab[aria-selected="true"]').waitFor();
    for (const remaining of ['1장', '0장']) {
      await players[1].locator(".field-plant:not(:disabled)").first().click();
      await players[1].locator('#pendingCount').filter({ hasText: remaining }).waitFor();
    }
    await players[1].locator("#myFields .field-plant img").first().waitFor({ state: "attached" });
    assert.ok(await players[1].locator("#myFields .field-plant img").count() >= 1);
    assert.deepEqual(errors, []);
    console.log("beantrading-browser: practice, Korean rules, quick gifts/swaps, detailed offers, 390px/iPad/Chromebook layouts and 5 browser players OK");
    console.log(`Screenshots: ${output}`);
  } finally { await browser.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
