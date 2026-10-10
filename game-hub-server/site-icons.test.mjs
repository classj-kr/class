import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import express from "express";
import icons from "./site-icons.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("icon URLs preserve file contents and cache policy after relocation", { timeout: 10000 }, async t => {
  const app = express();
  icons.registerSiteIcons(app, root);
  const server = await new Promise(resolve => {
    const listener = app.listen(0, "127.0.0.1", () => resolve(listener));
  });
  t.after(() => { server.closeAllConnections(); server.close(); });
  const base = `http://127.0.0.1:${server.address().port}`;
  const files = fs.readdirSync(path.join(root, "assets/icons"))
    .filter(name => /^(favicon.*|apple-touch-icon)\.webp$/.test(name));
  assert.equal(files.length, 10);
  for (const name of files) {
    const expected = fs.readFileSync(path.join(root, "assets/icons", name));
    const cache = name === "favicon.webp" ? "no-cache, must-revalidate"
      : name.startsWith("favicon-20260824") ? "public, max-age=31536000, immutable"
      : "public, max-age=86400";
    for (const prefix of ["/", "/assets/icons/"]) {
      const response = await fetch(`${base}${prefix}${name}`);
      assert.equal(response.status, 200, prefix + name);
      assert.equal(response.headers.get("content-type"), "image/webp");
      assert.equal(response.headers.get("cache-control"), cache);
      assert.deepEqual(Buffer.from(await response.arrayBuffer()), expected);
      const head = await fetch(`${base}${prefix}${name}`, { method: "HEAD" });
      assert.equal(head.status, 200);
      assert.equal(head.headers.get("cache-control"), cache);
      assert.equal((await head.arrayBuffer()).byteLength, 0);
    }
  }
  for (const name of ["favicon.ico", "favicon.png", "favicon-20260824-v6.ico"]) {
    const response = await fetch(`${base}/${name}`, { redirect: "manual" });
    assert.equal(response.status, 302);
    assert.equal(response.headers.get("location"), "/favicon.webp");
    assert.equal(response.headers.get("cache-control"), "no-cache, must-revalidate");
  }
});
