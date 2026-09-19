import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { assetDestinations, buildRenderAssets } from "./build-render-assets.mjs";

test("asset routing includes runtime media and excludes source originals", () => {
  assert.deepEqual(assetDestinations("learning/books/images/page.webp"), ["learning/books/images/page.webp"]);
  assert.deepEqual(assetDestinations("classtools/assets/avatars/cat.webp"), ["assets/avatars/cat.webp"]);
  assert.deepEqual(
    assetDestinations("learning/inquiry/age-of-exploration/public/assets/city.webp"),
    [
      "learning/inquiry/age-of-exploration/public/assets/city.webp",
      "learn/world-voyage/assets/city.webp",
    ],
  );
  assert.deepEqual(
    assetDestinations("learning/inquiry/information-computing/computer-fundamentals/assets/source/original.png"),
    [],
  );
  assert.deepEqual(assetDestinations("learning/books/app.js"), []);
});

test("asset build preserves public paths and writes a deployment manifest", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "render-assets-"));
  const output = path.join(root, "output");
  try {
    const runtimeAsset = "learning/books/images/page.webp";
    const avatar = "classtools/assets/avatars/cat.webp";
    for (const file of [runtimeAsset, avatar]) {
      const absolute = path.join(root, file);
      mkdirSync(path.dirname(absolute), { recursive: true });
      writeFileSync(absolute, file);
    }
    const manifest = buildRenderAssets({ repositoryRoot: root, outputDirectory: output, trackedFiles: [runtimeAsset, avatar] });
    assert.equal(manifest.fileCount, 2);
    assert.equal(existsSync(path.join(output, runtimeAsset)), true);
    assert.equal(existsSync(path.join(output, "assets", "avatars", "cat.webp")), true);
    assert.equal(JSON.parse(readFileSync(path.join(output, "__asset-manifest.json"), "utf8")).commit, "local");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});