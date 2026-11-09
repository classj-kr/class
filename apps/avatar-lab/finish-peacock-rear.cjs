"use strict";
// The costume fan repeats its feather print on the rear. Never project the
// human face or the body into the back of the fan.
module.exports=function(T,k,id,parts){
 if(id!=='animal-peacock')return;
 const fan=parts.get('PeacockTailFan');
 for(const back of fan.group.children.filter(o=>/^RoundedPeacockFeather\d+Back$/.test(o.name))){
  const g=back.geometry.clone(),p=g.attributes.position,n=g.attributes.normal,uv=[],C=[];
  for(let i=0;i<p.count;i++){
   const x=p.getX(i)/.005+fan.part.pivot[0],y=fan.part.pivot[1]-p.getY(i)/.005;
   let alpha=Math.max(0,Math.min(1,(-n.getZ(i)-.2)/.45));
   for(const f of back.userData.artworkExcludedRegions||[])if(((x-f.cx)/f.rx)**2+((y-f.cy)/f.ry)**2<1.015)alpha=0;
   uv.push(x/640,y/640);C.push(1,1,1,alpha);p.setZ(i,p.getZ(i)-.006);
  }
  g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setAttribute('color',new T.Float32BufferAttribute(C,4));
  const m=k.art.clone();m.vertexColors=true;m.transparent=true;m.alphaTest=0;m.depthWrite=false;
  const art=k.mesh(back.name+'RearFeatherPrint',g,m,fan.group);art.userData.rearFeatherPrint=true;
 }
};
