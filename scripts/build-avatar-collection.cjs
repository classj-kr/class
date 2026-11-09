"use strict";
const fs=require("node:fs"),path=require("node:path"),crypto=require('node:crypto'),{spawnSync}=require("node:child_process");
const root=path.resolve(__dirname,".."),profiles=require("../apps/avatar-lab/collection-profiles.cjs");
const acceptedReview=require('./avatar-review-status.cjs');
const catalogPath=path.join(root,'apps/avatar-lab/catalog.json'),catalog=new Map((fs.existsSync(catalogPath)?JSON.parse(fs.readFileSync(catalogPath,'utf8')).avatars:[]).map(a=>[a.id,a]));
const selected=process.argv.slice(2),keys=selected.includes('--index-only')?[]:selected.length?selected:Object.keys(profiles).filter(id=>profiles[id].shape!=="custom");
for(const id of keys){
  const result=spawnSync(process.execPath,[path.join(__dirname,"build-cat-avatar.cjs"),id],{cwd:root,encoding:"utf8"});
  if(result.status!==0){process.stderr.write(result.stderr||result.stdout);process.exit(result.status||1);}
  const data=JSON.parse(result.stdout);console.log(id+": "+data.triangles+" triangles, "+Math.round(data.bytes/1024)+" KiB");
}
const avatars=Object.values(profiles).map(p=>{
  const file=path.join(root,"apps/avatar-lab/models",p.id+".glb");
  const bytes=fs.existsSync(file)?fs.readFileSync(file):null,gltf=bytes?JSON.parse(bytes.subarray(20,20+bytes.readUInt32LE(12))):null,meta=gltf?.nodes[0].extras||{};
  const sourceSha256=crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'apps/classtools/assets/avatars',p.id+'.webp'))).digest('hex'),modelSha256=bytes?crypto.createHash('sha256').update(bytes).digest('hex'):null;
  const record=catalog.get(p.id);let complete=false;
  if(record?.status==='complete'&&record.reviewEvidence){
   try{const report=JSON.parse(fs.readFileSync(path.join(root,record.reviewEvidence),'utf8'));complete=acceptedReview(record,report,modelSha256,sourceSha256)&&report.proofs.every(file=>fs.existsSync(path.join(root,file)));}catch{/* Missing evidence returns the model to its draft category. */}
  }
  return{id:p.id,name:p.name,category:p.id.split("-")[0],shape:p.shape,locomotion:meta.locomotion||p.motion,canWave:meta.canWave??(p.motion==="walk"&&!p.holdArms),status:complete?'complete':p.shape==='custom'?'prototype':'needs_remodeling',model:bytes?"models/"+p.id+".glb":null,revision:modelSha256?.slice(0,12)||null,sourceRevision:sourceSha256.slice(0,12),original:"../classtools/assets/avatars/"+p.id+".webp",bytes:bytes?.length||0};
});
const output=path.join(root,"apps/avatar-lab/collection-index.json");
require('./replace-generated-file.cjs')(output,JSON.stringify({count:avatars.length,available:avatars.filter(a=>a.model).length,avatars},null,2)+"\n");
