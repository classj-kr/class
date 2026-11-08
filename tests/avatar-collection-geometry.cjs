"use strict";
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const THREE=require('../learning/arts/art-appreciation/museum/vendor/three.min.js');
const profiles=require('../apps/avatar-lab/collection-profiles.cjs'),make=require('../apps/avatar-lab/avatar-factory.cjs').create;
const results=[];
function minimumSurfaceY(object){let min=Infinity;object.updateMatrixWorld(true);object.traverse(mesh=>{if(!mesh.isMesh)return;const p=mesh.geometry.attributes.position,m=mesh.matrixWorld.elements;for(let i=0;i<p.count;i++)min=Math.min(min,m[1]*p.getX(i)+m[5]*p.getY(i)+m[9]*p.getZ(i)+m[13]);});return min;}
for(const profile of Object.values(profiles)){
 if(profile.shape==='custom')continue;
 if(process.argv.length>2&&!process.argv.slice(2).includes(profile.id))continue;
 const {root,clips}=make(THREE,profile.id),errors=[];let triangles=0;
 const motion=root.userData.locomotion||profile.motion;
 function check(ok,message){if(!ok)errors.push(message);}
 root.traverse(o=>{if(!o.isMesh)return;const p=o.geometry.attributes.position,index=o.geometry.index;triangles+=(index?index.count:p.count)/3;check(o.material.isMeshBasicMaterial,o.name+' lit material');check(Array.from(p.array).every(Number.isFinite),o.name+' invalid vertex');
  if(o.name.endsWith('Solid')){const edges=new Map(),coord=i=>[p.getX(i),p.getY(i),p.getZ(i)].map(v=>Math.round(v*1e5)).join(',');for(let i=0;i<index.count;i+=3){const v=[0,1,2].map(j=>coord(index.getX(i+j)));if(new Set(v).size<3)continue;for(let j=0;j<3;j++){const edge=[v[j],v[(j+1)%3]].sort().join('|');edges.set(edge,(edges.get(edge)||0)+1);}}check([...edges.values()].every(n=>n===2),o.name+' non-manifold edge');}
 });
 const legNames=['LeftLeg','RightLeg'];for(const n of legNames){let count=0;root.traverse(o=>{if(o.name===n)count++;});check(count===(motion==='walk'?1:0),n+' anatomy');}
 for(const clip of clips){const mixer=new THREE.AnimationMixer(root);mixer.clipAction(clip).play();for(let i=0;i<24;i++){mixer.setTime(clip.duration*i/24);root.updateMatrixWorld(true);check(minimumSurfaceY(root)>-.006,'below floor '+clip.name);if(motion==='walk'){const foot=Math.min(...legNames.map(n=>new THREE.Box3().setFromObject(root.getObjectByName(n)).min.y));check(foot<.008&&foot>-.006,'unplanted '+clip.name);}}mixer.stopAllAction();}
 if(profile.id.startsWith('sport-')&&profile.id!=='sport-bowling'){const ball=root.getObjectByName('Ball');check(ball&&Math.abs(ball.scale.x-ball.scale.z)<1e-6&&Math.abs(ball.scale.x-ball.scale.y)<1e-6,'sports ball must be spherical');}
 if(profile.id==='vehicle-train'){const wheels=[];root.traverse(o=>{if(/^Wheel(Left|Right)(Front|Rear)$/.test(o.name))wheels.push(o);});check(wheels.length===4,'train requires four wheels');}
 for(const clip of clips)for(const track of clip.tracks){const node=track.name.slice(0,track.name.lastIndexOf('.'));check(!!root.getObjectByName(node),'missing animated node '+node);check(Array.from(track.values).every(Number.isFinite),'non-finite animation '+track.name);}
 const data=fs.readFileSync(path.resolve(__dirname,'../apps/avatar-lab/models',profile.id+'.glb'));const len=data.readUInt32LE(12),gltf=JSON.parse(data.subarray(20,20+len));
 const expectedClips=['Idle','Walk','Wave',...(root.userData.effectClip?[root.userData.effectClip]:[])];
 check(JSON.stringify(gltf.animations.map(c=>c.name).sort())===JSON.stringify(expectedClips.sort()),'export clips');
 check(gltf.materials.every(m=>m.extensions?.KHR_materials_unlit),'export lighting');
 if(profile.id==='theme-snowman')for(const n of ['LeftArm','RightArm','LeftLeg','RightLeg'])check(!root.getObjectByName(n),'snowman must be limbless: '+n);
 const exportedTriangles=gltf.meshes.reduce((s,m)=>s+m.primitives.reduce((t,p)=>t+(p.indices===undefined?gltf.accessors[p.attributes.POSITION].count:gltf.accessors[p.indices].count)/3,0),0);check(exportedTriangles===triangles,'exported geometry is stale');
 for(const node of gltf.nodes){if(node.mesh===undefined)continue;const object=root.getObjectByName(node.name);check(!!object?.isMesh,'missing source mesh '+node.name);if(!object?.isMesh)continue;for(const primitive of gltf.meshes[node.mesh].primitives)for(const [semantic,name] of [['POSITION','position'],['NORMAL','normal'],['TEXCOORD_0','uv'],['COLOR_0','color']]){const accessorIndex=primitive.attributes[semantic];if(accessorIndex===undefined)continue;const attribute=object.geometry.attributes[name],accessor=gltf.accessors[accessorIndex],view=gltf.bufferViews[accessor.bufferView],start=28+len+(view.byteOffset||0)+(accessor.byteOffset||0),expected=Buffer.from(attribute.array.buffer,attribute.array.byteOffset,attribute.array.byteLength);check(data.subarray(start,start+expected.length).equals(expected),'stale exported '+semantic+' '+node.name);}}
 if(root.userData.sourceChecksum)check(gltf.nodes[0].extras.sourceChecksum===root.userData.sourceChecksum,'stale source profile checksum');
 const image=gltf.bufferViews[gltf.images[0].bufferView];check(data.subarray(28+len+image.byteOffset,28+len+image.byteOffset+image.byteLength).equals(fs.readFileSync(path.resolve(__dirname,'../apps/classtools/assets/avatars',profile.id+'.webp'))),'original artwork bytes');
 results.push({id:profile.id,modelSha256:crypto.createHash('sha256').update(data).digest('hex'),triangles,bytes:data.length,errors:[...new Set(errors)]});if(errors.length)console.log(profile.id+': '+[...new Set(errors)].join(', '));
 root.traverse(o=>{if(o.isMesh){o.geometry.dispose();o.material.dispose();}});
}
fs.writeFileSync(path.resolve(__dirname,'../outputs/qa/avatar-lab/all-152/'+(process.argv.length>2?'geometry-targeted.json':'geometry.json')),JSON.stringify({count:results.length,passed:results.filter(r=>!r.errors.length).length,results},null,2));
assert.equal(results.filter(r=>r.errors.length).length,0,'collection geometry failures');console.log('PASS '+results.length+' collection avatars: closed silhouette solids, finite animation, correct leg count, floor contact, original artwork and exported clips.');
