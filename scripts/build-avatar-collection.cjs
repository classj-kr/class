"use strict";
const fs=require("node:fs"),path=require("node:path"),{spawnSync}=require("node:child_process");
const root=path.resolve(__dirname,".."),profiles=require("../apps/avatar-lab/collection-profiles.cjs");
const selected=process.argv.slice(2),keys=selected.length?selected:Object.keys(profiles).filter(id=>profiles[id].shape!=="custom");
for(const id of keys){
  const result=spawnSync(process.execPath,[path.join(__dirname,"build-cat-avatar.cjs"),id],{cwd:root,encoding:"utf8"});
  if(result.status!==0){process.stderr.write(result.stderr||result.stdout);process.exit(result.status||1);}
  const data=JSON.parse(result.stdout);console.log(id+": "+data.triangles+" triangles, "+Math.round(data.bytes/1024)+" KiB");
}
const avatars=Object.values(profiles).map(p=>{
  const file=path.join(root,"apps/avatar-lab/models",p.id+".glb");
  return{id:p.id,name:p.name,category:p.id.split("-")[0],shape:p.shape,locomotion:p.motion,canWave:p.motion==="walk"&&!p.holdArms,model:fs.existsSync(file)?"models/"+p.id+".glb":null,original:"../classtools/assets/avatars/"+p.id+".webp",bytes:fs.existsSync(file)?fs.statSync(file).size:0};
});
fs.writeFileSync(path.join(root,"apps/avatar-lab/collection-index.json"),JSON.stringify({count:avatars.length,available:avatars.filter(a=>a.model).length,avatars},null,2)+"\n");
