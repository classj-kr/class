"use strict";

// Round food and containers need rotational solids, not inflated silhouettes.
// The face stays the original illustration, projected onto a supported surface.
module.exports=function special(THREE,k,id,parts){
 if(require('./animal-heads.cjs')(THREE,k,id,parts.get('Head')))return true;
 if(require('./small-animal-heads.cjs')(THREE,k,id,parts.get('Head')))return true;
 if(require('./root-vegetables.cjs')(THREE,k,id,parts.get('Head')))return true;
 if(require('./object-solids.cjs')(THREE,k,id,parts.get('Head')))return true;
 const supported=['drink-bubble-tea','food-birthday-cake','food-bingsu','food-tteokbokki','food-gimbap','food-hamburger','food-macaron','food-pudding','food-ice-cream','vegetable-mushroom','object-lamp','food-fried-egg'];
 if(!supported.includes(id))return false;
 const head=parts.get('Head'),g=head.group;g.clear();
 const offset=g.position.clone();
 const mat=(name,color)=>k.solid(name,color);
 const local=p=>p.map((v,i)=>v-offset.getComponent(i));
 function mesh(name,geo,color,p){return k.mesh(name,geo,mat(name+'Color',color),g,local(p));}
 function egg(name,size,color,p){const small=Math.max(...size)<.20;const o=mesh(name,new THREE.SphereGeometry(1,small?16:40,small?10:24),color,p);o.scale.set(...size);return o;}
 function cylinder(name,top,bottom,height,color,p){return mesh(name,new THREE.CylinderGeometry(top,bottom,height,64,1,false),color,p);}
 function ring(name,r,t,color,y){const o=mesh(name,new THREE.TorusGeometry(r,t,10,64),color,[0,y,0]);o.rotation.x=Math.PI/2;return o;}
 function lathe(name,points,color){return mesh(name,new THREE.LatheGeometry(points.map(p=>new THREE.Vector2(...p)),64),color,[0,0,0]);}
 function face(cx,cy,rx,ry,target){return k.projectArtwork('OriginalFace',k.ellipse(cx,cy,rx,ry),[cx,cy],head.part.pivot,g,target);}
 function bowl(name,r,yTop,yBottom,color){
  const h=yTop-yBottom;
  return lathe(name,[[0,yBottom],[r*.35,yBottom],[r*.48,yBottom+h*.13],[r*.80,yBottom+h*.50],[r,yTop-.03],[r,yTop],[r-.04,yTop],[r-.04,yTop-.05],[r*.76,yBottom+h*.50],[r*.43,yBottom+h*.18],[0,yBottom+h*.16],[0,yBottom]],color);
 }
 function icing(name,r,y,color){
  const P=[],I=[],n=96;
  for(let layer=0;layer<4;layer++)for(let i=0;i<n;i++){
   const a=i/n*Math.PI*2,rr=layer<2?r:r-.045,yy=layer%2?y-.12-.045*(1+Math.sin(a*9)):y;
   P.push(Math.cos(a)*rr,yy,Math.sin(a)*rr);
  }
  for(const [u,v] of [[0,1],[1,3],[3,2],[2,0]])for(let i=0;i<n;i++){const j=(i+1)%n,a=u*n+i,b=u*n+j,c=v*n+i,d=v*n+j;I.push(a,b,d,a,d,c);}
  return mesh(name,k.geometry(P,I),color,[0,0,0]);
 }
 if(id==='drink-bubble-tea'){
  const cup=cylinder('CupBody',.70,.54,1.78,'#d9b288',[0,.92,0]);
  cylinder('BlueLid',.79,.77,.12,'#a5cfdf',[0,1.88,0]);ring('LidRim',.76,.035,'#6e9ba8',1.86);
  const straw=cylinder('PinkStraw',.085,.085,.65,'#eb9294',[.42,2.22,-.05]);straw.rotation.z=-.17;
  const top=egg('StrawOpening',[.079,.012,.079],'#b45e65',[.475,2.54,-.05]);top.rotation.z=-.17;
  face(320,329,100,81,cup);
  for(let row=0;row<3;row++)for(let i=0;i<10;i++){const a=i/10*Math.PI*2+row*.23,r=.57+row*.016;egg('Pearl'+row+'_'+i,[.075,.075,.026],'#654332',[Math.sin(a)*r,.16+row*.14,Math.cos(a)*r]).rotation.y=a;}
 }
 if(id==='food-birthday-cake'){
  const body=require('./revolved-food.cjs')(THREE,k,id,g,offset);body.userData.artworkMinY=220;face(320,347,116,94,body);
  for(let i=0;i<3;i++){const x=(i-1)*.42;cylinder('Candle'+i,.075,.075,.45,i===1?'#ea8593':'#83b8cd',[x,2.04,-.10]);egg('Flame'+i,[.095,.15,.065],'#ffbd58',[x,2.42,-.10]);}
 }
 if(id==='food-bingsu'){
  bowl('BingsuBowl',.83,.80,.14,'#abd4e7');cylinder('BowlFoot',.30,.32,.10,'#abd4e7',[0,.07,0]);cylinder('BowlStem',.20,.25,.12,'#abd4e7',[0,.15,0]);ring('BowlRim',.81,.027,'#739eb6',.80);
  const ice=lathe('ShavedIce',[[0,.68],[.76,.80],[.72,1.10],[.57,1.55],[.36,1.91],[.16,2.04],[0,2.08],[0,.68]],'#f4fbff');ice.userData.artworkMinY=276;face(318,356,93,76,ice);
  ice.updateWorldMatrix(true,false);const ray=new THREE.Raycaster();
  for(let i=0;i<28;i++){
   const a=i*2.4,r=.07+(.30*(i%7)/6),x=Math.cos(a)*r,z=Math.sin(a)*r;
   ray.set(new THREE.Vector3(x,4,z),new THREE.Vector3(0,-1,0));const hit=ray.intersectObject(ice)[0];if(!hit)continue;
   const bean=egg('RedBean'+i,[.115,.065,.075],i%3?'#743f3d':'#8c4d43',[x,hit.point.y+.035+(i%3)*.012,z]);
   bean.userData.skipOriginalPaint=true;
  }
 }
 if(id==='food-tteokbokki'){
  const pot=bowl('RiceCakeBowl',1.30,1.55,.03,'#f3d8b6');ring('RedBowlBand',1.20,.065,'#c4472d',1.30);ring('CreamBowlRim',1.30,.038,'#ffe7c5',1.55);
  cylinder('Sauce',1.24,1.24,.06,'#b83c19',[0,1.38,0]);
  for(let i=0;i<16;i++){const a=i*2.4,r=.32+.65*(i%4)/3;const rice=egg('RiceCake'+i,[.12,.10,.32],i%3?'#f2a03a':'#f5b954',[Math.cos(a)*r,1.47,Math.sin(a)*r]);rice.rotation.y=a;}
  const hood=egg('RiceCakeFaceHood',[.64,.53,.50],'#f1cf9d',[0,1.47,.85]);face(320,292,119,96,[pot,hood]);
 }
 if(id==='food-gimbap'){
  const roll=cylinder('NoriRoll',.86,.84,1.50,'#344d35',[0,1.43,0]);cylinder('RiceTop',.81,.81,.045,'#f9f3df',[0,2.20,0]);
  roll.userData.artworkMinY=170;
  for(const [i,x,z,c] of [[0,-.15,0,'#e88e4f'],[1,.17,.05,'#a9c25a'],[2,0,-.20,'#e6c765']])egg('Filling'+i,[.23,.027,.18],c,[x,2.24,z]);
  face(320,308,118,98,roll);
 }
 if(id==='food-hamburger'||id==='food-macaron'){
  const body=require('./revolved-food.cjs')(THREE,k,id,g,offset);
  if(id==='food-hamburger'){
   face(320,300,121,97,body);
   for(let i=0;i<22;i++){const a=i*2.4,r=.17+.62*(i%6)/6;const y=2.57-.50*r*r;const seed=egg('Sesame'+i,[.025,.012,.045],'#f9dfad',[Math.cos(a)*r,y,Math.sin(a)*r]);seed.rotation.y=a;}
  }else face(318,290,117,95,body);
 }
 if(id==='food-pudding'){
  const pudding=cylinder('Custard',.66,.90,1.64,'#ffda82',[0,1.50,0]);cylinder('CaramelTop',.675,.675,.055,'#a65c34',[0,2.34,0]);icing('CaramelDrips',.679,2.32,'#9c502c');face(320,298,117,94,pudding);
 }
 if(id==='food-ice-cream'){
  const cone=lathe('WaffleCone',[[0,.005],[.04,.025],[.12,.10],[.34,.40],[.44,.65],[.51,.78],[.565,1.00],[.63,1.13],[0,1.13],[0,.005]],'#e8ad60');
  const creamProfile=[[360,192,443],[340,175,462],[320,163,475],[300,159,480],[280,162,479],[260,172,472],[240,185,459],[220,188,441],[200,192,439],[180,202,432],[160,222,411],[140,237,394],[125,245,382],[110,263,354],[95,284,336],[80,293,329],[70,294,322],[62,300,305]];
  const P=[],I=[],n=64,levels=[[360,317,317],...creamProfile,[62,302,302]];
  for(const [py,left,right] of levels)for(let i=0;i<n;i++){const a=i/n*Math.PI*2,r=(right-left)*.0025,cx=((right+left)/2-320)*.005;P.push(cx+Math.cos(a)*r,(580-py)*.005,Math.sin(a)*r);}
  for(let row=0;row<levels.length-1;row++)for(let i=0;i<n;i++){const a=row*n+i,b=row*n+(i+1)%n,c=a+n,d=b+n;I.push(a,c,d,a,d,b);}
  const cream=mesh('SoftServe',k.geometry(P,I),'#fff2df',[0,0,0]);
  for(let side=-1;side<=1;side+=2)for(let line=0;line<8;line++){
   const ps=[];for(let j=0;j<=32;j++){const t=j/32,y=.04+t*.63,r=.04+y*.65,a=line/8*Math.PI*2+side*t*2.0;ps.push([Math.cos(a)*r,y,Math.sin(a)*r]);}
   const ridge=k.tube('WaffleRidge'+side+'_'+line,ps,.006,mat('WaffleGroove','#b78043'),g);ridge.position.copy(offset).multiplyScalar(-1);
  }
  function radiusAt(y){const py=580-y/.005;for(let i=0;i<creamProfile.length-1;i++){const a=creamProfile[i],b=creamProfile[i+1];if(py<=a[0]&&py>=b[0]){const t=(a[0]-py)/(a[0]-b[0]);return ((a[2]-a[1])*(1-t)+(b[2]-b[1])*t)*.0025;}}return .02;}
  // The cream is one closed volume; the spiral continues around its rear.
  for(let turn=0;turn<3;turn++){const ps=[];for(let i=0;i<=32;i++){const t=i/32,a=Math.PI+t*Math.PI,y=1.45+turn*.32+t*.16,r=radiusAt(y)+.006;ps.push([Math.cos(a)*r,y,Math.sin(a)*r]);}const seam=k.tube('CreamSpiralGroove'+turn,ps,.012,mat('CreamGroove','#dec7a6'),g);seam.position.copy(offset).multiplyScalar(-1);}
  face(320,324,109,86,[cream,cone]);
 }
 if(id==='vegetable-mushroom'){
  const hood=egg('MushroomHood',[.62,.63,.57],'#efd8ae',[0,1.20,0]);
  const cap=lathe('MushroomCap',[[0,1.49],[1.02,1.49],[1.06,1.58],[1.0,1.82],[.84,2.12],[.55,2.36],[.20,2.47],[0,2.49],[0,1.49]],'#ce6961');
  // Place the spots on the actual cap, including its rear. An approximate
  // height formula previously buried almost every rear spot inside the cap.
  cap.updateWorldMatrix(true,false);const ray=new THREE.Raycaster();
  for(let i=0;i<15;i++){
   const a=i*2.4,r=.20+.68*(i%5)/5,x=Math.cos(a)*r,z=Math.sin(a)*r;
   ray.set(new THREE.Vector3(x,4,z),new THREE.Vector3(0,-1,0));const hit=ray.intersectObject(cap)[0];if(!hit)continue;
   const normal=hit.face.normal.clone().transformDirection(cap.matrixWorld);
   const spot=egg('CapSpot'+i,[.105,.012,.085],'#fff0d4',hit.point.clone().addScaledVector(normal,.008).toArray());
   spot.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),normal);
  }
  face(320,333,120,92,hood);
 }
 if(id==='object-lamp'){
  const hood=egg('LampFaceGlobe',[.56,.55,.50],'#f5d6a2',[0,1.26,.28]);
  // The original shade has an arch above the forehead. A straight circular
  // hem would hide the eyes unless the entire head were pushed forward.
  const P=[],I=[],n=96,hem=[];
  for(let layer=0;layer<4;layer++)for(let i=0;i<n;i++){
   const a=i/n*Math.PI*2,front=Math.sin(a)>0;
   let y=1.16,r=.98;
   for(let j=0;j<5;j++){
    const x=Math.cos(a)*r;
    y=front&&Math.abs(x)<.55?Math.max(1.16,1.245+.46*Math.sqrt(1-(x/.55)**2)):1.16;
    r=.32+(2.565-y)/(2.565-1.16)*.66;
   }
   const bottom=layer===1||layer===2,inner=layer>=2;
   const rr=(bottom?r:.32)-(inner?.035:0),yy=bottom?y:2.565-(inner?.025:0);
   P.push(Math.cos(a)*rr,yy,Math.sin(a)*rr);
   if(layer===1)hem.push([Math.cos(a)*rr,yy,Math.sin(a)*rr]);
  }
  for(const [u,v] of [[0,1],[1,2],[2,3],[3,0]])for(let i=0;i<n;i++){const a=u*n+i,b=u*n+(i+1)%n,c=v*n+i,d=v*n+(i+1)%n;I.push(a,b,d,a,d,c);}
  mesh('LampShade',k.geometry(P,I),'#ffcf79',[0,0,0]);
  const edge=k.tube('ShadeHem',[...hem,hem[0]],.022,mat('ShadeHemInk','#ba8146'),g);edge.position.copy(offset).multiplyScalar(-1);
  face(320,331,107,87,hood);
 }
 if(id==='food-fried-egg'){
  const hood=egg('EggHood',[.67,.66,.55],'#fff5df',[0,1.27,0]);
  const P=[],I=[],n=64;
  for(const lower of [false,true])for(let ring=0;ring<=10;ring++)for(let i=0;i<n;i++){
   const t=ring/10,a=i/n*Math.PI*2,r=1+.05*Math.sin(a*5)+.025*Math.cos(a*7);P.push(Math.cos(a)*r*t,1.75+.43*(1-t*t)+(lower?-.05:.02)+Math.cos(a*4)*.035*t,Math.sin(a)*r*t*.68);
  }
  const side=11*n;for(let ring=0;ring<10;ring++)for(let i=0;i<n;i++){const a=ring*n+i,b=ring*n+(i+1)%n,c=a+n,d=b+n;if(ring){I.push(a,d,b,a+side,b+side,d+side);}I.push(a,c,d,a+side,d+side,c+side);}
  mesh('EggWhite',k.geometry(P,I),'#fff9e9',[0,0,0]);egg('EggYolk',[.36,.22,.34],'#f5bc37',[0,2.28,0]);face(320,312,114,89,hood);
 }
 require('./project-model-artwork.cjs')(THREE,k,g,head.part.pivot);
 head.special=true;
 return true;
};
