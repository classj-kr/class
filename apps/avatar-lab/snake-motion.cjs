"use strict";
module.exports=function snakeMotion(THREE,k){
 const {root,body}=k,tail=root.getObjectByName('SnakeTail'),clips=[],duration=1.8,n=72;
 function minimum(){let y=Infinity;root.updateMatrixWorld(true);root.traverse(o=>{if(!o.isMesh)return;const p=o.geometry.attributes.position,m=o.matrixWorld.elements;for(let i=0;i<p.count;i++)y=Math.min(y,m[1]*p.getX(i)+m[5]*p.getY(i)+m[9]*p.getZ(i)+m[13]);});return y;}
 root.position.y-=minimum();
 for(const name of ['Idle','Walk','Wave']){
  const times=[],positions=[],rotations=[],tailRotations=[],active=name==='Walk';
  for(let i=0;i<=n;i++){
   const t=i/n,phase=t*Math.PI*2;times.push(t*duration);
   const roll=Math.sin(phase)*(active?.012:.004),turn=Math.sin(phase)*(active?.025:.008);
   body.position.set(0,0,0);body.quaternion.setFromEuler(new THREE.Euler(0,turn,roll));
   tail.quaternion.setFromEuler(new THREE.Euler(0,Math.sin(phase+.35)*(active?.11:.025),Math.sin(phase)*(active?.025:.008)));
   const lift=-minimum();positions.push(0,lift,0);rotations.push(...body.quaternion.toArray());tailRotations.push(...tail.quaternion.toArray());
  }
  clips.push(new THREE.AnimationClip(name,duration,[new THREE.VectorKeyframeTrack('Body.position',times,positions),new THREE.QuaternionKeyframeTrack('Body.quaternion',times,rotations),new THREE.QuaternionKeyframeTrack('SnakeTail.quaternion',times,tailRotations)]));
 }
 body.position.set(0,0,0);body.quaternion.identity();tail.quaternion.identity();
 root.userData={walkStride:.48,walkDuration:duration,locomotion:'glide',canWave:false};
 require('./illustration-materials.cjs')(THREE,root);return{root,clips};
};
