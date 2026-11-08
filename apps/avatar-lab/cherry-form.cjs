"use strict";

module.exports=function cherryForm(THREE,k,head){
 const sculpt=require('./sculpt-kit.cjs'),s=sculpt(THREE,k,head);
 s.parent.clear();
 const fruit=s.ellipsoid('CherryFruit',[320,437,0],[162,141,.70],'#cf3842');
 const p=fruit.geometry.attributes.position;
 for(let i=0;i<p.count;i++){
  const x=p.getX(i),y=p.getY(i),z=p.getZ(i);
  // Two round shoulders and a small stem hollow, not a flat cylindrical top.
  const hollow=.19*Math.exp(-(x*x/.12+z*z/.14))*Math.max(0,(y-.3)/.7);
  p.setY(i,y-hollow);
 }
 fruit.geometry.computeVertexNormals();s.paint();
 const sprig=k.group('CherrySprig',head.part.pivot,head.group.position.z);
 const t=sculpt(THREE,k,{group:sprig,part:{pivot:head.part.pivot}});
 t.sweep('CherryStem',[[320,331,0,10],[323,280,0,11],[339,205,0,10],[370,132,0,8],[426,66,0,5]],'#4e7d32');
 t.smoothOutline('CherryLeaf',[[397,96],[349,75],[300,78],[257,105],[225,154],[251,170],[300,173],[346,152],[378,125]],.075,'#759f3f',.035,.022);
 t.tube('LeafVein',[[233,154,.084],[291,119,.084],[344,105,.084],[392,105,.084]],.010,'#527d30');
 t.paint();
 // Pivot the entire painted sprig at its insertion into the fruit.
 const anchor=new THREE.Vector3(...t.point([320,329,0]));
 for(const child of sprig.children)child.position.sub(anchor);
 sprig.position.add(anchor);
 head.authoredFamily='produce';
};
