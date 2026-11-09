"use strict";
// One continuous hood, including both ears. The front/back heights come from
// the authored padded parts; blending their overlap removes duplicate skins.
module.exports=function catHood(THREE,head,fur,artworkSurface){
 const shapes=[['Hood',[320,255],.72,.70,0,128],['LeftEar',[173,127],.24,.20,.09,64],['RightEar',[460,127],.24,.20,.09,64]].map(([name,center,front,back,z,samples])=>{
  const p=head.getObjectByName(name+'Surface').geometry.attributes.position,boundary=[];
  for(let i=14*samples;i<p.count;i++)boundary.push([p.getX(i)/.005+320,255-p.getY(i)/.005]);
  return{name,center,front,back,z,boundary};
 });
 const contour=[[130,70],[145,63],[178,68],[214,83],[248,106],[270,95],[302,92],[335,91],[364,94],[390,101],[425,81],[466,66],[493,64],[503,77],[507,111],[504,153],[498,181],[492,204],[498,231],[500,270],[498,308],[488,341],[470,369],[444,393],[412,414],[374,430],[335,437],[299,437],[264,429],[231,416],[200,396],[174,370],[153,340],[139,305],[134,269],[134,235],[140,202],[132,170],[127,104]];
 const boundary=new THREE.CatmullRomCurve3(contour.map(([x,y])=>new THREE.Vector3(x,y,0)),true,'centripetal').getSpacedPoints(192).slice(0,192),rings=32,samples=boundary.length;
 function height(shape,x,y,back){
  const [cx,cy]=shape.center,dx=x-cx,dy=y-cy;let crossing=Infinity;
  if(Math.hypot(dx,dy)>1e-6)for(let i=0;i<shape.boundary.length;i++){
   const a=shape.boundary[i],b=shape.boundary[(i+1)%shape.boundary.length],ex=b[0]-a[0],ey=b[1]-a[1],den=dx*ey-dy*ex;
   if(Math.abs(den)<1e-9)continue;
   const ax=a[0]-cx,ay=a[1]-cy,t=(ax*ey-ay*ex)/den,u=(ax*dy-ay*dx)/den;
   if(t>0&&u>=0&&u<=1)crossing=Math.min(crossing,t);
  }
  if(crossing<1)return null;
  const d=Math.sqrt(Math.max(0,1-1/(crossing*crossing)));
  return shape.z+(back?-shape.back:shape.front)*d;
 }
 const blend=(a,b,k=.065)=>Math.max(a,b)+Math.max(0,k-Math.abs(a-b))**2/(4*k);
 for(const shape of shapes)for(const suffix of ['Surface','Back','Artwork']){const o=head.getObjectByName(shape.name+suffix);head.remove(o);o.geometry.dispose();}
 for(const back of [false,true]){
  const P=[],UV=[],I=[];
  for(let ring=0;ring<=rings;ring++){
   const r=Math.sin(ring/rings*Math.PI/2);
   for(const p of boundary){
    const x=320+(p.x-320)*r,y=255+(p.y-255)*r,values=shapes.map(s=>height(s,x,y,back)).filter(v=>v!==null);
    let z=values.length?values.reduce((a,b)=>back?-blend(-a,-b):blend(a,b)):(back?-1:1)*.08*Math.sqrt(1-r*r);
    if(ring===rings)z=0;
    P.push((x-320)*.005,(255-y)*.005,z);UV.push(x/640,y/640);
   }
  }
  for(let ring=0;ring<rings;ring++)for(let i=0;i<samples;i++){
   const a=ring*samples+i,b=ring*samples+(i+1)%samples,c=a+samples,d=b+samples;
   if(back){if(ring)I.push(a,d,b);I.push(a,c,d);}else{if(ring)I.push(a,b,d);I.push(a,d,c);}
  }
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(UV,2));g.setIndex(I);g.computeVertexNormals();
  // Pixel-space contour is clockwise, while model Y points upwards.
  if((g.attributes.normal.getZ(samples*4)>0)===back){const ix=g.index.array;for(let i=0;i<ix.length;i+=3)[ix[i+1],ix[i+2]]=[ix[i+2],ix[i+1]];g.computeVertexNormals();}
  if(back){const mesh=new THREE.Mesh(g,fur);mesh.name='HoodBack';head.add(mesh);}else artworkSurface('Hood',g,head,rings);
 }
 // Shared boundary/center vertices get one smooth normal across both halves.
 const meshes=['HoodSurface','HoodBack'].map(n=>head.getObjectByName(n)),buckets=new Map();
 for(const m of meshes){const p=m.geometry.attributes.position,n=m.geometry.attributes.normal;for(let i=0;i<p.count;i++){const key=[p.getX(i),p.getY(i),p.getZ(i)].map(v=>Math.round(v*1e6)).join(',');if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push([n,i]);}}
 for(const group of buckets.values())if(group.length>1){const sum=new THREE.Vector3();for(const[n,i]of group)sum.add(new THREE.Vector3().fromBufferAttribute(n,i));sum.normalize();for(const[n,i]of group)n.setXYZ(i,sum.x,sum.y,sum.z);}
 head.getObjectByName('HoodArtwork').geometry.setAttribute('normal',meshes[0].geometry.attributes.normal.clone());
};
