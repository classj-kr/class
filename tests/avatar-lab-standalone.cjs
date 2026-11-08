"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { chromium } = require("../game-hub-server/node_modules/playwright");
(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    const page = await browser.newPage();
    const errors = [], external = [];
    page.on("pageerror", e => errors.push(e.message));
    page.on("request", r => { if (/^https?:/.test(r.url())) external.push(r.url()); });
    await page.goto(pathToFileURL(path.resolve(__dirname, "../outputs/avatar-lab/cat-preview.html")).href);
    await page.waitForFunction(() => window.avatarPreview?.state.ready);
    assert.equal(await page.locator(".reference-art img").evaluate(i => i.complete && i.naturalWidth > 0), true);
    await page.locator("[data-motion=Walk]").click();
    await page.waitForFunction(() => avatarPreview.state.motion === "Walk" && avatarPreview.state.animationTime > .5);
    const [download] = await Promise.all([page.waitForEvent("download"), page.locator(".download").click()]);
    const model = fs.readFileSync(await download.path());
    assert.deepEqual(model, fs.readFileSync(path.resolve(__dirname, "../apps/avatar-lab/models/animal-cat.glb")));
    assert.deepEqual(errors, []); assert.deepEqual(external, []);
    console.log("PASS: standalone file opens offline, loads the original WebP and animated GLB, and downloads the identical model without HTTP requests.");
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
