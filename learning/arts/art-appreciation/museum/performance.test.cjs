'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const perf=require('./performance.js');
const THREE=require('./vendor/three.min.js');
test('outdoor batches preserve shadows, spatial culling and clickable descendants',()=>{
  const root=new THREE.Group(),mat=new THREE.MeshBasicMaterial(),zone=new THREE.Group();root.add(zone);
  for(const x of [1,2,50]){const m=new THREE.Mesh(new THREE.BoxGeometry(),mat);m.position.x=x;m.castShadow=m.receiveShadow=true;root.add(m);}
  const sculpture=new THREE.Mesh(new THREE.BoxGeometry(),mat);zone.add(sculpture);
  perf.batchStaticMeshes(THREE,root,[zone],{cellSize:24});
  assert.equal(sculpture.parent,zone);const merged=root.children.find(o=>o.name==='Static gallery batch');assert.ok(merged.castShadow&&merged.receiveShadow);
  assert.equal(root.children.filter(o=>o.isMesh).length,2);assert.ok(merged.geometry.boundingBox.max.x<3);
});
test('outdoor follow camera cannot enter a plinth or the park boundary',()=>{
  const follow=require('../park/follow-camera.js');
  assert.equal(follow.position({x:0,z:0},0,[]).distance,2.6);
  assert.ok(follow.position({x:0,z:0},0,[{x:0,z:2,r:1}]).z<1);
  assert.ok(follow.position({x:0,z:0},0,[{x:0,z:2,hx:1,hz:1}]).z<1);
  assert.ok(follow.position({x:0,z:84},0,[]).z<=85);
});
function texture(){return{isTexture:true,userData:{},disposed:0,dispose(){this.disposed++;}};}
test('room disposal releases owned textures once and preserves shared and retained art',()=>{
  const shared=texture(),art=texture(),label=texture(),placeholder=texture(),sharedMaterial={map:shared},materials=[{map:art,dispose(){}},{map:label,dispose(){}},{map:placeholder,otherMap:shared,dispose(){}}];
  const g={count:0,dispose(){this.count++;}},root={traverse(fn){for(const material of [...materials,materials[1],sharedMaterial])fn({geometry:g,material});}};
  perf.disposeRoom(root,new Set([sharedMaterial]),new Set([art]));assert.equal(shared.disposed,0);assert.equal(art.disposed,0);assert.equal(label.disposed,1);assert.equal(placeholder.disposed,1);assert.equal(g.count,1);
  const cache=new Map([['old',label],['current',art]]);perf.retainRoomTextures(cache,['current']);assert.equal(cache.size,1);assert.equal(art.disposed,0);
});
test('replacing artwork disposes its temporary loading image',()=>{const p=texture(),art=texture();p.userData.museumPlaceholder=true;const material={map:p};perf.replaceArtwork(material,art);perf.replaceArtwork(material,art);assert.equal(p.disposed,1);assert.equal(art.disposed,0);});
test('stale room image requests do not repopulate the texture cache',()=>{
  const source=fs.readFileSync(__dirname+'/museum.js','utf8'),start=source.indexOf('  function loadArtTexture('),end=source.indexOf('\n  function markLoaded',start);let success;
  const context={textureCache:new Map(),textureLoader:{load(url,callback){success=callback;}},isCurrentRoomLoad:()=>false};
  const load=vm.runInNewContext('('+source.slice(start,end).trim()+')',context);load({image:'old.webp'},{},{},1,1,{});const t=texture();success(t);assert.equal(t.disposed,1);assert.equal(context.textureCache.size,0);
});
test('batching preserves world-space geometry and excludes interactive and translucent meshes',()=>{
  const root=new THREE.Group(),material=new THREE.MeshBasicMaterial(),group=new THREE.Group();root.add(group);group.position.set(3,2,-4);group.rotation.y=.4;
  const a=new THREE.Mesh(new THREE.BoxGeometry(1,2,3),material),b=new THREE.Mesh(new THREE.BoxGeometry(2,1,1),material);b.position.x=2;group.add(a,b);
  const clickable=new THREE.Mesh(new THREE.PlaneGeometry(),material),transparent=new THREE.Mesh(new THREE.PlaneGeometry(),new THREE.MeshBasicMaterial({transparent:true}));root.add(clickable,transparent);root.updateMatrixWorld(true);
  const before=new THREE.Box3().setFromObject(group),triangles=(a.geometry.index.count+b.geometry.index.count)/3;
  assert.equal(perf.batchStaticMeshes(THREE,root,[clickable]),1);const merged=root.children.find(o=>o.name==='Static gallery batch');assert.ok(merged);assert.equal(merged.geometry.attributes.position.count/3,triangles);const after=new THREE.Box3().setFromObject(merged);assert.ok(after.min.distanceTo(before.min)<1e-6);assert.ok(after.max.distanceTo(before.max)<1e-6);assert.equal(clickable.parent,root);assert.equal(transparent.parent,root);
});
test('frame policy suspends dialog and hidden rendering and wakes on close',()=>{
  const policy=perf.createFramePolicy();assert.equal(policy.draw(0,{active:true}),true);assert.equal(policy.draw(5,{active:true}),false);assert.equal(policy.draw(17,{active:true}),true);assert.equal(policy.draw(30,{modal:true}),true);assert.equal(policy.draw(1000,{modal:true}),false);assert.equal(policy.draw(1001,{modal:false}),true);assert.equal(policy.draw(1100,{hidden:true}),false);assert.equal(policy.draw(1101,{}),true);
});
test('resolution reacts only to sustained slow movement; idle is not treated as a slow GPU',()=>{
  const b=perf.createResolutionBudget();for(let i=0;i<100;i++)assert.equal(b.sample(70,false),1);for(let i=0;i<59;i++)assert.equal(b.sample(30,true),1);assert.equal(b.sample(30,true),.9);for(let i=0;i<480;i++)b.sample(16.7,true);assert.equal(b.sample(16.7,true),1);
});
test('resizing or restoring a dialog repaints its background once',()=>{
  const p=perf.createFramePolicy();p.draw(0,{modal:true});assert.equal(p.draw(17,{modal:true}),false);p.invalidate();assert.equal(p.draw(18,{modal:true}),true);assert.equal(p.draw(35,{modal:true}),false);p.draw(36,{hidden:true,modal:true});assert.equal(p.draw(37,{modal:true}),true);
});
test('idle state does not need movement broadcasts, but stop and room change do',()=>{const a={room:'portrait',x:0,z:0,yaw:0,moving:false};assert.equal(perf.presenceChanged(a,{...a}),false);assert.equal(perf.presenceChanged(a,{...a,moving:true}),true);assert.equal(perf.presenceChanged(a,{...a,room:'nature'}),true);});
