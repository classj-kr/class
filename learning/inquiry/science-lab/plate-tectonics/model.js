(function(root){
 'use strict';
 const wrap=v=>((v+180)%360+360)%360-180;
 const valid=(x,min,max)=>Number.isFinite(+x)?Math.max(min,Math.min(max,+x)):min;
 function filter(rows,{start=1980,end=2025,magnitude=6,cursor=end}={}){return rows.filter(r=>r.year>=start&&r.year<=Math.min(end,cursor)&&r.mag>=magnitude);}
 function projection(width,height,view={lon:180,lat:0,zoom:1}){
  const scale=Math.min(width/360,height/180)*view.zoom,latLimit=Math.max(0,90-height/(2*scale)),lat=valid(view.lat,-latLimit,latLimit);
  return {scale,lat,point:(lon,y)=>[width/2+wrap(lon-view.lon)*scale,height/2-(y-lat)*scale],inverse:(x,y)=>[wrap(view.lon+(x-width/2)/scale),lat-(y-height/2)/scale]};
 }
 function unroll(line){let prev;return line.map(([lon,lat])=>{let x=lon;if(prev!==undefined){while(x-prev>180)x-=360;while(x-prev< -180)x+=360;}prev=x;return[x,lat];});}
 const api={wrap,valid,filter,projection,unroll};if(typeof module!=='undefined')module.exports=api;root.ScienceTectonicData=api;
})(typeof globalThis!=='undefined'?globalThis:this);
