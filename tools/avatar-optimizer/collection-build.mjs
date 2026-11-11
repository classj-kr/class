import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {NodeIO,Logger} from '@gltf-transform/core';
import {ALL_EXTENSIONS} from '@gltf-transform/extensions';
import {dedup,weld,prune,join,draco,simplify} from '@gltf-transform/functions';
import {MeshoptSimplifier} from 'meshoptimizer';
import draco3d from 'draco3dgltf';
import sharp from 'sharp';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const out=path.join(root,'outputs/qa/avatar-lab/compression-20261112');
const previous=path.join(root,'outputs/qa/avatar-lab/compression-20261111/draco');
await fs.mkdir(out,{recursive:true});
const index=JSON.parse(await fs.readFile(path.join(root,'apps/avatar-lab/collection-index.json'),'utf8'));
const seed=JSON.parse(await fs.readFile(path.join(previous,'manifest.json'),'utf8'));
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'draco3d.encoder':await draco3d.createEncoderModule(),'draco3d.decoder':await draco3d.createDecoderModule()});
await MeshoptSimplifier.ready;
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const animationSignature=d=>d.getRoot().listAnimations().map(a=>({name:a.getName(),channels:a.listChannels().map(c=>({node:c.getTargetNode().getName(),path:c.getTargetPath(),interpolation:c.getSampler().getInterpolation(),input:Array.from(c.getSampler().getInput().getArray()),output:Array.from(c.getSampler().getOutput().getArray())}))}));
function stats(d){let triangles=0;for(const s of d.getRoot().listScenes())s.traverse(n=>{for(const p of n.getMesh()?.listPrimitives()??[])triangles+=(p.getIndices()?.getCount()??p.getAttribute('POSITION').getCount())/3;});return{triangles,clips:d.getRoot().listAnimations().map(a=>a.getName()),textures:d.getRoot().listTextures().map(t=>sha(t.getImage()))};}
const manifest={date:'2026-11-12',budgetBytes:500000,scope:'169 local models; 4 previously verified plus remaining 165; no deployment',models:[],failures:[]};
try{Object.assign(manifest,JSON.parse(await fs.readFile(path.join(out,'manifest.json'),'utf8')));}catch{}
const overrides=JSON.parse(await fs.readFile(path.join(root,'tools/avatar-optimizer/collection-overrides.json'),'utf8').catch(()=>'{}'));
const requested=process.argv.slice(2);
async function save(){manifest.models.sort((a,b)=>index.avatars.findIndex(x=>x.id===a.id)-index.avatars.findIndex(x=>x.id===b.id));await fs.writeFile(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2));}
for(const entry of index.avatars.filter(e=>e.model)){
 const {id}=entry;if(requested.length&&!requested.includes(id))continue;
 try{
  const source=path.join(root,'apps/avatar-lab/models',id+'.glb'),bytes=await fs.readFile(source),sourceHash=sha(bytes);
  const old=manifest.models.find(m=>m.id===id);
  if(!requested.length&&old?.sourceHash===sourceHash&&sha(await fs.readFile(path.join(out,id+'.glb')).catch(()=>Buffer.alloc(0)))===old.hash)continue;
  const original=await io.readBinary(bytes),before=stats(original),animation=animationSignature(original);
  const seedModel=seed.models.find(m=>m.id===id&&m.sourceHash===sourceHash);
  if(seedModel&&!requested.length){const b=await fs.readFile(path.join(previous,id+'.glb'));assert.equal(sha(b),seedModel.hash);await fs.writeFile(path.join(out,id+'.glb'),b);manifest.models=manifest.models.filter(m=>m.id!==id);manifest.models.push({...seedModel,before,after:stats(await io.readBinary(b)),previouslyVerified:true,visualStatus:'previous-sample-verified'});await save();continue;}
  const plans=overrides[id]?.plans??[{size:null,error:0},{size:512,error:0},...[.0001,.0003,.0005,.001].map(error=>({size:512,error})),{size:384,error:0},...[.0001,.0003,.0005,.001].map(error=>({size:384,error}))];
  let best=null,bestBytes=null;const attempts=[];
  for(const plan of plans){
   const d=await io.readBinary(bytes);d.setLogger(new Logger(Logger.Verbosity.WARN));
   if(plan.size)for(const t of d.getRoot().listTextures())t.setImage(await sharp(t.getImage()).resize(plan.size,plan.size,{fit:'inside',withoutEnlargement:true}).webp({lossless:true,effort:6}).toBuffer());
   const textures=stats(d).textures;
   for(const m of d.getRoot().listMeshes())for(const p of m.listPrimitives()){
    const mat=p.getMaterial();if(mat?.getExtension('KHR_materials_unlit')&&!mat.getNormalTexture()){p.setAttribute('NORMAL',null);p.setAttribute('TANGENT',null);}
    if(mat&&!mat.getBaseColorTexture()&&!mat.getNormalTexture()&&!mat.getEmissiveTexture()&&!mat.getMetallicRoughnessTexture()&&!mat.getOcclusionTexture())p.setAttribute('TEXCOORD_0',null);
   }
   await d.transform(dedup(),weld());
   if(plan.error)await d.transform(simplify({simplifier:MeshoptSimplifier,ratio:0,error:plan.error,lockBorder:true}));
   if(plan.join!==false)await d.transform(join({keepNamed:false}));
   await d.transform(prune({keepLeaves:true}),draco({encodeSpeed:0,decodeSpeed:0,quantizePosition:plan.positionBits??14,quantizeTexcoord:14,quantizeColor:8}));
   const encoded=await io.writeBinary(d),decoded=await io.readBinary(encoded),after=stats(decoded);
   assert.deepEqual(animationSignature(decoded),animation,'Animation targets, keys, timing, interpolation preserved');
   assert.deepEqual(after.textures,textures,'Prepared WebP texture retained');
   const candidate={id,name:entry.name,sourceBytes:bytes.length,sourceHash,bytes:encoded.length,hash:sha(encoded),before,after,codec:'draco',textureSize:plan.size,error:plan.error,plan,under500KB:encoded.length<500000,animationsExact:true,visualStatus:'pending',previouslyVerified:false};
   attempts.push({plan,bytes:encoded.length,triangles:after.triangles});
   if(!best||encoded.length<best.bytes){best=candidate;bestBytes=encoded;}
   if(candidate.under500KB){best=candidate;bestBytes=encoded;break;}
  }
  assert.equal(sha(await fs.readFile(source)),sourceHash,'Original model untouched');
  best.attempts=attempts;await fs.writeFile(path.join(out,id+'.glb'),bestBytes);
  manifest.models=manifest.models.filter(m=>m.id!==id);manifest.models.push(best);manifest.failures=manifest.failures.filter(m=>m.id!==id);await save();
  console.log(JSON.stringify({id,bytes:best.bytes,texture:best.textureSize,error:best.error,under500KB:best.under500KB}));
 }catch(e){manifest.failures=manifest.failures.filter(m=>m.id!==id);manifest.failures.push({id,error:e.stack});await save();console.error(id+': '+e.message);}
}
console.log(JSON.stringify({models:manifest.models.length,under500KB:manifest.models.filter(m=>m.under500KB).length,failures:manifest.failures.length}));
