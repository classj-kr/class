"use strict";
module.exports=function sport(THREE,id){
 const k=require('./model-kit.cjs')(THREE,id),head=k.group('Head',[320,580]),R=.95,C=new THREE.Vector3(0,1.64,0),orange='#fa9529',white='#f2f3f1';
 const mat=(n,c)=>k.solid(n+'Color',c);
 function egg(n,s,c,p,parent=head){return k.ellipsoid(n,s,mat(n,c),parent,p);}
 function line(n,points,r,c){return k.tube(n,points,r,mat(n,c),head);}
 function face(cx,cy,rx,ry,target){k.projectArtwork('OriginalFace',k.ellipse(cx,cy,rx,ry),[cx,cy],[320,580],head,target);}
 const positions=[];let target;
 if(id!=='sport-bowling'){
  target=egg('Ball',[R,R,R],id==='sport-basketball'?orange:white,C.toArray());
  target.geometry=new THREE.SphereGeometry(1,id==='sport-soccer'?64:96,id==='sport-soccer'?40:64);
  // The original illustration supplies the face, not a stretched colour lookup
  // on the sides. Smooth costume colour and lighting remain coherent at 360°.
  if(id==='sport-basketball'){
   // Two perpendicular great circles plus ONE continuous waved seam: six
   // crossings divide the sphere into eight panels (the traditional pattern).
   const tilt=-.45;
   for(let axis=0;axis<2;axis++){const ps=[];for(let i=0;i<=256;i++){const a=i/256*Math.PI*2,v=(axis===0?new THREE.Vector3(0,Math.cos(a),Math.sin(a)):new THREE.Vector3(Math.cos(a),0,Math.sin(a))).applyAxisAngle(new THREE.Vector3(1,0,0),tilt);ps.push(v.multiplyScalar(R+.002).add(C).toArray());}line('BasketballGreatCircle'+axis,ps,.022,'#3d2924');}
   const front=[[193,111],[220,119],[243,138],[254,163],[246,204],[225,248],[202,290],[186,330],[181,365],[180,381]].map(([x,y],i,a)=>{const v=new THREE.Vector3((x-320)/190,(252-y)/190,0);if(i===0||i===a.length-1)return v.normalize();v.z=Math.sqrt(Math.max(0,1-v.x*v.x-v.y*v.y));return v;});
   const back=(x,y,z)=>new THREE.Vector3(x,y,z).normalize(),control=[...front,back(-.4,-.8,-.45),back(0,-.6,-.8),back(.4,-.8,-.45),...front.slice().reverse().map(v=>new THREE.Vector3(-v.x,v.y,v.z)),back(.4,.8,-.45),back(0,.6,-.8),back(-.4,.8,-.45)],curve=new THREE.CatmullRomCurve3(control,true,'centripetal');
   line('BasketballContinuousSeam',Array.from({length:513},(_,i)=>curve.getPoint(i/512).normalize().multiplyScalar(R+.002).add(C).toArray()),.022,'#3d2924');
  }
  if(id==='sport-baseball'){
   const seam=require('./ball-seams.cjs')(THREE,.79,0);
   line('BaseballContinuousSeam',Array.from({length:513},(_,i)=>seam.point(i/512*Math.PI*2).multiplyScalar(R+.001).add(C).toArray()),.012,'#b6222d');
   for(let i=0;i<64;i++){
    const u=i/64,v=seam.curve.getPointAt(u).normalize(),tangent=seam.curve.getTangentAt(u).normalize(),across=new THREE.Vector3().crossVectors(v,tangent).normalize();
    const stitch=[v.clone().addScaledVector(across,-.075).addScaledVector(tangent,-.018),v.clone(),v.clone().addScaledVector(across,.075).addScaledVector(tangent,-.018)].map(p=>p.normalize().multiplyScalar(R+.006).add(C).toArray());
    line('BaseballStitch'+i,stitch,.017,'#b6222d');
   }
  }
  if(id==='sport-soccer'){
   const ico=new THREE.IcosahedronGeometry(1,0),p=ico.attributes.position,vertices=[],faces=[];const unique=new Map();
   for(let i=0;i<p.count;i+=3){const tri=[];for(let j=0;j<3;j++){const v=new THREE.Vector3().fromBufferAttribute(p,i+j),key=v.toArray().map(n=>n.toFixed(5)).join(',');if(!unique.has(key)){unique.set(key,vertices.length);vertices.push(v);}tri.push(unique.get(key));}faces.push(tri);}
   const neighbors=vertices.map(()=>new Set());for(const f of faces)for(let i=0;i<3;i++){neighbors[f[i]].add(f[(i+1)%3]);neighbors[f[i]].add(f[(i+2)%3]);}
   const orient=new THREE.Quaternion().setFromUnitVectors(vertices[0].clone().normalize(),new THREE.Vector3(0,0,1));vertices.forEach(v=>v.applyQuaternion(orient));const upper=vertices[[...neighbors[0]][0]],roll=Math.atan2(upper.x,upper.y);vertices.forEach(v=>v.applyAxisAngle(new THREE.Vector3(0,0,1),roll));
   const truncate=(a,b)=>vertices[a].clone().multiplyScalar(2).add(vertices[b]).normalize();
   const panels=[];
   vertices.forEach((v,i)=>{const u=new THREE.Vector3().crossVectors(v,new THREE.Vector3(0,1,0)).normalize(),w=new THREE.Vector3().crossVectors(v,u).normalize();const outline=[...neighbors[i]].map(j=>truncate(i,j)).sort((a,b)=>Math.atan2(a.dot(w),a.dot(u))-Math.atan2(b.dot(w),b.dot(u)));panels.push({outline,black:true});});
   for(const [a,b,c] of faces)panels.push({outline:[truncate(a,b),truncate(b,a),truncate(b,c),truncate(c,b),truncate(c,a),truncate(a,c)],black:false});
   const seamEdges=new Set();
   for(const [index,panel] of panels.entries()){
    const mid=panel.outline.reduce((s,v)=>s.add(v),new THREE.Vector3()).normalize(),boundary=[];
    for(let j=0;j<panel.outline.length;j++)for(let t=0;t<6;t++)boundary.push(panel.outline[j].clone().lerp(panel.outline[(j+1)%panel.outline.length],t/6).normalize());
    const P=[],I=[],n=boundary.length,rings=8;
    for(let ring=0;ring<=rings;ring++)for(const v of boundary){P.push(...mid.clone().lerp(v,ring/rings).normalize().multiplyScalar(R+.008).add(C).toArray());}
    for(let ring=0;ring<rings;ring++)for(let i=0;i<n;i++){const a=ring*n+i,b=ring*n+(i+1)%n,c=a+n,d=b+n;if(ring)I.push(a,b,d);I.push(a,d,c);}
    const geo=k.geometry(P,I);const normal=new THREE.Vector3().fromBufferAttribute(geo.attributes.normal,n*3),point=new THREE.Vector3().fromBufferAttribute(geo.attributes.position,n*3).sub(C);if(normal.dot(point)<0){for(let i=0;i<I.length;i+=3)[I[i+1],I[i+2]]=[I[i+2],I[i+1]];geo.setIndex(I);geo.computeVertexNormals();}
    k.mesh('FootballPanel'+index,geo,mat('Panel'+index,panel.black?'#414047':white),head);
    for(let j=0;j<panel.outline.length;j++){const a=panel.outline[j],b=panel.outline[(j+1)%panel.outline.length],key=[a,b].map(v=>v.toArray().map(n=>n.toFixed(5)).join(',')).sort().join('|');if(seamEdges.has(key))continue;seamEdges.add(key);const edge=Array.from({length:9},(_,t)=>a.clone().lerp(b,t/8).normalize().multiplyScalar(R+.006).add(C)),curve=new THREE.CatmullRomCurve3(edge);k.mesh('FootballEdge'+seamEdges.size,new THREE.TubeGeometry(curve,8,.004,6,false),mat('Edge','#62636a'),head);}
   }
  }
  // Leave a genuine face opening in the surface markings. A raised oval was
  // hiding the seams before, but protruded from the ball in side views.
  const faceY=(580-(id==='sport-basketball'?302:293))*.005;
  for(const object of head.children){if(!object.isMesh||object===target||id==='sport-soccer')continue;const geo=object.geometry,p=geo.attributes.position,ix=geo.index,kept=[];
   for(let i=0;i<(ix?ix.count:p.count);i+=3){const ids=[0,1,2].map(j=>ix?ix.getX(i+j):i+j),x=ids.reduce((s,j)=>s+p.getX(j),0)/3,y=ids.reduce((s,j)=>s+p.getY(j),0)/3,z=ids.reduce((s,j)=>s+p.getZ(j),0)/3;if(z>0&&(x/.53)**2+((y-faceY)/.44)**2<1.02)continue;kept.push(...ids);}geo.setIndex(kept);
  }
  // A continuous 3D outline and toon shading preserve the illustrated style
  // without dragging the source silhouette across the sides of a sphere.
  const outlineGeometry=new THREE.SphereGeometry(R+.022,64,40),oi=outlineGeometry.index.array;
  for(let i=0;i<oi.length;i+=3)[oi[i+1],oi[i+2]]=[oi[i+2],oi[i+1]];outlineGeometry.computeVertexNormals();
  k.mesh('BallInkShell',outlineGeometry,mat('BallInk',id==='sport-basketball'?'#713419':'#42414b'),head,C.toArray());
  for(const o of head.children){if(o!==target&&!o.name.startsWith('FootballPanel'))continue;
   const p=o.geometry.attributes.position,colors=[],isBlack=o.name.startsWith('FootballPanel')&&Number(o.name.replace('FootballPanel',''))<12;
   const light=new THREE.Color(id==='sport-basketball'?'#ff9c2c':isBlack?'#454047':'#ffffff').convertSRGBToLinear(),dark=new THREE.Color(id==='sport-basketball'?'#de7623':isBlack?'#302e35':'#bdc3ca').convertSRGBToLinear();
   for(let i=0;i<p.count;i++){const n=new THREE.Vector3().fromBufferAttribute(p,i);if(o!==target)n.sub(C);n.normalize();const d=-.45*n.x+.55*n.y+Math.abs(n.z),t=Math.max(0,Math.min(1,(d-.15)/.50)),f=t*t*(3-2*t),c=dark.clone().lerp(light,f);colors.push(c.r,c.g,c.b);}
   o.geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));o.material.color.set(0xffffff);o.material.userData.preserveVertexColor=true;o.material.userData.alreadyShaded=true;
  }
  const faceSupport=id==='sport-soccer'?[target,...head.children.filter(o=>/^FootballPanel\d+$/.test(o.name))]:target;
  face(320,id==='sport-basketball'?302:293,id==='sport-soccer'?110:104,id==='sport-soccer'?90:86,faceSupport);
  if(id==='sport-basketball'){
   const ps=[[202,141],[223,122],[255,113],[292,103],[324,96],[335,105],[323,117],[285,132],[250,145],[222,151]],center=[266,125],ray=new THREE.Raycaster(),P=[],I=[];const outline=new THREE.CatmullRomCurve3(ps.map(([x,y])=>new THREE.Vector3(x,y,0)),true,'centripetal').getSpacedPoints(64).slice(0,64).map(p=>[p.x,p.y]),n=outline.length;
   target.updateWorldMatrix(true,false);for(let ring=0;ring<=10;ring++)for(const [x,y] of outline){const px=center[0]+(x-center[0])*ring/10,py=center[1]+(y-center[1])*ring/10;ray.set(new THREE.Vector3((px-320)*.005,(580-py)*.005,3),new THREE.Vector3(0,0,-1));const hit=ray.intersectObject(target)[0];P.push((px-320)*.005,(580-py)*.005,(hit?.point.z||0)+.006);}for(let ring=0;ring<10;ring++)for(let i=0;i<n;i++){const a=ring*n+i,b=ring*n+(i+1)%n,c=a+n,d=b+n;if(ring)I.push(a,b,d);I.push(a,d,c);}const highlight=k.mesh('BasketballPaintedHighlight',k.geometry(P,I),mat('BallHighlight','#ffc161'),head);highlight.material.side=THREE.DoubleSide;
  }
  const color=id==='sport-basketball'?orange:white;
  k.suit([
   ['Torso',[320,485],[[275,430],[365,430],[378,468],[370,523],[348,539],[291,539],[269,514],[266,472]],[320,484],.23,0],
   ['LeftArm',[258,448],[[259,433],[272,451],[260,489],[252,507],[230,509],[226,495],[239,455]],[249,472],.10,0],
   ['RightArm',[382,448],[[381,433],[368,451],[380,489],[388,507],[410,509],[414,495],[401,455]],[391,472],.10,0],
   ['LeftLeg',[292,526],[[271,514],[311,520],[308,547],[303,570],[279,579],[262,568],[274,550]],[289,549],.14,0],
   ['RightLeg',[348,526],[[369,514],[329,520],[332,547],[337,570],[361,579],[378,568],[366,550]],[351,549],.14,0]
  ],color);
  require('./finish-ball-suits.cjs')(THREE,k,id);
  const result=k.finish({authoring:'Spherical sports ball with continuous three-dimensional seams and original face',waveAngle:.4,waveAmplitude:.1});Object.assign(result.root.userData,{locomotion:'walk',canWave:true});return result;
 }
 const pinProfile=[[0,.01],[.24,.015],[.33,.06],[.41,.25],[.45,.65],[.44,.90],[.37,1.15],[.27,1.42],[.19,1.62],[.17,1.88],[.22,2.12],[.26,2.35],[.25,2.48],[.15,2.58],[0,2.60]],pinCurve=new THREE.CatmullRomCurve3(pinProfile.map(([r,y])=>new THREE.Vector3(r,y,0))),pinShape=pinCurve.getPoints(192).map(p=>new THREE.Vector2(Math.max(0,p.x),p.y));pinShape.push(new THREE.Vector2(0,.01));
 const pin=k.mesh('BowlingPin',new THREE.LatheGeometry(pinShape,64),mat('Pin',white),head,[-.56,0,.05]);
  function pinRadius(y){for(let i=1;i<pinShape.length;i++){const a=pinShape[i-1],b=pinShape[i];if(y>=a.y&&y<=b.y){const t=(y-a.y)/(b.y-a.y);return a.x*(1-t)+b.x*t;}}return 0;}
  for(const [i,[lo,hi]] of [[1.565,1.69],[1.83,1.975]].entries()){
   const rings=[];for(let j=0;j<=16;j++){const y=lo+(hi-lo)*j/16;rings.push(new THREE.Vector2(pinRadius(y)+.002,y));}const band=k.mesh('PinRedBand'+i,new THREE.LatheGeometry(rings,64),mat('Band','#d93d48'),head,[-.56,0,.05]);band.userData.artworkFacingFade=[0,.05];
  }
 const hood=egg('BowlingHood',[.59,.56,.52],white,[.30,1.50,-.10]);
 k.volume('BowlingSuit',[[297,360],[341,374],[391,382],[410,402],[415,444],[397,475],[367,488],[327,483],[296,469],[276,445],[275,402]],[350,426],[320,580],.26,.25,head,mat('BowlingSuit',white),{art:false,z:-.10,samples:72});
 k.volume('BowlingSuitFoot',[[318,475],[354,480],[357,503],[350,525],[338,534],[326,529],[318,513]],[335,506],[320,580],.15,.15,head,mat('BowlingFoot',white),{art:false,z:-.10,samples:48});
 const ball=egg('BowlingBall',[.475,.475,.475],'#65656d',[.55,.48,.20]);
 for(const [i,x,y] of [[0,.565,.72],[1,.785,.70],[2,.68,.54]]){const dx=x-.55,dy=y-.48,z=.20+Math.sqrt(.475*.475-dx*dx-dy*dy);const hole=egg('FingerHole'+i,[.057,.057,.014],'#323238',[x,y,z+.003]);hole.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),new THREE.Vector3(dx,dy,z-.20).normalize());}
 head.userData.artworkOcclusion=true;for(const o of [pin,hood,ball])o.userData.artworkFacingFade=[.20,.5];
 require('./project-model-artwork.cjs')(THREE,k,head,[320,580]);
 require('./finish-bowling.cjs')(THREE,k,head,pin,hood,ball);
 k.root.updateMatrixWorld(true);k.root.position.y-=new THREE.Box3().setFromObject(k.root).min.y;
 const clips=[];for(const name of ['Idle','Walk','Wave']){const times=Array.from({length:49},(_,i)=>i/24),values=[];for(let i=0;i<49;i++)values.push(0,name==='Idle'?0:.035*(1-Math.cos(i/48*Math.PI*2)),0);clips.push(new THREE.AnimationClip(name,2,[new THREE.VectorKeyframeTrack('Body.position',times,values)]));}
 require('./illustration-materials.cjs')(THREE,k.root);k.root.userData={avatarKey:id+'.webp',prototype:true,locomotion:'hop',canWave:false,walkStride:.4,walkDuration:2};return{root:k.root,clips};
};
