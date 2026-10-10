import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const RUNTIME_PACKAGES = new Set([
  "learning/literacy-numeracy/arithmetics/package.json",
  "learning/inquiry/age-of-exploration/package.json",
]);
const SKIP = new Set(["node_modules", "dist", ".next", ".vinext", ".wrangler", "__pycache__"]);
// vite.config.ts imports this binding configuration for the active arithmetic build.
const BUILD_METADATA = new Set(["learning/literacy-numeracy/arithmetics/.openai"]);

// Read-only: findings are investigation leads, never permission to delete files.
export function auditRepository({ root = ROOT, trackedFiles } = {}) {
  const findings = [];
  let scannedFiles = 0;
  const report = (file, reason) => findings.push({ path: file, reason });
  function walk(directory) {
    for (const entry of readdirSync(path.join(root, directory), { withFileTypes: true })) {
      const relative = `${directory}/${entry.name}`;
      if (BUILD_METADATA.has(relative)) continue;
      if (entry.isSymbolicLink()) {
        report(relative, "서비스 폴더에 연결 경로가 있음: 대상 확인 필요");
        continue;
      }
      if ([".git", ".openai", "scratch"].includes(entry.name) || /스캔본|수집원본/.test(entry.name)) {
        report(relative, "별도 배포 설정·수집 원본·임시 작업이 서비스 폴더에 있음");
        continue;
      }
      if (entry.isDirectory()) {
        if (!SKIP.has(entry.name)) walk(relative);
        continue;
      }
      scannedFiles += 1;
      if (entry.name === "package.json" && !RUNTIME_PACKAGES.has(relative)) {
        report(relative, "통합 서버가 빌드하지 않는 별도 프로젝트: 사용 여부 확인 필요");
      }
      if (/\.tsbuildinfo$|(?:^|[_-])backup\./i.test(entry.name)) {
        report(relative, "빌드 캐시 또는 백업 파일이 서비스 폴더에 있음");
      }
      if (/\.(png|jpe?g)$/i.test(entry.name) && statSync(path.join(root, relative)).size > 1024 * 1024) {
        report(relative, "1 MiB 초과 PNG/JPG: 실제 용도와 변환 가능 여부 확인 필요");
      }
      if (/\.(zip|7z|rar)$/i.test(entry.name)) {
        const linked = readdirSync(path.join(root, directory)).some(name =>
          /\.(html|js|json)$/.test(name) &&
          readFileSync(path.join(root, directory, name), "utf8").includes(entry.name));
        if (!linked) report(relative, "같은 폴더의 화면·데이터에서 연결하지 않는 압축파일");
      }
    }
  }
  for (const directory of ["apps", "assets", "learning"]) {
    if (existsSync(path.join(root, directory))) walk(directory);
  }
  const tracked = trackedFiles ?? execFileSync("git", ["ls-files", "-z"], {
    cwd: root, encoding: "utf8", maxBuffer: 32 * 1024 * 1024,
  }).split("\0").filter(Boolean);
  for (const file of tracked) {
    if (!existsSync(path.join(root, file))) continue; // Pending deletions are already handled.
    if (/^(?:\.codex-remote-attachments|outputs|output|tmp)\//.test(file) || /\.tsbuildinfo$/.test(file)) {
      report(file, "로컬 전용 파일이 Git 추적에 포함되어 있음");
    }
  }
  return { scannedFiles, findings };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = auditRepository();
  console.log(JSON.stringify(result, null, 2));
  if (result.findings.length) process.exitCode = 1;
}
