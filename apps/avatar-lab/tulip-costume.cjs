"use strict";
// A flower is a cup of overlapping petals. Its side and back must describe
// that same cup rather than the thickness of a projected front silhouette.
module.exports=function tulipCostume(THREE,k,s,parts){
 const pink=new THREE.Color('#ee6990').convertSRGBToLinear(),gold=new THREE.Color('#ffdf67').convertSRGBToLinear();
 const profile=[[412,.11],[390,.48],[350,.71],[300,.79],[245,.80],[200,.77],[140,.73],[80,.68],[60,.64]];
 const radius=y=>{for(let i=1;i<profile.length;i++){const [hi,r0]=profile[i-1],[lo,r1]=profile[i];if(y>=lo){const t=(hi-y)/(hi-lo);return r0+(r1-r0)*t;}}return .64;};
 function closedPatch(name,rows,cols,sample,colorAt){
  const P=[],C=[],I=[],layer=(rows+1)*(cols+1);
  for(const inner of [false,true])for(let j=0;j<=rows;j++)for(let i=0;i<=cols;i++){
   const p=sample(i/cols,j/rows,inner);P.push(...s.point([320+p[0]/.005,580-p[1]/.005,p[2]]));
   const c=colorAt(i/cols,j/rows,inner);C.push(c.r,c.g,c.b);
  }
  for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){const a=j*(cols+1)+i,b=a+1,c=a+cols+1,d=c+1;I.push(a,b,d,a,d,c,layer+a,layer+d,layer+b,layer+a,layer+c,layer+d);}
  const boundary=[];for(let i=0;i<=cols;i++)boundary.push(i);for(let j=1;j<=rows;j++)boundary.push(j*(cols+1)+cols);for(let i=cols-1;i>=0;i--)boundary.push(rows*(cols+1)+i);for(let j=rows-1;j>0;j--)boundary.push(j*(cols+1));
  for(let i=0;i<boundary.length;i++){const a=boundary[i],b=boundary[(i+1)%boundary.length];I.push(a,layer+a,layer+b,a,layer+b,b);}
  const geo=k.geometry(P,I);geo.setAttribute('color',new THREE.Float32BufferAttribute(C,3));const mat=k.solid(name+'Color','#ffffff');mat.userData.preserveVertexColor=true;return k.mesh(name,geo,mat,s.parent);
 }
 const facePetals=[];
 for(const [index,angle,top,span] of [[0,-2.85,64,.85],[1,2.85,64,.85],[2,-1.75,83,.85],[3,1.75,83,.85],[4,-.82,78,.90],[5,.82,78,.90]]){
  const petal=closedPatch('WrappedTulipPetal'+index,48,40,(u,t,inner)=>{
   const q=u*2-1,a=angle+q*span,inward=-q*Math.sign(angle),tip=top+(index>=4?130*Math.max(0,inward)**1.4+40*Math.max(0,-inward)**1.4:58*Math.abs(q)**1.7),y=412+(tip-412)*t;
   const r=radius(y)+.10*Math.sin(t*Math.PI)*Math.cos(q*Math.PI/2)**2-.035*Math.abs(q)**6+.06*t**8+(index>=4?.025:0)-(inner?.035:0);
   return [Math.sin(a)*r,(580-y)*.005,Math.cos(a)*r];
  },(u,t,inner)=>{
   const edge=Math.max(0,(Math.abs(u*2-1)-.88)/.12),tip=Math.max(0,(t-.955)/.045);
   const faceWarmth=.90*Math.pow(1-t,.80);
   return pink.clone().lerp(gold,Math.max(edge*.85,tip*.85,faceWarmth)).multiplyScalar(inner?.93:1);
  });petal.userData.skipOriginalPaint=true;if(index>=4)facePetals.push(petal);
 }
 k.projectArtwork('OriginalFace',k.ellipse(320,300,110,90),[320,300],s.pivot,s.parent,facePetals,{rings:40,samples:160,offset:.007});
 // Closed green calyx and three curved leaves join the bloom to the suit.
 s.ellipsoid('TulipCalyx',[320,421,0],[35,31,.18],'#548b3d');
 for(const [i,a] of [-Math.PI/2,Math.PI/2,Math.PI].entries()){
  closedPatch('CurvedTulipLeaf'+i,28,12,(u,t,inner)=>{
   const w=Math.sin(t*Math.PI)*.20*(u*2-1),r=.08+t*.79,y=.70+.20*t+.35*t*t;
   return [Math.sin(a)*r+Math.cos(a)*w*.70,y+w*.70+(inner?-.022:0),Math.cos(a)*r-Math.sin(a)*w*.70];
  },(u,t,inner)=>new THREE.Color(inner?'#568b3c':u>.5?'#9cbd43':'#71a143').convertSRGBToLinear());
 }
 const torso=parts.get('Torso');torso.group.clear();const body=require('./sculpt-kit.cjs')(THREE,k,torso);body.ellipsoid('TulipSuit',[320,492,0],[60,53,.29],'#f3c751');body.paint();
 for(const side of [-1,1]){const arm=parts.get(side<0?'LeftArm':'RightArm'),pivot=[320+side*45,457];arm.group.clear();arm.part.pivot=pivot;arm.group.position.set((pivot[0]-320)*.005,(580-pivot[1])*.005,0);const a=require('./sculpt-kit.cjs')(THREE,k,arm);a.sweep('TulipSleeve'+side,[[320+side*45,457,0,15],[320+side*66,479,.02,17],[320+side*75,496,.03,14]],'#f3c751');a.ellipsoid('TulipHand'+side,[320+side*75,496,.03],[14,14,.075],'#f3c751');
  const leg=parts.get(side<0?'LeftLeg':'RightLeg');leg.group.clear();const l=require('./sculpt-kit.cjs')(THREE,k,leg);l.ellipsoid('TulipLeg'+side,[320+side*33,543,0],[23,26,.18],'#f3c751');l.ellipsoid('TulipFoot'+side,[320+side*39,565,.04],[26,13,.21],'#f3c751');
 }
};
