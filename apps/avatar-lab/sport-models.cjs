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
  target.geometry=new THREE.SphereGeometry(1,64,40);
  // The original illustration supplies the face, not a stretched colour lookup
  // on the sides. Smooth costume colour and lighting remain coherent at 360°.
  if(id==='sport-basketball'){
   // Two perpendicular great circles plus ONE continuous waved seam: six
   // crossings divide the sphere into eight panels (the traditional pattern).
   const tilt=-.45;
   for(let axis=0;axis<2;axis++){const ps=[];for(let i=0;i<=256;i++){const a=i/256*Math.PI*2,v=(axis===0?new THREE.Vector3(0,Math.cos(a),Math.sin(a)):new THREE.Vector3(Math.cos(a),0,Math.sin(a))).applyAxisAngle(new THREE.Vector3(1,0,0),tilt);ps.push(v.multiplyScalar(R+.002).add(C).toArray());}line('BasketballGreatCircle'+axis,ps,.022,'#3d2924');}
   const seam=require('./ball-seams.cjs')(THREE,.66,tilt);
   line('BasketballContinuousSeam',Array.from({length:513},(_,i)=>seam.point(i/512*Math.PI*2).multiplyScalar(R+.002).add(C).toArray()),.022,'#3d2924');
  }
  if(id==='sport-baseball'){
   const seam=require('./ball-seams.cjs')(THREE,.79,0);
   line('BaseballContinuousSeam',Array.from({length:513},(_,i)=>seam.point(i/512*Math.PI*2).multiplyScalar(R+.001).add(C).toArray()),.005,'#ad5a50');
   for(let i=0;i<108;i++){
    const u=i/108,v=seam.curve.getPointAt(u).normalize(),tangent=seam.curve.getTangentAt(u).normalize(),across=new THREE.Vector3().crossVectors(v,tangent).normalize();
    const stitch=[v.clone().addScaledVector(across,-.043).addScaledVector(tangent,-.018),v.clone(),v.clone().addScaledVector(across,.043).addScaledVector(tangent,-.018)].map(p=>p.normalize().multiplyScalar(R+.006).add(C).toArray());
    line('BaseballStitch'+i,stitch,.010,'#b33136');
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
   for(const [index,panel] of panels.entries()){
    const mid=panel.outline.reduce((s,v)=>s.add(v),new THREE.Vector3()).normalize(),boundary=[];
    for(let j=0;j<panel.outline.length;j++)for(let t=0;t<6;t++)boundary.push(panel.outline[j].clone().lerp(panel.outline[(j+1)%panel.outline.length],t/6).normalize());
    const P=[],I=[],n=boundary.length,rings=8;
    for(let ring=0;ring<=rings;ring++)for(const v of boundary){P.push(...mid.clone().lerp(v,ring/rings).normalize().multiplyScalar(R+.008).add(C).toArray());}
    for(let ring=0;ring<rings;ring++)for(let i=0;i<n;i++){const a=ring*n+i,b=ring*n+(i+1)%n,c=a+n,d=b+n;if(ring)I.push(a,b,d);I.push(a,d,c);}
    const geo=k.geometry(P,I);const normal=new THREE.Vector3().fromBufferAttribute(geo.attributes.normal,n*3),point=new THREE.Vector3().fromBufferAttribute(geo.attributes.position,n*3).sub(C);if(normal.dot(point)<0){for(let i=0;i<I.length;i+=3)[I[i+1],I[i+2]]=[I[i+2],I[i+1]];geo.setIndex(I);geo.computeVertexNormals();}
    k.mesh('FootballPanel'+index,geo,mat('Panel'+index,panel.black?'#414047':white),head);
    const edge=[];for(let j=0;j<panel.outline.length;j++)for(let t=0;t<8;t++)edge.push(panel.outline[j].clone().lerp(panel.outline[(j+1)%panel.outline.length],t/8).normalize().multiplyScalar(R+.006).add(C).toArray());edge.push(edge[0]);line('PanelEdge'+index,edge,.004,'#62636a');
   }
  }
  // Leave a genuine face opening in the surface markings. A raised oval was
  // hiding the seams before, but protruded from the ball in side views.
  const faceY=(580-(id==='sport-basketball'?302:293))*.005;
  for(const object of head.children){if(!object.isMesh||object===target)continue;const geo=object.geometry,p=geo.attributes.position,ix=geo.index,kept=[];
   for(let i=0;i<(ix?ix.count:p.count);i+=3){const ids=[0,1,2].map(j=>ix?ix.getX(i+j):i+j),x=ids.reduce((s,j)=>s+p.getX(j),0)/3,y=ids.reduce((s,j)=>s+p.getY(j),0)/3,z=ids.reduce((s,j)=>s+p.getZ(j),0)/3;if(z>0&&(x/.53)**2+((y-faceY)/.44)**2<1.02)continue;kept.push(...ids);}geo.setIndex(kept);
  }
  const artwork=face(320,id==='sport-basketball'?302:293,104,86,target);
  const color=id==='sport-basketball'?orange:white;
  k.suit([
   ['Torso',[320,485],[[275,430],[365,430],[378,468],[370,523],[348,539],[291,539],[269,514],[266,472]],[320,484],.23,0],
   ['LeftArm',[258,448],[[259,433],[272,451],[260,489],[252,507],[230,509],[226,495],[239,455]],[249,472],.10,0],
   ['RightArm',[382,448],[[381,433],[368,451],[380,489],[388,507],[410,509],[414,495],[401,455]],[391,472],.10,0],
   ['LeftLeg',[292,526],[[271,514],[311,520],[308,547],[303,570],[279,579],[262,568],[274,550]],[289,549],.14,0],
   ['RightLeg',[348,526],[[369,514],[329,520],[332,547],[337,570],[361,579],[378,568],[366,550]],[351,549],.14,0]
  ],color);
  const result=k.finish({authoring:'Spherical sports ball with continuous three-dimensional seams and original face'});Object.assign(result.root.userData,{locomotion:'walk',canWave:true});return result;
 }
 const pinProfile=[[0,.01],[.24,.015],[.33,.06],[.41,.25],[.45,.65],[.44,.90],[.37,1.15],[.27,1.42],[.19,1.62],[.17,1.88],[.22,2.12],[.26,2.35],[.25,2.48],[.15,2.58],[0,2.60]],pinCurve=new THREE.CatmullRomCurve3(pinProfile.map(([r,y])=>new THREE.Vector3(r,y,0))),pinShape=pinCurve.getPoints(96).map(p=>new THREE.Vector2(Math.max(0,p.x),p.y));pinShape.push(new THREE.Vector2(0,.01));
 const pin=k.mesh('BowlingPin',new THREE.LatheGeometry(pinShape,64),mat('Pin',white),head,[-.56,0,.05]);
  for(const y of [1.66,1.87]){const band=k.mesh('PinRedBand'+y,new THREE.CylinderGeometry(.191,.191,.12,64),mat('Band','#d93d48'),head,[-.56,y,.05]);}
 const hood=egg('BowlingHood',[.59,.56,.52],white,[.30,1.50,-.10]);face(380,278,110,97,hood);
 egg('BowlingSuit',[.30,.40,.23],white,[.26,.76,-.14]);
 const ball=egg('BowlingBall',[.475,.475,.475],'#65656d',[.55,.48,.20]);
 for(const [i,x,y] of [[0,.565,.72],[1,.785,.70],[2,.68,.54]]){const dx=x-.55,dy=y-.48,z=.20+Math.sqrt(.475*.475-dx*dx-dy*dy);const hole=egg('FingerHole'+i,[.057,.057,.014],'#323238',[x,y,z+.003]);hole.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),new THREE.Vector3(dx,dy,z-.20).normalize());}
 require('./project-model-artwork.cjs')(THREE,k,head,[320,580]);
 k.root.updateMatrixWorld(true);k.root.position.y-=new THREE.Box3().setFromObject(k.root).min.y;
 const clips=[];for(const name of ['Idle','Walk','Wave']){const times=Array.from({length:49},(_,i)=>i/24),values=[];for(let i=0;i<49;i++)values.push(0,name==='Idle'?0:.035*(1-Math.cos(i/48*Math.PI*2)),0);clips.push(new THREE.AnimationClip(name,2,[new THREE.VectorKeyframeTrack('Body.position',times,values)]));}
 require('./illustration-materials.cjs')(THREE,k.root);k.root.userData={avatarKey:id+'.webp',prototype:true,locomotion:'hop',canWave:false,walkStride:.4,walkDuration:2};return{root:k.root,clips};
};
