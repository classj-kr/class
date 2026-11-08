"use strict";

// Shared authoring tools, not a shared head shape. Every prop has its own mesh.
module.exports = function kit(THREE, key) {
  const root = new THREE.Group(); root.name = key;
  const body = new THREE.Group(); body.name = "Body"; root.add(body);
  const art = new THREE.MeshBasicMaterial({color:0xffffff,alphaTest:.4});
  art.name="OriginalArtwork";art.userData.originalTexture=true;art.toneMapped=false;
  const S=.005;
  function solid(name,color,roughness=.85){const m=new THREE.MeshStandardMaterial({color,roughness});m.color.convertSRGBToLinear();m.name=name;return m;}
  function mesh(name,geometry,material,parent=body,position=[0,0,0]){const m=new THREE.Mesh(geometry,material);m.name=name;m.position.set(...position);parent.add(m);return m;}
  function group(name,pixel,z=0){const g=new THREE.Group();g.name=name;g.position.set((pixel[0]-320)*S,(580-pixel[1])*S,z);body.add(g);return g;}
  function ellipsoid(name,size,material,parent,position=[0,0,0]){const m=mesh(name,new THREE.SphereGeometry(1,40,24),material,parent,position);m.scale.set(...size);return m;}
  function tube(name,points,radius,material,parent=body){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));return mesh(name,new THREE.TubeGeometry(curve,Math.max(24,Math.min(192,points.length*2)),radius,8,false),material,parent);}
  function geometry(positions,indices,uvs){const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute(positions,3));if(uvs)g.setAttribute("uv",new THREE.Float32BufferAttribute(uvs,2));g.setIndex(indices);g.computeVertexNormals();return g;}
  function volume(name,contour,center,pivot,frontDepth,backDepth,parent,material,options={}){
    const samples=options.samples||64,rings=12,z=options.z||0;
    const boundary=new THREE.CatmullRomCurve3(contour.map(([x,y])=>new THREE.Vector3(x,y,0)),true,"centripetal").getSpacedPoints(samples).slice(0,samples);
    for(const back of [false,true]){
      const positions=[],uv=[],indices=[];
      for(let ring=0;ring<=rings;ring++)for(const p of boundary){
        const a=ring/rings*Math.PI/2,r=Math.sin(a),x=center[0]+(p.x-center[0])*r,y=center[1]+(p.y-center[1])*r;
        positions.push((x-pivot[0])*S,(pivot[1]-y)*S,z+Math.cos(a)*(back?-backDepth:frontDepth));uv.push(x/640,y/640);
      }
      for(let ring=0;ring<rings;ring++)for(let i=0;i<samples;i++){
        const a=ring*samples+i,b=ring*samples+(i+1)%samples,c=a+samples,d=b+samples;
        if(back){if(ring)indices.push(a,d,b);indices.push(a,c,d);}else{if(ring)indices.push(a,b,d);indices.push(a,d,c);}
      }
      const g=geometry(positions,indices);
      if((g.attributes.normal.getZ(samples*3)<0)!==back){for(let i=0;i<g.index.count;i+=3)[g.index.array[i+1],g.index.array[i+2]]=[g.index.array[i+2],g.index.array[i+1]];g.computeVertexNormals();}
      mesh(name+(back?"Back":"Surface"),g,material,parent);
      if(!back&&options.art!==false){
        const decal=g.clone();decal.setAttribute("uv",new THREE.Float32BufferAttribute(uv,2));decal.translate(0,0,.002);
        let painted=art;
        if(options.fadeEdge){
          const colors=[];for(let i=0;i<decal.attributes.position.count;i++){const ring=Math.floor(i/samples);colors.push(1,1,1,ring===rings?0:ring===rings-1?.10:ring===rings-2?.65:1);}
          decal.setAttribute("color",new THREE.Float32BufferAttribute(colors,4));painted=art.clone();painted.vertexColors=true;painted.transparent=true;painted.alphaTest=0;painted.depthWrite=false;
        }
        mesh(name+"Artwork",decal,painted,parent);
      }
    }
  }
  function ellipse(cx,cy,rx,ry,n=24){return Array.from({length:n},(_,i)=>{const a=i/n*Math.PI*2;return[cx+Math.cos(a)*rx,cy+Math.sin(a)*ry];});}
  function projectArtwork(name,contour,center,pivot,parent,target){
    if(name==='OriginalFace'){
      const rx=Math.max(...contour.map(p=>Math.abs(p[0]-center[0]))),ry=Math.max(...contour.map(p=>Math.abs(p[1]-center[1])));
      (parent.userData.originalFaceRegions??=[]).push({cx:center[0],cy:center[1],rx,ry});
    }
    // Place every facial vertex on the actual opaque head surface. This avoids
    // an oval face disk hanging in front of a curved hood when seen sideways.
    const carriers=(Array.isArray(target)?target:[target]).map(surface=>{surface.updateMatrix();const m=new THREE.Mesh(surface.geometry.clone().applyMatrix4(surface.matrix),new THREE.MeshBasicMaterial({side:THREE.DoubleSide}));m.updateMatrixWorld(true);return m;});
    const ray=new THREE.Raycaster(),boundary=new THREE.CatmullRomCurve3(contour.map(([x,y])=>new THREE.Vector3(x,y,0)),true,"centripetal").getSpacedPoints(96).slice(0,96),P=[],UV=[],I=[];
    for(let ring=0;ring<=14;ring++)for(const edge of boundary){
      const px=center[0]+(edge.x-center[0])*ring/14,py=center[1]+(edge.y-center[1])*ring/14,x=(px-pivot[0])*S,y=(pivot[1]-py)*S;
      ray.set(new THREE.Vector3(x,y,5),new THREE.Vector3(0,0,-1));const hit=ray.intersectObjects(carriers,false)[0];
      if(!hit)throw new Error(name+" artwork lies outside its opaque head at "+px+","+py);
      P.push(x,y,hit.point.z+.004);UV.push(px/640,py/640);
    }
    for(let r=0;r<14;r++)for(let i=0;i<96;i++){const a=r*96+i,b=r*96+(i+1)%96,c=a+96,d=b+96;if(r)I.push(a,b,d);I.push(a,d,c);}
    const g=geometry(P,I,UV);if(g.attributes.normal.getZ(288)<0){for(let i=0;i<I.length;i+=3)[I[i+1],I[i+2]]=[I[i+2],I[i+1]];g.setIndex(I);g.computeVertexNormals();}
    carriers.forEach(m=>{m.geometry.dispose();m.material.dispose();});return mesh(name,g,art,parent);
  }
  function suit(parts,color){const m=solid("SuitColor",color);for(const [name,pivot,contour,center,depth,z] of parts){const g=group(name,pivot,z||0);volume(name+"Suit",contour,center,pivot,depth,depth,g,m,{samples:48,fadeEdge:true});}return m;}
  function finish(options={}){
    const clips=[];
    const channels=["Body","Head","LeftArm","RightArm","LeftLeg","RightLeg",...(options.rotor?["Rotor"]:[])];
    function make(name,duration,sample){const times=Array.from({length:49},(_,i)=>i/48*duration),tracks=[];
      for(const channel of channels){const values=[];for(const t of times)values.push(...new THREE.Quaternion().setFromEuler(new THREE.Euler(...(sample(t/duration*Math.PI*2)[channel]||[0,0,0]))).toArray());tracks.push(new THREE.QuaternionKeyframeTrack(channel+".quaternion",times,values));}
      const positions=[];for(const t of times)positions.push(0,sample(t/duration*Math.PI*2).bounce||0,0);tracks.push(new THREE.VectorKeyframeTrack("Body.position",times,positions));clips.push(new THREE.AnimationClip(name,duration,tracks));
    }
    make("Idle",3,a=>({bounce:(1-Math.cos(a))*.003}));
    make("Walk",1.1,a=>({LeftLeg:[Math.sin(a)*.36,0,0],RightLeg:[-Math.sin(a)*.36,0,0],LeftArm:options.holdLeft?[0,0,0]:[-Math.sin(a)*.25,0,0],RightArm:[Math.sin(a)*.25,0,0],Body:[.01,0,Math.sin(a)*.012],Head:[-.01,0,-Math.sin(a)*.012],Rotor:[0,a,0],bounce:.014+(1-Math.cos(a*2))*.009}));
    make("Wave",2,a=>({RightArm:[.02,0,1.8+Math.sin(a*2)*.18],bounce:(1-Math.cos(a))*.003}));
    root.userData={avatarKey:key+".webp",prototype:true,revision:1,authoring:options.authoring||"Individually shaped solid prop, original face artwork, rigid animated limbs"};
    return require("./ground-avatar.cjs")(THREE,{root,clips});
  }
  return{THREE,root,body,art,S,solid,mesh,group,ellipsoid,tube,geometry,volume,projectArtwork,ellipse,suit,finish};
};
