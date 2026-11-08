const test = require("node:test"),
  assert = require("node:assert/strict"),
  fs = require("node:fs"),
  path = require("node:path");
const { spawnSync } = require("node:child_process");
const { chromium } = require("../game-hub-server/node_modules/playwright");
const { startHarness } = require("./site-storage-harness.cjs");
const root = "/learning/literacy-numeracy/math-tools/",
  names = [
    "number-line",
    "clock",
    "geometry-tools",
    "pattern-blocks",
    "area-lab",
    "solid-nets",
    "measure-lab",
    "data-graphs",
    "probability",
  ];
const namespace = (n) =>
  ({ clock: "model-clock", probability: "probability-lab" })[n] || n;
let h, browser, context, page, errors;
const ready = (p) =>
  p.waitForFunction(() =>
    /계정에 자동 저장|이 탭에서 사용 중/.test(
      document.getElementById("save-status").textContent,
    ),
  );
const saved = () =>
  page.waitForFunction(
    () =>
      document.getElementById("save-status").textContent ===
      "계정에 자동 저장됨",
  );
const state = async (n) => (await h.items(namespace(n))).board;
const open = async (n) => {
  await page.goto(h.base + root + n + "/");
  await ready(page);
};
const change = async (id, value) => {
  await page.locator("#" + id).fill(String(value));
  await page.locator("#" + id).dispatchEvent("change");
};
const range = async (id, value) =>
  page.locator("#" + id).evaluate((el, value) => {
    el.value = value;
    el.dispatchEvent(new Event("input", { bubbles: true }));
  }, String(value));
const xy = (p, x, y) =>
  p.locator("#stage").evaluate(
    (el, [x, y]) => {
      const q = new DOMPoint(x, y).matrixTransform(el.getScreenCTM());
      return { x: q.x, y: q.y };
    },
    [x, y],
  );
const drag = async (x, y, tx, ty) => {
  const a = await xy(page, x, y),
    b = await xy(page, tx, ty);
  await page.mouse.move(a.x, a.y);
  await page.mouse.down();
  await page.mouse.move(b.x, b.y, { steps: 12 });
  await page.mouse.up();
};
async function shot(p, name) {
  const out = path.resolve(__dirname, "../outputs/math-tools");
  fs.mkdirSync(out, { recursive: true });
  const code =
    "import io,sys;from PIL import Image;im=Image.open(io.BytesIO(sys.stdin.buffer.read())).convert('RGBA');im.save(sys.argv[1],format='WEBP',lossless=True,exact=True);out=Image.open(sys.argv[1]).convert('RGBA');assert im.size==out.size and im.tobytes()==out.tobytes()";
  const r = spawnSync("python", ["-c", code, path.join(out, name + ".webp")], {
    input: await p.screenshot({ fullPage: true }),
  });
  assert.equal(r.status, 0, String(r.stderr));
}
test.before(async () => {
  h = await startHarness({
    me: (u) => ({
      signedIn: true,
      user: { id: u.id, name: "검수교사", role: "teacher" },
    }),
    extraRoutes(app) {
      app.get("/api/site/access", (_, r) => r.json({ mode: "open" }));
      app.get("/api/teacher/profile", (_, r) =>
        r.json({
          profiles: [
            {
              name: "검수교사",
              schoolName: "검수학교",
              teacherType: "담임",
              grade: 3,
              classNumber: 1,
            },
          ],
        }),
      );
      app.get("/api/home-content-access", (_, r) =>
        r.json({
          mode: "open",
          enabledPaths: [],
          globallyDisabledPaths: [],
          hasClassAccess: false,
          canManage: false,
          canManageGlobally: false,
        }),
      );
    },
  });
  browser = await chromium.launch({
    headless: true,
    ...(process.platform === "win32" ? { channel: "msedge" } : {}),
  });
});
test.beforeEach(async () => {
  await h.db.query("DELETE FROM user_storage");
  context = await browser.newContext({
    viewport: { width: 1366, height: 900 },
  });
  await context.addCookies([{ name: "test_user", value: "1", url: h.base }]);
  page = await context.newPage();
  errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
});
test.afterEach(async () => {
  try {
    assert.deepEqual(errors, []);
  } finally {
    await context.close();
  }
});
test.after(async () => {
  await browser?.close();
  await h?.close();
});

