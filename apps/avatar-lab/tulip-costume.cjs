"use strict";
// A flower is a cup of overlapping petals. Its side and back must describe
// that same cup rather than the thickness of a projected front silhouette.
module.exports=function tulipCostume(THREE,k,s,parts){
 const pink=new THREE.Color('#ee6990').convertSRGBToLinear(),gold=new THREE.Color('#ffdf67').convertSRGBToLinear();
 const profile=[[425,.11],[412,.35],[390,.57],[350,.73],[300,.79],[245,.80],[200,.77],[140,.73],[80,.68],[60,.64]];
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
 for(const [index,angle,top,span] of [[0,Math.PI,60,.85],[1,Math.PI,125,1.15],[2,-2.15,83,.85],[3,2.15,83,.85],[4,-1.10,78,1.20],[5,1.10,78,1.20]]){
  const petal=closedPatch('WrappedTulipPetal'+index,48,40,(u,t,inner)=>{
   const q=u*2-1,a=angle+q*span,inward=-q*Math.sign(angle),tip=top+(index>=4?130*Math.max(0,inward)**1.4+40*Math.max(0,-inward)**1.4:58*Math.abs(q)**1.7),y=425+(tip-425)*t;
   const r=radius(y)+.025*Math.sin(t*Math.PI)*Math.cos(q*Math.PI/2)**2-.035*Math.abs(q)**6+.06*t**8+(index>=4?.008:0)-(inner?.035:0);
   return [Math.sin(a)*r,(580-y)*.005,Math.cos(a)*r];
  },(u,t,inner)=>{
   const edge=Math.max(0,(Math.abs(u*2-1)-.88)/.12),tip=Math.max(0,(t-.955)/.045);
   const faceWarmth=.90*Math.pow(1-t,.80);
   return pink.clone().lerp(gold,Math.max(edge*.85,tip*.85,faceWarmth)).multiplyScalar(inner?.93:1);
  });
 }
 s.parent.userData.directSurfaceArtwork=true;
 s.parent.userData.artworkOpaqueRegions=[{cx:320,cy:260,rx:220,ry:240}];
 // Closed green calyx and three curved leaves join the bloom to the suit.
 s.ellipsoid('TulipCalyx',[320,421,0],[35,31,.18],'#548b3d');
 const frontLeaf=[[143,338],[139,355],[148,386],[161,407],[183,426],[203,435],[238,445],[239,449],[264,450],[299,456],[320,456],[320,411],[278,410],[244,399],[178,357],[170,355],[148,337]];
 for(const side of [-1,1])k.volume('TulipFrontLeaf'+side,frontLeaf.map(([x,y])=>[320+side*(x-320),y]),[320+side*(231-320),414],s.pivot,.13,.12,s.parent,k.solid('TulipLeafColor'+side,'#79aa3e'),{art:false,z:.32,samples:96});
 for(const [i,a] of [Math.PI].entries()){
  closedPatch('CurvedTulipLeaf'+i,28,12,(u,t,inner)=>{
   const w=Math.sin(t*Math.PI)*.20*(u*2-1),r=.08+t*.79,y=.70+.20*t+.35*t*t;
   return [Math.sin(a)*r+Math.cos(a)*w*.70,y+w*.70+(inner?-.022:0),Math.cos(a)*r-Math.sin(a)*w*.70];
  },(u,t,inner)=>new THREE.Color(inner?'#568b3c':u>.5?'#9cbd43':'#71a143').convertSRGBToLinear());
 }
 const torso=parts.get('Torso');torso.group.clear();const body=require('./sculpt-kit.cjs')(THREE,k,torso);k.volume('TulipSuit',[[258,449],[380,449],[385,480],[380,510],[369,531],[357,546],[330,551],[309,551],[282,544],[270,531],[259,509],[253,480]],[319,492],body.pivot,.28,.28,body.parent,k.solid('TulipSuitColor','#f5bf43'),{samples:64});
 for(const side of [-1,1]){const arm=parts.get(side<0?'LeftArm':'RightArm'),pivot=[320+side*65,450];arm.group.clear();arm.part.pivot=pivot;arm.group.position.set((pivot[0]-320)*.005,(580-pivot[1])*.005,0);const a=require('./sculpt-kit.cjs')(THREE,k,arm);
  const sleeve=[[258,449],[237,451],[226,471],[220,492],[226,505],[235,505],[242,490],[251,487],[262,459]].map(([x,y])=>[320+side*(320-x),y]);k.volume('TulipSleeve'+side,sleeve,[320+side*79,477],a.pivot,.11,.11,a.parent,k.solid('TulipSleeveColor'+side,'#f3c751'),{samples:64});
  const leg=parts.get(side<0?'LeftLeg':'RightLeg');leg.group.clear();const l=require('./sculpt-kit.cjs')(THREE,k,leg),foot=[[285,526],[276,541],[269,555],[263,565],[271,574],[290,574],[302,565],[309,541],[305,529]].map(([x,y])=>[320+side*(320-x),y]);k.volume('TulipLeg'+side,foot,[320+side*32,548],l.pivot,.16,.16,l.parent,k.solid('TulipLegColor'+side,'#f3c751'),{samples:64});
 }
};
