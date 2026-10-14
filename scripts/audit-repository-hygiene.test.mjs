import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { auditRepository } from "./audit-repository-hygiene.mjs";

test("repository audit distinguishes local residue from runtime assets and linked downloads", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "repository-hygiene-"));
  const put = (name, content = "data") => {
    mkdirSync(path.dirname(path.join(root, name)), { recursive: true });
    writeFileSync(path.join(root, name), content);
  };
  try {
    put("learning/duplicate/package.json", "{}");
    put("learning/duplicate/.git/HEAD");
    put("learning/task/tools/scratch/crop.png");
    put("learning/task/original.jpg", Buffer.alloc(1024 * 1024 + 1));
    put("learning/task/unused.zip");
    put("learning/task/lesson.zip");
    put("learning/task/index.html", '<a href="lesson.zip" download>Download</a>');
    put("learning/task/data/climate.png");
    put("learning/task/sound.wav");
    put("learning/literacy-numeracy/arithmetics/package.json", "{}");
    put("learning/literacy-numeracy/arithmetics/.openai/hosting.json", "{}");
    put("learning/task/node_modules/library/package.json", "{}");
    put(".codex-remote-attachments/photo.jpg");
    const { findings } = auditRepository({ root, trackedFiles: [".codex-remote-attachments/photo.jpg", "outputs/already-deleted.png"] });
    assert.deepEqual(findings.map(item => item.path).sort(), [
      ".codex-remote-attachments/photo.jpg",
      "learning/duplicate/.git",
      "learning/duplicate/package.json",
      "learning/task/original.jpg",
      "learning/task/sound.wav",
      "learning/task/tools/scratch",
      "learning/task/unused.zip",
    ].sort());
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