test("rational number-line positions, repeated jumps, drag, undo and invalid input", async () => {
  await open("number-line");
  await page.locator("#mode").selectOption("fraction");
  await page.locator("#denominator").selectOption("4");
  await change("a", "1/4");
  await change("b", "3/4");
  await page.locator("#jump").click();
  await page.locator("#repeat").click();
  await saved();
  let s = await state("number-line");
  assert.equal(s.a, 3);
  assert.equal(s.b, 5);
  assert.equal(s.jumps.length, 2);
  await change("a", "1/3");
  assert.equal(await page.locator("#a").inputValue(), "3/4");
  assert.match(await page.locator("#notice").textContent(), /눈금/);
  await drag(70 + (860 * 0.75) / 3, 320, 70 + (860 * 1.5) / 3, 320);
  await saved();
  assert.equal((await state("number-line")).a, 6);
  await page.locator("#undo").click();
  await saved();
  assert.equal((await state("number-line")).a, 3);
  await page.locator("#notice").waitFor({ state: "hidden" });
  await shot(page, "number-line");
});
test("linked clock hands, elapsed time, midnight and canceling playback", async () => {
  await open("clock");
  await change("hour", 23);
  await change("minute", 55);
  await page.locator("#time-form button").click();
  await page.locator("#mark").click();
  await page.locator("#forward-five").click();
  assert.equal(await page.locator("#digital").textContent(), "오전 12:00");
  assert.match(await page.locator("#elapsed").textContent(), /5분/);
  await drag(350, 88, 557, 295);
  assert.equal(await page.locator("#digital").textContent(), "오전 12:15");
  await page.locator("#run").click();
  await page.waitForTimeout(120);
  await page.keyboard.press("Escape");
  assert.equal(await page.locator("#run").textContent(), "움직이기");
  await saved();
  const before = await state("clock");
  await page.waitForTimeout(120);
  assert.deepEqual(await state("clock"), before);
  await shot(page, "clock");
  await page.locator("#seconds-hand").click();
  assert.equal(await page.locator("#second-label").isVisible(), true);
  await page.locator("#digital-toggle").click();
  assert.equal(await page.locator("#time-form").isVisible(), false);
  assert.equal(await page.locator("#digital").textContent(), "");
});

test("fractions use fraction bars and dense number lines retain every subdivision", async () => {
  await open("number-line");
  await page.locator("#mode").selectOption("fraction");
  assert.equal(await page.locator('#stage .tick-label[aria-label="2/4"]').count(), 1);
  assert.ok(await page.locator("#result .fraction").count() >= 2);
  await page.locator("#denominator").selectOption("12");
  await page.locator("#range").selectOption("0,20");
  const ticks = await page.locator('#stage > line[y1="308"], #stage > line[y1="313"]').count();
  assert.equal(ticks, 241);
  assert.equal(await page.locator('#stage .tick-label[aria-label="20"]').count(), 1);
  await page.locator("#range").selectOption("-1,1");
  await change("a", "-1/12");
  assert.ok(await page.locator("#result .fraction").count() >= 1);
  await change("a", "");
  assert.equal(await page.locator("#a").inputValue(), "-1/12");
});

