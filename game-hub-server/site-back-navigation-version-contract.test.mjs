import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = relativePath => fs.readFileSync(path.join(root, relativePath), "utf8");

test("the circular back control bypasses the previous cached asset", () => {
  const server = read("game-hub-server/server.js");
  const musicControl = read("assets/sound/music-control.js");

  assert.match(server, /data-site-back-navigation="true"/);
  assert.match(server, /site-back-navigation\.js\?v=20260917-back-button-2/);
  assert.match(musicControl, /backScriptUrl\.searchParams\.set\("v", "20260917-back-button-2"\)/);
});
