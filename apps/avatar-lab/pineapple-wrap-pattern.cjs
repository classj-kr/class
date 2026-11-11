"use strict";
module.exports=function(T,k,head,fruit){
 const g=head.group,s=require('./sculpt-kit.cjs')(T,k,head);for(const o of [...g.children])if(o.name.startsWith('PineappleRearDiamond')||o.name.startsWith('PineappleFlankDiamond'))g.remove(o);
 fruit.updateWorldMatrix(true,false);let count=0;
 for(const direction of [-1,1])for(let row=-9;row<=14;row++){let points=[];
  const flush=()=>{if(points.length>2){const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...s.point(p)))),steps=32,sides=6,tube=new T.TubeGeometry(curve,steps,.011,sides,false),P=Array.from(tube.attributes.position.array),I=Array.from(tube.index.array);
   for(let ring=0;ring<=steps;ring++){const f=ring/steps*(points.length-1),lo=Math.floor(f),hi=Math.min(points.length-1,lo+1),w=points[lo][3]*(1-f+lo)+points[hi][3]*(f-lo),c=curve.getPoint(ring/steps);for(let j=0;j<=sides;j++){const ix=(ring*7+j)*3;for(let a=0;a<3;a++)P[ix+a]=c.getComponent(a)+(P[ix+a]-c.getComponent(a))*w;}}
   for(const end of [0,steps]){const c=P.length/3;P.push(...curve.getPoint(end/steps).toArray());for(let j=0;j<sides;j++)end?I.push(c,end*7+j,end*7+j+1):I.push(c,j+1,j);}const o=k.mesh('PineappleWrappedDiamond'+count++,k.geometry(P,I),k.solid('PineappleWrappedNetColor','#dfa322'),g);o.userData.skipOriginalPaint=true;tube.dispose();}points=[];};
  for(let i=0;i<=160;i++){const u=i/160*Math.PI*2,y=175+row*55+direction*u*(440/(Math.PI*2));if(y<177||y>454){flush();continue;}const dir=new T.Vector3(Math.sin(u),0,Math.cos(u)),center=new T.Vector3(0,(580-y)*.005,0),h=new T.Raycaster(center.clone().addScaledVector(dir,3),dir.clone().negate()).intersectObject(fruit)[0];if(!h){flush();continue;}
   const normal=h.face.normal.clone().transformDirection(fruit.matrixWorld),w=1-T.MathUtils.smoothstep(normal.z,.32,.70),p=h.point.clone().addScaledVector(dir,.004),x=p.x/.005+320;
   if(w>.02&&(normal.z<.2||((x-320)/111)**2+((y-340)/94)**2>1.1))points.push([x,y,p.z,w]);else flush();
  }flush();
 }
};