test("changing controls during an animation retains the new choice and supports undo", async () => {
  await open("area-lab");
  await page.locator("#transform").click();
  await page.waitForTimeout(100);
  await page.locator("#shape").selectOption("triangle");
  await saved();
  assert.equal((await state("area-lab")).shape, "triangle");
  assert.equal(await page.locator("#progress").inputValue(), "0");
  await page.locator("#transform").click();
  await page.waitForTimeout(100);
  await range("progress", 65);
  await saved();
  assert.equal((await state("area-lab")).progress, .65);
  await page.locator("#undo").click();
  await saved();
  assert.notEqual((await state("area-lab")).progress, .65);
  await open("solid-nets");
  await page.locator("#unfold").click();
  await page.waitForTimeout(100);
  await page.locator("#shape").selectOption("cylinder");
  await saved();
  assert.equal((await state("solid-nets")).shape, "cylinder");
  assert.equal((await state("solid-nets")).fold, 1);
  await open("measure-lab");
  await page.locator("#mode").selectOption("volume");
  await page.locator("#pour-right").click();
  await page.waitForTimeout(100);
  await page.locator("#mode").selectOption("mass");
  await saved();
  const s = await state("measure-lab");
  assert.equal(s.mode, "mass");
  assert.equal(s.water[0] + s.water[1], 2000);
});

test("protractor handles clamp at both semicircle boundaries without jumping across", async () => {
  await open("geometry-tools");
  await page.locator("#show").click();
  await change("angle", 10);
  await drag(430+260*Math.cos(Math.PI/18), 340-260*Math.sin(Math.PI/18), 690, 355);
  await saved();
  assert.equal((await state("geometry-tools")).angle, 0);
  await change("angle", 170);
  await drag(430+260*Math.cos(17*Math.PI/18), 340-260*Math.sin(17*Math.PI/18), 170, 355);
  await saved();
  assert.equal((await state("geometry-tools")).angle, 180);
});

test("reset keeps the chosen activity and preserves work in other scenes", async () => {
  await open("pattern-blocks");
  await page.locator('[data-shape="hexagon"]').click();
  await page.locator("#mode").selectOption("tangram");
  await page.locator("#selection").selectOption({index:1});
  await page.locator("#right").click();
  await page.locator("#reset").click();
  await saved();
  const p = await state("pattern-blocks");
  assert.equal(p.mode,"tangram");
  assert.equal(p.scenes.pattern.length,1);
  assert.equal(p.scenes.tangram.length,7);
  assert.equal(p.scenes.tangram[0].angle,0);
  assert.equal(await page.locator("#remove").isVisible(),false);
  await open("data-graphs");
  await page.locator('[aria-label="항목 1 값"]').fill("12");
  await page.locator('[aria-label="항목 1 값"]').dispatchEvent("change");
  await page.locator("#mode").selectOption("line");
  assert.doesNotMatch(await page.locator("#summary").textContent(),/전체/);
  await page.locator("#reset").click();
  await saved();
  assert.equal((await state("data-graphs")).mode,"line");
  assert.equal((await state("data-graphs")).categories.rows[0].value,12);
});

