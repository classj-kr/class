import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const STAMP = ".classj-install.json";

export function dependencyFingerprint(directory, args, env = process.env) {
  const hash = createHash("sha256");
  hash.update(JSON.stringify(["dependencies-v1", process.version, process.platform,
    process.arch, args, env.NODE_ENV, env.npm_config_user_agent,
    Object.entries(env).filter(([key]) => /^npm_config_/i.test(key)).sort()]));
  for (const filename of ["package.json", "package-lock.json", ".npmrc"]) {
    const file = path.join(directory, filename);
    hash.update(filename);
    hash.update(existsSync(file) ? readFileSync(file) : "absent");
  }
  return hash.digest("hex");
}

// Render can restore node_modules. Reuse only a completed installation of the
// exact lockfile, Node version, platform and install options; never guess from
// the presence of the directory alone. A missing/partial cache falls back to ci.
export function reusableDependencies(directory, fingerprint) {
  try {
    const modules = path.join(directory, "node_modules");
    const stamp = JSON.parse(readFileSync(path.join(modules, STAMP), "utf8"));
    if (stamp.fingerprint !== fingerprint) return false;
    const installed = readFileSync(path.join(modules, ".package-lock.json"), "utf8");
    if (createHash("sha256").update(installed).digest("hex") !== stamp.installedHash) return false;
    const packages = Object.entries(JSON.parse(installed).packages || {});
    if (!packages.length) return false;
    return packages.every(([relative, entry]) => {
      const file = path.resolve(directory, relative, "package.json");
      if (!file.startsWith(modules + path.sep)) return false;
      return JSON.parse(readFileSync(file, "utf8")).version === entry.version;
    });
  } catch {
    return false;
  }
}

export function installDependencies({ directory, label, args, run, env = process.env }) {
  const cacheEnabled = env.RENDER === "true";
  const fingerprint = dependencyFingerprint(directory, args, env);
  if (cacheEnabled && reusableDependencies(directory, fingerprint)) {
    console.log(`[deploy] ${label}: lockfile unchanged; reusing installed packages.`);
    return "reused";
  }
  run(label, args);
  if (cacheEnabled) {
    const modules = path.join(directory, "node_modules");
    const installed = readFileSync(path.join(modules, ".package-lock.json"));
    writeFileSync(path.join(modules, STAMP), JSON.stringify({
      fingerprint,
      installedHash: createHash("sha256").update(installed).digest("hex"),
    }));
  }
  return "installed";
}
