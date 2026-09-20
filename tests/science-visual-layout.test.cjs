const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),lab=path.join(root,'learning/inquiry/science-lab');
test('all science lessons share the same reading scale and layout module',()=>{
 const map=require(path.join(lab,'curriculum-map.js'));
 for(const slug of Object.keys(map)){
  const html=fs.readFileSync(path.join(lab,slug,'index.html'),'utf8');
  assert.equal((html.match(/src="\.\.\/lab-ui\.js/g)||[]).length,1,slug+' script');
  assert.equal((html.match(/href="\.\.\/lab-ui\.css/g)||[]).length,1,slug+' stylesheet');
 }
});
test('visual regressions: Chromebook and iPad landscape/portrait', {timeout:180000},()=>{
 const slugs='seasons,magnets,sound-vibration,light-shadow,body-systems,pea-genetics,volcano-model,senses,energy-conversion,combustion,natural-selection,life-cycle,ocean-circulation,stars-universe,flame-ions';
 const r=spawnSync(process.execPath,['scripts/audit-science-layout.cjs','--slugs='+slugs,'--check'],{cwd:root,env:process.env,encoding:'utf8',windowsHide:true,timeout:170000,maxBuffer:4*1024*1024});
 assert.equal(r.status,0,r.stderr+r.stdout);
 const report=JSON.parse(r.stdout);assert.equal(report.apps,15);assert.deepEqual(report.failures,[]);assert.deepEqual(report.overlapReview,[]);
});
