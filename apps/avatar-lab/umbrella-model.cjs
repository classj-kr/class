"use strict";
module.exports=function(THREE){
  const k=require("./model-kit.cjs")(THREE,"object-umbrella"),{solid,mesh,group,ellipsoid,volume,tube}=k;
  const blue=solid("RaincoatBlue","#729cbf"),skin=solid("FaceBase","#ffd1ad"),rib=solid("CanopyRib","#584750"),shaft=solid("UmbrellaShaft","#6d4940"),handle=solid("UmbrellaHandle","#824651");
  const head=group("Head",[319,327]);
  ellipsoid("RainHood",[.69,.54,.49],blue,head,[0,.01,0]);
  k.projectArtwork("OriginalFace",[[217,321],[224,283],[247,258],[278,244],[316,241],[351,248],[386,270],[409,301],[419,335],[406,367],[378,393],[341,410],[302,412],[264,399],[236,377],[219,351]],[317,330],[319,327],head,head.getObjectByName("RainHood"));
  // Eight thick fabric panels, ribs on their seams and a closed top cap.
  // Front +Z is yellow, viewer's left is red, right is blue.
  const colors=["#ffc832","#3779ad","#2a638f","#4b85ad","#e1b13f","#be3840","#bb2b39","#e3313b"].map((c,i)=>solid("CanopyPanelColor"+i,c));
  function point(t,r,inner=false){const radius=1.19*r,y=.33+.82*Math.sqrt(Math.max(0,1-r*r))+.085*Math.sin(t*Math.PI)*Math.pow(r,5);return[radius,y-(inner?.018:0)];}
  for(let panel=0;panel<8;panel++){
    const P=[],I=[],U=16,V=12;
    for(const inner of [false,true])for(let u=0;u<=U;u++)for(let v=0;v<=V;v++){
      const angle=(panel-.5+v/V)*Math.PI/4,[radius,y]=point(v/V,u/U,inner);P.push(Math.sin(angle)*radius,y,Math.cos(angle)*radius);
    }
    const layer=(U+1)*(V+1);
    for(let side=0;side<2;side++)for(let u=0;u<U;u++)for(let v=0;v<V;v++){
      const a=side*layer+u*(V+1)+v,b=a+V+1;
      if(side===0)I.push(a,a+1,b,a+1,b+1,b);else I.push(a,b,a+1,a+1,b,b+1);
    }
    for(let v=0;v<V;v++){const a=U*(V+1)+v,b=a+layer;I.push(a,b,a+1,a+1,b,b+1);}
    for(const v of [0,V])for(let u=0;u<U;u++){const a=u*(V+1)+v,b=a+V+1;if(v===0)I.push(a,b,a+layer,b,b+layer,a+layer);else I.push(a,a+layer,b,b,b+layer,a+layer);}
    for(let i=0;i<I.length;i+=3)[I[i+1],I[i+2]]=[I[i+2],I[i+1]];
    mesh("CanopyPanel"+panel,k.geometry(P,I),colors[panel],head);
    const points=[];for(let i=0;i<=18;i++){const [r,y]=point(0,i/18),a=(panel-.5)*Math.PI/4;points.push([Math.sin(a)*r,y+.005,Math.cos(a)*r]);}tube("CanopyRib"+panel,points,.012,rib,head);
    const hem=[];for(let i=0;i<=20;i++){const[r,y]=point(i/20,1),a=(panel-.5+i/20)*Math.PI/4;hem.push([Math.sin(a)*r,y,Math.cos(a)*r]);}tube("CanopyHem"+panel,hem,.012,rib,head);
  }
  mesh("CanopyTip",new THREE.CylinderGeometry(.04,.045,.14,16),shaft,head,[0,1.19,0]);
  // Mast is behind the face, then curves forward under the chin into the grip.
  tube("UmbrellaPole",[[0,1.15,-.12],[0,.50,-.12],[0,-.36,-.12],[0,-.57,.05],[0,-.58,.32]],.027,shaft,head);
  const held=group("HeldHandle",[319,463],.31);
  tube("HookHandle",[[0,.12,0],[0,-.10,0],[-.01,-.24,0],[-.10,-.29,0],[-.20,-.25,0],[-.21,-.15,0]],.045,handle,held);
  k.suit([
    ["Torso",[319,483],[[265,418],[294,430],[346,427],[371,416],[384,457],[381,496],[367,532],[330,548],[285,539],[264,508]], [321,480],.245,-.02],
    ["LeftArm",[266,438],[[253,429],[270,433],[289,450],[311,451],[324,456],[326,470],[315,479],[288,481],[263,479],[245,467]], [280,457],.115,.19],
    ["RightArm",[377,439],[[368,425],[387,434],[402,462],[414,483],[410,495],[394,499],[380,483],[373,465]], [392,463],.11,-.02],
    ["LeftLeg",[286,538],[[263,519],[303,534],[304,556],[298,577],[273,579],[263,568]], [284,552],.14,-.035],
    ["RightLeg",[350,538],[[329,532],[371,518],[371,548],[377,570],[368,580],[344,578],[333,562]], [352,550],.14,-.035]
  ],"#749fbd");
  // The left hand keeps holding the umbrella during Walk and Wave.
  return k.finish({holdLeft:true,authoring:"Eight solid scalloped canopy panels, ribs, mast and held curved handle; original face in blue rain hood"});
};
