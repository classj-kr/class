"use strict";
module.exports=function(T,k,id,head){
 if(id!=='food-birthday-cake')return;
 const parent=head.group,cake=parent.getObjectByName('CakeSolid');
 for(const o of [...parent.children])if(o.name.startsWith('RearCakeOutline'))parent.remove(o);
 const profile=[[.025,0],[.025,.45],[.06,.78],[.15,.99],[.23,1.025],[.45,1.035],[.80,1.045],[1.02,1.07],[1.08,1.055],[1.10,1.01],[1.10,.87],[1.13,.80],[1.42,.80],[1.78,.82],[1.84,.855],[1.90,.85],[1.94,.81]];
 const radius=y=>{for(let i=1;i<profile.length;i++){const a=profile[i-1],b=profile[i];if(y<=b[0]&&b[0]>a[0]){const t=(y-a[0])/(b[0]-a[0]);return a[1]+(b[1]-a[1])*t;}}return .81;};
 const colors={gold:'#f6d08d',pink:'#ed91ac',cream:'#fbdbe5',top:'#fff2f2',ink:'#9e6040'};
 const lower=a=>.93-.055*(1+Math.sin(a*11)),upper=a=>1.78-.050*(1+Math.sin(a*9));
 // Feature boundaries have their own continuous rings. A sparse grid
 // quantized frosting edges, and projected front lines smeared sideways.
 const bands=[
 [()=>.025,()=>.432,'gold'],[()=>.432,()=>.444,'ink'],[()=>.444,()=>.660,'pink'],[()=>.660,()=>.672,'ink'],
 [()=>.672,a=>lower(a)-.009,'gold'],[a=>lower(a)-.009,a=>lower(a)+.009,'ink'],[a=>lower(a)+.009,()=>1.075,'cream'],
 [()=>1.075,()=>1.10,'top'],[()=>1.10,()=>1.13,'top'],[()=>1.13,()=>1.54,'gold'],[()=>1.54,()=>1.55,'ink'],
 [()=>1.55,()=>1.65,'pink'],[()=>1.65,()=>1.66,'ink'],[()=>1.66,a=>upper(a)-.008,'gold'],
 [a=>upper(a)-.008,a=>upper(a)+.008,'ink'],[a=>upper(a)+.008,()=>1.90,'cream'],[()=>1.90,()=>1.94,'top']];
 const rings=[{y:()=>.025,r:()=>0,c:'gold'}];
 for(const [lo,hi,c]of bands)for(let j=0;j<=12;j++){const t=j/12;rings.push({y:a=>lo(a)*(1-t)+hi(a)*t,r:null,c});}
 rings.push({y:()=>1.94,r:()=>0,c:'top'});
 const P=[],C=[],I=[],n=160;
 for(const row of rings)for(let j=0;j<n;j++){
  const a=j/n*Math.PI*2,u=row.y(a),r=row.r?row.r(a):radius(u),x=Math.cos(a)*r;let z=Math.sin(a)*r,y=u-.29*z*Math.min(1,u/.85);
  if(z>0){const t=Math.hypot(x/.61,(y-1.165)/.50),fade=Math.max(0,Math.min(1,(1.38-t)/.34)),w=fade*fade*(3-2*fade);z+=(.99-.075*(x/.70)**2-z)*w;}
  P.push(x,y,z);const color=new T.Color(colors[row.c]).convertSRGBToLinear();C.push(color.r,color.g,color.b);
 }
 for(let row=0;row<rings.length-1;row++)for(let j=0;j<n;j++){const a=row*n+j,b=row*n+(j+1)%n,c=a+n,d=b+n;I.push(a,c,d,a,d,b);}
 cake.geometry.dispose();cake.geometry=k.geometry(P,I);cake.geometry.setAttribute('color',new T.Float32BufferAttribute(C,3));
 // Weld shading across coincident material boundary rings.
 const p=cake.geometry.attributes.position,norm=cake.geometry.attributes.normal,groups=new Map();
 for(let i=0;i<p.count;i++){const key=[p.getX(i),p.getY(i),p.getZ(i)].map(v=>Math.round(v*1e6)).join(',');if(!groups.has(key))groups.set(key,[]);groups.get(key).push(i);}
 for(const ids of groups.values()){const v=new T.Vector3();for(const i of ids)v.add(new T.Vector3().fromBufferAttribute(norm,i));v.normalize();for(const i of ids)norm.setXYZ(i,v.x,v.y,v.z);}
 cake.material.userData.preserveVertexColor=true;cake.userData.skipOriginalPaint=true;parent.userData.artworkOpaqueRegions=[];
 k.projectArtwork('OriginalFace',k.ellipse(320,350,116,95),[320,350],head.part.pivot,parent,cake,{samples:144,rings:32,offset:.006});
 const ink=require('./solid-ink-shell.cjs');ink(T,k,cake,'#95613f',.018);
 for(let i=0;i<3;i++){const candle=parent.getObjectByName('Candle'+i);candle.material.color.set(i===1?'#ed7398':'#3bb5f2').convertSRGBToLinear();ink(T,k,candle,i===1?'#934058':'#365d73',.014);}
};
