"use strict";
const fs=require("node:fs"),path=require("node:path");

module.exports=function createCollectionAvatar(THREE,id){
  const source=JSON.parse(fs.readFileSync(path.resolve(__dirname,"../../outputs/avatar-lab/mesh-source",id+".json"),"utf8"));
  const profile=source.profile,k=require("./model-kit.cjs")(THREE,id),parts=new Map();
  function floats(base64){const b=Buffer.from(base64,"base64");return new Float32Array(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength));}
  function integers(base64){const b=Buffer.from(base64,"base64");return new Uint32Array(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength));}
  for(const part of source.parts){
    const points=floats(part.points),front=integers(part.indices),count=points.length/4,positions=[],uv=[],indices=[...front],alphas=[];
    const group=k.group(part.name,part.pivot,part.z),solid=k.solid(part.name+"Color",part.color);
    for(const back of [false,true])for(let i=0;i<count;i++){
      const x=points[i*4],y=points[i*4+1],depth=points[i*4+2];
      positions.push((x-part.pivot[0])*.005,(part.pivot[1]-y)*.005,back?-depth:depth);
      uv.push(x/640,y/640);if(!back)alphas.push(1,1,1,Math.min(1,points[i*4+3]/11));
    }
    for(let i=0;i<front.length;i+=3)indices.push(front[i]+count,front[i+2]+count,front[i+1]+count);
    const geometry=k.geometry(positions,indices);
    if(part.vertexColors){const colors=floats(part.vertexColors);geometry.setAttribute('color',new THREE.Float32BufferAttribute([...colors,...colors],3));solid.color.set(0xffffff);solid.userData.preserveVertexColor=true;}
    // Weld the shading at the closed rim as well as the positions. Separate
    // front/back normals used to make a dark zipper along the silhouette.
    const normals=geometry.attributes.normal;
    // The traced boundary follows individual alpha pixels. Average only the
    // shading normals across connected vertices so those pixels cannot form
    // alternating dark/light ribs on the flank of a smooth costume.
    const neighbours=Array.from({length:count*2},()=>new Set());
    for(let i=0;i<indices.length;i+=3)for(let j=0;j<3;j++){
      const a=indices[i+j],b=indices[i+(j+1)%3];neighbours[a].add(b);neighbours[b].add(a);
    }
    for(let i=0;i<count;i++)if(points[i*4+2]===0){neighbours[i].add(i+count);neighbours[i+count].add(i);}
    for(let pass=0;pass<3;pass++){
      const smooth=new Float32Array(normals.array.length);
      for(let i=0;i<count*2;i++){
        const n=new THREE.Vector3().fromBufferAttribute(normals,i).multiplyScalar(2);
        for(const j of neighbours[i])n.add(new THREE.Vector3().fromBufferAttribute(normals,j));
        n.normalize();smooth.set(n.toArray(),i*3);
      }
      normals.array.set(smooth);
    }
    for(let i=0;i<count;i++)if(points[i*4+2]===0){const n=new THREE.Vector3().fromBufferAttribute(normals,i).add(new THREE.Vector3().fromBufferAttribute(normals,i+count)).normalize();normals.setXYZ(i,n.x,n.y,n.z);normals.setXYZ(i+count,n.x,n.y,n.z);}
    // A front illustration must fade before the surface turns sideways. A
    // distance-only mask dragged outline pixels over the flanks like a zipper.
    for(let i=0;i<count;i++){const t=Math.max(0,Math.min(1,(normals.getZ(i)-.18)/.52));alphas[i*4+3]*=t*t*(3-2*t);}
    const shell=k.mesh(part.name+"Solid",geometry,solid,group);
    const paint=k.geometry(positions.slice(0,count*3),[...front],uv.slice(0,count*2));paint.translate(0,0,.002);
    paint.setAttribute("color",new THREE.Float32BufferAttribute(alphas,4));const material=k.art.clone();material.vertexColors=true;material.transparent=true;material.alphaTest=0;material.depthWrite=false;
    k.mesh(part.name+"Artwork",paint,material,group);
    if(part.backArt){
      const backIndices=[];for(let i=0;i<front.length;i+=3)backIndices.push(front[i],front[i+2],front[i+1]);
      const back=k.geometry(positions.slice(count*3),backIndices,uv.slice(count*2));back.translate(0,0,-.002);
      k.mesh(part.name+"BackArtwork",back,k.art,group);
    }
    parts.set(part.name,{part,group,shell,solid,points});
  }
  require("./collection-specials.cjs")(THREE,k,id,parts);
  require("./animal-appendages.cjs")(THREE,k,id,parts);
  const characterEffects=require('./character-effects.cjs')(THREE,k,id);
  const torso=parts.get("Torso"),head=parts.get("Head");
  if(torso&&head){
    k.ellipsoid("NeckJoin",[Math.min(.22,profile.armHalf*.003),.10,.16],torso.solid,k.body,[(profile.cx-320)*.005,(580-profile.neck)*.005,-.025]);
  }
  if(parts.has("Tail")&&!parts.get('Tail').special&&torso){
    const tail=parts.get("Tail"),origin=[profile.cx+(profile.tail.side==="left"?-25:25),Math.min(530,profile.neck+65)];
    let nearest=null,best=Infinity;
    for(let i=0;i<tail.points.length;i+=4){const d=(tail.points[i]-origin[0])**2+(tail.points[i+1]-origin[1])**2;if(d<best){best=d;nearest=[tail.points[i],tail.points[i+1]];}}
    const a=[(origin[0]-320)*.005,(580-origin[1])*.005,-.10],b=[(nearest[0]-320)*.005,(580-nearest[1])*.005,tail.part.z];
    k.tube("TailJoin",[a,[(a[0]+b[0])/2,(a[1]+b[1])/2,-.16],b],.065,tail.solid,k.body);
  }
  // Back-side costume details never mirror a human face onto the rear.
  function patch(target,name,outline,color){
    if(!target)return;
    const carrier=new THREE.Mesh(target.shell.geometry,new THREE.MeshBasicMaterial({side:THREE.DoubleSide}));carrier.updateMatrixWorld(true);
    const cx=outline.reduce((s,p)=>s+p[0],0)/outline.length,cy=outline.reduce((s,p)=>s+p[1],0)/outline.length;
    const P=[],I=[],ray=new THREE.Raycaster(),n=outline.length,rings=12;
    for(let ring=0;ring<=rings;ring++)for(const [ex,ey] of outline){const x=cx+(ex-cx)*ring/rings,y=cy+(ey-cy)*ring/rings;ray.set(new THREE.Vector3((x-target.part.pivot[0])*.005,(target.part.pivot[1]-y)*.005,-5),new THREE.Vector3(0,0,1));const hit=ray.intersectObject(carrier)[0];if(!hit){carrier.material.dispose();return;}P.push(hit.point.x,hit.point.y,hit.point.z-.006);}
    for(let ring=0;ring<rings;ring++)for(let i=0;i<n;i++){const a=ring*n+i,b=ring*n+(i+1)%n,c=a+n,d=b+n;if(ring)I.push(a,d,b);I.push(a,c,d);}
    const g=k.geometry(P,I);if(g.attributes.normal.getZ(0)>0){for(let i=0;i<I.length;i+=3)[I[i+1],I[i+2]]=[I[i+2],I[i+1]];g.setIndex(I);g.computeVertexNormals();}
    k.mesh(name,g,k.solid(name+"Paint",color),target.group);carrier.material.dispose();
  }
  function dot(target,name,x,y,r,color,n=16){patch(target,name,Array.from({length:n},(_,i)=>[x+Math.cos(i/n*Math.PI*2)*r,y+Math.sin(i/n*Math.PI*2)*r]),color);}
  if(head&&(!head.special||head.acceptPattern)&&profile.pattern){
    const top=head.part.bounds[1],bottom=Math.min(profile.neck,head.part.bounds[3]),height=bottom-top,cx=profile.cx;
    const pattern=profile.pattern;
    if(pattern==='crested'){
      const stripe=[[218,98],[238,112],[250,147],[239,180],[257,216],[245,253],[259,288],[248,320],[226,351],[232,310],[219,275],[231,239],[214,198],[229,160],[210,129]];
      for(const side of [-1,1])patch(head,'CrestedOrangeStripe'+side,stripe.map(([x,y])=>[cx+side*(x-cx),y]),'#df933f');
      if(torso)for(const side of [-1,1])patch(torso,'CrestedBackFlame'+side,[[cx+side*45,profile.neck+12],[cx+side*34,profile.neck+34],[cx+side*48,profile.neck+48],[cx+side*27,profile.neck+69],[cx+side*35,profile.neck+47],[cx+side*23,profile.neck+33]],'#d98232');
    }
    if(pattern==='leopard'||pattern==='giraffe'){
      const markings=[[-76,.20,15],[4,.15,22],[78,.23,17],[-118,.34,19],[-35,.33,12],[44,.37,20],[112,.44,12],[-85,.50,15],[-3,.48,10],[-42,.63,18],[65,.60,16],[-110,.72,12],[20,.76,21],[98,.77,13],[-53,.85,13]];
      for(const [i,[dx,t,r]] of markings.entries()){
        const x=cx+dx,y=top+height*t,n=pattern==='giraffe'?7:16;
        const outline=Array.from({length:n},(_,j)=>{const a=j/n*Math.PI*2,f=1+.14*Math.sin(j*2.1+i*1.7);return[x+Math.cos(a)*r*f,y+Math.sin(a)*r*(pattern==='giraffe'?1.25:.87)*f];});
        patch(head,pattern+'Mark'+i,outline,pattern==='giraffe'?'#9e6b3e':'#815025');
        if(pattern==='leopard'&&i%3===1)dot(head,'LeopardSpotCenter'+i,x+2,y-1,r*.52,profile.headColor);
      }
    }
    if(["spots","seeds","pores","chips","grape","soccer","dice"].includes(pattern)){
      const colors={spots:"#765135",seeds:"#ffe1a0",pores:"#df8825",chips:"#694330",grape:"#643880",soccer:"#363537",dice:"#333337"};
      for(let row=0;row<4;row++)for(let col=0;col<4;col++){
        const x=cx-100+col*65+(row%2)*10+Math.sin(row*7+col*13)*13,y=top+height*.25+row*height*.17+Math.cos(row*11+col*3)*9;
        dot(head,"BackPattern"+row+"_"+col,x,y,pattern==="soccer"?25:pattern==="seeds"?4:pattern==="pores"?2.5:pattern==="dice"?12:12+(row+col)%3*3,colors[pattern],pattern==="soccer"?5:12);
      }
    }
    if(pattern==="stripes")for(let row=0;row<4;row++){
      const y=top+height*.38+row*height*.135;
      for(const side of [-1,1])patch(head,"BackStripe"+row+"_"+side,[[cx+side*42,y],[cx+side*135,y-9],[cx+side*142,y+10]],"#67594a");
    }
    if(pattern==="bee"&&torso)for(let row=0;row<3;row++)patch(torso,"AbdomenStripe"+row,[[cx-60,profile.neck+22+row*30],[cx+60,profile.neck+22+row*30],[cx+60,profile.neck+34+row*30],[cx-60,profile.neck+34+row*30]],"#433523");
    if(["melon","pineapple","corn","pumpkin","basketball","baseball","chocolate","scales"].includes(pattern)){
      const ink={melon:"#e5efb3",pineapple:"#ac8435",corn:"#e1a436",pumpkin:"#ca781e",basketball:"#4d3325",baseball:"#c4514e",chocolate:"#713a24",scales:"#b67934"}[pattern];
      for(let row=0;row<7;row++)for(let col=0;col<5;col++){
        const x=cx-125+col*60,y=top+height*.2+row*height*.10;
        if(pattern==="pumpkin"||pattern==="basketball")patch(head,"Seam"+row+"_"+col,[[x,y],[x+3,y],[x+3,y+height*.105],[x,y+height*.105]],ink);
        else if(pattern==="baseball") {if(col===1||col===3)patch(head,"Stitch"+row+"_"+col,[[x-7,y-2],[x+8,y+4],[x+7,y+7],[x-8,y+1]],ink);}
        else patch(head,"BackTile"+row+"_"+col,[[x,y],[x+25,y-7],[x+49,y],[x+25,y+7]],ink);
      }
    }
  }
  if(profile.pattern==="shell"&&torso){
    const shell=k.ellipsoid("TurtleShell",[.31,.35,.22],k.solid("TurtleShellGreen","#567f36"),torso.group,[0,0,-.22]);
    const rim=k.mesh("TurtleShellRim",new THREE.TorusGeometry(.29,.018,8,36),k.solid("TurtleShellRimColor","#d4bd63"),torso.group,[0,0,-.35]);rim.scale.y=1.12;
  }
  let result;
  if(profile.motion==="walk"){
    for(const name of ["LeftLeg","RightLeg"])if(!parts.has(name))throw new Error(id+" needs a visible "+name+" or a corrected anatomy profile");
    for(const name of ["LeftArm","RightArm"])if(!parts.has(name))k.group(name,[profile.cx+(name==="LeftArm"?-profile.armHalf:profile.armHalf),profile.neck+20]);
    result=k.finish({holdLeft:profile.holdArms,holdRight:profile.holdArms,authoring:"Authored costume and prop solids with source artwork, remaining traced limb drafts and grounded stride"});
  }else if(profile.shape==='snake'){
    result=require('./snake-motion.cjs')(THREE,k,id);
  }else if(profile.motion==='hop'){
    result=require('./hopping-motion.cjs')(THREE,k,id);
  }else{
    const clips=[],times=Array.from({length:49},(_,i)=>i/48*1.8);
    for(const name of ["Idle","Walk","Wave"]){
      const pos=[],quat=[];for(let i=0;i<49;i++){const phase=i/48*Math.PI*2,active=name!=="Idle";
        const lift=profile.motion==="float"?.07+(1-Math.cos(phase))*.025:profile.motion==="hop"&&active?Math.sin(phase*.5)**2*.075:0;
        pos.push(0,lift,0);quat.push(...new THREE.Quaternion().setFromEuler(new THREE.Euler(0,0,active?Math.sin(phase)*.018:0)).toArray());
      }
      clips.push(new THREE.AnimationClip(name,1.8,[new THREE.VectorKeyframeTrack("Body.position",times,pos),new THREE.QuaternionKeyframeTrack("Body.quaternion",times,quat)]));
    }
    k.root.updateMatrixWorld(true);k.root.position.y-=new THREE.Box3().setFromObject(k.root).min.y;
    for(const clip of clips){const track=clip.tracks.find(t=>t.name==='Body.position'),mix=new THREE.AnimationMixer(k.root);mix.clipAction(clip).play();for(let i=0;i<49;i++){mix.setTime(times[i]);k.root.updateMatrixWorld(true);const floor=new THREE.Box3().setFromObject(k.root).min.y;if(floor<0)track.values[i*3+1]-=floor;}mix.stopAllAction();k.body.position.set(0,0,0);k.body.quaternion.identity();}
    k.root.userData={walkStride:.4,walkDuration:1.8};require("./illustration-materials.cjs")(THREE,k.root);result={root:k.root,clips};
  }
  // Wings stay attached at their original shoulder points and flap mildly.
  for(const clip of result.clips)if(clip.name==="Walk")for(const name of ["LeftWing","RightWing"]){
    if(!parts.has(name))continue;const times=Array.from({length:49},(_,i)=>i/48*clip.duration),values=[];
    for(let i=0;i<49;i++)values.push(...new THREE.Quaternion().setFromEuler(new THREE.Euler(0,Math.sin(i/48*Math.PI*4)*.10*(name==="LeftWing"?1:-1),0)).toArray());
    clip.tracks.push(new THREE.QuaternionKeyframeTrack(name+".quaternion",times,values));
  }
  Object.assign(result.root.userData,{avatarKey:id+".webp",prototype:true,revision:profile.revision,collection:true,shape:profile.shape,locomotion:profile.motion,canWave:profile.motion==="walk"&&!profile.holdArms,sourceChecksum:source.checksum});
  if(characterEffects){result.clips.push(characterEffects);result.root.userData.effectClip=characterEffects.name;}
  return result;
};
