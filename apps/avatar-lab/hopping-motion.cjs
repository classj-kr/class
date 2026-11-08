"use strict";

// Legless characters land on their own base. No invented torso or feet.
module.exports=function hoppingMotion(THREE,k,id){
 const {root,body}=k;
 root.updateMatrixWorld(true);
 const base=new THREE.Box3().setFromObject(root).min.y;
 for(const child of body.children)child.position.y-=base;
 const squash=id==='fruit-cherry'?.065:.018,clips=[];
 function minimumY(){
  root.updateMatrixWorld(true);let min=Infinity;
  root.traverse(o=>{if(!o.isMesh)return;const p=o.geometry.attributes.position,m=o.matrixWorld.elements;
   for(let i=0;i<p.count;i++)min=Math.min(min,m[1]*p.getX(i)+m[5]*p.getY(i)+m[9]*p.getZ(i)+m[13]);
  });return min;
 }
 for(const [name,duration] of [['Idle',3.2],['Walk',.96],['Wave',1.5]]){
  const times=[],positions=[],scales=[],turns=[],sprig=[];
  for(let i=0;i<=64;i++){
   const phase=i/64,angle=phase*Math.PI*2,active=name!=='Idle';
   const flight=Math.max(0,Math.min(1,(phase-.15)/.72));
   const height=active?.17*4*flight*(1-flight):0;
   const pulse=(center,width)=>{const d=Math.min(Math.abs(phase-center),1-Math.abs(phase-center));return Math.exp(-((d/width)**2));};
   const compression=active?pulse(.08,.08)+pulse(.93,.055):0;
   const sy=1-squash*compression+(active?.018*Math.sin(Math.PI*flight):0),sx=1/Math.sqrt(sy);
   body.position.set(0,0,0);body.scale.set(sx,sy,sx);
   body.quaternion.setFromEuler(new THREE.Euler(0,0,active?Math.sin(angle)*.012:0));
   times.push(phase*duration);scales.push(sx,sy,sx);turns.push(...body.quaternion.toArray());
   positions.push(0,height-minimumY()+.001,0);
   sprig.push(...new THREE.Quaternion().setFromEuler(new THREE.Euler(0,0,(active?.055:.012)*Math.sin(angle)) ).toArray());
  }
  const tracks=[new THREE.VectorKeyframeTrack('Body.position',times,positions),new THREE.VectorKeyframeTrack('Body.scale',times,scales),new THREE.QuaternionKeyframeTrack('Body.quaternion',times,turns)];
  if(root.getObjectByName('CherrySprig'))tracks.push(new THREE.QuaternionKeyframeTrack('CherrySprig.quaternion',times,sprig));
  clips.push(new THREE.AnimationClip(name,duration,tracks));
 }
 body.position.set(0,0,0);body.scale.set(1,1,1);body.quaternion.identity();
 root.userData={walkStride:.46,walkDuration:.96};
 require('./illustration-materials.cjs')(THREE,root);return{root,clips};
};
