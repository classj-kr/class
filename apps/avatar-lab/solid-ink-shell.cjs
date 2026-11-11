"use strict";
// A reversed-winding shell survives GLB export without BackSide materials.
module.exports=function(T,k,mesh,color,width){
 mesh.updateMatrix();const g=mesh.geometry.clone().applyMatrix4(mesh.matrix),p=g.attributes.position,n=g.attributes.normal;
 for(let i=0;i<p.count;i++)p.setXYZ(i,p.getX(i)+n.getX(i)*width,p.getY(i)+n.getY(i)*width,p.getZ(i)+n.getZ(i)*width);
 const ix=g.index?Array.from(g.index.array):Array.from({length:p.count},(_,i)=>i);for(let i=0;i<ix.length;i+=3)[ix[i+1],ix[i+2]]=[ix[i+2],ix[i+1]];g.setIndex(ix);g.computeVertexNormals();g.deleteAttribute('color');
 const mat=k.solid(mesh.name+'OutlineColor',color);mat.userData.alreadyShaded=true;
 const shell=k.mesh(mesh.name+'InkShell',g,mat,mesh.parent);shell.userData.skipOriginalPaint=true;return shell;
};
