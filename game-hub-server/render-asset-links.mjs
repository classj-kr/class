import { createHash, randomUUID } from "node:crypto";
import { linkSync, lstatSync, readdirSync, readFileSync, renameSync, rmSync } from "node:fs";
import path from "node:path";

export const STATIC_ASSET_EXTENSIONS = new Set([
  ".avif", ".bin", ".geojson", ".gif", ".glb", ".gltf", ".ico", ".jpeg", ".jpg",
  ".m4a", ".mp3", ".mp4", ".ogg", ".otf", ".png", ".svg", ".ttf", ".wav",
  ".webm", ".webp", ".woff", ".woff2",
]);

const TOOL_DIRECTORIES = new Set(["node_modules", "tools", "_tools", "_check", "scratch", "tests"]);
const LINK_UNAVAILABLE = new Set(["EACCES", "EPERM", "EXDEV", "ENOTSUP", "ENOSYS", "EMLINK"]);

function shareFile(original, duplicate) {
  const temporary = path.join(path.dirname(duplicate), `.asset-link-${randomUUID()}`);
  try {
    linkSync(original, temporary);
    renameSync(temporary, duplicate);
    return true;
  } catch (error) {
    rmSync(temporary, { force: true });
    // Windows can report UNKNOWN when an existing file has too many hard links.
    const windowsLinkLimit = process.platform === "win32" && error.code === "UNKNOWN" && error.syscall === "link";
    if (!LINK_UNAVAILABLE.has(error.code) && !windowsLinkLimit) throw error;
    return false;
  }
}

// The deploy's static files are read-only. Hard links preserve every public pathname.
export function linkDuplicateAssets(root, directories) {
  const candidates = new Map();
  function scan(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const filepath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        if (!entry.name.startsWith(".") && !TOOL_DIRECTORIES.has(entry.name)) scan(filepath);
        continue;
      }
      const extension = path.extname(entry.name).toLowerCase();
      if (!entry.isFile() || !STATIC_ASSET_EXTENSIONS.has(extension)) continue;
      const { size } = lstatSync(filepath);
      if (size === 0) continue;
      const key = `${extension}:${size}`;
      if (!candidates.has(key)) candidates.set(key, []);
      candidates.get(key).push(filepath);
    }
  }

  for (const directory of directories) {
    const target = path.resolve(root, directory);
    const relative = path.relative(root, target);
    if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) throw new Error(`Unsafe asset directory: ${directory}`);
    if (lstatSync(target, { throwIfNoEntry: false })?.isDirectory()) scan(target);
  }

  let linkedFiles = 0;
  let savedBytes = 0;
  for (const files of candidates.values()) {
    if (files.length < 2) continue;
    const originals = new Map();
    for (const file of files) {
      const digest = createHash("sha256").update(readFileSync(file)).digest("hex");
      const stats = lstatSync(file, { bigint: true });
      const original = originals.get(digest);
      if (!original) {
        originals.set(digest, { file, ino: stats.ino, dev: stats.dev });
        continue;
      }
      if (stats.ino === original.ino && stats.dev === original.dev) continue;
      if (shareFile(original.file, file)) {
        linkedFiles += 1;
        if (stats.nlink === 1n) savedBytes += Number(stats.size);
      } else {
        // An identical file can start a new group when the current inode is full.
        originals.set(digest, { file, ino: stats.ino, dev: stats.dev });
      }
    }
  }
  return { linkedFiles, savedBytes };
}
