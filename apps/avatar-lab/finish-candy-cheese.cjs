"use strict";
module.exports=function(T,k,id,parts){
 if(!['food-candy','food-cheese'].includes(id))return;
 const candy=id==='food-candy',head=parts.get('Head'),g=head.group,s=require('./sculpt-kit.cjs')(T,k,head),rounded=require('./rounded-contour-solid.cjs'),pink='#f38298',yellow='#ffcf52',colour=candy?pink:yellow,stroke=candy?'#903e44':'#a66c0c';
 // Scale a reversed closed copy about its centre. A normal-offset shell on
 // the tight concave folds can intersect itself and expose dark shards.
 function ink(T,k,mesh,color,width){mesh.updateMatrix();const geo=mesh.geometry.clone().applyMatrix4(mesh.matrix);geo.computeBoundingBox();const c=geo.boundingBox.getCenter(new T.Vector3()),size=geo.boundingBox.getSize(new T.Vector3()),p=geo.attributes.position;
  const scale=1+width/Math.max(size.x,size.y)*2;for(let i=0;i<p.count;i++)p.setXYZ(i,c.x+(p.getX(i)-c.x)*scale,c.y+(p.getY(i)-c.y)*scale,c.z+(p.getZ(i)-c.z)*scale);
  const indices=Array.from(geo.index.array);for(let i=0;i<indices.length;i+=3)[indices[i+1],indices[i+2]]=[indices[i+2],indices[i+1]];geo.setIndex(indices);geo.computeVertexNormals();geo.computeBoundingBox();geo.computeBoundingSphere();geo.deleteAttribute('color');const mat=k.solid(mesh.name+'OutlineColor',color);mat.userData.alreadyShaded=true;const shell=k.mesh(mesh.name+'InkShell',geo,mat,mesh.parent);shell.userData.skipOriginalPaint=true;
 }
 function fadeRim(art,mesh){if(!art)return;const p=mesh.geometry.attributes.position,edge=[];mesh.geometry.computeBoundingBox();const z=mesh.geometry.boundingBox.getCenter(new T.Vector3()).z;
  for(let i=0;i<p.count;i++)if(Math.abs(p.getZ(i)-z)<1e-6)edge.push([p.getX(i),p.getY(i)]);
  const ap=art.geometry.attributes.position,c=art.geometry.attributes.color;if(!c||!edge.length)return;
  for(let i=0;i<ap.count;i++){let d=Infinity;for(const[x,y]of edge)d=Math.min(d,Math.hypot(ap.getX(i)-x,ap.getY(i)-y));c.setW(i,c.getW(i)*T.MathUtils.smoothstep(d,.025,.065));}
 }
 if(candy){
  for(const o of [...g.children])if(/^CandyWrapper|^WrapperRearFinish/.test(o.name))g.remove(o);
  for(const side of [-1,1]){
   const outline=[[159,190],[102,144],[74,132],[56,137],[52,151],[62,193],[56,215],[45,241],[48,262],[66,292],[58,320],[59,337],[75,343],[115,323],[159,288]].map(([x,y])=>[side<0?x:640-x,y]);
   const wrapper=rounded(T,k,s,'CandyWrapperSolid'+side,outline,{front:.12,back:.12,color:pink,rounding:20,samples:100});
   wrapper.userData.artworkFacingFade=[.85,.98];
   // Mirror only the wrapper artwork onto its reverse; no human face enters it.
   const geo=wrapper.geometry.clone(),p=geo.attributes.position,n=geo.attributes.normal,uv=[],C=[];
   for(let i=0;i<p.count;i++){uv.push((p.getX(i)/.005+s.pivot[0])/640,(s.pivot[1]-p.getY(i)/.005)/640);C.push(1,1,1,T.MathUtils.smoothstep(-n.getZ(i),.85,.98));p.setZ(i,p.getZ(i)-.003);}
   geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geo.setAttribute('color',new T.Float32BufferAttribute(C,4));const mat=k.art.clone();mat.vertexColors=true;mat.transparent=true;mat.depthWrite=false;mat.alphaTest=0;const rear=k.mesh('WrapperRearFinish'+side,geo,mat,g);rear.userData.skipOriginalPaint=true;fadeRim(rear,wrapper);
  }
  const shell=g.getObjectByName('CandyShellSolid');shell.userData.artworkFacingFade=[.22,.65];
 }
 for(const name of ['Torso','LeftArm','RightArm','LeftLeg','RightLeg']){
  const part=parts.get(name),tool=require('./sculpt-kit.cjs')(T,k,part),side=name.startsWith('Left')?-1:1,z=candy?0:.36;part.group.clear();
  let contour,depth=.17;
  if(name==='Torso'){
   contour=candy?[[270,392],[370,392],[385,430],[397,471],[386,509],[364,526],[320,534],[277,527],[253,506],[243,469],[254,429]]:[[253,399],[386,399],[391,433],[392,475],[379,507],[357,524],[320,530],[283,524],[260,507],[247,475],[248,433]];depth=.27;
  }else if(name.endsWith('Arm')){
   contour=(candy?[[263,398],[269,423],[248,460],[238,486],[224,490],[213,481],[214,458],[229,427]]:[[251,406],[267,425],[251,457],[243,482],[240,493],[225,492],[213,483],[216,461],[230,430]]).map(([x,y])=>[side<0?x:640-x,y]);depth=.09;
  }else{
   contour=(candy?[[278,512],[309,521],[305,551],[297,563],[274,568],[255,561],[253,549],[265,531]]:[[277,511],[311,520],[310,550],[303,567],[285,577],[264,572],[253,561],[257,545],[269,530]]).map(([x,y])=>[side<0?x:640-x,y]);depth=.13;
  }
  const mesh=rounded(T,k,tool,candy&&name==='Torso'?'CandyTorsoSolid':name+'RoundedSolid',contour,{front:depth,back:depth*.85,z,color:colour,rounding:name==='Torso'?45:18,samples:name==='Torso'?96:64});
  mesh.userData.artworkFacingFade=[.85,.98];if(candy)mesh.userData.skipOriginalPaint=true;part.group.userData.directSurfaceArtwork=true;part.group.userData.artworkOpaqueRegions=[];tool.paint();fadeRim(part.group.getObjectByName(mesh.name+'OriginalPaint'),mesh);
  if(candy&&name==='Torso')k.projectArtwork('OriginalCandyBelly',k.ellipse(320,455,62,59),[320,455],part.part.pivot,part.group,mesh,{samples:96,rings:24,offset:.006});
  if(name==='Torso')ink(T,k,mesh,stroke,.012);
  if(!candy&&name==='Torso'){
   mesh.updateWorldMatrix(true,false);const ray=new T.Raycaster();
   for(const[j,cx,cy,rx,ry]of [[0,288,455,20,22],[1,351,430,14,14],[2,325,505,9,7],[3,366,475,6,10]]){
    const P=[],I=[],C=[],N=40,R=8;for(let r=0;r<=R;r++)for(let i=0;i<N;i++){const a=i/N*Math.PI*2,x=cx+Math.cos(a)*rx*r/R,y=cy+Math.sin(a)*ry*r/R;ray.set(new T.Vector3((x-320)*.005,(580-y)*.005,-3),new T.Vector3(0,0,1));const hit=ray.intersectObject(mesh)[0];if(!hit)throw Error('Missing rear cheese spot support');const q=part.group.worldToLocal(hit.point.clone());P.push(q.x,q.y,q.z-.003);const c=new T.Color(r===R?'#bc821b':'#e8a323').convertSRGBToLinear();C.push(c.r,c.g,c.b);}
    for(let r=0;r<R;r++)for(let i=0;i<N;i++){const a=r*N+i,b=r*N+(i+1)%N,c=a+N,d=b+N;if(r)I.push(a,d,b);I.push(a,c,d);}const geo=k.geometry(P,I);geo.setAttribute('color',new T.Float32BufferAttribute(C,3));const dot=k.mesh('RearBodyCheeseDimple'+j,geo,k.solid('RearBodyCheeseDimpleColor'+j,'#ffffff'),part.group);dot.material.userData.preserveVertexColor=true;dot.userData.skipOriginalPaint=true;
   }
  }
 }
 g.userData.artworkOpaqueRegions=candy?[{cx:320,cy:281,rx:125,ry:103}]:[{cx:320,cy:297,rx:122,ry:104}];
 const solids=g.children.filter(o=>o.isMesh&&!o.material.userData.originalTexture&&!/Dimple/.test(o.name));
 const rear=g.children.filter(o=>/^WrapperRearFinish/.test(o.name));
 require('./project-model-artwork.cjs')(T,k,g,head.part.pivot);for(const o of rear)g.add(o);
 for(const mesh of solids){if(/^CandyWrapperSolid/.test(mesh.name))fadeRim(g.getObjectByName(mesh.name+'OriginalPaint'),mesh);else ink(T,k,mesh,stroke,.013);}
};
