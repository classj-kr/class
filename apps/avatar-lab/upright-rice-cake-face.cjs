"use strict";
// The illustration's face stands in the food; it is not painted onto a tilted liquid plane.
module.exports=function(T,k,head){
 const g=head.group,ps=[[198,294],[202,268],[220,239],[251,215],[288,203],[325,202],[368,211],[410,233],[436,264],[445,294],[440,326],[424,355],[393,376],[355,386],[317,389],[277,386],[238,370],[213,344],[200,319]];
 const inside=(x,y)=>{let hit=false;for(let i=0,j=ps.length-1;i<ps.length;j=i++){
  const[a,b]=ps[i],[c,d]=ps[j];if((b>y)!==(d>y)&&x<(c-a)*(y-b)/(d-b)+a)hit=!hit;
 }return hit;};
 const name='RiceCakeUprightFace';
 k.volume(name,ps,[320,292],head.part.pivot,.10,.55,g,k.solid(name+'Color','#713c2a'),{art:false,samples:128,z:1.25});
 require('./smooth-paired-volume.cjs')(T,k,g,name,{rings:24});
 const P=[],I=[];for(const suffix of ['Surface','Back']){const o=g.getObjectByName(name+suffix),n=P.length/3;P.push(...o.geometry.attributes.position.array);I.push(...Array.from(o.geometry.index.array,j=>j+n));g.remove(o);}
 const face=k.mesh(name+'Solid',k.geometry(P,I),k.solid(name+'Color','#713c2a'),g);face.userData.artworkFacingFade=[.05,.2];
 return function finish(){
  for(const o of g.children){
   if(!o.material?.userData.originalTexture||o.name.startsWith(name))continue;
   const p=o.geometry.attributes.position,c=o.geometry.attributes.color;
   for(let i=0;i<p.count;i++)if(inside(head.part.pivot[0]+p.getX(i)/.005,head.part.pivot[1]-p.getY(i)/.005))c.setW(i,0);
  }
 };
};
