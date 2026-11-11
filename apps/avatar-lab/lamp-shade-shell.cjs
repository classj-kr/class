"use strict";
// Cut the actual cone with the face opening; a single displaced lower ring
// made an angular notch and large, twisted triangles around the cheeks.
module.exports=function(T,k,head){
 const g=head.group,s=require('./sculpt-kit.cjs')(T,k,head),old=g.getObjectByName('LampShadeSolid');g.remove(old);g.remove(g.getObjectByName('LampBottomRim'));g.remove(g.getObjectByName('LampInternalCrossbarSolid'));
 const N=128,M=64,vertices=[],uvs=[],faces=[],map=new Map();
 const point=(u,v,inner=false)=>{const a=u*Math.PI*2,r=103+92*v-(inner?7:0),d=.49+.40*v-(inner?.035:0);return[320+Math.sin(a)*r,78+248*v+Math.cos(a)*(16+14*v),Math.cos(a)*d];};
 const value=q=>{const p=point(...q);return p[2]<0?2:((p[0]-320)/108)**2+((p[1]-333)/88)**2-1;};
 const index=q=>{const u=Math.abs(q[0]-1)<1e-8?0:q[0],key=[u,q[1]].map(v=>Math.round(v*1e9)).join(',');if(!map.has(key)){map.set(key,vertices.length);vertices.push(point(u,q[1]));uvs.push([u,q[1]]);}return map.get(key);};
 function triangle(ps){const poly=[];for(let j=0;j<3;j++){const a=ps[j],b=ps[(j+1)%3],fa=value(a),fb=value(b);if(fa>=0)poly.push(a);if((fa>=0)!==(fb>=0)){let lo=0,hi=1;for(let n=0;n<28;n++){const t=(lo+hi)/2,q=a.map((v,i)=>v+(b[i]-v)*t);if((value(q)>=0)===(fa>=0))lo=t;else hi=t;}const t=(lo+hi)/2;poly.push(a.map((v,i)=>v+(b[i]-v)*t));}}for(let j=1;j+1<poly.length;j++)faces.push(index(poly[0]),index(poly[j]),index(poly[j+1]));}
 for(let j=0;j<M;j++)for(let i=0;i<N;i++){const a=[i/N,j/M],b=[(i+1)/N,j/M],c=[i/N,(j+1)/M],d=[(i+1)/N,(j+1)/M];triangle([a,d,b]);triangle([a,c,d]);}
 const P=vertices.flatMap(p=>s.point(p)),I=[...faces],count=vertices.length;for(const q of uvs)P.push(...s.point(point(...q,true)));
 for(let i=0;i<faces.length;i+=3)I.push(faces[i]+count,faces[i+2]+count,faces[i+1]+count);
 const edges=new Map();for(let i=0;i<faces.length;i+=3)for(let j=0;j<3;j++){const a=faces[i+j],b=faces[i+(j+1)%3],key=[a,b].sort((x,y)=>x-y).join(',');if(edges.has(key))edges.get(key).count++;else edges.set(key,{a,b,count:1});}
 for(const {a,b,count:n} of edges.values())if(n===1)I.push(b,a,a+count,b,a+count,b+count);
 const mesh=k.mesh('LampShadeSolid',k.geometry(P,I),k.solid('LampShadeColor','#ffd16b'),g);mesh.userData.artworkExcludedRegions=[{cx:320,cy:333,rx:108,ry:88}];mesh.userData.artworkFacingFade=[.35,.70];
 // A small closed brown top retains the source's oval finish and hides the
 // internal support in front views while remaining attached to the shell.
 const capP=[],capI=[];for(const layer of [-.012,.012]){capP.push(...s.point([320,78,0]).map((v,n)=>v+(n===1?layer:0)));for(let i=0;i<N;i++){const p=point(i/N,0);capP.push(...s.point(p).map((v,n)=>v+(n===1?layer:0)));}}
 for(let i=0;i<N;i++){const a=1+i,b=1+(i+1)%N,c=a+N+1,d=b+N+1;capI.push(0,b,a,N+1,c,d,a,b,d,a,d,c);}
 const cap=k.mesh('LampTopCapSolid',k.geometry(capP,capI),k.solid('LampTopCapColor','#efb54d'),g);cap.userData.skipOriginalPaint=true;
 // The lower hem stops at the face opening; it never crosses the eyes.
 let segment=[],n=0;const flush=()=>{if(segment.length>1){const o=s.tube('LampHem'+n++,segment,.009,'#9e602b');o.userData.skipOriginalPaint=true;}segment=[];};
 for(let i=0;i<=N;i++){if(value([i/N,1])>=0)segment.push(point(i/N,1));else flush();}flush();
 return mesh;
};
