"use strict";

// Round food and containers need rotational solids, not inflated silhouettes.
// The face stays the original illustration, projected onto a supported surface.
module.exports=function special(THREE,k,id,parts){
 if(require('./snake-costumes.cjs')(THREE,k,id,parts))return true;
 if(require('./animal-heads.cjs')(THREE,k,id,parts.get('Head')))return true;
 if(require('./small-animal-heads.cjs')(THREE,k,id,parts.get('Head')))return true;
 if(require('./animal-costumes.cjs')(THREE,k,id,parts))return true;
 if(require('./root-vegetables.cjs')(THREE,k,id,parts.get('Head')))return true;
 if(require('./produce-models.cjs')(THREE,k,id,parts.get('Head'),parts))return true;
 if(require('./remaining-props.cjs')(THREE,k,id,parts.get('Head'),parts))return true;
 if(require('./theme-costumes.cjs')(THREE,k,id,parts))return true;
 if(require('./vehicle-costumes.cjs')(THREE,k,id,parts))return true;
 if(require('./object-solids.cjs')(THREE,k,id,parts.get('Head'),parts))return true;
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
  const body=require('./revolved-food.cjs')(THREE,k,id,g,offset);body.userData.skipOriginalPaint=true;face(320,347,116,94,body);
  for(let i=0;i<3;i++){const x=(i-1)*.42,candle=cylinder('Candle'+i,.075,.075,.45,i===1?'#ea8593':'#83b8cd',[x,2.13,-.10]);candle.userData.skipOriginalPaint=true;const flame=egg('Flame'+i,[.095,.15,.065],'#ffbd58',[x,2.50,-.10]);flame.userData.skipOriginalPaint=true;
   const ps=[];for(let j=0;j<=48;j++){const t=j/48,a=t*Math.PI*6;ps.push(local([x+Math.cos(a)*.076,1.93+t*.40,-.10+Math.sin(a)*.076]));}const stripe=k.tube('CandleStripe'+i,ps,.008,mat('CandleStripeColor'+i,i===1?'#f4b2bc':'#b6d9e4'),g);stripe.userData.skipOriginalPaint=true;
  }
 }
 if(id==='food-bingsu'){
  bowl('BingsuBowl',.83,.80,.14,'#abd4e7');cylinder('BowlFoot',.30,.32,.10,'#abd4e7',[0,.07,0]);cylinder('BowlStem',.20,.25,.12,'#abd4e7',[0,.15,0]);ring('BowlRim',.81,.027,'#739eb6',.80);
  const ice=lathe('ShavedIce',[[0,.68],[.76,.80],[.72,1.10],[.57,1.55],[.36,1.91],[.16,2.04],[0,2.08],[0,.68]],'#f4fbff');ice.userData.skipOriginalPaint=true;face(318,356,93,76,ice);
  const topping=lathe('RedBeanMound',[[0,1.72],[.49,1.72],[.50,1.78],[.39,1.96],[.22,2.10],[0,2.15],[0,1.72]],'#743f3d');topping.userData.skipOriginalPaint=true;
  ice.updateWorldMatrix(true,false);topping.updateWorldMatrix(true,false);const ray=new THREE.Raycaster();
  for(let i=0;i<40;i++){
   const a=i*2.4,r=.07+(.43*(i%9)/8),x=Math.cos(a)*r,z=Math.sin(a)*r;
   ray.set(new THREE.Vector3(x,4,z),new THREE.Vector3(0,-1,0));const hit=ray.intersectObjects([ice,topping])[0];if(!hit)continue;
   const bean=egg('RedBean'+i,[.115,.075,.09],i%3?'#743f3d':'#8c4d43',[x,hit.point.y+.025+(i%3)*.012,z]);bean.rotation.y=a;
   bean.userData.skipOriginalPaint=true;
  }
 }
 if(id==='food-tteokbokki'){
  const pot=bowl('RiceCakeBowl',1.30,1.55,.03,'#f3d8b6');ring('RedBowlBand',1.20,.065,'#c4472d',1.30);ring('CreamBowlRim',1.30,.038,'#ffe7c5',1.55);
  cylinder('Sauce',1.24,1.24,.06,'#b83c19',[0,1.38,0]);
  for(let row=0;row<3;row++)for(let col=0;col<5;col++){const x=(col-2)*.41,z=(row-1)*.53;if(x*x+z*z>1.08)continue;const i=row*5+col,rice=egg('RiceCake'+i,[.14,.115,.34],i%3?'#ee9635':'#f4af48',[x,1.59+(i%3)*.025,z]);rice.rotation.y=(i%2?.65:-.65)+(row-1)*.3;}
  // The reference looks into a tilted bowl. Tilt the complete bowl and food,
  // leaving the face upright within the opening rather than above the rim.
  const rotation=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0),.58),center=new THREE.Vector3(0,1.30,0);
  for(const object of g.children){const p=object.position.clone().add(offset).sub(center).applyQuaternion(rotation).add(center).sub(offset);object.position.copy(p);object.quaternion.premultiply(rotation);object.userData.skipOriginalPaint=true;}
  const hood=egg('RiceCakeFaceHood',[.64,.52,.42],'#f1cf9d',[0,1.43,.76]);face(320,292,119,96,hood);
 }
 if(id==='food-gimbap'){
  const roll=lathe('NoriRoll',[[0,.68],[.62,.68],[.78,.71],[.86,.81],[.86,2.30],[0,2.30],[0,.68]],'#344d35');
  roll.userData.skipOriginalPaint=true;
  const top=cylinder('RiceTop',.82,.82,.045,'#f9f3df',[0,2.32,0]);top.userData.skipOriginalPaint=true;
  for(const [i,x,z,c] of [[0,-.22,.08,'#e88e4f'],[1,.23,.06,'#a9c25a'],[2,0,-.23,'#e6c765']]){const filling=egg('Filling'+i,[.28,.025,.22],c,[x,2.36,z]);filling.userData.skipOriginalPaint=true;}
  for(let i=0;i<20;i++){const a=i/20*Math.PI*2,x=Math.cos(a)*.64,z=Math.sin(a)*.59,grain=egg('TopRiceGrain'+i,[.035,.012,.065],'#e4dfcb',[x,2.35,z]);grain.rotation.y=a;grain.userData.skipOriginalPaint=true;}
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
  const hood=egg('EggHood',[.86,.76,.62],'#fff9ed',[0,1.55,0]);
  hood.userData.artworkMinY=230;
  // The costume hood ends inside the white rather than piercing its top.
  const hp=hood.geometry.attributes.position;
  for(let i=0;i<hp.count;i++)hp.setY(i,Math.min(hp.getY(i),(2.12-1.55)/.76));
  hood.geometry.computeVertexNormals();
  const P=[],I=[],n=96,rings=16;
  // A thick, softly folded white with a broad centre. A high radial dome
  // made the old white look like a triangular roof over the face.
  for(const lower of [false,true])for(let ring=0;ring<=rings;ring++)for(let i=0;i<n;i++){
   const t=ring/rings,a=i/n*Math.PI*2,r=1+.035*Math.sin(a*5)+.018*Math.cos(a*7);
   const z=Math.sin(a)*t,fold=(.055*Math.cos(a*4+.4)+.025*Math.sin(a*7))*t**4;
   const u=Math.max(0,(t-.4)/.6),drape=u*u*(3-2*u);
   P.push(Math.cos(a)*r*t*1.12,2.16+.04*(1-t*t)-(.30*z+.10*Math.abs(z))*drape+fold+(lower?-.055:.025),z*r*.73);
  }
  const side=(rings+1)*n;for(let ring=0;ring<rings;ring++)for(let i=0;i<n;i++){const a=ring*n+i,b=ring*n+(i+1)%n,c=a+n,d=b+n;if(ring){I.push(a,b,d,a+side,d+side,b+side);}I.push(a,d,c,a+side,c+side,d+side);}
  for(let i=0;i<n;i++){const a=rings*n+i,b=rings*n+(i+1)%n;I.push(a,b,a+side,b,b+side,a+side);}
  const white=mesh('EggWhite',k.geometry(P,I),'#fffdf3',[0,0,0]);
  white.userData.skipOriginalPaint=true;
  const yolk=lathe('EggYolk',[[0,2.17],[.43,2.17],[.49,2.21],[.47,2.34],[.38,2.49],[.22,2.58],[0,2.61]],'#ffc632');yolk.userData.skipOriginalPaint=true;
  face(320,312,114,89,hood);
 }
 require('./visible-front-artwork.cjs')(THREE,k,g,head.part.pivot);
 head.special=true;
 return true;
};
