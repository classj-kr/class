"use strict";
module.exports=function(T,k,id,parts){
 if(id!=='animal-tiger')return;
 const stripe=(part,name,outline)=>{
  outline=outline.flatMap((a,i)=>Array.from({length:8},(_,j)=>{const b=outline[(i+1)%outline.length],t=j/8;return [a[0]*(1-t)+b[0]*t,a[1]*(1-t)+b[1]*t]}));
  const support=part.group.getObjectByName(name+'Back'),carrier=new T.Mesh(support.geometry,new T.MeshBasicMaterial({side:T.DoubleSide}));carrier.updateMatrixWorld(true);
  const cx=outline.reduce((a,p)=>a+p[0],0)/outline.length,cy=outline.reduce((a,p)=>a+p[1],0)/outline.length,P=[],I=[],rings=12,n=outline.length;
  for(let r=0;r<=rings;r++)for(const [ex,ey]of outline){const x=(cx+(ex-cx)*r/rings-part.part.pivot[0])*.005,y=(part.part.pivot[1]-cy-(ey-cy)*r/rings)*.005,hit=new T.Raycaster(new T.Vector3(x,y,-3),new T.Vector3(0,0,1)).intersectObject(carrier)[0];if(!hit)throw new Error('Tiger body stripe misses '+name);P.push(x,y,hit.point.z-.006);}
  for(let r=0;r<rings;r++)for(let i=0;i<n;i++){const a=r*n+i,b=r*n+(i+1)%n,c=a+n,d=b+n;if(r)I.push(a,d,b);I.push(a,c,d);}
  const mat=k.solid('TigerBodyStripeColor','#694024');mat.side=T.DoubleSide;const patch=k.mesh('TigerBodyStripe'+name+part.group.children.length,k.geometry(P,I),mat,part.group);patch.userData.skipOriginalPaint=true;patch.userData.stripeSupport=support.name;carrier.material.dispose();
 };
 for(const side of [-1,1]){
  const mirror=outline=>outline.map(([x,y])=>[311+side*(311-x),y]);
  for(const dy of [0,32])stripe(parts.get('Torso'),'TigerSuit',mirror([[258,470],[279,471],[295,477],[279,481],[255,478]].map(([x,y])=>[x,y+dy])));
  const arm=(side<0?'Left':'Right')+'Arm',leg=(side<0?'Left':'Right')+'Leg';
  stripe(parts.get(arm),'RoundedTiger'+arm,mirror([[220,471],[238,473],[245,480],[230,482],[215,478]]));
  stripe(parts.get(leg),'RoundedTiger'+leg,mirror([[244,552],[267,551],[285,557],[267,562],[237,560]]));
 }
};
