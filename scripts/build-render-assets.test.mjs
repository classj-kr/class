import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { assetDestinations, buildRenderAssets } from "./build-render-assets.mjs";

test("asset routing includes runtime media and excludes source originals", () => {
  assert.deepEqual(assetDestinations("learning/books/images/page.webp"), ["learning/books/images/page.webp"]);
  assert.deepEqual(assetDestinations("apps/classtools/assets/avatars/cat.webp"), ["assets/avatars/cat.webp"]);
  assert.deepEqual(
    assetDestinations("learning/inquiry/age-of-exploration/public/assets/city.webp"),
    ["learn/world-voyage/assets/city.webp"],
  );
  assert.deepEqual(
    assetDestinations("learning/inquiry/information-computing/computer-fundamentals/assets/source/original.png"),
    [],
  );
  assert.deepEqual(assetDestinations("learning/books/app.js"), []);
  for (const file of [
    "learning/literacy-numeracy/phonics-site/public/phonics/image.webp",
    "learning/literacy-numeracy/csat-math/tools/scratch/crop.png",
    "learning/books/_tools/preview.webp",
    "learning/books/tests/screenshot.png",
    "learning/books/node_modules/library/logo.svg",
  ]) assert.deepEqual(assetDestinations(file), [], file);
});

test("asset build copies voyage media once and writes the deployment manifest", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "render-assets-"));
  const output = path.join(root, "output");
  try {
    const runtimeAsset = "learning/books/images/page.webp";
    const avatar = "apps/classtools/assets/avatars/cat.webp";
    const voyageTile = "learning/inquiry/age-of-exploration/public/assets/maps/tiles/tile_0_0.webp";
    const identicalTile = voyageTile.replace("tile_0_0", "tile_1_0");
    const differentTile = voyageTile.replace("tile_0_0", "tile_2_0");
    const trackedFiles = [runtimeAsset, avatar, voyageTile, identicalTile, differentTile];
    for (const file of trackedFiles) {
      const absolute = path.join(root, file);
      mkdirSync(path.dirname(absolute), { recursive: true });
      writeFileSync(absolute, file === identicalTile ? voyageTile : file);
    }
    const manifest = buildRenderAssets({ repositoryRoot: root, outputDirectory: output, trackedFiles });
    assert.equal(manifest.fileCount, 5);
    assert.equal(manifest.linkedFiles, 1);
    assert.equal(manifest.savedBytes, Buffer.byteLength(voyageTile));
    assert.equal(existsSync(path.join(output, runtimeAsset)), true);
    assert.equal(existsSync(path.join(output, "assets", "avatars", "cat.webp")), true);
    const [original, identical, different] = [voyageTile, identicalTile, differentTile]
      .map(file => path.join(output, assetDestinations(file)[0]));
    assert.equal(readFileSync(original, "utf8"), voyageTile);
    assert.equal(readFileSync(identical, "utf8"), voyageTile);
    assert.equal(readFileSync(different, "utf8"), differentTile);
    assert.equal(statSync(original, { bigint: true }).ino, statSync(identical, { bigint: true }).ino);
    assert.notEqual(statSync(original, { bigint: true }).ino, statSync(different, { bigint: true }).ino);
    assert.equal(statSync(path.join(root, voyageTile)).nlink, 1);
    assert.equal(existsSync(path.join(output, voyageTile)), false);
    assert.equal(JSON.parse(readFileSync(path.join(output, "__asset-manifest.json"), "utf8")).commit, "local");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
