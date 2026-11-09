"use strict";
module.exports=function airplaneCostume(T){
 const k=require('./model-kit.cjs')(T,'vehicle-airplane'),sculpt=require('./sculpt-kit.cjs'),shells=[];
 function part(name,pivot){const group=k.group(name,pivot),s=sculpt(T,k,{group,part:{pivot}});group.userData.directSurfaceArtwork=true;group.userData.artworkOcclusion=true;return s;}
 function volume(s,name,ps,c,front,back,color,z=0){
  const area=(Math.max(...ps.map(p=>p[0]))-Math.min(...ps.map(p=>p[0])))*(Math.max(...ps.map(p=>p[1]))-Math.min(...ps.map(p=>p[1])));
  k.volume(name+'Half',ps,c,s.pivot,front,back,s.parent,k.solid(name+'Color',color),{art:false,z,samples:area>50000?96:area>14000?64:48});const P=[],I=[];
  for(const suffix of ['Surface','Back']){const o=s.parent.getObjectByName(name+'Half'+suffix),n=P.length/3;P.push(...o.geometry.attributes.position.array);I.push(...Array.from(o.geometry.index.array,j=>j+n));s.parent.remove(o);}
  const g=k.geometry(P,I),pos=g.attributes.position,norm=g.attributes.normal,buckets=new Map();
  for(let i=0;i<pos.count;i++){const key=[pos.getX(i),pos.getY(i),pos.getZ(i)].map(v=>Math.round(v*1e5)).join(',');if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(i);}
  for(const indices of buckets.values()){const n=new T.Vector3();for(const i of indices)n.add(new T.Vector3().fromBufferAttribute(norm,i));n.normalize();for(const i of indices)norm.setXYZ(i,n.x,n.y,n.z);}
  const o=k.mesh(name,g,k.solid(name+'Color',color),s.parent);o.userData.artworkFacingFade=[.15,.5];o.userData.sourceContour=ps;shells.push([o,s]);return o;
 }
 const white='#f6edef',head=part('Head',[320,270]);head.parent.userData.artworkOpaqueRegions=[{cx:318,cy:297,rx:112,ry:88}];
 const hood=volume(head,'AirplaneRoundedFuselageSolid',[[317,120],[360,126],[400,147],[432,180],[453,220],[463,268],[457,315],[439,354],[412,382],[372,402],[319,411],[268,403],[225,382],[195,353],[178,314],[173,270],[181,226],[202,184],[233,149],[274,127]],[318,269],.70,1.12,white);
 // Wings have their original broad, rounded front silhouette and a swept
 // rear edge in depth. They enter the fuselage instead of abutting it.
 for(const side of [-1,1]){
  const mirror=ps=>ps.map(([x,y])=>[320+side*(320-x),y]);
  const wing=volume(head,'AirplaneWing'+side+'Solid',mirror([[202,237],[154,239],[102,245],[64,256],[46,271],[51,287],[74,301],[110,314],[156,326],[205,335]]),[320+side*185,283],.12,.19,white,-.35);
  const p=wing.geometry.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i)/.005+320;p.setZ(i,p.getZ(i)-.20*Math.min(1,Math.abs(x-320)/275));}wing.geometry.computeVertexNormals();
  wing.userData.artworkExcludedRegions=[{cx:320+side*186,cy:344,rx:41,ry:41}];
  const cx=320+side*186,cy=343,P=[],I=[],N=64;
  // Closed annular nacelle, not a painted black circle on a solid ball.
  const rings=[[39,-.56],[40,-.42],[39,.04],[34,.13],[26,.13],[24,.02],[25,-.48],[29,-.56]];
  for(const[r,z]of rings)for(let j=0;j<N;j++){const a=j/N*Math.PI*2;P.push((cx-320)*.005+Math.cos(a)*r*.005,(270-cy)*.005+Math.sin(a)*r*.005,z);}
  for(let row=0;row<rings.length;row++)for(let j=0;j<N;j++){const a=row*N+j,b=row*N+(j+1)%N,c=((row+1)%rings.length)*N+j,d=((row+1)%rings.length)*N+(j+1)%N;I.push(a,b,d,a,d,c);}
  let v=0;for(let j=0;j<I.length;j+=3)v+=new T.Vector3().fromArray(P,I[j]*3).dot(new T.Vector3().fromArray(P,I[j+1]*3).cross(new T.Vector3().fromArray(P,I[j+2]*3)));if(v<0)for(let j=0;j<I.length;j+=3)[I[j+1],I[j+2]]=[I[j+2],I[j+1]];
  const engine=k.mesh('AirplaneEngine'+side+'Solid',k.geometry(P,I),k.solid('AirplaneEngineGray','#c3b9c0'),head.parent);shells.push([engine,head]);engine.userData.artworkFacingFade=[.15,.5];
  head.ellipsoid('AirplaneIntakeRecess'+side,[cx,cy,-.15],[25,25,.08],'#534e57');
 }
 const tail=volume(head,'AirplaneTailFinSolid',[[286,215],[289,124],[302,82],[310,63],[318,59],[328,64],[336,85],[350,124],[350,215]],[318,142],.075,.075,white,-.91);
 tail.userData.skipOriginalPaint=true;
 // The rear tail root is concealed inside the fuselage, with two small
 // horizontal stabilizers visible in side/rear views.
 for(const side of [-1,1]){const fin=volume(head,'AirplaneRearStabilizer'+side+'Solid',[[320+side*15,239],[320+side*91,240],[320+side*108,258],[320+side*15,272]],[320+side*53,253],.055,.055,white,-.97);fin.userData.skipOriginalPaint=true;}
 head.paint();
 const torso=part('Torso',[318,444]);volume(torso,'AirplaneShortSuitSolid',[[267,392],[317,401],[369,392],[379,425],[383,458],[371,480],[345,489],[292,489],[266,480],[254,456],[256,423]],[318,445],.30,.30,white,-.08);torso.paint();
 for(const side of [-1,1]){
  const x=v=>320+side*(320-v),arm=part(side<0?'RightArm':'LeftArm',[x(270),415]);
  volume(arm,'AirplaneSleeve'+side+'Solid',[[254,392],[280,406],[270,427],[250,456],[244,468],[229,466],[220,457],[224,436],[237,412]].map(([a,b])=>[x(a),b]),[x(245),435],.14,.14,white,-.04);arm.paint();
  const leg=part(side<0?'RightLeg':'LeftLeg',[x(284),478]);
  volume(leg,'AirplaneBoot'+side+'Solid',[[268,468],[306,470],[306,491],[301,510],[289,516],[270,515],[263,508],[265,496]].map(([a,b])=>[x(a),b]),[x(284),493],.18,.18,white);leg.paint();
 }
 for(const[o,s]of shells){
  // Remove the source's outer ink from curved sides; the geometry's own
  // silhouette supplies one continuous line in every direction.
  const art=s.parent.getObjectByName(o.name+'OriginalPaint'),contour=o.userData.sourceContour;
  if(art&&contour){const boundary=new T.CatmullRomCurve3(contour.map(([x,y])=>new T.Vector3(x,y,0)),true,'centripetal').getSpacedPoints(160),p=art.geometry.attributes.position,c=art.geometry.attributes.color;
   for(let i=0;i<p.count;i++){const x=p.getX(i)/.005+s.pivot[0],y=s.pivot[1]-p.getY(i)/.005;let d=Infinity;for(let j=0;j<boundary.length-1;j++){const a=boundary[j],b=boundary[j+1],dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((x-a.x)*dx+(y-a.y)*dy)/(dx*dx+dy*dy)));d=Math.min(d,Math.hypot(x-a.x-t*dx,y-a.y-t*dy));}const t=Math.max(0,Math.min(1,(d-6)/12));c.setW(i,c.getW(i)*t*t*(3-2*t));}
  }
  o.updateMatrix();const g=o.geometry.clone().applyMatrix4(o.matrix),p=g.attributes.position,b=new T.Box3().setFromBufferAttribute(p),c=b.getCenter(new T.Vector3()),f=1+.022/(b.getSize(new T.Vector3()).length()/2),ix=Array.from(g.index.array);for(let i=0;i<p.count;i++)p.setXYZ(i,c.x+(p.getX(i)-c.x)*f,c.y+(p.getY(i)-c.y)*f,c.z+(p.getZ(i)-c.z)*f);for(let i=0;i<ix.length;i+=3)[ix[i+1],ix[i+2]]=[ix[i+2],ix[i+1]];g.setIndex(ix);g.computeVertexNormals();const ink=k.mesh(o.name+'InkShell',g,k.solid(o.name+'Ink','#67484b'),s.parent);ink.material.userData.alreadyShaded=true;}
 const result=k.finish({authoring:'Source-shaped airplane hood, swept wings, hollow nacelles, rear tail and short attached wearer'});Object.assign(result.root.userData,{locomotion:'walk',canWave:true});return result;
};
