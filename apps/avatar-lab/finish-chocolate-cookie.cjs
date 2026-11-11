"use strict";
module.exports=function(T,k,id,parts){
 if(!['food-chocolate','food-cookie'].includes(id))return;
 const cookie=id==='food-cookie',head=parts.get('Head'),g=head.group,s=require('./sculpt-kit.cjs')(T,k,head),smooth=require('./smooth-paired-volume.cjs'),ink=require('./solid-ink-shell.cjs'),colour=cookie?'#e8aa5f':'#875235',stroke=cookie?'#85502d':'#542d1c';
 if(cookie){
  const old=g.getObjectByName('CookieShellSolid');g.remove(old);
  const outline=[[319,65],[382,65],[439,94],[483,145],[501,205],[505,271],[500,329],[471,377],[427,408],[362,429],[300,429],[239,414],[184,384],[150,345],[133,297],[130,244],[139,192],[160,151],[199,109],[252,76]];
  const body=s.smoothOutline('CookieShellSolid',outline.map(([x,y])=>[320+(x-320)*.96,247+(y-247)*.96]),.44,colour,0,.085);body.userData.artworkFacingFade=[.35,.75];
  body.updateWorldMatrix(true,false);const ray=new T.Raycaster();
  for(const o of [...g.children])if(/^RearCookieChip/.test(o.name))g.remove(o);
  const chips=[[0,264,125,25,21],[1,387,106,17,12],[2,342,167,21,17],[3,447,189,22,23],[4,195,206,24,23],[5,466,298,17,16],[6,188,325,17,25],[7,347,405,13,10],[8,416,385,13,11]];
  for(const rear of [false,true])for(const[i,x,y,rx,ry]of chips){
   ray.set(new T.Vector3((x-320)*.005,(580-y)*.005,rear?-3:3),new T.Vector3(0,0,rear?1:-1));const hit=ray.intersectObject(body)[0];if(!hit)throw Error('Cookie chip support absent');
   const chip=s.ellipsoid((rear?'RearCookieChip':'FrontCookieChip')+i,[x,y,hit.point.z+(rear?-.007:.007)],[rx,ry,.025],'#8c4a28',i*.29);chip.userData.skipOriginalPaint=rear;chip.userData.artworkFacingFade=[.15,.5];
   if(rear){const glint=s.ellipsoid('RearCookieChipGlint'+i,[x-rx*.20,y-ry*.28,hit.point.z-.029],[rx*.40,ry*.28,.004],'#af7048',i*.29);glint.userData.skipOriginalPaint=true;}
  }
 }else{
  // Small raised squares give the front the same molded relief as the back.
  for(let col=0;col<3;col++)for(let row=0;row<2;row++){const tile=s.box('FrontChocolateTile'+row+'_'+col,[231+col*91,120+row*94,row?.184:.204],[82,86,.040],'#915031',8);tile.userData.artworkFacingFade=[.15,.5];}
  for(const o of g.children.filter(o=>/^RearChocolateTile/.test(o.name)))o.material.color.set('#925436').convertSRGBToLinear();
  for(const name of ['ChocolateBarSolid','ChocolateWrapperSolid','WrapperFoilSolid'])g.getObjectByName(name).userData.artworkFacingFade=[.85,.98];
 }
 for(const name of ['Torso','LeftArm','RightArm','LeftLeg','RightLeg']){
  const part=parts.get(name),side=name.startsWith('Left')?-1:1,tool=require('./sculpt-kit.cjs')(T,k,part);part.group.clear();let ps,center,depth;
  if(name==='Torso'){ps=cookie?[[260,426],[380,426],[391,460],[391,497],[374,528],[348,540],[292,540],[265,528],[248,497],[248,460]]:[[266,434],[374,434],[386,467],[383,501],[363,532],[320,541],[279,532],[257,501],[254,467]];center=[320,484];depth=.25;}
  else if(name.endsWith('Arm')){ps=(cookie?[[254,425],[271,440],[254,470],[244,495],[236,507],[220,508],[212,495],[216,472],[234,439]]:[[261,438],[274,451],[253,480],[244,505],[230,511],[218,504],[216,490],[228,461],[244,439]]).map(([x,y])=>[side<0?x:640-x,y]);center=[side<0?243:397,471];depth=.095;}
  else{ps=(cookie?[[277,520],[311,525],[307,556],[300,573],[281,578],[261,575],[255,564],[259,544]]:[[275,521],[309,528],[306,556],[299,574],[280,579],[261,573],[258,559],[266,539]]).map(([x,y])=>[side<0?x:640-x,y]);center=[side<0?283:357,550];depth=.13;}
  const nameSolid='CompactFood'+name;k.volume(nameSolid,ps,center,part.part.pivot,depth,depth,part.group,k.solid(nameSolid+'Color',colour),{samples:80,art:false});smooth(T,k,part.group,nameSolid);
  part.group.userData.directSurfaceArtwork=true;part.group.userData.artworkOpaqueRegions=[];
  for(const o of part.group.children){o.userData.artworkFacingFade=[.25,.65];if(!cookie&&name!=='Torso')o.userData.skipOriginalPaint=true;}
  tool.paint();
  // Suppress only the source silhouette ink on the turning rim.
  for(const suffix of ['Surface','Back']){const mesh=part.group.getObjectByName(nameSolid+suffix),art=part.group.getObjectByName(nameSolid+suffix+'OriginalPaint'),edge=mesh.userData.paddedBoundary;if(art&&edge){const p=art.geometry.attributes.position,c=art.geometry.attributes.color;for(let i=0;i<p.count;i++){let d=Infinity;for(const v of edge)d=Math.min(d,Math.hypot(p.getX(i)-v.x,p.getY(i)-v.y));c.setW(i,c.getW(i)*T.MathUtils.smoothstep(d,.02,.05));}}ink(T,k,mesh,stroke,.008);}
  if(cookie&&name==='Torso'){
   const back=part.group.getObjectByName(nameSolid+'Back');back.updateWorldMatrix(true,false);const ray=new T.Raycaster();
   for(const[i,x,y,rx,ry]of [[0,280,460,14,16],[1,359,462,14,15],[2,320,505,14,11]]){ray.set(new T.Vector3((x-320)*.005,(580-y)*.005,-3),new T.Vector3(0,0,1));const h=ray.intersectObject(back)[0];if(!h)throw Error('Cookie body chip missing support');const chip=tool.ellipsoid('RearCookieBodyChip'+i,[x,y,h.point.z-.005],[rx,ry,.020],'#8c4a28',i*.25);chip.userData.skipOriginalPaint=true;ink(T,k,chip,stroke,.004);}
  }
 }
 g.userData.artworkOpaqueRegions=[cookie?{cx:319,cy:299,rx:114,ry:98}:{cx:319,cy:320,rx:109,ry:90}];
 require('./project-model-artwork.cjs')(T,k,g,head.part.pivot);
 for(const mesh of g.children.filter(o=>o.isMesh&&!o.material.userData.originalTexture&&/^RearCookieChip\d+$/.test(o.name)))ink(T,k,mesh,stroke,.004);
};
