'use strict';
// tests/*-unit.js 를 하나씩 따로 띄워 전부 돌린다. 예전 npm test 는 && 로 이어 붙인 사슬이라
// 하나가 실패하면 뒤는 아예 돌지 않았고, 열두 개는 사슬에 들어 있지도 않았다.
// 저장 파일이 저장소의 runtime/ 에 쓰이지 않도록 임시 폴더를 DATA_DIR 로 준다.
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.join(__dirname, '..');
const only = process.argv.slice(2);
const scripts = fs.readdirSync(__dirname)
  .filter((name) => /-unit\.js$/.test(name) && (only.length === 0 || only.some((part) => name.includes(part))))
  .sort();
const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'voyage-units-'));
const failed = [];
const started = Date.now();

for (const name of scripts) {
  const result = spawnSync(process.execPath, [path.join(__dirname, name)], {
    cwd: root,
    env: { ...process.env, DATA_DIR: dataDir },
    encoding: 'utf8',
    windowsHide: true,
    timeout: 120000,
  });
  if (result.status === 0) {
    process.stdout.write(`ok   ${name}\n`);
  } else {
    failed.push(name);
    const detail = `${result.stderr || ''}${result.stdout || ''}`.trim().split(/\r?\n/).slice(-6).join('\n      ');
    process.stdout.write(`FAIL ${name}\n      ${detail}\n`);
  }
}

fs.rmSync(dataDir, { recursive: true, force: true });
const seconds = ((Date.now() - started) / 1000).toFixed(1);
console.log(`\n${scripts.length - failed.length} / ${scripts.length} unit scripts passed (${seconds}s)`);
if (failed.length) {
  console.log(`failed: ${failed.join(', ')}`);
  process.exit(1);
}
