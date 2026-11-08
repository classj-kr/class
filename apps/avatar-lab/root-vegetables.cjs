"use strict";

module.exports=function rootVegetables(THREE,k,id,head){
 if(id!=='vegetable-radish')return false;
 const g=head.group,offset=g.position.clone();g.clear();
 const rootProfile=[[535,0],[524,15],[500,44],[470,71],[440,90],[410,106],[380,120],[345,130],[310,132],[275,127],[245,113],[224,88],[211,55],[207,0]];
 const curve=new THREE.CatmullRomCurve3(rootProfile.map(([y,r])=>new THREE.Vector3(r*.005,(580-y)*.005,0)));
 const geometry=new THREE.LatheGeometry(curve.getPoints(100).map(p=>new THREE.Vector2(Math.max(0,p.x),p.y)),64);
 const root=k.mesh('RadishRoot',geometry,k.solid('RadishIvory','#f4e8da'),g,[-offset.x,-offset.y,-offset.z]);
 k.projectArtwork('OriginalFace',k.ellipse(320,345,101,81),[320,345],head.part.pivot,g,root);
 require('./project-model-artwork.cjs')(THREE,k,g,head.part.pivot);
 const green=k.solid('RadishLeafGreen','#71993e'),vein=k.solid('RadishLeafVein','#426628');
 const leaves=[
  [[303,212],[273,194],[235,179],[221,156],[210,133],[222,110],[246,113],[272,134],[289,161]],
  [[300,213],[285,181],[281,155],[290,138],[281,113],[293,91],[304,70],[325,65],[341,80],[359,94],[357,120],[368,141],[351,163],[346,188],[335,212]],
  [[335,212],[354,170],[370,137],[392,110],[414,109],[427,128],[418,150],[406,174],[379,192],[351,211]]
 ];
 for(const [i,outline] of leaves.entries()){
  const center=[outline.reduce((s,p)=>s+p[0],0)/outline.length,outline.reduce((s,p)=>s+p[1],0)/outline.length];
  k.volume('RadishLeaf'+i,outline,center,head.part.pivot,.035,.035,g,green,{samples:64,fadeEdge:true});
  const path=i===0?[[305,212],[270,163],[235,129]]:i===1?[[318,212],[318,145],[323,91]]:[[338,212],[368,167],[399,132]];
  k.tube('RadishRearLeafVein'+i,path.map(([x,y])=>[(x-head.part.pivot[0])*.005,(head.part.pivot[1]-y)*.005,-.038]),.009,vein,g);
 }
 const skin=k.solid('RadishArms','#edddce');
 for(const [name,outline,center] of [
  ['Left',[[225,446],[213,471],[214,498],[226,505],[239,489],[239,470]],[225,478]],
  ['Right',[[402,447],[416,461],[428,489],[423,504],[410,499],[398,474]],[414,478]]
 ])k.volume('Radish'+name+'Arm',outline,center,head.part.pivot,.07,.07,g,skin,{samples:40,fadeEdge:true});
 head.special=true;return true;
};
