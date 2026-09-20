import { createPeelSurface } from "./peel-surface.mjs?v=20260920-18";
// The same map, sources, lesson and selected feature survive the projection change.
// The transition is a visual unfolding, not a distance/area-preserving projection.
export async function animateProjection(map,mode,{reduced,targetZoom,center}){
  if(reduced){map.setProjection({type:mode==='flat'?'mercator':'globe'});map.jumpTo({center,zoom:targetZoom});return Promise.resolve();}
  const startZoom=map.getZoom(),from=mode==='flat'?0:1,to=1-from;
  const surface=await createPeelSurface(map,mode==='flat'?targetZoom:startZoom,center);
  return new Promise(resolve=>{
    let start;
    function frame(now){
      start??=now;const t=Math.min(1,(now-start)/1250),ease=t*t*(3-2*t),value=from+(to-from)*ease;
      map.setProjection({type:['vertical-perspective','mercator',value]});
      map.jumpTo({center,zoom:startZoom+(targetZoom-startZoom)*ease});
      surface?.draw(value,t);
      if(t<1)requestAnimationFrame(frame);
      else{surface?.destroy();map.setProjection({type:mode==='flat'?'mercator':'globe'});resolve();}
    }
    requestAnimationFrame(frame);
  });
}
