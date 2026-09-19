import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { hashBuildInputs } from "./render-postinstall.mjs";

test("arithmetic deploy hash ignores generated output and dependencies", () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "arithmetics-build-hash-"));
  try {
    writeFileSync(path.join(directory, "page.tsx"), "export default 1;\n");
    const originalHash = hashBuildInputs(directory);

    mkdirSync(path.join(directory, "dist"));
    writeFileSync(path.join(directory, "dist", "generated.js"), "generated\n");
    mkdirSync(path.join(directory, "node_modules"));
    writeFileSync(path.join(directory, "node_modules", "dependency.js"), "dependency\n");
    assert.equal(hashBuildInputs(directory), originalHash);

    writeFileSync(path.join(directory, "page.tsx"), "export default 2;\n");
    assert.notEqual(hashBuildInputs(directory), originalHash);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});