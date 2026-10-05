import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
const serverSource = fs.readFileSync(new URL("../game-hub-server/server.js", import.meta.url), "utf8");
const serverPackage = JSON.parse(fs.readFileSync(new URL("../game-hub-server/package.json", import.meta.url), "utf8"));
const postinstallSource = fs.readFileSync(new URL("../game-hub-server/render-postinstall.mjs", import.meta.url), "utf8");

test("learning links stay on the main Render service", () => {
  assert.doesNotMatch(html, /chatgpt\.site/);
  assert.match(html, /href="\/arithmetic"/);
  // 한국사는 따로 띄우던 앱이 아니라 저장소 안의 정적 페이지로 바로 간다.
  assert.match(html, /href="learning\/inquiry\/korean-history\/"/);
  assert.ok(fs.existsSync(new URL("../learning/inquiry/korean-history/index.html", import.meta.url)));
});

test("the main service builds and proxies the arithmetic app and keeps the old history address alive", () => {
  // 연산 앱 빌드는 package.json 한 줄에서 render-postinstall.mjs 로 옮겨 갔다.
  assert.equal(serverPackage.scripts.postinstall, "node render-postinstall.mjs");
  assert.match(postinstallSource, /"\.\.\/learning\/literacy-numeracy\/arithmetics",\s*"ci",\s*"--include=dev"/);
  assert.match(postinstallSource, /"\.\.\/learning\/literacy-numeracy\/arithmetics",\s*"run",\s*"build"/);
  assert.equal((postinstallSource.match(/"--include=dev"/g) || []).length, 1);
  assert.match(serverSource, /app\.use\("\/arithmetic", proxyToLearningApp\(ARITHMETIC_PORT\)\)/);
  // 한국사는 빌드도 프록시도 없이, 옛 주소만 정적 페이지로 넘긴다.
  assert.doesNotMatch(serverSource, /HANGUKSA_PORT/);
  assert.match(
    serverSource,
    /app\.use\("\/hanguksa", \(req, res\) => res\.redirect\(301, "\/learning\/inquiry\/korean-history\/"\)\)/,
  );
});

test("legacy learning paths redirect to the reorganized domains", () => {
  for (const legacyPath of [
    "/learning/reading",
    "/learning/basics/idioms",
    "/learning/academics/story-books",
    "/learning/basics",
    "/learning/academics",
    "/learning/simulations/body-explorer",
    "/learning/training/music-studio",
    "/learning/art",
    "/learning/music/classics",
    "/learning/music/korean",
  ]) {
    assert.match(serverSource, new RegExp(legacyPath.replaceAll("/", "\\/")));
  }
  assert.match(serverSource, /res\.redirect\(308,/);
});
