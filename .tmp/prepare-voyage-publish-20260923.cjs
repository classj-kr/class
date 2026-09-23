const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const root = path.resolve(__dirname, '..');
const prefix = 'learning/inquiry/age-of-exploration/';
const files = [
  'data/catalog/discoveries.json', 'lib/discovery-access.js', 'lib/place-study.js',
  'package.json', 'public/index.html', 'public/js/place-study-ui.js', 'server.js',
  'tests/place-study-smoke.js', 'tests/place-study-unit.js', 'MISSION-AUDIT-20260923.md',
  'data/catalog/discovery-regions.json', 'lib/discovery-regions.js', 'lib/study-concepts.js',
  'lib/study-question-bank.js', 'lib/study-question-builder.js', 'tests/discovery-regions-unit.js',
  'tests/place-study-recovery-ui.js', 'tests/study-question-quality-unit.js',
].map(x => prefix + x);
const index = path.join(__dirname, 'voyage-publish-20260923.index');
const env = { ...process.env, GIT_INDEX_FILE: index };
function git(args, options = {}) {
  const r = cp.spawnSync('git', args, {cwd: root, env, encoding:'utf8', ...options});
  if (r.status !== 0) throw new Error(r.stderr || r.stdout || `git exited ${r.status}`);
  return r.stdout.trim();
}
const base = git(['rev-parse','origin/main']);
const localHead = git(['rev-parse','HEAD']);
const changedBase = git(['diff','--name-only',localHead,base,'--',prefix]);
if (changedBase) throw new Error('Remote game files differ from local base: ' + changedBase);
git(['read-tree',base]);
git(['add','--',...files]);
git(['diff','--cached','--check',base]);
const staged = git(['diff','--cached','--name-only',base]).split(/\r?\n/).filter(Boolean);
if (staged.length !== files.length || staged.some(f => !files.includes(f))) throw new Error('Unexpected publish scope');
const tree = git(['write-tree']);
fs.writeFileSync(path.join(__dirname,'voyage-publish-20260923.json'), JSON.stringify({base,localHead,tree,index,files},null,2));
console.log(JSON.stringify({base,localHead,tree,files:staged},null,2));
console.log(git(['diff','--cached','--stat',base]));
