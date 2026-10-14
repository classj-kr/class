(function(root){'use strict';
 function calibration(points,length){if(points.length!==2||!(length>0&&Number.isFinite(length)))return null;const pixels=Math.hypot(points[1].x-points[0].x,points[1].y-points[0].y);return pixels>=5?{pixels,length,metersPerPixel:length/pixels}:null;}
 function analyze(points,{fps,scale,origin,mass=.1,angle=0}){
  if(!(fps>0&&scale>0&&mass>0)||!origin)return{positions:[],intervals:[],accelerations:[]};
  const radians=angle*Math.PI/180,c=Math.cos(radians),s=Math.sin(radians),unique=new Map(points.map(p=>[p.frame,p]));const positions=[...unique.values()].sort((a,b)=>a.frame-b.frame).map(p=>{const dx=(p.x-origin.x)*scale,dy=(origin.y-p.y)*scale;return{frame:p.frame,t:p.frame/fps,x:dx*c+dy*s,y:-dx*s+dy*c,height:dy};});
  const intervals=[];for(let i=0;i<positions.length-1;i++){const a=positions[i],b=positions[i+1],dt=b.t-a.t;if(dt<=0)continue;const vx=(b.x-a.x)/dt,vy=(b.y-a.y)/dt,y=(a.height+b.height)/2,K=mass*(vx*vx+vy*vy)/2,U=mass*9.8*y;intervals.push({t:(a.t+b.t)/2,dt,vx,vy,speed:Math.hypot(vx,vy),y,K,U,E:K+U});}
  const accelerations=[];for(let i=0;i<intervals.length-1;i++){const a=intervals[i],b=intervals[i+1],dt=b.t-a.t;accelerations.push({t:(a.t+b.t)/2,ax:(b.vx-a.vx)/dt,ay:(b.vy-a.vy)/dt});}
  return{positions,intervals,accelerations};
 }
 function demo(mode,frame){const t=frame/30,a=9.8*.32/(1+.32*.32),x=.12*t+a*t*t/2;return mode==='projectile'?{x:95+3*t*180,y:350-(4.3*t-4.9*t*t)*180}:{x:110+x*400,y:130+x*400*.32};}
 const api={calibration,analyze,demo};if(typeof module!=='undefined')module.exports=api;else root.scienceVideoMotion=api;
})(typeof window==='undefined'?globalThis:window);
