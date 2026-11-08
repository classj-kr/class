"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { chromium } = require("../game-hub-server/node_modules/playwright");
const base = process.env.AVATAR_LAB_URL || "http://127.0.0.1:8765/apps/avatar-lab/";
const output = path.resolve(__dirname, "../outputs/qa/avatar-lab");
fs.mkdirSync(output, { recursive: true });
async function capture(pageOrLocator, name) {
  const png = await pageOrLocator.screenshot();
  const destination = path.join(output, name + ".webp");
  const conversion = spawnSync("python", ["-c", "from PIL import Image; import io,sys; im=Image.open(io.BytesIO(sys.stdin.buffer.read())).convert('RGB'); im.save(sys.argv[1], 'WEBP', lossless=True); result=Image.open(sys.argv[1]); result.load(); assert result.size==im.size and result.tobytes()==im.tobytes()", destination], { input: png });
  assert.equal(conversion.status, 0, conversion.stderr?.toString());
}
(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const errors = [], failed = [];
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
    page.on("pageerror", error => errors.push(error.message));
    page.on("response", response => { if (response.status() >= 400) failed.push(response.url() + " " + response.status()); });
    await page.goto(base);
    await page.waitForFunction(() => window.avatarPreview?.state.ready);
    assert.deepEqual(await page.evaluate(() => avatarPreview.state.clips), ["Idle", "Walk", "Wave"]);
    const bounds = await page.evaluate(() => avatarPreview.state.bounds);
    assert.ok(bounds.every(n => Number.isFinite(n) && n > .5), "The GLB has volume on all three axes");
    assert.equal(await page.locator(".viewer").getAttribute("aria-busy"), "false");
    await page.locator("#pause").click();
    await capture(page, "desktop");
    for (const [view, yaw] of [["front", 0], ["side", Math.PI / 2], ["back", Math.PI]]) {
      await page.locator(`[data-view=${view}]`).click();
      await page.waitForFunction(y => Math.abs(Math.cos(avatarPreview.state.camera.yaw - y) - 1) < .00001, yaw);
      await capture(page.locator(".stage"), view);
    }
    await page.locator("[data-motion=Walk]").click();
    const before = await page.evaluate(() => avatarPreview.model.getObjectByName("LeftLeg").quaternion.toArray());
    await page.waitForFunction(value => avatarPreview.model.getObjectByName("LeftLeg").quaternion.toArray().some((n, i) => Math.abs(n - value[i]) > .08), before);
    assert.equal(await page.locator("[data-motion=Walk]").getAttribute("aria-pressed"), "true");
    await page.locator("#pause").click();
    const frozen = await page.evaluate(() => avatarPreview.state.animationTime);
    await page.evaluate(() => new Promise(resolve => { let frames = 0; const check = () => ++frames >= 12 ? resolve() : requestAnimationFrame(check); requestAnimationFrame(check); }));
    assert.equal(await page.evaluate(() => avatarPreview.state.animationTime), frozen, "Pause freezes the actual animation mixer");
    await page.locator("[data-motion=Wave]").click();
    await page.waitForFunction(() => Math.abs(avatarPreview.model.getObjectByName("RightArm").quaternion.z) > .75);
    await page.locator("[data-view=front]").click();
    await page.waitForFunction(() => Math.abs(Math.cos(avatarPreview.state.camera.yaw) - 1) < .00001);
    await capture(page, "wave");
    await page.locator("[data-motion=Idle]").click();
    await page.locator("#pause").click();
    const canvas = page.locator("#stage canvas"), box = await canvas.boundingBox();
    const originalYaw = await page.evaluate(() => avatarPreview.state.camera.yaw);
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down(); await page.mouse.move(box.x + box.width / 2 + 100, box.y + box.height / 2 + 20, { steps: 8 }); await page.mouse.up();
    await page.waitForFunction(y => Math.abs(avatarPreview.state.camera.yaw - y) > .5, originalYaw);
    const originalRadius = await page.evaluate(() => avatarPreview.state.camera.radius);
    await page.mouse.wheel(0, 220);
    await page.waitForFunction(r => avatarPreview.state.camera.radius > r + .4, originalRadius);
    await canvas.focus(); await page.keyboard.press("ArrowRight");
    await page.locator("#rotate").click();
    assert.equal(await page.evaluate(() => avatarPreview.state.autoRotate), true);
    await page.locator("[data-view=front]").click();
    assert.equal(await page.evaluate(() => avatarPreview.state.autoRotate), false);
    const [download] = await Promise.all([page.waitForEvent("download"), page.locator(".download").click()]);
    assert.equal(download.suggestedFilename(), "classj-animal-cat.glb");
    const downloaded = await download.path();
    assert.equal(fs.readFileSync(downloaded).readUInt32LE(0), 0x46546c67);
    for (const [name, width, height] of [["tablet", 820, 1180], ["mobile", 390, 844]]) {
      await page.setViewportSize({ width, height });
      await page.waitForFunction(() => document.querySelector("#stage canvas").width > 0);
      const layout = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth, canvas: document.querySelector("#stage canvas").getBoundingClientRect().width, overflowing: [...document.querySelectorAll("button")].some(b => { const r = b.getBoundingClientRect(); return r.x < 0 || r.right > innerWidth; }) }));
      assert.ok(layout.scroll <= layout.width && !layout.overflowing && layout.canvas > 250, JSON.stringify(layout));
      await capture(page, name);
    }
    const reduced = await browser.newPage({ reducedMotion: "reduce", viewport: { width: 390, height: 844 } });
    await reduced.goto(base); await reduced.waitForFunction(() => window.avatarPreview?.state.ready);
    assert.equal(await reduced.evaluate(() => avatarPreview.state.paused), true);
    await reduced.locator("[data-motion=Walk]").click();
    assert.equal(await reduced.evaluate(() => avatarPreview.state.paused), false);
    const broken = await browser.newPage();
    await broken.route("**/models/animal-cat.glb", route => route.abort());
    await broken.goto(base); await broken.getByText("다시 열기", { exact: true }).waitFor();
    assert.equal(await broken.locator("[data-motion=Walk]").isDisabled(), true);
    assert.deepEqual(errors, []); assert.deepEqual(failed, []);
    console.log("PASS: GLB loading and download; 3 camera presets; walking and waving; pause/resume; drag, zoom and keyboard; auto rotation; tablet/mobile layouts; reduced motion; model-load failure. Captures: " + output);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
