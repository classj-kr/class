import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {NodeIO} from '@gltf-transform/core';
import {ALL_EXTENSIONS} from '@gltf-transform/extensions';
import draco from 'draco3dgltf';
const root=path.resolve(import.meta.dirname,'../..'),release=path.join(root,'outputs/avatar-release');
const index=JSON.parse(await fs.readFile(path.join(release,'apps/avatar-lab/collection-index.json'),'utf8'));
const manifest=JSON.parse(await fs.readFile(path.join(root,'outputs/qa/avatar-lab/compression-20261112/manifest.json'),'utf8'));
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'draco3d.decoder':await draco.createDecoderModule()});
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const signature=d=>d.getRoot().listAnimations().map(a=>({name:a.getName(),channels:a.listChannels().map(c=>({node:c.getTargetNode().getName(),path:c.getTargetPath(),interpolation:c.getSampler().getInterpolation(),input:Array.from(c.getSampler().getInput().getArray()),output:Array.from(c.getSampler().getOutput().getArray())}))}));
assert.equal(index.avatars.length,169);let bytes=0;
for(const a of index.avatars){
 const m=manifest.models.find(m=>m.id===a.id),buf=await fs.readFile(path.join(release,'apps/avatar-lab',a.model));
 assert.equal(sha(buf),m.hash);assert.equal(a.revision,m.hash.slice(0,12));assert.equal(a.bytes,buf.length);assert.ok(buf.length<500000);
 const source=await fs.readFile(path.join(root,'apps/avatar-lab/models',a.id+'.glb'));assert.equal(sha(source),m.sourceHash);
 const orig=await io.readBinary(source),small=await io.readBinary(buf);assert.deepEqual(signature(small),signature(orig),a.id+' animation mismatch');
 for(const t of small.getRoot().listTextures())assert.equal(t.getMimeType(),'image/webp');
 const original=await fs.readFile(path.resolve(release,'apps/classtools/assets/avatars',a.id+'.webp'));assert.equal(sha(original).slice(0,12),a.sourceRevision,a.id+' source artwork');
 bytes+=buf.length;
}
for(const f of ['index.html','collection.html','collection-review.html']){const html=await fs.readFile(path.join(release,'apps/avatar-lab',f),'utf8');assert.ok(html.includes('DRACOLoader.js'));assert.ok(html.includes('avatar-loader.js'));}
const result={models:169,bytes,maxBytes:Math.max(...index.avatars.map(a=>a.bytes)),sourceHashes:true,releaseHashes:true,artworkHashes:true,animationChannelsExact:true,webpTextures:true};
await fs.writeFile(path.join(root,'outputs/qa/avatar-lab/compression-20261112/release-verification.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));
