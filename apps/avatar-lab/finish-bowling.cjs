"use strict";
module.exports=function(T,k,head,pin,hood,ball){
 for(const o of [...head.children])if(o.material?.userData.originalTexture)head.remove(o);
 const ink=require('./solid-ink-shell.cjs');
 for(const prefix of ['BowlingSuit','BowlingSuitFoot']){
  require('./smooth-paired-volume.cjs')(T,k,head,prefix,{rings:24});
  const P=[],I=[];let material;
  for(const suffix of ['Surface','Back']){const o=head.getObjectByName(prefix+suffix),offset=P.length/3;P.push(...o.geometry.attributes.position.array);I.push(...Array.from(o.geometry.index.array,v=>v+offset));material=o.material;head.remove(o);}
  const o=k.mesh(prefix+'Solid',k.geometry(P,I),material,head);o.userData.skipOriginalPaint=true;ink(T,k,o,'#9897a0',.007);
 }
 for(const o of head.children)if(o.isMesh)o.userData.artworkFacingFade=[.45,.80];
 pin.userData.skipOriginalPaint=true;
 // Keep the human face on its actual hood and fade only the costume perimeter.
 k.projectArtwork('OriginalFace',k.ellipse(380,280,101,87),[380,280],[320,580],head,hood);
 require('./project-model-artwork.cjs')(T,k,head,[320,580]);
 const ray=new T.Raycaster(),rim=[];hood.updateWorldMatrix(true,false);
 for(let i=0;i<=128;i++){const a=i/128*Math.PI*2,x=380+110*Math.cos(a),y=280+98*Math.sin(a);ray.set(new T.Vector3((x-320)*.005,(580-y)*.005,3),new T.Vector3(0,0,-1));const hit=ray.intersectObject(hood)[0];if(hit)rim.push([hit.point.x,hit.point.y,hit.point.z+.003]);}
 k.tube('BowlingHoodRim',rim,.014,k.solid('BowlingRimColor','#81818a'),head);
 ink(T,k,pin,'#8e8e99',.012);ink(T,k,hood,'#8e8e99',.008);ink(T,k,ball,'#44434c',.008);
};
