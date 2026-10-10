import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { auditSiteLinks, publicUrl, references } from "./audit-site-links.mjs";

test("link audit resolves public URLs after moving app folders", () => {
  assert.equal(publicUrl("apps/classtools/index.html"), "/classtools/");
  assert.equal(publicUrl("apps/site/privacy.html"), "/privacy.html");
  assert.equal(publicUrl("learning/inquiry/age-of-exploration/public/index.html"), "/learn/world-voyage/");
  const root = mkdtempSync(path.join(os.tmpdir(), "site-links-"));
  const put = (file, content = "") => {
    mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    writeFileSync(path.join(root, file), content);
  };
  try {
    put("index.html", '<a href="/classtools/">Tools</a><a href="/privacy">Privacy</a>');
    put("apps/classtools/index.html", '<link href="../assets/main.css?v=1"><a href="missing">Missing</a>');
    put("apps/site/privacy.html");
    put("assets/main.css", 'body{background:url("image.webp")}');
    put("assets/image.webp");
    const result = auditSiteLinks(root);
    assert.deepEqual(result.missing.map(item => item.url), ["/classtools/missing"]);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("embedded SVG data and commented links are not treated as missing assets", () => {
  assert.deepEqual(references('a{background:url("data:image/svg+xml,%3Csvg filter=url(%23glow)%3E")}b{background:url(real.webp)}'), ["real.webp"]);
  assert.deepEqual(references('<!-- <img src="old.png"> --><script src="app.js?v=1"></script>', true), ["app.js?v=1"]);
  assert.deepEqual(references('<script src="app.js">const html = `<img src="${userPhoto}">`;</script>', true), ["app.js"]);
});
