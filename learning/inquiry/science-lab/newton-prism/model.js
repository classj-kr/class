(function(root){
 'use strict';
 const colors=[['빨강','#ff6659'],['주황','#ffae4a'],['노랑','#f7e65e'],['초록','#60e0a5'],['파랑','#50aaff'],['남색','#8083ff'],['보라','#c190ff']];
 // Snell refraction at both faces of the schematic triangular prism.
 function ray(color){
  const n=1.50+Math.max(0,Math.min(6,color))*.01,left=Math.atan(38/134),right=Math.atan(40/134);
  const inside=left-Math.asin(Math.sin(left)/n),entry={x:230-(134-90)*38/134,y:134};
  const k=40/134,x=(230+k*(entry.y-90)-k*Math.tan(inside)*entry.x)/(1-k*Math.tan(inside));
  const exit={x,y:entry.y+Math.tan(inside)*(x-entry.x)},angle=Math.asin(n*Math.sin(inside+right))-right;
  return {n,entry,exit,inside,angle,at:x=>exit.y+Math.tan(angle)*(x-exit.x)};
 }
 const sources={incandescent:{label:'백열전구 손전등',colors:[0,1,2,3,4,5,6]},rgb:{label:'빨강·초록·파랑 LED',colors:[0,3,4]}};
 const collectors={glass:{label:'반원 모양 유리',focus:70},lens:{label:'볼록 렌즈',focus:65},cup:{label:'물을 담은 둥근 컵',focus:80}};
 function fixedRay(color){const p=ray(color),dx=275,dy=60;return{...p,entry:{x:p.entry.x+dx,y:p.entry.y+dy},exit:{x:p.exit.x+dx,y:p.exit.y+dy},screenY:p.at(660-dx)+dy};}
 const dot=(a,b)=>a[0]*b[0]+a[1]*b[1],cross=(a,b)=>a[0]*b[1]-a[1]*b[0];
 function boundary(origin,direction,vertices){let closest;
  for(let i=0;i<vertices.length;i++){const a=vertices[i],b=vertices[(i+1)%vertices.length],edge=[b[0]-a[0],b[1]-a[1]],offset=[a[0]-origin[0],a[1]-origin[1]],den=cross(direction,edge);if(Math.abs(den)<1e-10)continue;
   const distance=cross(offset,edge)/den,u=cross(offset,direction)/den;if(distance<=1e-5||u<0||u>1||closest&&distance>=closest.distance)continue;
   const length=Math.hypot(...edge);let normal=[-edge[1]/length,edge[0]/length];if(dot(normal,direction)>0)normal=normal.map(v=>-v);
   closest={distance,point:origin.map((v,j)=>v+distance*direction[j]),normal};
  }return closest;
 }
 function refract(direction,normal,ratio){const cosine=-dot(direction,normal),k=1-ratio*ratio*(1-cosine*cosine);return k<0?null:direction.map((v,i)=>ratio*v+(ratio*cosine-Math.sqrt(k))*normal[i]);}
 // Reverse ray tracing finds the first-prism rotation. Both selected rays leave
 // it on y=194 and originate in the same parallel white beam (-25 degrees).
 const aligned=new Map();
 function fixedFirstRay(color){if(aligned.has(color))return aligned.get(color);const n=1.5+color*.01;
  function trace(degrees){const a=degrees*Math.PI/180,c=Math.cos(a),s=Math.sin(a),vertices=[[230,90],[270,224],[192,224]].map(([x,y])=>[235+(x-235)*c-(y-194)*s,194+(x-235)*s+(y-194)*c]);
   const exit=boundary([330,194],[-1,0],vertices);if(!exit)return null;const inside=refract([-1,0],exit.normal,1/n),entry=boundary(exit.point,inside,vertices);if(!entry)return null;
   const incoming=refract(inside,entry.normal,n);if(!incoming)return null;
   return{degrees,vertices,entry:entry.point,exit:exit.point,incoming,angle:Math.atan2(incoming[1],incoming[0])*180/Math.PI};
  }
  let low=0,previous=trace(low),high;
  for(let angle=.5;angle<=40;angle+=.5){const next=trace(angle);if(previous&&next&&(previous.angle-155)*(next.angle-155)<=0){high=angle;low=angle-.5;break;}previous=next;}
  if(high===undefined)throw Error('No aligned first prism');
  for(let i=0;i<36;i++){const mid=(low+high)/2,a=trace(low),b=trace(mid);if((a.angle-155)*(b.angle-155)<=0)high=mid;else low=mid;}
  const p=trace((low+high)/2);p.at=x=>p.entry[1]+p.incoming[1]/p.incoming[0]*(x-p.entry[0]);aligned.set(color,p);return p;
 }
 function result({mode='dispersion',color=0,screen=70,light=true,source='incandescent',collector='glass'}={}){
  if(!['dispersion','single','fixed','combine'].includes(mode))throw Error('Unknown optical arrangement');
  if(!sources[source]||!collectors[collector])throw Error('Unknown source or collector');
  // Relative positions in an ideal focusing diagram, not measured focal lengths.
  const selected=Math.max(0,Math.min(6,Math.round(Number(color)||0))),focus=collectors[collector].focus,available=sources[source].colors;
  return {mode,light,color:selected,source,collector,focus,screen:Number(screen),colors:!light?[]:['single','fixed'].includes(mode)?available.filter(i=>i===selected):available.slice(),white:light&&mode==='combine'&&Number(screen)===focus,spread:mode==='combine'?Math.abs(Number(screen)-focus):50,...(mode==='fixed'?{fixed:fixedRay(selected)}:{})};
 }
 const api={colors,sources,collectors,result,ray,fixedRay,fixedFirstRay};if(typeof module!=='undefined')module.exports=api;else root.prismModel=api;
})(typeof window==='undefined'?globalThis:window);
