"use strict";
module.exports=function(id,head){
 if(id!=='food-bingsu')return;
 const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),root=path.resolve(__dirname,'../..');
 const data=JSON.parse(fs.readFileSync(path.join(root,'outputs/avatar-lab/mesh-source/food-bingsu-bean-mask.json'),'utf8'));
 const hash=crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'apps/classtools/assets/avatars/food-bingsu.webp'))).digest('hex');
 if(data.sourceSha256!==hash)throw new Error('Refresh the bingsu projection mask with python scripts/prepare-bingsu-bean-mask.py');
 const mask=Buffer.from(data.mask,'base64');
 head.group.traverse(o=>{if(!/^FrontBean\d+OriginalPaint$/.test(o.name))return;const uv=o.geometry.attributes.uv,c=o.geometry.attributes.color;for(let i=0;i<c.count;i++){const x=Math.max(0,Math.min(639,Math.round(uv.getX(i)*640))),y=Math.max(0,Math.min(639,Math.round(uv.getY(i)*640)));if(!mask[y*640+x])c.setW(i,0);}});
};
