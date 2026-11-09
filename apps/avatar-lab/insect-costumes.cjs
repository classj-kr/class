"use strict";

// Author complete insect costumes, keeping the wings separate from the hood
// and limbs. Thin appendages get their own thickness, not the head's depth.
module.exports=function insectCostumes(THREE,k,id,parts){
 const lady=id==='animal-ladybug';if(!lady&&id!=='animal-dragonfly')return false;
 const cx=lady?318:320,base=lady?'#ea4238':'#69aaa8';
 for(const p of parts.values())k.body.remove(p.group);parts.clear();
 function part(name,pivot,color=base,z=0){
  const p={part:{pivot,color},group:k.group(name,pivot,z),solid:k.solid(name+'Color',color),special:true};parts.set(name,p);
  p.group.userData.directSurfaceArtwork=true;p.group.userData.artworkOpaqueRegions=[];return p;
 }
 function volume(p,name,outline,center,depth,color=base,z=0){
  k.volume(name,outline,center,p.part.pivot,depth,depth,p.group,k.solid(name+'Color',color),{art:false,z,samples:96});
 }
 function paint(p){require('./project-model-artwork.cjs')(THREE,k,p.group,p.part.pivot);}
 const mirror=(outline,side)=>outline.map(([x,y])=>[cx+side*(x-cx),y]);
 function limb(name,outline,center,pivot,depth,color){const p=part(name,pivot,color);volume(p,name+'Form',outline,center,depth,color);paint(p);return p;}
 const head=part('Head',[cx,lady?280:275]);
 // Keep the human expression opaque, but fade outline pixels before the
 // surface turns sideways. An all-head opaque decal stretches ink into ribs.
 head.group.userData.artworkOpaqueRegions=[{cx,cy:lady?318:299,rx:lady?120:90,ry:lady?94:76}];
 volume(head,'RoundedInsectHood',k.ellipse(cx,lady?280:273,lady?164:123,lady?151:113),[cx,lady?280:273],lady?.69:.55);
 const h=require('./sculpt-kit.cjs')(THREE,k,head);
 const rim=k.ellipse(cx,lady?280:273,lady?164:123,lady?151:113,96).map(([x,y])=>[x,y,0]);rim.push(rim[0]);
 h.tube('HoodEdgePiping',rim,.010,lady?'#59251f':'#204d4f');
 for(const side of [-1,1]){
  const path=lady?[[363,160,.32,11],[375,131,.25,12],[403,105,.12,12],[438,90,.03,12]]:[[356,196,.33,8],[370,162,.26,9],[389,137,.12,11],[414,126,.03,11]];
  h.sweep('CurvedInsectAntenna'+side,path.map(([x,y,z,r])=>[cx+side*(x-cx),y,z,r]),lady?'#56362e':'#205b60');
  const [x,y,z,r]=path.at(-1);h.ellipsoid('RoundedAntennaTip'+side,[cx+side*(x-cx),y,z],lady?[26,27,.13]:[r,r,.055],lady?'#684139':'#205b60');
 }
 paint(head);
 const torso=part('Torso',[cx,lady?476:420],lady?'#a1775d':base);
 const torsoOutline=lady?[[269,417],[367,417],[379,449],[384,482],[375,513],[356,533],[319,541],[283,535],[261,518],[250,491],[251,462],[258,437]]:[[289,373],[351,373],[358,398],[358,433],[350,455],[338,464],[302,464],[290,455],[282,433],[282,398]];
 volume(torso,'ShortSegmentedAbdomen',torsoOutline,[cx,lady?478:420],lady?.26:.20,lady?'#a1775d':base);
 // Fit continuous bands to the actual abdomen. Vertex threshold coloring
 // makes their rear edges stair-step along the mesh's radial triangulation.
 const carriers=torso.group.children.map(m=>new THREE.Mesh(m.geometry,new THREE.MeshBasicMaterial({side:THREE.DoubleSide})));carriers.forEach(m=>m.updateMatrixWorld(true));
 for(const [j,level] of (lady?[445,477,508]:[398,420,442]).entries()){
  const P=[],I=[],count=96,ray=new THREE.Raycaster();
  for(const edge of [-1,1])for(let i=0;i<count;i++){
   const a=(i+.5)/count*Math.PI*2,x=Math.cos(a),z=Math.sin(a),y=(torso.part.pivot[1]-level-edge*(lady?1.8:1.2))*.005;
   ray.set(new THREE.Vector3(x*3,y,z*3),new THREE.Vector3(-x,0,-z));const hit=ray.intersectObjects(carriers)[0];if(!hit)throw new Error('Abdomen band misses its surface');
   P.push(hit.point.x+x*.003,hit.point.y,hit.point.z+z*.003);
  }
  for(let i=0;i<count;i++){const b=(i+1)%count;I.push(i,b,count+b,i,count+b,count+i);}
  const band=k.mesh('AbdomenBand'+j,k.geometry(P,I),k.solid('AbdomenBandColor',lady?'#644437':'#4e8a88'),torso.group);band.userData.skipOriginalPaint=true;
 }
 carriers.forEach(m=>m.material.dispose());
 paint(torso);
 const arm=lady?[[262,420],[247,434],[231,456],[220,480],[217,494],[223,505],[236,505],[249,495],[255,474],[261,447],[270,427]]:[[291,374],[280,391],[270,411],[259,431],[259,442],[267,448],[279,444],[285,428],[290,407],[298,378]];
 const leg=lady?[[268,530],[306,538],[308,556],[301,572],[285,579],[270,576],[258,570],[255,560],[260,546]]:[[289,457],[315,461],[317,483],[315,511],[310,522],[300,523],[294,513],[291,491]];
 for(const side of [-1,1]){
  limb(side<0?'LeftArm':'RightArm',mirror(arm,-side),[cx+side*(lady?78:44),lady?468:417],[cx+side*(lady?55:29),lady?421:377],lady?.14:.10,lady?'#6b493b':base);
  limb(side<0?'LeftLeg':'RightLeg',mirror(leg,-side),[cx+side*(lady?36:15),lady?554:491],[cx+side*(lady?26:15),lady?534:458],lady?.15:.11,lady?'#6b493b':base);
 }
 const redWing=[[205,369],[244,391],[280,416],[257,437],[231,466],[202,502],[177,533],[162,550],[151,541],[138,517],[132,487],[134,459],[146,429],[164,402],[185,382]];
 const innerWing=[[267,426],[285,460],[280,489],[259,517],[232,538],[207,550],[187,551],[179,543],[184,525],[207,495],[235,457]];
 const upperWing=[[290,376],[265,344],[222,321],[190,304],[170,293],[150,283],[130,274],[110,267],[90,262],[70,260],[55,262],[45,267],[40,273],[39,284],[40,292],[45,301],[55,314],[70,329],[90,344],[110,356],[130,365],[150,372],[170,377],[190,381],[216,385],[254,385]];
 const lowerWing=[[291,378],[260,381],[230,382],[210,384],[190,388],[170,392],[150,397],[130,404],[110,413],[100,419],[90,429],[88,439],[91,448],[100,453],[110,458],[130,463],[150,464],[170,463],[190,459],[210,453],[230,443],[250,432],[270,418]];
 for(const side of [-1,1]){
  const wing=part(side<0?'LeftWing':'RightWing',[cx,lady?431:380],lady?'#e7443c':'#c3e4ee',-.25);
  const ws=require('./sculpt-kit.cjs')(THREE,k,wing);
  ws.sweep('AttachedWingHinge'+side,[[cx+side*20,lady?433:388,-.10,11],[cx+side*37,lady?435:391,-.19,12],[cx+side*58,lady?439:391,-.25,11]],lady?'#a1775d':'#69aaa8');
  if(lady){
   volume(wing,'PaleInnerWing'+side,mirror(innerWing,-side),[cx+side*88,499],.045,'#dedce8',-.07);
   volume(wing,'RedWingCover'+side,mirror(redWing,-side),[cx+side*116,452],.14,'#e7443c');
  }else{
   volume(wing,'UpperDragonflyWing'+side,mirror(upperWing,-side),[cx+side*147,330],.045,'#c3e4ee');
   volume(wing,'LowerDragonflyWing'+side,mirror(lowerWing,-side),[cx+side*123,423],.040,'#c3e4ee');
  }
  for(const m of wing.group.children)m.userData.artworkExcludedRegions=[{cx,cy:lady?280:273,rx:lady?161:120,ry:lady?148:110},{cx,cy:lady?480:420,rx:lady?62:37,ry:lady?59:43}];
  paint(wing);
  // The same anatomical wing markings continue on the rear. Only wing
  // geometry receives this reverse mapping, so no human face can be repeated.
  for(const m of wing.group.children.slice()){
   if(!m.name.endsWith('Back')||m.material.userData.originalTexture)continue;
   const g=m.geometry.clone(),p=g.attributes.position,uv=[];
   for(let i=0;i<p.count;i++){uv.push((p.getX(i)/.005+wing.part.pivot[0])/640,(wing.part.pivot[1]-p.getY(i)/.005)/640);p.setZ(i,p.getZ(i)-.004);}
   g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));
   // Wings begin behind the hood and torso; mask their overlaps at the rear.
   const colors=[];for(let i=0;i<p.count;i++){const x=uv[i*2]*640,y=uv[i*2+1]*640,underHead=((x-cx)/(lady?164:124))**2+((y-(lady?280:273))/(lady?151:113))**2<1,underTorso=((x-cx)/(lady?69:42))**2+((y-(lady?478:420))/(lady?64:48))**2<1;colors.push(1,1,1,underHead||underTorso?0:1);}
   g.setAttribute('color',new THREE.Float32BufferAttribute(colors,4));const material=k.art.clone();material.vertexColors=true;material.transparent=true;material.alphaTest=0;material.depthWrite=false;k.mesh(m.name+'WingPattern',g,material,wing.group);
  }
 }
 return true;
};
