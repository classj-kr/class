import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { installDependencies } from "./render-dependency-cache.mjs";

function fixture(t) {
  const directory = mkdtempSync(path.join(os.tmpdir(), "render-dependencies-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  writeFileSync(path.join(directory, "package.json"), '{"dependencies":{"example":"1.0.0"}}');
  writeFileSync(path.join(directory, "package-lock.json"), '{"lockfileVersion":3}');
  let calls = 0;
  const options = {
    directory, label: "test runtime", args: ["ci", "--omit=dev"],
    env: { RENDER: "true", NODE_ENV: "production", npm_config_user_agent: "npm/10" },
    run() {
      calls++;
      mkdirSync(path.join(directory, "node_modules/example"), { recursive: true });
      writeFileSync(path.join(directory, "node_modules/example/package.json"), '{"version":"1.0.0"}');
      writeFileSync(path.join(directory, "node_modules/.package-lock.json"),
        JSON.stringify({ packages: { "node_modules/example": { version: "1.0.0" } } }));
    },
  };
  return { directory, options, calls: () => calls };
}

test("cold install is reused for source-only edits but not lockfile changes", t => {
  const f = fixture(t);
  assert.equal(installDependencies(f.options), "installed");
  writeFileSync(path.join(f.directory, "server.js"), "// source edit");
  assert.equal(installDependencies(f.options), "reused");
  assert.equal(f.calls(), 1);
  writeFileSync(path.join(f.directory, "package-lock.json"), '{"lockfileVersion":3,"changed":true}');
  assert.equal(installDependencies(f.options), "installed");
  assert.equal(f.calls(), 2);
});

test("missing package and corrupted cache trigger clean installation", t => {
  const f = fixture(t);
  installDependencies(f.options);
  rmSync(path.join(f.directory, "node_modules/example/package.json"));
  assert.equal(installDependencies(f.options), "installed");
  writeFileSync(path.join(f.directory, "node_modules/.package-lock.json"), "broken");
  assert.equal(installDependencies(f.options), "installed");
  writeFileSync(path.join(f.directory, "node_modules/.classj-install.json"), "broken");
  assert.equal(installDependencies(f.options), "installed");
});

test("npm, install mode and npmrc changes invalidate the cache", t => {
  const f = fixture(t);
  installDependencies(f.options);
  f.options.env.npm_config_user_agent = "npm/11";
  assert.equal(installDependencies(f.options), "installed");
  f.options.args = ["ci", "--include=dev"];
  assert.equal(installDependencies(f.options), "installed");
  writeFileSync(path.join(f.directory, ".npmrc"), "legacy-peer-deps=true\n");
  assert.equal(installDependencies(f.options), "installed");
});

test("failed installation never gets a reusable stamp and local installs do not skip ci", t => {
  const f = fixture(t);
  const failing = { ...f.options, run: () => { throw new Error("install failed"); } };
  assert.throws(() => installDependencies(failing), /install failed/);
  assert.equal(installDependencies(f.options), "installed");
  f.options.env.RENDER = "false";
  assert.equal(installDependencies(f.options), "installed");
  assert.equal(installDependencies(f.options), "installed");
});
