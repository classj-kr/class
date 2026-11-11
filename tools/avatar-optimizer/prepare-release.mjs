import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const root=path.resolve(import.meta.dirname,'../..');
const target=path.join(root,'outputs/avatar-release');
const qa=path.join(root,'outputs/qa/avatar-lab/compression-20261112');
const manifest=JSON.parse(await fs.readFile(path.join(qa,'manifest.json'),'utf8'));
const metrics=JSON.parse(await fs.readFile(path.join(qa,'pixel-comparisons.json'),'utf8'));
const pages=JSON.parse(await fs.readFile(path.join(qa,'manual-pages.json'),'utf8'));
assert.equal(manifest.models.length,169);assert.equal(metrics.results.length,169);
assert.equal(metrics.failures.length,0);assert.equal(new Set(pages.pages).size,29);
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
for(const m of manifest.models){
 const source=await fs.readFile(path.join(root,'apps/avatar-lab/models',m.id+'.glb'));
 const compressed=await fs.readFile(path.join(qa,m.id+'.glb'));
 assert.equal(hash(source),m.sourceHash);assert.equal(hash(compressed),m.hash);assert.ok(compressed.length<500000);
 const tested=metrics.results.find(r=>r.id===m.id);assert.equal(tested.sourceHash,m.sourceHash);assert.equal(tested.compressedHash,m.hash);
 if(metrics.flagged.includes(m.id))await fs.access(path.join(qa,'detail-'+m.id+'.webp')).catch(()=>fs.access(path.join(qa,'detail-'+m.id+'.png')));
}
const lab=path.join(target,'apps/avatar-lab');await fs.mkdir(lab,{recursive:true});
// Preserve the full authoring masters in the main working tree; release only compressed GLBs.
for(const e of await fs.readdir(path.join(root,'apps/avatar-lab'),{withFileTypes:true}))if(e.isFile())await fs.copyFile(path.join(root,'apps/avatar-lab',e.name),path.join(lab,e.name));
for(const m of manifest.models){
 await fs.copyFile(path.join(qa,m.id+'.glb'),path.join(lab,'models',m.id+'.glb'));
 await fs.copyFile(path.join(root,'apps/classtools/assets/avatars',m.id+'.webp'),path.join(target,'apps/classtools/assets/avatars',m.id+'.webp'));
}
const catalog=JSON.parse(await fs.readFile(path.join(lab,'collection-index.json'),'utf8'));
for(const a of catalog.avatars){const m=manifest.models.find(m=>m.id===a.id);assert.ok(m);a.revision=m.hash.slice(0,12);a.bytes=m.bytes;}
catalog.compression={codec:'draco',budgetBytes:500000,release:'2026-11-12',models:169,totalBytes:manifest.models.reduce((n,m)=>n+m.bytes,0)};
await fs.writeFile(path.join(lab,'collection-index.json'),JSON.stringify(catalog,null,2)+'\n');
const vendor=path.join(lab,'vendor/draco-1.4.1');await fs.mkdir(vendor,{recursive:true});
const three=path.join(root,'tools/avatar-optimizer/node_modules/three');
await fs.copyFile(path.join(three,'examples/js/loaders/DRACOLoader.js'),path.join(lab,'vendor/DRACOLoader.js'));
for(const name of ['draco_decoder.wasm','draco_wasm_wrapper.js','draco_decoder.js'])await fs.copyFile(path.join(three,'examples/js/libs/draco/gltf',name),path.join(vendor,name));
await fs.copyFile(path.join(three,'LICENSE'),path.join(lab,'vendor/THREE-LICENSE.txt'));
await fs.writeFile(path.join(lab,'avatar-loader.js'),`"use strict";
// One decoder pool per page. No decoder download until a compressed model is requested.
window.createClassJAvatarLoader = (() => {
  let decoder;
  return function () {
    decoder ||= new THREE.DRACOLoader().setDecoderPath('/apps/avatar-lab/vendor/draco-1.4.1/').setWorkerLimit(2);
    return new THREE.GLTFLoader().setDRACOLoader(decoder);
  };
})();
`);
for(const name of ['app.js','collection.js','collection-review.js','museum-preview.js']){
 const p=path.join(lab,name);let s=await fs.readFile(p,'utf8');s=s.replaceAll('new THREE.GLTFLoader()','window.createClassJAvatarLoader()');
 if(name==='app.js')s=s.replace('load(button.dataset.model,','load(button.dataset.model+\'?v=20261112-draco\',').replace('download.href=button.dataset.model;',"download.href=button.dataset.model+'?v=20261112-draco';");
 if(name==='collection.js')s=s.replace("document.querySelector('#save').href=item.model;","document.querySelector('#save').href=item.model+'?v='+item.revision;");
 await fs.writeFile(p,s);
}
const scripts='<script src="/apps/avatar-lab/vendor/DRACOLoader.js?v=20261112"></script><script src="/apps/avatar-lab/avatar-loader.js?v=20261112"></script>';
for(const name of ['index.html','collection.html','collection-review.html']){
 const p=path.join(lab,name);let s=await fs.readFile(p,'utf8');s=s.replace(/(<script src="[^"]*GLTFLoader.js"><\/script>)/,'$1'+scripts);await fs.writeFile(p,s);
}
const museum=path.join(target,'learning/arts/art-appreciation/museum/index.html');
let html=await fs.readFile(museum,'utf8');html=html.replace('<script src="/apps/avatar-lab/museum-preview.js"></script>',scripts+'<script src="/apps/avatar-lab/museum-preview.js?v=20261112"></script>');await fs.writeFile(museum,html);
const release={date:'2026-11-12',models:169,budgetBytes:500000,totalBytes:catalog.compression.totalBytes,verification:{browserDecode:169,manualSheets:29,closeups:metrics.flagged,clips:'All source clips, four phases, four directions; animation channels round-trip unchanged.',scope:'Compression fidelity against existing 3D masters. Does not certify redesign fidelity to every 2D illustration.',limitations:'Small texture resampling and fine-edge differences remain, most noticeable on peacock feathers at close zoom. Museum performance tested on desktop with four repeated representative avatars, not 30 unique avatars or low-end school devices.'},models:manifest.models.map(m=>({id:m.id,bytes:m.bytes,sha256:m.hash,sourceSha256:m.sourceHash}))};
await fs.writeFile(path.join(lab,'compression-report.json'),JSON.stringify(release,null,2)+'\n');
await fs.writeFile(path.join(qa,'release-report.json'),JSON.stringify(release,null,2)+'\n');
console.log(JSON.stringify({target,models:169,bytes:release.totalBytes}));
