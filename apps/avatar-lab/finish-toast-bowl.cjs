"use strict";
module.exports=function(T,k,id,parts){
 if(!['food-toast','food-tteokbokki'].includes(id))return;
 const toast=id==='food-toast',head=parts.get('Head'),g=head.group,s=require('./sculpt-kit.cjs')(T,k,head),ink=require('./solid-ink-shell.cjs');
 for(const o of [...g.children])if(o.material?.userData.originalTexture)g.remove(o);
 if(toast){
  const bread=g.getObjectByName('ToastBreadSolid');bread.userData.artworkFacingFade=[.35,.7];
  for(const name of ['Torso','LeftArm','RightArm','LeftLeg','RightLeg']){const part=parts.get(name),left=name.startsWith('Left');part.group.clear();let ps,center,depth;
   if(name==='Torso'){ps=[[258,419],[382,419],[390,461],[383,500],[361,533],[320,542],[279,533],[257,500],[250,461]];center=[320,478];depth=.28;}
   else if(name.endsWith('Arm')){ps=[[251,419],[269,435],[254,467],[247,494],[232,507],[217,501],[214,484],[224,453],[239,430]].map(([x,y])=>[left?x:640-x,y]);center=[left?241:399,463];depth=.12;}
   else{ps=[[273,526],[308,533],[306,551],[301,573],[283,579],[260,573],[257,560],[266,541]].map(([x,y])=>[left?x:640-x,y]);center=[left?283:357,552];depth=.145;}
   const name2='FinishedToast'+name;k.volume(name2,ps,center,part.part.pivot,depth,depth,part.group,k.solid(name2+'Color','#be8551'),{art:false,samples:96});require('./smooth-paired-volume.cjs')(T,k,part.group,name2,{rings:24});for(const suffix of ['Surface','Back']){const o=part.group.getObjectByName(name2+suffix);o.userData.artworkFacingFade=[.35,.70];if(name!=='Torso')o.userData.skipOriginalPaint=true;}
   part.group.userData.directSurfaceArtwork=true;part.group.userData.artworkOpaqueRegions=[];require('./sculpt-kit.cjs')(T,k,part).paint();for(const suffix of ['Surface','Back'])ink(T,k,part.group.getObjectByName(name2+suffix),'#926039',.008);
  }
  g.userData.artworkOpaqueRegions=[{cx:310,cy:312,rx:117,ry:98}];
 }else{
  const bowl=g.getObjectByName('RiceCakeBowlSolid');g.remove(bowl);g.getObjectByName('RiceCakeSauceSolid').userData.artworkFacingFade=[.08,.30];
  for(let i=0;i<5;i++){const piece=g.getObjectByName('RiceCakePiece'+i);piece.scale.multiplyScalar(.86);piece.position.y-=.015;}
  const profile=[[0,.15],[.48,.15],[.60,.17],[.66,.22],[.67,.28],[.65,.33],[.74,.37],[.90,.53],[1.10,.80],[1.26,1.20],[1.36,1.62],[1.39,1.70],[1.36,1.74],[1.32,1.73],[1.29,1.68],[1.24,1.40],[1.08,1],[.86,.70],[.62,.48],[0,.48],[0,.15]],curve=new T.CatmullRomCurve3(profile.map(([r,y])=>new T.Vector3(r,y,0))),points=curve.getPoints(224).map(v=>new T.Vector2(Math.max(0,v.x),v.y)),geo=new T.LatheGeometry(points,96),p=geo.attributes.position,C=[];
  for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),c=new T.Color(y>1.35&&y<1.58?'#d14e35':'#f4dfc7').convertSRGBToLinear();C.push(c.r,c.g,c.b);p.setY(i,y-.58*z*Math.min(1,Math.max(0,y/1.7)));}geo.computeVertexNormals();geo.setAttribute('color',new T.Float32BufferAttribute(C,3));const newBowl=s.mesh('RiceCakeBowlSolid',geo,'#ffffff');newBowl.material.userData.preserveVertexColor=true;newBowl.userData.artworkFacingFade=[.4,.72];
 }
 if(!toast)require('./rice-cake-toppings.cjs')(T,k,head);
 const finishFace=toast?null:require('./upright-rice-cake-face.cjs')(T,k,head);
 g.userData.artworkOcclusion=true;require('./project-model-artwork.cjs')(T,k,g,head.part.pivot);
 if(finishFace)finishFace();
 if(!toast){const art=g.getObjectByName('RiceCakeBowlSolidOriginalPaint'),p=art.geometry.attributes.position,c=art.geometry.attributes.color;for(let i=0;i<p.count;i++){const py=head.part.pivot[1]-p.getY(i)/.005;c.setW(i,c.getW(i)*(1-T.MathUtils.smoothstep(py,425,455)));}ink(T,k,g.getObjectByName('RiceCakeBowlSolid'),'#ae8163',.006);}
};
