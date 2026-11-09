"use strict";
// Closed softly rounded solid with a constrained concave front contour.
// Shared interior edge splits prevent collapsed walls and preserve watertightness.
module.exports=function contourSolid(T,k,tool,name,ps,{front=.1,back=.1,color='#ffffff',z=0,samples=112,rounding=14}={}){
 const edge=new T.CatmullRomCurve3(ps.map(([x,y])=>new T.Vector3(x,y,0)),true,'centripetal').getSpacedPoints(samples).slice(0,samples),points=edge.map(v=>new T.Vector2(v.x,v.y)),key=(a,b)=>a<b?a+','+b:b+','+a;
 let faces=T.ShapeUtils.triangulateShape(points,[]);
 for(let pass=0;pass<10;pass++){
  const uses=new Map();for(const f of faces)for(let j=0;j<3;j++){const e=key(f[j],f[(j+1)%3]);uses.set(e,(uses.get(e)||0)+1);}const rim=new Set();for(const[e,count]of uses)if(count===1)for(const v of e.split(','))rim.add(Number(v));
  const cuts=new Map();for(const f of faces)for(let j=0;j<3;j++){const a=f[j],b=f[(j+1)%3],e=key(a,b);if(!cuts.has(e)&&(points[a].distanceTo(points[b])>10||(uses.get(e)===2&&rim.has(a)&&rim.has(b)))){cuts.set(e,points.length);points.push(points[a].clone().add(points[b]).multiplyScalar(.5));}}
  if(!cuts.size)break;const next=[];
  for(const f of faces){let[a,b,c]=f,ab=cuts.get(key(a,b)),bc=cuts.get(key(b,c)),ca=cuts.get(key(c,a)),count=[ab,bc,ca].filter(v=>v!==undefined).length;
   if(!count){next.push(f);continue;}if(count===3){next.push([a,ab,ca],[ab,b,bc],[ca,bc,c],[ab,bc,ca]);continue;}
   if(count===1){if(bc!==undefined){[a,b,c]=[b,c,a];ab=bc;}else if(ca!==undefined){[a,b,c]=[c,a,b];ab=ca;}next.push([a,ab,c],[ab,b,c]);continue;}
   if(ab===undefined){[a,b,c]=[b,c,a];[ab,bc]=[bc,ca];}else if(bc===undefined){[a,b,c]=[c,a,b];[ab,bc]=[ca,ab];}next.push([b,bc,ab],[a,ab,c],[ab,bc,c]);
  }faces=next;
 }
 const P=[],I=[],n=points.length;
 for(const rear of [false,true])for(const v of points){let d=Infinity;for(let j=0;j<edge.length;j++){const a=edge[j],b=edge[(j+1)%edge.length],dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((v.x-a.x)*dx+(v.y-a.y)*dy)/(dx*dx+dy*dy)));d=Math.min(d,Math.hypot(v.x-a.x-t*dx,v.y-a.y-t*dy));}const f=Math.sqrt(1-Math.max(0,1-d/rounding)**2);P.push(...tool.point([v.x,v.y,z+(rear?-back:front)*f]));}
 for(const rear of [false,true])for(let[a,b,c]of faces){const A=points[a],B=points[b],C=points[c];if((B.x-A.x)*(C.y-A.y)-(B.y-A.y)*(C.x-A.x)>0)[b,c]=[c,b];rear?I.push(a+n,c+n,b+n):I.push(a,b,c);}
 const g=k.geometry(P,I),p=g.attributes.position,N=g.attributes.normal,m=new Map();for(let i=0;i<p.count;i++){const key=[p.getX(i),p.getY(i),p.getZ(i)].map(v=>Math.round(v*1e5)).join(',');if(!m.has(key))m.set(key,[]);m.get(key).push(i);}for(const indices of m.values()){const v=new T.Vector3();for(const i of indices)v.add(new T.Vector3().fromBufferAttribute(N,i));v.normalize();for(const i of indices)N.setXYZ(i,v.x,v.y,v.z);}
 return k.mesh(name,g,k.solid(name+'Color',color),tool.parent);
};
