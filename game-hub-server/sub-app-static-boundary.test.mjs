import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

// The World Voyage, arithmetic and phonics apps keep their own server code,
// dependencies and (for World Voyage) a classroom save file inside /learning,
// which express.static serves wholesale. Only their public/ folders may be
// reachable by URL; everything else must 404 however the path is spelled.
// Group folders without a page of their own send old back links to the home page.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = 18771;
const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "voyage-boundary-"));
const child = spawn(process.execPath, [path.join(root, "game-hub-server", "server.js")], {
  env: {
    ...process.env,
    PORT: String(port),
    ARITHMETIC_PORT: "18772",
    WORLD_VOYAGE_PORT: "18773",
    WORLD_VOYAGE_DATA_DIR: dataDir,
    DATABASE_URL: "",
    GOOGLE_CLIENT_ID: "",
    TEACHER_EMAILS: "",
    ADMIN_EMAILS: "",
  },
  stdio: ["ignore", "ignore", "pipe"],
});
let stderr = "";
child.stderr.on("data", (chunk) => { stderr += chunk.toString(); });

async function waitForServer() {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/health`);
      if (response.ok) return;
    } catch (_) {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Server did not start. ${stderr}`);
}

const status = async (requestPath) => {
  const response = await fetch(`http://127.0.0.1:${port}${requestPath}`, { redirect: "manual" });
  await response.arrayBuffer();
  return { status: response.status, location: response.headers.get("location") };
};

test("sub-app internals are not reachable by URL, however the path is spelled", { timeout: 60000 }, async (t) => {
  await waitForServer();
  t.after(() => { child.kill(); fs.rmSync(dataDir, { recursive: true, force: true }); });

  const voyage = "/learning/inquiry/age-of-exploration";
  for (const requestPath of [
    `${voyage}/runtime/classroom-state.json`,
    `${voyage}/server.js`,
    `${voyage}/lib/classroom-store.js`,
    `${voyage}/package.json`,
    `${voyage}/data/catalog/places.json`,
    `${voyage}/`,
    `${voyage}/public/../runtime/classroom-state.json`,
    "/learning/inquiry/%61ge-of-exploration/runtime/classroom-state.json",
    "/learning//inquiry/age-of-exploration/runtime/classroom-state.json",
    "/LEARNING/inquiry/Age-Of-Exploration/runtime/classroom-state.json",
    `${voyage}/runtime%2fclassroom-state.json`,
    "/learning/inquiry/age-of-exploration%5cruntime%5cclassroom-state.json",
    "/learning/literacy-numeracy/arithmetics/package.json",
    "/learning/literacy-numeracy/arithmetics/app/layout.tsx",
    "/learning/literacy-numeracy/phonics-site/package.json",
  ]) {
    assert.equal((await status(requestPath)).status, 404, requestPath);
  }

  // The classroom save file is written outside the static tree.
  const savedOutside = path.join(dataDir, "classroom-state.json");
  for (let attempt = 0; attempt < 50 && !fs.existsSync(savedOutside); attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  assert.ok(fs.existsSync(savedOutside), "World Voyage should save under WORLD_VOYAGE_DATA_DIR");

  // What pages legitimately load from those folders keeps working.
  for (const requestPath of [
    `${voyage}/public/assets/maps/natural-earth-v58/overview.webp`,
    "/learning/literacy-numeracy/arithmetics/public/fonts/STIXTwoMath-Regular.woff2",
    "/learning/literacy-numeracy/arithmetics/public/fonts/KoPubWorld-Batang-Medium.woff2",
    "/learning/literacy-numeracy/graph-studio/",
    "/learning/literacy-numeracy/phonics/",
  ]) {
    assert.equal((await status(requestPath)).status, 200, requestPath);
  }

  // Group folders have no page; old back links land on the home page.
  for (const requestPath of ["/learning", "/learning/", "/learning/literacy-numeracy/", "/learning/inquiry/", "/learning/arts/", "/learning/games/"]) {
    assert.deepEqual(await status(requestPath), { status: 302, location: "/" }, requestPath);
  }
  // Real pages under those folders are untouched.
  assert.equal((await status("/learning/class-race/")).status, 410);
  assert.equal((await status("/learning/inquiry/human-body/")).status, 200);
});