test("spinner pointer agrees with the saved result after switching tools and reloading", async () => {
  await open("probability");
  await page.locator("#mode").selectOption("spinner");
  await page.locator("#ten").click();
  await page.waitForFunction(() => document.getElementById("total").textContent.startsWith("10번"));
  await saved();
  const transform = await page.locator("#stage > g").getAttribute("transform");
  await page.locator("#mode").selectOption("dice");
  await page.locator("#mode").selectOption("spinner");
  assert.equal(await page.locator("#stage > g").getAttribute("transform"),transform);
  await saved();
  await page.reload(); await ready(page);
  assert.equal(await page.locator("#stage > g").getAttribute("transform"),transform);
  await page.locator("#theory").click();
  assert.equal(await page.locator("#frequency .fraction").count(),4);
});
test("protractor and ruler measure actual model geometry and reject invalid ranges", async () => {
  await open("geometry-tools");
  await page.locator("#show").click();
  await change("angle", 90);
  assert.equal(await page.locator("#measurement").textContent(), "90°");
  await change("angle", 181);
  assert.equal(await page.locator("#angle").inputValue(), "90");
  await page.locator("#mode").selectOption("ruler");
  await change("length", 100);
  assert.equal(
    await page.locator("#measurement").textContent(),
    "10 cm = 100 mm",
  );
  await range("tool-angle", 45);
  await page.locator("#align").click();
  assert.equal(await page.locator("#rotation").textContent(), "0°");
  await shot(page, "ruler");
  await page.locator("#mode").selectOption("angle");
  await shot(page, "protractor");
});
test("pattern construction supports drag, reflection, undo and exactly seven tangram pieces", async () => {
  await open("pattern-blocks");
  await page.locator('[data-shape="hexagon"]').click();
  await saved();
  const a = (await state("pattern-blocks")).scenes.pattern.at(-1);
  await drag(a.x, a.y, a.x + 150, a.y + 80);
  await page.locator("#mirror").click();
  await saved();
  let s = await state("pattern-blocks");
  assert.equal(s.scenes.pattern.length, 2);
  assert.equal(Math.round(s.scenes.pattern[0].x + s.scenes.pattern[1].x), 1000);
  await page.locator("#axis").click();
  await shot(page, "pattern-blocks");
  await page.locator("#mode").selectOption("tangram");
  await page.locator("#selection").selectOption({ index: 1 });
  assert.equal(await page.locator("#copy").isDisabled(), true);
  await page.locator("#right").click();
  await saved();
  assert.equal((await state("pattern-blocks")).scenes.tangram.length, 7);
  await shot(page, "tangram");
});
test("area rearrangements animate through intermediate geometry and maintain formulas", async () => {
  await open("area-lab");
  await page.locator("#values").click();
  await page.locator("#transform").click();
  await page.waitForTimeout(350);
  const progress = Number(await page.locator("#progress").inputValue());
  assert.ok(progress > 0 && progress < 100);
  await page.waitForFunction(
    () => document.getElementById("progress").value === "100",
  );
  assert.equal(await page.locator("#formula").textContent(), "6 × 4 = 24");
  await shot(page, "area-parallelogram");
  for (const shape of ["triangle", "trapezoid", "rhombus", "circle"]) {
    await page.locator("#shape").selectOption(shape);
    await range("progress", 100);
    await shot(page, "area-" + shape);
    assert.equal((await page.locator("#stage path").count()) > 0, true);
  }
  await page.locator("#shape").selectOption("triangle");
  await range("offset", -3);
  assert.equal(await page.locator("#formula").textContent(), "6 × 4 ÷ 2 = 12");
});
test("solids fold continuously, all cube nets render, round shapes and orbit remain usable", async () => {
  await open("solid-nets");
  await page.locator("#unfold").click();
  await page.waitForTimeout(300);
  assert.ok(
    Number(await page.locator("#fold").inputValue()) > 0 &&
      Number(await page.locator("#fold").inputValue()) < 100,
  );
  await page.waitForFunction(
    () => document.getElementById("fold").value === "100",
  );
  for (let i = 0; i < 11; i++) {
    await page.locator("#net").selectOption(String(i));
    assert.equal(await page.locator("#stage path").count(), 6);
  }
  await shot(page, "cube-net");
  await page.locator("#shape").selectOption("prism6");
  await range("fold", 100);
  await shot(page, "prism-net");
  await page.locator("#shape").selectOption("cylinder");
  await range("fold", 100);
  await shot(page, "cylinder-net");
  await range("fold", 0);
  await shot(page, "cylinder");
  await drag(350, 285, 420, 305);
  await saved();
  assert.notEqual((await state("solid-nets")).yaw, -0.65);
  await page.locator("#shape").selectOption("sphere");
  assert.equal(await page.locator("#fold-controls").isVisible(), false);
  await shot(page, "sphere");
});
test("balance and water transfers preserve quantities, including interrupted animation", async () => {
  await open("measure-lab");
  await page.locator('[data-weight="0"]').click();
  await saved();
  assert.equal((await state("measure-lab")).left[0], 3);
  await page.waitForFunction(() => {
    const beam = document.querySelector('#stage line[stroke-width="14"]');
    const angle = Number(beam?.getAttribute("transform")?.match(/rotate\(([^ ]+)/)?.[1]);
    return Math.abs(angle + 0.96) < 0.00001;
  });
  await shot(page, "balance");
  await page.locator("#mode").selectOption("volume");
  await page.locator("#pour-right").click();
  await page.waitForTimeout(150);
  await page.locator("#values").click();
  await saved();
  let s = await state("measure-lab");
  assert.equal(s.water[0] + s.water[1], 2000);
  assert.ok(s.water.every(Number.isInteger));
  await page.locator("#values").click();
  await page.locator("#pour-right").click();
  await page.waitForTimeout(1000);
  await saved();
  s = await state("measure-lab");
  assert.equal(s.water[0] + s.water[1], 2000);
  await page.locator("#capacity").selectOption("1000");
  assert.equal(await page.locator("#capacity").inputValue(), "2000");
  await shot(page, "water");
});
test("editable data feed all five graphs, zero totals are valid and text is escaped", async () => {
  await open("data-graphs");
  await page.locator('[aria-label="항목 1 값"]').fill("12");
  await page.locator('[aria-label="항목 1 값"]').dispatchEvent("change");
  await page.locator("#mean").click();
  assert.match(await page.locator("#summary").textContent(), /전체 28/);
  await shot(page, "graph-bar");
  for (const mode of ["line", "picture", "strip", "pie"]) {
    await page.locator("#mode").selectOption(mode);
    await shot(page, "graph-" + mode);
  }
  await page.locator('[aria-label="항목 1 이름"]').fill("<svg onload=x>");
  await page.locator('[aria-label="항목 1 이름"]').dispatchEvent("change");
  assert.equal(await page.locator("#legend svg").count(), 0);
  for (let i = 1; i <= 4; i++) {
    await page.locator(`[aria-label="항목 ${i} 값"]`).fill("0");
    await page.locator(`[aria-label="항목 ${i} 값"]`).dispatchEvent("change");
  }
  assert.match(await page.locator("#summary").textContent(), /전체 0/);
  assert.doesNotMatch(
    await page.locator("#legend").textContent(),
    /NaN|Infinity/,
  );
});
test("random experiments accumulate exactly, cancellation unlocks and spinner configuration resets counts", async () => {
  await open("probability");
  await page.locator("#hundred").click();
  assert.equal(await page.locator("#mode").isDisabled(), true);
  await page.waitForFunction(() =>
    document.getElementById("total").textContent.startsWith("100번"),
  );
  await saved();
  let s = await state("probability");
  assert.equal(
    s.scenes.coin.counts.reduce((a, b) => a + b),
    100,
  );
  await page.locator("#mode").selectOption("spinner");
  await change("weight-0", 3);
  await page.locator("#ten").click();
  await page.waitForFunction(() =>
    document.getElementById("total").textContent.startsWith("10번"),
  );
  await shot(page, "probability");
  await change("weight-1", 2);
  assert.match(await page.locator("#total").textContent(), /^0번/);
  await page.locator("#once").click();
  await page.keyboard.press("Escape");
  assert.equal(await page.locator("#once").isDisabled(), false);
  await page.locator("#once").click();
  await page.waitForFunction(() =>
    document.getElementById("total").textContent.startsWith("1번"),
  );
});
test("all new tools restore account state and fit phone widths with shared settings", async () => {
  for (const name of names) {
    await open(name);
    const toggle = {
      "number-line": "labels",
      clock: "minutes",
      "geometry-tools": "show",
      "pattern-blocks": "axis",
      "area-lab": "values",
      "solid-nets": "details",
      "measure-lab": "values",
      "data-graphs": "values",
      probability: "theory",
    }[name];
    await page.locator("#" + toggle).click();
    await saved();
    const before = await state(name);
    const pressed = await page.locator("#" + toggle).getAttribute("aria-pressed");
    await page.reload();
    await ready(page);
    assert.deepEqual(await state(name), before);
    assert.equal(await page.locator("#" + toggle).getAttribute("aria-pressed"), pressed);
    assert.equal(await page.locator("site-back-navigation").count(), 1);
  }
  const phone = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const p = await phone.newPage();
  p.on("pageerror", (e) => errors.push(e.message));
  for (const name of names) {
    await p.goto(h.base + root + name + "/");
    await ready(p);
    for (const width of [390, 320]) {
      await p.setViewportSize({ width, height: 844 });
      assert.equal(
        await p.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        true,
        name + " overflows at " + width,
      );
    }
    await p.setViewportSize({ width: 390, height: 844 });
    await shot(p, name + "-phone");
    await p.locator('[aria-controls="unifiedSettingsPanel"]').tap();
    await p.locator("#unifiedSettingsPanel").waitFor({ state: "visible" });
    assert.equal(await p.locator("#sfxVolumeSlider").isVisible(), true);
    await p.locator('[aria-controls="unifiedSettingsPanel"]').tap();
  }
  // Real touch dragging followed by a toolbar tap (Chromium can otherwise suppress the next tap).
  await p.goto(h.base + root + "number-line/");
  await ready(p);
  const cdp = await phone.newCDPSession(p),
    a = await xy(p, 242, 320),
    b = await xy(p, 414, 320);
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [a],
  });
  for (let i = 1; i <= 8; i++) {
    await p.evaluate(() => new Promise((r) => requestAnimationFrame(r)));
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: a.x + ((b.x - a.x) * i) / 8, y: a.y }],
    });
  }
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  assert.equal(await p.locator("#a").inputValue(), "4");
  await p.locator("#labels").tap();
  assert.equal(
    await p.locator("#labels").getAttribute("aria-pressed"),
    "false",
  );
  await cdp.detach();
  await phone.close();
});

