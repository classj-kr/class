"use strict";
module.exports=function(T,id,A,h,effects){
 const {k,part,suit,colorize}=A,ink=(o,c)=>h.ink(o,c||'#634739',.012);
 if(id==='animal-caterpillar'){
  // Four overlapping body segments, their own paired prolegs, no human suit.
  for(const [i,c,r]of [[3,[421,485],[43,38]],[2,[369,479],[47,43]],[1,[307,469],[56,52]],[0,[259,438],[60,51]]]){
   const g=part('CaterpillarSegment'+i,c,-.08),o=g.ellipse('Segment'+i,c,r,.28,i%2?'#e0e975':'#a9c84d');g.ink(o);
   for(const [j,x]of [c[0]-15,c[0]+9].entries())g.ink(g.ellipse('Proleg'+i+'_'+j,[x,c[1]+r[1]-1],[13,13],.12,'#e8e998',.02));
  }
  ink(h.volume('CaterpillarHood',[[130,290],[141,233],[171,184],[219,151],[267,140],[320,146],[369,170],[404,218],[420,277],[415,330],[388,375],[340,402],[285,413],[231,408],[180,385],[148,345]],[275,280],.66,'#a6c748'));
  h.face(274,295,114,103);
  for(const sign of [-1,1]){
   const ps=sign<0?[[255,157,.08,15],[250,127,.08,16],[230,104,.08,16],[212,93,.08,16]]:[[308,154,.08,15],[316,125,.08,16],[340,102,.08,16],[354,94,.08,16]];
   ink(h.sweep('Antenna'+sign+'Solid',ps,'#acc948'));ink(h.ellipse('AntennaTip'+sign,sign<0?[196,96]:[366,94],[33,33],.18,'#b8d752',.08));
  }
 }else if(id==='animal-cow'){
  suit({top:447,hip:543,bottom:572,width:98,color:'#f9eee7',armColor:'#f9eee7',footColor:'#554849'});
  ink(h.volume('CowHood',[[139,310],[153,244],[181,180],[233,138],[290,124],[348,127],[403,152],[447,211],[480,279],[487,333],[470,386],[429,427],[370,454],[311,462],[250,448],[195,420],[159,375]],[315,300],.75,'#fff3e8'));
  h.face(313,351,125,99);
  for(const sign of [-1,1]){
   const mirror=ps=>ps.map(([x,y])=>[sign<0?x:640-x,y]);
   ink(h.volume('CowEar'+sign,mirror([[214,155],[181,140],[151,136],[116,146],[91,170],[88,181],[110,206],[139,220],[168,222],[193,202],[222,177]]),[sign<0?154:486,178],.16,'#f9eee7',.17,-.10));
   ink(h.volume('CowHorn'+sign,mirror([[219,173],[209,136],[210,114],[223,88],[235,85],[242,100],[247,126],[270,173]]),[sign<0?233:407,124],.15,'#f9d9af',.15,-.18));
  }
  ink(h.ellipse('CowMuzzle',[318,227],[84,36],.11,'#f2a1a2',.69));
  const tail=part('CowTail',[367,507],-.20);tail.ink(tail.sweep('CowTailSolid',[[344,512,-.19,8],[363,525,-.19,8],[382,530,-.22,8],[401,517,-.20,6],[410,498,-.17,5]],'#eee2db'));tail.ink(tail.ellipse('CowTailTip',[411,493],[16,20],.10,'#554849',-.17));
  const b=k.root.getObjectByName('Torso');const bell=part('CowBell',[315,475],.19);bell.ink(bell.ellipse('Bell',[315,485],[18,16],.10,'#f6b93f'));
  // Irregular black patches continue around the rear instead of front ink stretching.
  const hood=h.group.getObjectByName('CowHoodSolid');hood.updateMatrixWorld(true);
  for(const [j,cx,cy,rx,ry]of [[0,-.51,1.50,.33,.36],[1,.46,1.13,.29,.32]]){
   const P=[],I=[],n=72,rings=10;for(let r=0;r<=rings;r++)for(let i=0;i<n;i++){const a=i/n*Math.PI*2,w=1+.09*Math.sin(a*3+j)+.04*Math.cos(a*5),x=cx+Math.cos(a)*rx*w*r/rings,y=cy+Math.sin(a)*ry*w*r/rings;
    const hit=new T.Raycaster(new T.Vector3(x,y,-2),new T.Vector3(0,0,1)).intersectObject(hood)[0];P.push(x,y,(hit?.point.z??-.1)-.018);
   }for(let r=0;r<rings;r++)for(let i=0;i<n;i++){const a=r*n+i,b=r*n+(i+1)%n,c=a+n,d=b+n;if(r)I.push(a,d,b);I.push(a,c,d);}
   for(let i=0;i<I.length;i+=3)[I[i+1],I[i+2]]=[I[i+2],I[i+1]];
   h.skip(k.mesh('CowRearPatch'+j,k.geometry(P,I),k.solid('CowPatchColor','#554849'),h.group));
  }
 }else if(id==='animal-jellyfish'){
  const dome=ink(h.volume('JellyBell',[[98,314],[121,266],[155,209],[193,158],[238,112],[276,90],[318,82],[364,92],[409,118],[452,161],[482,209],[511,267],[539,315],[533,342],[516,354],[493,351],[480,369],[459,377],[430,368],[410,382],[384,385],[359,374],[336,387],[306,389],[281,374],[257,384],[229,380],[212,368],[185,379],[163,373],[148,351],[127,359],[109,349]],[319,258],.60,'#c8b2e9',.66));h.face(317,264,116,97);
  colorize(dome,(x,y,z)=>{const t=T.MathUtils.clamp((y-.95)/1.4,0,1);return new T.Color('#b0e7ed').lerp(new T.Color('#b194d8'),t);});
  const paths=[[[202,368],[193,407],[160,442],[154,475],[164,497]],[[235,379],[234,421],[209,463],[197,497],[205,531]],[[274,379],[281,416],[261,460],[239,503],[244,552]],[[310,383],[309,424],[287,473],[279,512],[296,552],[293,579]],[[339,380],[340,424],[359,468],[363,505],[344,548],[341,577]],[[382,380],[383,415],[404,461],[406,502],[390,551]],[[416,378],[415,411],[443,450],[448,478],[436,533]],[[444,365],[453,402],[482,438],[484,466],[474,496]]];
  paths.forEach((path,i)=>{path[0][1]-=18;const z=-.25+(i%4)*.17,p=part('JellyTendril'+i,path[0],z),ps=path.map(([x,y],j)=>[x,y,z+Math.sin(j)*.05,j===path.length-1?2:i===3||i===4?15:8]);p.ink(p.sweep('Tendril'+i+'Solid',ps,i%2?'#c6a0df':'#a6e0ef'),'#8366a0',.008);const times=[],Q=[];for(let j=0;j<=48;j++){times.push(j/48*3);Q.push(...new T.Quaternion().setFromEuler(new T.Euler(Math.sin(j/48*Math.PI*2+i*.7)*.05,0,Math.sin(j/48*Math.PI*2+i*.7)*.025)).toArray());}effects.push(new T.QuaternionKeyframeTrack('JellyTendril'+i+'.quaternion',times,Q));});
 }else if(['animal-rhinoceros-beetle','animal-stag-beetle'].includes(id)){
  const stag=id==='animal-stag-beetle',cx=stag?317:291,top=stag?441:416,hip=stag?530:502,bottom=stag?558:528,color=stag?'#424953':'#934f35';
  suit({cx,top,hip,bottom,width:94,color:stag?'#777e88':'#d39b62',armColor:color,footColor:stag?'#424953':'#754736'});
  ink(h.ellipse('BeetleHood',[stag?317:297,stag?333:310],[stag?143:134,stag?122:116],.64,color),stag?'#22282e':'#613825');h.face(stag?314:283,stag?350:331,stag?108:98,stag?88:84);
  for(const sign of [-1,1]){
   const wing=part('Elytron'+sign,[cx+sign*63,top+13],-.04);wing.ink(wing.ellipse('WingCase'+sign,[cx+sign*63,top+52],[29,46],.19,color),stag?'#22282e':'#613825');
  }
  if(stag){
   for(const sign of [-1,1]){
    const mirror=ps=>ps.map(([x,y,z,r])=>[sign<0?x:640-x,y,z,r]);
    ink(h.sweep('Mandible'+sign+'Solid',mirror([[245,252,.08,23],[225,231,.10,23],[209,208,.12,25],[204,179,.15,23],[205,149,.20,21],[218,120,.25,20],[240,94,.28,16],[263,76,.30,8],[278,66,.31,1]]),color),'#20272d');
    ink(h.sweep('MandibleUpperTooth'+sign+'Solid',mirror([[220,142,.19,17],[245,135,.22,11],[265,122,.25,2]]),color),'#20272d');
    ink(h.sweep('MandibleLowerTooth'+sign+'Solid',mirror([[216,188,.14,18],[243,187,.18,12],[268,177,.20,2]]),color),'#20272d');
   }
  }else{
   ink(h.sweep('MainHornSolid',[[267,238,.10,31],[230,228,.13,29],[210,188,.10,23],[201,145,.07,18],[210,103,.04,18]],color));
   ink(h.sweep('HornLeftForkSolid',[[211,106,.04,17],[181,95,.04,14],[174,70,.04,7]],color));ink(h.sweep('HornRightForkSolid',[[210,104,.04,17],[244,91,.04,13],[255,67,.04,7]],color));
   ink(h.volume('RearHorn',[[298,218],[299,178],[289,155],[306,155],[321,170],[335,214]],[310,179],.14,color,.14,-.10));
  }
 }else if(id==='animal-stingray'){
  suit({top:438,hip:505,bottom:530,width:111,color:'#a2adbf',depth:.22});
  const ray=ink(h.volume('RayHood',[[43,313],[88,283],[143,246],[192,204],[237,159],[282,115],[316,98],[348,111],[393,153],[440,198],[489,242],[543,280],[586,307],[592,324],[581,341],[539,367],[493,389],[453,413],[405,435],[356,448],[302,450],[250,438],[205,416],[156,392],[108,366],[67,343]],[316,306],.60,'#929eb3',.62),'#5b5967');h.face(317,322,116,103);
  const tail=part('RayTail',[363,480],-.18);tail.ink(tail.sweep('RayTailSolid',[[361,481,-.18,13],[401,494,-.21,13],[441,488,-.20,11],[478,466,-.20,9],[508,428,-.18,6],[531,404,-.15,3],[550,400,-.13,1]],'#9aa5b9'),'#5b5967',.008);
 }else{
  require('./addition-props.cjs')(T,id,A,h,effects);
 }
};
