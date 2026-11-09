"use strict";

module.exports=function packedFoods(THREE,k,id,parts){
 if(!['food-cheese','food-chocolate','food-popcorn','food-sushi'].includes(id))return false;
 const head=parts.get('Head'),s=require('./sculpt-kit.cjs')(THREE,k,head);s.parent.clear();
 s.parent.userData.directSurfaceArtwork=true;
 s.parent.userData.artworkOpaqueRegions=[{cx:320,cy:308,rx:122,ry:104}];
 if(id==='food-cheese'){
  s.parent.userData.artworkOpaqueRegions.push({cx:320,cy:119,rx:174,ry:66});
  // The eaten-out rim is geometry, not transparent paint on a rectangular box.
  const outline=[[143,165],[495,165],[501,175],[501,230],[480,249],[474,275],[480,298],[501,313],[501,379],[492,397],[241,405],[226,399],[219,389],[205,387],[192,393],[184,403],[150,399],[139,386],[137,317],[155,298],[168,274],[165,253],[153,237],[139,232],[137,176]],curve=new THREE.CatmullRomCurve3(outline.map(([x,y])=>new THREE.Vector3(x,y,0)),true,'centripetal'),contour=curve.getSpacedPoints(128).slice(0,128),P=[],I=[],N=contour.length,R=40;
  // A triangular cheese prism: broad front face, narrow rear edge and a
  // sloping visible top. Extruding the complete 2D picture made a house-shaped block.
  for(let j=0;j<=R;j++){const t=j/R,scale=1-.995*t;for(const p of contour){let x=320+(p.x-320)*scale,y=p.y-100*t;if(p.x>400&&p.y<190)x-=13*Math.exp(-(((t-.53)/.065)**2));P.push((x-320)*.005,(580-y)*.005,.48-.96*t);}}
  for(let j=0;j<R;j++)for(let i=0;i<N;i++){const a=j*N+i,b=j*N+(i+1)%N,c=a+N,d=b+N;I.push(a,b,d,a,d,c);}
  const cap=THREE.ShapeUtils.triangulateShape(contour.map(p=>new THREE.Vector2(p.x,-p.y)),[]);
  for(const end of [0,R]){const start=P.length/3;for(let i=0;i<N;i++)P.push(...P.slice((end*N+i)*3,(end*N+i)*3+3));for(const [a,b,c] of cap)end?I.push(start+a,start+c,start+b):I.push(start+a,start+b,start+c);}
  const cheese=s.mesh('CheeseWedgeSolid',k.geometry(P,I),'#f7cb55');
  // The wearer stands under the broad front of the wedge, not its raised
  // tapered rear. Keep every limb pivot in the same forward plane.
  for(const name of ['Torso','LeftArm','RightArm','LeftLeg','RightLeg'])parts.get(name).group.position.z+=.36;
  cheese.updateWorldMatrix(true,false);const ray=new THREE.Raycaster();
  for(const [i,x,y,rx,ry] of [[0,235,144,22,13],[1,313,103,24,15],[2,203,203,22,25],[3,448,203,16,19],[4,452,355,16,20],[5,174,344,16,19]]){
   ray.set(new THREE.Vector3((x-320)*.005,(580-y)*.005,-3),new THREE.Vector3(0,0,1));const hit=ray.intersectObject(cheese)[0];if(!hit)continue;
   let scale=1,points=[];const colors=[],indices=[],segments=32,rings=8;
   for(let attempt=0;attempt<7;attempt++){
    points=[];let valid=true;for(let ring=0;ring<=rings;ring++)for(let j=0;j<segments;j++){
     const a=j/segments*Math.PI*2,px=x+Math.cos(a)*rx*scale*ring/rings,py=y+Math.sin(a)*ry*scale*ring/rings;
     ray.set(new THREE.Vector3((px-320)*.005,(580-py)*.005,-3),new THREE.Vector3(0,0,1));const sample=ray.intersectObject(cheese)[0];if(!sample){valid=false;break;}points.push(sample.point.x,sample.point.y,sample.point.z-.003);
    }if(valid)break;scale*=.8;
   }
   if(points.length!==(rings+1)*segments*3)continue;
   for(let ring=0;ring<=rings;ring++)for(let j=0;j<segments;j++){const c=new THREE.Color('#cf9632').lerp(new THREE.Color('#e9b643'),ring/rings).convertSRGBToLinear();colors.push(c.r,c.g,c.b);}
   for(let ring=0;ring<rings;ring++)for(let j=0;j<segments;j++){const a=ring*segments+j,b=ring*segments+(j+1)%segments,c=a+segments,d=b+segments;if(ring)indices.push(a,d,b);indices.push(a,c,d);}
   const geo=k.geometry(points,indices);geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));const pit=s.mesh('RearCheeseDimple'+i,geo,'#ffffff');pit.material.userData.preserveVertexColor=true;pit.userData.skipOriginalPaint=true;
  }
 }
 if(id==='food-chocolate'){
  s.box('ChocolateBarSolid',[320,251,0],[296,372,.38],'#78452e',15);
  for(let col=0;col<3;col++)for(let row=0;row<2;row++){
   const tile=s.box('RearChocolateTile'+row+'_'+col,[222+col*96,117+row*91,-.205],[82,77,.042],'#925335',6);tile.userData.skipOriginalPaint=true;
  }
  const top=[[167,195],[205,207],[241,221],[283,211],[316,203],[347,209],[389,225],[419,236],[468,217]];
  const wrapper=[...top,[470,417],[460,437],[183,437],[169,423]];
  s.smoothOutline('ChocolateWrapperSolid',wrapper,.445,'#cb3c2e',0,.014);
  s.smoothOutline('WrapperFoilSolid',[...top,...top.map(([x,y])=>[x,y+18]).reverse()],.463,'#f4e6d6',0,.007);
 }
 if(id==='food-popcorn'){
  const bucket=s.lathe('PopcornBucketSolid',[[442,0],[440,116],[433,132],[409,139],[200,166],[170,170],[164,166],[164,0]],'#ffffff',0,{levels:48,segments:48});
  const p=bucket.geometry.attributes.position,colors=[];
  for(let i=0;i<p.count;i++){
   const py=580-p.getY(i)/.005,a=Math.atan2(p.getX(i),p.getZ(i)),top=Math.max(0,1-(py-164)/38);p.setY(i,p.getY(i)-.045*(1+Math.cos(a*10))*top);
   const c=new THREE.Color(Math.cos(a*5)>.03?'#c73942':'#fff3df').convertSRGBToLinear();colors.push(c.r,c.g,c.b);
  }
  bucket.geometry.computeVertexNormals();bucket.geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));bucket.material.userData.preserveVertexColor=true;bucket.userData.artworkCylindrical=true;
  const mound=s.lathe('PopcornMoundSolid',[[187,0],[180,135],[160,166],[140,155],[120,126],[100,102],[80,73],[70,36],[65,22],[61,0]],'#fff0bc',0,{levels:48,segments:48});
  const mp=mound.geometry.attributes.position;
  for(let i=0;i<mp.count;i++){const z=mp.getZ(i),r=Math.hypot(mp.getX(i),z);if(z>0&&r>.001)mp.setZ(i,r*Math.pow(z/r,.35));else if(z<0&&r>.001)mp.setY(i,mp.getY(i)-.08*Math.min(1,-z/r*2)*Math.max(0,Math.min(1,(mp.getY(i)-1.98)/.18)));}
  mound.geometry.computeVertexNormals();
  mound.userData.artworkHorizontalNormal=true;
  // End the frontal illustration before its lines become long streaks on the
  // shoulders. Rounded kernels supply the visible side and rear relief.
  mound.userData.artworkFacingFade=[.72,.90];
  mound.updateWorldMatrix(true,false);const ray=new THREE.Raycaster();
  const kernelGeometry=new THREE.SphereGeometry(1,16,10);
  for(let i=0;i<32;i++){
   const a=2.28+((i*.61803398875)%1)*4.86,r=.70*Math.sqrt((i+.5)/32),x=Math.cos(a)*r,z=Math.sin(a)*r;
   ray.set(new THREE.Vector3(x,4,z),new THREE.Vector3(0,-1,0));const hit=ray.intersectObject(mound)[0];if(!hit)continue;
   const normal=hit.face.normal.clone().transformDirection(mound.matrixWorld);
   for(let j=0;j<3;j++){
    const q=hit.point.clone().addScaledVector(normal,-.035).add(new THREE.Vector3(Math.cos(j*2.1+a)*.052,j===1?.008:-.008,Math.sin(j*2.1+a)*.052)),size=Math.min(25+(i%4)*1.5,(.82-Math.abs(q.x))/.005*.65);
    const corn=s.ellipsoid('RearPopcorn'+i+'_'+j,[q.x/.005+320,580-q.y/.005,q.z],[size,size*.75,.12],j===1?'#f0cf83':'#fff1ba',j*.6+a);corn.geometry.dispose();corn.geometry=kernelGeometry;corn.userData.skipOriginalPaint=q.z<-.02;corn.userData.artworkCylindrical=true;corn.userData.artworkFacingFade=[.72,.90];
    // Fit actual lobe vertices to the source crown, rather than clipping a
    // conservative box which buried most rear kernels inside the base.
    corn.updateWorldMatrix(true,false);let down=0;
    const silhouette=[[0,61],[22,65],[36,70],[73,80],[89,90],[102,100],[115,110],[126,120],[140,130],[155,140],[166,160],[180,180]];
    for(let v=0;v<kernelGeometry.attributes.position.count;v++){
     const world=corn.localToWorld(new THREE.Vector3().fromBufferAttribute(kernelGeometry.attributes.position,v)),x=Math.abs(world.x)/.005;
     let n=1;while(n<silhouette.length-1&&silhouette[n][0]<x)n++;
     const lo=silhouette[n-1],hi=silhouette[n],y=lo[1]+(hi[1]-lo[1])*Math.min(1,(x-lo[0])/(hi[0]-lo[0]));
     down=Math.max(down,world.y-(580-y)*.005);
    }
    corn.position.y-=down;
   }
  }
 }
 if(id==='food-sushi'){
  const riceBody=s.ellipsoid('SushiRiceSolid',[320,309,0],[219,119,.65],'#faf6ea');
  const rp=riceBody.geometry.attributes.position;for(let i=0;i<rp.count;i++){const x=rp.getX(i),y=rp.getY(i),z=rp.getZ(i),ripple=1+.024*Math.sin(Math.atan2(y,x)*29)*Math.pow(1-Math.abs(z),8);rp.setX(i,x*ripple);rp.setY(i,y*ripple);}riceBody.geometry.computeVertexNormals();
  const contour=[[80,203],[145,124],[237,78],[320,63],[408,83],[482,136],[540,197],[557,237],[529,255],[452,240],[385,214],[320,202],[245,218],[160,248],[106,259],[79,239]];
  k.volume('SalmonFillet',contour,[320,153],s.pivot,.64,.64,s.parent,k.solid('SalmonColor','#e88862'),{art:false,samples:128});
  const rice=riceBody,salmon=s.parent.getObjectByName('SalmonFilletBack');rice.updateWorldMatrix(true,false);salmon.updateWorldMatrix(true,false);const ray=new THREE.Raycaster();
  for(let i=0;i<32;i++){
   const x=155+((i*71)%330),y=270+(i%5)*26;ray.set(new THREE.Vector3((x-320)*.005,(580-y)*.005,-3),new THREE.Vector3(0,0,1));const hit=ray.intersectObject(rice)[0];if(!hit)continue;
   const grain=s.ellipsoid('RearSushiRiceGrain'+i,[x,y,hit.point.z-.009],[12,7,.022],i%3?'#f0ebdf':'#fffaf0',i*.7);grain.userData.skipOriginalPaint=true;
  }
  for(let line=0;line<6;line++){
   const ps=[];for(let j=0;j<=30;j++){const y=90+j*5,x=137+line*65+(y-160)*.26+6*Math.sin(j/30*Math.PI*2);ray.set(new THREE.Vector3((x-320)*.005,(580-y)*.005,-3),new THREE.Vector3(0,0,1));const hit=ray.intersectObject(salmon)[0];if(hit)ps.push([x,y,hit.point.z-.005]);}
   if(ps.length>1){const stripe=s.tube('RearSalmonFat'+line,ps,.016,'#f7bd9f');stripe.userData.skipOriginalPaint=true;}
  }
 }
 s.paint();head.authoredFamily='packed-food';return true;
};
