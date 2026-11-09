"use strict";

module.exports=function filledFoods(THREE,k,id,parts){
 if(!['food-hot-dog','food-pizza','food-rice-ball','food-sandwich'].includes(id))return false;
 const head=parts.get('Head'),s=require('./sculpt-kit.cjs')(THREE,k,head);
 s.parent.clear();s.parent.userData.directSurfaceArtwork=true;
 s.parent.userData.artworkOpaqueRegions=[{cx:320,cy:305,rx:120,ry:103}];
 const rear=[];
 function unpaint(o){o.userData.skipOriginalPaint=true;return o;}
 function surfaceMarks(target,name,marks,color){
  target.updateWorldMatrix(true,false);const ray=new THREE.Raycaster();
  for(const [i,x,y,rx,ry] of marks){
   ray.set(new THREE.Vector3((x-320)*.005,(580-y)*.005,-3),new THREE.Vector3(0,0,1));const hit=ray.intersectObject(target)[0];if(!hit)continue;
   const mark=unpaint(s.ellipsoid(name+i,[x,y,hit.point.z-.004],[rx,ry,.012],color,i*.61));rear.push(mark);
  }
 }
 if(id==='food-hot-dog'){
  const outline=[[319,62],[345,76],[355,100],[389,135],[423,137],[458,161],[481,209],[494,279],[497,360],[487,442],[466,494],[431,524],[389,529],[364,544],[279,544],[253,529],[217,529],[185,515],[159,478],[147,430],[141,353],[145,261],[160,185],[185,150],[219,133],[252,133],[282,101],[291,80]];
  k.volume('HotDogRounded',outline,[320,306],s.pivot,.55,.62,s.parent,k.solid('HotDogColor','#e8b36a'),{art:false,samples:128});
  const halves=['HotDogRoundedSurface','HotDogRoundedBack'].map(name=>s.parent.getObjectByName(name)),positions=[],indices=[];
  for(const half of halves){const offset=positions.length/3;positions.push(...half.geometry.attributes.position.array);indices.push(...Array.from(half.geometry.index.array,i=>i+offset));s.parent.remove(half);}
  const body=k.mesh('HotDogCostumeSolid',k.geometry(positions,indices),k.solid('HotDogBread','#e8b36a'),s.parent),p=body.geometry.attributes.position,colors=[];
  for(let i=0;i<p.count;i++){const x=p.getX(i)/.005+s.pivot[0],y=s.pivot[1]-p.getY(i)/.005,red=Math.max(THREE.MathUtils.smoothstep(138-y,0,18),(1-THREE.MathUtils.smoothstep(Math.abs(x-320),48,62))*THREE.MathUtils.smoothstep(153-y,0,10)),c=new THREE.Color('#e8b36a').lerp(new THREE.Color('#ba4c3e'),red).convertSRGBToLinear();colors.push(c.r,c.g,c.b);}
  body.geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));body.material.color.set(0xffffff);body.material.userData.preserveVertexColor=true;
  body.updateWorldMatrix(true,false);const ray=new THREE.Raycaster();
  const stripP=[],stripI=[],U=24,V=72,widths=[[65,9],[80,28],[105,49],[140,67],[200,78],[320,80],[420,73],[500,60],[539,28]];
  for(let row=0;row<=V;row++){
   const y=135+(538-135)*row/V;let n=1;while(n<widths.length-1&&widths[n][0]<y)n++;
   const lo=widths[n-1],hi=widths[n],w=lo[1]+(hi[1]-lo[1])*(y-lo[0])/(hi[0]-lo[0]);
   for(let col=0;col<=U;col++){const x=320+(col/U*2-1)*w*.9;ray.set(new THREE.Vector3((x-320)*.005,(580-y)*.005,-3),new THREE.Vector3(0,0,1));const hit=ray.intersectObject(body)[0];if(!hit)throw new Error('Sausage rear paint has no support '+x+','+y);stripP.push(hit.point.x,hit.point.y,hit.point.z-.006);}
  }
  for(let row=0;row<V;row++)for(let col=0;col<U;col++){const a=row*(U+1)+col,b=a+1,c=a+U+1,d=c+1;stripI.push(a,b,d,a,d,c);}
  unpaint(s.mesh('RearSausageSurface',k.geometry(stripP,stripI),'#b94e40'));
  for(const side of [-1,1]){
   const ps=[];for(let j=0;j<=48;j++){const y=146+j*7.6,x=320+side*(64+10*Math.sin(j/48*Math.PI));ray.set(new THREE.Vector3((x-320)*.005,(580-y)*.005,-3),new THREE.Vector3(0,0,1));const hit=ray.intersectObject(body)[0];if(hit)ps.push([x,y,hit.point.z-.004]);}
   unpaint(s.tube('RearBunCrease'+side,ps,.009,'#b97a49'));
  }
  // Hands belong to the sausage costume outline; remove tiny traced remnants.
  for(const name of ['LeftArm','RightArm'])parts.get(name)?.group.clear();
 }
 if(id==='food-pizza'){
  const outline=[[320,62],[414,74],[486,99],[537,128],[543,151],[529,181],[477,285],[425,395],[375,493],[340,544],[321,553],[302,538],[261,463],[207,350],[154,240],[108,184],[97,160],[96,135],[125,113],[209,78]];
  const base=s.smoothOutline('PizzaBaseSolid',outline,.36,'#c38d50',0,.035);
  const cheese=[[319,132],[398,140],[467,165],[520,182],[468,289],[419,393],[370,490],[330,538],[316,539],[263,451],[210,342],[162,241],[119,183],[204,146]];
  s.smoothOutline('PizzaCheeseSolid',cheese,.045,'#f1cd77',.193,.008);
  const crust=[[97,135],[126,111],[208,79],[319,63],[413,74],[487,102],[539,130],[540,156],[527,180],[479,165],[414,144],[319,132],[230,141],[163,165],[118,181],[106,166]];
  s.smoothOutline('PizzaRolledCrustSolid',crust,.43,'#dba464',0,.032);
  surfaceMarks(base,'RearPizzaToast',[[0,244,194,9,6],[1,368,220,7,5],[2,294,286,8,5],[3,347,369,10,6],[4,292,428,6,4],[5,409,202,6,4]],'#ba8249');
  for(const side of [-1,1]){
   const name=side<0?'LeftArm':'RightArm',pivot=[320+side*76,441];let arm=parts.get(name);
   if(!arm){arm={part:{pivot},group:k.group(name,pivot)};parts.set(name,arm);}
   arm.group.clear();arm.part.pivot=pivot;arm.group.position.set((pivot[0]-320)*.005,(580-pivot[1])*.005,0);arm.group.userData.directSurfaceArtwork=true;
   const a=require('./sculpt-kit.cjs')(THREE,k,arm),shape=[[241,435],[231,447],[222,467],[217,489],[220,502],[231,507],[243,501],[249,479],[252,451]].map(([x,y])=>[side<0?x:640-x,y]);
   a.smoothOutline('PizzaHandSolid'+side,shape,.24,'#e6b574',.07,.025);a.paint();
  }
 }
 if(id==='food-rice-ball'){
  const outline=[[320,61],[348,70],[377,91],[407,123],[440,169],[467,223],[489,278],[512,331],[519,365],[508,394],[483,409],[439,423],[380,430],[270,430],[215,424],[168,411],[135,390],[121,365],[123,337],[145,282],[168,226],[198,172],[232,122],[269,84],[298,68]];
  const rice=s.smoothOutline('RiceBallSolid',outline.map(([x,y])=>[320+(x-320)*.96,245+(y-245)*.96]),.96,'#f4f2e9',0,.07);
  for(const side of [-1,1]){
   const wrap=s.smoothOutline('NoriWrapSolid'+side,[[239,338],[258,353],[287,364],[320,368],[355,364],[380,354],[396,338],[405,366],[408,431],[230,431],[232,367]],.035,'#34442e',side*.489,.006);if(side<0)unpaint(wrap);
  }
  // The seaweed continues across the bottom instead of two floating stickers.
  unpaint(s.box('NoriBottomSolid',[319,429,0],[174,7,1.01],'#34442e',2));
  const marks=[];for(let i=0;i<34;i++){const y=115+(i%7)*39,x=206+(i*67)%227;marks.push([i,x,y,5,8]);}
  surfaceMarks(rice,'RearRiceBallGrain',marks,'#e7e4d8');
 }
 if(id==='food-sandwich'){
  s.parent.userData.artworkOcclusion=true;
  const bread=[[320,102],[405,113],[461,137],[493,171],[500,207],[488,245],[474,264],[477,466],[469,501],[449,521],[400,532],[232,533],[175,524],[153,505],[145,481],[145,270],[128,239],[124,206],[136,169],[166,139],[230,114]];
  const lettuce=[[114,195],[143,143],[177,99],[242,77],[283,75],[313,62],[350,64],[376,74],[404,66],[463,90],[499,133],[521,178],[527,222],[513,266],[529,314],[513,353],[528,397],[514,447],[499,487],[476,516],[157,517],[126,486],[117,447],[129,402],[112,364],[124,323],[112,282],[125,240]];
  unpaint(s.smoothOutline('SandwichBackBreadSolid',bread,.18,'#bf884c',-.32,.025));
  unpaint(s.smoothOutline('SandwichRearCrumbSolid',bread.map(([x,y])=>[315+(x-315)*.90,320+(y-320)*.93]),.026,'#eed4a3',-.421,.009));
  for(const [i,z] of [[0,-.20],[1,.11]])s.smoothOutline('LettuceLayerSolid'+i,lettuce,.075,'#8baf4e',z,.016);
  for(const [i,y] of [[0,210],[1,403]])s.ellipsoid('SandwichTomatoFilling'+i,[320,y,-.045],[166,105,.23],'#ce6650');
  for(const [i,x,y] of [[0,474,201],[1,477,405],[2,147,337]])s.ellipsoid('SandwichTomato'+i,[x,y,.09],[42,65,.20],'#ce6650');
  s.smoothOutline('SandwichCheeseSolid',[[139,158],[229,98],[307,109],[402,66],[482,134],[490,457],[463,506],[149,494]],.06,'#e8bf62',.18,.01);
  s.smoothOutline('SandwichFrontBreadSolid',bread,.20,'#c69558',.30,.025);
  s.smoothOutline('SandwichFrontCrumbSolid',bread.map(([x,y])=>[315+(x-315)*.90,320+(y-320)*.93]),.024,'#f2d9aa',.411,.008);
  for(const name of ['LeftArm','RightArm'])parts.get(name)?.group.clear();
 }
 s.paint();head.authoredFamily='filled-food';return true;
};
