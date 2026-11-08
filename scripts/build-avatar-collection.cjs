"use strict";
const fs=require("node:fs"),path=require("node:path"),crypto=require('node:crypto'),{spawnSync}=require("node:child_process");
const root=path.resolve(__dirname,".."),profiles=require("../apps/avatar-lab/collection-profiles.cjs");
const selected=process.argv.slice(2),keys=selected.includes('--index-only')?[]:selected.length?selected:Object.keys(profiles).filter(id=>profiles[id].shape!=="custom");
for(const id of keys){
  const result=spawnSync(process.execPath,[path.join(__dirname,"build-cat-avatar.cjs"),id],{cwd:root,encoding:"utf8"});
  if(result.status!==0){process.stderr.write(result.stderr||result.stdout);process.exit(result.status||1);}
  const data=JSON.parse(result.stdout);console.log(id+": "+data.triangles+" triangles, "+Math.round(data.bytes/1024)+" KiB");
}
const avatars=Object.values(profiles).map(p=>{
  const file=path.join(root,"apps/avatar-lab/models",p.id+".glb");
  const bytes=fs.existsSync(file)?fs.readFileSync(file):null,gltf=bytes?JSON.parse(bytes.subarray(20,20+bytes.readUInt32LE(12))):null,meta=gltf?.nodes[0].extras||{};
  return{id:p.id,name:p.name,category:p.id.split("-")[0],shape:p.shape,locomotion:meta.locomotion||p.motion,canWave:meta.canWave??(p.motion==="walk"&&!p.holdArms),status:p.shape==='custom'?'prototype':'needs_remodeling',model:bytes?"models/"+p.id+".glb":null,revision:bytes?crypto.createHash('sha256').update(bytes).digest('hex').slice(0,12):null,original:"../classtools/assets/avatars/"+p.id+".webp",bytes:bytes?.length||0};
});
const output=path.join(root,"apps/avatar-lab/collection-index.json");
require('./replace-generated-file.cjs')(output,JSON.stringify({count:avatars.length,available:avatars.filter(a=>a.model).length,avatars},null,2)+"\n");
