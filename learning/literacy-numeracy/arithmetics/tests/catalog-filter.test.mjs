import assert from "node:assert/strict";
import test from "node:test";
import { learningWorksheetCatalog } from "../lib/arithmetic-worksheets.ts";

const { default: worker } = await import("../dist/server/index.js");
const stages = ["elementary", "middle", "high", "stem"];
const counts = [65, 39, 66, 6];

async function render(path, school = "") {
  const response = await worker.fetch(new Request(`http://localhost${path}`, {
    headers: { accept: "text/html", "x-class-school-level": school },
  }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, {
    waitUntil() {}, passThroughOnException() {},
  });
  assert.equal(response.status, 200);
  return await response.text();
}

function expectStage(html, stage) {
  const choices = [...html.matchAll(/data-stage="([^"]+)" data-testid="worksheet-choice"/g)].map(match => match[1]);
  assert.deepEqual([...new Set(choices)], stage === "all" ? stages : [stage]);
  assert.equal(choices.length, stage === "all" ? learningWorksheetCatalog.length : counts[stages.indexOf(stage)]);
  assert.match(html, new RegExp(`class="catalog-stage-link stage-${stage}"[^>]*aria-pressed="true"`));
  assert.equal((html.match(/aria-pressed="true"/g) || []).length, 1);
}

test("first HTML shows only the registered school level, including alternate catalog entrances", async () => {
  for (const [index, path] of ["/arithmetic", "/arithmetic/personal", "/arithmetic/high-school"].entries()) {
    expectStage(await render(path, stages[index]), stages[index]);
  }
});

test("all five filters render their own catalog and unknown stages fall back to the account", async () => {
  for (const stage of [...stages, "all"]) expectStage(await render(`/arithmetic?stage=${stage}`, "middle"), stage);
  expectStage(await render("/arithmetic?stage=invalid", "high"), "high");
  expectStage(await render("/arithmetic"), "elementary");
});
