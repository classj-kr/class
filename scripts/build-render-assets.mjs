import { execFileSync } from "node:child_process";
import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIRECTORY = path.dirname(fileURLToPath(import.meta.url));
const REPOSITORY_ROOT = path.resolve(SCRIPT_DIRECTORY, "..");
const DEFAULT_OUTPUT = path.join(REPOSITORY_ROOT, ".render-assets");
const ASSET_EXTENSIONS = new Set([
  ".avif", ".bin", ".geojson", ".gif", ".glb", ".gltf", ".ico", ".jpeg", ".jpg",
  ".m4a", ".mp3", ".mp4", ".ogg", ".otf", ".png", ".svg", ".ttf", ".wav",
  ".webm", ".webp", ".woff", ".woff2",
]);
const EXCLUDED_PREFIXES = [
  "learning/inquiry/age-of-exploration/public/assets/currents/source/",
  "learning/inquiry/age-of-exploration/public/assets/maps/natural-earth-v58/source/",
  "learning/inquiry/information-computing/computer-fundamentals/assets/source/",
];

function normalize(relativePath) {
  return relativePath.split(path.sep).join("/").replace(/^\.\//, "");
}

export function assetDestinations(relativePath) {
  const normalized = normalize(relativePath);
  if (EXCLUDED_PREFIXES.some((prefix) => normalized.startsWith(prefix))) return [];
  if (!ASSET_EXTENSIONS.has(path.posix.extname(normalized).toLowerCase())) return [];

  if (normalized.startsWith("classtools/assets/avatars/")) {
    return [`assets/avatars/${normalized.slice("classtools/assets/avatars/".length)}`];
  }
  if (!normalized.startsWith("learning/")) return [];

  const destinations = [normalized];
  const voyagePublic = "learning/inquiry/age-of-exploration/public/";
  if (normalized.startsWith(voyagePublic)) {
    destinations.push(`learn/world-voyage/${normalized.slice(voyagePublic.length)}`);
  }
  return destinations;
}

export function buildRenderAssets({ repositoryRoot = REPOSITORY_ROOT, outputDirectory = DEFAULT_OUTPUT, trackedFiles } = {}) {
  const files = trackedFiles || execFileSync("git", ["ls-files", "-z"], {
    cwd: repositoryRoot,
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  }).split("\0").filter(Boolean);

  rmSync(outputDirectory, { recursive: true, force: true });
  mkdirSync(outputDirectory, { recursive: true });

  let fileCount = 0;
  for (const relativePath of files) {
    const destinations = assetDestinations(relativePath);
    if (destinations.length === 0) continue;
    const source = path.resolve(repositoryRoot, relativePath);
    for (const destination of destinations) {
      const output = path.resolve(outputDirectory, destination);
      const safetyCheck = path.relative(outputDirectory, output);
      if (!safetyCheck || safetyCheck.startsWith("..") || path.isAbsolute(safetyCheck)) {
        throw new Error(`Unsafe asset destination: ${destination}`);
      }
      mkdirSync(path.dirname(output), { recursive: true });
      cpSync(source, output);
      fileCount += 1;
    }
  }

  const manifest = {
    commit: process.env.RENDER_GIT_COMMIT || "local",
    fileCount,
  };
  writeFileSync(path.join(outputDirectory, "__asset-manifest.json"), `${JSON.stringify(manifest)}\n`);
  writeFileSync(path.join(outputDirectory, "index.html"), "<!doctype html><meta charset=\"utf-8\"><title>JoyClass assets</title><p>JoyClass static assets</p>\n");
  return manifest;
}

const isDirectRun = process.argv[1]
  && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirectRun) {
  const manifest = buildRenderAssets();
  console.log(`[assets] Prepared ${manifest.fileCount} CDN files.`);
}