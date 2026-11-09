"use strict";
module.exports=function trophyCostume(T,k,id,parts){
 if(id!=='award-trophy')return false;
 const head=parts.get('Head'),sculpt=require('./sculpt-kit.cjs'),s=sculpt(T,k,head),shells=[];
 for(const[name,p]of parts)if(name!=='Head'){k.body.remove(p.group);parts.delete(name);}
 s.parent.clear();s.parent.userData.directSurfaceArtwork=true;s.parent.userData.artworkOcclusion=true;s.parent.userData.artworkOpaqueRegions=[{cx:319,cy:248,rx:115,ry:99}];
 const cup=s.lathe('TrophyRoundedCupSolid',[[394,0],[389,38],[373,68],[349,100],[315,128],[268,148],[216,159],[160,165],[100,168],[94,164],[100,156],[160,153],[215,147],[265,136],[309,116],[341,90],[364,60],[379,30],[382,0],[394,0]],'#ffc42b',0,{levels:160,segments:96});cup.userData.artworkFacingFade=[.18,.50];cup.userData.artworkHorizontalNormal=true;
 const rim=s.lathe('TrophyRolledRimSolid',[[101,168],[100,177],[94,181],[74,181],[65,176],[64,167],[69,162],[92,162],[99,166],[101,168]],'#f5b72c',0,{levels:64,segments:96});rim.userData.artworkFacingFade=[.12,.40];rim.userData.artworkHorizontalNormal=true;
 for(const side of [-1,1]){
  const ps=[[147,160,0,14],[142,135,0,15],[122,118,0,16],[98,122,0,16],[78,140,0,16],[72,172,0,16],[81,211,0,16],[103,245,0,15],[133,273,0,14],[165,296,0,14],[183,312,0,13],[182,329,0,14]].map(([x,y,z,r])=>[320+side*(320-x),y,z,r]);
  const handle=s.sweep('TrophyHandle'+side+'Solid',ps,'#f6b72c');handle.userData.artworkFacingFade=[.15,.48];shells.push([handle,s,'#a7621f',.013]);
  for(const[j,p]of [ps[0],ps.at(-1)].entries()){const cap=s.ellipsoid('TrophyHandleTip'+side+'_'+j,p.slice(0,3),[p[3],p[3],p[3]*.005],'#f6b72c');cap.userData.artworkFacingFade=[.15,.48];}
 }
 shells.push([cup,s,'#ad681d',.012],[rim,s,'#b16a1d',.010]);s.paint();
 function part(name,pivot){const v={part:{pivot},group:k.group(name,pivot),special:true};parts.set(name,v);v.group.userData.directSurfaceArtwork=true;return sculpt(T,k,v);}
 function volume(tool,name,ps,c,depth){k.volume(name+'Half',ps,c,tool.pivot,depth,depth,tool.parent,k.solid(name+'Color','#ffc037'),{art:false,samples:72});const P=[],I=[];for(const suffix of ['Surface','Back']){const o=tool.parent.getObjectByName(name+'Half'+suffix),n=P.length/3;P.push(...o.geometry.attributes.position.array);I.push(...Array.from(o.geometry.index.array,i=>i+n));tool.parent.remove(o);}const o=k.mesh(name,k.geometry(P,I),k.solid(name+'Color','#ffc037'),tool.parent);shells.push([o,tool,'#a96922',.012]);return o;}
 const torso=part('Torso',[320,443]),stem=torso.lathe('TrophyShortStemSolid',[[477,0],[477,83],[469,82],[452,61],[430,43],[410,37],[390,40],[387,0],[477,0]],'#f7b72c');stem.userData.artworkFacingFade=[.18,.5];
 const base=torso.box('TrophyWoodBaseSolid',[320,500,0],[208,54,.72],'#945831',9);base.userData.artworkFacingFade=[.15,.45];shells.push([base,torso,'#60391f',.012]);torso.paint();
 for(const side of [-1,1]){
  const mirror=ps=>ps.map(([x,y])=>[320+side*(320-x),y]);
  const arm=part(side<0?'LeftArm':'RightArm',[320+side*41,399]),sleeve=require('./rounded-contour-solid.cjs')(T,k,arm,'TrophySleeve'+side+'Solid',mirror([[279,388],[287,400],[282,420],[273,437],[252,450],[243,465],[230,468],[217,458],[209,443],[213,425],[230,408],[254,396]]),{front:.145,back:.145,color:'#ffc037',rounding:12});shells.push([sleeve,arm,'#a96922',.012]);arm.paint();
  const foot=part(side<0?'LeftLeg':'RightLeg',[320+side*36,525]);volume(foot,'TrophyFoot'+side+'Solid',mirror([[264,518],[300,519],[305,539],[304,559],[297,569],[281,575],[264,574],[257,568],[263,553],[268,540]]),[320+side*39,548],.18);foot.paint();
 }
 // Export a reversed-winding outline; glTF has no BackSide material mode.
 for(const[o,tool,color,width]of shells){o.updateMatrix();const g=o.geometry.clone().applyMatrix4(o.matrix),p=g.attributes.position,b=new T.Box3().setFromBufferAttribute(p),c=b.getCenter(new T.Vector3()),size=b.getSize(new T.Vector3()),f=1+width/(Math.max(size.x,size.y,size.z)/2),ix=g.index?g.index.array:Array.from({length:p.count},(_,i)=>i);if(!g.index)g.setIndex(ix);for(let i=0;i<p.count;i++)p.setXYZ(i,c.x+(p.getX(i)-c.x)*f,c.y+(p.getY(i)-c.y)*f,c.z+(p.getZ(i)-c.z)*f);for(let i=0;i<ix.length;i+=3)[ix[i+1],ix[i+2]]=[ix[i+2],ix[i+1]];g.setIndex(Array.from(ix));g.computeVertexNormals();const ink=k.mesh(o.name+'InkShell',g,k.solid(o.name+'Ink',color),tool.parent);ink.userData.skipOriginalPaint=true;ink.material.userData.alreadyShaded=true;}
 head.special=true;head.skipNeckJoin=true;head.lockToBody=true;return true;
};
