(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.ParkFollowCamera=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
  function position(player,yaw,obstacles){
    const dx=Math.sin(yaw),dz=Math.cos(yaw);let distance=2.6;
    // A short swept segment keeps the eye and its near plane outside plinths and the park edge.
    for(let d=.1;d<=2.6+.001;d+=.1){
      const x=player.x+dx*d,z=player.z+dz*d;
      if(Math.hypot(x,z)>85||obstacles.some(o=>o.hx!=null?Math.abs(x-o.x)<o.hx&&Math.abs(z-o.z)<o.hz:Math.hypot(x-o.x,z-o.z)<o.r)){
        distance=Math.max(0,d-.2);break;
      }
    }
    return{x:player.x+dx*distance,z:player.z+dz*distance,distance};
  }
  return{position};
});
