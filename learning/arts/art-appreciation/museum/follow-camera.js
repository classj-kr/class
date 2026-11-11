(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.MuseumFollowCamera=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  // Actual entrance piers: x ±3.6..5.8, z 5.45..5.95. Both exceed eye height.
  const piers=[{minX:-5.8,maxX:-3.6,minZ:5.45,maxZ:5.95},{minX:3.6,maxX:5.8,minZ:5.45,maxZ:5.95}];
  function expanded(box,pad){return{minX:box.minX-pad,maxX:box.maxX+pad,minZ:box.minZ-pad,maxZ:box.maxZ+pad};}
  function entryFraction(p,dx,dz,box){
    let enter=0,exit=1;
    for(const [axis,delta,min,max]of [['x',dx,box.minX,box.maxX],['z',dz,box.minZ,box.maxZ]]){
      if(Math.abs(delta)<1e-9){if(p[axis]<min||p[axis]>max)return null;continue;}
      const a=(min-p[axis])/delta,b=(max-p[axis])/delta;
      enter=Math.max(enter,Math.min(a,b));exit=Math.min(exit,Math.max(a,b));
      if(enter>exit)return null;
    }
    return enter;
  }
  function constrainPlayer(p){
    for(const pier of piers){const b=expanded(pier,.32);
      if(p.x<=b.minX||p.x>=b.maxX||p.z<=b.minZ||p.z>=b.maxZ)continue;
      const faces=[['x',b.minX,p.x-b.minX],['x',b.maxX,b.maxX-p.x],['z',b.minZ,p.z-b.minZ],['z',b.maxZ,b.maxZ-p.z]];
      faces.sort((a,b)=>a[2]-b[2]);p[faces[0][0]]=faces[0][1];
    }
  }
  function position(player,yaw,galleryEnd=-30){
    const dx=Math.sin(yaw)*2.6,dz=Math.cos(yaw)*2.6;
    // Keep the camera, including its near plane, inside the wall's inner face.
    let t=1;
    if(dx>1e-9)t=Math.min(t,(5.43-player.x)/dx);
    if(dx< -1e-9)t=Math.min(t,(-5.43-player.x)/dx);
    if(dz>1e-9)t=Math.min(t,(6.65-player.z)/dz);
    if(dz< -1e-9)t=Math.min(t,(galleryEnd+.42-player.z)/dz);
    for(const pier of piers){const hit=entryFraction(player,dx,dz,expanded(pier,.24));if(hit!==null)t=Math.min(t,hit);}
    t=Math.max(0,t);
    return{x:player.x+dx*t,z:player.z+dz*t,distance:2.6*t};
  }
  return{position,constrainPlayer};
});
