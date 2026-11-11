"use strict";
module.exports=function(T,k,id,parts){
 if(id!=='animal-turtle')return;
 const part=parts.get('TurtleShell'),back=part.group.getObjectByName('DomedTurtleShellBack');k.root.updateMatrixWorld(true);
 const hex=[[329,406],[378,411],[403,455],[380,502],[329,514],[299,458]],paths=[hex.concat([hex[0]])];
 for(const p of hex){const a=Math.atan2((p[1]-467)/96,(p[0]-351)/138);paths.push([p,[351+136*Math.cos(a),467+94*Math.sin(a)]]);}
 const fit=([x,y])=>{const origin=part.group.localToWorld(new T.Vector3((x-426)*.005,(465-y)*.005,-4)),hit=new T.Raycaster(origin,new T.Vector3(0,0,1)).intersectObject(back)[0];if(!hit)throw new Error('Turtle shell seam misses shell');return part.group.worldToLocal(hit.point.clone()).add(new T.Vector3(0,0,-.003)).toArray();};
 for(const [j,path]of paths.entries()){
  const points=[];for(let e=0;e<path.length-1;e++)for(let i=0;i<=20;i++){const t=i/20;points.push(fit([path[e][0]*(1-t)+path[e+1][0]*t,path[e][1]*(1-t)+path[e+1][1]*t]));}
  const seam=k.tube('TurtleShellSeam'+j,points,.009,k.solid('TurtleShellSeamColor','#205c23'),part.group);seam.userData.skipOriginalPaint=true;
 }
};
