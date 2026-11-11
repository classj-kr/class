"use strict";
// Continue the shell/tail artwork onto its opposite broad surface, excluding
// the foreground face/body and fading before the volume turns sideways.
module.exports=function(T,k,id,parts){
 if(!['animal-snail','animal-squirrel','animal-wolf'].includes(id))return;
 const wolf=id==='animal-wolf',unicorn=id==='animal-unicorn',snail=id==='animal-snail',part=parts.get(snail?'SpiralShell':'Tail'),mesh=part.group.getObjectByName(unicorn?'FlowingUnicornTailSolid':(wolf?'AttachedCanineTail':snail?'RoundedSpiralShell':'CurledSquirrelTail')+'Back');
 const g=mesh.geometry.clone(),p=g.attributes.position,n=g.attributes.normal,U=[],C=[];
 const excluded=wolf?[[320,490,76,80],[392,495,24,32]]:unicorn?[[320,490,66,67],[383,480,23,44]]:snail?[[195,310,155,144]]:[[262,249,191,176],[262,475,60,92],[340,487,31,47]];
 for(let i=0;i<p.count;i++){
  const x=p.getX(i)/.005+part.part.pivot[0],y=part.part.pivot[1]-p.getY(i)/.005;
  U.push(x/640,y/640);let alpha=Math.max(0,Math.min(1,(-n.getZ(i)-.25)/.40));
  for(const [cx,cy,rx,ry]of excluded){const r=Math.hypot((x-cx)/rx,(y-cy)/ry);alpha*=Math.max(0,Math.min(1,(r-1)/.05));}
  C.push(1,1,1,alpha);p.setZ(i,p.getZ(i)-.006);
 }
 g.setAttribute('uv',new T.Float32BufferAttribute(U,2));g.setAttribute('color',new T.Float32BufferAttribute(C,4));
 const mat=k.art.clone();mat.vertexColors=true;mat.transparent=true;mat.alphaTest=0;mat.depthWrite=false;
 k.mesh(mesh.name+'ReversePattern',g,mat,part.group);
};
