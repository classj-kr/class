"use strict";

// The source faces are painted, unlit artwork. Give the solid sides/back the
// same palette in both the bright lab and the warm, dim museum. Subtle baked
// normal shading preserves volume without lighting the texture twice.
module.exports=function illustrationMaterials(THREE,root){
  root.updateMatrixWorld(true);
  const materials=new Map();
  root.traverse(object=>{
    if(!object.isMesh||object.material.userData.originalTexture)return;
    const source=object.material;
    if(!materials.has(source)){
      const painted=new THREE.MeshBasicMaterial({color:source.color.clone(),vertexColors:true,side:source.side});
      painted.name=source.name;painted.toneMapped=false;
      painted.userData={...source.userData,paintedSolid:true};materials.set(source,painted);
    }
    object.material=materials.get(source);
    const geometry=object.geometry.clone(),normal=geometry.attributes.normal,colors=[];
    const matrix=new THREE.Matrix3().getNormalMatrix(object.matrixWorld),n=new THREE.Vector3();
    for(let i=0;i<normal.count;i++){
      n.fromBufferAttribute(normal,i).applyMatrix3(matrix).normalize();
      // Neutral, diffuse shading: no yellow/green light cast on pale flesh.
      const shade=source.userData.alreadyShaded?1:Math.min(1,.82+.20*n.y-.11*n.x+.06*Math.abs(n.z));
      const original=source.userData.preserveVertexColor&&geometry.attributes.color;
      colors.push(shade*(original?original.getX(i):1),shade*(original?original.getY(i):1),shade*(original?original.getZ(i):1));
    }
    geometry.setAttribute("color",new THREE.Float32BufferAttribute(colors,3));object.geometry=geometry;
  });
  root.userData.materialStyle="original palette with baked neutral shading";
};
