import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { pruneRenderArtifact } from "./render-prune.mjs";

test("Render artifact pruning removes development files but keeps runtime content", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "render-prune-"));
  try {
    const developmentFile = path.join(root, "tools", "generator.bin");
    const sourceFile = path.join(root, "learning", "inquiry", "information-computing", "computer-fundamentals", "assets", "source", "original.png");
    const runtimeFile = path.join(root, "learning", "inquiry", "information-computing", "computer-fundamentals", "assets", "lesson.webp");
    for (const file of [developmentFile, sourceFile, runtimeFile]) {
      mkdirSync(path.dirname(file), { recursive: true });
      writeFileSync(file, "1234567890");
    }

    const result = pruneRenderArtifact(root);
    assert.equal(result.removedBytes, 20);
    assert.equal(result.removedTargets, 2);
    assert.equal(existsSync(developmentFile), false);
    assert.equal(existsSync(sourceFile), false);
    assert.equal(existsSync(runtimeFile), true);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});