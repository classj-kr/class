"use strict";
// Short limbless costumes: rounded hood, low real coil and an attached tail.
module.exports=function snakes(THREE,k,id,parts){
 if(!['animal-viper','animal-ratsnake'].includes(id))return false;
 const viper=id==='animal-viper',head=parts.get('Head'),s=require('./sculpt-kit.cjs')(THREE,k,head);
 s.parent.clear();const green=viper?'#91ab45':'#77a84d',belly=viper?'#d4d479':'#c7d778';
 const outline=viper?[[306,95],[359,101],[403,94],[439,125],[459,188],[475,260],[460,331],[414,386],[350,411],[281,416],[213,394],[164,350],[138,277],[146,215],[173,162],[175,130],[205,96],[256,103]]:[[317,62],[230,82],[166,135],[128,204],[116,278],[140,355],[202,417],[280,452],[348,450],[421,413],[484,352],[517,278],[493,195],[447,123],[382,80]];
 k.volume('SnakeHood',outline,viper?[306,255]:[317,258],head.part.pivot,viper?.70:.78,viper?.70:.78,s.parent,k.solid('SnakeHoodGreen',green),{art:false,samples:96});
 if(viper){
  s.cone('ViperCrest',[306,83,-.03],.15,.23,'#b8c75e');
  for(const [name,x,y] of [['Left',211,143],['Right',401,144]])s.ellipsoid('Viper'+name+'EyeBulge',[x,y,.28],[40,47,.19],green);
  s.ellipsoid('ViperUpperMuzzle',[306,210,.60],[119,26,.09],green);
 }
 s.lathe('ShortSnakeTorso',viper?[[488,0,306],[478,58,306],[453,55,305],[427,44,304],[409,53,303],[400,0,303]]:[[528,0,317],[516,85,317],[495,62,317],[472,47,317],[445,57,317],[437,0,317]],green);
 const radius=viper?.47:.65,tube=viper?.19:.16;
 const coil=s.torus('LowSnakeCoil',viper?[313,505,0]:[320,548,0],radius,tube,green);
 coil.geometry.dispose();coil.geometry=new THREE.TorusGeometry(radius,tube,24,128);
 coil.rotation.x=Math.PI/2;
 coil.userData.skipOriginalPaint=true;
 const normal=coil.geometry.attributes.normal,uv=coil.geometry.attributes.uv,colors=[];
 for(let i=0;i<normal.count;i++){
  const ny=normal.getY(i)*Math.cos(coil.rotation.x)-normal.getZ(i)*Math.sin(coil.rotation.x);
  const u=uv.getX(i),v=uv.getY(i),seam=viper&&Math.abs(Math.sin(u*Math.PI*32))<.10;
  const spot=viper&&Math.hypot((u*16-Math.round(u*16))/.30,(v-.76)/.10)<1;
  const c=new THREE.Color(ny<-.10?(seam?'#a7af62':belly):spot?'#749640':green).convertSRGBToLinear();colors.push(c.r,c.g,c.b);
 }
 coil.geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));coil.material.color.set(0xffffff);coil.material.userData.preserveVertexColor=true;
 s.paint();head.special=true;head.authoredFamily='coiled-snake';
 const path=viper?[[418,492,-.10,18],[460,473,-.09,19],[482,433,.01,15],[458,402,.03,2]]:[[435,533,-.08,14],[476,517,-.04,14],[480,493,.03,8],[455,481,.06,2]];
 const pivot=path[0].slice(0,2),tail={group:k.group('SnakeTail',pivot,path[0][2]),part:{pivot,color:green}};
 const ts=require('./sculpt-kit.cjs')(THREE,k,tail),mesh=ts.sweep('ContinuousSnakeTail',path,green),p=mesh.geometry.attributes.normal,tc=[];
 for(let i=0;i<p.count;i++){const c=new THREE.Color(p.getY(i)<-.15?belly:green).convertSRGBToLinear();tc.push(c.r,c.g,c.b);}
 mesh.geometry.setAttribute('color',new THREE.Float32BufferAttribute(tc,3));mesh.material.color.set(0xffffff);mesh.material.userData.preserveVertexColor=true;
 return true;
};
