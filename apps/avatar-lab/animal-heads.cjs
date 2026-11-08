"use strict";
module.exports=function animalHeads(THREE,k,id,head){
 if(id!=='animal-crested-gecko')return false;
 const g=head.group,offset=g.position.clone();g.clear();
 const mat=k.solid('CrestedHoodBrown','#9b6034'),orange=k.solid('CrestedScales','#d68c3e');
 const geo=new THREE.SphereGeometry(1,64,40),p=geo.attributes.position;
 for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);p.setXYZ(i,.98*Math.sign(x)*Math.abs(x)**.74,.90*Math.sign(y)*Math.abs(y)**.86,.79*z);}
 geo.computeVertexNormals();
 const hood=k.mesh('CrestedGeckoHood',geo,mat,g,[-offset.x,1.65-offset.y,-offset.z]);
 for(const side of [-1,1]){
  k.ellipsoid('RaisedEyeBrow'+side,[.24,.29,.15],orange,g,[side*.61-offset.x,2.22-offset.y,.53-offset.z]);
  for(let i=0;i<6;i++){
   const a=.72+i*.20,x=side*.98*Math.sin(a),y=1.65+.90*Math.cos(a),z=.10;
   const root=new THREE.Vector3(x,y-1.65,z).normalize(),scale=k.mesh('CrestScale'+side+'_'+i,new THREE.ConeGeometry(.065,.15,12),orange,g,[x+root.x*.035-offset.x,y+root.y*.035-offset.y,z-offset.z]);scale.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),root);
  }
 }
 k.projectArtwork('OriginalFace',k.ellipse(320,335,130,87),[320,335],head.part.pivot,g,hood);
 require('./project-model-artwork.cjs')(THREE,k,g,head.part.pivot);
 hood.updateMatrix();head.shell={geometry:hood.geometry.clone().applyMatrix4(hood.matrix)};
 head.special=true;head.acceptPattern=true;return true;
};
