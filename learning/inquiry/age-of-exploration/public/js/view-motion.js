/* Visual following only: never changes authoritative movement or collision positions. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.VoyageViewMotion=factory()})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  function create(span,{settleSeconds=.08,snapDistance=1000}={}){
    let position=null,subject=null,lastMode=null,velocityX=0,velocityY=0;
    const wrap=x=>((x%span)+span)%span;
    const delta=(a,b)=>((a-b+span*1.5)%span+span)%span-span/2;
    return {
      update(target,dt,mode){
        if(!target)return null;
        const dx=position?delta(target.x,position.x):0,dy=position?target.y-position.y:0;
        if(!position||subject!==target||lastMode!==mode||Math.hypot(dx,dy)>snapDistance||dt>.25){
          position={x:wrap(target.x),y:target.y};velocityX=velocityY=0;
        }else{
          // Exact critically damped spring: smooth velocity as well as position.
          // The short follow delay also softens the 10 Hz automatic-sailing updates.
          const time=Math.max(0,dt),omega=2/settleSeconds,decay=Math.exp(-omega*time);
          const jx=velocityX-omega*dx,jy=velocityY-omega*dy;
          position={x:wrap(target.x+(-dx+jx*time)*decay),y:target.y+(-dy+jy*time)*decay};
          velocityX=(velocityX-omega*jx*time)*decay;velocityY=(velocityY-omega*jy*time)*decay;
          if(Math.hypot(delta(target.x,position.x),target.y-position.y)<.001&&Math.hypot(velocityX,velocityY)<.01){
            position={x:wrap(target.x),y:target.y};velocityX=velocityY=0;
          }
        }
        subject=target;lastMode=mode;return position;
      },
      get position(){return position}
    };
  }
  return {create};
});
