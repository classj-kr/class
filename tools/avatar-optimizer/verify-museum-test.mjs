import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {NodeIO} from '@gltf-transform/core';
import {ALL_EXTENSIONS} from '@gltf-transform/extensions';
import draco3d from 'draco3dgltf';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const out=path.join(root,'outputs/qa/avatar-lab/compression-20261111/draco');
const report=JSON.parse(await fs.readFile(path.join(out,'museum-performance.json'),'utf8'));
const sources=JSON.parse(await fs.readFile(path.join(out,'museum-source-hashes.json'),'utf8'));
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
for(const [file,expected]of Object.entries(sources))assert.equal(hash(await fs.readFile(path.join(root,'learning/arts/art-appreciation/museum',file))),expected,'Museum source unchanged: '+file);
assert.equal(report.results.length,15);
assert.deepEqual(report.assetFailures,[],'All scene/model assets loaded');
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'draco3d.decoder':await draco3d.createDecoderModule()});
const counts=[];
for(const m of report.inputModels){const bytes=await fs.readFile(path.join(out,m.id+'.glb'));assert.equal(hash(bytes),m.hash);const doc=await io.readBinary(bytes);let triangles=0;for(const scene of doc.getRoot().listScenes())scene.traverse(n=>{for(const p of n.getMesh()?.listPrimitives()??[])triangles+=(p.getIndices()?.getCount()??p.getAttribute('POSITION').getCount())/3;});counts.push(triangles);}
const rooms=[...new Set(report.results.map(r=>r.room))];assert.equal(rooms.length,5);
for(const room of rooms){const rows=report.results.filter(r=>r.room===room);assert.deepEqual(rows.map(r=>r.count),[0,10,30]);for(const r of rows){assert.equal(r.hiddenFrames,0);assert.equal(r.assetsPending,0);assert.equal(r.artLoadingComplete,true);assert.equal(r.roomTitle,room);assert.ok(r.frames>=200&&r.measuredMs>=7900);assert.deepEqual(r.camera,rows[0].camera,'Same camera for comparison');assert.deepEqual(r.camera,r.finalCamera,'Camera stable throughout measured endpoints');assert.ok(Number.isFinite(r.fps)&&r.fps>0);if(report.environment.gpuTimerSupported){assert.equal(r.gpuDisjoint,0);assert.ok(r.gpuSamples>=100&&r.gpuMedianMs>0);}let expected=rows[0].triangles;for(let i=0;i<r.count;i++)expected+=counts[i%counts.length];assert.equal(r.triangles,expected,'All avatar geometry submitted for '+room+'/'+r.count);}}
report.verification={museumSourcesUnchanged:true,sceneAndAvatarAssetsLoaded:true,all15ConditionsMeasured:true,sameCameraPerRoom:true,noBackgroundFrames:true,allAvatarTrianglesSubmitted:true,sceneTrianglesPerAvatar:counts};
report.museumSourceHashes=sources;
await fs.writeFile(path.join(out,'museum-performance.json'),JSON.stringify(report,null,2));
console.log('PASS: 15 conditions, visible frames, same camera, no missing assets, all 10/30 avatar geometry rendered, original museum source hashes unchanged.');
