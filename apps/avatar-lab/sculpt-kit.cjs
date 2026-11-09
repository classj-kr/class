"use strict";

// Dimensions are authored in the 640px original's coordinate system. Depth
// is a real spatial dimension; it is never computed by inflating an alpha mask.
module.exports=function sculptKit(THREE,k,head){
 const parent=head.group,offset=parent.position.clone(),pivot=head.part.pivot;
 const point=([x,y,z=0])=>[(x-320)*.005-offset.x,(580-y)*.005-offset.y,z-offset.z];
 const material=(name,color)=>k.solid(name+'Color',color);
 function mesh(name,geometry,color,p=[320,580,0]){return k.mesh(name,geometry,material(name,color),parent,point(p));}
 function ellipsoid(name,p,r,color,rotation=0){const size=Math.max(r[0],r[1],r[2]/.005),small=size<25,medium=size<80;const o=mesh(name,new THREE.SphereGeometry(1,small?16:medium?24:48,small?10:medium?16:32),color,p);o.scale.set(r[0]*.005,r[1]*.005,r[2]);o.rotation.z=rotation;return o;}
 function outline(name,ps,depth,color,z=0,bevel=.035){
  const shape=new THREE.Shape();ps.forEach(([x,y],i)=>{const px=(x-320)*.005,py=(580-y)*.005;if(i)shape.lineTo(px,py);else shape.moveTo(px,py);});shape.closePath();
  const geometry=new THREE.ExtrudeGeometry(shape,{depth:Math.max(.005,depth-bevel*2),bevelEnabled:bevel>0,bevelThickness:bevel,bevelSize:bevel*.65,bevelSegments:3,curveSegments:16,steps:1});geometry.translate(0,0,z-depth/2+bevel);
  return mesh(name,geometry,color);
 }
 function box(name,p,size,color,r=12){
  const [w,h,d]=size,x=p[0]-w/2,y=p[1]-h/2,ps=[],steps=6;
  for(const [cx,cy,start] of [[x+w-r,y+r,-Math.PI/2],[x+w-r,y+h-r,0],[x+r,y+h-r,Math.PI/2],[x+r,y+r,Math.PI]])for(let i=0;i<=steps;i++){const a=start+i/steps*Math.PI/2;ps.push([cx+Math.cos(a)*r,cy+Math.sin(a)*r]);}
  const o=outline(name,ps,d,color,p[2]||0,Math.min(.025,d*.15));
  const cx=(p[0]-320)*.005,cy=(580-p[1])*.005;
  o.geometry.translate(-cx,-cy,0);o.position.x+=cx;o.position.y+=cy;return o;
 }
 function smoothOutline(name,ps,depth,color,z=0,bevel=.035){const curve=new THREE.CatmullRomCurve3(ps.map(([x,y])=>new THREE.Vector3(x,y,0)),true,'centripetal');return outline(name,curve.getSpacedPoints(64).slice(0,64).map(v=>[v.x,v.y]),depth,color,z,bevel);}
 function tube(name,ps,r,color){const o=k.tube(name,ps.map(point),r,material(name,color),parent);for(const [j,p] of [ps[0],ps.at(-1)].entries())ellipsoid(name+'Cap'+j,p,[r/.005,r/.005,r],color);return o;}
 function sweep(name,ps,color){
  const curve=new THREE.CatmullRomCurve3(ps.map(p=>new THREE.Vector3(...point(p)))),P=[],I=[],n=16,steps=64;
  for(let j=0;j<=steps;j++){const t=j/steps,p=curve.getPoint(t),dir=curve.getTangent(t),normal=new THREE.Vector3(-dir.y,dir.x,0).normalize(),b=new THREE.Vector3().crossVectors(dir,normal).normalize(),f=t*(ps.length-1),lo=Math.floor(f),hi=Math.min(ps.length-1,lo+1),r=(ps[lo][3]*(1-f+lo)+ps[hi][3]*(f-lo))*.005;
   for(let i=0;i<n;i++){const a=i/n*Math.PI*2,q=p.clone().addScaledVector(normal,Math.cos(a)*r).addScaledVector(b,Math.sin(a)*r);P.push(...q.toArray());}
  }
  for(let j=0;j<steps;j++)for(let i=0;i<n;i++){const a=j*n+i,b=j*n+(i+1)%n,c=a+n,d=b+n;I.push(a,b,d,a,d,c);}
  for(const end of [0,steps]){const c=P.length/3;P.push(...curve.getPoint(end/steps).toArray());for(let i=0;i<n;i++)end?I.push(c,end*n+i,end*n+(i+1)%n):I.push(c,(i+1)%n,i);}
  return k.mesh(name,k.geometry(P,I),material(name,color),parent);
 }
 function cone(name,p,r,h,color,direction=[0,1,0]){const o=mesh(name,new THREE.ConeGeometry(r,h,24),color,p);o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),new THREE.Vector3(...direction).normalize());return o;}
 function torus(name,p,r,t,color,scale=[1,1,1]){const o=mesh(name,new THREE.TorusGeometry(r,t,12,64),color,p);o.scale.set(...scale);return o;}
 function lathe(name,profile,color,z=0,detail={}){const curve=new THREE.CatmullRomCurve3(profile.map(([y,r,x=320])=>new THREE.Vector3(r*.005,(580-y)*.005,(x-320)*.005)));
  const levels=curve.getPoints(detail.levels||96),P=[],I=[],n=detail.segments||64;
  for(const v of levels)for(let i=0;i<n;i++){const a=i/n*Math.PI*2;P.push(v.z+Math.cos(a)*Math.max(0,v.x),v.y,z+Math.sin(a)*Math.max(0,v.x));}
  for(let row=0;row<levels.length-1;row++)for(let i=0;i<n;i++){const a=row*n+i,b=row*n+(i+1)%n,c=a+n,d=b+n;I.push(a,c,d,a,d,b);}
  const g=k.geometry(P,I);if(g.attributes.normal.getY(0)>0){/* profiles go bottom to top */}return mesh(name,g,color);
 }
 function leaf(name,base,tip,width,color,depth=.055){const dx=tip[0]-base[0],dy=tip[1]-base[1],len=Math.hypot(dx,dy),nx=-dy/len,ny=dx/len,ps=[];
  for(let i=0;i<=12;i++){const t=i/12,w=Math.sin(t*Math.PI)*width;ps.push([base[0]+dx*t+nx*w,base[1]+dy*t+ny*w]);}
  for(let i=12;i>=0;i--){const t=i/12,w=Math.sin(t*Math.PI)*width;ps.push([base[0]+dx*t-nx*w,base[1]+dy*t-ny*w]);}
  return outline(name,ps,depth,color,base[2]||0,.012);
 }
 function paint(){require(parent.userData.directSurfaceArtwork?'./project-model-artwork.cjs':'./visible-front-artwork.cjs')(THREE,k,parent,pivot);head.special=true;}
 return{parent,offset,pivot,point,mesh,ellipsoid,outline,smoothOutline,box,tube,sweep,cone,torus,lathe,leaf,paint};
};
