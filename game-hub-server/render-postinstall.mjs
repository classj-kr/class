import { createHash } from "node:crypto";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { pruneRenderArtifact } from "./render-prune.mjs";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ARITHMETIC_DIR = path.resolve(SCRIPT_DIR, "../learning/literacy-numeracy/arithmetics");
const ARITHMETIC_DIST = path.join(ARITHMETIC_DIR, "dist");
const WORLD_VOYAGE_DIR = "../learning/inquiry/age-of-exploration";
const CACHE_VERSION = "arithmetics-v1";
const EXCLUDED_DIRECTORIES = new Set([
  ".git",
  ".next",
  ".sites-git-backup",
  ".vinext",
  ".wrangler",
  "coverage",
  "dist",
  "node_modules",
  "out",
  "outputs",
  "tmp",
  "work",
]);
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

export function hashBuildInputs(rootDirectory) {
  const hash = createHash("sha256");
  hash.update(`${CACHE_VERSION}\0${process.version}\0${process.platform}\0${process.arch}\0`);

  function visit(directory, relativeDirectory = "") {
    const entries = readdirSync(directory, { withFileTypes: true })
      .sort((left, right) => left.name.localeCompare(right.name, "en"));

    for (const entry of entries) {
      if (entry.isDirectory() && EXCLUDED_DIRECTORIES.has(entry.name)) continue;
      const absolutePath = path.join(directory, entry.name);
      const relativePath = path.posix.join(relativeDirectory.split(path.sep).join("/"), entry.name);
      if (entry.isDirectory()) {
        visit(absolutePath, relativePath);
      } else if (entry.isFile()) {
        hash.update(relativePath);
        hash.update("\0");
        hash.update(readFileSync(absolutePath));
        hash.update("\0");
      }
    }
  }

  visit(rootDirectory);
  return hash.digest("hex");
}

function runNpm(label, args) {
  console.log(`[deploy] ${label}...`);
  const result = spawnSync(npmCommand, args, {
    cwd: SCRIPT_DIR,
    env: process.env,
    shell: process.platform === "win32",
    stdio: "inherit",
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
  console.log(`[deploy] ${label} complete.`);
}

function arithmeticCacheDirectory(inputHash) {
  const cacheHome = String(process.env.XDG_CACHE_HOME || "").trim();
  return cacheHome
    ? path.join(cacheHome, "classj", "arithmetics", inputHash, "dist")
    : "";
}

function restoreArithmeticBuild(inputHash) {
  const cachedDist = arithmeticCacheDirectory(inputHash);
  if (!cachedDist || !existsSync(cachedDist)) return false;
  try {
    rmSync(ARITHMETIC_DIST, { recursive: true, force: true });
    cpSync(cachedDist, ARITHMETIC_DIST, { recursive: true });
    console.log("[deploy] Arithmetic source unchanged; restored cached build.");
    return true;
  } catch (error) {
    console.warn(`[deploy] Cached arithmetic build could not be restored: ${error.message}`);
    return false;
  }
}

function saveArithmeticBuild(inputHash) {
  const cachedDist = arithmeticCacheDirectory(inputHash);
  if (!cachedDist || !existsSync(ARITHMETIC_DIST)) return;
  const cacheBase = path.dirname(path.dirname(cachedDist));
  rmSync(cacheBase, { recursive: true, force: true });
  mkdirSync(path.dirname(cachedDist), { recursive: true });
  cpSync(ARITHMETIC_DIST, cachedDist, { recursive: true });
  console.log("[deploy] Saved arithmetic build for reuse by later deploys.");
}

function main() {
  runNpm("Installing arithmetic runtime", [
    "--node-options=--max-old-space-size=384",
    "--prefix",
    "../learning/literacy-numeracy/arithmetics",
    "ci",
    "--include=dev",
    "--no-audit",
    "--no-fund",
  ]);

  const inputHash = hashBuildInputs(ARITHMETIC_DIR);
  if (!restoreArithmeticBuild(inputHash)) {
    runNpm("Arithmetic changed; building", [
      "--node-options=--max-old-space-size=384",
      "--prefix",
      "../learning/literacy-numeracy/arithmetics",
      "run",
      "build",
    ]);
    saveArithmeticBuild(inputHash);
  }

  runNpm("Installing World Voyage runtime", [
    "--prefix",
    WORLD_VOYAGE_DIR,
    "ci",
    "--omit=dev",
    "--no-audit",
    "--no-fund",
  ]);

  if (process.env.RENDER === "true") {
    const { removedBytes, removedTargets } = pruneRenderArtifact();
    console.log(`[deploy] Removed ${removedTargets} development-only paths (${(removedBytes / 1024 / 1024).toFixed(1)} MB) before upload.`);
  }
}

const isDirectRun = process.argv[1]
  && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirectRun) main();