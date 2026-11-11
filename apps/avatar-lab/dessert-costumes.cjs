"use strict";

// Closed food containers with measured silhouettes and continuous face support.
// Top surfaces are slightly pitched, as in the illustrations, without turning
// the complete avatar into a thin extrusion of the front picture.
module.exports=function desserts(T,k,id,parts){
 if(!['drink-bubble-tea','food-bingsu','food-birthday-cake'].includes(id))return false;
 const head=parts.get('Head'),g=head.group;g.clear();const offset=g.position.clone();
 const local=p=>p.map((v,i)=>v-offset.getComponent(i));
 const mesh=(name,geo,color,p=[0,0,0])=>k.mesh(name,geo,k.solid(name+'Color',color),g,local(p));
 function lathe(name,profile,color,transform){
  const steps=name==='CakeSolid'?12:name==='ShavedIceSolid'?16:4,pts=[];for(let i=0;i<profile.length-1;i++)for(let j=0;j<steps;j++){const t=j/steps;pts.push(new T.Vector2(profile[i][0]*(1-t)+profile[i+1][0]*t,profile[i][1]*(1-t)+profile[i+1][1]*t));}pts.push(new T.Vector2(...profile.at(-1)));
  const geo=new T.LatheGeometry(pts,96),p=geo.attributes.position;
  if(transform)for(let i=0;i<p.count;i++){const v=new T.Vector3().fromBufferAttribute(p,i);transform(v);p.setXYZ(i,v.x,v.y,v.z);}geo.computeVertexNormals();
  return mesh(name,geo,color);
 }
 function ellipsoid(name,p,size,color,rotation=0){const small=Math.max(...size)<.12,m=mesh(name,new T.SphereGeometry(1,small?20:32,small?12:20),color,p);m.scale.set(...size);m.rotation.z=rotation;return m;}
 function ring(name,r,t,y,color,tilt=0){const geo=new T.TorusGeometry(r,t,10,96);geo.rotateX(Math.PI/2);const p=geo.attributes.position;for(let i=0;i<p.count;i++)p.setY(i,p.getY(i)-tilt*p.getZ(i));geo.computeVertexNormals();return mesh(name,geo,color,[0,y,0]);}
 function face(cx,cy,rx,ry,target){return k.projectArtwork('OriginalFace',k.ellipse(cx,cy,rx,ry),[cx,cy],head.part.pivot,g,target,{samples:144,rings:32,offset:.009});}
 function paintOnlyRear(o){o.userData.skipOriginalPaint=true;return o;}
 function frontHit(target,x,y){target.updateWorldMatrix(true,false);const ray=new T.Raycaster(new T.Vector3(x,y,5),new T.Vector3(0,0,-1));return ray.intersectObject(target)[0]?.point.z;}
 if(id==='drink-bubble-tea'){
  const cup=lathe('CupSolid',[[0,.02],[.37,.02],[.50,.06],[.54,.12],[.56,.35],[.60,.78],[.65,1.24],[.72,1.80],[.75,1.88],[0,1.88],[0,.02]],'#d8b28a',p=>{p.y-=.22*p.z*Math.min(1,p.y/1.8);});
  const lid=lathe('LidSolid',[[0,1.86],[.77,1.86],[.81,1.89],[.82,1.96],[.79,2.00],[0,2.00],[0,1.86]],'#b8dce8',p=>{p.y-=.22*p.z;});
  paintOnlyRear(ring('LidOuterInk',.821,.010,1.947,'#668a97',.22));
  // Molded rolled edge and inset top continue around the full tilted lid.
  // The upward-facing disk cannot inherit the illustrated ellipse by front projection.
  lid.userData.skipOriginalPaint=true;
  paintOnlyRear(ring('LidTopOutline',.790,.012,1.998,'#345b6c',.22));
  paintOnlyRear(ring('LidLowerOutline',.784,.011,1.865,'#345b6c',.22));
  paintOnlyRear(lathe('LidTopInset',[[0,1.997],[.69,1.997],[.73,1.997],[.74,2.006],[.73,2.012],[.69,2.013],[0,2.013],[0,1.997]],'#a9cfdf',p=>{p.y-=.22*p.z;}));
  paintOnlyRear(ring('LidPaleLip',.757,.020,2.007,'#d9eef5',.22));
  const straw=mesh('StrawSolid',new T.CylinderGeometry(.10,.10,.57,48,16),'#df858c',[.46,2.29,-.08]);straw.rotation.z=-.20;
  const top=ellipsoid('StrawTop',[.517,2.571,-.08],[.10,.016,.10],'#a65860',-.20);top.userData.skipOriginalPaint=true;
  face(320,329,100,81,cup);
  // The reference already contains the front pearls. Model the continuation
  // only around the rear, so the front is not doubled or covered in speckles.
  for(let row=0;row<3;row++)for(let i=0;i<(row===1?4:5);i++){
   const count=row===1?4:5,a=Math.PI/2+(i+.5)/count*Math.PI+.025*Math.sin(i*1.7+row*2.3),y=.16+row*.20+.016*Math.sin(i*2.1+row),direction=new T.Vector3(Math.sin(a),0,Math.cos(a));
   cup.updateWorldMatrix(true,false);const ray=new T.Raycaster(new T.Vector3(direction.x*2,y,direction.z*2),direction.clone().negate()),hit=ray.intersectObject(cup)[0];if(!hit)continue;
   const p=hit.point.clone().addScaledVector(direction,.006),size=.071+.006*((i+row)%3),pearl=ellipsoid('RearPearl'+row+'_'+i,p.toArray(),[size,size,.025],'#5b382a');
   pearl.rotation.y=a;paintOnlyRear(pearl);
   const highlight=p.clone().addScaledVector(direction,.025);highlight.y+=.020;highlight.x-=Math.cos(a)*.018;highlight.z+=Math.sin(a)*.018;
   const glint=ellipsoid('PearlGlint'+row+'_'+i,highlight.toArray(),[.022,.022,.004],'#96674e');glint.rotation.y=a;paintOnlyRear(glint);
  }
 }
 if(id==='food-bingsu'){
  const bowl=lathe('BingsuBowlSolid',[[0,.14],[.24,.14],[.37,.20],[.52,.33],[.65,.49],[.76,.69],[.82,.87],[.81,.92],[.77,.92],[.72,.74],[.60,.53],[.43,.35],[0,.28],[0,.14]],'#acd3e5',p=>{p.y-=.18*p.z*Math.min(1,p.y/.87);});
  lathe('BingsuFootSolid',[[0,.015],[.21,.015],[.32,.055],[.34,.085],[.30,.12],[.17,.18],[.17,.23],[0,.23],[0,.015]],'#b6dbe9');
  ring('BowlRim',.795,.022,.91,'#719eae',.18);
  const ice=lathe('ShavedIceSolid',[[0,.68],[.65,.71],[.74,.83],[.78,.91],[.79,1.00],[.73,1.16],[.64,1.36],[.55,1.57],[.46,1.77],[.31,1.97],[.16,2.06],[0,2.08],[0,.68]],'#f1f8fc',p=>{p.y-=.18*p.z*Math.max(0,Math.min(1,(1.50-p.y)/.50));});
  const icePositions=ice.geometry.attributes.position;for(let j=0;j<icePositions.count;j++){const y=icePositions.getY(j);if(y>1.70)icePositions.setY(j,1.70+(y-1.70)*.20);const x=icePositions.getX(j),z=icePositions.getZ(j),r=Math.hypot(x,z),a=Math.atan2(z,x),fade=Math.max(0,Math.min(1,(y-1.05)/.12,(1.85-y)/.12)),bump=.009*(.5+.22*Math.cos(y*39+a*13)+.28*Math.cos(y*53-a*9))*fade;if(r>.05){icePositions.setX(j,x*(1+bump/r));icePositions.setZ(j,z*(1+bump/r));}}ice.geometry.computeVertexNormals();
  const topping=lathe('RedBeanMoundSolid',[[0,1.62],[.42,1.62],[.48,1.69],[.46,1.80],[.34,1.94],[.18,2.035],[0,2.055],[0,1.62]],'#7f3e3f');
  topping.userData.skipOriginalPaint=true;
  for(const [i,px,py,rx,ry,ang] of [[0,236,238,20,14,-.5],[1,271,251,25,14,0],[2,320,249,26,16,.3],[3,356,252,18,22,-.7],[4,394,237,22,14,.4],[5,273,220,25,15,-.3],[6,310,231,26,15,.3],[7,350,223,26,16,-.3],[8,382,212,22,13,.4],[9,252,208,19,12,-.6],[10,280,193,17,20,-.3],[11,312,179,27,14,-.3],[12,322,202,25,14,-.1],[13,351,191,19,15,.5]]){
   const x=(px-320)*.005,y=(580-py)*.005,z=frontHit(topping,x,y)??frontHit(ice,x,y);if(z===undefined)continue;
   ellipsoid('FrontBean'+i,[x,y,z+.012],[rx*.005,ry*.005,.06],'#864442',ang);
  }
  for(let i=0;i<19;i++){
   const a=Math.PI+i/18*Math.PI,r=.10+.31*(i%5)/4,x=Math.cos(a)*r,z=Math.sin(a)*r;
   const ray=new T.Raycaster(new T.Vector3(x,4,z),new T.Vector3(0,-1,0));topping.updateWorldMatrix(true,false);const hit=ray.intersectObject(topping)[0];if(!hit)continue;
   const bean=ellipsoid('RearBean'+i,[x,hit.point.y+.025,z],[.095,.04,.075],i%3?'#854340':'#99534a');bean.rotation.y=a;paintOnlyRear(bean);
  }
  for(let i=0;i<9;i++){const a=Math.PI+(i+.5)/9*Math.PI,bean=ellipsoid('RearBeanEdge'+i,[Math.cos(a)*.447,1.69+.012*Math.sin(i*2.1),Math.sin(a)*.447],[.10,.065,.075],'#89423e');bean.rotation.y=-a;bean.rotation.z=.22*Math.sin(i*1.7);paintOnlyRear(bean);}
  // Use actual beans on the rear face too; top-only beads left a flat red wall.
  for(const o of [...g.children])if(/^RearBean/.test(o.name))g.remove(o);
  for(const front of [...g.children].filter(o=>/^FrontBean\d+$/.test(o.name))){
   const bean=front.clone();bean.name=front.name.replace('FrontBean','RearFacingBean');bean.position.z=-front.position.z-2*offset.z;bean.material=k.solid(bean.name+'Color','#944b47');bean.userData.skipOriginalPaint=true;g.add(bean);
   const P=[],I=[],n=24,rings=6;for(let r=0;r<=rings;r++)for(let j=0;j<n;j++){const a=j/n*Math.PI*2,u=-.25+Math.cos(a)*.24*r/rings,v=.35+Math.sin(a)*.16*r/rings;P.push(u,v,-Math.sqrt(Math.max(0,1-u*u-v*v))-.006);}
   for(let r=0;r<rings;r++)for(let j=0;j<n;j++){const a=r*n+j,b=r*n+(j+1)%n,c=a+n,d=b+n;I.push(a,b,d,a,d,c);}
   const glint=k.mesh(bean.name+'Glint',k.geometry(P,I),k.solid(bean.name+'GlintColor','#c78073'),bean);glint.userData.skipOriginalPaint=true;
  }
  for(let row=0;row<2;row++)for(let j=0;j<9;j++){
   const a=Math.PI+(j+.5)/9*Math.PI,y=1.76+row*.17,dir=new T.Vector3(Math.cos(a),0,Math.sin(a));
   const hit=new T.Raycaster(new T.Vector3(dir.x*2,y,dir.z*2),dir.clone().negate()).intersectObject(topping)[0];if(!hit)continue;
   const pos=hit.point.clone().addScaledVector(dir,-.018),bean=ellipsoid('SideBean'+row+'_'+j,pos.toArray(),[.095,.066,.070],j%2?'#914640':'#a3544a');bean.rotation.y=Math.atan2(dir.x,dir.z);paintOnlyRear(bean);
   const P=[],I=[],n=20,rings=5;for(let r=0;r<=rings;r++)for(let t=0;t<n;t++){const angle=t/n*Math.PI*2,u=-.25+Math.cos(angle)*.24*r/rings,v=.35+Math.sin(angle)*.16*r/rings;P.push(u,v,Math.sqrt(Math.max(0,1-u*u-v*v))+.006);}
   for(let r=0;r<rings;r++)for(let j=0;j<n;j++){const a=r*n+j,b=r*n+(j+1)%n,c=a+n,d=b+n;I.push(a,d,b,a,c,d);}
   const glint=k.mesh(bean.name+'Glint',k.geometry(P,I),k.solid(bean.name+'GlintColor','#c78073'),bean);paintOnlyRear(glint);
  }
  for(const o of [...g.children])if(/^(FrontBean|RearFacingBean|SideBean)/.test(o.name)&&o.isMesh)require('./solid-ink-shell.cjs')(T,k,o,'#64332e',.004);
  g.updateWorldMatrix(true,true);
  for(const bean of [...g.children])if(/^(RearFacingBean|SideBean)/.test(bean.name))for(const child of [...bean.children])g.attach(child);
  face(318,356,93,76,ice);
  for(const o of [ice,bowl,g.getObjectByName('BingsuFootSolid')])require('./solid-ink-shell.cjs')(T,k,o,o===ice?'#91adbb':'#4c778b',.012);
 }
 if(id==='food-birthday-cake'){
  const profile=[[0,.025],[.45,.025],[.78,.06],[.99,.15],[1.025,.23],[1.035,.45],[1.045,.80],[1.07,1.02],[1.055,1.08],[1.01,1.10],[.87,1.10],[.80,1.13],[.80,1.42],[.82,1.78],[.855,1.84],[.85,1.90],[.81,1.94],[.60,1.94],[.30,1.94],[0,1.94],[0,.025]];
  const cake=lathe('CakeSolid',profile,'#ffffff',p=>{
   const originalY=p.y,tilt=.29*Math.min(1,originalY/.85);p.y-=tilt*p.z;
   if(p.z>0){const t=Math.sqrt((p.x/.61)**2+((p.y-1.165)/.50)**2),fade=Math.max(0,Math.min(1,(1.38-t)/.34)),w=fade*fade*(3-2*fade);p.z+=(.99-.075*(p.x/.70)**2-p.z)*w;}
  });
  const p=cake.geometry.attributes.position,colors=[];
  for(let i=0;i<p.count;i++){
   const x=p.getX(i),y=p.getY(i),z=p.getZ(i),a=Math.atan2(z,x),tier=y+.29*z>1.13,top=tier?1.94:1.10,localY=y+.29*z;
   const drip=top-.08-.045*(1+Math.sin(a*(tier?9:11))),c=new T.Color(localY>top-.035?'#fff4f0':localY>drip?'#fae1e4':Math.abs(localY-(tier?1.64:.70))<(tier?.055:.065)?'#ee9cad':'#f6d08d').convertSRGBToLinear();colors.push(c.r,c.g,c.b);
  }
  cake.geometry.setAttribute('color',new T.Float32BufferAttribute(colors,3));cake.material.userData.preserveVertexColor=true;cake.userData.artworkCylindrical=true;
  // Paint the face on this continuous dense shell itself. A second oval
  // overlay produced a dark, jagged double edge along the cheeks and chin.
  g.userData.artworkOpaqueRegions=[{cx:320,cy:347,rx:116,ry:94}];
  // The top is clean cream, not a projection of the old candle bases.
  cake.userData.artworkMinY=236;
  // Continue the illustrated icing and filling outlines around the rear.
  for(const tier of [false,true])for(const line of ['icing','upper-band','lower-band']){
   const ps=[];for(let j=0;j<=72;j++){
    const a=Math.PI+j/72*Math.PI,top=tier?1.94:1.10,cy=line==='icing'?top-.08-.045*(1+Math.sin(a*(tier?9:11))):(tier?1.64:.70)+(line==='upper-band'?1:-1)*(tier?.055:.065);
    let r=0;for(let n=1;n<profile.length;n++)if(cy>=profile[n-1][1]&&cy<=profile[n][1]&&profile[n][1]>profile[n-1][1]){const t=(cy-profile[n-1][1])/(profile[n][1]-profile[n-1][1]);r=profile[n-1][0]+(profile[n][0]-profile[n-1][0])*t;break;}
    r+=.007;const x=Math.cos(a)*r,z=Math.sin(a)*r;ps.push(local([x,cy-.29*z,z]));
   }
   paintOnlyRear(k.tube('RearCakeOutline'+tier+line,ps,.008,k.solid('CakeOutline','#a56958'),g));
  }
  for(let i=0;i<3;i++){
   const x=(i-1)*.425,y=i===1?2.035:2.09,z=-.02;
   const candle=mesh('Candle'+i,new T.CylinderGeometry(.078,.078,.38,32,16),i===1?'#dc8190':'#8dbfd2',[x,y,z]);paintOnlyRear(candle);
   paintOnlyRear(mesh('CandleWick'+i,new T.CylinderGeometry(.007,.007,.025,12),'#73513e',[x,y+.195,z]));
   for(let j=0;j<3;j++){
    const ps=[];for(let t=0;t<=40;t++){const a=t/40*Math.PI*2;ps.push(local([x+Math.sin(a)*.079,y-.18+j*.12+t/40*.12,z+Math.cos(a)*.079]));}
    const stripe=k.tube('CandleStripe'+i+'_'+j,ps,.024,k.solid('WaxStripe',i===1?'#f3b9bf':'#d3e8ed'),g);paintOnlyRear(stripe);
   }
   const flame=lathe('Flame'+i,[[0,0],[.05,.012],[.085,.065],[.09,.12],[.065,.20],[.035,.25],[0,.32]],'#f5ad43');
   // character-effects replaces this marker with its single animated flame.
   flame.position.add(new T.Vector3(x,y+.345,z));paintOnlyRear(flame);
  }
 }
 require('./finish-cake-colors.cjs')(T,k,id,head);
 require('./project-model-artwork.cjs')(T,k,g,head.part.pivot);
 require('./finish-bingsu-artwork.cjs')(id,head);
 head.special=true;return true;
};
