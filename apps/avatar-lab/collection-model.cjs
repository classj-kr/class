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
    const geometry=k.geometry(positions,indices);const shell=k.mesh(part.name+"Solid",geometry,solid,group);
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
  const torso=parts.get("Torso"),head=parts.get("Head");
  if(torso&&head){
    k.ellipsoid("NeckJoin",[Math.min(.22,profile.armHalf*.003),.10,.16],torso.solid,k.body,[(profile.cx-320)*.005,(580-profile.neck)*.005,-.025]);
  }
  if(parts.has("Tail")&&torso){
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
    const P=[],I=[],ray=new THREE.Raycaster();
    for(const [x,y] of [[cx,cy],...outline]){ray.set(new THREE.Vector3((x-target.part.pivot[0])*.005,(target.part.pivot[1]-y)*.005,-5),new THREE.Vector3(0,0,1));const hit=ray.intersectObject(carrier)[0];if(!hit){carrier.material.dispose();return;}P.push(hit.point.x,hit.point.y,hit.point.z-.004);}
    for(let i=1;i<=outline.length;i++)I.push(0,i,i===outline.length?1:i+1);
    const g=k.geometry(P,I);if(g.attributes.normal.getZ(0)>0){for(let i=0;i<I.length;i+=3)[I[i+1],I[i+2]]=[I[i+2],I[i+1]];g.setIndex(I);g.computeVertexNormals();}
    k.mesh(name,g,k.solid(name+"Paint",color),target.group);carrier.material.dispose();
  }
  function dot(target,name,x,y,r,color,n=16){patch(target,name,Array.from({length:n},(_,i)=>[x+Math.cos(i/n*Math.PI*2)*r,y+Math.sin(i/n*Math.PI*2)*r]),color);}
  if(head&&profile.pattern){
    const top=head.part.bounds[1],bottom=Math.min(profile.neck,head.part.bounds[3]),height=bottom-top,cx=profile.cx;
    const pattern=profile.pattern;
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
    result=k.finish({holdLeft:profile.holdArms,authoring:"Individually traced closed costume parts, original unchanged artwork, anatomy-specific profile and grounded stride"});
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
    k.root.userData={walkStride:.4,walkDuration:1.8};require("./illustration-materials.cjs")(THREE,k.root);result={root:k.root,clips};
  }
  // Wings stay attached at their original shoulder points and flap mildly.
  for(const clip of result.clips)if(clip.name==="Walk")for(const name of ["LeftWing","RightWing"]){
    if(!parts.has(name))continue;const times=Array.from({length:49},(_,i)=>i/48*clip.duration),values=[];
    for(let i=0;i<49;i++)values.push(...new THREE.Quaternion().setFromEuler(new THREE.Euler(0,Math.sin(i/48*Math.PI*4)*.10*(name==="LeftWing"?1:-1),0)).toArray());
    clip.tracks.push(new THREE.QuaternionKeyframeTrack(name+".quaternion",times,values));
  }
  Object.assign(result.root.userData,{avatarKey:id+".webp",prototype:true,revision:profile.revision,collection:true,shape:profile.shape,locomotion:profile.motion,canWave:profile.motion==="walk"&&!profile.holdArms,sourceChecksum:source.checksum});
  return result;
};
