"use strict";
const fs=require("node:fs"),path=require("node:path"),crypto=require("node:crypto");
const root=path.resolve(__dirname,".."),source=path.join(root,"apps/classtools/assets/avatars"),destination=path.join(root,"apps/avatar-lab/catalog.json");
const previous=fs.existsSync(destination)?JSON.parse(fs.readFileSync(destination,"utf8")):{avatars:[]};
const known=new Map(previous.avatars.map(a=>[a.id,a]));
const inspected={"animal-cat":"animal costume with ears and attached tail","food-ramen":"open bowl with volumetric toppings","food-donut":"ring-shaped hood surrounding face","fruit-banana":"curved fruit with peeled flaps","vehicle-helicopter":"vehicle hood with rotor and tail","object-umbrella":"umbrella canopy and curved handle"};
const avatars=fs.readdirSync(source).filter(f=>f.endsWith(".webp")).sort().map(file=>{
  const id=file.slice(0,-5),old=known.get(id),hash=crypto.createHash("sha256").update(fs.readFileSync(path.join(source,file))).digest("hex");
  const model=path.join(root,`apps/avatar-lab/models/${id}.glb`),modelSha256=fs.existsSync(model)?crypto.createHash("sha256").update(fs.readFileSync(model)).digest("hex"):null;
  const retained=old?.sourceSha256===hash&&(!modelSha256||old.modelSha256===modelSha256)?old:{};
  const checks=retained.checks||Object.fromEntries(['identity','allViews','connections','animation','glb','museumRuntime'].map(k=>[k,old?.checks?.[k]==='failed'?'failed':'pending']));
  // A changed file is not evidence that a known visual defect was repaired.
  // Retain failures until a dated, model-hash-bound visual review resolves them.
  const status=retained.status||(old?.status==='needs_remodeling'?'needs_remodeling':modelSha256?'needs_review':'not_started');
  return {...retained,id,source:`apps/classtools/assets/avatars/${file}`,sourceCategory:id.split("-")[0],sourceSha256:hash,modelSha256,structureNote:old?.structureNote||inspected[id]||null,status,checks};
});
const categories={};for(const avatar of avatars)categories[avatar.sourceCategory]=(categories[avatar.sourceCategory]||0)+1;
const catalog={schemaVersion:1,count:avatars.length,categoryCounts:categories,styleReferences:["animal-cat","food-ramen"],suggestedStructureSamples:Object.keys(inspected),completionRule:"Every visual and technical check must pass, including museumRuntime; a prototype is not a production-complete avatar.",avatars};
fs.writeFileSync(destination,JSON.stringify(catalog,null,2)+"\n");console.log(JSON.stringify({count:catalog.count,categoryCounts:categories,inspectedStructures:Object.keys(inspected).length,destination},null,2));
