import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

// Board games are served at friendly URLs such as /learning/games/corner-blocks
// while their HTML lives in /learning/games/blokus/blokus.html. A relative
// href like "styles.css" then resolves against the friendly URL, not the file's
// folder. On 2026-10-01 Corner Blocks lost both of its stylesheets this way.
// Resolve every relative URL in those pages the way a browser would and check
// that the file exists.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const serverSource = fs.readFileSync(path.join(root, "game-hub-server", "server.js"), "utf8").replace(/\r\n/g, "\n");

const friendlyTable = serverSource.match(/for \(const \[friendlyPath, legacyPath, file\] of \[\n([\s\S]*?)\n\]\) \{/);
assert.ok(friendlyTable, "friendly path table not found in server.js");
const mappings = [...friendlyTable[1].matchAll(/\["([^"]+)", "([^"]+)", "([^"]+)"\]/g)]
  .map(([, friendlyPath, legacyPath, file]) => ({ friendlyPath, legacyPath, file }));

test("the friendly game path table is non-empty and every target file exists", () => {
  assert.ok(mappings.length >= 10, `only ${mappings.length} friendly paths parsed`);
  for (const { file } of mappings) assert.ok(fs.existsSync(path.join(root, file)), file);
});

test("every relative href/src in a friendly-path page resolves to a real file from the friendly URL", () => {
  const problems = [];
  for (const { friendlyPath, file } of mappings) {
    const html = fs.readFileSync(path.join(root, file), "utf8");
    for (const [, attribute, value] of html.matchAll(/\b(href|src)="([^"]+)"/g)) {
      if (/^(?:[a-z]+:|\/|#|\$\{)/i.test(value) || value.includes("${")) continue;
      const resolved = new URL(value, `http://example.test${friendlyPath}`).pathname;
      const onDisk = path.join(root, decodeURIComponent(resolved));
      if (!fs.existsSync(onDisk)) problems.push(`${file}: ${attribute}="${value}" -> ${resolved}`);
    }
  }
  assert.deepEqual(problems, []);
});

test("legacy game paths are redirected to the friendly path, not served twice", () => {
  for (const { friendlyPath, legacyPath } of mappings) {
    assert.ok(legacyPath !== friendlyPath, legacyPath);
    assert.match(serverSource, new RegExp(`app\\.get\\(legacyPath, \\(req, res\\) => res\\.redirect\\(308, \`\\$\\{friendlyPath\\}`));
  }
});
