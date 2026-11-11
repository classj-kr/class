import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { NodeIO, Logger } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, weld, prune, meshopt, simplify, join, draco } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptDecoder, MeshoptSimplifier } from 'meshoptimizer';
import draco3d from 'draco3dgltf';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const codec=process.env.AVATAR_CODEC==='meshopt'?'meshopt':'draco';
const output = path.join(root, 'outputs/qa/avatar-lab/compression-20261111',codec==='draco'?'draco':'');
const ids = process.argv.slice(2);
if (!ids.length) ids.push('theme-heart', 'animal-cat', 'food-ramen', 'animal-peacock');
await fs.mkdir(output, { recursive: true });
await Promise.all([MeshoptEncoder.ready, MeshoptDecoder.ready, MeshoptSimplifier.ready]);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder,
  'draco3d.encoder': await draco3d.createEncoderModule(), 'draco3d.decoder': await draco3d.createDecoderModule(),
});
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const animationSignature=doc=>doc.getRoot().listAnimations().map(a=>({name:a.getName(),channels:a.listChannels().map(c=>({node:c.getTargetNode().getName(),path:c.getTargetPath(),interpolation:c.getSampler().getInterpolation(),input:Array.from(c.getSampler().getInput().getArray()),output:Array.from(c.getSampler().getOutput().getArray())}))}));
const stats = doc => ({
  triangles: doc.getRoot().listMeshes().reduce((n,m) => n+m.listPrimitives().reduce((s,p)=>s+(p.getIndices()?.getCount()??p.getAttribute('POSITION').getCount())/3,0),0),
  clips: doc.getRoot().listAnimations().map(a=>a.getName()),
  textures: doc.getRoot().listTextures().map(t=>sha(t.getImage())),
});
const index=JSON.parse(await fs.readFile(path.join(root,'apps/avatar-lab/collection-index.json'),'utf8'));
const results=[];
for (const id of ids) {
  assert.match(id,/^[a-z]+-[a-z-]+$/);
  const source=path.join(root,'apps/avatar-lab/models',id+'.glb');
  const bytes=await fs.readFile(source), original=await io.readBinary(bytes), before=stats(original);
  const attempts=[];
  const textureSize=codec==='draco'&&id==='animal-peacock'?512:null;
  let accepted;
  // First try without removing triangles. Only use conservative simplification if needed.
  for(const error of [0,0.0001,0.0005,0.001,0.002,0.004,0.006]) {
    const doc=await io.readBinary(bytes);
    doc.setLogger(new Logger(Logger.Verbosity.WARN));
    if(textureSize)for(const t of doc.getRoot().listTextures()) {
      t.setImage(await sharp(t.getImage()).resize(textureSize,textureSize,{fit:'inside',withoutEnlargement:true}).webp({lossless:true,effort:6}).toBuffer());
    }
    const expectedTextures=stats(doc).textures;
    for(const mesh of doc.getRoot().listMeshes()) for(const p of mesh.listPrimitives()) {
      const mat=p.getMaterial();
      if(mat?.getExtension('KHR_materials_unlit')&&!mat.getNormalTexture()) {
        p.setAttribute('NORMAL',null); p.setAttribute('TANGENT',null);
      }
      // UVs without any texture are not used by these original unlit materials.
      if(mat&&!mat.getBaseColorTexture()&&!mat.getNormalTexture()&&!mat.getEmissiveTexture()&&!mat.getMetallicRoughnessTexture()&&!mat.getOcclusionTexture()) p.setAttribute('TEXCOORD_0',null);
    }
    await doc.transform(dedup(),weld());
    if(error) await doc.transform(simplify({simplifier:MeshoptSimplifier,ratio:0,error,lockBorder:true}));
    await doc.transform(join({keepNamed:false}));
    await doc.transform(prune({keepLeaves:true}),codec==='draco'?draco({encodeSpeed:0,decodeSpeed:0,quantizePosition:14,quantizeTexcoord:14,quantizeColor:8}):meshopt({encoder:MeshoptEncoder,level:'high',quantizePosition:14,quantizeTexcoord:14,quantizeColor:8}));
    const compressed=await io.writeBinary(doc);
    const decoded=await io.readBinary(compressed),after=stats(decoded);
    assert.deepEqual(after.clips,before.clips,'Animation clips retained');
    if(codec==='draco')assert.deepEqual(animationSignature(decoded),animationSignature(original),'Animation targets, timings and transforms unchanged');
    assert.deepEqual(after.textures,expectedTextures,'Prepared WebP bytes retained');
    attempts.push({error,bytes:compressed.length,triangles:after.triangles});
    const candidate={id,codec,textureSize,name:index.avatars.find(a=>a.id===id)?.name??id,sourceBytes:bytes.length,sourceHash:sha(bytes),bytes:compressed.length,hash:sha(compressed),before,after,error,attempts,under500KB:compressed.length<500000};
    await fs.writeFile(path.join(output,id+'.glb'),compressed);
    accepted=candidate;
    if(candidate.under500KB)break;
  }
  assert.equal(sha(await fs.readFile(source)),sha(bytes),'Source file untouched');
  results.push(accepted);
  console.log(JSON.stringify({id,sourceBytes:bytes.length,bytes:accepted.bytes,error:accepted.error,triangles:accepted.after.triangles,under500KB:accepted.under500KB}));
}
await fs.writeFile(path.join(output,'manifest.json'),JSON.stringify({budgetBytes:500000,originalsUnchanged:true,textureBytesUnchanged:results.every(x=>!x.textureSize),visualStatus:'pending',models:results},null,2));
