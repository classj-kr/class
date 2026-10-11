(function(root){
 'use strict';
 const colors=[['빨강','#ff6659'],['주황','#ffae4a'],['노랑','#f7e65e'],['초록','#60e0a5'],['파랑','#50aaff'],['남색','#8083ff'],['보라','#c190ff']];
 // Snell refraction at both faces of the schematic triangular prism.
 function ray(color){
  const n=1.50+Math.max(0,Math.min(6,color))*.01,left=Math.atan(38/134),right=Math.atan(40/134);
  const inside=left-Math.asin(Math.sin(left)/n),entry={x:230-(134-90)*38/134,y:134};
  const k=40/134,x=(230+k*(entry.y-90)-k*Math.tan(inside)*entry.x)/(1-k*Math.tan(inside));
  const exit={x,y:entry.y+Math.tan(inside)*(x-entry.x)},angle=Math.asin(n*Math.sin(inside+right))-right;
  return {n,entry,exit,inside,angle,at:x=>exit.y+Math.tan(angle)*(x-exit.x)};
 }
 const sources={incandescent:{label:'백열전구 손전등',colors:[0,1,2,3,4,5,6]},rgb:{label:'빨강·초록·파랑 LED',colors:[0,3,4]}};
 const collectors={glass:{label:'반원 모양 유리',focus:70},lens:{label:'볼록 렌즈',focus:65},cup:{label:'물을 담은 둥근 컵',focus:80}};
 function result({mode='dispersion',color=0,screen=70,light=true,source='incandescent',collector='glass'}={}){
  if(!['dispersion','single','combine'].includes(mode))throw Error('Unknown optical arrangement');
  if(!sources[source]||!collectors[collector])throw Error('Unknown source or collector');
  // Relative positions in an ideal focusing diagram, not measured focal lengths.
  const selected=Math.max(0,Math.min(6,Math.round(Number(color)||0))),focus=collectors[collector].focus,available=sources[source].colors;
  return {mode,light,color:selected,source,collector,focus,screen:Number(screen),colors:!light?[]:mode==='single'?available.filter(i=>i===selected):available.slice(),white:light&&mode==='combine'&&Number(screen)===focus,spread:mode==='combine'?Math.abs(Number(screen)-focus):50};
 }
 const api={colors,sources,collectors,result,ray};if(typeof module!=='undefined')module.exports=api;else root.prismModel=api;
})(typeof window==='undefined'?globalThis:window);
