"use strict";

// A separate clip keeps accents running while the locomotion clip changes.
// Only standard glTF transforms are used, so these travel with the GLB.
module.exports=function characterEffects(THREE,k,id){
 const duration=id==='animal-whale'?4.8:3.6,tracks=[],count=144;
 const times=Array.from({length:count+1},(_,i)=>duration*i/count);
 const material=(name,color)=>{const m=k.solid(name,color);m.userData.alreadyShaded=true;return m;};
 function vectorTrack(name,sample){const values=[];for(const t of times)values.push(...sample(t/duration));tracks.push(new THREE.VectorKeyframeTrack(name,times,values));}
 function rotationTrack(name,sample){const values=[];for(const t of times)values.push(...new THREE.Quaternion().setFromEuler(new THREE.Euler(...sample(t/duration))).toArray());tracks.push(new THREE.QuaternionKeyframeTrack(name+'.quaternion',times,values));}
 if(id==='food-birthday-cake'){
  for(let i=0;i<3;i++){
   const old=k.root.getObjectByName('Flame'+i),parent=old.parent;
   const flame=new THREE.Group();flame.name='CandleFlame'+i;flame.position.copy(old.position).add(new THREE.Vector3(0,-.15,0));parent.add(flame);parent.remove(old);
   const curve=new THREE.CatmullRomCurve3([[0,0],[.05,.015],[.085,.06],[.095,.12],[.080,.18],[.050,.24],[.025,.29],[0,.34]].map(([r,y])=>new THREE.Vector3(r,y,0)));
   const points=curve.getPoints(48).map(p=>new THREE.Vector2(Math.max(0,p.x),p.y)),geometry=new THREE.LatheGeometry(points,32),colors=[];
   for(let j=0;j<geometry.attributes.normal.count;j++){
    const n=new THREE.Vector3().fromBufferAttribute(geometry.attributes.normal,j),c=new THREE.Color('#f8b64d').convertSRGBToLinear(),shade=.68+.30*Math.abs(n.z)+.02*Math.max(0,n.y);colors.push(c.r*shade,c.g*shade,c.b*shade);
   }
   geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));const fire=material('WarmFlame'+i,'#ffffff');fire.userData.preserveVertexColor=true;
   k.mesh('OuterFlame'+i,geometry,fire,flame);
   const coreOutline=new THREE.CatmullRomCurve3([[0,.245],[.018,.205],[.035,.165],[.047,.115],[.043,.075],[.025,.048],[0,.040],[-.025,.048],[-.043,.075],[-.047,.115],[-.035,.165],[-.018,.205]].map(([x,y])=>new THREE.Vector3(x,y,0)),true,'centripetal').getSpacedPoints(64).slice(0,64);
   const radiusAt=y=>{for(let j=1;j<points.length;j++)if(y<=points[j].y){const a=points[j-1],b=points[j],t=(y-a.y)/(b.y-a.y);return a.x+(b.x-a.x)*t;}return 0;};
   for(const back of [false,true]){
    const P=[],I=[];for(let ring=0;ring<=8;ring++)for(const edge of coreOutline){const t=ring/8,x=edge.x*t,y=.12+(edge.y-.12)*t,r=radiusAt(y);P.push(x,y,(back?-1:1)*(Math.sqrt(Math.max(0,r*r-x*x))+.0015));}
    for(let ring=0;ring<8;ring++)for(let j=0;j<64;j++){const a=ring*64+j,b=ring*64+(j+1)%64,c=a+64,d=b+64;if(ring)I.push(a,b,d);I.push(a,d,c);}
    const core=k.geometry(P,I);if((core.attributes.normal.getZ(128)<0)!==back){for(let j=0;j<I.length;j+=3)[I[j+1],I[j+2]]=[I[j+2],I[j+1]];core.setIndex(I);core.computeVertexNormals();}
    k.mesh((back?'FlameCoreBack':'FlameCore')+i,core,material('FlameCoreColor'+i,'#ffe49b'),flame);
   }
   vectorTrack(flame.name+'.scale',p=>{const a=p*Math.PI*2,dy=.06*Math.sin(a*5+i*1.7)+.025*Math.sin(a*9+i*.9);return[1-dy*.3,1+dy,1-dy*.3];});
   rotationTrack(flame.name,p=>{const a=p*Math.PI*2;return[.025*Math.sin(a*4+i),0,.06*Math.sin(a*3+i*2.1)+.02*Math.sin(a*7+i)];});
  }
 }
 if(id==='animal-whale'){
  const head=k.root.getObjectByName('Head'),jet=new THREE.Group();jet.name='WhaleSpout';
  jet.position.set(-head.position.x,(580-162)*.005-head.position.y,-head.position.z);head.add(jet);
  head.updateMatrixWorld(true);
  for(const mesh of [...head.children])if(mesh.name.startsWith('WaterSpout'))jet.attach(mesh);
  const smooth=t=>t*t*(3-2*t);
  vectorTrack('WhaleSpout.scale',p=>{const t=p*duration;let amount=1;if(t>.45&&t<1.1)amount=1-smooth((t-.45)/.65);else if(t>=1.1&&t<4.35)amount=0;else if(t>=4.35)amount=smooth((t-4.35)/.45);const s=Math.max(.001,amount);return[.6+.4*s,s,.6+.4*s];});
  for(let i=0;i<6;i++){
   const drop=new THREE.Group();drop.name='WhaleDrop'+i;drop.position.copy(jet.position);head.add(drop);
   k.ellipsoid('WaterDrop'+i,[.026,.043,.026],material('WaterDropColor'+i,'#88d0eb'),drop);
   const start=.25+i*.07,life=.85,side=i%2?-1:1;
   vectorTrack(drop.name+'.position',p=>{const t=Math.max(0,Math.min(1,(p*duration-start)/life));return[jet.position.x+side*(.10+(.22+i*.015)*t),jet.position.y+.27+.42*t-.55*t*t,jet.position.z+Math.sin(i*2.4)*.09*t];});
   vectorTrack(drop.name+'.scale',p=>{const t=(p*duration-start)/life,s=t<0||t>1?.001:Math.max(.001,Math.sin(Math.PI*t));return[s,s,s];});
  }
 }
 if(!tracks.length)return null;
 return new THREE.AnimationClip('CharacterEffects',duration,tracks);
};
