(function(root){
 'use strict';
 const rad=Math.PI/180;
 const specimens={basalt:{name:'현무암',columns:27,rows:43,seed:3421,fieldMM:6,texture:'세립질',environment:'지표 부근에서 빠르게 냉각'},granite:{name:'화강암',columns:5,rows:6,seed:9134,fieldMM:6,texture:'조립질',environment:'지하 깊은 곳에서 느리게 냉각'}};
 const photos=[
  {id:'fine',label:'A',file:'fine.webp',texture:'세립질 조직',scaleMM:1,scaleFraction:28.222/171.5027045,description:'작은 결정들이 촘촘하게 모여 있습니다.',environment:'지표 부근에서 빠르게 냉각되어 결정이 크게 자라지 못했습니다.'},
  {id:'coarse',label:'B',file:'coarse.webp',texture:'조립질 조직',scaleMM:1,scaleFraction:28.223/171.5027045,description:'비교적 큰 결정들이 서로 맞물려 있습니다.',environment:'지하 깊은 곳에서 천천히 냉각되어 결정이 자랄 시간이 길었습니다.'},
  {id:'porphyritic',label:'C',file:'porphyritic.webp',texture:'반상 조직',scaleMM:1,scaleFraction:28.222/171.5027045,description:'큰 반정과 그 주위의 작은 입자들이 함께 보입니다.',environment:'일부 결정이 먼저 크게 자란 뒤, 남은 마그마가 빠르게 냉각되었습니다.'},
  {id:'glass',label:'D',file:'glass.webp',texture:'유리질 조직',scaleMM:.5,scaleFraction:50.161/171.5027045,description:'대부분의 바탕에서 결정의 경계를 찾기 어렵습니다.',environment:'마그마가 매우 빠르게 냉각되어 대부분의 결정이 자라지 못했습니다.'}
 ];
 function random(seed){return()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
 function clip(poly,a,b,c){const out=[];for(let i=0;i<poly.length;i++){const p=poly[i],q=poly[(i+1)%poly.length],u=a*p[0]+b*p[1]-c,v=a*q[0]+b*q[1]-c;if(u<=0)out.push(p);if((u<=0)!==(v<=0)){const t=u/(u-v);out.push([p[0]+t*(q[0]-p[0]),p[1]+t*(q[1]-p[1])]);}}return out;}
 function grains(key){
  const s=specimens[key];if(!s)throw Error('Unknown specimen');const r=random(s.seed),points=[],W=900,H=900,dx=W/s.columns,dy=H/s.rows;
  for(let y=0;y<s.rows;y++)for(let x=0;x<s.columns;x++)points.push({x:(x+.18+.64*r())*dx-150,y:(y+.18+.64*r())*dy-150,col:x,row:y});
  return points.map((p,i)=>{let poly=[[-150,-150],[750,-150],[750,750],[-150,750]];
   for(const q of points){if(p===q||Math.abs(p.col-q.col)>3||Math.abs(p.row-q.row)>3)continue;poly=clip(poly,q.x-p.x,q.y-p.y,(q.x*q.x+q.y*q.y-p.x*p.x-p.y*p.y)/2);if(!poly.length)break;}
   const v=r(),kind=key==='basalt'?(v<.08?'opaque':v<.17?'glass':v<.76?'feldspar':'pyroxene'):(v<.04?'opaque':v<.39?'quartz':v<.86?'feldspar':'mica');
   // An authored fixed-thickness section: optical colour supports the apparatus,
   // not mineral identification or an absolute measured composition.
   const retardation=kind==='quartz'?155+r()*105:kind==='feldspar'?130+r()*150:kind==='mica'?600+r()*420:kind==='pyroxene'?440+r()*360:0;
   return {...p,id:i,poly,kind,orientation:r()*180,retardation,twin:r()>.5,cleavage:r()>.55};
  });
 }
 function intensity(g,angle,wavelength=550){if(g.kind==='opaque'||g.kind==='glass')return 0;return Math.sin(2*(angle+g.orientation)*rad)**2*Math.sin(Math.PI*g.retardation/wavelength)**2;}
 function color(g,angle,crossed,light=70){
  if(g.kind==='opaque')return '#080b10';let rgb;
  if(crossed)rgb=[650,530,460].map(w=>Math.pow(intensity(g,angle,w),1/2.2)*230);
  else if(g.kind==='mica'){const f=.7+.3*Math.cos((angle+g.orientation)*rad)**2;rgb=[167*f,112*f,60*f];}
  else rgb=g.kind==='pyroxene'?[191,207,157]:g.kind==='glass'?[211,207,191]:[232,230,217];
  return 'rgb('+rgb.map(v=>Math.round(v*light/85)).join(',')+')';
 }
 function ready(s){return s.mounted&&s.light>=30&&Math.abs(s.focus-50)<=5;}
 const api={specimens,photos,grains,intensity,color,ready};if(typeof module!=='undefined')module.exports=api;else root.scienceThinSections=api;
})(typeof window==='undefined'?globalThis:window);
