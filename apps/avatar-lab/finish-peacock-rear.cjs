"use strict";
// The costume fan repeats its feather print on the rear. Never project the
// human face or the body into the back of the fan.
module.exports=function(T,k,id,parts){
 if(id!=='animal-peacock')return;
 const fan=parts.get('PeacockTailFan'),shapes=require('./feature-feather-shapes.json').peacock;
 for(const mesh of fan.group.children.filter(o=>/^RoundedPeacockFeather\d+(Surface|Back)$/.test(o.name)))mesh.material.userData.alreadyShaded=true;
 for(const back of fan.group.children.filter(o=>/^RoundedPeacockFeather\d+Back$/.test(o.name))){
  const index=Number(back.name.match(/Feather(\d+)/)[1]),shape=shapes[index],root=new T.Vector2(320,483),tip=shape.outline.map(p=>new T.Vector2(...p)).reduce((a,b)=>a.distanceTo(root)>b.distanceTo(root)?a:b),length=tip.distanceTo(root);
  const g=back.geometry.clone(),p=g.attributes.position,n=g.attributes.normal,uv=[],C=[];
  for(let i=0;i<p.count;i++){
   const x=p.getX(i)/.005+fan.part.pivot[0],y=fan.part.pivot[1]-p.getY(i)/.005;
   let alpha=Math.max(0,Math.min(1,(-n.getZ(i)-.2)/.45));
   for(const f of back.userData.artworkExcludedRegions||[]){const r=Math.hypot((x-f.cx)/f.rx,(y-f.cy)/f.ry);alpha*=Math.max(0,Math.min(1,(r-1.08)/.16));}
   const t=Math.max(0,Math.min(1,(Math.hypot(x-root.x,y-root.y)/length-.55)/.18));alpha*=t*t*(3-2*t);
   uv.push(x/640,y/640);C.push(1,1,1,alpha);p.setZ(i,p.getZ(i)-.006);
  }
  g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setAttribute('color',new T.Float32BufferAttribute(C,4));
  const m=k.art.clone();m.vertexColors=true;m.transparent=true;m.alphaTest=0;m.depthWrite=false;
  const art=k.mesh(back.name+'RearFeatherPrint',g,m,fan.group);art.userData.rearFeatherPrint=true;
  const carrier=new T.Mesh(back.geometry,new T.MeshBasicMaterial({side:T.DoubleSide}));carrier.updateMatrixWorld(true);const line=[];
  for(let j=0;j<=24;j++){const t=.04+j/24*.67,x=root.x+(tip.x-root.x)*t,y=root.y+(tip.y-root.y)*t,px=(x-fan.part.pivot[0])*.005,py=(fan.part.pivot[1]-y)*.005,hit=new T.Raycaster(new T.Vector3(px,py,-3),new T.Vector3(0,0,1)).intersectObject(carrier)[0];if(hit)line.push([px,py,hit.point.z-.007]);}
  if(line.length>2){const rib=k.tube('PeacockRearFeatherShaft'+index,line,.007,k.solid('PeacockRearFeatherShaftColor','#287968'),fan.group);rib.material.userData.alreadyShaded=true;}carrier.material.dispose();
 }
};
