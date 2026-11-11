"use strict";
module.exports=function(T,k,id,parts){
 if(!['food-pudding','food-rice-ball'].includes(id))return;
 const pudding=id==='food-pudding',head=parts.get('Head'),g=head.group,s=require('./sculpt-kit.cjs')(T,k,head),ink=require('./solid-ink-shell.cjs'),colour=pudding?'#f8ce70':'#f5f2eb';
 function volume(part,name,ps,center,depth,color=colour){k.volume(name,ps,center,part.part.pivot,depth,depth,part.group,k.solid(name+'Color',color),{art:false,samples:96});require('./smooth-paired-volume.cjs')(T,k,part.group,name,{rings:24});return ['Surface','Back'].map(x=>part.group.getObjectByName(name+x));}
 let carrier;
 if(pudding){
  carrier=g.getObjectByName('PuddingShellSolid');for(const o of [...g.children])if(o.name==='CaramelCapSolid'||o.name==='RearCaramelCoatingSolid'||o.material?.userData.originalTexture)g.remove(o);
  const cap=s.lathe('CaramelCapSolid',[[142,0],[142,134],[135,143],[115,143],[104,139],[104,100],[104,60],[104,0]],'#984b29',0,{levels:96});
  const cp=cap.geometry.attributes.position;for(let i=0;i<cp.count;i++)cp.setY(i,cp.getY(i)-.29*cp.getZ(i));cap.geometry.computeVertexNormals();cap.geometry.computeBoundingBox();cap.geometry.computeBoundingSphere();cap.userData.artworkFacingFade=[.05,.20];
  const p=carrier.geometry.attributes.position;for(let i=0;i<p.count;i++)p.setY(i,Math.min(p.getY(i),2.375-.29*p.getZ(i)));carrier.geometry.computeVertexNormals();carrier.geometry.computeBoundingBox();carrier.geometry.computeBoundingSphere();
  carrier.updateWorldMatrix(true,false);cap.updateWorldMatrix(true,false);const ray=new T.Raycaster(),P=[],I=[],U=96,V=12;
  for(const layer of [0,1])for(let v=0;v<=V;v++)for(let u=0;u<=U;u++){
   const a=Math.PI+u/U*Math.PI+.00001,end=138+[[3.42,30],[4.15,53],[5.12,32],[5.93,47]].reduce((sum,[center,length])=>sum+length*Math.exp(-(((a-center)/.14)**2)),0),start=111+38*Math.sin(a),py=start+(end-start)*v/V,dir=new T.Vector3(Math.cos(a),0,Math.sin(a));ray.set(new T.Vector3(dir.x*3,(580-py)*.005,dir.z*3),dir.clone().negate());const hit=ray.intersectObjects([carrier,cap])[0];if(!hit)throw Error('Caramel missing support');P.push(...hit.point.clone().addScaledVector(dir,layer?-.004:.009).toArray());
  }
  const size=(U+1)*(V+1);for(let v=0;v<V;v++)for(let u=0;u<U;u++){const a=v*(U+1)+u,b=a+1,c=a+U+1,d=c+1;I.push(a,c,d,a,d,b,a+size,d+size,c+size,a+size,b+size,d+size);}const border=[];for(let u=0;u<=U;u++)border.push(u);for(let v=1;v<=V;v++)border.push(v*(U+1)+U);for(let u=U-1;u>=0;u--)border.push(V*(U+1)+u);for(let v=V-1;v>0;v--)border.push(v*(U+1));for(let j=0;j<border.length;j++){const a=border[j],b=border[(j+1)%border.length];I.push(a,b,b+size,a,b+size,a+size);}for(let i=0;i<I.length;i+=3)[I[i+1],I[i+2]]=[I[i+2],I[i+1]];
  s.mesh('RearCaramelCoatingSolid',k.geometry(P,I),'#984b29').userData.skipOriginalPaint=true;
  g.userData.artworkOpaqueRegions=[{cx:320,cy:300,rx:117,ry:95}];
 }else{
  g.clear();const contour=[[320,62],[345,69],[375,90],[408,125],[440,169],[470,224],[492,278],[511,326],[519,360],[510,386],[485,405],[442,419],[382,428],[320,430],[267,428],[215,421],[170,408],[136,389],[121,363],[122,337],[146,280],[168,226],[198,174],[231,124],[269,84],[298,68]],halves=volume(head,'RoundedRice',contour,[320,277],.51,'#faf8f3'),P=[],I=[];
  for(const mesh of halves){const start=P.length/3;P.push(...mesh.geometry.attributes.position.array);I.push(...Array.from(mesh.geometry.index.array,i=>i+start));g.remove(mesh);}carrier=k.mesh('RiceBallSolid',k.geometry(P,I),k.solid('RiceWhite','#faf8f3'),g);
  const p=carrier.geometry.attributes.position,n=carrier.geometry.attributes.normal,groups=new Map();for(let i=0;i<p.count;i++){const key=[p.getX(i),p.getY(i),p.getZ(i)].map(x=>Math.round(x*1e6)).join(',');if(!groups.has(key))groups.set(key,[]);groups.get(key).push(i);}for(const list of groups.values()){const v=new T.Vector3();for(const i of list)v.add(new T.Vector3().fromBufferAttribute(n,i));v.normalize();for(const i of list)n.setXYZ(i,v.x,v.y,v.z);}
  carrier.updateWorldMatrix(true,false);const ray=new T.Raycaster();
  // Seaweed is fitted to both curved faces, and continues around the bottom.
  for(const side of [-1,1]){
   const P=[],I=[],U=40,V=28;for(const layer of [0,1])for(let v=0;v<=V;v++)for(let u=0;u<=U;u++){
    const px=232+176*u/U,top=365-29*((px-320)/88)**2;ray.set(new T.Vector3((px-320)*.005,-2,.02),new T.Vector3(0,1,0));const bottom=ray.intersectObject(carrier)[0];if(!bottom)throw Error('Rice lower edge missing');const end=580-bottom.point.y/.005-.7,py=top+(end-top)*v/V;ray.set(new T.Vector3((px-320)*.005,(580-py)*.005,side*3),new T.Vector3(0,0,-side));const h=ray.intersectObject(carrier)[0];if(!h)throw Error('Nori has no rice support');const q=h.point.clone();q.z+=side*(layer?-.003:.007);q.sub(g.position);P.push(...q.toArray());
   }
   const size=(U+1)*(V+1);for(let v=0;v<V;v++)for(let u=0;u<U;u++){const a=v*(U+1)+u,b=a+1,c=a+U+1,d=c+1;I.push(a,b,d,a,d,c,a+size,d+size,b+size,a+size,c+size,d+size);}const border=[];for(let u=0;u<=U;u++)border.push(u);for(let v=1;v<=V;v++)border.push(v*(U+1)+U);for(let u=U-1;u>=0;u--)border.push(V*(U+1)+u);for(let v=V-1;v>0;v--)border.push(v*(U+1));for(let j=0;j<border.length;j++){const a=border[j],b=border[(j+1)%border.length];I.push(a,b,b+size,a,b+size,a+size);}if(side>0)for(let i=0;i<I.length;i+=3)[I[i+1],I[i+2]]=[I[i+2],I[i+1]];
   const wrap=k.mesh('NoriWrapSolid'+side,k.geometry(P,I),k.solid('NoriGreen','#35452e'),g);wrap.userData.skipOriginalPaint=side<0;
  }
  const colors=[];for(let i=0;i<p.count;i++){const x=p.getX(i)/.005+head.part.pivot[0],py=head.part.pivot[1]-p.getY(i)/.005,c=new T.Color(Math.abs(x-320)<89&&py>419?'#35452e':'#faf8f3').convertSRGBToLinear();colors.push(c.r,c.g,c.b);}carrier.geometry.setAttribute('color',new T.Float32BufferAttribute(colors,3));carrier.material.color.set(0xffffff);carrier.material.userData.preserveVertexColor=true;
  for(let i=0;i<30;i++){const x=177+(i*71)%288,y=116+(i%7)*40;ray.set(new T.Vector3((x-320)*.005,(580-y)*.005,-3),new T.Vector3(0,0,1));const h=ray.intersectObject(carrier)[0];if(!h||y>335&&Math.abs(x-320)<95)continue;const grain=s.ellipsoid('RearRiceGrain'+i,[x,y,h.point.z-.008],[8,5,.025],i%3?'#e5e2d8':'#fffdfa',i*.7);grain.userData.skipOriginalPaint=true;}
  g.userData.artworkOpaqueRegions=[{cx:320,cy:277,rx:119,ry:95}];
 }
 for(const name of ['Torso','LeftArm','RightArm','LeftLeg','RightLeg']){const part=parts.get(name),left=name.startsWith('Left'),tool=require('./sculpt-kit.cjs')(T,k,part);part.group.clear();let ps,center,depth;
  if(name==='Torso'){ps=[[260,417],[380,417],[390,462],[385,501],[365,531],[320,543],[275,531],[255,501],[250,462]];center=[320,480];depth=.28;}
  else if(name.endsWith('Arm')){ps=[[252,420],[270,435],[253,470],[245,497],[233,507],[220,502],[215,489],[222,465],[239,432]].map(([x,y])=>[left?x:640-x,y]);center=[left?241:399,464];depth=.115;}
  else{ps=[[273,524],[310,532],[307,553],[299,573],[280,578],[260,571],[257,558],[265,539]].map(([x,y])=>[left?x:640-x,y]);center=[left?283:357,552];depth=.145;}
  const meshes=volume(part,'FinishedSoftFood'+name,ps,center,depth);for(const mesh of meshes){mesh.userData.artworkFacingFade=[.35,.7];if(name!=='Torso')mesh.userData.skipOriginalPaint=true;}part.group.userData.directSurfaceArtwork=true;part.group.userData.artworkOpaqueRegions=[];tool.paint();for(const mesh of meshes)ink(T,k,mesh,pudding?'#ae7c3b':'#a7a197',.008);
 }
 carrier.userData.artworkFacingFade=[.35,.7];g.userData.artworkOcclusion=true;require('./project-model-artwork.cjs')(T,k,g,head.part.pivot);
 if(!pudding){const edge=carrier.geometry.attributes.position,boundary=[];for(let i=edge.count/2-96;i<edge.count/2;i++)boundary.push([edge.getX(i)/.005+head.part.pivot[0],head.part.pivot[1]-edge.getY(i)/.005]);for(const art of g.children.filter(o=>o.isMesh&&o.material.userData.originalTexture)){const p=art.geometry.attributes.position,c=art.geometry.attributes.color;if(!c)continue;for(let i=0;i<p.count;i++){const x=p.getX(i)/.005+head.part.pivot[0],y=head.part.pivot[1]-p.getY(i)/.005;let d=Infinity;for(const[bx,by]of boundary)d=Math.min(d,Math.hypot(x-bx,y-by));c.setW(i,c.getW(i)*T.MathUtils.smoothstep(d,4,13));}}}
 ink(T,k,carrier,pudding?'#aa7839':'#b7b1a6',.007);
};
