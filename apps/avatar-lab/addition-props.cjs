"use strict";
// Each outline and landmark is measured against its own original, in pixels.
module.exports=function(T,id,A,h,effects){
 const {k,part,suit,colorize}=A,ink=(o,c='#634739',w=.012)=>h.ink(o,c,w);
 if(id==='animal-triceratops'){
  suit({cx:334,top:412,hip:478,bottom:505,width:102,color:'#62b9a6',footColor:'#6bc1ac'});
  const ps=[[146,251],[166,224],[174,185],[204,166],[222,158],[239,121],[263,113],[292,123],[319,96],[340,92],[360,102],[378,123],[410,114],[435,129],[451,158],[481,169],[495,190],[494,220],[518,242],[527,263],[514,283],[500,296],[495,320],[478,337],[446,332],[224,336],[194,337],[175,326],[170,296],[150,279]];
  const frill=ink(h.volume('ScallopedFrill',ps,[335,228],.22,'#72c4b0',.24,-.35));
  colorize(frill,(x,y,z)=>Math.sin(Math.atan2(y-1.8,x-.075)*9)>.2?'#80cdb9':'#62b39f');
  ink(h.volume('TriceratopsHood',[[198,307],[216,242],[255,194],[300,175],[344,172],[392,183],[435,221],[461,275],[471,330],[453,371],[416,402],[367,419],[314,422],[262,409],[222,378],[201,344]],[334,304],.66,'#61baa5'));
  h.face(334,332,108,80);
  for(const [name,ps,c]of [['LeftHorn',[[251,134],[259,138],[276,162],[294,183],[296,197],[285,209],[265,214],[253,205],[246,184],[244,157]],[267,178]],['RightHorn',[[420,134],[427,139],[428,159],[423,185],[415,207],[401,214],[383,207],[377,196],[388,178],[404,153]],[405,178]]])ink(h.volume(name,ps,c,.18,'#ffe4b6',.18,.17));
  ink(h.ellipse('TriceratopsMuzzle',[336,250],[50,25],.13,'#6ac5ac',.61));
  ink(h.volume('NoseHorn',[[319,231],[325,214],[336,199],[342,204],[352,230],[349,240],[333,245],[322,241]],[336,225],.12,'#ffe4b6',.12,.79));
  const tail=part('TriceratopsTail',[367,476],-.18);tail.ink(tail.volume('CurvedTail',[[350,464],[388,470],[414,457],[423,459],[420,470],[404,484],[379,493],[350,482]],[389,478],.12,'#5eb6a3'));
 }else if(id==='food-cotton-candy'){
  // The narrow stick is the torso, not an enlarged humanoid body.
  const b=part('Torso',[316,493]);b.ink(b.box('CandyStickSolid',[316,530,0],[24,83,.14],'#f5cf89',6));
  for(const [name,x,sign]of [['Left',289,-1],['Right',340,1]]){
   const a=part(name+'Arm',[x,498]);a.ink(a.volume(name+'CandySleeve',[[316,496],[x+sign*8,495],[x+sign*18,519],[x+sign*10,531],[x-sign*6,528],[x-sign*11,512]],[x,513],.10,'#f59bb7'));
   const l=part(name+'Leg',[x-sign*7,555]);l.ink(l.ellipse(name+'CandyBoot',[x-sign*9,572],[18,13],.12,'#f59bb7'));
  }
  ink(h.volume('CandyCloud',[[335,65],[354,59],[385,65],[415,86],[434,116],[442,143],[469,159],[488,190],[496,222],[488,247],[514,271],[530,308],[532,337],[520,369],[494,393],[491,422],[475,447],[449,460],[417,460],[400,482],[373,494],[341,490],[314,500],[276,496],[248,479],[217,478],[184,466],[160,443],[147,417],[145,400],[119,380],[105,351],[105,321],[116,292],[139,267],[156,257],[148,235],[150,209],[166,183],[194,164],[219,155],[237,155],[249,131],[272,112],[303,101],[332,96],[348,86],[345,75]],[318,300],.73,'#f9b1cb',.70),'#9b5745');h.face(317,359,114,94);
 }else if(id==='food-french-fries'){
  suit({top:411,hip:479,bottom:508,width:98,color:'#ffd059',armColor:'#ffd059',footColor:'#ffc13d'});
  // Individual fries extend into the carton, including a second row at the back.
  for(const [i,x,y,w,height,angle,z]of [[0,234,151,55,135,.14,-.18],[1,320,141,63,161,0,-.28],[2,414,153,50,143,-.14,-.18],[3,200,188,50,125,.20,.12],[4,279,170,55,114,.12,.18],[5,366,169,55,118,-.14,.16],[6,448,186,48,126,-.19,.10],[7,248,201,39,84,.09,.35],[8,398,204,41,83,-.10,.35]]){
   const o=h.box('Fry'+i+'Solid',[x,y,z],[w,height,.24],'#ffc844',6);o.rotation.z=angle;ink(o,'#a46512',.012);
  }
  ink(h.smoothOutline('FriesCartonSolid',[[168,203],[181,204],[224,219],[260,228],[286,216],[321,210],[357,212],[389,227],[420,222],[461,207],[477,200],[481,210],[461,295],[441,389],[431,402],[398,413],[344,417],[287,417],[235,412],[216,400],[203,368],[183,283]],.90,'#f33831',.36,.035),'#9c3422');h.face(321,301,101,84);
 }else if(id==='object-treasure-chest'){
  const P=[],I=[];for(const p of [[138,270,.72],[443,270,.72],[443,535,.72],[138,535,.72],[188,230,-.72],[493,230,-.72],[493,485,-.72],[188,485,-.72]])P.push((p[0]-320)*.005,(580-p[1])*.005,p[2]);
  for(const q of [[0,3,2,1],[4,5,6,7],[0,1,5,4],[3,7,6,2],[0,4,7,3],[1,2,6,5]])I.push(q[0],q[1],q[2],q[0],q[2],q[3]);
  const BP=[],BI=[],v=P;for(let face=0;face<I.length;face+=6){const ids=[I[face],I[face+1],I[face+2],I[face+5]],base=BP.length/3,steps=12;for(let y=0;y<=steps;y++)for(let x=0;x<=steps;x++){const u=x/steps,w=y/steps;for(let d=0;d<3;d++)BP.push(v[ids[0]*3+d]*(1-u)*(1-w)+v[ids[1]*3+d]*u*(1-w)+v[ids[2]*3+d]*u*w+v[ids[3]*3+d]*(1-u)*w);}for(let y=0;y<steps;y++)for(let x=0;x<steps;x++){const a=base+y*(steps+1)+x,b=a+1,c=a+steps+1,d=c+1;BI.push(a,b,d,a,d,c);}}
  const body=ink(k.mesh('ChestBoxSolid',k.geometry(BP,BI),k.solid('ChestWood','#ad592e'),h.group),'#65391f');
  body.userData.artworkFacingFade=[0,.10];
  // Raised arched lid, a dark open mouth and separate gold coins.
  const vault=(name,left,right,color,offset=0)=>{
   const P=[],I=[],n=64;for(const inner of [false,true])for(const x of [left,right])for(let i=0;i<=n;i++){const a=i/n*Math.PI,z=(inner?.59:.65)*Math.cos(a),y=220+(1-Math.cos(a))*32.5-(inner?138:145)*Math.sin(a);P.push((x+50*(.65-z)/1.3-320)*.005,(580-y)*.005+offset*Math.sin(a),z+offset*Math.cos(a));}
   const r=n+1;for(let i=0;i<n;i++){const j=i+1;for(const q of [[i,r+i,r+j,j],[2*r+i,2*r+j,3*r+j,3*r+i],[i,j,2*r+j,2*r+i],[r+i,3*r+i,3*r+j,r+j]])I.push(q[0],q[1],q[2],q[0],q[2],q[3]);}
   for(const i of [0,n]){const q=i===0?[0,2*r,3*r,r]:[n,r+n,3*r+n,2*r+n];I.push(q[0],q[1],q[2],q[0],q[2],q[3]);}
   const o=k.mesh(name,k.geometry(P,I),k.solid(name+'Color',color),h.group);return o;
  };
  ink(vault('ArchedLidSolid',130,449,'#b36535'),'#63351e');
  for(const [end,x]of [[0,130],[1,449]]){
   const P=[],I=[],n=65;for(const offset of [-.018,.018]){P.push((x+25-320)*.005+offset,(580-252.5)*.005,0);for(let i=0;i<n;i++){const a=i/(n-1)*Math.PI,z=.65*Math.cos(a),y=220+(1-Math.cos(a))*32.5-145*Math.sin(a);P.push((x+50*(.65-z)/1.3-320)*.005+offset,(580-y)*.005,z);}}
   const s=n+1;for(let i=1;i<n;i++){I.push(0,i+1,i,s,s+i,s+i+1,i,i+1,s+i+1,i,s+i+1,s+i);}I.push(0,n,s+n,0,s+n,s,0,s,s+1,0,s+1,1);
   for(let i=0;i<I.length;i+=3)[I[i+1],I[i+2]]=[I[i+2],I[i+1]];
   ink(k.mesh('LidEndCap'+end+'Solid',k.geometry(P,I),k.solid('LidEndWood','#a9572d'),h.group),'#63351e');
  }
  ink(h.smoothOutline('ChestOpeningSolid',[[141,224],[187,214],[278,214],[375,220],[432,244],[472,274],[450,288],[193,280],[165,262]],.08,'#4a2515',.20,.012),'#6b3e23');
  for(const [i,x,y,rx,ry,a]of [[0,218,262,41,19,.25],[1,296,255,47,25,.27],[2,388,263,42,19,-.1]]){const coin=h.ellipsoid('GoldCoin'+i+'Solid',[x,y,.36],[rx,ry,.065],'#ffd452',a);ink(coin,'#b77720');}
  // Solid brass fittings wrap the body corners and continue onto the rear.
  for(const [i,x,y]of [[0,162,292],[1,419,292],[2,163,507],[3,417,507]])ink(h.box('BrassCorner'+i+'Solid',[x,y,.76],[48,44,.12],'#ffd25a',10),'#9c5f1b');
  ink(h.box('ChestLockSolid',[291,497,.77],[53,51,.13],'#ffce40',12),'#93571b');
  for(const x of [176,354])ink(vault('LidStrap'+x+'Solid',x,x+46,'#ffcf4e',.025),'#99601e');
  for(const y of [326,383,440,497]){
   h.skip(h.tube('RearPlank'+y,[[188,y-50,-.727],[493,y-50,-.727]],.006,'#824623'));
   h.skip(h.tube('RightPlank'+y,[[443,y,.727],[493,y-50,-.727]],.006,'#824623'));
   h.skip(h.tube('LeftPlank'+y,[[138,y,.727],[188,y-50,-.727]],.006,'#824623'));
  }
  h.face(291,387,108,99);
 }else if(id==='sport-shuttlecock'){
  suit({cx:316,top:499,hip:549,bottom:577,width:91,color:'#f7e7d4',footColor:'#f7e7d4'});
  ink(h.volume('CorkHead',[[181,371],[190,336],[214,313],[253,300],[309,296],[370,301],[417,317],[445,344],[454,384],[448,428],[423,463],[384,489],[336,504],[286,502],[240,487],[204,459],[184,418]],[317,398],.61,'#f4d4b1',.62),'#70472f');h.face(317,400,111,84);
  // Sixteen distinct feathers around a hollow conical skirt, with open spaces.
  for(let i=0;i<16;i++){
   const a=i/16*Math.PI*2,dx=Math.cos(a),dz=Math.sin(a),x=320+dx*177,z=dz*.77;
   const base=[320+dx*82,330,dz*.32],mid=[320+dx*133,202,dz*.59],tip=[x,92+dz*24,z];
   const shaft=h.sweep('FeatherShaft'+i+'Solid',[[...base,3],[...mid,3],[...tip,2]],'#dbdce0');h.skip(shaft);ink(shaft,'#999aa1',.004);
   const P=[],I=[],rows=24;
   for(const side of [-1,1])for(let j=0;j<=rows;j++)for(const edge of [-1,1]){
    const u=j/rows,r=117+70*u,w=40*Math.min(1,u/.45)*(u>.9?.2+.8*(1-u)/.1:1),px=320+dx*r-dz*w*edge+dx*side*2,py=242-154*u+dz*24*u,pz=dz*r*.0044+dx*w*edge*.005+dz*side*.01;
    P.push((px-320)*.005,(580-py)*.005,pz);
   }
   const count=(rows+1)*2;
   for(let j=0;j<rows;j++){const a=j*2,b=a+1,c=a+2,d=a+3;I.push(a,b,d,a,d,c,count+a,count+d,count+b,count+a,count+c,count+d,a,c,count+c,a,count+c,count+a,b,count+b,count+d,b,count+d,d);}
   I.push(0,count, count+1,0,count+1,1,rows*2,rows*2+1,count+rows*2+1,rows*2,count+rows*2+1,count+rows*2);
   const feather=k.mesh('Feather'+i+'Solid',k.geometry(P,I),k.solid('Feather'+i+'Color','#f7f8fa'),h.group);ink(feather,'#9b9ba2',.005);
  }
  for(const [j,y,rx,rz]of [[0,267,116,.51],[1,282,108,.48]]){const p=[];for(let i=0;i<=64;i++){const a=i/64*Math.PI*2;p.push([320+rx*Math.cos(a),y,rz*Math.sin(a)]);}h.skip(h.tube('SkirtBinding'+j,p,.009,'#d4d5d9'));}
  const rim=[];for(let i=0;i<=64;i++){const a=i/64*Math.PI*2;rim.push([320+190*Math.cos(a),88+24*Math.sin(a),.83*Math.sin(a)]);}h.skip(h.tube('FeatherTopRim',rim,.009,'#735444'));
  colorize(h.group.getObjectByName('CorkHeadSolid'),(x,y,z)=>y>(580-327)*.005?'#28954d':'#f4d4b1');
 }else if(id==='theme-gem'){
  suit({cx:316,top:478,hip:545,bottom:573,width:91,color:'#a3a7ec',armColor:'#84a7f0',footColor:'#959ae1'});
  // A faceted crown, girdle and pavilion; each triangle remains planar.
  const points=[[184,107,0],[455,107,0],[554,234,0],[316,508,0],[84,234,0],[190,121,-.46],[448,121,-.46],[521,234,-.73],[316,485,-.60],[117,234,-.73],[316,113,.50],[412,231,.64],[316,455,.48],[226,231,.64],[316,304,.74]];
  const faces=[[0,10,13],[0,1,10],[1,11,10],[1,2,11],[2,3,11],[3,12,11],[3,13,12],[3,4,13],[4,0,13],[10,11,14],[11,12,14],[12,13,14],[13,10,14],[0,5,6],[0,6,1],[1,6,7],[1,7,2],[2,7,8],[2,8,3],[3,8,9],[3,9,4],[4,9,5],[4,5,0],[5,9,8],[5,8,6],[6,8,7]];
  const P=[],C=[];faces.forEach((f,i)=>{const col=new T.Color(['#49bdf7','#a9e7fc','#246ee9','#8ca0fb'][i%4]).convertSRGBToLinear();for(const v of f){const p=points[v];P.push((p[0]-320)*.005,(580-p[1])*.005,p[2]);C.push(col.r,col.g,col.b);}});
  const ix=Array.from({length:P.length/3},(_,i)=>i);for(let i=0;i<ix.length;i+=3)[ix[i+1],ix[i+2]]=[ix[i+2],ix[i+1]];
  const geo=k.geometry(P,ix);geo.setAttribute('color',new T.Float32BufferAttribute(C,3));const gem=k.mesh('FacetedGemSolid',geo,k.solid('GemColor','#ffffff'),h.group);gem.material.userData.preserveVertexColor=true;gem.userData.artworkFacingFade=[0,.1];ink(gem,'#754637');h.face(318,307,130,115);
 }else if(id==='theme-heart'){
  suit({cx:316,top:472,hip:545,bottom:573,width:94,color:'#f48eb3',armColor:'#f27ea7',footColor:'#ed719e'});
  ink(h.volume('Heart',[[318,178],[341,151],[382,126],[424,117],[467,122],[506,145],[535,180],[550,220],[550,264],[537,302],[513,340],[480,375],[434,416],[380,456],[337,487],[315,496],[294,490],[251,460],[204,424],[159,382],[124,341],[99,302],[84,263],[83,224],[94,184],[116,153],[148,130],[184,119],[220,118],[256,131],[288,153]],[317,302],.77,'#f479a0',.75),'#9a3e48');h.face(317,319,130,112);
 }else if(id==='theme-robot'){
  const b=part('Torso',[320,441]);b.ink(b.box('RobotTorsoSolid',[320,465,0],[81,56,.39],'#b9c5d1',11),'#53606b');
  b.ink(b.box('RobotBeltSolid',[320,485,.02],[80,13,.42],'#39bdcb',4),'#53606b');
  b.ink(b.ellipsoid('RobotButtonSolid',[320,459,.22],[12,12,.035],'#ffdf4a'),'#655e3b');
  for(const [side,sign]of [['Left',-1],['Right',1]]){
   const a=part(side+'Arm',[320+sign*44,444]),x=320+sign*57;
   a.ink(a.sweep(side+'RobotTubeSolid',[[320+sign*43,444,0,10],[x,459,0,10],[320+sign*62,475,0,10]],'#bec9d1'),'#5a6068');
   a.ink(a.torus(side+'RobotClaw',[320+sign*62,481,.03],.065,.024,'#c1c9d1'),'#5a6068',.006);
   const l=part(side+'Leg',[320+sign*20,493]);l.ink(l.box(side+'RobotShinSolid',[320+sign*20,499,0],[23,22,.22],'#c0c9d0',3),'#58616a');l.ink(l.ellipsoid(side+'RobotBootSolid',[320+sign*20,513,.03],[19,10,.18],'#c5cbd6'),'#58616a');
  }
  ink(h.box('RobotHelmetSolid',[319,305,0],[300,267,1.20],'#b7c1cc',68),'#57545a');h.face(319,315,103,95);
  for(const sign of [-1,1]){
   ink(h.ellipsoid('RobotEar'+sign+'Solid',[319+sign*158,313,0],[25,44,.32],'#38c5d2'),'#4b6672');
   ink(h.ellipsoid('RobotEarCap'+sign+'Solid',[319+sign*169,313,.10],[16,34,.24],'#b9c7d1'),'#53606c');
  }
  ink(h.box('AntennaStemSolid',[319,136,-.10],[22,41,.20],'#becad0',5),'#5c5556');
  ink(h.ellipse('AntennaBase',[320,168],[40,21],.23,'#46c5d3',-.05),'#486571');
  ink(h.ellipsoid('RobotBeaconSolid',[319,94,-.10],[31,31,.16],'#f23b2c'),'#952e24');
 }else throw new Error('No authored addition: '+id);
};
