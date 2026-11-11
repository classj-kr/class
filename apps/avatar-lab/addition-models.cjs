"use strict";
module.exports=function(T,id){
 const profile=require('./addition-profiles.cjs')[id],A=require('./addition-kit.cjs')(T,id),{k,part,suit,colorize}=A;
 const h=part('Head'),effects=[];
 if(id==='drink-banana-milk'){
  const body=h.lathe('MilkBottleSolid',[[536,0,326],[532,90,326],[521,118,326],[480,150,326],[425,174,326],[405,179,326],[397,184,326],[385,178,326],[350,168,326],[300,145,326],[250,119,326],[216,106,326],[199,108,326],[193,0,326]],'#ffe49b');
  colorize(body,(x,y,z)=>{const py=580-y/.005;return py>396&&py<416?'#efc674':py<239&&py>220?'#fff3ce':'#ffe49b';});
  h.ink(body,'#9c652f');
  const lid=h.lathe('MilkFoilCapSolid',[[211,0,326],[209,104,326],[203,117,326],[194,117,326],[180,112,326],[163,109,326],[153,91,326],[145,55,326],[143,0,326]],'#8fce9a');
  const p=lid.geometry.attributes.position;for(let i=0;i<p.count;i++){let x=p.getX(i)-.03,z=p.getZ(i);const py=580-p.getY(i)/.005,f=Math.max(0,Math.min(1,(py-175)/30)),a=Math.atan2(z,x),q=1+.018*Math.sin(a*18)*f;p.setX(i,.03+x*q);p.setZ(i,z*q);}lid.geometry.computeVertexNormals();h.ink(lid,'#4c8355');h.face(326,325,91,77);
 }else if(id==='vehicle-ufo'){
  const disc=h.ellipsoid('SaucerSolid',[315,371,0],[251,68,1.20],'#b7bacb');disc.rotation.x=.32;h.ink(disc,'#51434c',.014);
  const dome=h.volume('Dome',[[155,302],[159,255],[181,204],[219,159],[265,133],[315,126],[363,134],[410,162],[445,207],[467,257],[473,304],[462,327],[414,345],[365,351],[315,356],[262,352],[205,339],[166,323]],[315,259],.86,'#62d6d5',.70,-.04);h.ink(dome,'#714a35');h.face(314,263,93,87);
  for(const [i,x,color]of [[0,221,'#ff4a3f'],[1,315,'#ffdc34'],[2,410,'#7cdb39']]){
   const light=h.ellipsoid('SaucerLight'+i+'Solid',[x,i===1?405:394,i===1?1.12:.98],[25,25,.065],color);h.ink(light,'#713524',.012);
  }
 }else if(id==='theme-saturn'){
  const planet=h.ellipsoid('PlanetSolid',[316,310,0],[175,182,.87],'#f4b237');planet.geometry.dispose();planet.geometry=new T.SphereGeometry(1,128,96);h.ink(planet,'#945f29',.014);
  colorize(planet,(x,y,z)=>new T.Color('#f4b237').lerp(new T.Color('#ffe29c'),T.MathUtils.smoothstep(Math.sin((y+.20*x)*7),.35,.65)));
  const P=[],I=[],n=144;
  for(const side of [-1,1])for(const r of [220,274])for(let i=0;i<n;i++){
   const a=i/n*Math.PI*2,x=320+r*Math.cos(a),y=351+r*.265*Math.sin(a)-.235*(x-320),z=r*.005*Math.sin(a)+side*.013;P.push((x-320)*.005,(580-y)*.005,z);
  }
  for(let i=0;i<n;i++){const j=(i+1)%n;for(const [a,b,c,d]of [[i,j,n+j,n+i],[2*n+i,3*n+i,3*n+j,2*n+j],[i,2*n+i,2*n+j,j],[n+i,n+j,3*n+j,3*n+i]])I.push(a,b,c,a,c,d);}
  for(let i=0;i<I.length;i+=3)[I[i+1],I[i+2]]=[I[i+2],I[i+1]];
  const ring=k.mesh('SaturnRingSolid',k.geometry(P,I),k.solid('RingColor','#ffe0a1'),h.group);h.skip(ring);
  for(const r of [220,246,274]){const ps=[];for(let i=0;i<=144;i++){const a=i/144*Math.PI*2,x=320+r*Math.cos(a);ps.push([x,351+r*.265*Math.sin(a)-.235*(x-320),r*.005*Math.sin(a)+.018]);}h.skip(h.tube('RingBorder'+r,ps,r===246?.004:.008,r===246?'#d8a45e':'#8f612f'));}
  h.face(316,308,99,94);
 }else{
  require('./addition-organic.cjs')(T,id,A,h,effects);
 }
 return A.finish(profile,effects);
};
