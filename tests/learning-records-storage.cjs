// Active student entry points must never fall back to device storage.
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const catalog = require('../assets/learning-record-catalog');
const root = path.resolve(__dirname, '..');
const skip = new Set(['node_modules', 'dist', '.next', '.wrangler', '.git', 'assets', 'vendor', 'data', 'images', 'fonts', 'tests', 'tools']);
let htmlPages = 0, appSyntaxChecks = 0;
const matches = [];
function visit(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name.startsWith('_') || entry.name.startsWith('.')) continue;
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) { if (!skip.has(entry.name)) visit(file); continue; }
    if (!/\.(?:js|html|tsx|ts)$/.test(entry.name) || /^(test|verify)/.test(entry.name)) continue;
    const source = fs.readFileSync(file, 'utf8');
    if (/localStorage|sessionStorage|indexedDB/.test(source)) matches.push(path.relative(root, file));
    if (entry.name === 'index.html') htmlPages++;
    if (entry.name === 'app.js') { new vm.Script(source, { filename: file }); appSyntaxChecks++; }
  }
}
for (const entry of catalog) visit(path.join(root, entry.id === 'arithmetic' ? 'learning/literacy-numeracy/arithmetics/app' : entry.href.replace(/^\//, '')));
for (const file of ['learning-records.js', 'learning-book.js', 'learning-hanja.js', 'learning-lesson.js']) {
  const source = fs.readFileSync(path.join(root, 'assets', file), 'utf8');
  assert.doesNotMatch(source, /localStorage|sessionStorage|indexedDB/, file);
  new vm.Script(source, { filename: file });
}
assert.deepEqual(matches, []);
console.log(`PASS ${catalog.length} activities, ${htmlPages} HTML pages, ${appSyntaxChecks} app syntax checks: no student device storage.`);
