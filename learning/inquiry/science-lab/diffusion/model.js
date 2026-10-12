(function(root,factory){const api=factory();if(typeof module!=='undefined')module.exports=api;else root.DiffusionModel=api;})(typeof window==='undefined'?globalThis:window,function(){
 'use strict';
 const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
 const N=33,cache=new Map();
 function random(seed){return()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;};}
 function reflect(v){v=((v%2)+2)%2;return v>1?2-v:v;}
 // Dimensionless, conservative 2-D diffusion with reflecting walls. No seconds,
 // measured diffusion coefficient, convection or calibrated pH are inferred.
 function inkFrames(position='centre'){
  if(cache.has(position))return cache.get(position);
  const sx={left:8,centre:16,right:24}[position]??16,sy=28;let a=new Float64Array(N*N),b=new Float64Array(N*N);
  for(let y=0;y<N;y++)for(let x=0;x<N;x++)a[y*N+x]=Math.exp(-((x-sx)**2+(y-sy)**2)/3);
  const mass=a.reduce((v,x)=>v+x,0);a=a.map(x=>x*90/mass);const frames=[Array.from(a)];
  for(let f=1;f<=100;f++){for(let t=0;t<32;t++){
   for(let y=0;y<N;y++)for(let x=0;x<N;x++){const i=y*N+x,c=a[i];b[i]=c+.2*((x?a[i-1]:c)+(x<N-1?a[i+1]:c)+(y?a[i-N]:c)+(y<N-1?a[i+N]:c)-4*c);}
   [a,b]=[b,a];
  }frames.push(Array.from(a));}
  cache.set(position,frames);return frames;
 }
 function ink(progress=0,position='centre'){
  const p=clamp(progress)*100,f=Math.floor(p),k=p-f,frames=inkFrames(position),a=frames[f],b=frames[Math.min(100,f+1)];
  return a.map((v,i)=>v+(b[i]-v)*k);
 }
 const DROPS=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1],[2,0],[-2,0],[0,2],[0,-2]].map(([x,y],i)=>({id:i,x,y,group:x*x+y*y===1?'near':x*x+y*y===2?'middle':'far',r:Math.hypot(x,y)}));
 function btb(progress=0,substance='vinegar'){
  return DROPS.map(d=>({...d,yellow:substance==='vinegar'?clamp((clamp(progress)-(.1+.65*(d.r/2)**2))/.14):0}));
 }
 const walks=new Map();
 function trajectory(kind='ink',position='centre'){
  const key=kind+':'+position;if(walks.has(key))return walks.get(key);
  const rng=random(43191),sx={left:.25,centre:.5,right:.75}[position]??.5,points=[];
  for(let i=0;i<128;i++){
   let x=kind==='ink'?sx+(rng()-.5)*.045:.5,y=kind==='ink'?.875+(rng()-.5)*.045:.5;const frames=[{x,y}];
   for(let t=1;t<=1200;t++){const angle=rng()*Math.PI*2,step=kind==='ink'?.055:.047;let nx=x+Math.cos(angle)*step,ny=y+Math.sin(angle)*step;
    if(kind==='ink'){x=reflect(nx);y=reflect(ny);}else if(Math.hypot(nx-.5,ny-.5)<.48){x=nx;y=ny;}else{nx=x-Math.cos(angle)*step;ny=y-Math.sin(angle)*step;if(Math.hypot(nx-.5,ny-.5)<.48){x=nx;y=ny;}}
    frames.push({x,y});
   }points.push(frames);
  }walks.set(key,points);return points;
 }
 function particles(kind,progress,position='centre',tail=0){
  const time=clamp(progress)*800+Math.max(0,tail),all=trajectory(kind,position);
  return all.flatMap((frames,i)=>{const delay=kind==='btb'?i*1.5:0;if(time<=delay&&kind==='btb')return[];const t=Math.max(0,time-delay),whole=Math.floor(t),k=t-whole,index=whole%1200,a=frames[index],b=frames[index+1];return[{id:i,x:a.x+(b.x-a.x)*k,y:a.y+(b.y-a.y)*k}];});
 }
 return {N,DROPS,clamp,reflect,ink,btb,particles};
});
