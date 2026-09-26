import { lstatSync, readdirSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPOSITORY_ROOT = path.resolve(SCRIPT_DIR, "..");

export const RENDER_PRUNE_TARGETS = Object.freeze([
  // The server never reads git history at runtime; Render already knows the commit.
  ".git",
  ".tmp",
  ".agents",
  ".claude",
  ".codex",
  ".github",
  ".openai",
  "audit_report.json",
  "citychase-v7.patch",
  "clean-passwords.js",
  "clean-profile.js",
  "clean-roster-2.js",
  "clean-roster.js",
  // Audit screenshots and QA captures; the server has no /docs route.
  "docs",
  "pisa-reference.jpg",
  "references",
  "scratch_all_poems_text.txt",
  "scratch_grades_list.txt",
  "scratch_missing_words.txt",
  "scripts",
  "sites",
  "tests",
  "tmp_poems.json",
  "tools",
  "update-auth-google.js",
  "learning/inquiry/age-of-exploration/public/assets/currents/source",
  "learning/inquiry/age-of-exploration/public/assets/maps/natural-earth-v58/source",
  "learning/inquiry/age-of-exploration/tests",
  "learning/inquiry/information-computing/computer-fundamentals/assets/source",
  "learning/literacy-numeracy/arithmetics/docs",
  "learning/literacy-numeracy/arithmetics/tests",
]);

function byteSize(target) {
  const stats = lstatSync(target);
  if (!stats.isDirectory()) return stats.size;
  let total = 0;
  for (const entry of readdirSync(target)) total += byteSize(path.join(target, entry));
  return total;
}

export function pruneRenderArtifact(repositoryRoot = REPOSITORY_ROOT) {
  let removedBytes = 0;
  let removedTargets = 0;
  const removed = [];
  for (const relativeTarget of RENDER_PRUNE_TARGETS) {
    const absoluteTarget = path.resolve(repositoryRoot, relativeTarget);
    const relativeCheck = path.relative(repositoryRoot, absoluteTarget);
    if (!relativeCheck || relativeCheck.startsWith("..") || path.isAbsolute(relativeCheck)) {
      throw new Error(`Unsafe Render prune target: ${relativeTarget}`);
    }
    let bytes;
    try {
      bytes = byteSize(absoluteTarget);
    } catch (error) {
      if (error.code === "ENOENT") continue;
      throw error;
    }
    removedBytes += bytes;
    rmSync(absoluteTarget, { recursive: true, force: true });
    removed.push({ target: relativeTarget, bytes });
    removedTargets += 1;
  }
  return { removedBytes, removedTargets, removed };
}