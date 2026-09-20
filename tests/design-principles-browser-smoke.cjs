const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { pathToFileURL } = require('node:url');
const browser = process.env.CHROME_PATH || ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', '/usr/bin/chromium', '/usr/bin/google-chrome'].find(p => fs.existsSync(p));
assert.ok(browser, 'Set CHROME_PATH to a Chrome or Edge executable.');
const temporaryRoot = fs.realpathSync(os.tmpdir());
const profile = fs.mkdtempSync(path.join(temporaryRoot, 'design-principles-test-'));
const fixture = pathToFileURL(path.join(__dirname, 'fixtures/design-principles-browser.html'));
try {
  for (const width of [1440, 390, 320]) {
    fixture.search = `?width=${width}`;
    const args = ['--headless', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--allow-file-access-from-files', `--user-data-dir=${profile}`, `--window-size=${width},1000`, '--force-device-scale-factor=1', '--virtual-time-budget=8000', '--dump-dom'];
    if (process.env.DESIGN_PRINCIPLES_SCREENSHOTS) {
      fs.mkdirSync(process.env.DESIGN_PRINCIPLES_SCREENSHOTS, { recursive: true });
      args.push(`--screenshot=${path.resolve(process.env.DESIGN_PRINCIPLES_SCREENSHOTS, `lesson-${width}.png`)}`);
    }
    const result = spawnSync(browser, [...args, fixture.href], { encoding: 'utf8', timeout: 30000, maxBuffer: 2000000 });
    assert.ifError(result.error);
    assert.equal(result.status, 0, result.stderr);
    const raw = result.stdout.match(/<pre id="result">([\s\S]*?)<\/pre>/)?.[1];
    assert.ok(raw && raw.startsWith('{'), raw || 'No browser test result');
    const report = JSON.parse(raw);
    assert.ok(report.passed > 0);
    console.log(`${width}px: ${report.passed} browser checks passed`);
  }
} finally {
  const resolved = fs.realpathSync(profile);
  assert.equal(path.dirname(resolved).toLowerCase(), temporaryRoot.toLowerCase());
  assert.ok(path.basename(resolved).startsWith('design-principles-test-'));
  fs.rmSync(resolved, { recursive: true, force: true, maxRetries: 3 });
}
