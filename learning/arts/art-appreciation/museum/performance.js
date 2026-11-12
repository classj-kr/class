(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.MuseumPerformance=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  function disposeRoom(root,sharedMaterials,retainedTextures){
    const geometries=new Set(),materials=new Set(),textures=new Set();
    retainedTextures=new Set(retainedTextures);
    for(const m of sharedMaterials)for(const value of Object.values(m))if(value?.isTexture)retainedTextures.add(value);
    root.traverse(o=>{if(o.geometry)geometries.add(o.geometry);for(const m of o.material?(Array.isArray(o.material)?o.material:[o.material]):[]){if(sharedMaterials.has(m))continue;materials.add(m);for(const value of Object.values(m))if(value?.isTexture&&!retainedTextures.has(value))textures.add(value);}});
    geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());
  }
  function retainRoomTextures(cache,urls){
    const keep=new Set(urls);
    for(const [url,texture]of cache)if(!keep.has(url)){texture.dispose();cache.delete(url);}
  }
  function replaceArtwork(material,texture){
    const previous=material.map;material.map=texture;material.needsUpdate=true;
    if(previous!==texture&&previous?.userData?.museumPlaceholder)previous.dispose();
  }
  function batchStaticMeshes(THREE,root,interactive){
    const excluded=new Set(interactive),groups=new Map(),removedGeometries=new Set();
    root.updateMatrixWorld(true);const inverse=new THREE.Matrix4().copy(root.matrixWorld).invert();
    root.traverse(o=>{if(!o.isMesh||o.isSkinnedMesh||o.isInstancedMesh||excluded.has(o)||!o.visible||Array.isArray(o.material)||o.material.transparent)return;
      const attributes=Object.keys(o.geometry.attributes).sort().map(k=>k+':'+o.geometry.attributes[k].itemSize).join(',');
      const key=o.material.uuid+'|'+o.renderOrder+'|'+attributes;
      if(!groups.has(key))groups.set(key,[]);groups.get(key).push(o);
    });
    let removed=0;
    for(const meshes of groups.values()){
      if(meshes.length<2)continue;
      const parts=meshes.map(o=>{const g=o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone();g.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inverse,o.matrixWorld));return g;});
      const geometry=new THREE.BufferGeometry();
      for(const name of Object.keys(parts[0].attributes)){
        const itemSize=parts[0].attributes[name].itemSize,total=parts.reduce((n,g)=>n+g.attributes[name].array.length,0),array=new Float32Array(total);let offset=0;
        for(const g of parts){array.set(g.attributes[name].array,offset);offset+=g.attributes[name].array.length;}
        geometry.setAttribute(name,new THREE.Float32BufferAttribute(array,itemSize));
      }
      geometry.computeBoundingBox();geometry.computeBoundingSphere();
      const merged=new THREE.Mesh(geometry,meshes[0].material);merged.name='Static gallery batch';merged.renderOrder=meshes[0].renderOrder;root.add(merged);
      for(const o of meshes){removedGeometries.add(o.geometry);o.parent.remove(o);}parts.forEach(g=>g.dispose());removed+=meshes.length-1;
    }
    const remaining=new Set();root.traverse(o=>{if(o.geometry)remaining.add(o.geometry);});
    removedGeometries.forEach(g=>{if(!remaining.has(g))g.dispose();});return removed;
  }
  function createFramePolicy(){
    let last=-Infinity,wasModal=false,invalidated=true;
    return{invalidate(){invalidated=true;},draw(now,{hidden,modal,active,avatars,loading}){
      if(hidden){last=-Infinity;invalidated=true;return false;}
      const changedModal=modal!==wasModal;wasModal=modal;
      if(modal&&!changedModal&&!invalidated)return false;
      const interval=1000/(active||loading?60:avatars?30:15);
      if(!invalidated&&!changedModal&&now-last<interval-1)return false;
      last=now;invalidated=false;return true;
    }};
  }
  function presenceChanged(a,b){return!a||a.room!==b.room||a.moving!==b.moving||Math.abs(a.x-b.x)>.003||Math.abs(a.z-b.z)>.003||Math.abs(a.yaw-b.yaw)>.003;}
  // Adjust only after sustained slow movement, never because an idle/dialog frame was skipped.
  function createResolutionBudget(){let slow=0,fast=0,scale=1;
    return{sample(gap,eligible){if(!eligible||gap>200){slow=fast=0;return scale;}
      if(gap>24){slow++;fast=0;}else if(gap<19){fast++;slow=Math.max(0,slow-1);}else{slow=Math.max(0,slow-1);fast=0;}
      if(slow>=60){scale=Math.max(.7,+(scale-.1).toFixed(1));slow=fast=0;}
      if(fast>=480){scale=Math.min(1,+(scale+.1).toFixed(1));slow=fast=0;}
      return scale;
    }};
  }
  return{disposeRoom,retainRoomTextures,replaceArtwork,batchStaticMeshes,createFramePolicy,presenceChanged,createResolutionBudget};
});
