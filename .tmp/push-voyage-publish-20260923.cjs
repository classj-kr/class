const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const root=path.resolve(__dirname,'..');
const manifestPath=path.join(__dirname,'voyage-publish-20260923.json');
const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
function git(args, input) {
  const r=cp.spawnSync('git',args,{cwd:root,encoding:'utf8',input,timeout:120000});
  if(r.status!==0) throw new Error(r.stderr||r.stdout||`git exited ${r.status}`);
  return r.stdout.trim();
}
git(['fetch','origin','main']);
if(git(['rev-parse','origin/main'])!==manifest.base)throw new Error('Origin main changed; prepare again before publishing');
const message='fix(world-voyage): recover study missions and validate geographic arrival\n\nRestore mission progress after lost acknowledgements or reconnects. Build reading-backed questions and add arrival regions for 19 geographic discoveries.\n\nVerified all 575 reading sets, 15 recovery cases, browser mission flows, and a 33-student/297-answer class simulation.\n';
manifest.commit=git(['commit-tree',manifest.tree,'-p',manifest.base,'-F','-'],message);
fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2));
console.log('Commit: '+manifest.commit);
console.log(git(['push','origin',manifest.commit+':refs/heads/main']));
console.log(git(['ls-remote','origin','refs/heads/main']));
