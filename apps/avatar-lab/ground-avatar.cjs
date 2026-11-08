"use strict";

// A small rigid-foot gait with a planted stance and lifted return. The viewer
// scales clip speed to the exported stride, so travel and steps stay together.
module.exports=function groundAvatar(THREE,{root,clips}){
  const legs=[root.getObjectByName("LeftLeg"),root.getObjectByName("RightLeg")];
  const walk=clips.find(c=>c.name==="Walk"),stride=.36;
  if(walk){
    const times=Array.from({length:49},(_,i)=>walk.duration*i/48);
    for(let legIndex=0;legIndex<legs.length;legIndex++){
      const leg=legs[legIndex],origin=leg.position.clone(),positions=[],rotations=[];
      for(let i=0;i<times.length;i++){
        const phase=(i/48+legIndex*.5)%1,stance=phase<.5,t=stance?phase*2:(phase-.5)*2;
        const z=stance?stride*.25-stride*.5*t:-stride*.25+stride*.5*(t*t*(3-2*t));
        const lift=stance?0:.050*Math.sin(Math.PI*t);
        positions.push(origin.x,origin.y+lift,origin.z+z);
        rotations.push(...new THREE.Quaternion().setFromEuler(new THREE.Euler(stance?0:-.18*Math.sin(Math.PI*t),0,0)).toArray());
      }
      walk.tracks=walk.tracks.filter(t=>!t.name.startsWith(leg.name+"."));
      walk.tracks.push(new THREE.VectorKeyframeTrack(leg.name+".position",times,positions),new THREE.QuaternionKeyframeTrack(leg.name+".quaternion",times,rotations));
    }
    // Keep the stance foot stable in Z; sway is only around the forward axis.
    for(const name of ["Body","Head"]){
      const values=[];for(let i=0;i<times.length;i++)values.push(...new THREE.Quaternion().setFromEuler(new THREE.Euler(0,0,Math.sin(i/48*Math.PI*2)*(name==="Body"?.012:-.012))).toArray());
      walk.tracks=walk.tracks.filter(t=>t.name!==name+".quaternion");walk.tracks.push(new THREE.QuaternionKeyframeTrack(name+".quaternion",times,values));
    }
    root.userData.walkStride=stride;root.userData.walkDuration=walk.duration;
  }
  function lowest(){root.updateMatrixWorld(true);return Math.min(...legs.map(leg=>new THREE.Box3().setFromObject(leg).min.y));}
  root.position.y-=lowest();
  for(const clip of clips){
    const position=clip.tracks.find(t=>t.name==="Body.position");if(!position)continue;
    const mixer=new THREE.AnimationMixer(root);mixer.clipAction(clip).play();const corrected=[];
    for(let i=0;i<position.times.length;i++){mixer.setTime(position.times[i]);corrected.push(position.values[i*3+1]-lowest()+.001);}
    mixer.stopAllAction();for(let i=0;i<corrected.length;i++)position.values[i*3+1]=corrected[i];
  }
  root.updateMatrixWorld(true);require("./illustration-materials.cjs")(THREE,root);return{root,clips};
};