test("catalog reaches all fourteen tools without overflowing desktop or phone layouts", async () => {
  await page.goto(h.base + root);
  assert.equal(await page.locator(".tool").count(), 14);
  for (const href of await page.locator(".tool").evaluateAll(links => links.map(a => a.href))) {
    const response = await page.request.get(href);
    assert.equal(response.status(), 200, href);
  }
  for (const [width,height] of [[1366,900],[1366,768],[768,1024],[390,844],[320,844]]) {
    await page.setViewportSize({width,height});
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await shot(page,"catalog-" + width + "x" + height);
  }
  await page.locator(`a[href="${root}clock/"]`).click();
  await ready(page);
  assert.equal(await page.title(), "모형 시계 · 수학 교구");
});

test("shared account saving serializes slow writes, recovers from failure and isolates guests", async () => {
  await open("number-line");
  let count=0;
  await page.route("**/api/me/storage/number-line/board", async route => {
    if (++count===1) await new Promise(resolve=>setTimeout(resolve,300));
    await route.continue();
  });
  await change("a",3);await change("a",4);await change("a",5);await saved();
  assert.equal((await state("number-line")).a,5);
  await page.unroute("**/api/me/storage/number-line/board");
  await page.route("**/api/me/storage/number-line/board",route=>route.fulfill({status:503,contentType:"application/json",body:'{"error":"OFFLINE"}'}));
  await change("a",7);
  await page.waitForFunction(()=>document.getElementById("save-status").textContent==="저장 실패");
  assert.equal(await page.locator("#a").inputValue(),"7");
  await page.unroute("**/api/me/storage/number-line/board");
  await change("a",8);await saved();await page.reload();await ready(page);
  assert.equal(await page.locator("#a").inputValue(),"8");
  const guest=await browser.newContext(),g=await guest.newPage();
  await g.goto(h.base+root+"number-line/");await ready(g);
  assert.equal(await g.locator("#a").inputValue(),"2");
  await g.locator("#a").fill("9");await g.locator("#a").dispatchEvent("change");
  await g.reload();await ready(g);assert.equal(await g.locator("#a").inputValue(),"2");
  await guest.close();
});
