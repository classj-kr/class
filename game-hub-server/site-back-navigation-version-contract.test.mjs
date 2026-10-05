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

  // The circular control shipped as 20260917-back-button-2. The value is bumped whenever
  // the script changes, so both loaders must request a version at least that new.
  const circularControlDate = 20260917;
  const versionDate = value => Number((/^(\d{8})-[\w-]+$/.exec(value || "") || [])[1] || 0);

  assert.match(server, /data-site-back-navigation="true"/);
  const serverVersion = server.match(/site-back-navigation\.js\?v=([^"'\s>]+)/)?.[1];
  assert.ok(versionDate(serverVersion) >= circularControlDate, `server requests ${serverVersion}`);
  const fallbackVersion = musicControl.match(/backScriptUrl\.searchParams\.set\("v", "([^"]+)"\)/)?.[1];
  assert.ok(versionDate(fallbackVersion) >= circularControlDate, `music-control requests ${fallbackVersion}`);
});
